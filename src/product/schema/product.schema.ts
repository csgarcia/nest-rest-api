import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({
  collection: 'Product',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
})
export class Product {
  @Prop({ required: true })
  sku: string;
  @Prop({ required: true })
  name: string;
  @Prop({ default: 'NA' })
  description: string;
  @Prop({ required: true })
  price: number;
  @Prop({ default: true })
  enabled: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product)

