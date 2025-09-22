// Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]]
// such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

// Notice that the solution set must not contain duplicate triplets.

// Constraints
// 3 <= nums.length <= 3000
// -105 <= nums[i] <= 105

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  const sNums = nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sNums.length; i++) {
    if (i > 0 && sNums[i] === sNums[i - 1]) continue;

    const target = 0 - sNums[i];
    let left = i + 1;
    let right = sNums.length - 1;
    while (left < right) {
      if (sNums[left] + sNums[right] < target) {
        left++;
      } else if (sNums[left] + sNums[right] > target) {
        right--;
      } else {
        result.push([sNums[i], sNums[left], sNums[right]]);
        while (left < right && sNums[left] === sNums[left + 1]) {
          left++;
        }
        while (left < right && sNums[right] === sNums[right - 1]) {
          right--;
        }
        left++;
        right--;
      }
    }
  }
  return result;
};

console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]
console.log(threeSum([0, 0, 0])); // [[0, 0, 0]]
console.log(threeSum([0, 0, 0, 0])); // [[0, 0, 0]]
console.log(threeSum([0, 1, 1])); // []
