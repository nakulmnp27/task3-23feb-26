import { Controller, Get, Version } from '@nestjs/common'
import { BikesService } from './bikes.service'

@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Version('1')
  @Get()
  getBikesV1() {
    return this.bikesService.getAllBikes()
  }

  @Version('2')
  @Get()
  getBikesV2() {
    return this.bikesService.getBikesWithStats()
  }
}