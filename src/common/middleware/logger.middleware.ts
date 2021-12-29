import * as fs from 'fs';
import { Logger, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');
    use(req: Request, res: Response, next: NextFunction): any {
        const start = Date.now();
        const { method, baseUrl } = req;
        res.on('close', () => {
            const { statusCode } = res;
            const stop = Date.now()
            const milliseconds = (stop - start);
            const log = `${method} ${baseUrl} ${statusCode} - duration: ${milliseconds} ms`;
            this.logger.log(log);
            fs.appendFile('logs.txt', `${log}\n`, (err) => {
                if(err) console.error(err);
            })
        });
        next();
    }
}
