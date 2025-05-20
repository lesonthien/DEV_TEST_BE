/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Logger as NestLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { middleware } from './app.middleware';
import { AppModule } from './app.module';

/**
 * https://docs.nestjs.com
 * https://github.com/nestjs/nest/tree/master/sample
 * https://github.com/nestjs/nest/issues/2249#issuecomment-494734673
 */
async function bootstrap(): Promise<string> {
  const isProduction = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    cors: true,
  });

  app.useLogger(app.get(Logger));

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // app.useGlobalPipes(new I18nValidationPipe());
  // app.useGlobalFilters(new I18nValidationExceptionFilter({ detailedErrors: false }));

  if (isProduction) {
    app.enable('trust proxy');
  }

  // Express Middleware
  middleware(app);

  app.enableShutdownHooks();

  const configDocument = new DocumentBuilder()
    .setTitle('Test Dev API')
    .setDescription('')
    .setVersion('2.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .addGlobalParameters({ name: 'x-lang', in: 'header' })
    .build();
  const document = SwaggerModule.createDocument(app, configDocument);
  Object.values(document.paths).forEach((path: object) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values(path).forEach((method: any) => {
      if (Array.isArray(method.security) && method.security.includes('public')) {
        method.security = [];
      }
    });
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 3000);

  return app.getUrl();
}

void (async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();
