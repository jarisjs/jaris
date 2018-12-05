import array from '../src/rules/array';

describe('array', () => {
  it('should return success when the value is an array', async done => {
    expect(await array()([1, 2, 3, 4])).toHaveProperty('ok', true);
    done();
  });

  it('should return failure when the value is not an array', async done => {
    expect(await array()('not an array')).toHaveProperty('ok', false);
    expect(await array()(3)).toHaveProperty('ok', false);
    expect(await array()({ length: 4 })).toHaveProperty('ok', false);
    expect(await array()(() => {})).toHaveProperty('ok', false);
    expect(await array()(null)).toHaveProperty('ok', false);
    expect(await array()(undefined)).toHaveProperty('ok', false);
    done();
  });
});
