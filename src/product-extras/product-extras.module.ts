import { Module } from '@nestjs/common';
import { ProductExtrasService } from './product-extras.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductExtras,
  ProductExtrasSchema,
} from './schema/product-extras.schema';
import { ProductExtrasController } from './product-extras.controller';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: ProductExtras.name, useFactory: () => ProductExtrasSchema },
    ]),
    ProductModule
  ],
  providers: [ProductExtrasService],
  exports: [ProductExtrasService],
  controllers: [ProductExtrasController],
})
export class ProductExtrasModule {}
