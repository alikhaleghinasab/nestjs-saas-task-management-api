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
export class ApiSuccessResponseInterceptor implements NestInterceptor<
  unknown,
  ApiBaseResponse
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<ApiBaseResponse> {
    return next.handle().pipe(
      map((result: unknown) => {
        if (result instanceof ApiBaseResponse) {
          return result;
        }

        return new ApiSuccessResponse(result);
      }),
    );
  }
}
