import { Test, TestingModule } from '@nestjs/testing';
import { ProductExtrasService } from '../product-extras.service';

describe('ProductExtrasService', () => {
  let service: ProductExtrasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductExtrasService],
    }).compile();

    service = module.get<ProductExtrasService>(ProductExtrasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
