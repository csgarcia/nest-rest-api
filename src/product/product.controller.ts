import {Body, Controller, Post, Res, Version} from '@nestjs/common';
import {Response} from "express";
import {NewProductDto} from "./dto/new-product.dto";
import {ProductService} from "./product.service";

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @Version('1')
    @Post('/')
    async saveProduct(@Res() res: Response, @Body() newProductDto: NewProductDto) {
        const response = await this.productService.saveProduct(newProductDto);
        res.status(response.code).json(response.data || {});
    }

}
