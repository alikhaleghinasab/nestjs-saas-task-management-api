export enum ErrorCode {
  Internal = 'INTERNAL_SERVER_ERROR',
}

export function httpErrorCode(status: number): string {
  return `HTTP_ERROR_${status}`;
}
