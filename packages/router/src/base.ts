import { reduceP, pipe, trim } from '@jaris/util';
import { Route } from './types';
import { IncomingMessage, ServerResponse } from 'http';
import { Conn } from '@jaris/core';

const toLower = (str?: string) => (str ? str.toLowerCase() : str);

const templateParameterPattern = '(:[a-zA-Z0-9]+)';
const requestParameterPattern = '([a-zA-Z0-9]+)';

const replaceSlashes = (str: string) =>
  str.replace(new RegExp(/(\/)+/, 'gm'), '\\/');

const replaceParameters = (str: string) =>
  str.replace(
    new RegExp(templateParameterPattern, 'gm'),
    requestParameterPattern,
  );

export const getParams = (url: string, template: string) => {
  if (template === '/' && url === '/') {
    return {};
  }

  const urlBeingRequested = trim('\\/', url);
  const regexTemplateStringForUrl = pipe(
    trim('\\/'),
    replaceParameters,
    replaceSlashes,
  )(template);
  const regexTemplateStringForParams = pipe(
    trim('\\/'),
    replaceSlashes,
  )(template);

  const templateRegex = new RegExp(`^${regexTemplateStringForUrl}$`, 'gm');
  const matches = templateRegex.exec(urlBeingRequested);

  if (!matches) {
    return {};
  }

  matches.shift();

  const regex = new RegExp(`(:[a-zA-Z0-9]+)`, 'gm');
  let match;
  const params = {};
  while ((match = regex.exec(regexTemplateStringForParams))) {
    params[trim(':', match[0])] = matches.shift();
  }
  return params;
};

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

const runMiddleware = async (
  route: Route,
  handler: Router<Conn>,
  conn: Conn,
) => {
  let finalReturn = conn;

  if (route.middleware) {
    finalReturn = await reduceP(
      async (carry, middlewareFunc) => {
        if (handler.exitCheck(carry)) {
          return carry;
        }
        return await middlewareFunc(carry);
      },
      conn,
      route.middleware,
    );
  }

  /**
   * No middleware or they did not halt early
   * so lets run the controller handler
   */
  if (handler.exitCheck(finalReturn)) {
    return finalReturn;
  }

  return await route.callback!(finalReturn);
};

export interface Router<T> {
  req: (conn: T) => IncomingMessage;
  res: (conn: T) => ServerResponse;
  notFound: (conn: T) => T;
  exitCheck: (conn: T) => boolean;
}

export const baseRouter = (handler: Router<Conn>) => {
  return (routes: Route[]) => {
    return async (conn: Conn) => {
      const currentPath = handler.req(conn).url;

      if (!currentPath) {
        return handler.notFound(conn);
      }

      const pathWithoutQuery = currentPath.split('?')[0];

      const route = routes.find(
        r =>
          toLower(r.verb) === toLower(handler.req(conn).method) &&
          matchPattern(pathWithoutQuery, r.path),
      );

      if (!route || !route.callback) {
        return handler.notFound(conn);
      }

      return await runMiddleware(route, handler, {
        ...conn,
        params: getParams(currentPath!, route.path),
      });
    };
  };
};
