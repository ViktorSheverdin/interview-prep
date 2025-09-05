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
  const map = {};
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    map[nums[i]] = i;
  }

  for (let i = 0; i < nums.length; i++) {
    const currentNumber = nums[i];
    let secondNumber;
    if (
      (map[Number(0 - nums[i])] || map[Number(0 - nums[i])] === 0) &&
      map[Number(0 - nums[i])] !== i
    ) {
      secondNumber = nums[map[Number(0 - nums[i])]];
    }
    const numberNeededForZero = Number(0 - currentNumber - secondNumber);

    if (
      (map[numberNeededForZero] || map[numberNeededForZero] === 0) &&
      map[numberNeededForZero] !== i
    ) {
      result.push([currentNumber, secondNumber, numberNeededForZero]);
    }
  }
  return result;
};

console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]
// console.log(threeSum([0, 0, 0])); // [[0, 0, 0]]
// console.log(threeSum([0, 1, 1])); // []
