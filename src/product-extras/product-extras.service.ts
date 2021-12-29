import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProductExtras,
  ProductExtrasDocument,
} from './schema/product-extras.schema';
import { Model } from 'mongoose';
import { NewProductExtrasDto } from './dto/new-product-extras.dto';
import { UpdateProductExtrasDto } from './dto/update-product-extras.dto';
import { ProductService } from "../product/product.service";

@Injectable()
export class ProductExtrasService {
  constructor(
      @InjectModel(ProductExtras.name) private productExtraModel: Model<ProductExtrasDocument>,
      private productService: ProductService
  ) {}

  /**
   * Function to update a product extra information
   * @param {string} productExtraId
   * @param {Object} updateProductExtrasDto
   * @param {string} updateProductExtrasDto.extras.name
   * @param {string} updateProductExtrasDto.extras.description
   */
  async updateExtra(productExtraId, updateProductExtrasDto: UpdateProductExtrasDto) {
    try {
      // check extras validations
      const validations = this.checkExtrasParams([updateProductExtrasDto]);
      if (validations.hasError) {
        return {
          success: false,
          code: HttpStatus.BAD_REQUEST,
          data: { message: validations.messageError },
        };
      }
      const { name, description } = updateProductExtrasDto;

      // check if product exists
      const existsProductExtra = await this.checkIfProductExtraExistsById(productExtraId);
      if(!existsProductExtra){
        return {
          success: false,
          code: HttpStatus.NOT_FOUND,
          data: { message: "Product extra was not found for given product extra id" },
        };
      }
      // update data
      await this.productExtraModel.findByIdAndUpdate(productExtraId, {
        name, description
      });
      return {
        success: true,
        code: HttpStatus.OK,
        data: {
          message: "Product extra updated successfully",
        },
      };
    } catch (e) {
      return {
        success: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {
          message: `Error in updateExtra, ${e.message}`,
        },
      };
    }
  }

  /**
   * Function to get product extras by product id and enabled ones
   * @param {string} productId - _id of collection Product
   */
  async getProductExtrasByProductId(productId) {
    try {
      // no matched queries returns empty array
      return await this.productExtraModel.find({ productId, enabled: true });
    } catch (e) {
      return [];
    }
  }

  /**
   * Function to check if product exists by _id
   * @param id - _id of collection Product
   */
  async checkIfProductExtraExistsById(id: string) {
    try {
      return await this.productExtraModel.findById(id);
    } catch (e) {
      return null;
    }
  }

  /**
   * Function to save product extras
   * @param {Object[]} newProductExtrasDto.extras
   * @param {string} newProductExtrasDto.extras.name
   * @param {string} newProductExtrasDto.extras.description
   * @param {string} newProductExtrasDto.productId - _id from collection Product
   */
  async saveExtras(newProductExtrasDto: NewProductExtrasDto) {
    try {
      const { productId, extras } = newProductExtrasDto;
      if (!productId) {
        return {
          success: false,
          code: HttpStatus.BAD_REQUEST,
          data: { message: 'Product Id is missing' },
        };
      }
      // check extras validations
      const validations = this.checkExtrasParams(extras);
      if (validations.hasError) {
        return {
          success: false,
          code: HttpStatus.BAD_REQUEST,
          data: { message: validations.messageError },
        };
      }

      // check if product id exists
      const existsProduct = await this.productService.checkIfProductExistsById(productId);
      if(!existsProduct){
        return {
          success: false,
          code: HttpStatus.NOT_FOUND,
          data: { message: "Product was not found for given product id" },
        };
      }

      // concat productId for all extras
      extras.forEach((element) => {
        element.productId = productId;
      });
      await this.productExtraModel.insertMany(extras);
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: {},
      };
    } catch (e) {
      return {
        success: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {
          message: `Error in saveExtras, ${e.message}`,
        },
      };
    }
  }

  /**
   * Function to check extra params properties
   * @param {Object[]} extras
   * @param {string} extras[].name
   * @param {number} extras[].price
   */
  checkExtrasParams(extras) {
    let hasError = false;
    let messageError = '';
    if(!extras || !extras.length) {
      hasError = true;
      messageError = 'Error, extras list is required';
      return { hasError, messageError };
    }
    for (let i = 0; i < extras.length; i++) {
      const currentExtra = extras[i];
      if (!currentExtra.name) {
        hasError = true;
        messageError = 'Error, extra name property is required';
        break;
      }
      if (!currentExtra.description) {
        hasError = true;
        messageError = 'Error, extra description is required';
        break;
      }
    }
    return { hasError, messageError };
  }
}
