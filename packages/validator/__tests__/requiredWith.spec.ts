import validate from '../src/index';
import requiredWith from '../src/rules/requiredWith';

describe('requiredWith', () => {
  it('should return success when both of the values are present', async done => {
    expect(await requiredWith('name')(1, { name: 'test' })).toHaveProperty(
      'ok',
      true,
    );
    expect(await requiredWith('name')(0, { name: 'test' })).toHaveProperty(
      'ok',
      true,
    );
    expect(await requiredWith('name')(true, { name: 'test' })).toHaveProperty(
      'ok',
      true,
    );
    expect(await requiredWith('name')(false, { name: 'test' })).toHaveProperty(
      'ok',
      true,
    );
    expect(await requiredWith('name')('', { name: 'test' })).toHaveProperty(
      'ok',
      true,
    );
    expect(
      await requiredWith('name')('not empty', { name: 'test' }),
    ).toHaveProperty('ok', true);
    expect(await requiredWith('name')([], { name: 'test' })).toHaveProperty(
      'ok',
      true,
    );
    expect(
      await requiredWith('name')([1, 2, 3], { name: 'test' }),
    ).toHaveProperty('ok', true);
    expect(await requiredWith('name')({}, { name: 'test' })).toHaveProperty(
      'ok',
      true,
    );
    expect(
      await requiredWith('name')({ key: 'value' }, { name: 'test' }),
    ).toHaveProperty('ok', true);
    done();
  });

  it('should return success if this value is present but the other value is not present', async done => {
    expect(await requiredWith('name')(123, { name: undefined })).toHaveProperty(
      'ok',
      true,
    );
    expect(await requiredWith('name')(123, { name: null })).toHaveProperty(
      'ok',
      true,
    );
    done();
  });

  it('should return error when this value is not present but the other value is present', async done => {
    expect(await requiredWith('name')(undefined, { name: 123 })).toHaveProperty(
      'ok',
      false,
    );
    expect(
      await requiredWith('name')(undefined, { name: 'asdf' }),
    ).toHaveProperty('ok', false);
    done();
  });

  it('should work with nested property paths', async done => {
    expect(
      await requiredWith('person.pet.name')(undefined, {
        person: { pet: { name: '123' } },
      }),
    ).toHaveProperty('ok', false);
    done();
  });

  it('should check that a specific value is present', async done => {
    expect(
      await requiredWith('person.pet.name', '123')(undefined, {
        person: { pet: { name: '123' } },
      }),
    ).toHaveProperty('ok', false);

    expect(
      await requiredWith('person.pet.name', '123')('anything', {
        person: { pet: { name: '123' } },
      }),
    ).toHaveProperty('ok', true);

    expect(
      await requiredWith('person.pet.name', 'abc')(undefined, {
        person: { pet: { name: '123' } },
      }),
    ).toHaveProperty('ok', true);

    expect(
      await requiredWith('person.pet.name', 'abc')('anything', {
        person: { pet: { name: '123' } },
      }),
    ).toHaveProperty('ok', true);

    done();
  });

  it('should work all together', async done => {
    const { errors }: { errors: any } = await validate(
      {
        person: '123',
        name: undefined,
      },
      {
        person: [],
        name: [requiredWith('person')],
      },
    );

    expect(errors.name).toBeDefined();
    done();
  });
});
