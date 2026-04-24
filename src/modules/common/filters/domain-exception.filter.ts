import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { DomainError } from '@common/errors/domain/domain.error';
import { HttpAdapterHost } from '@nestjs/core';

import { GLOBAL_DOMAIN_ERROR_MAP } from '@common/errors/maps/global-domain-error-map';
import { mergeDomainErrorMaps } from '@common/errors/maps/merge-domain-error-maps';
import { CORE_DOMAIN_ERROR_MAP } from '@core/errors/core-domain-error-map';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: DomainError, host: ArgumentsHost) {
    const map = mergeDomainErrorMaps(
      GLOBAL_DOMAIN_ERROR_MAP,
      CORE_DOMAIN_ERROR_MAP,
    );

    for (const entry of map) {
      if (exception instanceof entry.domain) {
        const httpException = entry.toHttp(exception);
        throw httpException;
      }
    }

    throw exception;
  }
}
