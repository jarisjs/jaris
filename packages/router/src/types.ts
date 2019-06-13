import { Conn } from '@jaris/core';

export interface Route {
  path: string;
  verb: HTTPVerb;
  controller?: string;
  method?: string;
  callback: MiddlewareFunction;
  middleware: MiddlewareFunction[];
}
export type RoutesList = Route[];

export type HTTPVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type MiddlewareFunction = (conn: Conn) => Conn | Promise<Conn>;
export type HandlerType = MiddlewareFunction;

export interface GroupOptions {
  prefix?: string;
  middleware?: MiddlewareFunction[];
}

export type ArrayItem = (routes: RoutesList) => RoutesList;

export type GroupCallback = () => Array<Route | Route[]>;
