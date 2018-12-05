import number from '../src/rules/number';

describe('number', () => {
  it('should return success when the value is a number', async done => {
    expect(await number()(12345)).toHaveProperty('ok', true);
    done();
  });

  it('should return failure when the value is not a number', async done => {
    expect(await number()('not a number')).toHaveProperty('ok', false);
    expect(await number()('2')).toHaveProperty('ok', false);
    expect(await number()(false)).toHaveProperty('ok', false);
    expect(await number()({ length: 4 })).toHaveProperty('ok', false);
    expect(await number()(() => {})).toHaveProperty('ok', false);
    expect(await number()(null)).toHaveProperty('ok', false);
    expect(await number()(undefined)).toHaveProperty('ok', false);
    done();
  });
});
