import { Test, TestingModule } from '@nestjs/testing';
import { ImplementationService } from '../implementation.service';

describe('ImplementationService', () => {
  let service: ImplementationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImplementationService],
    }).compile();

    service = module.get<ImplementationService>(ImplementationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
