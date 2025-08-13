/**
 * @template T
 * @param {T} value
 * @return {T}
 */
function deepClone(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((item) => deepClone(item));

  const clone = {};
  for (const key in value) {
    clone[key] = deepClone(value[key]);
  }

  return clone;
}

const obj1 = { user: { role: 'admin' } };
const clonedObj1 = deepClone(obj1);

clonedObj1.user.role = 'guest'; // Change the cloned user's role to 'guest'.
console.log(clonedObj1.user.role); // 'guest'
console.log(obj1.user.role); // Should still be 'admin'.

const obj2 = { foo: [{ bar: 'baz' }] };
const clonedObj2 = deepClone(obj2);

obj2.foo[0].bar = 'bax'; // Modify the original object.
console.log(obj2.foo[0].bar); // 'bax'
console.log(clonedObj2.foo[0].bar); // Should still be 'baz'.
