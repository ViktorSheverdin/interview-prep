/**
 * @param {string[]} items
 * @param {Object} options
 * @return {string}
 */
function listFormat(items, options) {
  if (!items || items.length === 0) return '';

  let processedItems = items.filter((item) => item);

  if (options?.unique) {
    processedItems = [...new Set(processedItems)];
  }

  if (options?.sorted) {
    processedItems.sort();
  }

  const finalItemCount = processedItems.length;

  if (options?.length > 0 && options.length < finalItemCount) {
    const itemsToShow = processedItems.slice(0, options.length);
    const remainingCount = finalItemCount - options.length;
    const othersText =
      remainingCount === 1
        ? `${remainingCount} other`
        : `${remainingCount} others`;

    return `${itemsToShow.join(', ')} and ${othersText}`;
  }

  if (finalItemCount === 0) {
    return '';
  }

  if (finalItemCount === 1) {
    return processedItems[0];
  }

  if (finalItemCount === 2) {
    return processedItems.join(' and ');
  }

  const lastItem = processedItems.pop();
  return `${processedItems.join(', ')} and ${lastItem}`;
}

console.log(listFormat([]));

console.log(listFormat(['Bob']));
console.log(listFormat(['Bob', 'Alice']));

console.log(listFormat(['Bob', 'Ben', 'Tim', 'Jane', 'John']));

console.log(
  listFormat(['Bob', 'Ben', 'Tim', 'Jane', 'John'], {
    length: 3,
  })
);

console.log(
  listFormat(['Bob', 'Ben', 'Tim', 'Jane', 'John'], {
    length: 4,
  })
);

console.log(
  listFormat(['Bob', 'Ben', 'Tim', 'Jane', 'John'], {
    length: 3,
    sorted: true,
  })
);

console.log(
  listFormat(['Bob', 'Ben', 'Tim', 'Jane', 'John', 'Bob'], {
    length: 3,
    unique: true,
  })
);

console.log(
  listFormat(['Bob', 'Ben', 'Tim', 'Jane', 'John'], {
    length: 3,
    unique: true,
  })
);

console.log(listFormat(['Bob', 'Ben', '', '', 'John']));
