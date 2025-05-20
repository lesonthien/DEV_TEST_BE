import { Controller, Delete, Get, Param } from '@nestjs/common';

import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  // 🔹 Xem danh sách tất cả key đang cache
  @Get('keys')
  async getAllKeys(): Promise<string[]> {
    return this.redisService.getAllKeys();
  }

  // 🔹 Lấy dữ liệu của một key cụ thể
  @Get('key/:key')
  async getValue(@Param('key') key: string): Promise<unknown> {
    return this.redisService.getCache(key);
  }

  // 🔹 Xóa một key khỏi cache
  @Delete('key/:key')
  async deleteKey(@Param('key') key: string): Promise<string> {
    await this.redisService.delCache(key);
    return `Deleted cache key: ${key}`;
  }

  // 🔹 Xóa toàn bộ cache
  @Delete('flush')
  async flushAll(): Promise<string> {
    await this.redisService.flushAll();
    return 'Flushed all Redis cache!';
  }
}
