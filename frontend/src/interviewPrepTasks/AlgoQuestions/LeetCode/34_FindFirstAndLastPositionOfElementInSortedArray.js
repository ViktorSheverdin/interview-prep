// Given an array of integers nums sorted in non-decreasing order,
// find the starting and ending position of a given target value.

// If target is not found in the array, return [-1, -1].

// You must write an algorithm with O(log n) runtime complexity.

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
  if (nums.length === 0) return [-1, -1];
  let left = 0;
  let right = nums.length - 1;
  const result = [-1, -1];
  while (left <= right) {
    if (nums[left] !== target) {
      left++;
    } else {
      result[0] = left;
    }
    if (nums[right] !== target) {
      right--;
    } else {
      result[1] = right;
    }
    if (result[0] !== -1 && result[1] !== -1) {
      return result;
    }
  }
  return result;
};

console.log(searchRange([5, 7, 7, 8, 8, 10], 8)); // [3, 4]
console.log(searchRange([5, 7, 7, 8, 8, 10], 7)); // [-1, -1]
console.log(searchRange([5, 7, 7, 8, 8, 10], 6)); // [-1, -1]
console.log(searchRange([], 0)); // [-1, -1]
