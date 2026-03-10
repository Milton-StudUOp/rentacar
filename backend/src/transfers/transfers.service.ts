import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransfersService {
    constructor(private prisma: PrismaService) { }

    async findAllServices(activeOnly = true) {
        return this.prisma.transferService.findMany({
            where: activeOnly ? { isActive: true } : {},
            include: { images: true },
            orderBy: { name: 'asc' },
        });
    }

    async findServiceById(id: number) {
        const service = await this.prisma.transferService.findUnique({
            where: { id },
            include: { images: true },
        });
        if (!service) throw new NotFoundException('Serviço de transfer não encontrado');
        return service;
    }

    async createService(data: {
        name: string;
        description?: string;
        vehicleType: string;
        capacity: number;
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

    async addImage(id: number, data: { url: string, isPrimary?: boolean }) {
        return this.prisma.transferServiceImage.create({
            data: {
                url: data.url,
                isPrimary: data.isPrimary || false,
                serviceId: id,
            }
        });
    }

    async deleteImage(imageId: number) {
        return this.prisma.transferServiceImage.delete({
            where: { id: imageId }
        });
    }

    async setPrimaryImage(id: number, imageId: number) {
        await this.prisma.transferServiceImage.updateMany({
            where: { serviceId: id },
            data: { isPrimary: false }
        });
        return this.prisma.transferServiceImage.update({
            where: { id: imageId },
            data: { isPrimary: true }
        });
    }

    async searchServices(passengers: number) {
        return this.prisma.transferService.findMany({
            where: {
                isActive: true,
                capacity: { gte: passengers },
            },
            include: { images: true },
            orderBy: { capacity: 'asc' },
        });
    }
}
