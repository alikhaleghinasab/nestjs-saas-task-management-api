import { DomainErrorMap } from './domain-error-map.type';

export function mergeDomainErrorMaps(
  ...maps: DomainErrorMap[]
): DomainErrorMap {
  return maps.flat();
}
