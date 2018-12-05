import { ValidatorReturn } from '../types';
import { get } from '../helpers';
import required from './required';
import optional from './optional';

const requiredWith = (propertyPath: string, expectedValue?: any) => async (
  value: any,
  body: any,
): ValidatorReturn => {
  const otherProp = get(propertyPath, body);

  if (expectedValue) {
    return otherProp === expectedValue ? required()(value) : optional()(value);
  }

  return otherProp ? required()(value) : optional()(value);
};

export default requiredWith;
