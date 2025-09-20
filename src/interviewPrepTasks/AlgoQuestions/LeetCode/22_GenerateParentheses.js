// Given n pairs of parentheses, write a function
// to generate all combinations of well-formed parentheses.

// Constraints:
// 1 <= n <= 8
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
  // only add "(" when openParenthesisNumber < n
  // only add ")" when closedParenthesisNumber < openParenthesisNumber
  // valid if openParenthesisNumber === closedParenthesisNumber === n
  const stack = [];
  const res = [];

  const backtrack = (openParenthesisNumber, closedParenthesisNumber) => {
    if (openParenthesisNumber === n && closedParenthesisNumber === n) {
      res.push(stack.join(''));
      return;
    }

    if (openParenthesisNumber < n) {
      stack.push('(');
      backtrack(openParenthesisNumber + 1, closedParenthesisNumber);
      stack.pop();
    }

    if (closedParenthesisNumber < openParenthesisNumber) {
      stack.push(')');
      backtrack(openParenthesisNumber, closedParenthesisNumber + 1);
      stack.pop();
    }
  };

  backtrack(0, 0);
  return res;
};

console.log(generateParenthesis(3)); // ["((()))","(()())","(())()","()(())","()()()"]
console.log(generateParenthesis(2)); // ["(())", "()()"]
console.log(generateParenthesis(1)); // ["()"]
