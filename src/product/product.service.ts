import { Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class ProductService {
  async saveProduct() {
    return {
      code: HttpStatus.CREATED,
      data: {
        message: 'Product created',
      },
    };
  }
}
