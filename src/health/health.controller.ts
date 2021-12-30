import {Controller, Get} from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private healthCheckService: HealthCheckService,
              private httpHealthIndicator: HttpHealthIndicator) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
        () => this.httpHealthIndicator
            .pingCheck('mock-api-products', 'https://61cc0fd9198df60017aebe51.mockapi.io')
    ]);
  }

}
