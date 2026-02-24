import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'

export const RedisClient = ClientProxyFactory.create({
  transport: Transport.REDIS,
  options: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
})

// import { RedisOptions } from "ioredis";

// export const redisConfig: RedisOptions = {
//   host: "127.0.0.1",
//   port: 6379,
// };