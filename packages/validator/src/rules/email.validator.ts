import * as validator from 'validator';
import { ValidatorReturn } from '../index';

const email = () => {
  return async (value: string): ValidatorReturn => {
    if (validator.isEmail(value)) {
      return Promise.resolve({
        ok: true,
        next: true,
      });
    }

    return Promise.resolve({
      ok: false,
      next: true,
      error: 'is not a valid email',
    });
  };
};

export default email;
