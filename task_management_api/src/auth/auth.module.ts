import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PrismaAuthRepository } from './repository/auth.repository'
import { JwtStrategy } from './jwt-stratergy'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>('JWT_EXPIRES_IN') ?? '15m'

        return {
          secret: config.get<string>('JWT_SECRET')!,
          signOptions: {
            expiresIn: expiresIn as any,
          },
        }
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaAuthRepository,
    JwtStrategy,
  ],
})
export class AuthModule {}