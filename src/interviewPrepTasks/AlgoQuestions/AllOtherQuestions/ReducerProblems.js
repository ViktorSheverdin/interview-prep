// JavaScript Reducer Practice Tasks
// ================================

// Reducer functions take an accumulator and current value, then return a new accumulator.
// Basic syntax: array.reduce((accumulator, currentValue) => { ... }, initialValue);

// ================================
// Task 1: Sum of Numbers (Easy)
// ================================
// Write a reducer function to sum all the numbers in an array.

const numbers1 = [5, 10, 15, 20, 25];
// Expected output: 75

// Your solution here:
/**
 * @param {number[]} nums
 */
function reduceTask1(nums) {
  return nums.reduce((acc, val) => {
    return acc + val;
  });
}

/**
 * @param {number[]} nums
 */
const reduceTask1ES6 = (nums) => {
  return nums.reduce((acc, val) => acc + val);
};

console.log('Task1: shouls be 75');
console.log(reduceTask1(numbers1));
console.log(reduceTask1ES6(numbers1));

// ================================
// Task 2: Find Maximum Value (Easy)
// ================================
// Use a reducer to find the largest number in an array.

const numbers2 = [8, 23, 15, 42, 4];
// Expected output: 42

// Your solution here:

/**
 * @param {number[]} nums
 */
const reduceTask2 = (nums) => {
  return nums.reduce((acc, val) => {
    let max = acc;
    if (acc < val) {
      max = val;
    }
    return max;
  });
};

/**
 * @param {number[]} nums
 */
const reduceTask2Short = (nums) => {
  return nums.reduce(
    (max, current) => (current > max ? current : max),
    nums[0]
  );
};

console.log('Task2: shouls be 42');
console.log(reduceTask2(numbers2));
console.log(reduceTask2Short(numbers2));

// ================================
// Task 3: Count Occurrences (Easy-Medium)
// ================================
// Count how many times each element appears in an array and return an object with the counts.

const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
// Expected output: { apple: 3, banana: 2, orange: 1 }

// Your solution here:
/**
 * @param {strings[]} arr
 */
const reduceTask3 = (arr) => {
  return arr.reduce((counts, current) => {
    counts[current] = (counts[current] || 0) + 1;
    return counts;
  }, {});
};

console.log('Task3: shouls be { apple: 3, banana: 2, orange: 1 }');
console.log(reduceTask3(fruits));

// ================================
// Task 4: Group Objects by Property (Medium)
// ================================
// Group an array of objects by a specified property value.

const people = [
  { name: 'Alice', department: 'Engineering' },
  { name: 'Bob', department: 'Sales' },
  { name: 'Charlie', department: 'Engineering' },
  { name: 'Alice', department: 'HR' },
];
// Expected output when grouping by department:
// {
//   Engineering: [
//     { name: 'Alice', department: 'Engineering' },
//     { name: 'Charlie', department: 'Engineering' }
//   ],
//   Sales: [{ name: 'Bob', department: 'Sales' }],
//   HR: [{ name: 'Diana', department: 'HR' }]
// }

// Your solution here:
/**
 *
 * @param {Array} people
 * @param {string} property
 */
