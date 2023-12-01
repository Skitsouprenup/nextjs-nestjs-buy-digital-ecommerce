import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Products, ProductsSchema } from 'src/shared/schema/products';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/shared/middlewares/auth';
import { UserSchema, Users } from 'src/shared/schema/users';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { License, LicenseSchema } from 'src/shared/schema/license';
import { OrderSchema, Orders } from 'src/shared/schema/orders';
import { OrderRepository } from 'src/shared/repositories/order.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository,
    UserRepository,
    OrderRepository,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: Products.name,
        schema: ProductsSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: License.name,
        schema: LicenseSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Orders.name,
        schema: OrderSchema,
      },
    ]),
  ],
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: 'products',
          method: RequestMethod.GET,
        },
        {
          path: 'products/:id',
          method: RequestMethod.GET,
        },
      )
      .forRoutes('/products');
  }
}
