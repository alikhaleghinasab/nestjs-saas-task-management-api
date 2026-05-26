import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { paginate as paginateUtil } from '@common/utils/database/paginate.util';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { withOrg } from '../utils/with-org.util';
import { ITenantEntity } from '@organizations/interfaces/tenant-entity.interface';

export interface PaginateTenantParams<T> {
  paginationDto: PaginationDto;
  organizationId: string;
  where?: FindOptionsWhere<T>;
  options?: Omit<FindManyOptions<T>, 'skip' | 'take' | 'where'>;
}

export abstract class TenantBaseRepository<T extends ITenantEntity> {
  protected abstract readonly repo: Repository<T>;

  protected async paginate(
    params: PaginateTenantParams<T>,
  ): Promise<PaginatedResponse<T>> {
    const { paginationDto, organizationId, options = {}, where = {} } = params;
    const scopedWhere = withOrg(where, organizationId) as FindOptionsWhere<T>;

    return paginateUtil(this.repo, paginationDto, scopedWhere, options);
  }
}
