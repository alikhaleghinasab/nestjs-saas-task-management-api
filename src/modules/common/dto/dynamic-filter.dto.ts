import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from './pagination.dto';
import {
  DYNAMIC_FILTER_VALID_OPERATORS,
  DynamicFilterOperator,
} from '@common/constants/dynamic-filter-operators.constants';

export class FilterCriterionDto {
  @ApiProperty({
    description: 'The entity field name to apply the filter to',
    example: 'status',
  })
  @IsString()
  field: string;

  @ApiPropertyOptional({
    description: 'Comparison operator',
    enum: DYNAMIC_FILTER_VALID_OPERATORS,
    default: '=',
  })
  @IsOptional()
  @IsIn(DYNAMIC_FILTER_VALID_OPERATORS)
  operator: DynamicFilterOperator = '=';

  @ApiProperty({
    description: 'The value to compare against the field',
    example: 'IN_PROGRESS',
  })
  @IsDefined({ message: 'value cannot be empty' })
  value: unknown;
}

@ApiExtraModels(FilterCriterionDto)
export class DynamicFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description:
      'URL-encoded JSON array of FilterCriterionDto items. See FilterCriterionDto model for structure.',
    type: String,
    example: '',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? plainToInstance(FilterCriterionDto, parsed)
        : parsed;
    } catch {
      return value;
    }
  })
  @IsArray({ message: 'Filters must be a valid JSON array string' })
  @ValidateNested({ each: true })
  @Type(() => FilterCriterionDto)
  filters?: FilterCriterionDto[];
}
