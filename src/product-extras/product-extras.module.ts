import { Module } from '@nestjs/common';
import { ProductExtrasService } from './product-extras.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductExtras,
  ProductExtrasSchema,
} from './schema/product-extras.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: ProductExtras.name, useFactory: () => ProductExtrasSchema },
    ]),
  ],
  providers: [ProductExtrasService],
  exports: [ProductExtrasService],
})
export class ProductExtrasModule {}
