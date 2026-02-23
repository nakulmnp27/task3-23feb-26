import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class PrismaAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  findRoleByName(name: string) {
    return this.prisma.role.findUnique({ where: { name } })
  }

  createUser(data: {
    email: string
    passwordHash: string
    name?: string
    roleId: string
  }) {
    return this.prisma.user.create({ data })
  }

  async saveRefreshToken(userId: string, rawToken: string, expiresAt: Date) {
    const tokenHash = await bcrypt.hash(rawToken, 10)

    return this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    })
  }

  async findValidRefreshTokenByRawToken(rawToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        revoked: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    })

    for (const token of tokens) {
      const match = await bcrypt.compare(rawToken, token.tokenHash)
      if (match) {
        return token
      }
    }

    return null
  }

  revokeToken(tokenId: string, replacedById?: string) {
    return this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: {
        revoked: true,
        replacedById,
      },
    })
  }
}