import { Injectable } from '@nestjs/common';
import { NewProductDto } from './dto/new-product.dto';
import { ProductService } from '../product/product.service';
import { ProductExtrasService } from '../product-extras/product-extras.service';

@Injectable()
export class ApiService {
  constructor(
    private readonly productService: ProductService,
    private readonly productExtrasService: ProductExtrasService,
  ) {}
  async registerProduct(newProductDto: NewProductDto) {
    // productService save
    // productExtrasService save
    const { sku, name, description, price, extras = [] } = newProductDto;
    const productResponse = await this.productService.saveProduct({
      sku,
      name,
      description,
      price,
    });
    console.log('productResponse', productResponse);
    if (!productResponse.success) {
    }
    if (extras.length) {
      const productExtrasResponse = await this.productExtrasService.saveExtras(
        extras,
        productResponse.data.id,
      );
      console.log('productExtrasResponse', productExtrasResponse);
      if (!productExtrasResponse.success) {
      }
    }
    return {
      code: 201,
      data: {},
    };
  }
}
