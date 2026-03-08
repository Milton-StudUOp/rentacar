import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(data: { name: string; phone: string; email?: string; password: string }) {
        const existingPhone = await this.prisma.user.findUnique({ where: { phone: data.phone } });
        if (existingPhone) throw new ConflictException('Telefone já registado');

        if (data.email) {
            const existingEmail = await this.prisma.user.findUnique({ where: { email: data.email } });
            if (existingEmail) throw new ConflictException('Email já registado');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email || null,
                password: hashedPassword,
                role: Role.CLIENT,
            },
        });

        return this.generateTokens(user);
    }

    async login(data: { login: string; password: string }) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.login },
                    { phone: data.login },
                ],
            },
        });

        if (!user) throw new UnauthorizedException('Credenciais inválidas');

        const passwordValid = await bcrypt.compare(data.password, user.password);
        if (!passwordValid) throw new UnauthorizedException('Credenciais inválidas');

        return this.generateTokens(user);
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key',
            });

            const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user) throw new UnauthorizedException('Utilizador não encontrado');

            return this.generateTokens(user);
        } catch {
            throw new UnauthorizedException('Refresh token inválido');
        }
    }

    async getProfile(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) throw new UnauthorizedException('Utilizador não encontrado');
        return user;
    }

    async changePassword(userId: number, currentPassword: string, newPassword: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new UnauthorizedException('Utilizador não encontrado');

        const passwordValid = await bcrypt.compare(currentPassword, user.password);
        if (!passwordValid) throw new BadRequestException('Senha actual incorrecta');

        if (newPassword.length < 6) throw new BadRequestException('A nova senha deve ter pelo menos 6 caracteres');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return { message: 'Senha alterada com sucesso' };
    }

    private generateTokens(user: any) {
        const payload = { sub: user.id, role: user.role };

        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key',
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        };
    }
}
