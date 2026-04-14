import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiSuccessResponse } from '@common/responses/api-success-response.dto';
import { ApiBaseResponse } from '@common/responses/api-base-response.dto';

@Injectable()
export class ApiSuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof ApiBaseResponse) {
          return data;
        }

        return new ApiSuccessResponse(data);
      }),
    );
  }
}
