import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductExtrasModule } from './product-extras/product-extras.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { ImplementationModule } from './implementation/implementation.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ProductModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    ProductExtrasModule,
    ImplementationModule,
    ApiModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
        .apply(LoggerMiddleware)
        .forRoutes('*');
    consumer
        .apply(AuthMiddleware) // exclude from here the healthy endpoint
        .forRoutes('*');
  }
}
