import { expect } from 'chai';
import cancelable from './cancelable-promise';

const sleepPromise = ms =>
  new Promise(resolve => {
    setTimeout(() => resolve('data'), ms);
  });

describe('cancelable-promise', () => {
  it('should reject canceled promise with a flag', async () => {
    const { promise, cancel } = cancelable(sleepPromise(20));

    try {
      cancel();
      await promise;
    } catch (err) {
      expect(err.isCanceled).to.be.true();
      return;
    }

    throw new Error('Should have thrown');
  });

  it('should resolve promise that was not canceled', async () => {
    const { promise } = cancelable(sleepPromise(20));

    const res = await promise;
    expect(res).to.be.deep.equal('data');
  });
});
