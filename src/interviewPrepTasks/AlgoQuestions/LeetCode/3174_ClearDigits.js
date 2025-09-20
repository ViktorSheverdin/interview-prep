// You are given a string s.

// Your task is to remove all digits by doing this operation repeatedly:

// Delete the first digit and the closest non-digit character to its left.
// Return the resulting string after removing all digits.

// Note that the operation cannot be performed on a digit that does not have any non-digit character to its left.

/**
 * @param {string} s
 * @return {string}
 */
var clearDigits = function (s) {
  let stack = '';
  for (let i = 0; i < s.length; i++) {
    if (!isNaN(Number(s[i]))) {
      if (!s[i - 1]) return '';
      stack = stack.slice(0, -1);
      continue;
    }
    stack += s[i];
  }
  return stack;
};

console.log(clearDigits('abc')); // "abc"
console.log(clearDigits('cb34')); // ""
console.log(clearDigits('cbv34')); // "c"
console.log(clearDigits('cbv3423')); // ""
console.log(clearDigits('cbv3')); // "cb"
