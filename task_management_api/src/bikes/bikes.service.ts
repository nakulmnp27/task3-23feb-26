import { Injectable } from '@nestjs/common'

@Injectable()
export class BikesService {
  private bikes = [
    { id: 101, model: 'Pulsar N160', brand: 'Bajaj', cc: 159 },
    { id: 102, model: 'Ronin', brand: 'TVS', cc: 220 },
    { id: 103, model: 'XSR 155', brand: 'YAMAHA', cc: 155 },
  ]

  getAllBikes() {
    return this.bikes
  }

  getBikesWithStats() {
    return {
      count: this.bikes.length,
      bikes: this.bikes,
      source: 'inventory',
    }
  }
}