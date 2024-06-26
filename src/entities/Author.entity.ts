import { Cascade, Collection, Entity, OneToMany, Property, ManyToOne } from '@mikro-orm/core';
import { Basis } from './basis.entity.js';
import { Book } from './Book.entity.js';

@Entity()
export class Author extends Basis {

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property({ nullable: true })
  age?: number;

  @Property()
  termsAccepted = false;

  @Property({ nullable: true })
  born?: Date;

  @OneToMany(() => Book, b => b.author, { cascade: [Cascade.ALL] })
  books = new Collection<Book>(this);

  @ManyToOne(() => Book, { nullable: true })
  favouriteBook?: Book;

  constructor() {
    super('Author');
    // this.name = name
    // this.email = email
  }

}