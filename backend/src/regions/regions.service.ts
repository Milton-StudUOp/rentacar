import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegionsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.region.findMany({
            orderBy: [{ province: 'asc' }, { city: 'asc' }],
        });
    }

    async getProvinces() {
        const regions = await this.prisma.region.findMany({
            select: { province: true },
            distinct: ['province'],
            orderBy: { province: 'asc' },
        });
        return regions.map((r) => r.province);
    }

    async findByProvince(province: string) {
        return this.prisma.region.findMany({
            where: { province },
            orderBy: { city: 'asc' },
        });
    }
}
