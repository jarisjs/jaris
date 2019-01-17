import { Conn } from './types';
import { curry2, curry3 } from '@jaris/util';

export const json = curry2(
  (body: any, conn: Conn): Conn => ({
    ...conn,
    headers: {
      ...conn.headers,
      'Content-Type': 'application/json',
    },
    body,
  }),
);

export const text = curry2(
  (body: string, conn: Conn): Conn => ({
    ...conn,
    headers: {
      ...conn.headers,
      'Content-Type': 'text/plain',
    },
    body,
  }),
);

export const halt = (conn: Conn): Conn => ({
  ...conn,
  halt: true,
});

export const header = curry3(
  (key: string, value: string, conn: Conn): Conn => ({
    ...conn,
    headers: {
      ...conn.headers,
      [key]: value,
    },
  }),
);

export const status = curry2((status: number, conn: Conn) => ({
  ...conn,
  status,
}));
