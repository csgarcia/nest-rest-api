import {Body, Controller, Post, Res, Version} from '@nestjs/common';
import {Response} from "express";
import {NewProductExtrasDto} from "./dto/new-product-extras.dto";
import {ProductExtrasService} from "./product-extras.service";

@Controller('product-extras')
export class ProductExtrasController {

    constructor(private readonly productExtrasService: ProductExtrasService) {}

    @Version('1')
    @Post('/')
    async saveProductExtras(@Res() res: Response, @Body() newProductExtrasDto: NewProductExtrasDto) {
        const response = await this.productExtrasService.saveExtras(newProductExtrasDto);
        res.status(response.code).json(response.data || {});
    }

}
