// Sum of Array Elements
// Task: Write a function that calculates the sum of all elements in an array.
const numbers = [1, 2, 3, 4, 5];
const sumArray = (nums) => {
  return nums.reduce((total, num) => (total += num));
};
console.log(sumArray(numbers)); // Output: 15

// Find Maximum Value in an Array
// Task: Create a function that returns the maximum value from an array of numbers.
const numbers2 = [10, 5, 8, 20, 3];
const findMax = (nums) => {
  return nums.reduce(
    (max, current) => (max < current ? (max = current) : max),
    0
  );
};
console.log(findMax(numbers2)); // Output: 20

// Filter Even Numbers
// Task: Implement a function that filters out even numbers from an array.

const numbers3 = [1, 2, 3, 4, 5, 6];
const filterEven = (nums) => {
  return nums.reduce((even, current) => {
    if (current % 2 === 0) {
      even.push(current);
    }
    return even;
  }, []);
};
console.log(filterEven(numbers3)); // Output: [2, 4, 6]

// Merge Two Arrays
// Task: Write a function that merges two arrays into one.
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
const mergeArrays = (arr1, arr2) => {
  return [...arr1, ...arr2];
};
console.log(mergeArrays(array1, array2)); // Output: [1, 2, 3, 4, 5, 6]

// Flatten a Nested Array
// Task: Implement a function that flattens a nested array into a single-level array.
const nestedArray = [
  [1, 2],
  [3, 4],
  [5, 6],
];
const flattenArray = (arr) => {
  let flatten = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      flatten = [...flatten, ...flattenArray(item)];
    } else {
      flatten = [...flatten, item];
    }
  }
  return flatten;
};
console.log(flattenArray(nestedArray)); // Output: [1, 2, 3, 4, 5, 6]
