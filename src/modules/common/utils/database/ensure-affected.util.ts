import { DeleteResult, UpdateResult } from 'typeorm';

export async function wasAffected(
  dbOperation: Promise<DeleteResult | UpdateResult>,
): Promise<boolean> {
  const result = await dbOperation;
  return result?.affected > 0;
}
