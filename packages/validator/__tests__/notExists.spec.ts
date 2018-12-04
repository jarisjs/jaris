import { notExists } from '../src/rules/notExists';

describe('notExists', () => {
  it('should return success when the value is not in the array', async done => {
    expect(await notExists([1, 3, 4])(2)).toHaveProperty('ok', true);
    done();
  });

  it('should return failure when the value is in the array', async done => {
    expect(await notExists([1, 2, 3, 4])(3)).toHaveProperty('ok', false);
    done();
  });

  it('should return success when the value is not of the right type in the array', async done => {
    expect(await notExists([1, 2, 3, 4])('2')).toHaveProperty('ok', true);
    done();
  });

  it('should return set the error message on failure', async done => {
    expect(await notExists([1, 2, 3, 4])(2)).toHaveProperty('error');
    done();
  });
});
