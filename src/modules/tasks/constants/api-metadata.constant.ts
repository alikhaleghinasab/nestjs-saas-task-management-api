import { ForbiddenException } from '@nestjs/common';
import { PROJECT_ERRORS } from '@projects/constants/errors.constant';
import { MEMBERSHIP_ERRORS } from '@memberships/constants/errors.constant';

export const TASK_UPSERT_EXCEPTIONS = [
  {
    exception: ForbiddenException,
    message: PROJECT_ERRORS.PROJECT_ORGANIZATION_MISMATCH,
  },
  {
    exception: ForbiddenException,
    message: MEMBERSHIP_ERRORS.USER_MEMBERSHIP_MISMATCH,
  },
];
