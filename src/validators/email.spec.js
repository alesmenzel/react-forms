import { expect } from 'chai';
import { isEmail } from './email';

describe('isEmail', () => {
  const checkEmail = isEmail('Not valid');

  it('should fail for invalid address', async () => {
    const input = { value: 'notAValidEmail' };

    const err = await checkEmail(input);

    expect(err).to.be.equal('Not valid');
  });

  it('should pass for valid address', async () => {
    const input = { value: 'validemail@address.com' };

    const err = await checkEmail(input);

    expect(err).to.be.an('undefined');
  });
});
