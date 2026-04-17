import { EnsureAffected } from '@common/decorators/ensure-affected.decorator';
import { EnsureFound } from '@common/decorators/ensure-found.decorator';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from '@organizations/dto/create-organization.dto';
import { UpdateOrganizationDto } from '@organizations/dto/update-organization.dto';
import { Organization } from '@organizations/entities/organization.entity';
import { OrganizationRepository } from '@organizations/repositories/organization.repository';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOwnerMembershipCommand } from '@memberships/commands/create-owner-membership.command';
import { DeleteMembershipCommand } from '@memberships/commands/delete-membership.command';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async findMany(dto: PaginationDto): Promise<PaginatedResponse<Organization>> {
    return this.organizationRepository.findMany(dto);
  }

  @EnsureFound()
  async findOne(id: string): Promise<Organization> {
    return this.organizationRepository.findById(id);
  }

  @Transactional()
  async create(
    dto: CreateOrganizationDto,
    userId: string,
  ): Promise<Organization> {
    const organization = await this.organizationRepository.create(dto);
    await this.commandBus.execute(
      new CreateOwnerMembershipCommand(organization.id, userId),
    );
    return organization;
  }

  @EnsureAffected()
  async update(id: string, dto: UpdateOrganizationDto): Promise<boolean> {
    return await this.organizationRepository.update(id, dto);
  }

  @Transactional()
  @EnsureAffected()
  async delete(id: string, userId: string): Promise<boolean> {
    await this.commandBus.execute(new DeleteMembershipCommand(id, userId));
    return await this.organizationRepository.delete(id);
  }
}
