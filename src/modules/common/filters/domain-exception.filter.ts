import { Catch, ExceptionFilter } from '@nestjs/common';
import { DomainError } from '@common/errors/domain/domain.error';

import { GLOBAL_DOMAIN_ERROR_MAP } from '@common/errors/maps/global-domain-error-map';
import { mergeDomainErrorMaps } from '@common/errors/maps/merge-domain-error-maps';
import { CORE_DOMAIN_ERROR_MAP } from '@core/errors/core-domain-error-map';

const DOMAIN_ERROR_MAP = mergeDomainErrorMaps(
  GLOBAL_DOMAIN_ERROR_MAP,
  CORE_DOMAIN_ERROR_MAP,
);

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError): never {
    for (const entry of DOMAIN_ERROR_MAP) {
      if (exception instanceof entry.domain) {
        throw entry.toHttp(exception);
      }
    }

    throw exception;
  }
}
