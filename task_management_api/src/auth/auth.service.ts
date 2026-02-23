import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { PrismaAuthRepository } from './repository/auth.repository'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { CreateTaskDto } from './dto/create-task.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: PrismaAuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.repo.findUserByEmail(dto.email)

    if (existingUser) {
      throw new BadRequestException('User already exists')
    }

    const role = await this.repo.findRoleByName('USER')

    if (!role) {
      throw new BadRequestException('Default role not found')
    }

    const passwordHash = await bcrypt.hash(dto.password, 10)

    const user = await this.repo.createUser({
      email: dto.email,
      passwordHash,
      name: dto.name,
      roleId: role.id,
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }
  }

  async login(dto: LoginDto) {
    const user = await this.repo.findUserByEmail(dto.email)

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash)

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      roles: [user.role.name],
    })

    const refreshToken = crypto.randomUUID()

    const refreshDays =
      Number(this.configService.get('REFRESH_TOKEN_EXPIRES_IN_DAYS')) || 7

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + refreshDays)

    await this.repo.saveRefreshToken(user.id, refreshToken, expiresAt)

    return {
      accessToken,
      refreshToken,
    }
  }

  async refresh(dto: RefreshTokenDto) {
    const existing =
      await this.repo.findValidRefreshToken(dto.refreshToken)

    if (!existing) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const accessToken = await this.jwtService.signAsync({
      sub: existing.user.id,
      email: existing.user.email,
      roles: [existing.user.role.name],
    })

    const refreshToken = crypto.randomUUID()

    const refreshDays =
      Number(this.configService.get('REFRESH_TOKEN_EXPIRES_IN_DAYS')) || 7

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + refreshDays)

    const newToken = await this.repo.saveRefreshToken(
      existing.user.id,
      refreshToken,
      expiresAt,
    )

    await this.repo.revokeToken(existing.id, newToken.id)

    return {
      accessToken,
      refreshToken,
    }
  }

  createTask(dto: CreateTaskDto, userId: string) {
    return this.repo.createTask({
      title: dto.title,
      description: dto.description,
      ownerId: userId,
    })
  }

  getMyTasks(userId: string) {
  return this.repo.findTaskByUser(userId)
}
}