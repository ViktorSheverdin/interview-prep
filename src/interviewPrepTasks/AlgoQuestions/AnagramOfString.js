// Write a function or method that takes 2 strings as inputs and returns a
// boolean specifying whether the strings are anagrams of each other.

// Strings are anagrams if they contain the same characters, regardless of order.

// Examples:
// “aabc”, “baca” -> true
// “aabc”, “bbca” -> false

const isAnagram = (first, second) => {
  const sortedFirst = first.split('').sort(); // sorted
  const sortedSecond = second.split('').sort(); // sorted
  let result = true;
  sortedFirst.map((char, idx) => {
    if (char != sortedSecond[idx]) {
      result = false;
    }
  });
  return result;
};

// console.log(isAnagram('aabc', 'baca')); // true // aabc //
// console.log(isAnagram('aaabc', 'baca')); // false
// console.log(isAnagram('123a', '231a')); // true
// console.log(isAnagram('123a', '231a')); // true
// console.log(isAnagram('aaac', 'baca')); // true //aaac //aabc

// Write a function or method that takes 2 strings as
// inputs and returns a boolean specifying whether a
// substring of the first string is an anagram of the second.

// Examples:
// “aaaaaabacbaaa”, “baca” -> true
// “aaaabaaaaacaa”, “baca” -> false

const isAnagramOfSubstring = (first, second) => {
  // should have checked for the size
  // same with isAnagram...

  if (first.length < second.length) {
    return false;
  }

  // first.length - second.length allows for a slide
  // tbh I did have issues because I had < instead of <=
  // could not find for like 3 min
  for (let i = 0; i <= first.length - second.length; i++) {
    const substring = first.slice(i, i + second.length);
    const resultIsAnagram = isAnagram(substring, second);
    if (resultIsAnagram) {
      return true;
    }
  }
  return false;
};

console.log(isAnagramOfSubstring('aaaaaabacbaaa', 'baca')); // true
console.log(isAnagramOfSubstring('aaaaaabacbaaa', 'aaaaaabacbaaa')); // true
console.log(isAnagramOfSubstring('aaaabaaaaacaa', 'baca')); // false
console.log(isAnagramOfSubstring('baca', 'aaaabaaaaacaa')); // false
// eestabrooks@seucrityscorecard.io
