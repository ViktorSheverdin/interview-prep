export default function flatten(value) {
  const returnArray = [];

  for (const item of value) {
    if (!Array.isArray(item)) {
      returnArray.push(item);
    } else {
      returnArray.push(...flatten(item));
    }
  }

  return returnArray;
}
