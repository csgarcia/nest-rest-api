import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  /**
   * function to save product
   * @param {Object} productData
   * @param {string} productData.sku
   * @param {string} productData.name
   * @param {string} productData.description - optional
   * @param {number} productData.price
   */
  async saveProduct(productData) {
    try {
      const { sku, name, description = '', price } = productData;
      // validate params
      if (!sku || !name || !price) {
        return {
          success: false,
          code: 400,
          data: {
            message:
              'Missing params, please check if sku: string, name: string or price: number params are correct',
          },
        };
      }
      // create product
      const productCreated = await this.productModel.create({
        sku,
        name,
        price,
        description,
      });
      if (!productCreated) {
        return {
          success: false,
          code: 500,
          data: {
            message: 'Error, product could not be created',
          },
        };
      }
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: {
          id: productCreated._id.toString(),
        },
      };
    } catch (e) {
      return {
        success: false,
        code: 500,
        data: {
          message: `Error in saveProduct, ${e.message}`,
        },
      };
    }
  }
}
