import { Test, TestingModule } from '@nestjs/testing';
import { ProductExtrasController } from '../product-extras.controller';
import { ProductExtrasService } from '../product-extras.service';
import { HttpStatus } from "@nestjs/common";
import { NewProductExtrasDto } from "../dto/new-product-extras.dto";
import { UpdateProductExtrasDto } from "../dto/update-product-extras.dto";

describe('ProductExtrasController', () => {
  let controller: ProductExtrasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductExtrasController],
      providers: [
        {
          provide: ProductExtrasService,
          useValue: {
            updateExtra: jest.fn().mockResolvedValue({
              success: true,
              code: HttpStatus.OK,
              data: {
                message: "[Mock] Product extra updated successfully",
              }
            }),
            saveExtras: jest.fn().mockResolvedValue({
              success: true,
              code: HttpStatus.CREATED,
              data: {
                message: "[Mock] Product extra created successfully",
              }
            })
          }
        }
      ]
    }).compile();
    controller = module.get<ProductExtrasController>(ProductExtrasController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('saveProductExtras', () => {
    it('should return product extra created', async() => {
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const newProductExtrasDto: NewProductExtrasDto = {
        productId: 'someProductId', extras: []
      };
      await controller.saveProductExtras(res, newProductExtrasDto);
      expect(res.status.mock.calls).toEqual([
        [201] //httpStatus: Created
      ]);
    });
  });

  describe('updateProductExtras', () => {
    it('should return product extra updated', async() => {
      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const updateProductExtrasDto: UpdateProductExtrasDto = {
        name: 'someName', description: 'someDescription'
      };
      const params = { productId: 'someProductId' };
      await controller.updateProductExtras(res, params, updateProductExtrasDto);
      expect(res.status.mock.calls).toEqual([
        [200] //httpStatus: ok
      ]);
    });
  });


});
