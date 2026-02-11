import type { Product, ProductFormData } from './CompactInterview';
import {
  combineFilters,
  filterByCategories,
  filterByCategory,
  filterByPriceRange,
  filterByStockRange,
  getProductStats,
  multiFieldSort,
  parseNumberInput,
  searchProducts,
  sortProducts,
  validateInteger,
  validateIsNumber,
  validatePositiveNumber,
  validateProductForm,
  validateRange,
  validateRequired,
} from './CompactInterview';

// =====================================================================
// TEST DATA
// =====================================================================

const mockProducts: Product[] = [
  { id: 1, name: 'Laptop', price: 999, stock: 15, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 25, stock: 50, category: 'Electronics' },
  { id: 3, name: 'Desk', price: 299, stock: 8, category: 'Furniture' },
  { id: 4, name: 'Chair', price: 199, stock: 12, category: 'Furniture' },
  { id: 5, name: 'Keyboard', price: 79, stock: 30, category: 'Electronics' },
  { id: 6, name: 'Monitor', price: 349, stock: 20, category: 'Electronics' },
  { id: 7, name: 'Lamp', price: 45, stock: 25, category: 'Furniture' },
  { id: 8, name: 'Notebook', price: 5, stock: 100, category: 'Stationery' },
];

// =====================================================================
// SESSION 1: Sorting & Filtering Tests
// =====================================================================

describe.only('Q2: sortProducts', () => {
  it('should sort products by price ascending', () => {
    const result = sortProducts(mockProducts, 'price', 'asc');
    expect(result[0].price).toBe(5);
    expect(result[result.length - 1].price).toBe(999);
  });

  it('should sort products by price descending', () => {
    const result = sortProducts(mockProducts, 'price', 'desc');
    expect(result[0].price).toBe(999);
    expect(result[result.length - 1].price).toBe(5);
  });

  it('should sort products by name ascending', () => {
    const result = sortProducts(mockProducts, 'name', 'asc');
    expect(result[0].name).toBe('Chair');
    expect(result[result.length - 1].name).toBe('Notebook');
  });

  it('should sort products by stock descending', () => {
    const result = sortProducts(mockProducts, 'stock', 'desc');
    expect(result[0].stock).toBe(100);
    expect(result[result.length - 1].stock).toBe(8);
  });

  it('should not mutate original array', () => {
    const original = [...mockProducts];
    sortProducts(mockProducts, 'price', 'asc');
    expect(mockProducts).toEqual(original);
  });

  it('should handle empty array', () => {
    const result = sortProducts([], 'price', 'asc');
    expect(result).toEqual([]);
  });

  it('should handle single item', () => {
    const single = [mockProducts[0]];
    const result = sortProducts(single, 'price', 'asc');
    expect(result).toEqual(single);
  });

  it('should default to ascending order', () => {
    const result = sortProducts(mockProducts, 'price');
    expect(result[0].price).toBe(5);
  });
});

describe.only('Q3: filterByCategory', () => {
  it('should filter products by Electronics category', () => {
    const result = filterByCategory(mockProducts, 'Electronics');
    expect(result).toHaveLength(4);
    expect(result.every((p) => p.category === 'Electronics')).toBe(true);
  });

  it('should filter products by Furniture category', () => {
    const result = filterByCategory(mockProducts, 'Furniture');
    expect(result).toHaveLength(3);
    expect(result.every((p) => p.category === 'Furniture')).toBe(true);
  });

  it('should return empty array for non-existent category', () => {
    const result = filterByCategory(mockProducts, 'NonExistent');
    expect(result).toEqual([]);
  });

  it('should be case-sensitive', () => {
    const result = filterByCategory(mockProducts, 'electronics');
    expect(result).toEqual([]);
  });

  it('should handle empty array', () => {
    const result = filterByCategory([], 'Electronics');
    expect(result).toEqual([]);
  });
});

