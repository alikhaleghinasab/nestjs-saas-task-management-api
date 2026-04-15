export interface CreateOrganizationParams {
  name: string;
  slug: string;
}

export type UpdateOrganizationParams = Partial<CreateOrganizationParams>;