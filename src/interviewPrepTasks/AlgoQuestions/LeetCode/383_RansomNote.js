/**
 * @param {string} ransomNote
 * @param {string} magazine
 * @return {boolean}
 */
var canConstruct = function (ransomNote, magazine) {
  const magazineMap = {};
  for (const char of magazine) {
    magazineMap[char] = (magazineMap[char] || 0) + 1;
  }
  for (const char of ransomNote) {
    if (magazineMap[char] > 0) {
      magazineMap[char]--;
    } else {
      return false;
    }
  }
  return true;
};

console.log(canConstruct('a', 'b')); // false
console.log(canConstruct('aa', 'ab')); // false
console.log(canConstruct('aa', 'aab')); // true
