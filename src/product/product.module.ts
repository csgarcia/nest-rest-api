import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { ProductController } from './product.controller';
import { InternalCacheModule } from "../internal-cache/internal-cache.module";


@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Product.name, useFactory: () => ProductSchema },
    ]),
    InternalCacheModule
  ],
  providers: [ProductService],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
