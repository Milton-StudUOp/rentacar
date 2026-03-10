import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(
        @Body() body: { name: string; phone: string; email?: string; password: string },
    ) {
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: { login: string; password: string }) {
        return this.authService.login(body);
    }

    @Post('refresh')
    async refresh(@Body() body: { refreshToken: string }) {
        return this.authService.refreshToken(body.refreshToken);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: any) {
        return this.authService.getProfile(req.user.sub);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    async changePassword(
        @Req() req: any,
        @Body() body: { currentPassword: string; newPassword: string },
    ) {
        return this.authService.changePassword(req.user.sub, body.currentPassword, body.newPassword);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() body: { email: string }) {
        return this.authService.requestPasswordReset(body.email);
    }

    @Post('verify-code')
    async verifyCode(@Body() body: { email: string; code: string }) {
        return this.authService.verifyResetCode(body.email, body.code);
    }

    @Post('reset-password')
    async resetPassword(@Body() body: { email: string; code: string; newPassword: string }) {
        return this.authService.resetPassword(body);
    }
}
