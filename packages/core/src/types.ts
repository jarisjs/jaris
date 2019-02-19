import * as http from 'http';

export type ResponseBody =
  | string
  | number
  | null
  | Array<any>
  | {
      [key: string]: any;
    };

export interface Conn<T = any> {
  params: T;
  req: http.IncomingMessage;
  res: http.ServerResponse;
  status: number;
  body: ResponseBody;
  query: {
    [key: string]: any;
  };
  headers: {
    [key: string]: string;
  };
  halt: boolean;
}
