import { Controller, Get, Param } from '@nestjs/common';
import { RegionsService } from './regions.service';

@Controller('regions')
export class RegionsController {
    constructor(private regionsService: RegionsService) { }

    @Get()
    findAll() {
        return this.regionsService.findAll();
    }

    @Get('provinces')
    getProvinces() {
        return this.regionsService.getProvinces();
    }

    @Get('province/:province')
    findByProvince(@Param('province') province: string) {
        return this.regionsService.findByProvince(province);
    }
}
