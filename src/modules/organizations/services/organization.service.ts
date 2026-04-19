import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from '@organizations/dto/create-organization.dto';
import { UpdateOrganizationDto } from '@organizations/dto/update-organization.dto';
import { Organization } from '@organizations/entities/organization.entity';
import { OrganizationRepository } from '@organizations/repositories/organization.repository';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteMembershipCommand } from '@memberships/commands/delete-membership.command';
import { Transactional } from 'typeorm-transactional';
import { Roles } from '@memberships/enums/roles.enum';
import { CreateMembershipCommand } from '@memberships/commands/create-membership.command';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async findMany(
    dto: PaginationDto,
    userId: string,
  ): Promise<PaginatedResponse<Organization>> {
    return this.organizationRepository.findManyForUser(dto, userId);
  }

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
      new CreateMembershipCommand(organization.id, userId, Roles.Owner),
    );
    return organization;
  }

  async update(id: string, dto: UpdateOrganizationDto): Promise<boolean> {
    return await this.organizationRepository.update(id, dto);
  }

  @Transactional()
  async delete(id: string, userId: string): Promise<boolean> {
    const organization = await this.organizationRepository.delete(id);
    await this.commandBus.execute(new DeleteMembershipCommand(id, userId));
    return organization;
  }
}
