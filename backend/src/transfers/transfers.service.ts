import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransfersService {
    constructor(private prisma: PrismaService) { }

    async findAllServices(activeOnly = true) {
        return this.prisma.transferService.findMany({
            where: activeOnly ? { isActive: true } : {},
            orderBy: { name: 'asc' },
        });
    }

    async findServiceById(id: number) {
        const service = await this.prisma.transferService.findUnique({
            where: { id },
        });
        if (!service) throw new NotFoundException('Serviço de transfer não encontrado');
        return service;
    }

    async createService(data: {
        name: string;
        description?: string;
        vehicleType: string;
        capacity: number;
        imageUrl?: string;
    }) {
        return this.prisma.transferService.create({ data });
    }

    async updateService(id: number, data: any) {
        await this.findServiceById(id);
        return this.prisma.transferService.update({ where: { id }, data });
    }

    async deleteService(id: number) {
        await this.findServiceById(id);
        await this.prisma.transferService.delete({ where: { id } });
        return { message: 'Serviço removido com sucesso' };
    }

    async searchServices(passengers: number) {
        return this.prisma.transferService.findMany({
            where: {
                isActive: true,
                capacity: { gte: passengers },
            },
            orderBy: { capacity: 'asc' },
        });
    }
}
