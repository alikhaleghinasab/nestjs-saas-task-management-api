import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';
import { UpdateOrganizationParams } from '../interfaces/organization-params.interface.ts';

export class UpdateOrganizationDto
  extends PartialType(CreateOrganizationDto)
  implements UpdateOrganizationParams {}
