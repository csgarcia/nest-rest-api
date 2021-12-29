import {HttpStatus, Injectable, NestMiddleware} from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): any {
        const { token } = req.headers;
        if(!token){
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: "No token"
            });
        }
        if(token !== process.env.TOKEN){
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: "Invalid token"
            });
        }
        console.log('valid token');
        next();
    }
}
