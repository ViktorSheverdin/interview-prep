/**
 *
 * @param {number[]} nums
 */
const oddOccurrencesInArray = (nums) => {
  const hashMap = {};
  for (let i = 0; i < nums.length; i++) {
    hashMap[nums[i]] = (hashMap[nums[i]] || 0) + 1;
  }
  for (const key in hashMap) {
    if (hashMap[key] % 2 !== 0) return Number(key);
  }
};

console.log(oddOccurrencesInArray([9, 3, 9, 3, 9, 7])); // 7
