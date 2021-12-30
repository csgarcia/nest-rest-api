import { Test, TestingModule } from '@nestjs/testing';
import { InternalCacheService } from '../internal-cache.service';
import { CacheModule, CACHE_MANAGER } from "@nestjs/common";

describe('InternalCacheService', () => {
  let service: InternalCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InternalCacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn().mockResolvedValue(null),
            get: jest.fn().mockResolvedValue('expectedKey')
          }
        },
        {
          provide: CacheModule,
          useValue: {
            register: jest.fn()
          }
        }
      ],
    }).compile();
    service = module.get<InternalCacheService>(InternalCacheService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('setCacheDataFromProduct tests', () => {
    it('should save cache cache and return flag true', async() => {
      const mockProductId = 'someId';
      const mockProductName = 'sku';
      const mockProductSku = 'name';
      const response = await service.setCacheDataFromProduct(mockProductId, mockProductName, mockProductSku);
      expect(response).toEqual(true);
    });
  });

  describe('getCacheDataFromProduct tests', () => {
    it('should return cache data', async() => {
      const mockProductId = 'someId';
      const response = await service.getCacheDataFromProduct(mockProductId);
      expect(response.cacheSku).toEqual('expectedKey');
      expect(response.cacheName).toEqual('expectedKey');
    });
  });

});
