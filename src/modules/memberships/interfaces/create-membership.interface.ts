import { RolesEnum } from '../enums/roles.enum';

export class CreateMembershipParams {
  userId: string;
  organizationId: string;
  role: RolesEnum;
}
