import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductExtrasDocument = ProductExtras & Document;

@Schema({
  collection: 'Product_extras',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
})
export class ProductExtras {
  @Prop({ required: true })
  productId: string;
  @Prop({ required: true })
  extraName: string;
  @Prop({ required: true })
  price: number;
  @Prop({ default: true })
  enabled: boolean;
}

export const ProductExtrasSchema = SchemaFactory.createForClass(ProductExtras);
