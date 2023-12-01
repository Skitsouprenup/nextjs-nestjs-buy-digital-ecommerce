import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

export interface HttpExceptionResponse {
  statusCode: number;
  message: string;
  error: string;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseException =
      exception instanceof HttpException ? exception.getResponse() : exception;

    const data = {
      success: false,
      statusCode: httpStatus,
      timeStamp: new Date().toString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message:
        (responseException as HttpExceptionResponse).error ||
        (responseException as HttpExceptionResponse).message ||
        responseException,
      exception: responseException as HttpExceptionResponse,
    };
    console.log('Exception caught in AllExceptionFilter: ', exception);

    httpAdapter.reply(ctx.getResponse(), data, httpStatus);
  }
}
