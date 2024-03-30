import 'reflect-metadata';
import fastify from 'fastify';
import { ensureError, getLogger, pinoConfig } from './utils/Logger.js';
import { RequestContext } from '@mikro-orm/core';
import { initORM } from './utils/data-source-config.js';
import { getContextHook } from './utils/contextPlugin.js';
import { setRoute } from './routes.js';


const logger = getLogger('mainIndex');

logger.info('⏳ Start server');

// Server
const server = fastify({
  logger: { ...pinoConfig, msgPrefix: '[mainIndex - webServer] ' },
});


async function init() {
  try {
    // Database
    logger.info('⏳ Start database-initialisation...');
    const db = await initORM();
    // register request context hook
    server.addHook('onRequest', (request, reply, done) => {
      RequestContext.create(db.em, done);
    });
    server.addHook('onClose', async () => {
      await db.orm.close();
    });
    logger.info('✅ Database-Initialisation done');

    // WebServer Init
    logger.info('⏳ Start WebServer-Initialisation');

    server.addHook('preHandler', getContextHook);
    await server.register(setRoute);

    const url = await server.listen({
      port: 3005,
      host: "localhost"
    });
    logger.info(
      {
        baseUrl: url,
      },
      '✅ Start WebServer-Initialisation done',
    );
  } catch (error) {
    throw ensureError(error);
  }

  logger.trace('✅ Last init()-procedure line');
}

logger.info('⏳ Start init()');
init()
  .catch((error) => {
    logger.fatal(ensureError(error));
    logger.info('✅ Ende Init');
    return;
  })
  .finally(() => {
    logger.info('✅ Start init() done. Ready 🚀');
  });
logger.debug('EOF');
