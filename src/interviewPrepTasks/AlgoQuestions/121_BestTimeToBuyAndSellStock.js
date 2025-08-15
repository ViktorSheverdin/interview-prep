/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  if (prices.length <= 1) return 0;

  let max = 0;
  let left = 0;
  let right = 1;

  while (right < prices.length) {
    if (prices[left] < prices[right]) {
      const profit = prices[right] - prices[left];

      if (profit > max) {
        max = profit;
      }
    } else {
      left = right;
    }
    right++;
  }
  return max;
};

console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5
console.log(maxProfit([7, 6, 4, 3, 1])); // 0
