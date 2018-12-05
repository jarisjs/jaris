import { required } from '../src/rules/required';

describe('required', () => {
  it('should return success when the value is present', async done => {
    expect(await required()(1)).toHaveProperty('ok', true);
    expect(await required()(0)).toHaveProperty('ok', true);
    expect(await required()(true)).toHaveProperty('ok', true);
    expect(await required()(false)).toHaveProperty('ok', true);
    expect(await required()('')).toHaveProperty('ok', true);
    expect(await required()('not empty')).toHaveProperty('ok', true);
    expect(await required()([])).toHaveProperty('ok', true);
    expect(await required()([1, 2, 3])).toHaveProperty('ok', true);
    expect(await required()({})).toHaveProperty('ok', true);
    expect(await required()({ key: 'value' })).toHaveProperty('ok', true);
    done();
  });

  it('should return error when the value is not present', async done => {
    expect(await required()(null)).toHaveProperty('ok', false);
    expect(await required()(undefined)).toHaveProperty('ok', false);
    done();
  });
});
