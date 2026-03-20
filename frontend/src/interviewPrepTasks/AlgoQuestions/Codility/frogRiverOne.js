// A small frog wants to get to the other side of a river.
// The frog is initially located on one bank of the river (position 0) and
//wants to get to the opposite bank (position X+1).
//Leaves fall from a tree onto the surface of the river.
//
// You are given an array A consisting of N integers representing the falling leaves. A[K] represents the position where one leaf falls at time K, measured in seconds.
const frogRiverOne = (x, arr) => {
  const hashSet = new Set();
  for (let i = 0; i < arr.length; i++) {
    hashSet.add(arr[i]);
    if (hashSet.size === x) return i;
  }
  return -1;
};
console.log(frogRiverOne(5, [1, 3, 1, 4, 2, 3, 5, 4])); // 6
