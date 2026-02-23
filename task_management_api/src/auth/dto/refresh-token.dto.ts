import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenDto {
  @ApiProperty({
    example: 'c6b3e6a2-1f4b-4e8a-9c9d-2c0c9c9f1a12',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}