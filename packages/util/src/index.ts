import { curry2 } from './curry';

export const reduceP = async <T, S>(
  pReducer: (carry: T, nextValue: S) => Promise<T>,
  startValue: T,
  list: S[],
) => {
  let cur = startValue;
  let i = 0;
  for (; i < list.length; i++) {
    cur = await pReducer(cur, list[i]);
  }
  return cur;
};

export const flatten = <T>(arr: T[]): T[] => {
  return arr.reduce(
    (carry, nextArr) => [
      ...carry,
      ...(Array.isArray(nextArr) ? flatten(nextArr) : [nextArr]),
    ],
    [],
  );
};

export const trim = curry2((char: string, str: string) => {
  if (!char) {
    char = '\\s';
  }
  const regex = new RegExp('^' + char + '+|' + char + '+$', 'g');
  return str.replace(regex, '');
});

// https://dev.to/ascorbic/creating-a-typed-compose-function-in-typescript-3-351i
export const pipe = <T extends any[], R>(
  fn1: (...args: T) => R,
  ...fns: Array<(a: R) => R>
) => {
  const piped = fns.reduce(
    (prevFn, nextFn) => (value: R) => nextFn(prevFn(value)),
    value => value,
  );
  return (...args: T) => piped(fn1(...args));
};

export * from './curry';
