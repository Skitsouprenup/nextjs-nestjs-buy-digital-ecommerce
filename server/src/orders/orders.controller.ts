import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Req,
  Body,
  Headers,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { checkoutDtoList } from './dto/checkout.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @Query('status') status: string,
    @Req() request: Request | any,
  ) {
    return await this.ordersService.findAll(status, request.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ordersService.findOne(id);
  }

  @Post('/checkout')
  async checkout(@Body() body: checkoutDtoList, @Req() request: Request | any) {
    return await this.ordersService.checkout(body, request.user);
  }

  @Post('/webhook')
  async stripeWebhook(
    @Body() rawBody: Buffer,
    @Headers('stripe-signature') sig: string,
  ) {
    await this.ordersService.stripeWebhook(rawBody, sig);

    return {
      message: '',
      content: {},
      success: true,
    };
  }
}
