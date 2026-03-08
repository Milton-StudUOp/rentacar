import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BookingStatus, BookingType, AvailabilityStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService, private notifications: NotificationsService) { }

    async createVehicleBooking(userId: number, data: {
        vehicleId: number;
        startDate: string;
        endDate: string;
        notes?: string;
    }) {
        const vehicle = await this.prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
        if (!vehicle) throw new NotFoundException('Viatura não encontrada');

        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        if (startDate >= endDate) throw new BadRequestException('Data de início deve ser anterior à data de fim');

        // Only DELIVERED bookings block dates (vehicle is physically with the client)
        const conflicting = await this.prisma.vehicleBooking.findFirst({
            where: {
                vehicleId: data.vehicleId,
                booking: { status: BookingStatus.DELIVERED },
                OR: [
                    { startDate: { lte: endDate }, endDate: { gte: startDate } },
                ],
            },
        });
        if (conflicting) throw new BadRequestException('Viatura não disponível para as datas selecionadas');

        // Check availability status
        const blockedDays = await this.prisma.vehicleAvailability.findFirst({
            where: {
                vehicleId: data.vehicleId,
                date: { gte: startDate, lte: endDate },
                status: { not: AvailabilityStatus.AVAILABLE },
            },
        });
        if (blockedDays) throw new BadRequestException('Viatura tem dias bloqueados no período selecionado');

        // Calculate total price
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = Number(vehicle.pricePerDay) * days;

        const booking = await this.prisma.booking.create({
            data: {
                userId,
                type: BookingType.VEHICLE,
                totalPrice,
                notes: data.notes,
                vehicleBooking: {
                    create: {
                        vehicleId: data.vehicleId,
                        startDate,
                        endDate,
                    },
                },
            },
            include: {
                vehicleBooking: { include: { vehicle: { include: { images: true } } } },
                user: { select: { id: true, name: true, email: true, phone: true } },
            },
        });

        await this.notifications.createNotification(
            'Nova Reserva de Viatura',
            `O cliente ${booking.user.name} efetuou uma reserva para o veículo ${booking.vehicleBooking?.vehicle.brand} ${booking.vehicleBooking?.vehicle.model}. (Reserva #${booking.id})`,
            'NEW_BOOKING'
        );

        return booking;
    }

    async createTransferBooking(userId: number, data: {
        serviceId: number;
        origin: string;
        destination: string;
        travelDate: string;
        travelTime: string;
        passengers: number;
        isRoundTrip?: boolean;
        returnDate?: string;
        returnTime?: string;
        notes?: string;
    }) {
        const service = await this.prisma.transferService.findUnique({
            where: { id: data.serviceId },
        });
        if (!service) throw new NotFoundException('Serviço de transfer não encontrado');

        if (data.passengers > service.capacity) {
            throw new BadRequestException(`Capacidade máxima: ${service.capacity} passageiros`);
        }

        const booking = await this.prisma.booking.create({
            data: {
                userId,
                type: BookingType.TRANSFER,
                totalPrice: 0, // Price is defined later by admin
                notes: data.notes,
                transferBooking: {
                    create: {
                        serviceId: data.serviceId,
                        origin: data.origin,
                        destination: data.destination,
                        travelDate: new Date(data.travelDate),
                        travelTime: data.travelTime,
                        passengers: data.passengers,
                        isRoundTrip: data.isRoundTrip || false,
                        returnDate: data.returnDate ? new Date(data.returnDate) : null,
                        returnTime: data.returnTime || null,
                    },
                },
            },
            include: {
                transferBooking: { include: { service: true } },
                user: { select: { id: true, name: true, email: true, phone: true } },
            },
        }) as any;

        await this.notifications.createNotification(
            'Nova Reserva de Transfer',
            `O cliente ${booking.user.name} solicitou um transfer (${booking.transferBooking?.origin} → ${booking.transferBooking?.destination}). (Reserva #${booking.id})`,
            'NEW_BOOKING'
        );

        return booking;
    }

    async findAllAdmin(query: {
        status?: BookingStatus;
        statuses?: string; // Comma separated list of statuses
        type?: BookingType;
        startDate?: string;
        endDate?: string;
        sortBy?: string;
        page?: number;
        limit?: number;
    }) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const { status, statuses, type, startDate, endDate, sortBy } = query;
        const where: any = {};

        // Status Filtering
        if (statuses) {
            const statusArray = statuses.split(',').filter(Boolean);
            if (statusArray.length > 0) {
                where.status = { in: statusArray };
            }
        } else if (status) {
            where.status = status;
        }

        // Type Filtering
        if (type) where.type = type;

        // Date Filtering
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
            }
        }

        // Sorting Logic
        let orderBy: any = { createdAt: 'desc' }; // Default
        if (sortBy === 'oldest') {
            orderBy = { createdAt: 'asc' };
        } else if (sortBy === 'highest_value') {
            orderBy = { totalPrice: 'desc' };
        } else if (sortBy === 'lowest_value') {
            orderBy = { totalPrice: 'asc' };
        }

        const [bookings, total] = await Promise.all([
            this.prisma.booking.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true, phone: true } },
                    vehicleBooking: { include: { vehicle: { include: { images: true } } } },
                    transferBooking: { include: { service: true } },
                    payment: true,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy,
            }),
            this.prisma.booking.count({ where }),
        ]);

        return {
            data: bookings,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async setTransferPrice(id: number, price: number) {
        const booking = await this.findOne(id);
        if (booking.type !== BookingType.TRANSFER) {
            throw new BadRequestException('Apenas reservas de transfer podem ter o preço redefinido.');
        }

        return this.prisma.booking.update({
            where: { id },
            data: { totalPrice: price },
            include: { user: { select: { id: true, name: true, email: true, phone: true } } }
        });
    }

    async findByUser(userId: number, options?: { archived?: boolean }) {
        const fetchArchived = options?.archived ?? false;
        const bookings = await this.prisma.booking.findMany({
            where: { userId, clientArchived: fetchArchived },
            include: {
                vehicleBooking: { include: { vehicle: { include: { images: true } } } },
                transferBooking: { include: { service: true } },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Auto-generate missing payment records for CONFIRMED+ bookings (legacy data fix)
        for (const booking of bookings) {
            if (!(booking as any).payment && ['CONFIRMED', 'PAID', 'DELIVERED'].includes(booking.status)) {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let ref = '';
                for (let i = 0; i < 7; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
                const payment = await this.prisma.payment.create({
                    data: {
                        bookingId: booking.id,
                        amount: booking.totalPrice,
                        method: 'BANK_TRANSFER',
                        status: booking.status === 'CONFIRMED' ? 'PENDING' : 'PAID',
                        reference: ref,
                    }
                });
                (booking as any).payment = payment;
            }
        }

        return bookings;
    }

    async archiveBookingForClient(bookingId: number, userId: number) {
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) throw new NotFoundException('Reserva não encontrada');
        if (booking.userId !== userId) throw new BadRequestException('Acesso negado');

        return this.prisma.booking.update({
            where: { id: bookingId },
            data: { clientArchived: true }
        });
    }

    async rateBooking(bookingId: number, userId: number, rating: number, comment?: string) {
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) throw new NotFoundException('Reserva não encontrada');
        if (booking.userId !== userId) throw new BadRequestException('Acesso negado');
        if (booking.status !== BookingStatus.COMPLETED) {
            throw new BadRequestException('Apenas reservas concluídas podem ser avaliadas');
        }

        return this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                rating,
                ratingComment: comment,
                clientArchived: true // Automatically hide from client list after rating
            }
        });
    }

    async markPaid(bookingId: number, userId: number) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { payment: true },
        });

        if (!booking) throw new BadRequestException('Reserva não encontrada');
        if (booking.userId !== userId) throw new BadRequestException('Acesso negado');
        if (booking.status !== BookingStatus.CONFIRMED) {
            throw new BadRequestException('Esta reserva não está no estado correcto para marcar como paga');
        }

        // Update or create payment record
        if (booking.payment) {
            await this.prisma.payment.update({
                where: { id: booking.payment.id },
                data: { status: 'PAID', paidAt: new Date() },
            });
        } else {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let ref = '';
            for (let i = 0; i < 7; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
            await this.prisma.payment.create({
                data: {
                    bookingId,
                    amount: booking.totalPrice,
                    method: 'BANK_TRANSFER',
                    status: 'PAID',
                    reference: ref,
                    paidAt: new Date(),
                },
            });
        }

        return this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.PAID },
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                vehicleBooking: { include: { vehicle: { include: { images: true } } } },
                payment: true,
            },
        });
    }

    async findOne(id: number) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                vehicleBooking: { include: { vehicle: { include: { images: true } } } },
                transferBooking: { include: { service: true } },
                payment: true,
            },
        });
        if (!booking) throw new NotFoundException('Reserva não encontrada');
        return booking;
    }

    async updateStatus(id: number, status: BookingStatus) {
        const booking = await this.findOne(id);

        // === Generate Payment Reference when admin CONFIRMS a PENDING booking ===
        if (status === BookingStatus.CONFIRMED && booking.status === BookingStatus.PENDING) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let ref = '';
            for (let i = 0; i < 7; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
            await this.prisma.payment.create({
                data: {
                    bookingId: id,
                    amount: booking.totalPrice,
                    method: 'BANK_TRANSFER',
                    status: 'PENDING',
                    reference: ref
                }
            });
        }

        // === Client marks as PAID: record the timestamp ===
        if (status === BookingStatus.PAID && booking.status === BookingStatus.CONFIRMED && (booking as any).payment) {
            await this.prisma.payment.update({
                where: { id: (booking as any).payment.id },
                data: { status: 'PAID', paidAt: new Date() }
            });
        }

        // === Admin REJECTS payment (PAID → CONFIRMED): revert payment status ===
        if (status === BookingStatus.CONFIRMED && booking.status === BookingStatus.PAID && (booking as any).payment) {
            await this.prisma.payment.update({
                where: { id: (booking as any).payment.id },
                data: { status: 'PENDING', paidAt: null }
            });
        }

        // === Admin CONFIRMS payment (PAID → AWAITING_DELIVERY): mark payment confirmed ===
        if (status === BookingStatus.AWAITING_DELIVERY && booking.status === BookingStatus.PAID && (booking as any).payment) {
            await this.prisma.payment.update({
                where: { id: (booking as any).payment.id },
                data: { status: 'CONFIRMED' }
            });
        }

        // === Admin DELIVERS vehicle (AWAITING_DELIVERY → DELIVERED): BLOCK calendar dates ===
        if (status === BookingStatus.DELIVERED && (booking as any).vehicleBooking) {
            const { vehicleId, startDate, endDate } = (booking as any).vehicleBooking;
            const start = new Date(startDate);
            const end = new Date(endDate);
            const current = new Date(start);

            while (current <= end) {
                await this.prisma.vehicleAvailability.upsert({
                    where: { vehicleId_date: { vehicleId, date: new Date(current) } },
                    update: { status: AvailabilityStatus.BLOCKED, reason: `Reserva #${id}` },
                    create: { vehicleId, date: new Date(current), status: AvailabilityStatus.BLOCKED, reason: `Reserva #${id}` },
                });
                current.setDate(current.getDate() + 1);
            }
        }

        // === CANCELLED or COMPLETED: UNBLOCK calendar dates ===
        if ((status === BookingStatus.CANCELLED || status === BookingStatus.COMPLETED) && (booking as any).vehicleBooking) {
            const { vehicleId, startDate, endDate } = (booking as any).vehicleBooking;
            await this.prisma.vehicleAvailability.updateMany({
                where: {
                    vehicleId,
                    date: { gte: new Date(startDate), lte: new Date(endDate) },
                    reason: `Reserva #${id}`,
                },
                data: { status: AvailabilityStatus.AVAILABLE, reason: null },
            });
        }

        return this.prisma.booking.update({
            where: { id },
            data: { status },
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                vehicleBooking: { include: { vehicle: { include: { images: true } } } },
                transferBooking: { include: { service: true } },
                payment: true,
            },
        });
    }

    async cancelBooking(id: number, userId: number, isAdmin: boolean) {
        const booking = await this.findOne(id);

        if (!isAdmin && booking.userId !== userId) {
            throw new ForbiddenException('Não autorizado a cancelar esta reserva');
        }

        if (booking.status === BookingStatus.CANCELLED) {
            throw new BadRequestException('Reserva já cancelada');
        }

        return this.updateStatus(id, BookingStatus.CANCELLED);
    }

    async uploadReceipt(id: number, userId: number, receiptUrl: string) {
        const booking = await this.findOne(id);

        if (booking.userId !== userId) {
            throw new ForbiddenException('Não autorizado a enviar comprovativo para esta reserva');
        }

        if (booking.status !== BookingStatus.CONFIRMED) {
            throw new BadRequestException('Não é possível anexar comprovativo neste estado da reserva.');
        }

        if (!(booking as any).payment) {
            throw new BadRequestException('Esta reserva não tem registo de pagamento associado.');
        }

        const payment = await this.prisma.payment.update({
            where: { id: (booking as any).payment.id },
            data: { receiptUrl },
        });

        await this.notifications.createNotification(
            'Novo Comprovativo de Pagamento',
            `O cliente ${(booking as any).user.name} enviou o comprovativo de pagamento para a reserva #${booking.id}`,
            'PAYMENT_RECEIPT'
        );

        return payment;
    }
}
