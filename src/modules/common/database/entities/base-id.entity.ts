import { BeforeInsert, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';

export abstract class BaseIdEntity {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  setId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}
