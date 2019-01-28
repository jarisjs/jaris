import { baseRouter } from '@jaris/router';
import { Context } from 'koa';

const router = baseRouter<Context>({
  req: ctx => ctx.req,
  res: ctx => ctx.res,
  notFound: ctx => {
    ctx.body = 'Not found';
    ctx.status = 404;
    return ctx;
  },
  exitCheck: ctx => !ctx.body,
});

export default router;
