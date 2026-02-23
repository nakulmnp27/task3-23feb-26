import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    const secret = cfg.get<string>('JWT_SECRET')

    if (!secret) {
      throw new Error('JWT_SECRET is not defined')
    }

    console.log('JWT STRATEGY SECRET =>', secret)

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    })
  }

  async validate(payload: any) {
    console.log('JWT STRATEGY HIT', payload)
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    }
  }

}
