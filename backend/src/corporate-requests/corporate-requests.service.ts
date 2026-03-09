import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CorporateRequestsService {
    constructor(private prisma: PrismaService) { }

    async createRequest(data: any) {
        return this.prisma.corporateRequest.create({
            data: {
                companyName: data.companyName,
                contactName: data.contactName,
                email: data.email,
                phone: data.phone,
                vehicleId: data.vehicleId,
                periodType: data.periodType,
                periodDuration: data.periodDuration,
                quantity: data.quantity || 1,
            },
        });
    }

    async findAll() {
        return this.prisma.corporateRequest.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                vehicle: {
                    select: {
                        brand: true,
                        model: true,
                        category: true,
                        images: {
                            where: { isPrimary: true },
                            take: 1
                        }
                    }
                }
            }
        });
    }

    async findOne(id: number) {
        const request = await this.prisma.corporateRequest.findUnique({
            where: { id },
            include: { vehicle: true }
        });
        if (!request) throw new NotFoundException('Corporate request not found');
        return request;
    }

    async updateStatus(id: number, status: any, notes?: string) {
        const request = await this.prisma.corporateRequest.findUnique({ where: { id } });
        if (!request) throw new NotFoundException('Corporate request not found');

        return this.prisma.corporateRequest.update({
            where: { id },
            data: {
                status,
                ...(notes !== undefined && { notes })
            }
        });
    }

    async deleteRequest(id: number) {
        const request = await this.prisma.corporateRequest.findUnique({ where: { id } });
        if (!request) throw new NotFoundException('Corporate request not found');

        return this.prisma.corporateRequest.delete({
            where: { id }
        });
    }
}
