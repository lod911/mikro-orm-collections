import { initORM, IDataBase } from '../utils/data-source-config.js';
import { ensureError, getLogger } from '../utils/Logger.js';
import { FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user: string;
    db: IDataBase;
  }
}

const logger = getLogger('Context');

async function getContextData(request: FastifyRequest) {
  try {
    const { headers } = request;

    const user = 'Guest';
    const orm = (await initORM()).orm;
    const em = orm.em.fork();

    logger.trace('getContextData done');
    return { user, orm, em };
  } catch (error) {
    throw ensureError(error);
  }
}

export async function getContextHook(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyRequest> {
  try {
    const {  user, orm, em } = await getContextData(request);
    const srv: IDataBase = {
      em: em,
      orm: orm,
    };
    request.user = user;
    request.db = srv;
  } catch (error) {
    logger.fatal(ensureError(error));
    throw error;
  }
  return request;
}