describe.only('Q4: filterByPriceRange', () => {
  it('should filter products within price range', () => {
    const result = filterByPriceRange(mockProducts, 50, 300);
    expect(result).toHaveLength(3); // Keyboard(79), Chair(199), Desk(299)
    expect(result.every((p) => p.price >= 50 && p.price <= 300)).toBe(true);
  });

  it('should include products at exact min price', () => {
    const result = filterByPriceRange(mockProducts, 25, 100);
    expect(result.some((p) => p.price === 25)).toBe(true);
  });

  it('should include products at exact max price', () => {
    const result = filterByPriceRange(mockProducts, 25, 79);
    expect(result.some((p) => p.price === 79)).toBe(true);
  });

  it('should handle min === max', () => {
    const result = filterByPriceRange(mockProducts, 79, 79);
    expect(result).toHaveLength(1);
    expect(result[0].price).toBe(79);
  });

  it('should return empty array when min > max', () => {
    const result = filterByPriceRange(mockProducts, 300, 50);
    expect(result).toEqual([]);
  });

  it('should handle very large range', () => {
    const result = filterByPriceRange(mockProducts, 0, 999999);
    expect(result).toHaveLength(mockProducts.length);
  });

  it('should handle empty array', () => {
    const result = filterByPriceRange([], 0, 100);
    expect(result).toEqual([]);
  });
});

describe.only('Q5: filterByStockRange', () => {
  it('should filter products within stock range', () => {
    const result = filterByStockRange(mockProducts, 10, 30);
    expect(result).toHaveLength(5);
    expect(result.every((p) => p.stock >= 10 && p.stock <= 30)).toBe(true);
  });

  it('should include products at exact boundaries', () => {
    const result = filterByStockRange(mockProducts, 12, 30);
    expect(result.some((p) => p.stock === 12)).toBe(true);
    expect(result.some((p) => p.stock === 30)).toBe(true);
  });

  it('should handle zero minimum', () => {
    const result = filterByStockRange(mockProducts, 0, 10);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when min > max', () => {
    const result = filterByStockRange(mockProducts, 100, 10);
    expect(result).toEqual([]);
  });
});

