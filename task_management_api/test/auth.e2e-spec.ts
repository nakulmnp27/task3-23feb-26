import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import { JwtService } from '@nestjs/jwt'

describe('RBAC Integration Test', () => {
  let app: INestApplication
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    jwtService = moduleRef.get(JwtService)
  })

  afterAll(async () => {
    await app.close()
  })

  it('USER should be allowed to access USER route (RBAC passes)', async () => {
    const token = await jwtService.signAsync({
      sub: 'user-id',
      email: 'user@test.com',
      roles: ['USER'],
    })

    const res = await request(app.getHttpServer())
      .get('/auth/tasks')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).not.toBe(401)
    expect(res.status).not.toBe(403)
  })

  it('USER should be blocked from ADMIN-only route', async () => {
    const token = await jwtService.signAsync({
      sub: 'user-id',
      email: 'user@test.com',
      roles: ['USER'],
    })

    await request(app.getHttpServer())
      .delete('/auth/tasks/admin')
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
  })
})