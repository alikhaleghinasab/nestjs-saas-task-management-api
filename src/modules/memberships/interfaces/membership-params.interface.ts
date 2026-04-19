import { Roles } from '../enums/roles.enum';

export interface CreateMembershipParams {
  userId: string;
  organizationId: string;
  role: Roles;
}

export type UpdateMembershipRoleParams = CreateMembershipParams;
