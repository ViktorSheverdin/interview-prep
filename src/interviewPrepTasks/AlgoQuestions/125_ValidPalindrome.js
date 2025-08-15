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
