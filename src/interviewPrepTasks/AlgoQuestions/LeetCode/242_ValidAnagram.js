/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (s, t) {
  if (s.length !== t.length) return false;
  const mapT = new Map();

  for (let i = 0; i < t.length; i++) {
    mapT.has(t[i]) ? mapT.set(t[i], mapT.get(t[i]) + 1) : mapT.set(t[i], 1);
  }

  for (let i = 0; i < s.length; i++) {
    if (mapT.has(s[i])) {
      mapT.set(s[i], mapT.get(s[i]) - 1);
      if (mapT.get(s[i]) === 0) {
        mapT.delete(s[i]);
      }
    } else {
      return false;
    }
  }

  return mapT.size === 0;
};

console.log(isAnagram('anagram', 'nagaram')); // true
console.log(isAnagram('rat', 'car')); // false
console.log(isAnagram('rat', 'toolong')); // false
