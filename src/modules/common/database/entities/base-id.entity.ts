import { PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';

export abstract class BaseIdEntity {
  @PrimaryColumn('uuid', {
    transformer: {
      to: (value) => value ?? uuidv7(),
      from: (value) => value,
    },
  })
  id: string;
}
