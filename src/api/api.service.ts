import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiService {

    constructor(private readonly httpService: HttpService) {}

    async invokeHttpCall(request: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        try {
            const data = this.httpService.request(request);
            const httpResponse = await firstValueFrom(data);
            const resp: AxiosResponse = {
                data: httpResponse.data,
                status: httpResponse.status,
                statusText: '',
                headers: null,
                config: null,
            };
            return resp
        } catch (e) {
            const resp: AxiosResponse = {
                data: {},
                status: HttpStatus.NOT_FOUND,
                statusText: e.message,
                headers: null,
                config: null,
            };
            return resp;
        }
    };

}
