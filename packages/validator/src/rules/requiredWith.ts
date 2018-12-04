import { ValidatorReturn } from '../types';
import { get } from '../helpers';
import { required } from './required';
import { optional } from './optional';

export const requiredWith = (propertyPath: string, expectedValue: any) => {
  return async (value: any, body: any): ValidatorReturn =>
    get(body, propertyPath) === expectedValue
      ? required()(value)
      : optional()(value);
};
