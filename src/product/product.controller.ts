import { Controller, Version, Post, Res } from '@nestjs/common';
import { ProductService } from './product.service';
import { Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Version('1')
  @Post()
  async saveProduct(@Res() res: Response) {
    const response = await this.productService.saveProduct();
    res.status(response.code).json(response.data || {});
  }
}
