import { DomainErrorMap } from '@common/errors/maps/domain-error-map.type';
import { mergeDomainErrorMaps } from '@common/errors/maps/merge-domain-error-maps';
import { ORGANIZATION_DOMAIN_ERROR_MAP } from '@organizations/errors/organization-domain-error-map';

export const CORE_DOMAIN_ERROR_MAP: DomainErrorMap = mergeDomainErrorMaps(
  ORGANIZATION_DOMAIN_ERROR_MAP,
);
