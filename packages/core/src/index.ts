import * as http from 'http';
import { Conn } from './types';
import { reduceP } from '@jaris/util';
import responseParser from './parsers/response';
import requestParser from './parsers/request';

export * from './responses';
export * from './types';

export async function createConn(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<Conn> {
  return {
    status: 200,
    params: {},
    body: {},
    headers: {},
    halt: false,
    query: {},
    request: await requestParser(req),
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
        await createConn(req, res),
        composedApp,
      );

      Object.keys(headers).forEach(key => {
        res.setHeader(key, headers[key]);
      });

      const responseBody = responseParser(headers['Content-Type'], body);

      if (Buffer.isBuffer(responseBody)) {
        res.writeHead(status, {
          'Content-Length': responseBody.length,
        });
      }

      return res.end(responseBody);
    },
  );
  return server.listen(port);
}
