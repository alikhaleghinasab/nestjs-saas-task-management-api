import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiPaginatedResponse } from '../responses/api-paginated-response.dto';

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
      map((result: any) => {
        const looksPaginated =
          result &&
          Array.isArray(result.data) &&
          typeof result.meta === 'object';

        if (!looksPaginated) {
          return result;
        }

        return new ApiPaginatedResponse(result.data, result.meta);
      }),
    );
  }
}
