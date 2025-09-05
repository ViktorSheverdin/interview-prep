// Given an array of integers nums and an integer target
// return indices of the two numbers such that they add up to target.

// You may assume that each input would have exactly one solution
// and you may not use the same element twice.

// You can return the answer in any order.

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const twoSum = (nums, target) => {
  let map = {};
  for (let i = 0; i < nums.length; i++) {
    const numberForSum = target - nums[i];
    if (map[numberForSum] || map[numberForSum] === 0) {
      return [i, map[numberForSum]];
    } else {
      map[nums[i]] = i;
    }
  }
};

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6)); // [1, 2]
console.log(twoSum([3, 3], 6)); // [0, 1]
