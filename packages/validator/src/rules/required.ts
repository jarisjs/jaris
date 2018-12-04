import { validatorError, validatorSuccess } from '../helpers';
import { ValidatorReturn } from '../types';

export const required = () => {
  return async (value: any): ValidatorReturn => {
    return value === null || value === undefined
      ? validatorError('is required', false)
      : validatorSuccess();
  };
};
