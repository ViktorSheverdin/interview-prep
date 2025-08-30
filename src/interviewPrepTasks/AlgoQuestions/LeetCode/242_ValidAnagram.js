/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (s, t) {
  if (s.length !== t.length) return false;
  let mapS = {};
  for (const char of s) {
    mapS[char] = (mapS[char] || 0) + 1;
  }
  for (const char of t) {
    if (mapS[char]) {
      mapS[char] = mapS[char] - 1;
      if (mapS[char] === 0) {
        delete mapS[char];
      }
    } else {
      return false;
    }
  }
  return Object.keys(mapS).length === 0;
};

console.log(isAnagram('anagram', 'nagaram')); // true
console.log(isAnagram('rat', 'car')); // false
console.log(isAnagram('rat', 'toolong')); // false
