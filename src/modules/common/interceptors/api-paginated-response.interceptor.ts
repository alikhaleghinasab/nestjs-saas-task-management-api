import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiPaginatedResponse } from '../responses/api-paginated-response.dto';
import { PaginatedResult } from '../responses/paginated-result.dto';

@Injectable()
export class ApiPaginatedResponseInterceptor<T> implements NestInterceptor<
  T,
  T | ApiPaginatedResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<T | ApiPaginatedResponse<T>> {
    return next.handle().pipe(
      map((result) => {
        if (!(result instanceof PaginatedResult)) {
          return result;
        }

        return new ApiPaginatedResponse(result.data, result.meta);
      }),
    );
  }
}
