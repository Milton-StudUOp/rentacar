import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.notification.create({
        data: {
            title: 'Nova Reserva de Viatura Teste',
            message: 'O cliente João Silva efetuou uma reserva para o veículo BMW X5 (Reserva #999)',
            type: 'NEW_BOOKING'
        }
    });
    console.log("Notification injected!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
