import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { RegionsModule } from './regions/regions.module';
import { TransfersModule } from './transfers/transfers.module';
import { BookingsModule } from './bookings/bookings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UploadsModule } from './uploads/uploads.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        VehiclesModule,
        RegionsModule,
        TransfersModule,
        BookingsModule,
        DashboardModule,
        UploadsModule,
        NotificationsModule,
        UsersModule,
    ],
})
export class AppModule { }
