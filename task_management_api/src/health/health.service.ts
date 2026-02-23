import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  check() {
    return {
      status: 'ok',
      service: 'task-api',
      timestamp: new Date().toISOString()
    }
  }

  async checkDb() {
    try {
      await this.prisma.$queryRaw`SELECT 1`

      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString()
      }
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'down'
      })
    }
  }
}