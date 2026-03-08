import {
    Controller, Post, UseInterceptors, UploadedFile, UseGuards, Res, Get, Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import { join, extname } from 'path';
import { existsSync } from 'fs';

@Controller('uploads')
export class UploadsController {
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|pdf)$/)) {
                    return cb(new Error('Apenas imagens e PDFs são permitidos'), false);
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return {
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            size: file.size,
        };
    }

    @Get(':filename')
    serveFile(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = join(process.cwd(), 'uploads', filename);
        if (!existsSync(filePath)) {
            return res.status(404).json({ message: 'Ficheiro não encontrado' });
        }
        return res.sendFile(filePath);
    }
}
