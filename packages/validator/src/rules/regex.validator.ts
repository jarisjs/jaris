import { validatorSuccess, validatorError, wrap } from '../index';

export function regex(pattern: string) {
  return (value: string) =>
    RegExp(pattern).test(value)
      ? validatorSuccess()
      : validatorError('invalid value');
}

export const webColor = wrap(regex('^#[0-9a-fA-F]{6}$'));
export const username = wrap(regex('^[a-zA-Z0-9-_]{1,}$'));
export const uuid = wrap(
  regex(
    '[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}',
  ),
);
