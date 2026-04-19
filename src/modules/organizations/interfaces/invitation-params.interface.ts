import { Roles } from '@memberships/enums/roles.enum';

export interface InvitationParams {
  email: string;
  role: Roles;
  invitationToken: string;
  organizationId: string;
}
