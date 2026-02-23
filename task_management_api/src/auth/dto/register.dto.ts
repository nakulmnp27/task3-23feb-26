import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string

  @ApiPropertyOptional({
    example: 'Nakul',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string
}
