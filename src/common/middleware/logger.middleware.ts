import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const time = new Date().toLocaleTimeString('en-GB');

    console.log(`[REQUEST] ${req.method} ${req.originalUrl} - ${time}`);

    // Mini reto: el tiempo se mide cuando la respuesta termina
    res.on('finish', () => {
      console.log(`${req.method} ${req.originalUrl} - ${Date.now() - start}ms`);
    });

    next();
  }
}