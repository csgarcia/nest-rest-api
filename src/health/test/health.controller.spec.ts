import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../health.controller';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn().mockResolvedValue({
              "status": "ok",
              "info": {
                "mock-api-products": {
                  "status": "up"
                }
              },
              "error": {},
              "details": {
                "mock-api-products": {
                  "status": "up"
                }
              }
            })
          }
        },
        {
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: jest.fn()
          }
        }
      ]
    }).compile();
    controller = module.get<HealthController>(HealthController);
  });

  describe('check health', () => {
    it('should return mock health api', async() => {
      const responseHealth = await controller.check();
      expect(responseHealth).toEqual(expect.objectContaining({
        "status": "ok",
        "info": {
          "mock-api-products": {
            "status": "up"
          }
        },
        "error": {},
        "details": {
          "mock-api-products": {
            "status": "up"
          }
        }
      }))
    });
  });
});
