import { Injectable, NestMiddleware } from '@nestjs/common';
import { text } from 'body-parser';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TextBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    text()(req, res, next);
  }
}
