class Solution {
  /**
   * @param {number[]} nums
   * @param {number} target
   * @return {number[]}
   */
  twoSum(nums, target) {
    const hash = new Map();
    for (let i = 0; i < nums.length; i++) {
      const difference = target - nums[i];
      if (hash.has(difference)) {
        return [hash.get(difference), i];
      }
      hash.set(nums[i], i);
    }
    return [];
  }
}

const solution = new Solution();
console.log(solution.twoSum([2, 7, 11, 15], 9));
