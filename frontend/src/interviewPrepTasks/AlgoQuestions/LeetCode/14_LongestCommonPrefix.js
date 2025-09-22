/**
 * LeetCode 14: Longest Common Prefix
 *
 * Algorithm: Vertical Scanning
 * Time Complexity: O(S) where S is the sum of all characters in all strings
 * Space Complexity: O(1)
 *
 * @param {string[]} strs - Array of strings to find common prefix for
 * @return {string} - The longest common prefix, empty string if none exists
 */
var longestCommonPrefix = function (strs) {
  if (!strs || strs.length === 0) return '';
  if (strs.length === 1) return strs[0];

  let res = '';

  for (let i = 0; i < strs[0].length; i++) {
    for (let s = 0; s < strs.length; s++) {
      if (i == strs[s].length || strs[s][i] !== strs[0][i]) {
        return res;
      }
    }
    res += strs[0][i];
  }
  return res;
};

// Test cases
console.log(longestCommonPrefix(['flower', 'flow', 'flight'])); // Expected: "fl"
console.log(longestCommonPrefix(['aab', 'aabc', 'aaby'])); // Expected: "aab"
console.log(longestCommonPrefix(['dog', 'racecar', 'car'])); // Expected: ""
console.log(longestCommonPrefix(['abc'])); // Expected: "abc" (single string)
console.log(longestCommonPrefix([])); // Expected: "" (empty array)
console.log(longestCommonPrefix(['', 'abc'])); // Expected: "" (empty string in array)
console.log(longestCommonPrefix(['same', 'same', 'same'])); // Expected: "same" (all identical)
