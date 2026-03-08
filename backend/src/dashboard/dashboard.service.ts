import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, BookingType } from '@prisma/client';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getKpis(startDate?: string, endDate?: string) {
        // Build date filter — defaults to current month
        let dateFilter: { createdAt?: { gte: Date; lte: Date } } = {};

        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
                },
            };
        } else {
            // Default: current month
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            dateFilter = { createdAt: { gte: firstDay, lte: lastDay } };
        }

        const [
            totalBookings,
            pendingBookings,
            confirmedBookings,
            paidBookings,
            awaitingDeliveryBookings,
            deliveredBookings,
            completedBookings,
            cancelledBookings,
            totalVehicles,
            totalClients,
            totalRevenue,
            recentBookings,
            vehicleBookings,
            transferBookings,
            globalPendingBookings,
        ] = await Promise.all([
            this.prisma.booking.count({ where: dateFilter }),
            this.prisma.booking.count({ where: { status: BookingStatus.PENDING, ...dateFilter } }),
            this.prisma.booking.count({ where: { status: BookingStatus.CONFIRMED, ...dateFilter } }),
            this.prisma.booking.count({ where: { status: BookingStatus.PAID, ...dateFilter } }),
            this.prisma.booking.count({ where: { status: BookingStatus.AWAITING_DELIVERY, ...dateFilter } }),
            this.prisma.booking.count({ where: { status: BookingStatus.DELIVERED, ...dateFilter } }),
            this.prisma.booking.count({ where: { status: BookingStatus.COMPLETED, ...dateFilter } }),
            this.prisma.booking.count({ where: { status: BookingStatus.CANCELLED, ...dateFilter } }),
            this.prisma.vehicle.count({ where: { isActive: true } }),
            this.prisma.user.count({ where: { role: 'CLIENT' } }),
            this.prisma.booking.aggregate({
                _sum: { totalPrice: true },
                where: { status: { in: [BookingStatus.CONFIRMED, BookingStatus.PAID, BookingStatus.AWAITING_DELIVERY, BookingStatus.DELIVERED, BookingStatus.COMPLETED] }, ...dateFilter },
            }),
            this.prisma.booking.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                where: dateFilter,
                include: {
                    user: { select: { name: true, email: true } },
                    vehicleBooking: { include: { vehicle: { include: { images: true } } } },
                    transferBooking: { select: { origin: true, destination: true } },
                },
            }),
            this.prisma.booking.count({ where: { type: BookingType.VEHICLE, ...dateFilter } }),
            this.prisma.booking.count({ where: { type: BookingType.TRANSFER, ...dateFilter } }),
            this.prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
        ]);

        return {
            totalBookings,
            pendingBookings,
            confirmedBookings,
            paidBookings,
            awaitingDeliveryBookings,
            deliveredBookings,
            completedBookings,
            cancelledBookings,
            totalVehicles,
            totalClients,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            recentBookings,
            bookingsByType: { vehicle: vehicleBookings, transfer: transferBookings },
            globalPendingBookings,
        };
    }
}
