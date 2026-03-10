function countSafeReports(input) {
  const reports = input.trim().split('\n').map(line =>
    line.trim().split(/\s+/).map(Number)
  );

  let safeCount = 0;

  for (const levels of reports) {
    if (isSafe(levels)) safeCount++;
  }

  return safeCount;
}

function isSafe(levels) {
  if (levels.length < 2) return true;

  const increasing = levels[1] > levels[0];

  for (let i = 1; i < levels.length; i++) {
    const diff = levels[i] - levels[i - 1];

    if (increasing && (diff < 1 || diff > 3)) return false;
    if (!increasing && (diff > -1 || diff < -3)) return false;
  }

  return true;
}

// Test cases
const exampleInput = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

console.log("Example result:", countSafeReports(exampleInput)); // Expected: 2

console.log("Single level:", countSafeReports("5")); // Expected: 1
console.log("Two levels safe increasing:", countSafeReports("1 3")); // Expected: 1
console.log("Two levels safe decreasing:", countSafeReports("5 3")); // Expected: 1
console.log("Two levels unsafe (diff 4):", countSafeReports("1 5")); // Expected: 0
console.log("Two levels unsafe (equal):", countSafeReports("3 3")); // Expected: 0
console.log("All same:", countSafeReports("2 2 2 2")); // Expected: 0
console.log("Increasing by 1:", countSafeReports("1 2 3 4 5")); // Expected: 1
console.log("Decreasing by 3:", countSafeReports("10 7 4 1")); // Expected: 1
console.log("Mixed direction:", countSafeReports("1 3 2")); // Expected: 0
