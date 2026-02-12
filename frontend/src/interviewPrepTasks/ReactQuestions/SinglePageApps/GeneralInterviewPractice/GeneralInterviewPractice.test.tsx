import { act, renderHook } from '@testing-library/react';

import {
  createTask,
  deleteTask,
  fetchTasks,
  filterByAssignee,
  filterByPriority,
  filterByStatus,
  formatDate,
  getOverdueTasks,
  getTaskStats,
  groupByStatus,
  retryOperation,
  sortTasks,
  Task,
  TaskQueue,
  updateTask,
  useDebounce,
  useFilter,
  useLocalStorage,
  usePrevious,
  useTaskManager,
  useToggle,
  validateDate,
  validateEmail,
  validatePriority,
  validateRequired,
  validateTaskForm,
} from './GeneralInterviewPractice';

// Mock data
const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Fix login bug',
    description: 'Users cannot login with special characters',
    status: 'in-progress',
    priority: 'high',
    assignee: 'john@example.com',
    dueDate: '2024-12-20',
    createdAt: '2024-12-01',
  },
  {
    id: 2,
    title: 'Update documentation',
    description: 'Add API reference docs',
    status: 'todo',
    priority: 'low',
    assignee: 'jane@example.com',
    dueDate: '2025-01-15',
    createdAt: '2024-12-02',
  },
  {
    id: 3,
    title: 'Implement dark mode',
    description: 'Add theme toggle',
    status: 'done',
    priority: 'medium',
    assignee: 'bob@example.com',
    dueDate: '2024-11-30',
    createdAt: '2024-11-15',
  },
  {
    id: 4,
    title: 'Refactor database queries',
    description: 'Optimize slow queries',
    status: 'todo',
    priority: 'high',
    assignee: 'alice@example.com',
    dueDate: '2024-12-10',
    createdAt: '2024-12-03',
  },
  {
    id: 5,
    title: 'Write unit tests',
    description: 'Add tests for auth module',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'john@example.com',
    dueDate: '2025-02-01',
    createdAt: '2024-12-04',
  },
];

// ============================================================================
// SESSION 1: DATA OPERATIONS & ARRAY MANIPULATION
// ============================================================================

