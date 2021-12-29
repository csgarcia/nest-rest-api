import { Module } from '@nestjs/common';
import { ImplementationController } from './implementation.controller';
import { ImplementationService } from './implementation.service';
import { ProductModule } from '../product/product.module';
import { ProductExtrasModule } from '../product-extras/product-extras.module';
import { ApisModule } from '../api/api.module';

@Module({
  imports: [
      ProductModule,
      ProductExtrasModule,
      ApisModule
  ],
  controllers: [ImplementationController],
  providers: [ImplementationService]
})
export class ImplementationModule {}
