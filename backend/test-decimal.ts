import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const b = await prisma.booking.findFirst();
    console.log(JSON.stringify(b?.totalPrice));
    const v = await prisma.vehicle.findFirst();
    console.log(JSON.stringify(v?.pricePerDay));
}
main();
