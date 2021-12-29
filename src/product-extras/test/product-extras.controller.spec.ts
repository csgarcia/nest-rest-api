import { Test, TestingModule } from '@nestjs/testing';
import { ProductExtrasController } from '../product-extras.controller';

describe('ProductExtrasController', () => {
  let controller: ProductExtrasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductExtrasController],
    }).compile();

    controller = module.get<ProductExtrasController>(ProductExtrasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