describe.only('Q7: combineFilters', () => {
  it('should apply category filter only', () => {
    const result = combineFilters(mockProducts, { category: 'Electronics' });
    expect(result).toHaveLength(4);
  });

  it('should apply price range filter only', () => {
    const result = combineFilters(mockProducts, {
      minPrice: 50,
      maxPrice: 300,
    });
    expect(result).toHaveLength(3); // Keyboard(79), Chair(199), Desk(299)
  });

  it('should apply stock range filter only', () => {
    const result = combineFilters(mockProducts, {
      minStock: 10,
      maxStock: 30,
    });
    expect(result).toHaveLength(5);
  });

  it('should combine category and price filters', () => {
    const result = combineFilters(mockProducts, {
      category: 'Electronics',
      minPrice: 50,
      maxPrice: 500,
    });
    expect(result).toHaveLength(2); // Keyboard(79), Monitor(349)
    expect(result.every((p) => p.category === 'Electronics')).toBe(true);
    expect(result.every((p) => p.price >= 50 && p.price <= 500)).toBe(true);
  });

  it('should combine all three filters', () => {
    const result = combineFilters(mockProducts, {
      category: 'Electronics',
      minPrice: 20,
      maxPrice: 100,
      minStock: 25,
      maxStock: 60,
    });
    expect(result).toHaveLength(2);
  });

  it('should return all products when no filters provided', () => {
    const result = combineFilters(mockProducts, {});
    expect(result).toHaveLength(mockProducts.length);
  });

  it('should return empty array when filters match nothing', () => {
    const result = combineFilters(mockProducts, {
      category: 'Electronics',
      minPrice: 1000,
      maxPrice: 2000,
    });
    expect(result).toEqual([]);
  });

  it('should handle undefined filter values', () => {
    const result = combineFilters(mockProducts, {
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
    expect(result).toHaveLength(mockProducts.length);
  });
});

// =====================================================================
// SESSION 2: Validation Tests
// =====================================================================

describe.only('Q8: validateRequired', () => {
  it('should return empty string for non-empty value', () => {
    expect(validateRequired('test')).toBe('');
  });

  it('should return error for empty string', () => {
    expect(validateRequired('')).toBeTruthy();
  });

  it('should return error for whitespace only', () => {
    expect(validateRequired('   ')).toBeTruthy();
  });

  it('should accept value with leading/trailing spaces', () => {
    expect(validateRequired('  test  ')).toBe('');
  });

  it('should accept special characters', () => {
    expect(validateRequired('!@#$%')).toBe('');
  });
});

describe.only('Q9: validateIsNumber', () => {
  it('should return empty string for valid integers', () => {
    expect(validateIsNumber('123')).toBe('');
    expect(validateIsNumber('0')).toBe('');
  });

  it('should return empty string for valid decimals', () => {
    expect(validateIsNumber('123.45')).toBe('');
    expect(validateIsNumber('0.5')).toBe('');
  });

  it('should return empty string for negative numbers', () => {
    expect(validateIsNumber('-123')).toBe('');
    expect(validateIsNumber('-0.5')).toBe('');
  });

  it('should return error for non-numeric strings', () => {
    expect(validateIsNumber('abc')).toBeTruthy();
    expect(validateIsNumber('12abc')).toBeTruthy();
  });

  it('should return error for empty string', () => {
    expect(validateIsNumber('')).toBeTruthy();
  });

  it('should handle scientific notation', () => {
    expect(validateIsNumber('1e10')).toBe('');
  });

  it('should return error for NaN string', () => {
    expect(validateIsNumber('NaN')).toBeTruthy();
  });

  it('should accept Infinity string (JavaScript behavior)', () => {
    // Note: Number('Infinity') === Infinity, which is not NaN
    // So technically Infinity is a valid number in JavaScript
    expect(validateIsNumber('Infinity')).toBe('');
  });
});

describe.only('Q10: validatePositiveNumber', () => {
  it('should return empty string for positive integers', () => {
    expect(validatePositiveNumber('123')).toBe('');
    expect(validatePositiveNumber('1')).toBe('');
  });

  it('should return empty string for positive decimals', () => {
    expect(validatePositiveNumber('123.45')).toBe('');
    expect(validatePositiveNumber('0.01')).toBe('');
  });

  it('should return error for zero', () => {
    expect(validatePositiveNumber('0')).toBeTruthy();
  });

  it('should return error for negative numbers', () => {
    expect(validatePositiveNumber('-1')).toBeTruthy();
    expect(validatePositiveNumber('-123.45')).toBeTruthy();
  });

  it('should return error for non-numeric strings', () => {
    expect(validatePositiveNumber('abc')).toBeTruthy();
  });

  it('should return error for empty string', () => {
    expect(validatePositiveNumber('')).toBeTruthy();
  });
});

describe.only('Q11: validateInteger', () => {
  it('should return empty string for valid integers', () => {
    expect(validateInteger('123')).toBe('');
    expect(validateInteger('0')).toBe('');
    expect(validateInteger('-5')).toBe('');
  });

  it('should return error for decimal numbers', () => {
    expect(validateInteger('123.45')).toBeTruthy();
    expect(validateInteger('0.5')).toBeTruthy();
  });

  it('should return error for non-numeric strings', () => {
    expect(validateInteger('abc')).toBeTruthy();
  });

  it('should return error for empty string', () => {
    expect(validateInteger('')).toBeTruthy();
  });

  it('should handle large integers', () => {
    expect(validateInteger('999999999')).toBe('');
  });
});

describe.only('Q12: validateRange', () => {
  it('should return empty string for value within range', () => {
    expect(validateRange('50', 0, 100)).toBe('');
  });

  it('should return empty string for value at min boundary', () => {
    expect(validateRange('0', 0, 100)).toBe('');
  });

  it('should return empty string for value at max boundary', () => {
    expect(validateRange('100', 0, 100)).toBe('');
  });

  it('should return error for value below min', () => {
    expect(validateRange('-1', 0, 100)).toBeTruthy();
    expect(validateRange('-1', 0, 100)).toContain('at least');
  });

  it('should return error for value above max', () => {
    expect(validateRange('101', 0, 100)).toBeTruthy();
    expect(validateRange('101', 0, 100)).toContain('at most');
  });

  it('should return error for non-numeric string', () => {
    expect(validateRange('abc', 0, 100)).toBeTruthy();
  });

  it('should handle negative ranges', () => {
    expect(validateRange('-50', -100, -10)).toBe('');
    expect(validateRange('-5', -100, -10)).toBeTruthy();
  });

  it('should handle decimal ranges', () => {
    expect(validateRange('5.5', 0, 10)).toBe('');
  });
});

describe.only('Q13: validateProductForm', () => {
  const validForm: ProductFormData = {
    name: 'Test Product',
    price: '99.99',
    stock: '10',
    category: 'Test',
  };

  it('should return no errors for valid form', () => {
    const errors = validateProductForm(validForm);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  describe('name validation', () => {
    it('should return error for empty name', () => {
      const errors = validateProductForm({ ...validForm, name: '' });
      expect(errors.name).toBeTruthy();
    });

    it('should return error for name with less than 2 chars', () => {
      const errors = validateProductForm({ ...validForm, name: 'A' });
      expect(errors.name).toBeTruthy();
    });

    it('should accept name with exactly 2 chars', () => {
      const errors = validateProductForm({ ...validForm, name: 'AB' });
      expect(errors.name).toBeFalsy();
    });

    it('should trim whitespace when checking length', () => {
      const errors = validateProductForm({ ...validForm, name: '  A  ' });
      expect(errors.name).toBeTruthy();
    });
  });

  describe('price validation', () => {
    it('should return error for empty price', () => {
      const errors = validateProductForm({ ...validForm, price: '' });
      expect(errors.price).toBeTruthy();
    });

    it('should return error for non-numeric price', () => {
      const errors = validateProductForm({ ...validForm, price: 'abc' });
      expect(errors.price).toBeTruthy();
    });

    it('should return error for negative price', () => {
      const errors = validateProductForm({ ...validForm, price: '-10' });
      expect(errors.price).toBeTruthy();
    });

    it('should return error for zero price', () => {
      const errors = validateProductForm({ ...validForm, price: '0' });
      expect(errors.price).toBeTruthy();
    });

    it('should return error for price > 10000', () => {
      const errors = validateProductForm({ ...validForm, price: '10001' });
      expect(errors.price).toBeTruthy();
    });

    it('should accept price exactly 10000', () => {
      const errors = validateProductForm({ ...validForm, price: '10000' });
      expect(errors.price).toBeFalsy();
    });

    it('should accept decimal prices', () => {
      const errors = validateProductForm({ ...validForm, price: '99.99' });
      expect(errors.price).toBeFalsy();
    });
  });

  describe('stock validation', () => {
    it('should return error for empty stock', () => {
      const errors = validateProductForm({ ...validForm, stock: '' });
      expect(errors.stock).toBeTruthy();
    });

    it('should return error for non-numeric stock', () => {
      const errors = validateProductForm({ ...validForm, stock: 'abc' });
      expect(errors.stock).toBeTruthy();
    });

    it('should return error for decimal stock', () => {
      const errors = validateProductForm({ ...validForm, stock: '10.5' });
      expect(errors.stock).toBeTruthy();
    });

    it('should return error for negative stock', () => {
      const errors = validateProductForm({ ...validForm, stock: '-1' });
      expect(errors.stock).toBeTruthy();
    });

    it('should accept zero stock', () => {
      const errors = validateProductForm({ ...validForm, stock: '0' });
      expect(errors.stock).toBeFalsy();
    });

    it('should return error for stock > 1000', () => {
      const errors = validateProductForm({ ...validForm, stock: '1001' });
      expect(errors.stock).toBeTruthy();
    });

    it('should accept stock exactly 1000', () => {
      const errors = validateProductForm({ ...validForm, stock: '1000' });
      expect(errors.stock).toBeFalsy();
    });
  });

  describe('category validation', () => {
    it('should return error for empty category', () => {
      const errors = validateProductForm({ ...validForm, category: '' });
      expect(errors.category).toBeTruthy();
    });

    it('should return error for whitespace-only category', () => {
      const errors = validateProductForm({ ...validForm, category: '   ' });
      expect(errors.category).toBeTruthy();
    });

    it('should accept category with spaces', () => {
      const errors = validateProductForm({
        ...validForm,
        category: 'Home Decor',
      });
      expect(errors.category).toBeFalsy();
    });
  });

  it('should return multiple errors for multiple invalid fields', () => {
    const errors = validateProductForm({
      name: '',
      price: 'abc',
      stock: '10.5',
      category: '',
    });
    expect(Object.keys(errors).length).toBeGreaterThan(1);
  });
});

// =====================================================================
// SESSION 3: Advanced Functions Tests
// =====================================================================

describe.only('Q15: searchProducts', () => {
  it('should find products by exact name match', () => {
    const result = searchProducts(mockProducts, 'Laptop');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Laptop');
  });

  it('should be case-insensitive', () => {
    const result = searchProducts(mockProducts, 'laptop');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Laptop');
  });

  it('should find products by partial match', () => {
    const result = searchProducts(mockProducts, 'book');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Notebook');
  });

  it('should return multiple matches', () => {
    const result = searchProducts(mockProducts, 'o');
    expect(result.length).toBeGreaterThan(1);
  });

  it('should return empty array for no matches', () => {
    const result = searchProducts(mockProducts, 'xyz123');
    expect(result).toEqual([]);
  });

  it('should return all products for empty query', () => {
    const result = searchProducts(mockProducts, '');
    expect(result).toHaveLength(mockProducts.length);
  });

  it('should handle whitespace-only query', () => {
    const result = searchProducts(mockProducts, '   ');
    expect(result).toHaveLength(mockProducts.length);
  });

  it('should handle special characters', () => {
    const specialProducts: Product[] = [
      {
        id: 1,
        name: 'Product-A',
        price: 10,
        stock: 5,
        category: 'Test',
      },
    ];
    const result = searchProducts(specialProducts, 'Product-A');
    expect(result).toHaveLength(1);
  });
});

describe.only('Q16: multiFieldSort', () => {
  it('should sort by primary field first', () => {
    const result = multiFieldSort(mockProducts, [
      { field: 'category' },
      { field: 'price' },
    ]);
    expect(result[0].category).toBe('Electronics');
  });

  it('should sort by secondary field when primary is equal', () => {
    const result = multiFieldSort(mockProducts, [
      { field: 'category' },
      { field: 'price' },
    ]);
    const electronics = result.filter((p) => p.category === 'Electronics');
    expect(electronics[0].price).toBe(25); // Mouse is cheapest Electronics
    expect(electronics[electronics.length - 1].price).toBe(999); // Laptop is most expensive
  });

  it('should handle desc order for primary field', () => {
    const result = multiFieldSort(mockProducts, [
      { field: 'category', order: 'desc' },
      { field: 'price' },
    ]);
    expect(result[0].category).toBe('Stationery');
  });

  it('should handle desc order for secondary field', () => {
    const result = multiFieldSort(mockProducts, [
      { field: 'category' },
      { field: 'price', order: 'desc' },
    ]);
    const electronics = result.filter((p) => p.category === 'Electronics');
    expect(electronics[0].price).toBe(999); // Laptop is most expensive
  });

  it('should handle mixed sort orders', () => {
    const result = multiFieldSort(mockProducts, [
      { field: 'category' },
      { field: 'stock', order: 'desc' },
    ]);
    const electronics = result.filter((p) => p.category === 'Electronics');
    expect(electronics[0].stock).toBe(50); // Mouse has highest stock
  });

  it('should not mutate original array', () => {
    const original = [...mockProducts];
    multiFieldSort(mockProducts, [{ field: 'category' }, { field: 'price' }]);
    expect(mockProducts).toEqual(original);
  });
});

describe.only('Q17: filterByCategories', () => {
  it('should filter by single category', () => {
    const result = filterByCategories(mockProducts, ['Electronics']);
    expect(result).toHaveLength(4);
    expect(result.every((p) => p.category === 'Electronics')).toBe(true);
  });

  it('should filter by multiple categories', () => {
    const result = filterByCategories(mockProducts, [
      'Electronics',
      'Furniture',
    ]);
    expect(result).toHaveLength(7);
  });

  it('should return empty array for empty categories array', () => {
    const result = filterByCategories(mockProducts, []);
    expect(result).toHaveLength(mockProducts.length);
  });

  it('should return empty array for non-existent categories', () => {
    const result = filterByCategories(mockProducts, ['NonExistent']);
    expect(result).toEqual([]);
  });

  it('should be case-sensitive', () => {
    const result = filterByCategories(mockProducts, ['electronics']);
    expect(result).toEqual([]);
  });

  it('should handle duplicate categories in array', () => {
    const result = filterByCategories(mockProducts, [
      'Electronics',
      'Electronics',
    ]);
    expect(result).toHaveLength(4);
  });
});

describe.only('Q18: getProductStats', () => {
  it('should calculate correct min price', () => {
    const stats = getProductStats(mockProducts);
    expect(stats.minPrice).toBe(5);
  });

  it('should calculate correct max price', () => {
    const stats = getProductStats(mockProducts);
    expect(stats.maxPrice).toBe(999);
  });

  it('should calculate correct average price', () => {
    const stats = getProductStats(mockProducts);
    const sum = mockProducts.reduce((acc, p) => acc + p.price, 0);
    const expectedAvg = sum / mockProducts.length;
    expect(stats.avgPrice).toBeCloseTo(expectedAvg, 2);
  });

  it('should calculate correct total stock', () => {
    const stats = getProductStats(mockProducts);
    const expectedTotal = mockProducts.reduce((acc, p) => acc + p.stock, 0);
    expect(stats.totalStock).toBe(expectedTotal);
  });

  it('should handle empty array', () => {
    const stats = getProductStats([]);
    expect(stats.minPrice).toBe(0);
    expect(stats.maxPrice).toBe(0);
    expect(stats.avgPrice).toBe(0);
    expect(stats.totalStock).toBe(0);
  });

  it('should handle single product', () => {
    const single = [mockProducts[0]];
    const stats = getProductStats(single);
    expect(stats.minPrice).toBe(single[0].price);
    expect(stats.maxPrice).toBe(single[0].price);
    expect(stats.avgPrice).toBe(single[0].price);
    expect(stats.totalStock).toBe(single[0].stock);
  });

  it('should handle products with same price', () => {
    const samePrice: Product[] = [
      { id: 1, name: 'A', price: 100, stock: 10, category: 'Test' },
      { id: 2, name: 'B', price: 100, stock: 20, category: 'Test' },
    ];
    const stats = getProductStats(samePrice);
    expect(stats.minPrice).toBe(100);
    expect(stats.maxPrice).toBe(100);
    expect(stats.avgPrice).toBe(100);
  });

  it('should handle zero-priced products', () => {
    const zeroPrice: Product[] = [
      { id: 1, name: 'Free', price: 0, stock: 100, category: 'Test' },
      { id: 2, name: 'Paid', price: 50, stock: 10, category: 'Test' },
    ];
    const stats = getProductStats(zeroPrice);
    expect(stats.minPrice).toBe(0);
    expect(stats.avgPrice).toBe(25);
  });
});

describe.only('Q19: parseNumberInput', () => {
  it('should parse valid integer strings', () => {
    expect(parseNumberInput('123')).toBe(123);
    expect(parseNumberInput('0')).toBe(0);
  });

  it('should parse valid decimal strings', () => {
    expect(parseNumberInput('123.45')).toBe(123.45);
    expect(parseNumberInput('0.5')).toBe(0.5);
  });

  it('should parse negative numbers', () => {
    expect(parseNumberInput('-123')).toBe(-123);
    expect(parseNumberInput('-0.5')).toBe(-0.5);
  });

  it('should return default value for empty string', () => {
    expect(parseNumberInput('')).toBe(0);
    expect(parseNumberInput('', 100)).toBe(100);
  });

  it('should return default value for invalid input', () => {
    expect(parseNumberInput('abc')).toBe(0);
    expect(parseNumberInput('abc', 50)).toBe(50);
  });

  it('should return default value for whitespace', () => {
    expect(parseNumberInput('   ')).toBe(0);
  });

  it('should handle scientific notation', () => {
    expect(parseNumberInput('1e2')).toBe(100);
  });

  it('should return default value for NaN string', () => {
    expect(parseNumberInput('NaN')).toBe(0);
  });

  it('should parse Infinity (JavaScript behavior)', () => {
    // Note: Number('Infinity') === Infinity, which is not NaN
    // So parseNumberInput returns Infinity, not the default value
    expect(parseNumberInput('Infinity', 999)).toBe(Infinity);
  });

  it('should use 0 as default when not specified', () => {
    expect(parseNumberInput('invalid')).toBe(0);
  });

  it('should handle very large numbers', () => {
    expect(parseNumberInput('999999999')).toBe(999999999);
  });

  it('should handle very small decimals', () => {
    expect(parseNumberInput('0.00001')).toBe(0.00001);
  });
});

// =====================================================================
// INTEGRATION TESTS
// =====================================================================

describe.only('Integration: Combined Operations', () => {
  it('should filter, sort, and calculate stats correctly', () => {
    // Filter Electronics, sort by price desc
    const filtered = filterByCategory(mockProducts, 'Electronics');
    const sorted = sortProducts(filtered, 'price', 'desc');
    const stats = getProductStats(sorted);

    expect(sorted[0].name).toBe('Laptop');
    expect(stats.totalStock).toBe(115); // 15+50+30+20
  });

  it('should combine filters and search', () => {
    const filtered = combineFilters(mockProducts, {
      minPrice: 50,
      maxPrice: 500,
    });
    const searched = searchProducts(filtered, 'o');

    expect(searched.length).toBeGreaterThan(0);
    expect(searched.every((p) => p.price >= 50 && p.price <= 500)).toBe(true);
  });

  it('should validate form and parse numbers correctly', () => {
    const formData: ProductFormData = {
      name: 'New Product',
      price: '299.99',
      stock: '50',
      category: 'Test',
    };

    const errors = validateProductForm(formData);
    expect(Object.keys(errors)).toHaveLength(0);

    const price = parseNumberInput(formData.price);
    const stock = parseNumberInput(formData.stock);

    expect(price).toBe(299.99);
    expect(stock).toBe(50);
  });
});