describe('Session 1: Data Operations & Array Manipulation', () => {
  describe.only('Q2: filterByStatus', () => {
    // it('should filter tasks by status', () => {
    //   const result = filterByStatus(mockTasks, 'todo');
    //   expect(result).toHaveLength(2);
    //   expect(result.every((t) => t.status === 'todo')).toBe(true);
    // });

    it('should return all tasks if status is undefined', () => {
      const result = filterByStatus(mockTasks, undefined);
      expect(result).toHaveLength(mockTasks.length);
    });

    it('should handle empty array', () => {
      const result = filterByStatus([], 'todo');
      expect(result).toEqual([]);
    });

    it('should not mutate original array', () => {
      const original = [...mockTasks];
      filterByStatus(mockTasks, 'done');
      expect(mockTasks).toEqual(original);
    });
  });

  describe.only('Q3: filterByPriority', () => {
    it('should filter tasks by priority', () => {
      const result = filterByPriority(mockTasks, 'high');
      expect(result).toHaveLength(2);
      // expect(result.every((t) => t.priority === 'high')).toBe(true);
    });

    it('should return all tasks if priority is undefined', () => {
      const result = filterByPriority(mockTasks, undefined);
      expect(result).toHaveLength(mockTasks.length);
    });

    it('should handle empty array', () => {
      const result = filterByPriority([], 'medium');
      expect(result).toEqual([]);
    });
  });

  describe.only('Q4: filterByAssignee', () => {
    it('should filter tasks by assignee (case-insensitive)', () => {
      const result = filterByAssignee(mockTasks, 'john@example.com');
      expect(result).toHaveLength(2);
      // expect(result.every((t) => t.assignee.toLowerCase() === 'john@example.com')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const result = filterByAssignee(mockTasks, 'JOHN@EXAMPLE.COM');
      expect(result).toHaveLength(2);
    });

    it('should return all tasks if assignee is empty string', () => {
      const result = filterByAssignee(mockTasks, '');
      expect(result).toHaveLength(mockTasks.length);
    });

    it('should handle empty array', () => {
      const result = filterByAssignee([], 'test@example.com');
      expect(result).toEqual([]);
    });
  });

  describe.only('Q5: sortTasks', () => {
    it('should sort by title ascending', () => {
      const result = sortTasks(mockTasks, 'title', 'asc');
      // expect(result[0].title).toBe('Fix login bug');
      // expect(result[result.length - 1].title).toBe('Write unit tests');
    });

    it('should sort by title descending', () => {
      const result = sortTasks(mockTasks, 'title', 'desc');
      // expect(result[0].title).toBe('Write unit tests');
      // expect(result[result.length - 1].title).toBe('Fix login bug');
    });

    it('should sort by dueDate ascending', () => {
      const result = sortTasks(mockTasks, 'dueDate', 'asc');
      // expect(result[0].dueDate).toBe('2024-11-30');
    });

    it('should sort by priority (high=3, medium=2, low=1) descending', () => {
      const result = sortTasks(mockTasks, 'priority', 'desc');
      // expect(result[0].priority).toBe('high');
      // expect(result[result.length - 1].priority).toBe('low');
    });

    it('should not mutate original array', () => {
      const original = [...mockTasks];
      sortTasks(mockTasks, 'title', 'asc');
      expect(mockTasks).toEqual(original);
    });
  });

  describe.only('Q6: groupByStatus', () => {
    it('should group tasks by status', () => {
      const result = groupByStatus(mockTasks);
      expect(result.todo).toHaveLength(2);
      expect(result['in-progress']).toHaveLength(2);
      expect(result.done).toHaveLength(1);
    });

    it('should return empty arrays for missing statuses', () => {
      const result = groupByStatus([mockTasks[0]]);
      expect(result.todo).toEqual([]);
      expect(result.done).toEqual([]);
    });

    it('should handle empty array', () => {
      const result = groupByStatus([]);
      expect(result.todo).toEqual([]);
      expect(result['in-progress']).toEqual([]);
      expect(result.done).toEqual([]);
    });
  });

  describe.only('Q7: getTaskStats', () => {
    it('should calculate task statistics', () => {
      const result = getTaskStats(mockTasks);
      expect(result.totalTasks).toBe(5);
      expect(result.completedTasks).toBe(1);
      expect(result.inProgressTasks).toBe(2);
      expect(result.todoTasks).toBe(2);
    });

    it('should count overdue tasks (status not done, dueDate < today)', () => {
      const result = getTaskStats(mockTasks);
      // Tasks 1 and 4 are overdue (past dates and not done)
      expect(result.overdueCount).toBeGreaterThan(0);
    });

    it('should handle empty array', () => {
      const result = getTaskStats([]);
      expect(result).toEqual({
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        todoTasks: 0,
        overdueCount: 0,
      });
    });
  });

  describe('Q8: getOverdueTasks', () => {
    it('should find overdue tasks (not done and past due date)', () => {
      const result = getOverdueTasks(mockTasks);
      // All results should not be 'done'
      // expect(result.every((t) => t.status !== 'done')).toBe(true);
    });

    it('should not include done tasks even if past due date', () => {
      const result = getOverdueTasks(mockTasks);
      // expect(result.every((t) => t.status !== 'done')).toBe(true);
    });

    it('should handle empty array', () => {
      const result = getOverdueTasks([]);
      expect(result).toEqual([]);
    });
  });
});

// ============================================================================
// SESSION 2: FORM VALIDATION & TYPE SAFETY
// ============================================================================

