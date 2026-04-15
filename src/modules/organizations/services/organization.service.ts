import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from '@organizations/dto/create-organization.dto';
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
}
