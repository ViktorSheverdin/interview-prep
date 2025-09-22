// Filter Objects Based on Property
// Task: Implement a function that filters an array of product objects to return only those within a specified price range.

const products = [
  { name: 'Laptop', price: 1200 },
  { name: 'Phone', price: 800 },
  { name: 'Tablet', price: 600 },
];

const filterByPriceRange = (items, low, high) => {
  return items.filter((item) => item.price > low && item.price < high);
};
const filteredProducts = filterByPriceRange(products, 700, 1300);

console.log(filteredProducts);
// Output: [{ name: 'Laptop', price: 1200 }, { name: 'Phone', price: 800 }]

// Group Objects by Property
// Task: Create a function that groups an array of employees by their department.

const employees = [
  { name: 'John', department: 'HR' },
  { name: 'Jane', department: 'IT' },
  { name: 'Jim', department: 'HR' },
];

const groupByDepartment = (arr) => {
  return arr.reduce((groups, employee) => {
    const key = employee.department;
    groups[key] = groups[key] || [];
    groups[key].push(employee);
    return groups;
  }, {});
};
const groupedEmployees = groupByDepartment(employees);
console.log(groupedEmployees);
// Output: { HR: [{ name: 'John', department: 'HR' }, { name: 'Jim', department: 'HR' }], IT: [{ name: 'Jane', department: 'IT' }] }

// Merge Two Objects
// Task: Implement a function that merges two objects, giving precedence to the second object's properties in case of conflicts.
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const mergeObjects = (obj1, obj2) => {
  return { ...obj1, ...obj2 };
};
const mergedObj = mergeObjects(obj1, obj2);
console.log(mergedObj);
// Output: { a: 1, b: 3, c: 4 }

// Find Object with Maximum Property Value
// Task: Write a function that finds the product with the highest price in an array of product objects.
const products2 = [
  { name: 'Laptop', price: 1200 },
  { name: 'Phone', price: 800 },
  { name: 'Tablet', price: 600 },
];
const findMaxPriceProduct = (products) => {
  return products.reduce((maxPrice, current) => {
    return maxPrice.price < current.price ? current : maxPrice;
  });
};
const mostExpensiveProduct = findMaxPriceProduct(products2);
console.log(mostExpensiveProduct);
// Output: { name: 'Laptop', price: 1200 }

// Transform Array of Objects
// Task: Create a function that transforms an array of user objects into an array of strings with each user's full name.
const users = [
  { firstName: 'John', lastName: 'Doe' },
  { firstName: 'Jane', lastName: 'Smith' },
];
const getFullNames = (users) => {
  return users.reduce((fullNames, current) => {
    fullNames.push(`${current.firstName} ${current.lastName}`);
    return fullNames;
  }, []);
};
const fullNames = getFullNames(users);
console.log(fullNames);
// Output: ['John Doe', 'Jane Smith']

// Flatten an Array of Objects with Nested Arrays
// Task: Create a function that flattens an array of objects, each containing a tags array, into a single array of tags
const items = [
  { id: 1, tags: ['a', 'b'] },
  { id: 2, tags: ['b', 'c'] },
  { id: 3, tags: ['c', 'd'] },
];
const flattenTags = (items) => {
  return items.reduce((tags, current) => {
    tags.push([...current.tags]);
    return tags.flatMap((item) => item);
  }, []);
};
const allTags = flattenTags(items);
console.log(allTags);
// Output: ['a', 'b', 'b', 'c', 'c', 'd']
