// Given an integer array nums and an integer k
// return the k most frequent elements within the array.
// The test cases are generated such that the answer is always unique.
// You may return the output in any order.

// Constraints:
// 1 <= nums.length <= 10^4.
// -1000 <= nums[i] <= 1000
// 1 <= k <= number of distinct elements in nums.

// Recommended Time & Space Complexity
// You should aim for a solution with O(n) time and
// O(n) space, where n is the size of the input array.

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
const topKFrequent = (nums, k) => {
  const count = {};
  const buckets = new Array(nums.length + 1);
  for (let i = 0; i < buckets.length; i++) {
    buckets[i] = [];
  }

  for (const element of nums) {
    count[element] = (count[element] || 0) + 1;
  }
  Object.keys(count).forEach((key) => {
    buckets[count[key]].push(+key); // convert the the number
  });
  const res = [];
  for (let i = buckets.length - 1; i > 0; i--) {
    for (const item of buckets[i]) {
      res.push(item);
    }
    if (res.length === k) {
      return res;
    }
  }

  //   return buckets;
};

console.log(topKFrequent([1, 2, 2, 3, 3, 3], 2)); // [2,3]
console.log(topKFrequent([7, 7], 1)); // [7]
