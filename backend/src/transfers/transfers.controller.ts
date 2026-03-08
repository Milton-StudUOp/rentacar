import {
    Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('transfers')
export class TransfersController {
    constructor(private transfersService: TransfersService) { }

    // Public
    @Get('services')
    findAllServices() {
        return this.transfersService.findAllServices();
    }

    @Get('services/:id')
    findServiceById(@Param('id', ParseIntPipe) id: number) {
        return this.transfersService.findServiceById(id);
    }

    @Get('search')
    searchServices(@Query('passengers', ParseIntPipe) passengers: number) {
        return this.transfersService.searchServices(passengers);
    }

    // Admin
    @Post('services')
    @UseGuards(JwtAuthGuard, AdminGuard)
    createService(@Body() body: any) {
        return this.transfersService.createService(body);
    }

    @Put('services/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    updateService(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        return this.transfersService.updateService(id, body);
    }

    @Delete('services/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    deleteService(@Param('id', ParseIntPipe) id: number) {
        return this.transfersService.deleteService(id);
    }

}
