import { Module, CacheModule } from '@nestjs/common';
import { InternalCacheService } from './internal-cache.service';

@Module({
  imports: [CacheModule.register()],
  providers: [InternalCacheService],
  exports: [InternalCacheService]
})
export class InternalCacheModule {}
