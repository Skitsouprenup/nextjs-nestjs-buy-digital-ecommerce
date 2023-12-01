import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';
import { TransformInterceptor } from './http/http.responseinterceptor';
import cookieParser = require('cookie-parser');
import { raw } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: true,
  });
  //Global middleware
  app.use(cookieParser());
  app.use('/api/v1/orders/webhook', raw({ type: '*/*' }));

  app.setGlobalPrefix(config.get('routesPrefix'));
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(config.get('port'), () => {
    console.log(`server running on port ${config.get('port')}`);
  });
}
bootstrap();
