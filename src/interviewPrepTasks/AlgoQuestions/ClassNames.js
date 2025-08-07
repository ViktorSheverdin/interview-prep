/**
 * @param {...(any|Object|Array<any|Object|Array>)} args
 * @return {string}
 */
function classNames(...args) {
  const classnames = [];

  args.forEach((arg) => {
    if (!arg) return;

    if (typeof arg === 'string') {
      classnames.push(arg);
      return;
    }

    if (Array.isArray(arg)) {
      classnames.push(classNames(...arg));
      return;
    }

    if (typeof arg === 'object') {
      for (const key in arg) {
        if (Object.hasOwn(arg, key) && arg[key]) {
          classnames.push(key);
        }
      }
      return;
    }
  });

  return classnames.join(' ');
}

console.log(classNames('foo', 'bar')); // 'foo bar'
console.log(classNames(['foo', 'bar'])); // 'foo bar'
console.log(classNames('foo', { bar: true })); // 'foo bar'
console.log(classNames({ 'foo-bar': true })); // 'foo-bar'
console.log(classNames({ 'foo-bar': false })); // ''
console.log(classNames({ foo: true }, { bar: true })); // 'foo bar'
console.log(classNames({ foo: true, bar: true })); // 'foo bar'
console.log(classNames({ foo: true, bar: false, qux: true })); // 'foo qux'
