/**
 * @param {Object} obj
 * @return {Object}
 */
const squashObject = (obj, prefix = '') => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  let layerKey = {};
  if (typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      let newKey = '';
      if (prefix.length) {
        if (key) {
          newKey = `${prefix}.${key}`;
        } else {
          newKey = prefix;
        }
      } else {
        newKey = key;
      }

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        layerKey = {
          ...layerKey,
          ...squashObject(obj[key], newKey),
        };
      } else {
        layerKey = { ...layerKey, [newKey]: obj[key] };
      }
    });
  }
  return layerKey;
};

console.log(
  squashObject({
    a: 5,
    b: 6,
    c: {
      f: 9,
      g: {
        m: 17,
        n: 3,
      },
    },
  })
); // { a: 5, b: 6, 'c.f': 9, 'c.g.m': 17, 'c.g.n': 3 }

console.log(squashObject({ a: { b: null, c: undefined } })); // { 'a.b': null, 'a.c': undefined }
console.log(squashObject({ a: { b: [1, 2, 3], c: ['foo'], d: 5 } })); // { 'a.b.0': 1, 'a.b.1': 2, 'a.b.2': 3, 'a.c.0': 'foo', 'd': 5 }
console.log(
  squashObject({
    foo: {
      '': { '': 1, 'bar': 2 },
    },
  })
); // { foo: 1, 'foo.bar': 2 }
