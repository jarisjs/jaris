// @ts-ignore
import { matchPattern, getParams } from 'url-matcher';
import { Conn } from '@jaris/core';
import { text } from './responses';
import { Route, MiddlewareFunction } from './types';

export * from './types';

export async function runMiddleware(conn: Conn, route: Route) {
  let finalReturn: any = null;

  if (route.middleware) {
    finalReturn = await route.middleware.reduce(
      async (carry, middlewareFunc: MiddlewareFunction) =>
        (await carry) || (await middlewareFunc(conn)),
      null as any,
    );
  }

  /**
   * No middleware or they did not return any errors
   * so lets run the controller handler
   */
  if (!finalReturn) {
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
      return text(conn, 'Not found', 404);
    }

    const resultingConn = await runMiddleware(conn, route);

    return resultingConn;
  };
};

export default router;
