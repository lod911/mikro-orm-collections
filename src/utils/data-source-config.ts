import {
  EntityManager,
  MikroORM,
  Options,
  defineConfig,
} from '@mikro-orm/core';
import { MongoDriver } from '@mikro-orm/mongodb';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { getLogger } from '../utils/Logger.js';

const logger = getLogger('data-source-config');

export interface IDataBase {
  orm: MikroORM;
  em: EntityManager;
}

function getORMConfig() {
  let dsT: Options;
  const sw = 'mongodb'

  switch (sw) {
    case 'mongodb':
      dsT = {
        driver: MongoDriver,
        clientUrl: 'mongodb://localhost:27017',
      };
      break;
    default:
      throw new Error('database type error');
  }

  const dsBasis: Options = {
    dbName: 'test',
    debug: true,
    metadataProvider: TsMorphMetadataProvider,
    entities: ['dist/**/*.entity.js'],
    // it has to be ts!
    entitiesTs: ['src/**/*.entity.ts'],
  };

  const conf = { ...dsBasis, ...dsT };
  return defineConfig(conf);
}

let cache: IDataBase;
export async function initORM(options?: Options): Promise<IDataBase> {
  if (cache) {
    return cache;
  }
  const conf = getORMConfig();
  const orm = await MikroORM.init({ ...conf, ...options });
  logger.debug({ conf: conf }, 'ORM init done');

  // save to cache before returning
  return (cache = {
    orm: orm,
    em: orm.em,
  });
}

export default defineConfig(getORMConfig())
