/**
 * @param {number} num
 */
const binaryGap = (num) => {
  const strDec = num.toString(2);
  let maxGap = 0;
  let currentGap = 0;
  if (strDec.length < 2) return 0;

  for (let i = 1; i < strDec.length; i++) {
    if (Number(strDec[i]) === 0) {
      currentGap += 1;
    } else {
      maxGap = Math.max(maxGap, currentGap);
      currentGap = 0;
    }
  }
  return maxGap;
};

console.log(binaryGap(9)); // 1001 -> 2
console.log(binaryGap(42)); // 10101 -> 1
console.log(binaryGap(529)); // 1000010001 -> 4
console.log(binaryGap(20)); // 10100 -> 1
console.log(binaryGap(15)); // 1111 -> 0
