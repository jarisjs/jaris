import { baseRouter } from '@jaris/router';
import { Context } from 'koa';

declare module 'koa' {
  interface Context {
    params?: any;
    halt?: boolean;
  }
}

const router = baseRouter<Context>({
  req: ctx => ctx.req,
  res: ctx => ctx.res,
  notFound: ctx => {
    ctx.body = 'Not found';
    ctx.status = 404;
    return ctx;
  },
  exitCheck: ctx => !ctx.halt,
});

export default router;
