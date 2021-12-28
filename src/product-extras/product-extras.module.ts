import { Module } from '@nestjs/common';
import { ProductExtrasController } from './product-extras.controller';
import { ProductExtrasService } from './product-extras.service';

@Module({
  controllers: [ProductExtrasController],
  providers: [ProductExtrasService],
  exports: [ProductExtrasService],
})
export class ProductExtrasModule {}
