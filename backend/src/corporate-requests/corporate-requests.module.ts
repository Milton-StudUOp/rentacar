import { Module } from '@nestjs/common';
import { CorporateRequestsController } from './corporate-requests.controller';
import { CorporateRequestsService } from './corporate-requests.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CorporateRequestsController],
    providers: [CorporateRequestsService]
})
export class CorporateRequestsModule { }
