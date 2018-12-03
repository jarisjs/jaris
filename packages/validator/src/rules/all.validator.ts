import { allP } from '../helpers/promise.helper';
import { validatorSuccess, validatorError } from '../index';

export type BoolExpCallback = (property: any) => boolean | Promise<boolean>;

export const all = (evaluator: BoolExpCallback) => async (value: any[]) =>
  (await allP(async (elem: any) => await evaluator(elem), value))
    ? validatorSuccess()
    : validatorError('invalid array');
