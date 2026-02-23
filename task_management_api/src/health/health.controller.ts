import { Controller, Get, HttpCode } from '@nestjs/common'
import { HealthService } from './health.service'

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HttpCode(200)
  check() {
    return this.healthService.check()
  }

  @Get('db')
  checkDb() {
    return this.healthService.checkDb()
  }
}