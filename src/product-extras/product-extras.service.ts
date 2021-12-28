import { Injectable } from '@nestjs/common';
import { NewProductExtrasDto } from './dto/new-product-extras.dto';

@Injectable()
export class ProductExtrasService {
  async saveExtras(newProductExtrasDto: NewProductExtrasDto) {
    return {
      newProductExtrasDto,
    };
  }
}
