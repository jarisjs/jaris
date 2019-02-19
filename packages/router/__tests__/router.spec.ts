import {
  buildRouteObject,
  get,
  group,
  initializeRoutes,
  post,
} from '../src/builder';
import { createConn, text, halt } from '@jaris/core';
import { IncomingMessage, ServerResponse } from 'http';
import router from '../src';

const mockConn = (req = {}, res = {}) =>
  createConn(req as IncomingMessage, {} as ServerResponse);

describe('buildRouteObject', () => {
  it('should return an object matching the Route interface when given a controller path', () => {
    const cb = (conn: any) => conn;
    expect(buildRouteObject('get', '/users', cb)).toEqual({
      path: '/users',
      verb: 'get',
      callback: cb,
      middleware: [],
    });
  });

  it('should return an object matching the Route interface when given a callback handler', () => {
    const handler = (() => {}) as any;
    expect(buildRouteObject('get', '/users', handler)).toEqual({
      path: '/users',
      verb: 'get',
      callback: handler,
      middleware: [],
    });
  });
});

describe('get', function() {
  it('should return a proper Route object when given a controller path', () => {
    const cb = (conn: any) => conn;
    expect(get('/users', cb)).toEqual({
      path: '/users',
      verb: 'get',
      callback: cb,
      middleware: [],
    });
  });

  it('should return a proper Route object when given a callback handler', () => {
    const callback = (() => {}) as any;
    expect(get('/users', callback)).toEqual({
      path: '/users',
      verb: 'get',
      callback,
      middleware: [],
    });
  });
});

describe('initializeRoutes', () => {
  it('should return an empty list', () => {
    expect(initializeRoutes()).toEqual([]);
  });
});

describe('group', () => {
  it('should return no routes when given an empty list and no routes are defined inside the callback', () => {
    let routes = initializeRoutes();

    routes = group({}, () => []);

    expect(routes).toHaveLength(0);
  });

  it('should return the routes defined in initial list and nothing else when no routes are defined inside the callback', () => {
    const routes = [get('/test', conn => conn)];
    const routesWithGroup = [...routes, ...group({}, () => [])];
    expect(routesWithGroup).toEqual(routes);
  });

  it('should return a new list containing a single route defined in the callback', () => {
    const routes = [
      get('/test', conn => conn),
      ...group({}, () => [get('/test2', conn => conn)]),
    ];
    expect(routes).toHaveLength(2);
  });

  it('should return a new list containing a multiple routes defined in the callback', () => {
    const routes = [
      get('/test', conn => conn),
      ...group({}, () => [
        get('/test2', conn => conn),
        get('/test3', conn => conn),
      ]),
    ];
    expect(routes).toHaveLength(3);
  });

  it('should return a new list containing routes defined in nested group calls', () => {
    const routes = [
      get('/test', conn => conn),
      ...group({ prefix: '/v1' }, () => [
        get('/test2', conn => conn),
        get('/test3', conn => conn),

        ...group({}, () => [get('/nested/group/routes', conn => conn)]),
      ]),
    ];
    expect(routes).toHaveLength(4);
  });

  it('should modify the path of routes in a group with a prefix', () => {
    const routes = [
      ...group({ prefix: '/v1' }, () => [
        get('/companies', conn => conn),
        get('/companies/123', conn => conn),
      ]),
    ];

    expect(routes[0].path).toBe('/v1/companies');
    expect(routes[1].path).toBe('/v1/companies/123');
  });

  it('should modify the path of routes in a nested group with a prefix', () => {
    const routes = group({ prefix: '/v1' }, () => [
      get('/companies', conn => conn),
      get('/companies/123', conn => conn),

      ...group({ prefix: '/super/' }, () => [
        get('/forms', conn => conn),
        get('/forms/234/', conn => conn),
      ]),
    ]);

    expect(routes[0].path).toBe('/v1/companies');
    expect(routes[routes.length - 1].path).toBe('/v1/super/forms/234');
  });

  it('should apply a single middleware', () => {
    const middlewareOne = (conn: any) => mockConn();
    const routes = [
      ...group({ middleware: [middlewareOne] }, () => [
        get('/whatever', conn => conn),
      ]),
    ];
    expect(routes[0].middleware).toEqual([middlewareOne]);
  });
});

