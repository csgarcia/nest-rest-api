import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProductExtras,
  ProductExtrasDocument,
} from './schema/product-extras.schema';
import { Model } from 'mongoose';
import { NewProductExtrasDto } from "./dto/new-product-extras.dto";
import { ProductService } from "../product/product.service";

@Injectable()
export class ProductExtrasService {
  constructor(
      @InjectModel(ProductExtras.name) private productExtraModel: Model<ProductExtrasDocument>,
      private productService: ProductService
  ) {}

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
