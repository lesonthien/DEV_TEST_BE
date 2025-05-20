import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async setCache(key: string, value: unknown, ttl = 0): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async getCache<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data ? JSON.parse(data) : null;
  }

  async delCache(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async getAllKeys(): Promise<string[]> {
    return this.redisClient.keys('*');
  }

  async flushAll(): Promise<void> {
    await this.redisClient.flushall();
  }
}
