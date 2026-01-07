import { multifitWithSolution } from './multifit';

describe('multifitWithSolution', () => {
  test('should handle edge cases', () => {
    // Empty array
    const emptyResult = multifitWithSolution([], 10);
    expect(emptyResult).toEqual({ numBins: 0, bins: [] });

    // Item larger than bin capacity
    const nullResult = multifitWithSolution([15], 10);
    expect(nullResult).toBeNull();

    // Single item
    const singleResult = multifitWithSolution([5], 10);
    expect(singleResult).not.toBeNull();
    expect(singleResult?.numBins).toBe(1);
    expect(singleResult?.bins).toEqual([[0]]);
  });

  test('should handle complex cases with many items', () => {
    const items = [6, 6, 5, 5, 5, 5, 4, 4, 4, 4];
    const result = multifitWithSolution(items, 10);
    expect(result).not.toBeNull();

    // Verify all items are packed
    const allPackedItems = result?.bins.flat() || [];
    expect(allPackedItems.length).toBe(items.length);

    // Verify each bin respects capacity
    result?.bins.forEach((bin) => {
      const total = bin.reduce((sum, idx) => sum + items[idx], 0);
      expect(total).toBeLessThanOrEqual(10);
    });

    // Verify we use at least the theoretical minimum bins
    const totalSize = items.reduce((sum, size) => sum + size, 0);
    const theoreticalMinimum = Math.ceil(totalSize / 10);
    expect(result?.numBins).toBeGreaterThanOrEqual(theoreticalMinimum);
  });
});
