/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
  let canditate = nums[0];
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    if (count === 0) {
      canditate = nums[i];
    }
    if (canditate === nums[i]) {
      count++;
    } else {
      count--;
    }
  }
  return canditate;
};

console.log(majorityElement([3, 2, 3])); // 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2
