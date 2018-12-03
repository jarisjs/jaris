import { validatorSuccess, validatorError } from '../index';

export type BoolExpCallback = (property: any) => boolean | Promise<boolean>;

const lambda = (evaluator: BoolExpCallback, message = 'invalid value') => {
  return async (property: any) => {
    const result = await evaluator(property);

    return result ? validatorSuccess() : validatorError(message);
  };
};

export default lambda;
