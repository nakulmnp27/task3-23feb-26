import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaAuthRepository } from './repository/auth.repository'
import { UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

describe('AuthService login', () => {
  let authService: AuthService
  let repo: any

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaAuthRepository,
          useValue: {
            findUserByEmail: jest.fn(),
            saveRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('access-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(7),
          },
        },
      ],
    }).compile()

    authService = moduleRef.get(AuthService)
    repo = moduleRef.get(PrismaAuthRepository)
  })

  it('logs in user with correct credentials', async () => {
    repo.findUserByEmail.mockResolvedValue({
      id: 'user-id',
      email: 'user@test.com',
      passwordHash: await bcrypt.hash('password', 10),
      isActive: true,
      role: { name: 'USER' },
    })

    const result = await authService.login({
      email: 'user@test.com',
      password: 'password',
    })

    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
  })

  it('throws error for wrong password', async () => {
    repo.findUserByEmail.mockResolvedValue({
      id: 'user-id',
      email: 'user@test.com',
      passwordHash: await bcrypt.hash('password', 10),
      isActive: true,
      role: { name: 'USER' },
    })

    await expect(
      authService.login({
        email: 'user@test.com',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException)
  })
})