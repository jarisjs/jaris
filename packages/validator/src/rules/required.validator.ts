import { validatorError, ValidatorReturn, validatorSuccess } from '../index';

const required = () => {
  return async (value: any): ValidatorReturn => {
    return value === null || value === undefined
      ? validatorError('is required', false)
      : validatorSuccess();
  };
};

export default required;
