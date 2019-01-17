// @ts-ignore
import { matchPattern, getParams } from 'url-matcher';
import { Conn, text, status } from '@jaris/core';
import { reduceP, pipe } from '@jaris/util';
import { Route } from './types';

export * from './builder';
export * from './types';

export async function runMiddleware(conn: Conn, route: Route) {
  let finalReturn: any = null;

  if (route.middleware) {
    finalReturn = await reduceP(
      async (carry, middlewareFunc) => {
        if (carry.halt) {
          return carry;
        }
        return await middlewareFunc(conn);
      },
      conn,
      route.middleware,
    );
  }

  /**
   * No middleware or they did not halt early
   * so lets run the controller handler
   */
  if (!finalReturn.halt) {
    return await route.callback!(conn, getParams(route.path, conn.req.url));
  }

  return finalReturn;
}

const router = (routes: Route[]) => {
  return async (conn: Conn) => {
    const currentPath = conn.req.url;

    const route = routes.find(r => {
      const match = matchPattern(r.path, currentPath);
      return match && match.remainingPathname === '';
    });

    if (!route || !route.callback) {
      return pipe(
        text('Not found'),
        status(404),
      )(conn);
    }

    return await runMiddleware(conn, route);
  };
};

export default router;
