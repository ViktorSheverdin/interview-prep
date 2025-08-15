/**
 * @param {any} thisContext
 * @param {...any} args
 * @return {any}
 */
Function.prototype.myCall = function (thisContext, ...args) {
  const context = Object(thisContext);
  const uniqueKey = Symbol();
  context[uniqueKey] = this;
  const result = context[uniqueKey](...args);
  delete context[uniqueKey];
  return result;
};

function multiplyAge(multiplier = 1) {
  return this.age * multiplier;
}

const mary = {
  age: 21,
};

const john = {
  age: 42,
};

console.log(multiplyAge.myCall(mary)); // 21
console.log(multiplyAge.myCall(john, 2)); // 84
