import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from '../api.service';
import { HttpService } from "@nestjs/axios";
import { AxiosRequestConfig } from "axios";

describe('ApiService', () => {
  let service: ApiService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiService,
        {
          // mock http request axios module
          provide: HttpService,
          useValue: {
            request: jest.fn()
          }
        },
      ],
    }).compile();
    service = module.get<ApiService>(ApiService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('invokeHttpCall tests', () => {
    it('should return http not found response if some internal error is found', async() => {
      const request: AxiosRequestConfig = {
        method: "POST",
        url: 'someEndpoint'
      };
      httpService.request = jest.fn().mockImplementation(() => {
        throw new Error('MOCK ERROR HTTP CALL');
      });
      const response = await service.invokeHttpCall(request);
      expect(response.status).toEqual(404)
    });
  })

});
