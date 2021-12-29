import { Controller, Get, Param, Res, Version } from '@nestjs/common';
import { Response } from "express";
import { ImplementationService } from "./implementation.service";
import {GetProductInfoDto} from "./dto/get-product-info.dto";

@Controller('implementation')
export class ImplementationController {

    constructor(private readonly implementationService: ImplementationService) {}

    @Version('1')
    @Get('/:productId')
    async getProductInfo(@Res() res: Response, @Param() getProductInfoDto: GetProductInfoDto) {
        const response = await this.implementationService.getProductInfo(getProductInfoDto);
        res.status(response.code).json(response.data);
    }

}
