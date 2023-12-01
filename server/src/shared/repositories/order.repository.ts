import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Orders } from '../schema/orders';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Orders.name) private readonly orderModel: Model<Orders>,
  ) {}

  async findAll(status: string, user: string) {
    return await this.orderModel.find({
      orderStatus: status,
      userId: user,
    });
  }

  async find(filter: Record<string, any>) {
    return await this.orderModel.find(filter);
  }

  async findOne(filter: Record<string, any>) {
    return await this.orderModel.findOne(filter);
  }

  async create(order: Record<string, any>) {
    return await this.orderModel.create(order);
  }

  async findOneAndUpdate(
    filter: Record<string, any>,
    queryUpdates: Record<string, any>,
    getUpdatedResult = true,
  ) {
    return await this.orderModel.findOneAndUpdate(filter, queryUpdates, {
      new: getUpdatedResult,
    });
  }
}
