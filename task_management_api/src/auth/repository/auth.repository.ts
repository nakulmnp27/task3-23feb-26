import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { AuthRepository } from './auth.repository.interface'

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    })
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
    return this.prisma.user.create({
      data,
      include: { role: true },
    })
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

  async findValidRefreshToken(rawToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        revoked: false,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    })

    for (const token of tokens) {
      const match = await bcrypt.compare(rawToken, token.tokenHash)
      if (match) {
        return token
      }
    }

    return null
  }

  async revokeToken(tokenId: string, replacedById?: string) {
    return this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: {
        revoked: true,
        replacedById,
      },
    })
  }

  async createTask(data: {
    title: string
    description: string
    ownerId: string
  }) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        ownerId: data.ownerId,
      },
    })
  }

  findTaskByUser(ownerId: string) {
  return this.prisma.task.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
  })
}
  

}