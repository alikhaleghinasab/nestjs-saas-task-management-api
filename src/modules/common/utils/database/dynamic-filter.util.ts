import { DynamicFilterDto } from '@common/dto/dynamic-filter.dto';
import { FindManyOptions, FindOperator, FindOptionsWhere } from 'typeorm';
import { DynamicFilterInvalidDataError } from '@common/errors/domain/dynamic-filter-invalid-data.error';
import {
  DYNAMIC_FILTER_OPERATOR_MAP,
  DynamicFilterOperator,
} from '@common/constants/dynamic-filter-operators.constants';

function resolveOperator(
  operator: DynamicFilterOperator,
  value: unknown,
): FindOperator<unknown> {
  const handler = DYNAMIC_FILTER_OPERATOR_MAP[operator];

  if (!handler) {
    throw new DynamicFilterInvalidDataError(
      `Unknown filter operator '${operator}'`,
    );
  }

  return handler(value);
}

export function dynamicFilterBuildWhere<T>(
  filterDto: DynamicFilterDto,
  allowedFilterFields: Array<keyof T & string>,
): FindOptionsWhere<T> {
  const filters = filterDto.filters ?? [];

  const where: FindOptionsWhere<T> = {} as FindOptionsWhere<T>;

  for (const filter of filters) {
    if (
      !/^[a-zA-Z0-9_]+$/.test(filter.field) ||
      !allowedFilterFields.includes(filter.field as keyof T & string)
    ) {
      throw new DynamicFilterInvalidDataError(
        `Filtering by field '${filter.field}' is not allowed. Allowed fields: ${allowedFilterFields.join(', ')}`,
      );
    }

    where[filter.field] = resolveOperator(filter.operator, filter.value);
  }

  return where;
}
