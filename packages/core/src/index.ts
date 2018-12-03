import * as http from 'http';
import { Conn } from './types';

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
    req,
    res,
  };
}

export default function server(composedApp: any) {
  const server = http.createServer(
    async (req: http.IncomingMessage, res: http.ServerResponse) => {
      const { status, body, headers } = await composedApp.reduce(
        async (conn: Conn, fn: any) => await fn(conn),
        createConn(req, res) as any,
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
  return server.listen(3001);
}
