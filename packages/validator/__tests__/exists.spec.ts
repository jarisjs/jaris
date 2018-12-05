import exists from '../src/rules/exists';

describe('exists', () => {
  it('should return success when the value is in the array', async done => {
    expect(await exists([1, 2, 3, 4])(2)).toHaveProperty('ok', true);
    done();
  });

  it('should return failure when the value is not in the array', async done => {
    expect(await exists([1, 2, 3, 4])('doesnt exist')).toHaveProperty(
      'ok',
      false,
    );
    done();
  });

  it('should return failure when the value is not of the right type in the array', async done => {
    expect(await exists([1, 2, 3, 4])('2')).toHaveProperty('ok', false);
    done();
  });

  it('should return set the error message on failure', async done => {
    expect(await exists([1, 2, 3, 4])('doesnt exist')).toHaveProperty('error');
    done();
  });
});
