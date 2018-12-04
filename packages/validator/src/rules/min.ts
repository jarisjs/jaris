import { length } from './length';

export const min = (min: number) =>
  length(min, Infinity, `needs to have length of at least ${min}`);
