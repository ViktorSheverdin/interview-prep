// Design an algorithm to encode a list of strings to a single string.
// The encoded string is then decoded back to the original list of strings.
// Please implement encode and decode

/**
 * @param {strings[]} strs
 * @returns {string}
 */
const encode = (strs) => {
  let encodedS = '';
  for (const item of strs) {
    encodedS += `${item.length}#${item}`;
  }
  return encodedS;
};

/**
 * @param {string} str
 * @returns {string[]}
 */
const decode = (str) => {
  const decodedS = [];
  let i = 0;
  while (i < str.length) {
    let j = i;
    while (j < str.length && str[j] !== '#') {
      j++;
    }
    const wordLength = Number(str.substring(i, j));
    const word = str.substring(j + 1, j + 1 + wordLength);
    decodedS.push(word);
    i = j + 1 + wordLength;
  }
  return decodedS;
};

const s1 = encode(['neet', 'code', 'love', 'you']);
console.log(s1);
console.log(decode(s1));
