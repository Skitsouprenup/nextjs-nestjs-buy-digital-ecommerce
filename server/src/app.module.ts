import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import config from 'config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './http/http.exceptionfilter';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { StripeModule } from './stripe/stripe.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.get('mongodbUri'), {
      writeConcern: { w: 1 },
    }),
    UsersModule,
    ProductsModule,
    StripeModule.forRoot(config.get('stripe.secretKey'), {
      apiVersion: '2023-08-16',
      typescript: true,
    }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
