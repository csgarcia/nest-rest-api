import { HttpStatus, Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { ProductExtrasService } from '../product-extras/product-extras.service';
import { GetProductInfoDto } from './dto/get-product-info.dto';
import { AxiosRequestConfig } from 'axios';
import { ApiService } from '../api/api.service';

@Injectable()
export class ImplementationService {

    constructor(private productService: ProductService,
                private productExtrasService: ProductExtrasService,
                private apiService: ApiService) {}

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

            // get product info by external API
            const mockProductId = 1;
            const endpoint = `/api/v1/products/${mockProductId}`;
            const request: AxiosRequestConfig = {
                method: "GET",
                url: `${process.env.EXTERNAL_PRODUCT_API}${endpoint}`
            };
            const externalProductInfoResponse = await this.apiService.invokeHttpCall(request);

            // get product data stored in cache
            const {
                cacheName,
                cacheSku
            } = await this.productService.getCacheData(productId);
            console.log(`cacheName: ${cacheName}, cacheSku: ${cacheSku}`);

            // prepare response
            let data = {
                product: {
                    _id: productId,
                    enabled: productInfo.enabled,
                    price: productInfo.price,
                    description: productInfo.description,
                    name: !cacheName ? productInfo.name : cacheName,
                    sku: !cacheSku ? productInfo.sku : cacheSku,
                },
                productExtras: productExtras,
                externalApiInfo: {}
            };
            if(externalProductInfoResponse.status === HttpStatus.OK){
                data.externalApiInfo = {
                    info: externalProductInfoResponse.data.external_api_info || '',
                    externalProductId: externalProductInfoResponse.data.productId || ''
                }
            }
            return {
                success: true,
                code: HttpStatus.OK,
                data
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
