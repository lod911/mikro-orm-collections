import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { ensureError, getLogger } from './utils/Logger.js';
import { Book } from './entities/index.js';

const logger = getLogger('Route');

export async function setRoute(
  fastify: FastifyInstance,
  opts: FastifyPluginAsync,
) {

  fastify.get(
    '/test',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { db } = request;  
      

      const book: any = {
        title: 'Test2',
        author: {
          name: 'Test',
          email: 'mail@mail.com',
          // books: [{title: 'Title'}]
        }
      }
      
      const bookRep = db.em.getRepository(Book)
      const b = bookRep.create(book)
      try {
  
        await db.em.flush()        
      } catch (error) {
        logger.error(ensureError(error))
        throw ensureError(error)
      }
      

      return reply.status(200).send('OK')
    })
  }

