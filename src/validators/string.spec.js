import { expect } from 'chai';
import {
  minimumLength,
  maximumLength,
  length,
  isEqual,
  isNotEqual,
  isIn,
  isNotIn,
  pattern,
} from './string';

describe('minimumLength', () => {
  const checkMinimumLength = minimumLength('Not valid', 5);

  it('should fail for empty string', async () => {
    const input = { value: '' };

    const err = await checkMinimumLength(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should pass for long text', async () => {
    const input = { value: 'this is a long test string' };

    const err = await checkMinimumLength(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for short string', async () => {
    const input = { value: 'test' };

    const err = await checkMinimumLength(input);
    expect(err).to.be.equal('Not valid');
  });
});

describe('maximumLength', () => {
  const checkMaximumLength = maximumLength('Not valid', 5);

  it('should pass for empty string', async () => {
    const input = { value: '' };

    const err = await checkMaximumLength(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for long text', async () => {
    const input = { value: 'this is a long test string' };

    const err = await checkMaximumLength(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should pass for short string', async () => {
    const input = { value: 'test' };

    const err = await checkMaximumLength(input);
    expect(err).to.be.an('undefined');
  });
});

describe('length', () => {
  const checkLength = length('Not valid', 5, 12);

  it('should fail for empty string', async () => {
    const input = { value: '' };

    const err = await checkLength(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should pass for text in length range', async () => {
    const input = { value: 'sample text' };

    const err = await checkLength(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for too short string', async () => {
    const input = { value: 'test' };

    const err = await checkLength(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should fail for too long string', async () => {
    const input = { value: 'this sample string is too long' };

    const err = await checkLength(input);
    expect(err).to.be.equal('Not valid');
  });
});

describe('isEqual', () => {
  const checkEquality = isEqual('Not valid', '5');

  it('should fail for non matching empty string', async () => {
    const input = { value: '' };

    const err = await checkEquality(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should fail for a matching number but wrong type', async () => {
    const input = { value: 5 };

    const err = await checkEquality(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should fail for a non matching NaN', async () => {
    const input = { value: NaN };

    const err = await checkEquality(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should fail for a non matching Infinity', async () => {
    const input = { value: Infinity };

    const err = await checkEquality(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should fail for non matching string', async () => {
    const input = { value: 'test' };

    const err = await checkEquality(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should pass for matching string', async () => {
    const input = { value: '5' };

    const err = await checkEquality(input);
    expect(err).to.be.an('undefined');
  });
});

describe('isNotEqual', () => {
  const checkNonEquality = isNotEqual('Not valid', '5');

  it('should pass for non matching empty string', async () => {
    const input = { value: '' };

    const err = await checkNonEquality(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for a matching number but wrong type', async () => {
    const input = { value: 5 };

    const err = await checkNonEquality(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for a non matching NaN', async () => {
    const input = { value: NaN };

    const err = await checkNonEquality(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for a non matching Infinity', async () => {
    const input = { value: Infinity };

    const err = await checkNonEquality(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for non matching string', async () => {
    const input = { value: 'test' };

    const err = await checkNonEquality(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for matching string', async () => {
    const input = { value: '5' };

    const err = await checkNonEquality(input);
    expect(err).to.be.equal('Not valid');
  });
});

describe('isIn', () => {
  const checkIsIn = isIn('Not valid', ['one', 2, true]);

  it('should fail for non matching empty string', async () => {
    const input = { value: '' };

    const err = await checkIsIn(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should fail for non matching string', async () => {
    const input = { value: 'test' };

    const err = await checkIsIn(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should fail for non matching number', async () => {
    const input = { value: 5 };

    const err = await checkIsIn(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should fail for matching number but the wrong type', async () => {
    const input = { value: '5' };

    const err = await checkIsIn(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should fail for non matching boolean', async () => {
    const input = { value: false };

    const err = await checkIsIn(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should pass for matching string', async () => {
    const input = { value: 'one' };

    const err = await checkIsIn(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for matching string', async () => {
    const input = { value: 'one' };

    const err = await checkIsIn(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for matching number', async () => {
    const input = { value: 2 };

    const err = await checkIsIn(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for matching boolean', async () => {
    const input = { value: true };

    const err = await checkIsIn(input);
    expect(err).to.be.an('undefined');
  });
});

describe('isNotIn', () => {
  const checkIsNotIn = isNotIn('Not valid', ['one', 2, true]);

  it('should pass for non matching empty string', async () => {
    const input = { value: '' };

    const err = await checkIsNotIn(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for non matching string', async () => {
    const input = { value: 'test' };

    const err = await checkIsNotIn(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for non matching number', async () => {
    const input = { value: 5 };

    const err = await checkIsNotIn(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for matching number but the wrong type', async () => {
    const input = { value: '5' };

    const err = await checkIsNotIn(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for non matching boolean', async () => {
    const input = { value: false };

    const err = await checkIsNotIn(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for matching string', async () => {
    const input = { value: 'one' };

    const err = await checkIsNotIn(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should fail for matching string', async () => {
    const input = { value: 'one' };

    const err = await checkIsNotIn(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should fail for matching number', async () => {
    const input = { value: 2 };

    const err = await checkIsNotIn(input);
    expect(err).to.be.equal('Not valid');
  });
  it('should fail for matching boolean', async () => {
    const input = { value: true };

    const err = await checkIsNotIn(input);
    expect(err).to.be.equal('Not valid');
  });
});

describe('pattern', () => {
  const checkPattern = pattern('Not valid', /[a-z]+/i);

  it('should pass for matching string', async () => {
    const input = { value: 'abc' };

    const err = await checkPattern(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for non matching string', async () => {
    const input = { value: '123' };

    const err = await checkPattern(input);
    expect(err).to.be.equal('Not valid');
  });
});
