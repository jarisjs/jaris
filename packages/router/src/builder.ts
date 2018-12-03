import {
  RoutesList,
  HandlerType,
  Route,
  GroupOptions,
  HTTPVerb,
  GroupCallback,
  RouteHandleFunction,
} from './types';

export function get(path: string, handler: HandlerType) {
  return (routes: RoutesList) => [
    ...routes,
    buildRouteObject('get', path, handler),
  ];
}

export function post(path: string, handler: HandlerType) {
  return (routes: RoutesList) => [
    ...routes,
    buildRouteObject('post', path, handler),
  ];
}

export function put(path: string, handler: HandlerType) {
  return (routes: RoutesList) => [
    ...routes,
    buildRouteObject('put', path, handler),
  ];
}

export function patch(path: string, handler: HandlerType) {
  return (routes: RoutesList) => [
    ...routes,
    buildRouteObject('patch', path, handler),
  ];
}

export function destroy(path: string, handler: HandlerType) {
  return (routes: RoutesList) => [
    ...routes,
    buildRouteObject('delete', path, handler),
  ];
}

export function group(options: GroupOptions, callback: GroupCallback) {
  return (routes: RoutesList): Route[] => {
    const existingRoutes = [...routes];

    const updatedRoutes = callback().map(appendRoute => {
      let routesToUpdate = appendRoute(initializeRoutes());

      if (options.prefix) {
        routesToUpdate = routesToUpdate.map(route =>
          applyPrefix(route, options!.prefix),
        );
      }

      if (options.middleware) {
        routesToUpdate = routesToUpdate.map(route => {
          return { ...route, middleware: options.middleware! };
        });
      }

      return routesToUpdate;
    });

    return [...existingRoutes, ...flatten(updatedRoutes)];
  };
}

function flatten(arr: any[]) {
  return arr.reduce((carry, nextArr) => [...carry, ...nextArr], []);
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
