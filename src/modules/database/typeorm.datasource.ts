import { DataSource } from 'typeorm';
import { createTypeOrmOptions } from './typeorm.config';

export const dataSource = new DataSource(createTypeOrmOptions());
