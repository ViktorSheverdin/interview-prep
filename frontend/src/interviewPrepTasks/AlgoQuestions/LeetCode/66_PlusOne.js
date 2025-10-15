// You are given a large integer represented as an integer array digits,
// where each digits[i] is the ith digit of the integer.
// The digits are ordered from most significant to least significant in left-to-right order.
// The large integer does not contain any leading 0's.

// Increment the large integer by one and return the resulting array of digits.

/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function (digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }
  // All digits were 9, so we need an extra digit at the front.
  // Instead of using unshift (which is O(n)), we push a dummy 0 to extend the array
  // and then set the first element to 1. This keeps the operation O(1).
  digits.push(0);
  digits[0] = 1;
  return digits;
};

// console.log(plusOne([1, 2, 3])); // [1,2,4]
// console.log(plusOne([4, 3, 2, 1])); // [4,3,2,1]
console.log(plusOne([9])); // [1,0]
// console.log(plusOne([6, 1, 4, 5, 3, 9, 0, 1, 9, 5, 1, 8, 6, 7, 0, 5, 5, 4, 3])); // [1,0]
// console.log(plusOne([1, 2, 9, 9])); // [1, 3, 0, 0]
