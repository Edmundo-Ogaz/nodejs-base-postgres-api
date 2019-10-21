import logger from '../../../interfaces/tools/logger';

export default async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    const { 'x-trace': xTrace } = ctx.request.header;
    const trace = xTrace || 'Does not have';

    if (error.code) {
      const err = {
        ...error,
        trace,
      };
      logger.error(err);

      ctx.status = err.code;
      ctx.body = err.message;
      return;
    }
    const err = {
      trace,
      code: 500,
      message: 'Internal Server Error',
      errorMessage: error.message,
    };
    logger.error(err);

    ctx.status = err.code;
    ctx.body = err.message;
  }
};
