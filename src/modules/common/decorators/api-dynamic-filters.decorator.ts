import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import {
  DynamicFilterDto,
  FilterCriterionDto,
} from '../dto/dynamic-filter.dto';

export function ApiDynamicFilters() {
  return applyDecorators(ApiExtraModels(FilterCriterionDto, DynamicFilterDto));
}
