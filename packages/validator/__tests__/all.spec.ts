import { all } from '../src/rules/all';

describe('all', () => {
  it('should return success when all evaluations return true', async done => {
    const falsyValues = (value: any) => !value;

    expect(await all(falsyValues)([false, 0, '', null])).toHaveProperty(
      'ok',
      true,
    );
    done();
  });

  it('should return failure when one evaluation returns true', async done => {
    const falsyValues = (value: any) => !value;

    expect(await all(falsyValues)([false, 1, '', null])).toHaveProperty(
      'ok',
      false,
    );
    done();
  });

  it('should set an error message', async done => {
    const falsyValues = (value: any) => !value;

    expect(await all(falsyValues)([false, 1, '', null])).toHaveProperty(
      'error',
    );
    done();
  });
});
