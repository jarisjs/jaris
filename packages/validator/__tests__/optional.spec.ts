import validate from '../src/index';
import optional from '../src/rules/optional';

describe('optional', () => {
  it('should return success when the value is not present', async done => {
    expect(await optional()()).toHaveProperty('ok', true);
    expect(await optional()()).toHaveProperty('next', false);
    done();
  });

  it('should return success when the value is explicitly undefined', async done => {
    expect(await optional()(undefined)).toHaveProperty('ok', true);
    expect(await optional()(undefined)).toHaveProperty('next', false);
    done();
  });

  it('should not continue with other validators if the field is not present', async done => {
    const fakeValidator = jest.fn();

    await validate(
      { test: undefined },
      {
        test: [optional(), () => fakeValidator],
      },
    );

    expect(fakeValidator).toHaveBeenCalledTimes(0);
    done();
  });

  it('should continue with other validators if the field is present', async done => {
    const fakeValidator = jest.fn(() => () => true);

    await validate(
      { test: 'is present' },
      {
        test: [optional(), fakeValidator],
      },
    );

    expect(fakeValidator).toHaveBeenCalledTimes(1);
    done();
  });

  it('should return success and next true if the value is present', async done => {
    expect(await optional()('is present')).toHaveProperty('ok', true);
    expect(await optional()('is present')).toHaveProperty('next', true);
    done();
  });
});