describe('Session 2: Form Validation & Type Safety', () => {
  describe.only('Q9: validateRequired', () => {
    it('should return valid for non-empty string', () => {
      const result = validateRequired('test');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty string', () => {
      const result = validateRequired('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should return invalid for whitespace only', () => {
      const result = validateRequired('   ');
      expect(result.isValid).toBe(false);
    });
  });

  describe.only('Q10: validateEmail', () => {
    it('should validate correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid').isValid).toBe(false);
      expect(validateEmail('test@').isValid).toBe(false);
      expect(validateEmail('@example.com').isValid).toBe(false);
      expect(validateEmail('test@example').isValid).toBe(false);
    });

    it('should handle empty string', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Q11: validateDate', () => {
    it('should validate correct date format (YYYY-MM-DD)', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split('T')[0];
      const result = validateDate(dateStr);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid date format', () => {
      expect(validateDate('12/25/2024').isValid).toBe(false);
      expect(validateDate('2024-13-01').isValid).toBe(false);
      expect(validateDate('invalid').isValid).toBe(false);
    });

    it('should reject past dates', () => {
      const result = validateDate('2020-01-01');
      expect(result.isValid).toBe(false);
    });

    it("should accept today's date", () => {
      const today = new Date().toISOString().split('T')[0];
      const result = validateDate(today);
      expect(result.isValid).toBe(true);
    });
  });

  describe.only('Q12: validatePriority', () => {
    it('should validate correct priorities', () => {
      expect(validatePriority('low').isValid).toBe(true);
      expect(validatePriority('medium').isValid).toBe(true);
      expect(validatePriority('high').isValid).toBe(true);
    });

    it('should reject invalid priorities', () => {
      expect(validatePriority('urgent').isValid).toBe(false);
      expect(validatePriority('').isValid).toBe(false);
      expect(validatePriority('LOW').isValid).toBe(false);
    });

    it('should return typed value when valid', () => {
      const result = validatePriority('high');
      expect(result.value).toBe('high');
    });
  });

  describe('Q13: validateTaskForm', () => {
    const validForm = {
      title: 'Test Task',
      description: 'Test description',
      status: 'todo',
      priority: 'high',
      assignee: 'test@example.com',
      dueDate: '2025-12-31',
    };

    it('should validate correct form', () => {
      const errors = validateTaskForm(validForm);
      expect(errors.title).toBe('');
      expect(errors.assignee).toBe('');
      expect(errors.dueDate).toBe('');
    });

    it('should reject title < 3 chars', () => {
      const result = validateTaskForm({ ...validForm, title: 'ab' });
      expect(result.title).toBeTruthy();
    });

    it('should reject title > 100 chars', () => {
      const result = validateTaskForm({
        ...validForm,
        title: 'a'.repeat(101),
      });
      expect(result.title).toBeTruthy();
    });

    it('should reject invalid email assignee', () => {
      const result = validateTaskForm({ ...validForm, assignee: 'invalid' });
      expect(result.assignee).toBeTruthy();
    });

    it('should reject invalid status', () => {
      const result = validateTaskForm({ ...validForm, status: 'pending' });
      expect(result.status).toBeTruthy();
    });

    it('should reject invalid priority', () => {
      const result = validateTaskForm({ ...validForm, priority: 'urgent' });
      expect(result.priority).toBeTruthy();
    });

    it('should reject description > 500 chars', () => {
      const result = validateTaskForm({
        ...validForm,
        description: 'a'.repeat(501),
      });
      expect(result.description).toBeTruthy();
    });
  });

  describe.only('Q15: formatDate', () => {
    it('should format date correctly', () => {
      const result = formatDate('2024-12-25');
      expect(result).toBe('Dec 25, 2024');
    });

    it('should handle different months', () => {
      expect(formatDate('2024-01-01')).toBe('Jan 1, 2024');
      expect(formatDate('2024-06-15')).toBe('Jun 15, 2024');
    });
  });
});

// ============================================================================
// SESSION 3: CUSTOM HOOKS & STATE MANAGEMENT
// ============================================================================

