// Given an unsorted array of integers nums
// return the length of the longest consecutive elements sequence.

// You must write an algorithm that runs in O(n) time.

/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function (nums) {
  const map = {};
  let maxL = 1;
  for (let i = 0; i < nums.length; i++) {
    map[nums[i]] = i;
  }
  for (let i = 0; i < nums.length; i++) {
    if (!map[nums[i] - 1]) {
      let length = 1;
      while (map[nums[i] + length]) {
        length++;
      }
      maxL = Math.max(maxL, length);
    }
  }
  return maxL;
};

console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4
console.log(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])); // 9
console.log(longestConsecutive([1, 0, 1, 2])); // 3
