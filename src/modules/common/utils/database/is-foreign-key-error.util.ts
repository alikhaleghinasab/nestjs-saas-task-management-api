export function isForeignKeyConstraintError(error: any): boolean {
  return error?.code === '23503';
}
