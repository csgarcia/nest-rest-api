import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProductExtras,
  ProductExtrasDocument,
} from './schema/product-extras.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductExtrasService {
  constructor(
    @InjectModel(ProductExtras.name)
    private productExtraModel: Model<ProductExtrasDocument>,
  ) {}

  /**
   * Function to save product extras
   * @param {Object[]} extras
   * @param {string} extras.name
   * @param {string} extras.description
   * @param {string} productId - _id from collection Product
   */
  async saveExtras(extras, productId) {
    try {
      if (!productId) {
        return {
          success: false,
          code: 400,
          data: { message: 'Product Id is missing' },
        };
      }
      const validations = this.checkExtrasParams(extras);
      if (validations.hasError) {
        return {
          success: false,
          code: 400,
          data: { message: validations.messageError },
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
        code: 500,
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
