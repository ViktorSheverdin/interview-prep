// Given an array nums of size n, return the majority element.

// The majority element is the element that appears more than ⌊n / 2⌋ times.
// You may assume that the majority element always exists in the array.

// Follow-up: Could you solve the problem in linear time and in O(1) space?

// Constraints:
// n == nums.length
// 1 <= n <= 5 * 104
// -109 <= nums[i] <= 109

/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
  let candidate = nums[0];
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[0];
    }
    if (nums[i] === candidate) {
      count++;
    } else {
      count--;
    }
  }
  return candidate;
};

console.log(majorityElement([3, 2, 3])); // 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2
