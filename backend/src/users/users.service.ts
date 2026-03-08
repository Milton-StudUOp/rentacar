import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAllClients() {
        const users = await this.prisma.user.findMany({
            where: { role: Role.CLIENT },
            include: {
                bookings: {
                    select: {
                        status: true,
                        totalPrice: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate total spent directly in the backend for convenience
        return users.map(user => {
            let totalSpent = 0;
            user.bookings.forEach(b => {
                if (['CONFIRMED', 'COMPLETED', 'PAID', 'AWAITING_DELIVERY', 'DELIVERED'].includes(b.status)) {
                    totalSpent += Number(b.totalPrice);
                }
            });
            return {
                ...user,
                totalSpent,
                // Remove password from response for security
                password: undefined
            };
        });
    }
}