describe('Session 3: Custom Hooks & State Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe.only('Q16: useLocalStorage', () => {
    it('should initialize with initial value', () => {
      const { result } = renderHook(() => useLocalStorage('test', 'initial'));
      expect(result.current[0]).toBe('initial');
    });

    it('should persist value to localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test', 'initial'));
      act(() => {
        result.current[1]('updated');
      });
      expect(localStorage.getItem('test')).toBe(JSON.stringify('updated'));
    });

    it('should read from localStorage on init', () => {
      localStorage.setItem('test', JSON.stringify('stored'));
      const { result } = renderHook(() => useLocalStorage('test', 'initial'));
      expect(result.current[0]).toBe('stored');
    });

    it('should handle updater function', () => {
      const { result } = renderHook(() => useLocalStorage('test', 5));
      act(() => {
        result.current[1]((prev) => prev + 1);
      });
      expect(result.current[0]).toBe(6);
    });
  });

  describe.only('Q17: useDebounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 500));
      expect(result.current).toBe('initial');
    });

    it('should debounce value changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } },
      );

      rerender({ value: 'updated', delay: 500 });
      expect(result.current).toBe('initial');

      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(result.current).toBe('updated');
    });

    it('should cancel previous timeout on rapid changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } },
      );

      rerender({ value: 'update1', delay: 500 });
      act(() => {
        jest.advanceTimersByTime(200);
      });
      rerender({ value: 'update2', delay: 500 });
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('update2');
    });
  });

  describe('Q18: useToggle', () => {
    it('should initialize with default false', () => {
      const { result } = renderHook(() => useToggle());
      expect(result.current[0]).toBe(false);
    });

    it('should initialize with custom value', () => {
      const { result } = renderHook(() => useToggle(true));
      expect(result.current[0]).toBe(true);
    });

    it('should toggle value', () => {
      const { result } = renderHook(() => useToggle(false));
      act(() => {
        result.current[1](); // toggle
      });
      expect(result.current[0]).toBe(true);
    });

    it('should set to true', () => {
      const { result } = renderHook(() => useToggle(false));
      act(() => {
        result.current[2](); // setTrue
      });
      expect(result.current[0]).toBe(true);
    });

    it('should set to false', () => {
      const { result } = renderHook(() => useToggle(true));
      act(() => {
        result.current[3](); // setFalse
      });
      expect(result.current[0]).toBe(false);
    });
  });

  describe.only('Q19: usePrevious', () => {
    it('should return undefined on first render', () => {
      const { result } = renderHook(() => usePrevious('initial'));
      expect(result.current).toBeUndefined();
    });

    it('should return previous value after update', () => {
      const { result, rerender } = renderHook(
        ({ value }) => usePrevious(value),
        {
          initialProps: { value: 'initial' },
        },
      );
      rerender({ value: 'updated' });
      expect(result.current).toBe('initial');
    });

    it('should track value changes', () => {
      const { result, rerender } = renderHook(
        ({ value }) => usePrevious(value),
        {
          initialProps: { value: 1 },
        },
      );
      rerender({ value: 2 });
      expect(result.current).toBe(1);
      rerender({ value: 3 });
      expect(result.current).toBe(2);
    });
  });

  describe('Q20: useFilter', () => {
    it('should filter by status', () => {
      const result = useFilter(mockTasks, { status: 'todo' });
      expect(result).toHaveLength(2);
    });

    it('should filter by priority', () => {
      const result = useFilter(mockTasks, { priority: 'high' });
      expect(result).toHaveLength(2);
    });

    it('should filter by assignee', () => {
      const result = useFilter(mockTasks, { assignee: 'john@example.com' });
      expect(result).toHaveLength(2);
    });

    it('should filter by search query (title or description)', () => {
      const result = useFilter(mockTasks, { searchQuery: 'bug' });
      expect(result.length).toBeGreaterThan(0);
    });

    it('should combine multiple filters', () => {
      const result = useFilter(mockTasks, {
        status: 'todo',
        priority: 'high',
      });
      expect(result).toHaveLength(1);
      // expect(result[0].id).toBe(4);
    });
  });

  describe('Q21: useTaskManager', () => {
    it('should initialize with tasks', () => {
      const { result } = renderHook(() =>
        useTaskManager(mockTasks.slice(0, 2)),
      );
      expect(result.current.tasks).toHaveLength(2);
    });

    it('should add task', () => {
      const { result } = renderHook(() => useTaskManager([]));
      act(() => {
        result.current.addTask({
          title: 'New Task',
          description: 'Test',
          status: 'todo',
          priority: 'low',
          assignee: 'test@example.com',
          dueDate: '2025-01-01',
        });
      });
      expect(result.current.tasks).toHaveLength(1);
      // expect(result.current.tasks[0].title).toBe('New Task');
    });

    it('should update task', () => {
      const { result } = renderHook(() => useTaskManager([mockTasks[0]]));
      act(() => {
        result.current.updateTask(1, { title: 'Updated Title' });
      });
      // expect(result.current.tasks[0].title).toBe('Updated Title');
    });

    it('should delete task', () => {
      const { result } = renderHook(() => useTaskManager([mockTasks[0]]));
      act(() => {
        result.current.deleteTask(1);
      });
      expect(result.current.tasks).toHaveLength(0);
    });
  });
});

