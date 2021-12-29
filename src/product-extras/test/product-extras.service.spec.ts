import { Test, TestingModule } from '@nestjs/testing';
import { ProductExtrasService } from '../product-extras.service';
import { ProductService } from '../../product/product.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ProductExtrasDocument } from '../schema/product-extras.schema';
import { NewProductExtrasDto } from '../dto/new-product-extras.dto';

describe('ProductExtrasService', () => {
  let productExtrasService: ProductExtrasService;
  let productExtrasModel: Model<ProductExtrasDocument>;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductExtrasService,
        {
          // define mocks for mongoose operations, this functions should be mocked on each test
          provide: getModelToken('ProductExtras'),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            insertMany: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          // mocking product service dependency
          provide: ProductService,
          useValue: {
            checkIfProductExistsById: jest.fn()
          }
        }
      ],
    }).compile();

    // getting objects from module to overwrite with custom mocks
    productExtrasService = module.get<ProductExtrasService>(ProductExtrasService);
    productExtrasModel = module.get<Model<ProductExtrasDocument>>(getModelToken('ProductExtras'));
    productService = module.get<ProductService>(ProductService);

  });

  afterEach(() => jest.clearAllMocks());

  describe('saveExtras tests', function () {
    it('should return success false and code 400 if product id is missing', async () => {
      // define mocks
      const mock: NewProductExtrasDto = { productId: '', extras: [] };
      // execute function
      const response = await productExtrasService.saveExtras(mock);
      // evaluate response
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(400);
    });

    it('should return success false and code 400 if checkExtraParams detect an error', async () => {
      // define mocks
      const mock: NewProductExtrasDto = {
        productId: 'someProductId',
        extras: [{ name: '', description: 'This is extra data' }]
      }
      productExtrasService.checkExtrasParams = jest.fn().mockImplementation(() => {
        return {
          hasError: true,
          messageError: 'Mock Error',
        }
      });
      // execute function
      const response = await productExtrasService.saveExtras(mock);
      // evaluate response
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(400);
    });

    it('should return success false and code 404 if product does not exists', async () => {
      // define mocks
      const mock: NewProductExtrasDto = {
        productId: 'someMissingProductId',
        extras: [{ name: '', description: 'This is extra data' }]
      }
      productExtrasService.checkExtrasParams = jest.fn().mockImplementation(() => {
        return { hasError: false }
      });
      productService.checkIfProductExistsById = jest.fn().mockResolvedValue(null);
      // execute function
      const response = await productExtrasService.saveExtras(mock);
      // evaluate response
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(404);
    });

    it('should return success false and code 500 if exception if some internal error is found', async () => {
      // define mocks
      const mock: NewProductExtrasDto = {
        productId: 'someProductId',
        extras: [{ name: 'someName', description: 'This is extra data' }]
      }
      productExtrasService.checkExtrasParams = jest.fn().mockImplementation(() => {
        return { hasError: false };
      });
      productService.checkIfProductExistsById = jest.fn().mockResolvedValue({
        _id: 'someProductId',
        enabled: true,
        price: 12,
        description: 'NA',
        name: 'someName',
        sku: 'someSku',
      });
      productExtrasModel.insertMany = jest.fn().mockImplementation(() => {
        throw new Error('MOCK ERROR!!');
      });
      // execute function
      const response = await productExtrasService.saveExtras(mock);
      // evaluate response
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(500);
    });

    it('should return success true and code 201 extras were created successfully', async () => {
      // define mocks
      const mock: NewProductExtrasDto = {
        productId: 'someOtherProductId',
        extras: [
          { name: 'someName', description: 'This is extra data' },
          { name: 'someOtherName', description: 'This another extra data' },
        ]
      }
      productExtrasService.checkExtrasParams = jest.fn().mockImplementation(() => {
        return { hasError: false };
      });
      productService.checkIfProductExistsById = jest.fn().mockResolvedValue({
        _id: 'someProductId',
        enabled: true,
        price: 12,
        description: 'NA',
        name: 'someName',
        sku: 'someSku',
      });
      productExtrasModel.insertMany = jest.fn().mockResolvedValue([
        {
          enabled: true,
          description: 'This is extra data',
          name: 'someName',
          productId: 'someProductId',
          _id: 'someOtherProductId',
          createdAt: '2021-12-29T01:03:23.527Z',
          updatedAt: '2021-12-29T01:03:23.527Z'
        },
        {
          enabled: true,
          description: 'This another extra data',
          name: 'someOtherName',
          productId: 'someProductId',
          _id: 'someOtherProductId',
          createdAt: '2021-12-29T01:03:23.527Z',
          updatedAt: '2021-12-29T01:03:23.527Z'
        }]);
      // execute function
      const response = await productExtrasService.saveExtras(mock);
      // evaluate response
      expect(response.success).toEqual(true);
      expect(response.code).toEqual(201);
    });
  });

  describe('check extras params tests', () => {
    it('should return has errors true if extras list is empty', () => {
      const mockExtras = [];
      const response = productExtrasService.checkExtrasParams(mockExtras);
      expect(response.hasError).toEqual(true);
    });
    it('should return has errors true if name is missing on a single extras object', () => {
      const mockExtras = [{ name: '', description: '' }];
      const response = productExtrasService.checkExtrasParams(mockExtras);
      expect(response.hasError).toEqual(true);
    });
    it('should return has errors true if name is missing on a multiple extras objects', () => {
      const mockExtras = [
        { name: 'someName', description: 'someDescription' },
        { name: '', description: 'someOtherDescription' },
      ];
      const response = productExtrasService.checkExtrasParams(mockExtras);
      expect(response.hasError).toEqual(true);
    });
    it('should return has errors true if extra description is missing on a single extras object', () => {
      const mockExtras = [{ name: 'someExtraName', description: '' }];
      const response = productExtrasService.checkExtrasParams(mockExtras);
      expect(response.hasError).toEqual(true);
    });
    it('should return has errors true if description is missing on a multiple extras objects', () => {
      const mockExtras = [
        { name: 'someName', description: 'someDescription' },
        { name: 'someOtherName', description: '' },
      ];
      const response = productExtrasService.checkExtrasParams(mockExtras);
      expect(response.hasError).toEqual(true);
    });
    it('should return has errors false if extras have a correct format', () => {
      const mockExtras = [
        { name: 'someExtraName', description: 'someDescription' },
      ];
      const response = productExtrasService.checkExtrasParams(mockExtras);
      expect(response.hasError).toEqual(false);
    });
  });
});
