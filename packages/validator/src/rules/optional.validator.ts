import { ValidatorReturn, validatorSuccess } from '../index';

const optional = () => {
  return async (value: string): ValidatorReturn => {
    if (typeof value === 'undefined') {
      // if the value is not present, do not continue with next validators
      return validatorSuccess(false);
    }

    return validatorSuccess();
  };
};

export default optional;
