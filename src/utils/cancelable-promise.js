import Debug from 'debug';

const debug = Debug('react-forms:utils:cancelable-promise');

const cancelable = promise => {
  let isCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(val => {
      if (isCanceled) {
        const err = new Error('Promise canceled');
        err.isCanceled = true;
        return reject(err);
      }

      return resolve(val);
    });
    promise.catch(err => {
      // eslint-disable-next-line
      err.isCanceled = isCanceled;

      return reject(err);
    });
  });

  return {
    promise: wrappedPromise,
    cancel() {
      debug('Promise cancelled');
      isCanceled = true;
    },
  };
};

export default cancelable;
