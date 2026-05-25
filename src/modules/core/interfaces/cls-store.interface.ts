import { ClsStore } from 'nestjs-cls';

export interface AppClsStore extends ClsStore {
  organizationId?: string;
  userId?: string;
}
