import { flatten, trim } from '@jaris/util';
import {
  Route,
  GroupOptions,
  HTTPVerb,
  GroupCallback,
  HandlerType,
} from './types';

const applyPrefix = (route: Route, prefix: string = '') => {
  const { path } = route;

  const strippedOriginalPath = trim('/', path);
  const splitOriginalPath = strippedOriginalPath.split('/');

  const trimmedPrefix = trim('/', prefix);
  const splitPrefix = trimmedPrefix.split('/');

  const rebuiltPrefix = splitPrefix.join('/');
  const rebuiltOriginalPath = splitOriginalPath.join('/');

  const prefixedPath = `/${rebuiltPrefix}/${rebuiltOriginalPath}`;
  return {
    ...route,
    path: prefixedPath,
  };
};

export const initializeRoutes = (): Route[] => [];

export const buildRouteObject = (
  verb: HTTPVerb,
  path: string,
  handler: HandlerType,
): Route => {
  return {
    path,
    verb,
    middleware: [],
    callback: handler,
  };
};

export const get = (path: string, handler: HandlerType) => {
  return buildRouteObject('get', path, handler);
};

export const post = (path: string, handler: HandlerType) => {
  return buildRouteObject('post', path, handler);
};

export const put = (path: string, handler: HandlerType) => {
  return buildRouteObject('put', path, handler);
};

export const patch = (path: string, handler: HandlerType) => {
  return buildRouteObject('patch', path, handler);
};

export const destroy = (path: string, handler: HandlerType) => {
  return buildRouteObject('delete', path, handler);
};

export const group = (options: GroupOptions, callback: GroupCallback) => {
  const updatedRoutes = callback().map(
    (routeObj): Route | Route[] => {
      // handle nested group

      if (Array.isArray(routeObj)) {
        return group(options, () => routeObj);
      }

      let updatedRoute = { ...routeObj };

      if (options.prefix) {
        updatedRoute = applyPrefix(routeObj, options!.prefix);
      }

      if (options.middleware) {
        updatedRoute = {
          ...updatedRoute,
          middleware: [...updatedRoute.middleware, ...options.middleware],
        };
      }

      return updatedRoute;
    },
  );

  return [...flatten(updatedRoutes)] as Route[];
};
