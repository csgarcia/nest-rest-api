import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from "cache-manager";

@Injectable()
export class InternalCacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async setCacheDataFromProduct(productId, name, sku) {
        this.cacheManager.set(`${productId}-name`, name, { ttl: 600 }) // 600 seconds
            .then(() => console.info('name stored in cache')).catch();
        this.cacheManager.set(`${productId}-sku`, sku, { ttl: 600 }) // 600 seconds
            .then(() => console.info('sku stored in cache')).catch();
        return true;
    }

    /**
     * Function to save product cache
     * @param productId
     */
    async getCacheDataFromProduct(productId) {
        let response = { cacheName: null, cacheSku: null };
        try {
            response.cacheName = await this.cacheManager.get(`${productId}-name`);
            response.cacheSku = await this.cacheManager.get(`${productId}-sku`);
            return response;
        } catch (e) {
            return response;
        }
    }
}
