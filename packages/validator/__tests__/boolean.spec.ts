import { boolean } from '../src/rules/boolean';

describe('boolean', () => {
  it('should return success when the value is a boolean', async done => {
    expect(await boolean()(true)).toHaveProperty('ok', true);
    expect(await boolean()(false)).toHaveProperty('ok', true);
    done();
  });

  it('should return failure when the value is not an array', async done => {
    expect(await boolean()('not a boolean')).toHaveProperty('ok', false);
    expect(await boolean()(3)).toHaveProperty('ok', false);
    expect(await boolean()({ length: 4 })).toHaveProperty('ok', false);
    expect(await boolean()(() => {})).toHaveProperty('ok', false);
    expect(await boolean()(null)).toHaveProperty('ok', false);
    expect(await boolean()(undefined)).toHaveProperty('ok', false);
    done();
  });
});
