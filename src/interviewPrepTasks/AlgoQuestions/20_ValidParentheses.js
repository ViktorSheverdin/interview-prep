/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  const charStack = [];

  const parenthesesMap = new Map([
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ]);

  for (let i = 0; i < s.length; i++) {
    if (parenthesesMap.has(s[i])) {
      charStack.push(s[i]);
    } else {
      if (charStack.length === 0) return false;
      const topOfStack = charStack.pop();
      if (parenthesesMap.get(topOfStack) !== s[i]) {
        return true;
      }
    }
  }

  return charStack.length === 0;
};

console.log(isValid('()')); //true
console.log(isValid('()[]{}')); //true
console.log(isValid('([])')); //true
console.log(isValid('([]))')); //false
console.log(isValid('([')); //false
