// A phrase is a palindrome if, after converting all uppercase \
// letters into lowercase letters and removing all non-alphanumeric characters,
// it reads the same forward and backward. Alphanumeric characters include letters and numbers.

// Given a string s, return true if it is a palindrome, or false otherwise.
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function (s) {
  const sanitized = s.toLowerCase().replace(/[^a-z0-9]/g, '');

  let left = 0;
  let right = sanitized.length - 1;
  let isP = true;

  while (left <= right) {
    if (sanitized[left] !== sanitized[right]) {
      return false;
    }
    left++;
    right--;
  }

  return isP;
};

console.log(isPalindrome('A man, a plan, a canal: Panama')); //true
console.log(isPalindrome('abccba')); //true
console.log(isPalindrome('abcdcba')); //true
console.log(isPalindrome('race a car')); //false
console.log(isPalindrome(' ')); //true
console.log(isPalindrome('not a palindrome')); //false