describe('router', () => {
  it('should return not found when no routes in list', async done => {
    const routes: any[] = [];
    const conn = await router(routes)(mockConn());
    expect(conn.body).toEqual('Not found');
    expect(conn.status).toEqual(404);
    done();
  });

  it('should return not found when no route matches in list', async done => {
    const routes = [get('/home', conn => conn), get('/', conn => conn)];
    const conn = await router(routes)(
      mockConn({
        url: '/asd',
      }),
    );
    expect(conn.body).toEqual('Not found');
    expect(conn.status).toEqual(404);
    done();
  });

  it('should return not found when a route matches but the method does not', async done => {
    const routes = [get('/home', conn => conn), get('/', conn => conn)];
    const conn = await router(routes)(
      mockConn({
        url: '/home',
        method: 'POST',
      }),
    );
    expect(conn.body).toEqual('Not found');
    expect(conn.status).toEqual(404);
    done();
  });

  it('should return the handler connection when a route is found', async done => {
    const routes = [
      get('/home', conn => text('Found', conn)),
      get('/', conn => conn),
    ];
    const conn = await router(routes)(
      mockConn({
        url: '/home',
        method: 'GET',
      }),
    );
    expect(conn.body).toEqual('Found');
    expect(conn.status).toEqual(200);
    done();
  });

  it('should find the root route', async done => {
    const routes = [
      get('/', conn => text('Index', conn)),
      get('/home', conn => conn),
    ];
    const conn = await router(routes)(
      mockConn({
        url: '/',
        method: 'GET',
      }),
    );
    expect(conn.body).toEqual('Index');
    expect(conn.status).toEqual(200);
    done();
  });

  it('should find a route when a query string is provided', async done => {
    const routes = [
      get('/', conn => text('Index', conn)),
      get('/users/:userUid', conn => text('User', conn)),
    ];
    const conn = await router(routes)(
      mockConn({
        url: '/users/1234?token=xabsc',
        method: 'GET',
      }),
    );
    expect(conn.body).toEqual('User');
    expect(conn.status).toEqual(200);
    done();
  });

  it('should parse multiple querystring params', async done => {
    const routes = [
      get('/', conn => text('Index', conn)),
      get('/users/:userUid', conn => text('User', conn)),
    ];
    const conn = await router(routes)(
      mockConn({
        url: '/users/1234?token=xabsc&other=1234',
        method: 'GET',
      }),
    );
    expect(conn.body).toEqual('User');
    expect(conn.status).toEqual(200);
    expect(conn.query).toEqual({ token: 'xabsc', other: '1234' });
    done();
  });

  it('shouldnt break when empty qs', async done => {
    const routes = [
      get('/', conn => text('Index', conn)),
      get('/users/:userUid', conn => text('User', conn)),
    ];
    const conn = await router(routes)(
      mockConn({
        url: '/users/1234?token=',
        method: 'GET',
      }),
    );
    expect(conn.body).toEqual('User');
    expect(conn.status).toEqual(200);
    expect(conn.query).toEqual({ token: '' });
    done();
  });

  it('shouldnt break when just a question mark', async done => {
    const routes = [
      get('/', conn => text('Index', conn)),
      get('/users/:userUid', conn => text('User', conn)),
    ];
    const conn = await router(routes)(
      mockConn({
        url: '/users/1234?',
        method: 'GET',
      }),
    );
    expect(conn.body).toEqual('User');
    expect(conn.status).toEqual(200);
    expect(conn.query).toEqual({});
    done();
  });

  it('should find a route with a single route parameter', async done => {
    const routes = [
      get('/', conn => text('Index', conn)),
      get('/users/:userUid', conn => text('User', conn)),
    ];
    const conn = await router(routes)(
      mockConn({
        url: '/users/1234',
        method: 'GET',
      }),
    );
    expect(conn.body).toEqual('User');
    expect(conn.status).toEqual(200);
    done();
  });

  it('should find a route with a multiple route parameters', async done => {
    const routes = [
      get('/', conn => text('Index', conn)),
      get('/users/:userUid', conn => text('User', conn)),
      get('/users/:userUid/companies/:companyUid', conn =>
        text('User Company', conn),
      ),
    ];
    const conn = await router(routes)(
      mockConn({
        url: '/users/1234/companies/321',
        method: 'GET',
      }),
    );
    expect(conn.body).toEqual('User Company');
    expect(conn.status).toEqual(200);
    done();
  });

  it('should find a route with the proper verb when defined twice', async done => {
    const routes = [
      get('/', conn => text('Index', conn)),
      get('/users/:userUid', conn => text('User', conn)),
      post('/users/:userUid', conn => text('Post User', conn)),
    ];
    const conn = await router(routes)(
      mockConn({
        url: '/users/1234',
        method: 'POST',
      }),
    );
    expect(conn.body).toEqual('Post User');
    expect(conn.status).toEqual(200);
    done();
  });

  it('should call all middleware in the stack including the response', async done => {
    const middlewareOne = jest.fn(conn => conn);
    const middlewareTwo = jest.fn(conn => conn);
    const middlewareFinalResponse = jest.fn(conn => conn);
    const middleware = [middlewareOne, middlewareTwo];
    const routes = [
      ...group({ middleware }, () => [get('/home', middlewareFinalResponse)]),
    ];
    await router(routes)(
      mockConn({
        url: '/home',
        method: 'GET',
      }),
    );
    expect(middlewareOne).toHaveBeenCalledTimes(1);
    expect(middlewareTwo).toHaveBeenCalledTimes(1);
    expect(middlewareFinalResponse).toHaveBeenCalledTimes(1);
    done();
  });

  it('should not run any further middleware in the stack if one halts early', async done => {
    const middlewareOne = jest.fn(conn => conn);
    const middlewareTwo = jest.fn(conn => halt(conn));
    const middlewareThree = jest.fn(conn => conn);
    const middlewareFinalResponse = jest.fn(conn => conn);
    const middleware = [middlewareOne, middlewareTwo, middlewareThree];
    const routes = [
      ...group({ middleware }, () => [get('/home', middlewareFinalResponse)]),
    ];
    await router(routes)(
      mockConn({
        url: '/home',
        method: 'GET',
      }),
    );
    expect(middlewareOne).toHaveBeenCalledTimes(1);
    expect(middlewareTwo).toHaveBeenCalledTimes(1);
    expect(middlewareThree).toHaveBeenCalledTimes(0);
    expect(middlewareFinalResponse).toHaveBeenCalledTimes(0);
    done();
  });

  it('should call the handler with an empty object when no route params', async done => {
    let connCapture;
    const handler = jest.fn((conn, params) => {
      connCapture = conn;
      return conn;
    });
    const routes = [get('/users', handler)];
    await router(routes)(
      mockConn({
        url: '/users',
        method: 'GET',
      }),
    );
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(connCapture);
    expect(connCapture).toHaveProperty('params', {});
    done();
  });

  it('should call the handler with a single key in route param object', async done => {
    let connCapture;
    const handler = jest.fn((conn, params) => {
      connCapture = conn;
      return conn;
    });
    const routes = [get('/users/:userId', handler)];
    await router(routes)(
      mockConn({
        url: '/users/123',
        method: 'GET',
      }),
    );
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(connCapture);
    expect(connCapture).toHaveProperty('params', {
      userId: '123',
    });
    done();
  });

  it('should call the handler with multiple keys in route param object', async done => {
    let connCapture;
    const handler = jest.fn((conn, params) => {
      connCapture = conn;
      return conn;
    });
    const routes = [get('/users/:userId/companies/:companyId', handler)];
    await router(routes)(
      mockConn({
        url: '/users/123/companies/456',
        method: 'GET',
      }),
    );
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(connCapture);
    expect(connCapture).toHaveProperty('params', {
      userId: '123',
      companyId: '456',
    });
    done();
  });

  it('should call the handler with route params when trailing slashes in url', async done => {
    let connCapture;
    const handler = jest.fn((conn, params) => {
      connCapture = conn;
      return conn;
    });
    const routes = [get('/users/:userId/', handler)];
    await router(routes)(
      mockConn({
        url: '/users/123',
        method: 'GET',
      }),
    );
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(connCapture);
    expect(connCapture).toHaveProperty('params', { userId: '123' });

    await router(routes)(
      mockConn({
        url: '/users/123/',
        method: 'GET',
      }),
    );
    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenLastCalledWith(connCapture);
    expect(connCapture).toHaveProperty('params', { userId: '123' });
    done();
  });

  it('should call the handler with route params when leading slashes in url', async done => {
    let connCapture;
    const handler = jest.fn((conn, params) => {
      connCapture = conn;
      return conn;
    });
    const routes = [get('users/:userId', handler)];
    await router(routes)(
      mockConn({
        url: '/users/123',
        method: 'GET',
      }),
    );
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(connCapture);
    expect(connCapture).toHaveProperty('params', { userId: '123' });

    await router(routes)(
      mockConn({
        url: 'users/123',
        method: 'GET',
      }),
    );
    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenLastCalledWith(connCapture);
    expect(connCapture).toHaveProperty('params', { userId: '123' });
    done();
  });
});
