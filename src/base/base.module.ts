import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { UserModule } from 'src/shared/user';

import * as controllers from './controllers';

@Module({
  imports: [TerminusModule, HttpModule, UserModule], // Authentication
  controllers: Object.values(controllers),
})
export class BaseModule {}
