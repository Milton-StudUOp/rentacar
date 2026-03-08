import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const conflicting = await prisma.vehicleBooking.findMany({
        where: {
            vehicleId: 1, // assuming Mercedes is 1 or something, maybe find all
        },
        include: { booking: true }
    });

    console.log(JSON.stringify(conflicting, null, 2));

    const blocked = await prisma.vehicleAvailability.findMany({
        where: {
            vehicleId: 1,
            status: { not: 'AVAILABLE' }
        }
    });

    console.log("BLOCKED DATES:");
    console.log(JSON.stringify(blocked, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
