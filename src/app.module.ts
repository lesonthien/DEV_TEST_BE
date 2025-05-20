/* eslint-disable import/no-extraneous-dependencies */
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';
import * as path from 'path';

import { AuthModule, JwtAuthGuard } from './auth';
import { BaseModule } from './base';
import { CommonModule, ExceptionsFilter, RolesGuard } from './common';
import { configuration, loggerOptions } from './config';
import { BasicDataModule } from './modules/basic-data/basic-data.module';
import { FileModule } from './modules/file/file.module';
import { RedisModule } from './shared/redis/redis.module';

@Module({
  imports: [
    LoggerModule.forRoot(loggerOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const configDatabase = config.get<TypeOrmOptionsFactory>('db');

        return {
          ...configDatabase,
          subscribers: [],
          connectString:
            '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=103.104.122.136)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=ORCL)(SERVER=POOLED)))',
          options: { trustServerCertificate: true },
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
      renderPath: '/',
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [new QueryResolver(['lang', 'l']), new HeaderResolver(['x-lang']), new CookieResolver(), AcceptLanguageResolver],
      typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
    }),
    AuthModule,
    BaseModule,
    CommonModule, // Global
    BasicDataModule,
    FileModule,
    // TOUR MODULE
    RedisModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true, // transform object to DTO class
        whitelist: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
