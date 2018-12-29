import {
  HandlerType,
  Route,
  GroupOptions,
  HTTPVerb,
  GroupCallback,
  RouteHandleFunction,
} from './types';

export function get(path: string, handler: HandlerType) {
  return buildRouteObject('get', path, handler);
}

export function post(path: string, handler: HandlerType) {
  return buildRouteObject('post', path, handler);
}

export function put(path: string, handler: HandlerType) {
  return buildRouteObject('put', path, handler);
}

export function patch(path: string, handler: HandlerType) {
  return buildRouteObject('patch', path, handler);
}

export function destroy(path: string, handler: HandlerType) {
  return buildRouteObject('delete', path, handler);
}

export function group(options: GroupOptions, callback: GroupCallback) {
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
}

function flatten(arr: any[]) {
  return arr.reduce(
    (carry, nextArr) => [
      ...carry,
      ...(Array.isArray(nextArr) ? nextArr : [nextArr]),
    ],
    [],
  );
}

function trim(str: string, char: string = '\\s') {
  const regex = new RegExp('^' + char + '+|' + char + '+$', 'g');
  return str.replace(regex, '');
}

function applyPrefix(route: Route, prefix: string = '') {
  const { path } = route;

  const strippedOriginalPath = trim(path, '/');
  const splitOriginalPath = strippedOriginalPath.split('/');

  const trimmedPrefix = trim(prefix, '/');
  const splitPrefix = trimmedPrefix.split('/');

  const rebuiltPrefix = splitPrefix.join('/');
  const rebuiltOriginalPath = splitOriginalPath.join('/');

  const prefixedPath = `/${rebuiltPrefix}/${rebuiltOriginalPath}`;
  return {
    ...route,
    path: prefixedPath,
  };
}

export function initializeRoutes(): Route[] {
  return [];
}

export function buildRouteObject(
  verb: HTTPVerb,
  path: string,
  handler: HandlerType,
): Route {
  let response: Route = { path, verb, middleware: [] };

  if (typeof handler === 'string') {
    const [controllerName, methodName] = handler.split('.');

    return {
      ...response,
      controller: controllerName,
      method: methodName,
    };
  }

  return {
    ...response,
    callback: handler as RouteHandleFunction,
  };
}
