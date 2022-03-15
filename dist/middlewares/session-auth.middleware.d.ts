import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
export declare class SessionAuthMiddleware implements NestMiddleware {
    use(req: any, res: Response, next: NextFunction): Promise<void>;
}
