function firstFitDecreasing(
  items: number[],
  numBins: number,
  binCapacity: number
): boolean {
  const bins: number[] = new Array(numBins).fill(binCapacity);

  for (const itemSize of items) {
    let placed = false;

    for (let i = 0; i < numBins; i++) {
      if (bins[i] >= itemSize) {
        bins[i] -= itemSize;
        placed = true;
        break;
      }
    }

    if (!placed) {
      return false;
    }
  }

  return true;
}

export function multifit(items: number[], binCapacity: number): number {
  if (items.length === 0) {
    return 0;
  }

  const maxItem = Math.max(...items);
  if (maxItem > binCapacity) {
    return -1; // Cannot fit
  }

  const sortedItems = [...items].sort((a, b) => b - a);
  const totalSize = sortedItems.reduce((sum, size) => sum + size, 0);
  let low = Math.ceil(totalSize / binCapacity);
  let high = items.length;
  let result = high;

  // Binary search for minimum number of bins
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (firstFitDecreasing(sortedItems, mid, binCapacity)) {
      // Can fit in mid bins, try fewer
      result = mid;
      high = mid - 1;
    } else {
      // Cannot fit in mid bins, need more
      low = mid + 1;
    }
  }

  return result;
}

export function multifitWithSolution(
  items: number[],
  binCapacity: number
): { numBins: number; bins: number[][] } | null {
  if (items.length === 0) {
    return { numBins: 0, bins: [] };
  }

  const maxItem = Math.max(...items);
  if (maxItem > binCapacity) {
    return null; // Cannot fit
  }

  const itemsWithIndex = items.map((size, idx) => ({ size, idx }));
  itemsWithIndex.sort((a, b) => b.size - a.size);

  const numBins = multifit(items, binCapacity);

  if (numBins === -1) {
    return null;
  }

  // Pack items to get the actual solution
  const bins: number[][] = Array.from({ length: numBins }, () => []);
  const binRemainingCapacity = new Array(numBins).fill(binCapacity);

  for (const item of itemsWithIndex) {
    // Find first bin that fits
    for (let i = 0; i < numBins; i++) {
      if (binRemainingCapacity[i] >= item.size) {
        bins[i].push(item.idx);
        binRemainingCapacity[i] -= item.size;
        break;
      }
    }
  }

  return { numBins, bins };
}

// Example usage
// Example 1: Simple case
// const items1 = [4, 8, 1, 4, 2, 1];
// const capacity1 = 10;

// console.log(`Items: [${items1}]`);
// console.log(`Bin capacity: ${capacity1}`);
// console.log(`Minimum bins needed: ${multifit(items1, capacity1)}`);
// console.log();

// // Example 2: With solution
// const items2 = [7, 5, 6, 4, 2, 3, 8];
// const capacity2 = 10;

// console.log(`Items: [${items2}]`);
// console.log(`Bin capacity: ${capacity2}`);

// const solution = multifitWithSolution(items2, capacity2);
// if (solution) {
//   console.log(`Minimum bins needed: ${solution.numBins}`);
//   console.log(`Packing solution:`);
//   solution.bins.forEach((bin, idx) => {
//     const itemSizes = bin.map((i) => items2[i]);
//     const total = itemSizes.reduce((sum, size) => sum + size, 0);
//     console.log(
//       `  Bin ${
//         idx + 1
//       }: items [${bin}] with sizes [${itemSizes}] (total: ${total})`
//     );
//   });
// }
