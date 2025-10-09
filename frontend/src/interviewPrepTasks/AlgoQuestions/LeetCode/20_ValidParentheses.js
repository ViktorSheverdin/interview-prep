// Given a string s containing just the characters '(', ')', '{', '}', '[' and ']',
// determine if the input string is valid.

// An input string is valid if:

// Open brackets must be closed by the same type of brackets.
// Open brackets must be closed in the correct order.
// Every close bracket has a corresponding open bracket of the same type.
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  const map = {
    '(': ')',
    '{': '}',
    '[': ']',
  };
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]]) {
      stack.push(s[i]);
    } else {
      if (stack.length === 0) {
        return false;
      }
      const topP = stack.pop();
      if (map[topP] !== s[i]) {
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
