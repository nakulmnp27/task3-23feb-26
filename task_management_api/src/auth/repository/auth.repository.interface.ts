import { User, Role, RefreshToken, Task } from '@prisma/client'

export interface AuthRepository {
  findUserByEmail(
    email: string,
  ): Promise<(User & { role: Role }) | null>

  findRoleByName(name: string): Promise<Role | null>

  createUser(data: {
    email: string
    passwordHash: string
    name?: string
    roleId: string
  }): Promise<User & { role: Role }>

  saveRefreshToken(
    userId: string,
    rawToken: string,
    expiresAt: Date,
  ): Promise<RefreshToken>

  findValidRefreshToken(
    rawToken: string,
  ): Promise<(RefreshToken & { user: User & { role: Role } }) | null>

  revokeToken(
    tokenId: string,
    replacedById?: string,
  ): Promise<RefreshToken>

  createTask(data: {
    title: string
    description: string
    ownerId: string
  }): Promise<Task>

  findTaskByUser(userId:string):Promise<Task[]>
  findAllTasks(): Promise<Task[]>
  deleteTaskById(taskId: string): Promise<Task>
  promoteUserToAdmin(
  userId: string,
  adminRoleId: string,
): Promise<User>
}