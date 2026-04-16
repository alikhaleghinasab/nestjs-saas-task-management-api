import { EnsureAffected } from '@common/decorators/ensure-affected.decorator';
import { EnsureFound } from '@common/decorators/ensure-found.decorator';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from '@organizations/dto/create-organization.dto';
import { UpdateOrganizationDto } from '@organizations/dto/update-organization.dto';
import { Organization } from '@organizations/entities/organization.entity';
import { OrganizationRepository } from '@organizations/repositories/organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async findMany(dto: PaginationDto): Promise<PaginatedResponse<Organization>> {
    return this.organizationRepository.findMany(dto);
  }

  @EnsureFound()
  async findOne(id: string): Promise<Organization> {
    return this.organizationRepository.findById(id);
  }

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationRepository.create(dto);
  }

  @EnsureAffected()
  async update(id: string, dto: UpdateOrganizationDto): Promise<boolean> {
    return await this.organizationRepository.update(id, dto);
  }

  @EnsureAffected()
  async delete(id: string): Promise<boolean> {
    return await this.organizationRepository.delete(id);
  }
}
