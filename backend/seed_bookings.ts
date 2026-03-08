import { PrismaClient, BookingStatus, BookingType, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
    const vehicle = await prisma.vehicle.findFirst();

    if (!user || !vehicle) {
        console.error("Missing user or vehicle");
        return;
    }

    // 1. Pending Booking
    await prisma.booking.create({
        data: {
            userId: user.id,
            type: BookingType.VEHICLE,
            status: BookingStatus.PENDING,
            totalPrice: vehicle.pricePerDay,
            vehicleBooking: {
                create: {
                    vehicleId: vehicle.id,
                    startDate: new Date('2026-04-10'),
                    endDate: new Date('2026-04-12'),
                }
            }
        }
    });

    // 2. Confirmed Booking (Requires Payment Setup)
    const confirmed = await prisma.booking.create({
        data: {
            userId: user.id,
            type: BookingType.VEHICLE,
            status: BookingStatus.CONFIRMED,
            totalPrice: vehicle.pricePerDay.mul(2),
            vehicleBooking: {
                create: {
                    vehicleId: vehicle.id,
                    startDate: new Date('2026-04-20'),
                    endDate: new Date('2026-04-22'),
                }
            },
            payment: {
                create: {
                    amount: new Prisma.Decimal(Number(vehicle.pricePerDay) * 2),
                    method: 'BANK_TRANSFER',
                    status: 'PENDING',
                    reference: 'REF-888999'
                }
            }
        }
    });

    // 3. Paid Booking
    await prisma.booking.create({
        data: {
            userId: user.id,
            type: BookingType.VEHICLE,
            status: BookingStatus.PAID,
            totalPrice: vehicle.pricePerDay * Number(3),
            vehicleBooking: {
                create: {
                    vehicleId: vehicle.id,
                    startDate: new Date('2026-05-01'),
                    endDate: new Date('2026-05-04'),
                }
            },
            payment: {
                create: {
                    amount: new Prisma.Decimal(Number(vehicle.pricePerDay) * 3),
                    method: 'BANK_TRANSFER',
                    status: 'PAID',
                    reference: 'REF-111222',
                    paidAt: new Date()
                }
            }
        }
    });

    // 4. Delivered Booking
    await prisma.booking.create({
        data: {
            userId: user.id,
            type: BookingType.VEHICLE,
            status: BookingStatus.DELIVERED,
            totalPrice: vehicle.pricePerDay.mul(4),
            vehicleBooking: {
                create: {
                    vehicleId: vehicle.id,
                    startDate: new Date('2026-05-10'),
                    endDate: new Date('2026-05-14'),
                }
            },
            payment: {
                create: {
                    amount: new Prisma.Decimal(Number(vehicle.pricePerDay) * 4),
                    method: 'BANK_TRANSFER',
                    status: 'PAID',
                    reference: 'REF-333444',
                    paidAt: new Date()
                }
            }
        }
    });

    console.log("Successfully seeded test bookings for various lifecycle states.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
