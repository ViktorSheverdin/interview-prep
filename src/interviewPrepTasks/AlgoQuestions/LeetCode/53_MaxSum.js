/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  let maxSub = nums[0];
  let currentSum = 0;

  for (let i = 0; i < nums.length; i++) {
    if (currentSum < 0) {
      currentSum = 0;
    }
    currentSum += nums[i];
    if (maxSub < currentSum) {
      maxSub = currentSum;
    }
  }

  return maxSub;
};

// Kadane's algorithm

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([1])); // 1
console.log(maxSubArray([5, 4, -1, 7, 8])); // 23
console.log(maxSubArray([-10, -9, -8, -8, -7, -10])); // -7
