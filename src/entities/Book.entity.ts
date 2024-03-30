import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property, Rel, rel } from '@mikro-orm/core';
import { Author } from './index.js';
import { Basis } from './basis.entity.js';

@Entity()
export class Book extends Basis {

  @Property()
  title!: string;

  @ManyToOne(() => Author)
  author!: Rel<Author>;

  @Property({ nullable: true })
  metaObject?: object;

  @Property({ nullable: true })
  metaArray?: any[];

  @Property({ nullable: true })
  metaArrayOfStrings?: string[];

  constructor() {
    super('Book');
  }

}