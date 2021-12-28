import { Body, Controller, Post, Res, Version } from '@nestjs/common';
import { Response } from 'express';
import { NewProductDto } from './dto/new-product.dto';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}
  @Version('1')
  @Post('register-product')
  async saveProduct(
    @Res() res: Response,
    @Body() newProductDto: NewProductDto,
  ) {
    const response = await this.apiService.registerProduct(newProductDto);
    res.status(response.code).json(response.data || {});
  }
}
