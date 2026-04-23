export enum ErrorCode {
  Internal = 'INTERNAL_SERVER_ERROR',
  UniqueConstraint = 'UNIQUE_CONSTRAINT',
  ForeignKeyConstraint = 'FOREIGN_KEY_CONSTRAINT',
  RecordNotFound = 'RECORD_NOT_FOUND',
  PermissionDenied = 'PERMISSION_DENIED',
  DynamicFilterInvalidData = 'DYNAMIC_FILTER_INVALID_DATA',
}

export function httpErrorCode(status: number): string {
  return `HTTP_ERROR_${status}`;
}
