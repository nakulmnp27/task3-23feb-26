import { User, Role, RefreshToken } from '@prisma/client'

export interface AuthRepository {
  findUserByEmail(email: string): Promise<User | null>
  findRoleByName(name: string): Promise<Role | null>

  createUser(data: {
    email: string
    passwordHash: string
    name?: string
    roleId: string
  }): Promise<User>

  saveRefreshToken(
    userId: string,
    rawToken: string,
    expiresAt: Date,
  ): Promise<RefreshToken>

  findValidRefreshTokenByRawToken(
    rawToken: string,
  ): Promise<(RefreshToken & { user: User }) | null>

  revokeToken(
    tokenId: string,
    replacedById?: string,
  ): Promise<RefreshToken>
}