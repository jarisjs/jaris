import { ValidatorReturn } from '../index';
import { get } from 'lodash';
import required from './required.validator';
import optional from './optional.validator';

const requiredWith = (propertyPath: string, expectedValue: any) => {
  return async (value: any, body: any): ValidatorReturn =>
    get(body, propertyPath) === expectedValue
      ? required()(value)
      : optional()(value);
};

export default requiredWith;
