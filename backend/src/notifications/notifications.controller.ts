import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard, AdminGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    findAll() {
        return this.notificationsService.findAll();
    }

    @Get('unread-count')
    async getUnreadCount() {
        const count = await this.notificationsService.getUnreadCount();
        return { count };
    }

    @Patch('read-all')
    markAllAsRead() {
        return this.notificationsService.markAllAsRead();
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.notificationsService.markAsRead(+id);
    }
}
