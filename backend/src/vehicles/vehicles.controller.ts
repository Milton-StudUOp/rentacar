import {
    Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('vehicles')
export class VehiclesController {
    constructor(private vehiclesService: VehiclesService) { }

    @Get()
    findAll(
        @Query('regionId') regionId?: number,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('category') category?: string,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.vehiclesService.findAll({
            regionId, startDate, endDate, category, minPrice, maxPrice, page, limit,
        });
    }

    @Get('categories')
    getCategories() {
        return this.vehiclesService.getCategories();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.vehiclesService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    create(@Body() body: any) {
        return this.vehiclesService.create(body);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        return this.vehiclesService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.vehiclesService.remove(id);
    }

    @Post(':id/images')
    @UseGuards(JwtAuthGuard, AdminGuard)
    addImage(
        @Param('id', ParseIntPipe) vehicleId: number,
        @Body() body: { url: string; isPrimary?: boolean },
    ) {
        return this.vehiclesService.addImage(vehicleId, body.url, body.isPrimary);
    }

    @Delete('images/:imageId')
    @UseGuards(JwtAuthGuard, AdminGuard)
    removeImage(@Param('imageId', ParseIntPipe) imageId: number) {
        return this.vehiclesService.removeImage(imageId);
    }

    @Get(':id/availability')
    getAvailability(
        @Param('id', ParseIntPipe) id: number,
        @Query('month') month?: number,
        @Query('year') year?: number,
    ) {
        return this.vehiclesService.getAvailability(id, month, year);
    }

    @Post(':id/availability')
    @UseGuards(JwtAuthGuard, AdminGuard)
    setAvailability(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
    ) {
        return this.vehiclesService.setAvailability(id, body);
    }

    @Post(':id/availability/bulk')
    @UseGuards(JwtAuthGuard, AdminGuard)
    bulkSetAvailability(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
    ) {
        return this.vehiclesService.bulkSetAvailability(id, body);
    }
}
