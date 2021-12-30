import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductExtrasModule } from './product-extras/product-extras.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { ImplementationModule } from './implementation/implementation.module';
import { ApiModule } from './api/api.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { InternalCacheModule } from './internal-cache/internal-cache.module';

@Module({
  imports: [
    ProductModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    ProductExtrasModule,
    ImplementationModule,
    ApiModule,
    TerminusModule,
    InternalCacheModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
        .apply(LoggerMiddleware)
        .forRoutes('*');
    consumer
        .apply(AuthMiddleware)
        .exclude('health') // no token needed to check health services
        .forRoutes('*');
  }
}
