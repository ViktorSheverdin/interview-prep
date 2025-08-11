const STATE = {
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
  PENDING: 'pending',
};

class MyPromise {
  #thenCbs = [];
  #catchCbs = [];
  #state = STATE.PENDING;
  #value;
  #onSuccessBind = this.#onSuccess.bind(this);
  #onFailBind = this.#onFail.bind(this);

  constructor(cb) {
    try {
      cb(this.#onSuccessBind, this.#onFailBind);
    } catch (e) {
      this.#onFail(e);
    }
  }

  #runCallbacks() {
    if (this.#state === STATE.FULFILLED) {
      this.#thenCbs.forEach((callback) => {
        callback(this.#value);
      });

      this.#thenCbs = [];
    }

    if (this.#state === STATE.REJECTED) {
      this.#catchCbs.forEach((callback) => {
        callback(this.#value);
      });

      this.#catchCbs = [];
    }
  }

  #onSuccess(value) {
    queueMicrotask(() => {
      if (this.#state !== STATE.PENDING) return;

      if (value instanceof MyPromise) {
        value.then(this.#onSuccessBind, this.#onFailBind);
        return;
      }

      this.#value = value;
      this.#state = STATE.FULFILLED;
      this.#runCallbacks();
    });
  }

  #onFail(value) {
    queueMicrotask(() => {
      if (this.#state !== STATE.PENDING) return;

      if (value instanceof MyPromise) {
        value.then(this.#onSuccessBind, this.#onFailBind);
        return;
      }

      this.#value = value;
      this.#state = STATE.REJECTED;
      this.#runCallbacks();
    });
  }

  then(thenCb, catchCb) {
    return new MyPromise((resolve, reject) => {
      this.#thenCbs.push((result) => {
        if (thenCb == null) {
          resolve(result);
          return;
        }

        try {
          resolve(thenCb(result));
        } catch (error) {
          reject(error);
        }
      });

      this.#catchCbs.push((result) => {
        if (catchCb == null) {
          reject(result);
          return;
        }

        try {
          resolve(catchCb(result));
        } catch (error) {
          reject(error);
        }
      });

      this.#runCallbacks();
    });
  }

  catch(cb) {
    return this.then(undefined, cb);
  }

  finally(cb) {
    return this.then(
      (result) => {
        cb();
        return result;
      },
      (result) => {
        cb();
        throw result;
      }
    );
  }

  static resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(value) {
    return new MyPromise((resolve, reject) => {
      reject(value);
    });
  }

  static all(iterable) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(iterable)) {
        return reject('Not iterable');
      }

      if (iterable.length === 0) {
        return resolve([]);
      }

      const results = [];
      let resolvedPromises = 0;

      for (let i = 0; i < iterable.length; i++) {
        const item = iterable[i];

        Promise.resolve(item)
          .then((result) => {
            results.push(result);
            resolvedPromises++;

            if (iterable.length === resolvedPromises) {
              return resolve(results);
            }
          })
          .catch(reject);
      }
    });
  }

  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) return reject('Not iterable');

      if (promises.length === 0) return resolve([]);

      const results = [];
      let resolvedCount = 0;

      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i];

        promise
          .then((value) => {
            results[i] = { status: STATE.FULFILLED, value };
          })
          .catch((reason) => {
            results[i] = { status: STATE.REJECTED, reason };
          })
          .finally(() => {
            resolvedCount++;
            if (resolvedCount === promises.length) {
              resolve(results);
            }
          });
      }
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) return reject('Not iterable');

      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i];
        promise.then(resolve).catch(reject);
      }
    });
  }

  static any(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) return reject('Not iterable');

      const failedPromises = [];
      let failedCount = 0;

      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i];

        promise.then(resolve).catch((value) => {
          failedPromises.push(value);
          failedCount++;

          if (failedCount === promise.length) {
            reject(failedPromises);
          }
        });
      }
    });
  }
}

module.exports = MyPromise;
