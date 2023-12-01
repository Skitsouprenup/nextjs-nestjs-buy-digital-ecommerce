import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TrInterceptResponse<T> {
  message: string;
  success: string;
  content: any;
  timeStamp: Date;
  status: string;
  path: string;
  error: string;
}

export class TransformInterceptor<T>
  implements NestInterceptor<T, TrInterceptResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TrInterceptResponse<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const path = context.switchToHttp().getRequest().url;

    //This handler handles a successful request/response
    //operation. error should be null here.
    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        success: data.success,
        content: data.content,
        timeStamp: new Date(),
        status: statusCode,
        path,
        error: null,
      })),
    );
  }
}
