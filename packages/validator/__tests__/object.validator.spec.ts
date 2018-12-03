import object from './object.validator';
import required from './required.validator';
import optional from './optional.validator';
import { number } from './type.validator';

describe('object validator', () => {
  it('should validate an empty object', async done => {
    expect((await object()({})).ok).toBe(true);
    done();
  });
  it('should validate any object with no rules', async done => {
    expect(
      (await object()({ foo: 'bar', meow: 'mix', func: () => {} })).ok,
    ).toBe(true);
    done();
  });
  it('should validate fail validation for a string when expects a number', async done => {
    expect((await object({ foo: [number()] })({ foo: 'bar' })).ok).toBe(false);
    done();
  });
  it('should fail when expects a required propery', async done => {
    expect((await object({ foo: [required()] })({ bar: 'foo' })).ok).toBe(
      false,
    );
    done();
  });
  it('should pass a simple validation', async done => {
    expect(
      (await object({ foo: [optional(), number()], bar: [required()] })({
        bar: 'foo',
      })).ok,
    ).toBe(true);
    expect(
      (await object({ foo: [optional(), number()], bar: [required()] })({
        foo: 123,
        bar: 'foo',
      })).ok,
    ).toBe(true);
    done();
  });
  it('should give a lot of errors', async done => {
    const res = await object({
      foo: [required(), number()],
      bar: [required(), object({ baz: [required(), number()] })],
    })({
      foo: 'some number',
      bar: {
        baz: '123',
      },
    });
    expect(res).toBeDefined();
    expect(
      res && res.error && res.error['bar'] && res.error['bar'].baz,
    ).toBeDefined();
    done();
  });
});
