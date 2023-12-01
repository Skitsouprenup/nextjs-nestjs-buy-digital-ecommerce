import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

/*
  Use this timestamps properties if you wanna
  override the default name of createdAt and updatedAt
  fields.
*/
@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class License {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
  })
  productId: string;

  @Prop({
    required: true,
    type: String,
  })
  productSku: string;

  @Prop({
    required: true,
    type: String,
  })
  licenseKey: string;

  @Prop({
    default: false,
    type: Boolean,
  })
  isSold: boolean;

  @Prop({
    default: '',
  })
  orderId: string;
}

export const LicenseSchema = SchemaFactory.createForClass(License);
