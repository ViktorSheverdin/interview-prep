// You are given an array prices where prices[i]
// is the price of a given stock on the ith day.

// You want to maximize your profit by choosing a single day
// to buy one stock and choosing a different day
// in the future to sell that stock.

// Return the maximum profit you can achieve
// from this transaction. If you cannot achieve any profit, return 0.

/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  if (prices.length <= 1) return 0;
  let left = 0;
  let right = 1;
  let maxP = 0;
  while (right < prices.length) {
    if (prices[right] < prices[left]) {
      left = right;
    } else {
      maxP = Math.max(maxP, prices[right] - prices[left]);
    }
    right++;
  }
  return maxP;
};

console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5
console.log(maxProfit([7, 6, 4, 3, 1])); // 0
