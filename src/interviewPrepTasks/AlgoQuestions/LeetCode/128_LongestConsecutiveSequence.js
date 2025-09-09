// Given an unsorted array of integers nums
// return the length of the longest consecutive elements sequence.

// You must write an algorithm that runs in O(n) time.

/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function (nums) {
  if (nums.length === 0) return 0;

  let maxL = 0;
  const setN = new Set(nums);
  for (const num of setN) {
    if (!setN.has(num - 1)) {
      let currentLength = 1;

      while (setN.has(num + currentLength)) {
        currentLength++;
      }
      maxL = Math.max(maxL, currentLength);
    }
  }
  return maxL;
};

console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4
console.log(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])); // 9
console.log(longestConsecutive([1, 0, 1, 2])); // 3
console.log(longestConsecutive([0, -1])); // 2
