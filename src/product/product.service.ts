import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';
import { NewProductDto } from "./dto/new-product.dto";
import {UpdateProductDto} from "./dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}


  /**
   * Function to update product information
   * @param {string} productId - _id from collection Product
   * @param updateProductDto
   * @param {string} updateProductDto.name
   * @param {string} updateProductDto.description - optional
   * @param {number} updateProductDto.price
   */
  async updateProduct(productId, updateProductDto: UpdateProductDto) {
    try {
      const { name, price, description } = updateProductDto;
      // validate params
      if (!name || !price) {
        return {
          success: false,
          code: HttpStatus.BAD_REQUEST,
          data: {
            message:
                'Missing params, please check if sku: string, name: string or price: number params are correct',
          },
        };
      }
      // check if product exists
      const existsProduct = await this.checkIfProductExistsById(productId);
      if(!existsProduct){
        return {
          success: false,
          code: HttpStatus.NOT_FOUND,
          data: { message: "Product was not found for given product id" },
        };
      }
      // update data
      await this.productModel.findByIdAndUpdate(productId, {
        name, price, description
      });
      return {
        success: true,
        code: HttpStatus.OK,
        data: {
          message: "Product updated successfully",
        },
      };
    } catch (e) {
      return {
        success: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {
          message: `Error in updateProduct, ${e.message}`,
        },
      };
    }
  }

  /**
   * Function to check if product exists by _id
   * @param id - _id of collection Product
   */
  async checkIfProductExistsById(id: string) {
    try {
      return await this.productModel.findById(id);
    } catch (e) {
      return null;
    }
  }

  /**
   * function to save product
   * @param {Object} newProductDto
   * @param {string} newProductDto.sku
   * @param {string} newProductDto.name
   * @param {string} newProductDto.description - optional
   * @param {number} newProductDto.price
   */
  async saveProduct(newProductDto: NewProductDto) {
    try {
      const { sku, name, description, price } = newProductDto;
      // validate params
      if (!sku || !name || !price) {
        return {
          success: false,
          code: HttpStatus.BAD_REQUEST,
          data: {
            message:
              'Missing params, please check if sku: string, name: string or price: number params are correct',
          },
        };
      }
      // check if sku exists
      const existsSku = await this.productModel.findOne({ sku });
      if(existsSku) {
        return {
          success: false,
          code: HttpStatus.BAD_REQUEST,
          data: {
            message: 'Product already exists with given sku',
          },
        };
      }

      // create product
      const productCreated = await this.productModel.create({
        sku, name, price, description,
      });
      if (!productCreated) {
        return {
          success: false,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          data: {
            message: 'Error, product could not be created',
          },
        };
      }

      return {
        success: true,
        code: HttpStatus.CREATED,
        data: {
          productId: productCreated._id.toString(),
        },
      };

    } catch (e) {
      return {
        success: false,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {
          message: `Error in saveProduct, ${e.message}`,
        },
      };
    }
  }
}
