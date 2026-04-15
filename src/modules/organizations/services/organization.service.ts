import { PaginationDto } from '@common/dto/pagination.dto';
import { EntityNotFoundException } from '@common/exceptions/entity-not-found.exception';
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

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findById(id);
    if (!organization) throw new EntityNotFoundException();
    return organization;
  }

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationRepository.create(dto);
  }

  async update(id: string, dto: UpdateOrganizationDto): Promise<void> {
    const success = await this.organizationRepository.update(id, dto);
    if (!success) throw new EntityNotFoundException();
  }

  async delete(id: string): Promise<void> {
    const success = await this.organizationRepository.delete(id);
    if (!success) throw new EntityNotFoundException();
  }
}