// ============================================================================
// SESSION 4: API & ASYNC OPERATIONS
// ============================================================================

describe('Session 4: API & Async Operations', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Q22: fetchTasks', () => {
    it('should return array of tasks', async () => {
      const promise = fetchTasks();
      jest.advanceTimersByTime(500);
      const result = await promise;
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Q23: createTask', () => {
    it('should create task with id and createdAt', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Test',
        status: 'todo' as const,
        priority: 'low' as const,
        assignee: 'test@example.com',
        dueDate: '2025-01-01',
      };
      const promise = createTask(taskData);
      jest.advanceTimersByTime(500);
      const result = await promise;
      // expect(result.id).toBeDefined();
      // expect(result.createdAt).toBeDefined();
      // expect(result.title).toBe('New Task');
    });
  });

  describe('Q24: updateTask', () => {
    it('should update task fields', async () => {
      const promise = updateTask(1, { title: 'Updated' });
      jest.advanceTimersByTime(500);
      const result = await promise;
      // expect(result.title).toBe('Updated');
    });
  });

  describe('Q25: deleteTask', () => {
    it('should return true on success', async () => {
      const promise = deleteTask(1);
      jest.advanceTimersByTime(500);
      const result = await promise;
      expect(result).toBe(true);
    });
  });

  describe('Q26: retryOperation', () => {
    it('should retry failed operations', async () => {
      let attempts = 0;
      const operation = jest.fn(async () => {
        attempts++;
        if (attempts < 3) throw new Error('Failed');
        return 'success';
      });

      const promise = retryOperation(operation, 3, 100);
      jest.advanceTimersByTime(300);
      const result = await promise;
      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should throw after max retries', async () => {
      const operation = jest.fn(async () => {
        throw new Error('Always fails');
      });

      const promise = retryOperation(operation, 2, 100);
      jest.advanceTimersByTime(300);
      await expect(promise).rejects.toThrow('Always fails');
      expect(operation).toHaveBeenCalledTimes(3); // initial + 2 retries
    });
  });

  describe('Q27: TaskQueue', () => {
    it('should limit concurrent operations', async () => {
      const queue = new TaskQueue(2);
      let running = 0;
      let maxRunning = 0;

      const operation = async () => {
        running++;
        maxRunning = Math.max(maxRunning, running);
        await new Promise((resolve) => setTimeout(resolve, 100));
        running--;
      };

      const promises = [
        queue.add(operation),
        queue.add(operation),
        queue.add(operation),
        queue.add(operation),
      ];

      jest.advanceTimersByTime(100);
      await Promise.all(promises);
      expect(maxRunning).toBeLessThanOrEqual(2);
    });

    it('should track pending count', () => {
      const queue = new TaskQueue(2);
      queue.add(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      });
      queue.add(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      });
      queue.add(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      });

      expect(queue.getPendingCount()).toBeGreaterThan(0);
    });
  });
});
