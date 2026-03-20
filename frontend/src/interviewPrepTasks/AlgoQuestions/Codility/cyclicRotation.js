/**
 *
 * @param {number[]} nums
 * @param {number} k
 */
const cyclicRotation = (nums, k) => {
  if (nums.length === 0) return;
  let n = nums.length;
  k = k % n;
  console.log("k: ", k);
  for (let i = 0; i < k; i++) {
    nums.unshift(nums.pop());
  }
  return nums;
};

console.log(cyclicRotation([3, 8, 9, 7, 6], 3)); // [9, 7, 6, 3, 8]
console.log(cyclicRotation([0, 0, 0], 3)); // [0, 0, 0]
console.log(cyclicRotation([1, 2, 3, 4], 4)); // [1, 2, 3, 4]
