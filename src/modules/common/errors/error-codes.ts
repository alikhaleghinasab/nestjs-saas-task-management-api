export enum ErrorCode {
  Internal = 'INTERNAL_SERVER_ERROR',
  UniqueConstraint = 'UNIQUE_CONSTRAINT',
  EntityNotFound = 'ENTITY_NOT_FOUND',
}

export function httpErrorCode(status: number): string {
  return `HTTP_ERROR_${status}`;
}
