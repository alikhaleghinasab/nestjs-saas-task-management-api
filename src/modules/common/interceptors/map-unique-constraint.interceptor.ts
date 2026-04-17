import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { UniqueConstraintException } from '@common/exceptions/unique-constraint.exception';
import { UniqueConstraintError } from '@common/errors/unique-constraint.error';

@Injectable()
export class MapUniqueErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof UniqueConstraintError) {
          return throwError(() => new UniqueConstraintException(error.message));
        }
        return throwError(() => error);
      }),
    );
  }
}
