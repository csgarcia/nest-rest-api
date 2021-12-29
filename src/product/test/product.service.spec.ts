import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ProductDocument } from '../schema/product.schema';

describe('** ProductService Tests **', () => {
  let productService: ProductService;
  let productModel: Model<ProductDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          // define mocks for mongoose operations, this functions should be mocked on each test
          provide: getModelToken('Product'),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();
    productService = module.get<ProductService>(ProductService);
    productModel = module.get<Model<ProductDocument>>(getModelToken('Product'));
  });

  afterEach(() => jest.clearAllMocks());

  describe('Save Product Tests', () => {
    it('should return success false and code 400 if post product params are missing', async () => {
      const mockNewProduct = {
        sku: '',
        name: '',
        description: '',
        price: 10,
      };
      const response = await productService.saveProduct(mockNewProduct);
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(400);
    });

    it('should return success false and code 500 if some internal error is found', async () => {
      const mockNewProduct = {
        sku: 'someSku',
        name: 'someName',
        description: 'someDescription',
        price: 10.0,
      };
      productModel.create = jest.fn().mockImplementation(() => {
        throw new Error('MOCK ERROR');
      });
      const response = await productService.saveProduct(mockNewProduct);
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(500);
    });

    it('should return success false and code 500 if product was not created', async () => {
      const mockNewProduct = {
        sku: 'someSku',
        name: 'someName',
        description: 'someDescription',
        price: 1.0,
      };
      productModel.create = jest.fn().mockResolvedValue(null);
      const response = await productService.saveProduct(mockNewProduct);
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(500);
    });

    it('should return success true and code 201 if product is created', async () => {
      const mockNewProduct = {
        sku: 'someSku',
        name: 'someName',
        description: 'someDescription',
        price: 10.0,
      };
      productModel.create = jest.fn().mockResolvedValue({
        enabled: true,
        price: 10.0,
        description: 'someDescription',
        name: 'someName',
        sku: 'someSku',
        _id: '61caa5b530a50a82c845a7d7',
      });
      const response = await productService.saveProduct(mockNewProduct);
      expect(response.success).toEqual(true);
      expect(response.code).toEqual(201);
      expect(response.data.id).toEqual('61caa5b530a50a82c845a7d7');
    });
  });
});
