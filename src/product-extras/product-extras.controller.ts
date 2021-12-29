import { Body, Controller, Param, Post, Put, Res, Version } from '@nestjs/common';
import { Response } from "express";
import { NewProductExtrasDto } from "./dto/new-product-extras.dto";
import { ProductExtrasService } from "./product-extras.service";
import { UpdateProductExtrasDto } from "./dto/update-product-extras.dto";

@Controller('product-extras')
export class ProductExtrasController {

    constructor(private readonly productExtrasService: ProductExtrasService) {}

    @Version('1')
    @Post('/')
    async saveProductExtras(@Res() res: Response, @Body() newProductExtrasDto: NewProductExtrasDto) {
        const response = await this.productExtrasService.saveExtras(newProductExtrasDto);
        res.status(response.code).json(response.data || {});
    }

    @Version('1')
    @Put('/:productExtraId')
    async updateProduct(@Res() res: Response, @Param() params,
                        @Body() updateProductExtrasDto: UpdateProductExtrasDto) {
        const response = await this.productExtrasService.updateExtra(params.productExtraId, updateProductExtrasDto);
        res.status(response.code).json(response.data || {});
    }

}
