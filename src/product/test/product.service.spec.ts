import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ProductDocument } from '../schema/product.schema';
import { NewProductDto } from '../dto/new-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InternalCacheService } from '../../internal-cache/internal-cache.service';

describe('** ProductService Tests **', () => {
  let productService: ProductService;
  let productModel: Model<ProductDocument>;
  let internalCacheService: InternalCacheService;

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
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: InternalCacheService,
          useValue: {
            setCacheDataFromProduct: jest.fn().mockResolvedValue(null),
            getCacheDataFromProduct: jest.fn()
          }
        }
      ],
    }).compile();
    productService = module.get<ProductService>(ProductService);
    internalCacheService = module.get<InternalCacheService>(InternalCacheService);
    productModel = module.get<Model<ProductDocument>>(getModelToken('Product'));
  });

  afterEach(() => jest.clearAllMocks());

  describe('checkIfProductExistsById Tests', () => {
    it('should return valid Product if it exists', async() => {
      const mockProductId = "someId";
      productModel.findById = jest.fn().mockResolvedValue({
        _id: 'someId',
        enabled: true,
        price: 12,
        description: 'NA',
        name: 'someName',
        sku: 'someSku',
      });
      const response =  await productService.checkIfProductExistsById(mockProductId);
      expect(response).toEqual(expect.objectContaining({
        enabled: true,
        price: 12,
        _id: 'someId',
        description: 'NA',
        name: 'someName',
        sku: 'someSku',
      }));
    });
    it('should return null if function if some internal error is found ', async () => {
      const mockProductId = "someId";
      productModel.findById = jest.fn().mockImplementation(() => {
        throw new Error('MOCK ERROR FIND BY ID');
      });
      const response =  await productService.checkIfProductExistsById(mockProductId);
      expect(response).toEqual(null);
    });
  });

  describe('getCacheData Tests', () => {
    it('should return cache data if it exists', async() => {
      const mockProductId = '';
      internalCacheService.getCacheDataFromProduct = jest.fn().mockResolvedValue({
        cacheName: 'SomeNameCache', cacheSku: 'SomeNameSku'
      });
      const response = await productService.getCacheData(mockProductId);
      expect(response).toEqual(expect.objectContaining({
        cacheSku: 'SomeNameSku', cacheName: 'SomeNameCache'
      }))
    });
  });

  describe('updateProduct Tests', () => {
    it('should return success false and code 400 if put product params are missing', async () => {
      const mockProductId = "someId";
      const mockUpdateProduct: UpdateProductDto = {
        name: '',
        description: '',
        price: 10,
      };
      const response = await productService.updateProduct(mockProductId, mockUpdateProduct);
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(400);
    });
    it('should return success false and code 404 if product does not exist ', async() => {
      const mockProductId = "someMissingId";
      const mockUpdateProduct: UpdateProductDto = {
        name: 'someProductName',
        description: 'someProductDescription',
        price: 10,
      };
      productService.checkIfProductExistsById = jest.fn().mockResolvedValue(null);
      const response = await productService.updateProduct(mockProductId, mockUpdateProduct);
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(404);
    });
    it('should return success false and code 500 if some internal error is found', async() => {
      const mockProductId = "someId";
      const mockUpdateProduct: UpdateProductDto = {
        name: 'someProductName',
        description: 'someProductDescription',
        price: 10,
      };
      productService.checkIfProductExistsById = jest.fn().mockImplementation(() => {
        throw new Error('MOCK ERROR UPDATE PRODUCT');
      });
      const response = await productService.updateProduct(mockProductId, mockUpdateProduct);
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(500);
    });
    it('should return success true and code 200 product is updated successfully', async() => {
      const mockProductId = "someUpdatedId";
      const mockUpdateProduct: UpdateProductDto = {
        name: 'someProductName',
        description: 'someProductDescription',
        price: 10,
      };
      productService.checkIfProductExistsById = jest.fn().mockResolvedValue({
        _id: 'someUpdatedId'
      });
      productModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
        _id: 'someUpdatedId',
        enabled: true,
        price: 12.5,
        description: 'SomeData',
        name: 'Product name updated',
        sku: 'SKU123777',
        createdAt: '2021-12-29T04:47:11.476Z',
        updatedAt: '2021-12-29T05:57:30.318Z'
      });
      const response = await productService.updateProduct(mockProductId, mockUpdateProduct);
      expect(response.success).toEqual(true);
      expect(response.code).toEqual(200);
    });
  });

  describe('saveProduct Tests', () => {
    it('should return success false and code 400 if post product params are missing', async () => {
      const mockNewProduct: NewProductDto = {
        sku: '',
        name: '',
        description: '',
        price: 10,
      };
      const response = await productService.saveProduct(mockNewProduct);
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(400);
    });
    it('should return success false and code 400 if product already exists', async () => {
      const mockNewProduct: NewProductDto = {
        sku: 'someSku',
        name: 'someName',
        description: 'someDescription',
        price: 10,
      };
      productModel.findOne = jest.fn().mockResolvedValue({
        _id: 'someProductId',
        enabled: true,
        price: 12,
        description: 'NA',
        name: 'someName',
        sku: 'someSku',
      });
      const response = await productService.saveProduct(mockNewProduct);
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(400);
    });
    it('should return success false and code 500 if some internal error is found', async () => {
      const mockNewProduct: NewProductDto = {
        sku: 'someSku',
        name: 'someName',
        description: 'someDescription',
        price: 10.0,
      };
      productModel.findOne = jest.fn().mockResolvedValue(null);
      productModel.create = jest.fn().mockImplementation(() => {
        throw new Error('MOCK ERROR');
      });
      const response = await productService.saveProduct(mockNewProduct);
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(500);
    });
    it('should return success false and code 500 if product was not created', async () => {
      const mockNewProduct: NewProductDto = {
        sku: 'someSku',
        name: 'someName',
        description: 'someDescription',
        price: 1.0,
      };
      productModel.findOne = jest.fn().mockResolvedValue(null);
      productModel.create = jest.fn().mockResolvedValue(null);
      const response = await productService.saveProduct(mockNewProduct);
      expect(response.success).toEqual(false);
      expect(response.code).toEqual(500);
    });
    it('should return success true and code 201 if product is created', async () => {
      const mockNewProduct: NewProductDto = {
        sku: 'someSku',
        name: 'someName',
        description: 'someDescription',
        price: 10.0,
      };
      productModel.findOne = jest.fn().mockResolvedValue(null);
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
      expect(response.data.productId).toEqual('61caa5b530a50a82c845a7d7');
    });
  });
});
