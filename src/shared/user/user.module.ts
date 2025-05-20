import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisModule } from '../redis/redis.module';
import { UserEntity } from './user.entity';
import { UserPermissionService } from './user.permission.service';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RedisModule],
  providers: [UserService, UserPermissionService],
  exports: [UserService, UserPermissionService],
})
export class UserModule {}
