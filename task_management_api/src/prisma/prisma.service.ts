import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

var connectionString = new ConfigService().get<string>('DATABASE_URL');

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    connectionString = process.env.DATABASE_URL;
    console.log('PrismaService connectionString:', connectionString);
    const adapter = new PrismaPg({ connectionString });

    super({ adapter } as any);
  }

  async onModuleInit() {
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}