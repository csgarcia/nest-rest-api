import { Test, TestingModule } from '@nestjs/testing';
import { ImplementationService } from '../implementation.service';
import { ProductService } from '../../product/product.service';
import { ProductExtrasService } from '../../product-extras/product-extras.service';
import { ApiService } from '../../api/api.service';
import { GetProductInfoDto } from "../dto/get-product-info.dto";
import {HttpStatus} from "@nestjs/common";

describe('ImplementationService', () => {
  let service: ImplementationService;
  let productService: ProductService;
  let productExtrasService: ProductExtrasService;
  let apiService: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImplementationService,
        {
          provide: ProductService,
          useValue: {
            checkIfProductExistsById: jest.fn()
          }
        },
        {
          provide: ProductExtrasService,
          useValue: {
            getProductExtrasByProductId: jest.fn()
          }
        },
        {
          provide: ApiService,
          useValue: {
            invokeHttpCall: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<ImplementationService>(ImplementationService);
    productService = module.get<ProductService>(ProductService);
    productExtrasService = module.get<ProductExtrasService>(ProductExtrasService);
    apiService = module.get<ApiService>(ApiService);

  });

  afterEach(() => jest.clearAllMocks());

  describe('getProductInfo', () => {
    it('should return success false and code 400 if product id is missing', async() => {
      const getProductInfoDto: GetProductInfoDto = {
        productId: ''
      };
      const response = await service.getProductInfo(getProductInfoDto);
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(400);
    });
    it('should return success false and code 404 if product does not exist', async() => {
      const getProductInfoDto: GetProductInfoDto = {
        productId: 'someProductId'
      };
      productService.checkIfProductExistsById = jest.fn().mockResolvedValue(null);
      const response = await service.getProductInfo(getProductInfoDto);
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(404);
    });
    it('should return success false and code 500 if some internal error is found', async() => {
      const getProductInfoDto: GetProductInfoDto = {
        productId: 'someProductId'
      };
      productService.checkIfProductExistsById = jest.fn().mockImplementation(() => {
        throw new Error('MOCK ERROR IMPL SERVICE');
      });
      const response = await service.getProductInfo(getProductInfoDto);
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(500);
    });
    it('should return success true and code 200 for valid product without extras and external api info',
        async() => {
          const getProductInfoDto: GetProductInfoDto = {
            productId: 'someProductId'
          };
          productService.checkIfProductExistsById = jest.fn().mockResolvedValue({
            "_id" : "someProductId",
            "enabled" : true,
            "price" : 12,
            "description" : "NA",
            "name" : "Product name",
            "sku" : "SKU1234"
          });
          productExtrasService.getProductExtrasByProductId = jest.fn().mockResolvedValue([]);
          apiService.invokeHttpCall = jest.fn().mockResolvedValue({
            data: {},
            status: HttpStatus.NOT_FOUND,
            statusText: 'No data found',
          })
          const response = await service.getProductInfo(getProductInfoDto);
          expect(response.success).toEqual(true);
          expect(response.code).toEqual(200);
          expect(response.data).toEqual(expect.objectContaining({
            product: {
              "_id" : "someProductId",
              "enabled" : true,
              "price" : 12,
              "description" : "NA",
              "name" : "Product name",
              "sku" : "SKU1234"
            },
            productExtras: [],
            externalApiInfo: {}
          }));
        });
    it('should return success true and code 200 for product with extras and no external api info', async() => {
      const getProductInfoDto: GetProductInfoDto = {
        productId: 'someProductId'
      };
      productService.checkIfProductExistsById = jest.fn().mockResolvedValue({
        _id : "someProductId",
        enabled : true,
        price : 12,
        description : "NA",
        name : "Product name",
        sku : "SKU1234"
      });
      productExtrasService.getProductExtrasByProductId = jest.fn().mockResolvedValue([{
        _id: "someExtraId",
        enabled: true,
        description: "This is extra data",
        name: "someName",
        productId: "someProductId",
      }]);
      apiService.invokeHttpCall = jest.fn().mockResolvedValue({
        data: {},
        status: HttpStatus.NOT_FOUND,
        statusText: 'No data',
      })
      const response = await service.getProductInfo(getProductInfoDto);
      expect(response.success).toEqual(true);
      expect(response.code).toEqual(200);
      expect(response.data).toEqual(expect.objectContaining({
        product: {
          "_id" : "someProductId",
          "enabled" : true,
          "price" : 12,
          "description" : "NA",
          "name" : "Product name",
          "sku" : "SKU1234"
        },
        productExtras: [{
          _id: "someExtraId",
          enabled: true,
          description: "This is extra data",
          name: "someName",
          productId: "someProductId",
        }],
        externalApiInfo: {}
      }));
    });
    it('should return success true and code 200 for valid product with extras and external api info', async() => {
      const getProductInfoDto: GetProductInfoDto = {
        productId: 'someProductId'
      };
      productService.checkIfProductExistsById = jest.fn().mockResolvedValue({
        _id : "someProductId",
        enabled : true,
        price : 1,
        description : "NA",
        name : "Product name",
        sku : "SKU1234"
      });
      productExtrasService.getProductExtrasByProductId = jest.fn().mockResolvedValue([
        {
          _id: "someExtraId",
          enabled: true,
          description: "This is extra data",
          name: "someName",
          productId: "someProductId",
        }
      ]);
      apiService.invokeHttpCall = jest.fn().mockResolvedValue({
        data: {
          external_api_info: 'This is a mock message that should be resolved by an external api',
          productId: 'mockProductId'
        },
        status: HttpStatus.OK,
        statusText: 'No data',
      })
      const response = await service.getProductInfo(getProductInfoDto);
      console.log(response);
      expect(response.success).toEqual(true);
      expect(response.code).toEqual(200);
      expect(response.data).toEqual(expect.objectContaining({
        product: {
          "_id" : "someProductId",
          "enabled" : true,
          "price" : 1,
          "description" : "NA",
          "name" : "Product name",
          "sku" : "SKU1234"
        },
        productExtras: [
          {
            _id: "someExtraId",
            enabled: true,
            description: "This is extra data",
            name: "someName",
            productId: "someProductId",
          }
        ],
        externalApiInfo: {
          info: 'This is a mock message that should be resolved by an external api',
          externalProductId: 'mockProductId'
        }
      }));
    });
    it('should return success true and code 200 for valid product, no extras and default external ' +
        'api info if service resolves 200 and without data', async() => {
      const getProductInfoDto: GetProductInfoDto = {
        productId: 'someProductId'
      };
      productService.checkIfProductExistsById = jest.fn().mockResolvedValue({
        _id : "someProductId",
        enabled : true,
        price : 1,
        description : "NA",
        name : "Product name",
        sku : "SKU1234"
      });
      productExtrasService.getProductExtrasByProductId = jest.fn().mockResolvedValue([]);
      apiService.invokeHttpCall = jest.fn().mockResolvedValue({
        data: {},
        status: HttpStatus.OK,
        statusText: 'No data',
      })
      const response = await service.getProductInfo(getProductInfoDto);
      console.log(response);
      expect(response.success).toEqual(true);
      expect(response.code).toEqual(200);
      expect(response.data).toEqual(expect.objectContaining({
        product: {
          "_id" : "someProductId",
          "enabled" : true,
          "price" : 1,
          "description" : "NA",
          "name" : "Product name",
          "sku" : "SKU1234"
        },
        productExtras: [],
        externalApiInfo: {
          info: '',
          externalProductId: ''
        }
      }));
    });
  });


});
