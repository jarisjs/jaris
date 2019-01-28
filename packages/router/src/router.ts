import { Conn, text, status } from '@jaris/core';
import { pipe } from '@jaris/util';
import { baseRouter } from './base';

const router = baseRouter<Conn>({
  req: conn => conn.req,
  res: conn => conn.res,
  notFound: conn =>
    pipe(
      text('Not found'),
      status(404),
    )(conn),
  exitCheck: conn => conn.halt,
});

export default router;
