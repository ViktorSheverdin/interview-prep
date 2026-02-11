# Compact Interview Prep - 20 Questions for 1.5 Hours

This is a focused interview prep with **20 questions** simulating **three 30-minute interviews** covering essential frontend React/TypeScript concepts.

## Structure

### 📝 Interview Session 1: Sorting & Basic Filtering (30 min)

**Focus:** Array manipulation, sorting, basic filtering

- **Q1:** Define Product interface
- **Q2:** Implement `sortProducts` - sort by field ascending/descending
- **Q3:** Implement `filterByCategory` - filter by single category
- **Q4:** Implement `filterByPriceRange` - filter by min/max price
- **Q5:** Implement `filterByStockRange` - filter by stock range
- **Q6:** Implement `ProductTable` - sortable table component with visual indicators
- **Q7:** Implement `combineFilters` - apply multiple filters simultaneously

**Key Concepts:**

- Array `sort()` with custom comparators
- Array `filter()` methods
- React table with click handlers
- Combining multiple filter conditions

---

### ✅ Interview Session 2: Form Validation & Number Handling (30 min)

**Focus:** Form validation, type checking, number validation

- **Q8:** Implement `validateRequired` - check for empty fields
- **Q9:** Implement `validateIsNumber` - verify numeric input
- **Q10:** Implement `validatePositiveNumber` - ensure positive values
- **Q11:** Implement `validateInteger` - check for whole numbers
- **Q12:** Implement `validateRange` - validate min/max bounds
- **Q13:** Implement `validateProductForm` - complete form validation
- **Q14:** Implement `ProductForm` - controlled form with error display

**Key Concepts:**

- Form validation patterns
- `isNaN()`, `Number()`, `Number.isInteger()`
- Controlled inputs with React state
- Error message display
- Form submission handling

---

### 🚀 Interview Session 3: Advanced Features & Integration (30 min)

**Focus:** Search, complex sorting, statistics, final integration

- **Q15:** Implement `searchProducts` - case-insensitive search
- **Q16:** Implement `multiFieldSort` - primary + secondary sort
- **Q17:** Implement `filterByCategories` - filter by multiple categories
- **Q18:** Implement `getProductStats` - calculate min/max/avg/total
- **Q19:** Implement `parseNumberInput` - safely parse string to number
- **Q20:** Complete `ProductManager` - integrate all features

**Key Concepts:**

- Case-insensitive string matching
- Multi-level sorting algorithms
- Array `includes()` for multiple values
- Math operations (min, max, avg)
- Safe type conversion
- Complete React app integration

---

## Files

- **`CompactInterview.tsx`** - Empty template with TODO comments (work on this!)
- **`CompactInterview.solutions.tsx`** - Complete solutions (check after attempting!)
- **`CompactInterview.README.md`** - This guide

## How to Use

1. **Open `CompactInterview.tsx`** - this is your working file
2. **Start with Q1** and work through sequentially
3. **Test each function** as you implement it
4. **Use the ProductManager component** to see everything working together
5. **Check `CompactInterview.solutions.tsx`** only after attempting

## Common Interview Patterns to Practice

### Sorting Arrays

```typescript
// Basic sort
arr.sort((a, b) => a - b); // ascending numbers
arr.sort((a, b) => b - a); // descending numbers

// Object sort
arr.sort((a, b) => {
  if (a.field < b.field) return -1;
  if (a.field > b.field) return 1;
  return 0;
});
```

### Filtering Arrays

```typescript
// Single condition
arr.filter((item) => item.price > 100);

// Multiple conditions (AND)
arr.filter((item) => item.price > 100 && item.stock > 0);

// Multiple conditions (OR)
arr.filter((item) => item.category === 'A' || item.category === 'B');

// Check if in array
arr.filter((item) => validCategories.includes(item.category));
```

### Number Validation

```typescript
// Check if number
isNaN(Number(value)); // true if NOT a number

// Check if integer
Number.isInteger(Number(value));

// Parse safely
const num = Number(value);
if (!isNaN(num)) {
  // valid number
}
```

### Range Filtering

```typescript
// Between min and max (inclusive)
arr.filter((item) => item.price >= min && item.price <= max);

// Handle undefined bounds
const minPrice = min ?? 0;
const maxPrice = max ?? Infinity;
arr.filter((item) => item.price >= minPrice && item.price <= maxPrice);
```

## Time Management Tips

**Session 1 (30 min):**

- Q1-3: 10 min (basics)
- Q4-5: 10 min (range filtering)
- Q6-7: 10 min (component + combine)

**Session 2 (30 min):**

- Q8-12: 15 min (validators)
- Q13-14: 15 min (form component)

**Session 3 (30 min):**

- Q15-19: 15 min (utilities)
- Q20: 15 min (final integration)

## Success Criteria

✅ All functions work correctly with edge cases
✅ Sort toggles ascending/descending
✅ Filters work independently and combined
✅ Form validates all fields properly
✅ Number inputs are validated correctly
✅ Range filters handle empty min/max
✅ Search is case-insensitive
✅ Stats calculate correctly
✅ UI updates reactively

## Common Mistakes to Avoid

❌ **Mutating original array in sort** - always use `[...arr].sort()`
❌ **Forgetting to handle empty strings** - check `value.trim()`
❌ **Not checking `isNaN`** - `Number("abc")` returns `NaN`, not an error
❌ **String comparison for numbers** - `"10" < "9"` is `true` (string comparison)
❌ **Forgetting case-insensitive search** - use `.toLowerCase()`
❌ **Not handling undefined in filters** - check if filter value exists before applying
❌ **Direct state mutation** - always use setState or updater function

Good luck with your interview prep! 🚀
