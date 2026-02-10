# React TypeScript Interview Challenge: Task Manager

## Overview
This is a realistic React TypeScript interview challenge. You'll be building a **Task Management Application** with incomplete implementations. Your goal is to implement the missing functionality to make all the tests pass.

## The Challenge
You have a Task Manager application with:
- ✅ Component structure and types defined
- ✅ Comprehensive test suite (100+ tests)
- ❌ **Missing implementations** (all marked with `// TODO:`)

## What You Need to Implement

### Questions 1-2: Context & State Management (Provider Pattern)
**File**: `GeneralInterviewFunctions.tsx` lines 48-78

Implement the `TaskProvider` context:
- `addTask`: Generate unique ID and timestamp, add task to state
- `updateTask`: Update task by ID
- `deleteTask`: Remove task by ID
- `filterTasks`: Filter tasks by status and/or priority

**Skills tested**: React Context, TypeScript generics, state management

---

### Question 3: Custom Hook - useDebounce
**File**: `GeneralInterviewFunctions.tsx` lines 92-97

Implement a debounce hook that delays updating a value.

**Requirements**:
- Return initial value immediately
- Delay subsequent updates by specified milliseconds
- Cancel previous timeout on new changes

**Skills tested**: Custom hooks, useEffect, cleanup functions, timers

---

### Question 4: Custom Hook - useLocalStorage
**File**: `GeneralInterviewFunctions.tsx` lines 99-105

Create a hook that syncs state with localStorage.

**Requirements**:
- Read from localStorage on mount
- Write to localStorage on changes
- Handle JSON serialization/deserialization
- Handle errors gracefully

**Skills tested**: Custom hooks, localStorage API, JSON, error handling

---

### Question 5: Custom Hook - usePrevious
**File**: `GeneralInterviewFunctions.tsx` lines 107-112

Implement a hook that tracks the previous value.

**Requirements**:
- Return `undefined` on first render
- Return previous value on subsequent renders
- Use useRef to store the value

**Skills tested**: useRef, render lifecycle

---

### Question 6: Custom Hook - useForm
**File**: `GeneralInterviewFunctions.tsx` lines 114-130

Create a comprehensive form management hook.

**Return type**:
```typescript
{
  values: T;
  errors: Record<string, string>;
  handleChange: (name: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  reset: () => void;
}
```

**Skills tested**: Complex custom hooks, form handling, async operations

---

### Question 7: Utility Function - sortTasks
**File**: `GeneralInterviewFunctions.tsx` lines 136-145

Implement sorting with secondary sort by `createdAt`.

**Requirements**:
- Sort by specified field
- Support asc/desc order
- Don't mutate original array
- Secondary sort by createdAt

**Skills tested**: Array methods, immutability, TypeScript keyof

---

### Question 8: Validation - validateTaskForm
**File**: `GeneralInterviewFunctions.tsx` lines 147-157

Implement form validation with these rules:
- `title`: required, min 3 characters
- `description`: required, min 10 characters
- `dueDate`: required, must be future date
- `tags`: if provided, must be comma-separated words

**Return**: Object with field names as keys and error messages as values

**Skills tested**: Data validation, date handling, regex

---

### Question 9: Utility Function - groupTasksByStatus
**File**: `GeneralInterviewFunctions.tsx` lines 159-168

Group an array of tasks by their status field.

**Return type**: `Record<Task['status'], Task[]>`

**Skills tested**: Array reduce, object manipulation, TypeScript

---

### Question 10: Utility Function - filterTasksByDateRange
**File**: `GeneralInterviewFunctions.tsx` lines 170-179

Filter tasks where `dueDate` falls between `startDate` and `endDate` (inclusive).

**Skills tested**: Date comparison, array filtering

---

### Question 11: Component - TaskCard
**File**: `GeneralInterviewFunctions.tsx` lines 195-205

Create a card component to display a single task.

**Requirements**:
- Display all task fields (title, description, priority, status, dueDate, tags)
- Apply CSS class `priority-{priority}` to root element
- Show Edit, Delete, and Status Change buttons
- Call appropriate callback props on button clicks

**Skills tested**: Component props, event handling, conditional rendering

---

### Question 12: Component - TaskForm
**File**: `GeneralInterviewFunctions.tsx` lines 217-227

Create a form component for adding/editing tasks.

**Requirements**:
- Use the `useForm` hook
- Validate using `validateTaskForm` on submit
- Show validation errors inline
- Disable submit button while submitting
- Pre-fill form if `initialData` is provided
- Call `onCancel` when cancel button is clicked

**Skills tested**: Form handling, validation, controlled components

---

### Question 13: Component - SearchBar
**File**: `GeneralInterviewFunctions.tsx` lines 238-250

Create a search input with debouncing.

**Requirements**:
- Use `useDebounce` hook
- Call `onSearch` with debounced value
- Use provided `debounceMs` prop (default 300ms)

**Skills tested**: Custom hooks usage, controlled inputs, debouncing

---

### Question 14: Component - FilterPanel
**File**: `GeneralInterviewFunctions.tsx` lines 259-268

Create filtering controls.

**Requirements**:
- Dropdowns/buttons for status and priority filters
- Show count of active filters
- Call `onFilterChange` with selected filters
- Allow clearing filters

**Skills tested**: Complex state, event handling, UI feedback

---

### Question 15: Component - TaskList
**File**: `GeneralInterviewFunctions.tsx` lines 283-300

Render a list of task cards.

**Requirements**:
- Sort tasks using `sortTasks` utility
- Render `TaskCard` for each task
- Show "No tasks found" message when empty
- Pass through all event handlers

**Skills tested**: List rendering, keys, prop drilling, conditional rendering

---

### Questions 16-20: Main App Integration
**File**: `GeneralInterviewFunctions.tsx` lines 313-410

Complete the main `GeneralInterviewFunctions` component.

**Requirements**:
1. **Get context**: Use `useTaskContext()` hook
2. **Search functionality**: Filter tasks by searchQuery (search in title and description)
3. **Form submission**:
   - Convert tags string to array
   - Either add new task or update existing
   - Close form after submission
4. **CRUD handlers**: Implement edit, delete, and status change
5. **LocalStorage persistence**: Use `useLocalStorage` hook to persist tasks
6. **Statistics**: Show total, completed, and pending task counts

**Skills tested**: Integration, state management, data flow, persistence

---

## Running Tests

```bash
# Run all tests
pnpm test GeneralInterviewFunctions

# Run tests in watch mode
pnpm test GeneralInterviewFunctions --watch

# Run specific test suite
pnpm test GeneralInterviewFunctions -t "TaskContext"
```

## Tips

1. **Start with fundamentals**: Implement hooks first (Questions 3-6), then utilities (7-10), then components (11-15), finally integration (16-20)

2. **Read the tests**: The test file shows exactly what's expected. If you're unsure about a requirement, check the corresponding test.

3. **TypeScript is your friend**: Pay attention to the type definitions. They guide you toward correct implementations.

4. **Don't mutate**: Use immutable patterns for arrays and objects.

5. **Edge cases**: Tests cover edge cases like empty arrays, undefined values, etc.

6. **Console warnings**: Fix any React warnings about keys, state updates, or missing dependencies.

## Success Criteria

✅ All 100+ tests passing
✅ No TypeScript errors
✅ No React warnings in console
✅ UI is functional (you can add/edit/delete tasks)

## Estimated Time

- **Quick pass** (core functionality): 2-3 hours
- **Complete implementation** (all features + polish): 4-6 hours

Good luck! 🚀
