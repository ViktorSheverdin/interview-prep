// Given an integer x, return true if x is a palindrome, and false otherwise.

/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
  const strInput = x.toString();
  let l = 0;
  let r = strInput.length - 1;

  while (l < r) {
    if (strInput[l] !== strInput[r]) {
      return false;
    }
    l++;
    r--;
  }
  return true;
};

console.log(isPalindrome(121)); // true
console.log(isPalindrome(0)); // true
console.log(isPalindrome(1221)); // true
console.log(isPalindrome(12321)); // true

console.log(isPalindrome(-121)); // false
console.log(isPalindrome(10)); // false
