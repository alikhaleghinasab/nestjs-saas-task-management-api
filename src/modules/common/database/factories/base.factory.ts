import {
  DataSource,
  DeepPartial,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export interface GenericFactory<T extends ObjectLiteral> {
  create(blueprint?: DeepPartial<T>): Promise<T>;
  createMany(count: number, blueprint?: DeepPartial<T>): Promise<T[]>;
}

export function createFactory<T extends ObjectLiteral>(
  entityClass: EntityTarget<T>,
  defaultPropsGenerator: () => DeepPartial<T>,
) {
  return (dataSource: DataSource): GenericFactory<T> => {
    const repository: Repository<T> = dataSource.getRepository(entityClass);

    return {
      async create(blueprint): Promise<T> {
        const entity = repository.create({
          ...defaultPropsGenerator(),
          ...(blueprint ?? {}),
        });

        return repository.save(entity);
      },

      async createMany(count: number, blueprint): Promise<T[]> {
        const entities = Array.from({ length: count }, () =>
          repository.create({
            ...defaultPropsGenerator(),
            ...(blueprint ?? {}),
          }),
        );

        return repository.save(entities);
      },
    };
  };
}
