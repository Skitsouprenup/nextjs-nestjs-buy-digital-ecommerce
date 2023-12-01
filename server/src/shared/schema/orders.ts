import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

interface PaymentInfoType {
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  paymentDate: Date;
  paymentIntentId: string;
}

interface CustomerAddressType {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

@Schema({ timestamps: true })
export class OrderedItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  skuCode: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  lifetime: boolean;

  @Prop({ required: true })
  validityInDays: number;

  @Prop({ required: true })
  skuPriceId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ default: [] })
  licenseKeys: string[];
}

@Schema({ timestamps: true })
export class Orders {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  userId: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ required: true, type: Object })
  customerAddress: CustomerAddressType;

  @Prop({ required: true })
  customerPhoneNumber: string;

  @Prop({ required: true })
  orderedItems: OrderedItem[];

  @Prop({ required: true, type: Object })
  paymentInfo: PaymentInfoType;

  @Prop({ default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  @Prop({ default: false })
  orderDelivered: boolean;

  @Prop()
  checkoutSessionId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Orders);
