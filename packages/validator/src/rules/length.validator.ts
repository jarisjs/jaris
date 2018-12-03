import * as R from 'ramda';
import { validatorSuccess, validatorError } from '../index';

export const length = (
  min: number,
  max: number,
  errorMessage: string | undefined = undefined,
) => (value: any[] | string) => {
  if (typeof value === 'string') {
    value = R.trim(value);
  }
  return value.length <= max && value.length >= min
    ? validatorSuccess()
    : validatorError(
        errorMessage || `needs to have a length between ${min} and ${max}`,
      );
};

export const min = (min: number) =>
  length(min, Infinity, `needs to have length of at least ${min}`);
export const max = (max: number) =>
  length(0, max, `cannot exceed length of ${max}`);

export default length;
