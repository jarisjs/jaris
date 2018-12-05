import { ValidatorReturn } from './types';

export async function allP(
  pPred: (elem: any) => Promise<boolean>,
  list: any[],
) {
  for (let i = 0; i < list.length; i++) {
    const pred = await pPred(list[i]);
    if (!pred) {
      return false;
    }
  }
  return true;
}

export async function anyP(
  pPred: (elem: any) => Promise<boolean>,
  list: any[],
) {
  for (let i = 0; i < list.length; i++) {
    const pred = await pPred(list[i]);
    if (pred) {
      return true;
    }
  }
  return false;
}

export function get(path: string, object: any, defaultValue: any = '') {
  const split = path.split('.');

  return split.reduce((carry, next) => {
    if (typeof carry[next] !== 'undefined') {
      return carry[next];
    }

    return defaultValue;
  }, object);
}

export function wrap(value: any) {
  return () => value;
}

export async function validatorSuccess(next: boolean = true): ValidatorReturn {
  return {
    ok: true,
    next,
  };
}

export async function validatorError(
  error: string | { [key: string]: string[] | string },
  next: boolean = true,
): ValidatorReturn {
  return {
    ok: false,
    next,
    error,
  };
}

export function range(size: number, startAt: number = 0): number[] {
  return [...Array(size).keys()].map(i => i + startAt);
}
