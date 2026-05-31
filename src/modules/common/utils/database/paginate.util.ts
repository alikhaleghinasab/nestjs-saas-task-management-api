import { BaseIdEntity } from '@common/database/entities/base-id.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { PaginatedResult } from '@common/responses/paginated-result.dto';
import { PaginationMeta } from '@common/responses/pagination-meta.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

export async function paginate<T extends BaseIdEntity>(
  repo: Repository<T>,
  pagination: PaginationDto,
  where: FindOptionsWhere<T> = {},
  options: Omit<FindManyOptions<T>, 'skip' | 'take' | 'where'> = {},
): Promise<PaginatedResponse<T>> {
  const { page, limit } = pagination;

  const [data, total] = await repo.findAndCount({
    take: limit,
    skip: (page - 1) * limit,
    order: { id: 'DESC' } as FindOptionsOrder<T>,
    where,
    ...options,
  });
  const meta: PaginationMeta = {
    limit,
    page,
    total,
  };

  return new PaginatedResult(data, meta);
}

