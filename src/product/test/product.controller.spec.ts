import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from "@nestjs/common";
import { ProductController } from "../product.controller";
import { ProductService } from "../product.service";
import {NewProductDto} from "../dto/new-product.dto";
import {UpdateProductDto} from "../dto/update-product.dto";

describe('ProductExtrasController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            saveProduct: jest.fn().mockResolvedValue({
              success: true,
              code: HttpStatus.CREATED,
              data: {
                productId: 'someCreatedId',
              }
            }),
            updateProduct: jest.fn().mockResolvedValue({
              success: true,
              code: HttpStatus.OK,
              data: {
                message: '[Mock] Product updated successfully',
              }
            })
          }
        }
      ]
    }).compile();
    controller = module.get<ProductController>(ProductController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('saveProduct', () => {
    it('should return product created response', async() => {
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const newProductDto: NewProductDto = {
        sku: 'SKU', name: 'Name', description: 'Desc', price: 10
      };
      await controller.saveProduct(res, newProductDto);
      expect(res.status.mock.calls).toEqual([
        [201] //httpStatus: Created
      ]);
      expect(res.json.mock.calls).toEqual([
        [{
          productId: 'someCreatedId',
        }]
      ]);
    });
  });

  describe('updateProduct',() => {
    it('should return product updated response', async() => {
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const updateProductDto: UpdateProductDto = {
        name: 'Name', description: 'Desc', price: 10
      };
      const params = { productId: 'someProductId' };
      await controller.updateProduct(res, params, updateProductDto);
      expect(res.status.mock.calls).toEqual([
        [200]
      ]);
      expect(res.json.mock.calls).toEqual([
        [{
          message: '[Mock] Product updated successfully'
        }]
      ]);
    });
  });

});
