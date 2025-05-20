import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

import { RedisController } from './redis.controller';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: '127.0.0.1',
          port: 6379,
        });
      },
    },
    RedisService,
  ],
  controllers: [RedisController],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
