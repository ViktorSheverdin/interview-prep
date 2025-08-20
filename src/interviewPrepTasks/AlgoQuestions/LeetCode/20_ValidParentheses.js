/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  const parMap = new Map([
    ['[', ']'],
    ['{', '}'],
    ['(', ')'],
  ]);

  const stack = [];

  for (let i = 0; i < s.length; i++) {
    if (parMap.has(s[i])) {
      stack.push(s[i]);
    } else {
      if (stack.length === 0) {
        return false;
      }

      const topElement = stack.pop();

      if (parMap.get(topElement) !== s[i]) {
        return false;
      }
    }
  }

  return stack.length === 0;
};

console.log(isValid('()')); //true
console.log(isValid('()[]{}')); //true
console.log(isValid('([])')); //true
console.log(isValid('([]))')); //false
console.log(isValid('([')); //false
console.log(isValid('([}')); //false
