import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nMiddleware } from 'nestjs-i18n';
import { UserModule } from 'src/shared/user';

import { LoggerContextMiddleware } from './middleware';
import * as providers from './providers';

const services = Object.values(providers);

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserModule])],
  providers: services,
  exports: services,
})
export class CommonModule implements NestModule {
  // Global Middleware
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerContextMiddleware, I18nMiddleware).forRoutes('*');
  }
}
