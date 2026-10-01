import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const body = exception.getResponse();

    // ValidationPipe devuelve { message: string[] }, otras excepciones string u objeto
    let message: string | string[] = exception.message;
    if (typeof body === 'string') {
      message = body;
    } else if (typeof body === 'object' && body !== null && 'message' in body) {
      message = (body as { message: string | string[] }).message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}