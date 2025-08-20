const returnGreaterThanFive = (arr, callbackFn) => {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (callbackFn(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
};

const arrToTest = [1, 5, 6, 7, 2, 10];
console.log(returnGreaterThanFive(arrToTest, (num) => num > 5));
