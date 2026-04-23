import {
  Equal,
  FindOperator,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { DynamicFilterInvalidDataError } from '@common/errors/domain/dynamic-filter-invalid-data.error';

export type DynamicFilterOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'in';

export const DYNAMIC_FILTER_OPERATOR_MAP: Record<
  DynamicFilterOperator,
  (value: unknown) => FindOperator<unknown>
> = {
  '=': (value) => Equal(value),
  '!=': (value) => Not(Equal(value)),
  '>': (value) => MoreThan(value),
  '>=': (value) => MoreThanOrEqual(value),
  '<': (value) => LessThan(value),
  '<=': (value) => LessThanOrEqual(value),
  in: (value) => {
    if (!Array.isArray(value)) {
      throw new DynamicFilterInvalidDataError(`in operator requires an array`);
    }
    return In(value);
  },
};

export const DYNAMIC_FILTER_VALID_OPERATORS = Object.keys(
  DYNAMIC_FILTER_OPERATOR_MAP,
) as DynamicFilterOperator[];
