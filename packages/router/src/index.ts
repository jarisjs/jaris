// @ts-ignore
import { getParams } from 'url-matcher';
import { Conn, text, status } from '@jaris/core';
import { reduceP, pipe, trim } from '@jaris/util';
import { Route } from './types';

export * from './builder';
export * from './types';

const templateParameterPattern = '(:[a-zA-Z0-9]+)';
const requestParameterPattern = '([a-zA-Z0-9]+)';

const replaceSlashes = (str: string) =>
  str.replace(new RegExp(/(\/)+/, 'gm'), '\\/');

const replaceParameters = (str: string) =>
  str.replace(
    new RegExp(templateParameterPattern, 'gm'),
    requestParameterPattern,
  );

const matchPattern = (url: string, template: string) => {
  if (template === '/' && url === '/') {
    return true;
  }

  if (template === '/' && url !== '/') {
    return false;
  }

  const urlBeingRequested = trim('\\/', url);
  const regexTemplate = pipe(
    trim('\\/'),
    replaceParameters,
    replaceSlashes,
  )(template);

  return new RegExp(`^${regexTemplate}$`).test(urlBeingRequested);
};

const runMiddleware = async (conn: Conn, route: Route) => {
  let finalReturn = conn;

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
};

const toLower = (str?: string) => (str ? str.toLowerCase() : str);

const router = (routes: Route[]) => {
  return async (conn: Conn) => {
    const currentPath = conn.req.url;

    const route = routes.find(
      r =>
        toLower(r.verb) === toLower(conn.req.method) &&
        matchPattern(currentPath!, r.path),
    );

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
