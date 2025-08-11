/**
 * @template T, U
 * @param {(previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U} callbackFn
 * @param {U} [initialValue]
 * @return {U}
 */
Array.prototype.myReduce = function (callbackFn, initialValue) {};

console.log([1, 2, 3].myReduce((prev, curr) => prev + curr, 0)); // 6
console.log([1, 2, 3].myReduce((prev, curr) => prev + curr, 4)); // 10
