import { Conn } from '@jaris/core';

export const json = (conn: Conn, body: any, status = 200): Conn => ({
  ...conn,
  status,
  headers: {
    ...conn.headers,
    'Content-Type': 'application/json',
  },
  body,
});

export const text = (conn: Conn, body: string, status = 200): Conn => ({
  ...conn,
  status,
  headers: {
    ...conn.headers,
    'Content-Type': 'text/plain',
  },
  body,
});

export const halt = (conn: Conn): Conn => ({
  ...conn,
  halt: true,
});
