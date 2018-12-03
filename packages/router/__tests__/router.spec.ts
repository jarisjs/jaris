import { buildRouteObject, get, group, initializeRoutes } from '../src/builder';
// import { runMiddleware, } from '../src/router/router';
// import { createConn } from 'src/server/server';
// import { text } from 'src/router/responses';

describe('buildRouteObject', () => {
  it('should return an object matching the Route interface when given a controller path', () => {
    expect(buildRouteObject('get', '/users', 'users.index')).toEqual({
      path: '/users',
      verb: 'get',
      controller: 'users',
      method: 'index',
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
  it('should append a Route object into the current list of routes when given a controller path', () => {
    let routes = initializeRoutes();
    expect(get('/users', 'users.index')(routes)).toEqual([
      {
        path: '/users',
        verb: 'get',
        controller: 'users',
        method: 'index',
        middleware: [],
      },
    ]);
  });

  it('should append a Route object into the current list of routes when given a callback handler', () => {
    let routes = initializeRoutes();
    const callback = (() => {}) as any;
    expect(get('/users', callback)(routes)).toEqual([
      {
        path: '/users',
        verb: 'get',
        callback,
        middleware: [],
      },
    ]);
  });

  it('should not mutate the original route list', () => {
    let routes = initializeRoutes();
    const callback = (() => {}) as any;
    get('/users', callback)(routes);
    expect(routes).toEqual([]);
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

    routes = group({}, () => [])(routes);

    expect(routes).toHaveLength(0);
  });

  it('should return the routes defined in initial list and nothing else when no routes are defined inside the callback', () => {
    let routes = initializeRoutes();
    routes = get('/test', 'test.test')(routes);
    expect(group({}, () => [])(routes)).toEqual(routes);
  });

  it('should return a new list containing a single route defined in the callback', () => {
    let routes = initializeRoutes();
    routes = get('/test', 'test.test')(routes);
    const groupedRoutes = group({}, () => [get('/test2', 'test2.test')])(
      routes,
    );
    expect(routes).toHaveLength(1); // original isnt modified
    expect(groupedRoutes).toHaveLength(2);
  });

  it('should return a new list containing a multiple routes defined in the callback', () => {
    let routes = initializeRoutes();
    routes = get('/test', 'test.test')(routes);
    const groupedRoutes = group({}, () => [
      get('/test2', 'test2.test'),
      get('/test3', 'test2.test'),
    ])(routes);
    expect(routes).toHaveLength(1); // original isnt modified
    expect(groupedRoutes).toHaveLength(3);
  });

  it('should return a new list containing routes defined in nested group calls', () => {
    let routes = initializeRoutes();
    routes = get('/test', 'test.test')(routes);
    const groupedRoutes = group({ prefix: '/v1' }, () => [
      get('/test2', 'test2.test'),
      get('/test3', 'test2.test'),

      group({}, () => [get('/nested/group/routes', 'test3.test')]),
    ])(routes);
    expect(routes).toHaveLength(1); // original isnt modified
    expect(groupedRoutes).toHaveLength(4);
  });

  it('should modify the path of routes in a group with a prefix', () => {
    let routes = initializeRoutes();

    routes = group({ prefix: '/v1' }, () => [
      get('/companies', 'test.test'),
      get('/companies/123', 'test2.test'),
    ])(routes);

    expect(routes[0].path).toBe('/v1/companies');
    expect(routes[1].path).toBe('/v1/companies/123');
  });

  it('should modify the path of routes in a nested group with a prefix', () => {
    let routes = initializeRoutes();

    routes = group({ prefix: '/v1' }, () => [
      get('/companies', 'test.test'),
      get('/companies/123', 'test2.test'),

      group({ prefix: '/super/' }, () => [
        get('/forms', 'test3.test'),
        get('/forms/234/', 'test4.test'),
      ]),
    ])(routes);

    expect(routes[0].path).toBe('/v1/companies');
    expect(routes[routes.length - 1].path).toBe('/v1/super/forms/234');
  });

  it('should apply a single middleware', () => {
    const middlewareOne = (ctx: any) => {};

    let routes = initializeRoutes();
    routes = group({ middleware: [middlewareOne] }, () => [
      get('/whatever', 'test.test'),
    ])(routes);

    expect(routes[0].middleware).toEqual([middlewareOne]);
  });
});

describe('runMiddleware', () => {
  it.skip('should call all middleware in the stack including the response', async done => {
    // let count = 0;
    // const middlewareOne = (ctx: any) => {
    //   count++;
    // };
    // const middlewareTwo = (ctx: any) => {
    //   count++;
    // };
    // const middlewareFinalResponse = (ctx: any) => {
    //   count++;
    //   return { ok: true };
    // };
    // const middleware = [middlewareOne, middlewareTwo];
    // await runMiddleware(createConn({}), { path: '/users/1', callback: () => , middleware });
    // expect(count).toEqual(3);
    // done();
  });
});
