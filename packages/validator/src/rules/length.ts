import { validatorSuccess, validatorError } from '../helpers';

const length = (
  min: number,
  max: number,
  errorMessage: string | undefined = undefined,
) => (value: any[] | string) => {
  if (typeof value === 'string') {
    value = value.trim();
  }

  return value && value.length && value.length <= max && value.length >= min
    ? validatorSuccess()
    : validatorError(
        errorMessage || `needs to have a length between ${min} and ${max}`,
      );
};

export default length;
