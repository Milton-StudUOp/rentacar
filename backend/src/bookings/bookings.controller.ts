import {
    Controller, Get, Post, Put, Param, Query, Body, UseGuards, Req, ParseIntPipe,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService: BookingsService) { }

    @Post('vehicle')
    @UseGuards(JwtAuthGuard)
    createVehicleBooking(@Req() req: any, @Body() body: any) {
        return this.bookingsService.createVehicleBooking(req.user.sub, body);
    }

    @Post('transfer')
    @UseGuards(JwtAuthGuard)
    createTransferBooking(@Req() req: any, @Body() body: any) {
        return this.bookingsService.createTransferBooking(req.user.sub, body);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    findMyBookings(@Req() req: any, @Query('archived') archived?: string) {
        return this.bookingsService.findByUser(req.user.sub, { archived: archived === 'true' });
    }

    @Get('admin')
    @UseGuards(JwtAuthGuard, AdminGuard)
    findAllAdmin(
        @Query('status') status?: any,
        @Query('statuses') statuses?: string,
        @Query('type') type?: any,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('sortBy') sortBy?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.bookingsService.findAllAdmin({
            status,
            statuses,
            type,
            startDate,
            endDate,
            sortBy,
            page,
            limit
        });
    }

    @Put(':id/price')
    @UseGuards(JwtAuthGuard, AdminGuard)
    setTransferPrice(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { price: number },
    ) {
        return this.bookingsService.setTransferPrice(id, body.price);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bookingsService.findOne(id);
    }

    @Put(':id/rate')
    @UseGuards(JwtAuthGuard)
    rateBooking(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
        @Body('rating') rating: number,
        @Body('comment') comment?: string,
    ) {
        return this.bookingsService.rateBooking(id, req.user.sub, rating, comment);
    }

    @Put(':id/archive')
    @UseGuards(JwtAuthGuard)
    archiveBooking(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.bookingsService.archiveBookingForClient(id, req.user.sub);
    }

    @Post(':id/receipt')
    @UseGuards(JwtAuthGuard)
    uploadReceipt(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
        @Body('receiptUrl') receiptUrl: string,
    ) {
        return this.bookingsService.uploadReceipt(id, req.user.sub, receiptUrl);
    }

    @Put(':id/mark-paid')
    @UseGuards(JwtAuthGuard)
    markPaid(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.bookingsService.markPaid(id, req.user.sub);
    }

    @Put(':id/status')
    @UseGuards(JwtAuthGuard, AdminGuard)
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: any,
    ) {
        return this.bookingsService.updateStatus(id, status);
    }

    @Put(':id/cancel')
    @UseGuards(JwtAuthGuard)
    cancelBooking(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.bookingsService.cancelBooking(id, req.user.sub, req.user.role === 'ADMIN');
    }
}
