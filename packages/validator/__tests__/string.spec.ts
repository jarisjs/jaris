import string from '../src/rules/string';

describe('string', () => {
  it('should return success when the value is a string', async done => {
    expect(await string()('12345')).toHaveProperty('ok', true);
    expect(await string()('anythign')).toHaveProperty('ok', true);
    expect(await string()('a')).toHaveProperty('ok', true);
    done();
  });

  it('should return failure when the value is not a string', async done => {
    expect(await string()(2)).toHaveProperty('ok', false);
    expect(await string()(false)).toHaveProperty('ok', false);
    expect(await string()({ length: 4 })).toHaveProperty('ok', false);
    expect(await string()(() => {})).toHaveProperty('ok', false);
    expect(await string()(null)).toHaveProperty('ok', false);
    expect(await string()(undefined)).toHaveProperty('ok', false);
    done();
  });
});
