# General Interview Practice - 2 Hours

A comprehensive 2-hour TypeScript/React interview practice covering essential mid-senior level concepts.

## 🎯 Structure

This interview simulates **four 30-minute sessions** covering:

### Session 1: Data Operations & Array Manipulation (30 min)
**Focus:** Filtering, sorting, grouping, transforming data

- Q1-Q2: Define Task interface and filter by status
- Q3-Q4: Filter by priority and assignee
- Q5: Sort tasks by multiple fields
- Q6: Group tasks by status
- Q7: Get task statistics (counts, overdue)
- Q8: Find overdue tasks

### Session 2: Form Validation & Type Safety (30 min)
**Focus:** Input validation, date handling, type checking

- Q9-Q10: Validate required fields and email
- Q11: Validate date format and future dates
- Q12: Validate priority enum
- Q13: Validate task form (cross-field validation)
- Q14: Create TaskForm component with validation
- Q15: Parse and format dates safely

### Session 3: Custom Hooks & State Management (30 min)
**Focus:** React hooks patterns, localStorage, debouncing

- Q16: Implement useLocalStorage hook
- Q17: Implement useDebounce hook
- Q18: Implement useToggle hook
- Q19: Implement usePrevious hook
- Q20: Implement useFilter hook (combines filters)
- Q21: Implement useTaskManager hook (CRUD operations)

### Session 4: API & Async Operations (30 min)
**Focus:** Async/await, error handling, loading states

- Q22: Implement fetchTasks (mock API)
- Q23: Implement createTask with error handling
- Q24: Implement updateTask with optimistic updates
- Q25: Implement deleteTask with confirmation
- Q26: Implement retry logic
- Q27: Implement request queue with concurrency
- Q28: Complete TaskManager component

## 📁 Files

- `GeneralInterviewPractice.tsx` - Your working file (has TODO comments)
- `GeneralInterviewPractice.solutions.tsx` - Complete solutions (check after!)
- `GeneralInterviewPractice.test.tsx` - Test suite (run to verify)
- `GeneralInterviewPractice.css` - Styling
- `README.md` - This guide

## 🚀 How to Use

1. **Open `GeneralInterviewPractice.tsx`** - this is your working file
2. **Start with Session 1, Q1** and work through sequentially
3. **Run tests** to check your progress:
   ```bash
   npm test -- GeneralInterviewPractice.test.tsx
   ```
4. **Each session is 30 minutes** - pace yourself!
5. **Check solutions** only after attempting each section

## ⏱️ Time Management

**Session 1 (0-30 min):** Data Operations
- Q1-Q4: 15 min (basic filters)
- Q5-Q8: 15 min (sorting, grouping, stats)

**Session 2 (30-60 min):** Validation
- Q9-Q12: 15 min (individual validators)
- Q13-Q15: 15 min (form validation, component)

**Session 3 (60-90 min):** Hooks
- Q16-Q19: 15 min (basic hooks)
- Q20-Q21: 15 min (complex hooks)

**Session 4 (90-120 min):** Async
- Q22-Q25: 15 min (CRUD operations)
- Q26-Q28: 15 min (advanced patterns, integration)

## 🎓 Key Concepts Covered

### TypeScript
- Interface definitions
- Type unions and literals
- Generics
- Type guards
- Utility types (Pick, Omit, Partial)

### Data Operations
- Array filter, map, reduce
- Multi-field sorting
- Grouping data
- Date comparisons
- Statistics calculations

### Form Validation
- Required field validation
- Email regex
- Date validation
- Enum validation
- Cross-field validation

### React Hooks
- useState patterns
- useEffect cleanup
- useRef for previous values
- Custom hook composition
- localStorage integration
- Debouncing user input

### Async Operations
- Promises and async/await
- Error handling (try/catch)
- Loading states
- Optimistic updates
- Retry logic
- Request queuing

## ✅ Success Criteria

- All 28 functions implemented correctly
- All tests passing
- No TypeScript errors
- Handles edge cases (empty arrays, null, undefined)
- No mutations of input data
- Proper error handling
- Clean, readable code

## 💡 Common Patterns

### Sorting
```typescript
// Don't mutate - create new array
[...array].sort((a, b) => a.field - b.field)

// String comparison
if (a.field < b.field) return -1;
if (a.field > b.field) return 1;
return 0;
```

### Filtering
```typescript
// Multiple conditions (AND)
array.filter(item => condition1 && condition2)

// Optional filters
if (filter) {
  result = result.filter(...)
}
```

### Hooks
```typescript
// localStorage with JSON
const [state, setState] = useState(() => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : initialValue;
});

useEffect(() => {
  localStorage.setItem(key, JSON.stringify(state));
}, [state]);
```

### Async Operations
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

try {
  setLoading(true);
  const result = await apiCall();
  setData(result);
} catch (err) {
  setError(err as Error);
} finally {
  setLoading(false);
}
```

## ⚠️ Common Mistakes to Avoid

- ❌ Mutating original arrays (use spread or slice)
- ❌ Forgetting to handle empty strings/arrays
- ❌ Not checking for null/undefined
- ❌ String comparison for dates (use Date objects)
- ❌ Not cleaning up useEffect subscriptions
- ❌ Forgetting dependency arrays in hooks
- ❌ Not handling async errors
- ❌ Directly mutating React state

Good luck! 🚀
