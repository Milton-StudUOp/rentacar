import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityStatus } from '@prisma/client';

@Injectable()
export class VehiclesService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: {
        regionId?: number;
        startDate?: string;
        endDate?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        page?: number;
        limit?: number;
    }) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 12;
        const { regionId, startDate, endDate, category, minPrice, maxPrice } = query;
        const skip = (page - 1) * limit;

        const where: any = { isActive: true };

        if (category) {
            where.category = category;
        }

        if (minPrice || maxPrice) {
            where.pricePerDay = {};
            if (minPrice) where.pricePerDay.gte = minPrice;
            if (maxPrice) where.pricePerDay.lte = maxPrice;
        }

        if (regionId) {
            where.regions = { some: { regionId: Number(regionId) } };
        }

        // Filter vehicles that are available in the date range
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            where.availability = {
                some: {
                    date: { gte: start, lte: end },
                    status: AvailabilityStatus.AVAILABLE,
                },
            };
            // Also ensure no BLOCKED days in range
            where.NOT = {
                availability: {
                    some: {
                        date: { gte: start, lte: end },
                        status: { not: AvailabilityStatus.AVAILABLE },
                    },
                },
            };
        }

        const [vehicles, total] = await Promise.all([
            this.prisma.vehicle.findMany({
                where,
                include: {
                    images: { orderBy: { isPrimary: 'desc' } },
                    regions: { include: { region: true } },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.vehicle.count({ where }),
        ]);

        return {
            data: vehicles,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id },
            include: {
                images: { orderBy: { isPrimary: 'desc' } },
                regions: { include: { region: true } },
                availability: {
                    where: {
                        date: { gte: new Date() },
                    },
                    orderBy: { date: 'asc' },
                },
            },
        });

        if (!vehicle) throw new NotFoundException('Viatura não encontrada');
        return vehicle;
    }

    async create(data: {
        brand: string;
        model: string;
        year: number;
        category: string;
        transmission: string;
        fuelType: string;
        seats: number;
        pricePerDay: number;
        description?: string;
        features?: string;
        regionIds?: number[];
    }) {
        const { regionIds, ...vehicleData } = data;

        const vehicle = await this.prisma.vehicle.create({
            data: vehicleData,
        });

        if (regionIds?.length) {
            await this.prisma.vehicleRegion.createMany({
                data: regionIds.map((regionId) => ({
                    vehicleId: vehicle.id,
                    regionId,
                })),
            });
        }

        return this.findOne(vehicle.id);
    }

    async update(id: number, data: any) {
        await this.findOne(id);

        const { regionIds, ...vehicleData } = data;

        if (Object.keys(vehicleData).length > 0) {
            await this.prisma.vehicle.update({
                where: { id },
                data: vehicleData,
            });
        }

        if (regionIds) {
            await this.prisma.vehicleRegion.deleteMany({ where: { vehicleId: id } });
            if (regionIds.length > 0) {
                await this.prisma.vehicleRegion.createMany({
                    data: regionIds.map((regionId: number) => ({
                        vehicleId: id,
                        regionId,
                    })),
                });
            }
        }

        return this.findOne(id);
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.prisma.vehicle.delete({ where: { id } });
        return { message: 'Viatura removida com sucesso' };
    }

    async addImage(vehicleId: number, url: string, isPrimary: boolean = false) {
        await this.findOne(vehicleId);

        if (isPrimary) {
            await this.prisma.vehicleImage.updateMany({
                where: { vehicleId },
                data: { isPrimary: false },
            });
        }

        return this.prisma.vehicleImage.create({
            data: { vehicleId, url, isPrimary },
        });
    }

    async removeImage(imageId: number) {
        const image = await this.prisma.vehicleImage.findUnique({ where: { id: imageId } });
        if (!image) throw new NotFoundException('Imagem não encontrada');
        await this.prisma.vehicleImage.delete({ where: { id: imageId } });
        return { message: 'Imagem removida' };
    }

    async getAvailability(vehicleId: number, month?: number, year?: number) {
        const now = new Date();
        const m = month || now.getMonth() + 1;
        const y = year || now.getFullYear();

        const startDate = new Date(y, m - 1, 1);
        const endDate = new Date(y, m, 0);

        return this.prisma.vehicleAvailability.findMany({
            where: {
                vehicleId,
                date: { gte: startDate, lte: endDate },
            },
            orderBy: { date: 'asc' },
        });
    }

    async setAvailability(
        vehicleId: number,
        data: { date: string; status: AvailabilityStatus; reason?: string },
    ) {
        await this.findOne(vehicleId);
        const date = new Date(data.date);

        return this.prisma.vehicleAvailability.upsert({
            where: { vehicleId_date: { vehicleId, date } },
            update: { status: data.status, reason: data.reason },
            create: { vehicleId, date, status: data.status, reason: data.reason },
        });
    }

    async bulkSetAvailability(
        vehicleId: number,
        data: { startDate: string; endDate: string; status: AvailabilityStatus; reason?: string },
    ) {
        await this.findOne(vehicleId);
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);

        const dates: Date[] = [];
        const current = new Date(start);
        while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        const results: any[] = [];
        for (const date of dates) {
            const result = await this.prisma.vehicleAvailability.upsert({
                where: { vehicleId_date: { vehicleId, date } },
                update: { status: data.status, reason: data.reason },
                create: { vehicleId, date, status: data.status, reason: data.reason },
            });
            results.push(result);
        }

        return results;
    }

    async getCategories() {
        const categories = await this.prisma.vehicle.findMany({
            where: { isActive: true },
            select: { category: true },
            distinct: ['category'],
        });
        return categories.map((c) => c.category);
    }
}
