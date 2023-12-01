import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from '../schema/users';
import { Model } from 'mongoose';
import { CreateUserData } from '../../types/usercrudpayload';

@Injectable()
export class UserRepository {
  constructor(
    //Users.name is the name of the function is string format.
    //Not the name property of Users instance.
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  async findOne(query: Record<string, any>) {
    return await this.userModel.findOne(query);
  }

  async create(query: CreateUserData) {
    return await this.userModel.create(query);
  }

  async activateUser(email: string, isVerified: boolean) {
    return await this.userModel.updateOne({ email }, { isVerified });
  }

  async updateOne(
    filter: Record<string, any>,
    fieldsToUpdate: Record<string, any>,
  ) {
    return await this.userModel.updateOne(filter, fieldsToUpdate);
  }

  async findOneAndUpdate(
    filter: Record<string, any>,
    update: Record<string, any>,
  ) {
    /* returnDocument is an alias of new */
    return await this.userModel.findOneAndUpdate(filter, update, {
      returnDocument: 'after',
    });
  }

  async find(filter: Record<string, any>) {
    return await this.userModel.find(filter);
  }
}
