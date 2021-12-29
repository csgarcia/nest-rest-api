import { Test, TestingModule } from '@nestjs/testing';
import { ImplementationController } from '../implementation.controller';

describe('ImplementationController', () => {
  let controller: ImplementationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImplementationController],
    }).compile();

    controller = module.get<ImplementationController>(ImplementationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
