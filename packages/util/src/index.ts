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

export const flatten = <T>(arr: T[]) => {
  return arr.reduce(
    (carry, nextArr) => [
      ...carry,
      ...(Array.isArray(nextArr) ? nextArr : [nextArr]),
    ],
    [],
  );
};

export const trim = (str: string, char: string = '\\s') => {
  const regex = new RegExp('^' + char + '+|' + char + '+$', 'g');
  return str.replace(regex, '');
};
