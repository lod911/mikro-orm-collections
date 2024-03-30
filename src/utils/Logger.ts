import pino from 'pino';

export * from 'pino';

export const pinoConfig: pino.LoggerOptions = {
  name: 'mikro-orm-collections',
  level: 'debug',
  redact: {
    censor: '*** removed ***',
    paths: ['password'],
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
};

export function getLogger(MsgPrefix: string) {
  const logger = pino({ ...pinoConfig, msgPrefix: '[' + MsgPrefix + '] ' });
  const child = logger.child({ methode: MsgPrefix });
  return child;
}

export function ensureError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }

  let stringified = '❗❗❗ [Unable to stringify the thrown value]';

  try {
    stringified = JSON.stringify(value);
  } catch (error) {
    throw Error('ensureError Failure!!!');
  }

  const error = new Error(`⛔ Stringified Error: ${stringified}`);
  return error;
}
