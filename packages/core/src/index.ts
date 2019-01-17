import * as http from 'http';
import { Conn } from './types';
import { reduceP } from '@jaris/util';

export * from './responses';
export * from './types';

export function createConn(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Conn {
  return {
    status: 200,
    params: {},
    body: {},
    headers: {},
    halt: false,
    req,
    res,
  };
}

type JarisMiddleware = (conn: Conn) => Conn | Promise<Conn>;

export default function server(
  composedApp: JarisMiddleware[],
  port: number = 3001,
) {
  const server = http.createServer(
    async (req: http.IncomingMessage, res: http.ServerResponse) => {
      if (req.url === '/favicon.ico') {
        res.writeHead(200);
        return res.end();
      }

      const { status, body, headers } = await reduceP(
        async (conn, fn) => (conn.halt ? conn : await fn(await conn)),
        createConn(req, res),
        composedApp,
      );

      Object.keys(headers).forEach(key => {
        res.setHeader(key, headers[key]);
      });

      const responseBody = JSON.stringify(body);

      res.writeHead(status, {
        'Content-Length': Buffer.from(responseBody).length,
      });

      return res.end(Buffer.from(responseBody));
    },
  );
  return server.listen(port);
}
