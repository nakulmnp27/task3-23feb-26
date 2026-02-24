import { Controller } from '@nestjs/common'
import { EventPattern, Payload, Ctx, RedisContext } from '@nestjs/microservices'

@Controller()
export class NotificationsController {
  private processedUsers = new Set<string>()

  @EventPattern('welcome.email')
  async handleWelcomeEmail(
    @Payload() data: { userId: string; email: string },
    @Ctx() context: RedisContext,
  ) {
    if (this.processedUsers.has(data.userId)) {
      return
    }

    try {
      console.log(
        `Welcome email sent successfully to ${data.email}`,
      )
      this.processedUsers.add(data.userId)
    } catch (err) {
      console.error('Welcome email processing failed', err)
      throw err
    }
  }
}