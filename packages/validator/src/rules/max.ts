import { length } from './length';

export const max = (max: number) =>
  length(0, max, `cannot exceed length of ${max}`);
