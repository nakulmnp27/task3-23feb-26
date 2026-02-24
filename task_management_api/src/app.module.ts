import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module'
import { BikesModule } from './bikes/bikes.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    NotificationsModule,
    BikesModule
  ],
})
export class AppModule {}

