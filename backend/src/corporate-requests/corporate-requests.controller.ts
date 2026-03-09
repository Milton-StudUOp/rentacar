import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CorporateRequestsService } from './corporate-requests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('corporate-requests')
export class CorporateRequestsController {
    constructor(private readonly corporateRequestsService: CorporateRequestsService) { }

    @Post()
    create(@Body() body: any) {
        return this.corporateRequestsService.createRequest(body);
    }

    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    findAll() {
        return this.corporateRequestsService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.corporateRequestsService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: { status: any, notes?: string }) {
        return this.corporateRequestsService.updateStatus(id, body.status, body.notes);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    deleteRequest(@Param('id', ParseIntPipe) id: number) {
        return this.corporateRequestsService.deleteRequest(id);
    }
}
