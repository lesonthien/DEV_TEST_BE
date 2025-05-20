import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/naming-convention
import Redis from 'ioredis';
import { Permission } from 'src/common/permission';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';

@Injectable()
export class UserPermissionService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Lưu permissions vào cache Redis
  async cacheUserPermissions(userId: string, permissions: Permission[]): Promise<void> {
    const key = `user_permissions:${userId}`;
    // Lưu dữ liệu dưới dạng JSON, thời gian hết hạn là 1 giờ (3600 giây)
    await this.redisClient.setex(key, 3600, JSON.stringify(permissions));
  }

  // Lấy permissions từ cache Redis
  async getUserPermissionsFromCache(userId: string): Promise<Permission[]> {
    const key = `user_permissions:${userId}`;
    const cachedPermissions = await this.redisClient.get(key);

    if (!cachedPermissions) {
      const permissions: Permission[] = [];
      await this.cacheUserPermissions(userId, permissions);
      return permissions;
    }

    return <Permission[]>JSON.parse(cachedPermissions);
  }
}
