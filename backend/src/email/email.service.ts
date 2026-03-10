import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendPasswordResetCode(email: string, code: string) {
        const mailOptions = {
            from: `"Rent-a-Car & Transfers" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Código de Recuperação de Senha',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
                    <h2 style="color: #0d9488; text-align: center;">Recuperação de Senha</h2>
                    <p>Olá,</p>
                    <p>Recebemos um pedido para redefinir a sua senha. Utilize o código abaixo para prosseguir com a recuperação:</p>
                    <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f172a; margin: 20px 0; border-radius: 8px;">
                        ${code}
                    </div>
                    <p>Este código é válido por 15 minutos. Se não solicitou esta alteração, por favor ignore este email.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #64748b; text-align: center;">
                        © ${new Date().getFullYear()} Rent-a-Car & Transfers. Todos os direitos reservados.
                    </p>
                </div>
            `,
        };

        return this.transporter.sendMail(mailOptions);
    }
}
