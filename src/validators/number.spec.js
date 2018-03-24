import { expect } from 'chai';
import {
  isNumber,
  isInteger,
  isFloat,
  minimum,
  maximum,
  range,
} from './number';

describe('isNumber', () => {
  const checkNumber = isNumber('Not a number');

  it('should fail for number as a string', async () => {
    const input = { value: '5' };

    const err = await checkNumber(input);
    expect(err).to.be.equal('Not a number');
  });
  it('should fail for a string', async () => {
    const input = { value: 'string' };

    const err = await checkNumber(input);
    expect(err).to.be.equal('Not a number');
  });
  it('should pass for negative numbers', async () => {
    const input = { value: -5 };

    const err = await checkNumber(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for zero', async () => {
    const input = { value: 0 };

    const err = await checkNumber(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for positive numbers', async () => {
    const input = { value: 5 };

    const err = await checkNumber(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for floats', async () => {
    const input = { value: 5.2 };

    const err = await checkNumber(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for infinite fractions', async () => {
    const input = { value: 1 / 3 };

    const err = await checkNumber(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for NaN', async () => {
    const input = { value: NaN };

    const err = await checkNumber(input);
    expect(err).to.be.equal('Not a number');
  });
  it('should fail for infinity', async () => {
    const input = { value: Infinity };

    const err = await checkNumber(input);
    expect(err).to.be.equal('Not a number');
  });
  it('should fail for negative infinity', async () => {
    const input = { value: -Infinity };

    const err = await checkNumber(input);
    expect(err).to.be.equal('Not a number');
  });
});

describe('isInteger', () => {
  const checkInteger = isInteger('Not an integer');

  it('should fail for number as a string', async () => {
    const input = { value: '5' };

    const err = await checkInteger(input);
    expect(err).to.be.equal('Not an integer');
  });
  it('should fail for a string', async () => {
    const input = { value: 'string' };

    const err = await checkInteger(input);
    expect(err).to.be.equal('Not an integer');
  });
  it('should pass for negative numbers', async () => {
    const input = { value: -5 };

    const err = await checkInteger(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for zero', async () => {
    const input = { value: 0 };

    const err = await checkInteger(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for positive numbers', async () => {
    const input = { value: 5 };

    const err = await checkInteger(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for floats', async () => {
    const input = { value: 5.2 };

    const err = await checkInteger(input);
    expect(err).to.be.equal('Not an integer');
  });
  it('should fail for infinite fractions', async () => {
    const input = { value: 1 / 3 };

    const err = await checkInteger(input);
    expect(err).to.be.equal('Not an integer');
  });
  it('should fail for NaN', async () => {
    const input = { value: NaN };

    const err = await checkInteger(input);
    expect(err).to.be.equal('Not an integer');
  });
  it('should fail for infinity', async () => {
    const input = { value: Infinity };

    const err = await checkInteger(input);
    expect(err).to.be.equal('Not an integer');
  });
  it('should fail for negative infinity', async () => {
    const input = { value: -Infinity };

    const err = await checkInteger(input);
    expect(err).to.be.equal('Not an integer');
  });
});

describe('isFloat', () => {
  const checkFloat = isFloat('Not a float');

  it('should fail for number as a string', async () => {
    const input = { value: '5' };

    const err = await checkFloat(input);
    expect(err).to.be.equal('Not a float');
  });
  it('should fail for a string', async () => {
    const input = { value: 'string' };

    const err = await checkFloat(input);
    expect(err).to.be.equal('Not a float');
  });
  it('should fail for negative numbers', async () => {
    const input = { value: -5 };

    const err = await checkFloat(input);
    expect(err).to.be.equal('Not a float');
  });
  it('should fail for zero', async () => {
    const input = { value: 0 };

    const err = await checkFloat(input);
    expect(err).to.be.equal('Not a float');
  });
  it('should fail for positive numbers', async () => {
    const input = { value: 5 };

    const err = await checkFloat(input);
    expect(err).to.be.equal('Not a float');
  });
  it('should pass for floats', async () => {
    const input = { value: 5.2 };

    const err = await checkFloat(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for floats with 0 decimal', async () => {
    const input = { value: 5.0 };

    const err = await checkFloat(input);
    expect(err).to.be.equal('Not a float');
  });
  it('should pass for infinite fractions', async () => {
    const input = { value: 1 / 3 };

    const err = await checkFloat(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for NaN', async () => {
    const input = { value: NaN };

    const err = await checkFloat(input);
    expect(err).to.be.equal('Not a float');
  });
  it('should fail for infinity', async () => {
    const input = { value: Infinity };

    const err = await checkFloat(input);
    expect(err).to.be.equal('Not a float');
  });
  it('should fail for negative infinity', async () => {
    const input = { value: -Infinity };

    const err = await checkFloat(input);
    expect(err).to.be.equal('Not a float');
  });
});

describe('minimum', () => {
  const checkMinimum = minimum('Not minimum of 5', 5);

  it('should fail for number as a string', async () => {
    const input = { value: '5' };

    const err = await checkMinimum(input);
    expect(err).to.be.equal('Not minimum of 5');
  });
  it('should fail for a string', async () => {
    const input = { value: 'string' };

    const err = await checkMinimum(input);
    expect(err).to.be.equal('Not minimum of 5');
  });
  it('should fail for negative numbers less than minimum', async () => {
    const input = { value: -5 };

    const err = await checkMinimum(input);
    expect(err).to.be.equal('Not minimum of 5');
  });
  it('should fail for zero', async () => {
    const input = { value: 0 };

    const err = await checkMinimum(input);
    expect(err).to.be.equal('Not minimum of 5');
  });
  it('should pass for positive numbers higher or equal than minimum', async () => {
    const input = { value: 5 };

    const err = await checkMinimum(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for floats higher than minimum', async () => {
    const input = { value: 5.2 };

    const err = await checkMinimum(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for floats with 0 decimal higher or equal than minimum', async () => {
    const input = { value: 5.0 };

    const err = await checkMinimum(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for infinite fractions less than minimum', async () => {
    const input = { value: 1 / 3 };

    const err = await checkMinimum(input);
    expect(err).to.be.equal('Not minimum of 5');
  });
  it('should fail for NaN', async () => {
    const input = { value: NaN };

    const err = await checkMinimum(input);
    expect(err).to.be.equal('Not minimum of 5');
  });
  it('should pass for infinity', async () => {
    const input = { value: Infinity };

    const err = await checkMinimum(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for negative infinity', async () => {
    const input = { value: -Infinity };

    const err = await checkMinimum(input);
    expect(err).to.be.equal('Not minimum of 5');
  });
});

describe('maximum', () => {
  const checkMaximum = maximum('Not maximum of 5', 5);

  it('should fail for number as a string', async () => {
    const input = { value: '5' };

    const err = await checkMaximum(input);
    expect(err).to.be.equal('Not maximum of 5');
  });
  it('should fail for a string', async () => {
    const input = { value: 'string' };

    const err = await checkMaximum(input);
    expect(err).to.be.equal('Not maximum of 5');
  });
  it('should pass for negative numbers less than maximum', async () => {
    const input = { value: -5 };

    const err = await checkMaximum(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for zero', async () => {
    const input = { value: 0 };

    const err = await checkMaximum(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for positive numbers less or equal than maximum', async () => {
    const input = { value: 5 };

    const err = await checkMaximum(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for floats higher than maximum', async () => {
    const input = { value: 5.2 };

    const err = await checkMaximum(input);
    expect(err).to.be.equal('Not maximum of 5');
  });
  it('should pass for floats with 0 decimal less or equal than maximum', async () => {
    const input = { value: 5.0 };

    const err = await checkMaximum(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for infinite fractions less than maximum', async () => {
    const input = { value: 1 / 3 };

    const err = await checkMaximum(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for NaN', async () => {
    const input = { value: NaN };

    const err = await checkMaximum(input);
    expect(err).to.be.equal('Not maximum of 5');
  });
  it('should fail for infinity', async () => {
    const input = { value: Infinity };

    const err = await checkMaximum(input);
    expect(err).to.be.equal('Not maximum of 5');
  });
  it('should pass for negative infinity', async () => {
    const input = { value: -Infinity };

    const err = await checkMaximum(input);
    expect(err).to.be.an('undefined');
  });
});

describe('range', () => {
  const checkRange = range('Not in range', -5, 5);

  it('should fail for number as a string', async () => {
    const input = { value: '5' };

    const err = await checkRange(input);
    expect(err).to.be.equal('Not in range');
  });
  it('should fail for a string', async () => {
    const input = { value: 'string' };

    const err = await checkRange(input);
    expect(err).to.be.equal('Not in range');
  });
  it('should pass for negative numbers in range', async () => {
    const input = { value: -5 };

    const err = await checkRange(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for zero in range', async () => {
    const input = { value: 0 };

    const err = await checkRange(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for positive numbers in range', async () => {
    const input = { value: 5 };

    const err = await checkRange(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for floats higher than maximum', async () => {
    const input = { value: 5.2 };

    const err = await checkRange(input);
    expect(err).to.be.equal('Not in range');
  });
  it('should fail for negative floats lower than minimum', async () => {
    const input = { value: -5.2 };

    const err = await checkRange(input);
    expect(err).to.be.equal('Not in range');
  });
  it('should pass for floats with 0 decimal in range', async () => {
    const input = { value: 5.0 };

    const err = await checkRange(input);
    expect(err).to.be.an('undefined');
  });
  it('should pass for infinite fractions in range', async () => {
    const input = { value: 1 / 3 };

    const err = await checkRange(input);
    expect(err).to.be.an('undefined');
  });
  it('should fail for NaN', async () => {
    const input = { value: NaN };

    const err = await checkRange(input);
    expect(err).to.be.equal('Not in range');
  });
  it('should fail for infinity', async () => {
    const input = { value: Infinity };

    const err = await checkRange(input);
    expect(err).to.be.equal('Not in range');
  });
  it('should fail for negative infinity', async () => {
    const input = { value: -Infinity };

    const err = await checkRange(input);
    expect(err).to.be.equal('Not in range');
  });
});
