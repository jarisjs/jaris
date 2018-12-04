import { validatorSuccess, validatorError } from '../helpers';
import { BoolExpCallback } from '../types';

export const lambda = (
  evaluator: BoolExpCallback,
  message = 'invalid value',
) => {
  return async (property: any) => {
    const result = await evaluator(property);

    return result ? validatorSuccess() : validatorError(message);
  };
};
