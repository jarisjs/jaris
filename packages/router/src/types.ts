import { Conn } from '@jaris/core';

export type HandlerType = string | RouteHandleFunction | Promise<Conn<any>>;

export type RouteHandleFunction = (
  conn: Conn,
  urlParams: { [key: string]: string } | {},
) => Conn | Promise<Conn>;

export interface Route {
  path: string;
  verb: HTTPVerb;
  controller?: string;
  method?: string;
  callback?: RouteHandleFunction;
  middleware: MiddlewareFunction[];
}
export type RoutesList = Route[];

export type HTTPVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type MiddlewareFunction = (conn: Conn) => any;

export interface GroupOptions {
  prefix?: string;
  middleware?: MiddlewareFunction[];
}

export type ArrayItem = (routes: RoutesList) => RoutesList;

export type GroupCallback = () => Route[];
