import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum CategoryType {
  OS = 'Operating System',
  SOFTWARE = 'Application Software',
}

export enum PlatformType {
  WINDOWS = 'Windows',
  MAC = 'Mac',
  LINUX = 'Linux',
  ANDROID = 'Android',
  IOS = 'IOS',
}

export enum DeviceType {
  COMPUTER = 'Computer',
  MOBILE = 'Mobile',
}

@Schema({ timestamps: true })
export class Feedbacks extends Document {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  message: string;
}
export const feedbacksSchema = SchemaFactory.createForClass(Feedbacks);

@Schema({ timestamps: true })
export class SkuDetails extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  validityInDays: number;

  @Prop({ required: true })
  lifetime: boolean;

  @Prop({ required: true })
  stripePriceId: string;

  @Prop({ required: true })
  skuCode: string;
}
export const SkuDetailsSchema = SchemaFactory.createForClass(SkuDetails);

@Schema({ timestamps: true })
export class Products extends Document {
  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    default:
      'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
  })
  image: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: PlatformType })
  platformType: string;

  @Prop({ required: true, enum: DeviceType })
  deviceType: string;

  @Prop({ required: true })
  productUrl: string;

  @Prop({ required: true })
  downloadUrl: string;

  @Prop({})
  ratingAvg: number;

  @Prop({ type: [feedbacksSchema] })
  feedbacks: Feedbacks[];

  @Prop({ type: [SkuDetailsSchema] })
  skuDetails: SkuDetails[];

  @Prop({ type: Object })
  imageDetails: Record<string, any>;

  @Prop({})
  specification: Record<string, any>[];

  @Prop({})
  highlights: string[];

  @Prop({})
  stripeProductId: string;
}
export const ProductsSchema = SchemaFactory.createForClass(Products);
