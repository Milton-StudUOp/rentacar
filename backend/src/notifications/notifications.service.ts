import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async createNotification(title: string, message: string, type: string) {
        return this.prisma.notification.create({
            data: { title, message, type },
        });
    }

    async findAll() {
        return this.prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }

    async getUnreadCount() {
        return this.prisma.notification.count({
            where: { isRead: false },
        });
    }

    async markAsRead(id: number) {
        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }

    async markAllAsRead() {
        return this.prisma.notification.updateMany({
            where: { isRead: false },
            data: { isRead: true },
        });
    }
}
