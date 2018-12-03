import { Conn } from '@jaris/core';

export function json(conn: Conn, body: any, status = 200) {
  return {
    ...conn,
    status,
    headers: {
      ...conn.headers,
      'Content-Type': 'application/json',
    },
    body,
  };
}

export function text(conn: Conn, body: string, status = 200) {
  return {
    ...conn,
    status,
    headers: {
      ...conn.headers,
      'Content-Type': 'text/plain',
    },
    body,
  };
}
