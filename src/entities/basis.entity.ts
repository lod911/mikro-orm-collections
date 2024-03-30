import { PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { getLogger } from '../utils/Logger.js';
const logger = getLogger('basis.entity');

export abstract class Basis {
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property()
  readonly classType: string;

  constructor(ct: string) {
    this.classType = ct;
  }

}