const reduceTask4 = (people, property) => {
  return people.reduce((groups, item) => {
    const key = item[property];
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
};

console.log('Task4');
console.log(reduceTask4(people, 'department'));
console.log(reduceTask4(people, 'name'));

// ================================
// Task 5: Shopping Cart Reducer (Medium)
// ================================
// Implement a shopping cart reducer that handles multiple actions:
// adding items, removing items, and updating quantities.

// Initial state should be an empty array: []
// Actions will include:
// { type: 'ADD_ITEM', payload: { id: 1, name: 'Laptop', price: 999, quantity: 1 } }
// { type: 'REMOVE_ITEM', payload: { id: 1 } }
// { type: 'UPDATE_QUANTITY', payload: { id: 1, quantity: 2 } }

// Your solution here:

// JavaScript Reducer Practice Tasks - Part 2
// =========================================

// ================================
// Task 6: Flatten a Nested Array (Easy)
// ================================
// Write a reducer function to flatten an array of arrays into a single array.

const nestedArray = [[1, 2], [3, 4, 5], [6]];
// Expected output: [1, 2, 3, 4, 5, 6]
// Example process:
// Initial accumulator: []
// Iteration 1: [] concat [1, 2] → [1, 2]
// Iteration 2: [1, 2] concat [3, 4, 5] → [1, 2, 3, 4, 5]
// Iteration 3: [1, 2, 3, 4, 5] concat [6] → [1, 2, 3, 4, 5, 6]
// Final result: [1, 2, 3, 4, 5, 6]

// Your solution here:

/**
 *
 * @param {number[]} arr
 */
const reduceTask6Recursive = (arr) => {
  return arr.reduce((flat, current) => {
    if (Array.isArray(current)) {
      return [...flat, ...reduceTask6Recursive(current)];
    } else {
      return [...flat, current];
    }
  }, []);
};

/**
 *
 * @param {numbers[]} arr
 */
const reduceTask6 = (arr) => {
  return arr.reduce((flatten, current) => {
    return [...flatten, ...current];
  }, []);
};

console.log('Task 6');
console.log('Should be [1, 2, 3, 4, 5, 6]');
console.log(reduceTask6(nestedArray));
console.log(reduceTask6Recursive(nestedArray));

// ================================
// Task 7: Calculate Average (Easy)
// ================================
// Use a reducer to calculate the average value of numbers in an array.

const scores = [85, 90, 65, 78, 92];
// Expected output: 82
// Example process:
// We need to keep track of both the sum and count, then divide at the end
// You could use an object accumulator like { sum: 0, count: 0 } or perform the division after reduce

// Your solution here:

/**
 * @param {number[]} arr
 */
const reduceTask7 = (arr) => {
  return arr.reduce((sum, current) => {
    return sum + current / arr.length;
  }, 0);
};

/**
 * @param {number[]} arr
 */
const reduceTask7WithObject = (arr) => {
  // Using an object accumulator that tracks both sum and count
  const result = arr.reduce(
    (acc, current) => {
      // Add current value to sum
      acc.sum += current;
      // Increment the count
      acc.count += 1;
      return acc;
    },
    { sum: 0, count: 0 }
  ); // Initialize with sum: 0 and count: 0

  // Calculate the average after reduction is complete
  return result.sum / result.count;
};

console.log('Task 7');
console.log('Should be 82');
console.log(reduceTask7(scores));
console.log(reduceTask7WithObject(scores));

// ================================
// Task 8: Filter and Transform (Easy-Medium)
// ================================
// Use a reducer to both filter out odd numbers and double the even numbers in one operation.

const mixedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// Expected output: [4, 8, 12, 16, 20]
// Example process:
// Initial accumulator: []
// For each number, check if it's even (n % 2 === 0)
// If even, double it and add to accumulator, otherwise skip it

// Your solution here:

/**
 * @param {number[]} arr
 */
const reduceTask8 = (arr) => {
  return arr.reduce((acc, current) => {
    if (current % 2 === 0) {
      acc.push(current * 2);
    }
    return acc;
  }, []);
};

console.log('Task 8');
console.log('Should be [4, 8, 12, 16, 20]');
console.log(reduceTask8(mixedNumbers));

// ================================
// Task 9: Create Object from Arrays (Medium)
// ================================
// Given two arrays (one with keys, one with values), use reduce to create an object.
// If there are more keys than values, set the remaining keys to null.
// If there are more values than keys, ignore the extra values.

const keys = ['name', 'age', 'job', 'hobby'];
const values = ['Alex', '28', 'Developer'];
// Expected output: { name: 'Alex', age: 28, job: 'Developer', hobby: null }
// Example process:
// Initial accumulator: {}
// Iteration 1: Set obj['name'] = 'Alex'
// Iteration 2: Set obj['age'] = 28
// Iteration 3: Set obj['job'] = 'Developer'
// Iteration 4: Set obj['hobby'] = null (no matching value)
// Final result: { name: 'Alex', age: 28, job: 'Developer', hobby: null }

// Your solution here:

/**
 *
 * @param {string[]} keys
 * @param {string[]} values
 */
const reduceTask9 = (keys, values) => {
  return keys.reduce((obj, key, index) => {
    obj[key] = index < values.length ? values[index] : null;
    return obj;
  }, {});
};

console.log('Task 9');
console.log(
  "Should be { name: 'Alex', age: 28, job: 'Developer', hobby: null }"
);
console.log(reduceTask9(keys, values));
