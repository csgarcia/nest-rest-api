import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ProductModule } from '../product/product.module';
import { ProductExtrasModule } from '../product-extras/product-extras.module';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [ProductModule, ProductExtrasModule],
})
export class ApiModule {}
