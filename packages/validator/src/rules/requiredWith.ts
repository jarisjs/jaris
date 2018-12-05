import { ValidatorReturn } from '../types';
import { get } from '../helpers';
import { required } from './required';
import { optional } from './optional';

export const requiredWith = (propertyPath: string, expectedValue?: any) => {
  return async (value: any, body: any): ValidatorReturn => {
    const otherProp = get(propertyPath, body);

    if (expectedValue) {
      return otherProp === expectedValue
        ? required()(value)
        : optional()(value);
    }

    return otherProp ? required()(value) : optional()(value);
  };
};
