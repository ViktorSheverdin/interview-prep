/**
 * @template T, U
 * @param {(previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U} callbackFn
 * @param {U} [initialValue]
 * @return {U}
 */
Array.prototype.myReduce = function (callbackFn, initialValue) {
  if (typeof callbackFn !== 'function') {
    throw new TypeError('Not a function');
  }

  let accumulator = initialValue;
  let index = 0;

  if (typeof initialValue === 'undefined') {
    accumulator = this[0];
    index = 1;
  }

  for (let i = index; i < this.length; i++) {
    if (i in this) {
      accumulator = callbackFn(accumulator, this[i], i, this);
    }
  }

  return accumulator;
};

console.log([1, 2, 3].myReduce((prev, curr) => prev + curr, 0)); // 6
console.log([1, 2, 3].myReduce((prev, curr) => prev + curr, 4)); // 10
