import { EntityNotFoundException } from '@common/exceptions/entity-not-found.exception';
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

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationRepository.createOrganization(dto);
  }

  async update(id: string, dto: UpdateOrganizationDto): Promise<void> {
    const updateResult = await this.organizationRepository.updateOrganization(
      id,
      dto,
    );
    if (!updateResult) throw new EntityNotFoundException();
  }
}
