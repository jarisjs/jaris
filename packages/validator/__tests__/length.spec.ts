import length from '../src/rules/length';

describe('length', () => {
  it('should return success when the value is the minimum length required', async done => {
    expect(await length(1, 4)('a')).toHaveProperty('ok', true);
    expect(await length(1, 4)([1])).toHaveProperty('ok', true);
    done();
  });

  it('should return success when the value is inbetween the minimum length and max length required', async done => {
    expect(await length(1, 4)('abc')).toHaveProperty('ok', true);
    expect(await length(1, 4)([1, 2, 3])).toHaveProperty('ok', true);
    done();
  });

  it('should return success when the value is the max length required', async done => {
    expect(await length(1, 4)('abcd')).toHaveProperty('ok', true);
    expect(await length(1, 4)([1, 2, 3, 4])).toHaveProperty('ok', true);
    done();
  });

  it('should return failure when the value is over the max length required', async done => {
    expect(await length(1, 4)('abcdefg')).toHaveProperty('ok', false);
    expect(await length(1, 4)([1, 2, 3, 4, 5, 6, 7])).toHaveProperty(
      'ok',
      false,
    );
    done();
  });

  it('should return failure on non array like', async done => {
    expect(await length(1, 4)(null as any)).toHaveProperty('ok', false);
    expect(await length(1, 4)(undefined as any)).toHaveProperty('ok', false);
    expect(await length(1, 4)((() => {}) as any)).toHaveProperty('ok', false);
    done();
  });
});
