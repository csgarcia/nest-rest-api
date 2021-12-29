import { Body, Controller, Post, Put, Res, Version, Param } from '@nestjs/common';
import { Response } from "express";
import { NewProductDto } from "./dto/new-product.dto";
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from "./product.service";

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @Version('1')
    @Post('/')
    async saveProduct(@Res() res: Response, @Body() newProductDto: NewProductDto) {
        const response = await this.productService.saveProduct(newProductDto);
        res.status(response.code).json(response.data || {});
    }

    @Version('1')
    @Put('/:productId')
    async updateProduct(@Res() res: Response, @Param() params,
                        @Body() updateProductDto: UpdateProductDto) {
        const response = await this.productService.updateProduct(params.productId, updateProductDto);
        res.status(response.code).json(response.data || {});
    }

}
