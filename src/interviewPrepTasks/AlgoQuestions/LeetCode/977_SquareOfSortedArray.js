// Given an integer array nums sorted in non-decreasing order,
// return an array of the squares of each number sorted in non-decreasing order.

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function (nums) {
  let l = 0;
  let r = nums.length - 1;
  const returnArr = new Array(nums.length);
  for (let i = nums.length - 1; i >= 0; i--) {
    const lSquare = nums[l] * nums[l];
    const rSquare = nums[r] * nums[r];

    if (lSquare <= rSquare) {
      returnArr[i] = rSquare;
      r--;
    } else {
      returnArr[i] = lSquare;
      l++;
    }
  }

  return returnArr;
};

console.log(sortedSquares([-4, -1, 0, 3, 10])); // [0,1,9,16,100]
console.log(sortedSquares([-7, -3, 2, 3, 11])); // [4,9,9,49,121]
