import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('dashboard')
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    @Get('kpis')
    @UseGuards(JwtAuthGuard, AdminGuard)
    getKpis(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        return this.dashboardService.getKpis(startDate, endDate);
    }
}
