import { reduceP, pipe, trim } from '@jaris/util';
import { Route } from './types';
import { IncomingMessage, ServerResponse } from 'http';

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

const runMiddleware = async <T>(route: Route, handler: Router<T>, conn: T) => {
  let finalReturn = conn;

  if (route.middleware) {
    finalReturn = await reduceP(
      async (carry, middlewareFunc) => {
        if (handler.exitCheck(conn)) {
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
  if (!handler.exitCheck(conn)) {
    return await route.callback!(conn);
  }

  return finalReturn;
};

export interface Router<T> {
  req: (conn: T) => IncomingMessage;
  res: (conn: T) => ServerResponse;
  notFound: (conn: T) => T;
  exitCheck: (conn: T) => boolean;
}

export const baseRouter = <T>(handler: Router<T>) => {
  return (routes: Route[]) => {
    return async (conn: T) => {
      const currentPath = handler.req(conn).url;

      const route = routes.find(
        r =>
          toLower(r.verb) === toLower(handler.req(conn).method) &&
          matchPattern(currentPath!, r.path),
      );

      if (!route || !route.callback) {
        return handler.notFound(conn);
      }

      return await runMiddleware(route, handler, conn);
    };
  };
};
