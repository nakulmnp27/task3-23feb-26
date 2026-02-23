import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string
}   