import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductExtrasDocument = ProductExtras & Document;

@Schema({
  collection: 'ProductExtras',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
})
export class ProductExtras {
  @Prop({ required: true })
  productId: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ default: true })
  enabled: boolean;
}

export const ProductExtrasSchema = SchemaFactory.createForClass(ProductExtras);
