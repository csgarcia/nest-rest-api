import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductExtrasModule } from './product-extras/product-extras.module';
import { ApiModule } from './api/api.module';
import {LoggerMiddleware} from "./common/middleware/logger.middleware";

@Module({
  imports: [
    ProductModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    ProductExtrasModule,
    ApiModule,
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
