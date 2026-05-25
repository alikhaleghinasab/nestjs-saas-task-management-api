import { User } from '@users/entities/user.entity';

export type AuthUser = Pick<User, 'id' | 'email' | 'password' | 'isActive'>;
