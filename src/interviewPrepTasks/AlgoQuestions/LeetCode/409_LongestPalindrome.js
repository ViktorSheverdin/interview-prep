/**
 * @param {string} s
 * @return {number}
 */
var longestPalindrome = function (s) {
  if (s.length === 1) return 1;
  let odd_count = 0;
  const histogram = Object.create(null);

  for (const char of s) {
    histogram[char] = (histogram[char] || 0) + 1;

    if (histogram[char] % 2 === 1) {
      odd_count++;
    } else {
      odd_count--;
    }
  }

  if (odd_count > 0) {
    return s.length - odd_count + 1;
  }
  return s.length;
};

console.log(longestPalindrome('abccccdd')); // 7
console.log(longestPalindrome('a')); // 1
console.log(longestPalindrome('aA')); // 1
console.log(longestPalindrome('aAa')); // 3
console.log(longestPalindrome('aa')); // 2
console.log(longestPalindrome('aabb')); // 4
