import { HttpStatus, Injectable } from '@nestjs/common';
import { ProductService } from "../product/product.service";
import { ProductExtrasService } from "../product-extras/product-extras.service";
import { GetProductInfoDto } from "./dto/get-product-info.dto";

@Injectable()
export class ImplementationService {

    constructor(private productService: ProductService,
                private productExtrasService: ProductExtrasService) {}

    /**
     * Function to get whole product info, this merges, Product, ProductExtras and external API info
     * @param {Object} getProductInfoDto
     * @param {string} getProductInfoDto.productId - _id of collection Product
     */
    async getProductInfo(getProductInfoDto: GetProductInfoDto) {
        const { productId } = getProductInfoDto;
        try {
            // check param
            if(!productId){
                return {
                    success: false,
                    code: HttpStatus.BAD_REQUEST,
                    data: { message: 'Missing params, please check if productId is passed' },
                };
            }
            // check and get if product exists
            const productInfo = await this.productService.checkIfProductExistsById(productId);
            if(!productInfo){
                return {
                    success: false,
                    code: HttpStatus.NOT_FOUND,
                    data: { message: "Product was not found for given product id" },
                };
            }

            // get product extras
            const productExtras = await this.productExtrasService.getProductExtrasByProductId(productId);

            return {
                success: true,
                code: HttpStatus.OK,
                data: {
                    productInfo,
                    productExtras
                },
            };
        } catch (e) {
            return {
                success: false,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                data: {
                    message: `Error in getProductInfo, ${e.message}`,
                },
            };
        }
    }
}
