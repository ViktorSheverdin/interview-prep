import '@testing-library/jest-dom';

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { act, renderHook } from '@testing-library/react';
import React from 'react';

import {
  FilterPanel,
  filterTasksByDateRange,
  GeneralInterviewFunctions,
  groupTasksByStatus,
  SearchBar,
  sortTasks,
  Task,
  TaskCard,
  TaskForm,
  TaskList,
  TaskManagerApp,
  TaskProvider,
  useDebounce,
  useForm,
  useLocalStorage,
  usePrevious,
  useTaskContext,
  validateTaskForm,
} from './GeneralInterviewFunctions';

// =====================================================================
// QUESTION 1-2: Context and Provider Tests
// =====================================================================
describe('TaskContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TaskProvider>{children}</TaskProvider>
  );

  test('should provide context with initial empty tasks', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });
    expect(result.current.tasks).toEqual([]);
  });

  test('should add a task with generated id and createdAt', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    act(() => {
      result.current.addTask({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        status: 'todo',
        dueDate: '2024-12-31',
        tags: ['test'],
      });
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBeDefined();
    expect(result.current.tasks[0].createdAt).toBeDefined();
    expect(result.current.tasks[0].title).toBe('Test Task');
  });

  test('should update a task by id', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    act(() => {
      result.current.addTask({
        title: 'Original',
        description: 'Description',
        priority: 'low',
        status: 'todo',
        dueDate: '2024-12-31',
        tags: [],
      });
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.updateTask(taskId, { title: 'Updated', status: 'done' });
    });

    expect(result.current.tasks[0].title).toBe('Updated');
    expect(result.current.tasks[0].status).toBe('done');
  });

  test('should delete a task by id', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    act(() => {
      result.current.addTask({
        title: 'Task 1',
        description: 'Description',
        priority: 'low',
        status: 'todo',
        dueDate: '2024-12-31',
        tags: [],
      });
      result.current.addTask({
        title: 'Task 2',
        description: 'Description',
        priority: 'low',
        status: 'todo',
        dueDate: '2024-12-31',
        tags: [],
      });
    });

    expect(result.current.tasks).toHaveLength(2);
    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Task 2');
  });

  test('should filter tasks by status', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    act(() => {
      result.current.addTask({
        title: 'Todo Task',
        description: 'Description',
        priority: 'low',
        status: 'todo',
        dueDate: '2024-12-31',
        tags: [],
      });
      result.current.addTask({
        title: 'Done Task',
        description: 'Description',
        priority: 'low',
        status: 'done',
        dueDate: '2024-12-31',
        tags: [],
      });
    });

    const filtered = result.current.filterTasks('done');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Done Task');
  });

  test('should filter tasks by priority', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    act(() => {
      result.current.addTask({
        title: 'High Priority',
        description: 'Description',
        priority: 'high',
        status: 'todo',
        dueDate: '2024-12-31',
        tags: [],
      });
      result.current.addTask({
        title: 'Low Priority',
        description: 'Description',
        priority: 'low',
        status: 'todo',
        dueDate: '2024-12-31',
        tags: [],
      });
    });

    const filtered = result.current.filterTasks(undefined, 'high');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('High Priority');
  });

  test('should filter tasks by both status and priority', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    act(() => {
      result.current.addTask({
        title: 'Task 1',
        description: 'Description',
        priority: 'high',
        status: 'todo',
        dueDate: '2024-12-31',
        tags: [],
      });
      result.current.addTask({
        title: 'Task 2',
        description: 'Description',
        priority: 'high',
        status: 'done',
        dueDate: '2024-12-31',
        tags: [],
      });
      result.current.addTask({
        title: 'Task 3',
        description: 'Description',
        priority: 'low',
        status: 'todo',
        dueDate: '2024-12-31',
        tags: [],
      });
    });

    const filtered = result.current.filterTasks('todo', 'high');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Task 1');
  });
});

// =====================================================================
// QUESTION 3: useDebounce Hook Tests
// =====================================================================
describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  test('should debounce value changes', () => {
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

  test('should cancel previous debounce on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } },
    );

    rerender({ value: 'second', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(250);
    });

    rerender({ value: 'third', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('third');
  });
});

// =====================================================================
// QUESTION 4: useLocalStorage Hook Tests
// =====================================================================
describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should use initial value when nothing in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  test('should read from localStorage on mount', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored-value');
  });

  test('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('new-value');
  });

  test('should handle complex objects', () => {
    const obj = { name: 'John', age: 30 };
    const { result } = renderHook(() => useLocalStorage('test-obj', obj));

    const updated = { name: 'Jane', age: 25 };
    act(() => {
      result.current[1](updated);
    });

    expect(result.current[0]).toEqual(updated);
    expect(JSON.parse(localStorage.getItem('test-obj')!)).toEqual(updated);
  });
});

// =====================================================================
// QUESTION 5: usePrevious Hook Tests
// =====================================================================
describe('usePrevious', () => {
  test('should return undefined on first render', () => {
    const { result } = renderHook(() => usePrevious('first'));
    expect(result.current).toBeUndefined();
  });

  test('should return previous value on subsequent renders', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'first' },
    });

    expect(result.current).toBeUndefined();

    rerender({ value: 'second' });
    expect(result.current).toBe('first');

    rerender({ value: 'third' });
    expect(result.current).toBe('second');
  });
});

// =====================================================================
// QUESTION 6: useForm Hook Tests
// =====================================================================
describe('useForm', () => {
  test('should initialize with initial values', () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({ name: '', email: '' }, onSubmit),
    );

    expect(result.current.values).toEqual({ name: '', email: '' });
    expect(result.current.isSubmitting).toBe(false);
  });

  test('should handle field changes', () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({ name: '', email: '' }, onSubmit),
    );

    act(() => {
      result.current.handleChange('name', 'John');
    });

    expect(result.current.values.name).toBe('John');
  });

  // test('should handle form submission', async () => {
  //   const onSubmit = jest.fn();
  //   const { result } = renderHook(() =>
  //     useForm({ name: 'John' }, onSubmit)
  //   );

  //   await act(async () => {
  //     await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
  //   });

  //   expect(onSubmit).toHaveBeenCalledWith({ name: 'John' });
  // });

  test('should reset to initial values', () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useForm({ name: '', email: '' }, onSubmit),
    );

    act(() => {
      result.current.handleChange('name', 'John');
      result.current.handleChange('email', 'john@example.com');
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual({ name: '', email: '' });
  });

  // test('should track submitting state', async () => {
  //   const onSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
  //   const { result } = renderHook(() => useForm({ name: 'John' }, onSubmit));

  //   expect(result.current.isSubmitting).toBe(false);

  //   const submitPromise = act(async () => {
  //     await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
  //   });

  //   await waitFor(() => {
  //     expect(result.current.isSubmitting).toBe(false);
  //   });

  //   await submitPromise;
  // });
});

// =====================================================================
// QUESTION 7: sortTasks Tests
// =====================================================================
describe('sortTasks', () => {
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Task A',
      description: 'Desc',
      priority: 'low',
      status: 'todo',
      dueDate: '2024-12-31',
      tags: [],
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      title: 'Task B',
      description: 'Desc',
      priority: 'high',
      status: 'done',
      dueDate: '2024-12-30',
      tags: [],
      createdAt: '2024-01-02',
    },
    {
      id: '3',
      title: 'Task C',
      description: 'Desc',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2024-12-29',
      tags: [],
      createdAt: '2024-01-03',
    },
  ];

  test('should sort by title ascending', () => {
    const sorted = sortTasks(tasks, 'title', 'asc');
    expect(sorted[0].title).toBe('Task A');
    expect(sorted[2].title).toBe('Task C');
  });

  test('should sort by title descending', () => {
    const sorted = sortTasks(tasks, 'title', 'desc');
    expect(sorted[0].title).toBe('Task C');
    expect(sorted[2].title).toBe('Task A');
  });

  test('should sort by dueDate', () => {
    const sorted = sortTasks(tasks, 'dueDate', 'asc');
    expect(sorted[0].dueDate).toBe('2024-12-29');
    expect(sorted[2].dueDate).toBe('2024-12-31');
  });

  test('should not mutate original array', () => {
    const original = [...tasks];
    sortTasks(tasks, 'title', 'asc');
    expect(tasks).toEqual(original);
  });
});

// =====================================================================
// QUESTION 8: validateTaskForm Tests
// =====================================================================
describe('validateTaskForm', () => {
  test('should return no errors for valid data', () => {
    const data = {
      title: 'Valid Title',
      description: 'Valid description that is long enough',
      priority: 'high' as const,
      dueDate: '2027-12-31',
      tags: 'work, urgent',
    };

    const errors = validateTaskForm(data);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  test('should validate title is required', () => {
    const data = {
      title: '',
      description: 'Valid description',
      priority: 'high' as const,
      dueDate: '2025-12-31',
      tags: '',
    };

    const errors = validateTaskForm(data);
    expect(errors.title).toBeDefined();
  });

  test('should validate title minimum length', () => {
    const data = {
      title: 'AB',
      description: 'Valid description',
      priority: 'high' as const,
      dueDate: '2025-12-31',
      tags: '',
    };

    const errors = validateTaskForm(data);
    expect(errors.title).toBeDefined();
  });

  test('should validate description is required', () => {
    const data = {
      title: 'Valid Title',
      description: '',
      priority: 'high' as const,
      dueDate: '2025-12-31',
      tags: '',
    };

    const errors = validateTaskForm(data);
    expect(errors.description).toBeDefined();
  });

  test('should validate description minimum length', () => {
    const data = {
      title: 'Valid Title',
      description: 'Short',
      priority: 'high' as const,
      dueDate: '2025-12-31',
      tags: '',
    };

    const errors = validateTaskForm(data);
    expect(errors.description).toBeDefined();
  });

  test('should validate dueDate is required', () => {
    const data = {
      title: 'Valid Title',
      description: 'Valid description',
      priority: 'high' as const,
      dueDate: '',
      tags: '',
    };

    const errors = validateTaskForm(data);
    expect(errors.dueDate).toBeDefined();
  });

  test('should validate dueDate is in the future', () => {
    const data = {
      title: 'Valid Title',
      description: 'Valid description',
      priority: 'high' as const,
      dueDate: '2020-01-01',
      tags: '',
    };

    const errors = validateTaskForm(data);
    expect(errors.dueDate).toBeDefined();
  });
});

// =====================================================================
// QUESTION 9: groupTasksByStatus Tests
// =====================================================================
describe('groupTasksByStatus', () => {
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Desc',
      priority: 'low',
      status: 'todo',
      dueDate: '2024-12-31',
      tags: [],
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Desc',
      priority: 'high',
      status: 'done',
      dueDate: '2024-12-31',
      tags: [],
      createdAt: '2024-01-02',
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Desc',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2024-12-31',
      tags: [],
      createdAt: '2024-01-03',
    },
    {
      id: '4',
      title: 'Task 4',
      description: 'Desc',
      priority: 'low',
      status: 'todo',
      dueDate: '2024-12-31',
      tags: [],
      createdAt: '2024-01-04',
    },
  ];

  test('should group tasks by status', () => {
    const grouped = groupTasksByStatus(tasks);

    expect(grouped.todo).toHaveLength(2);
    expect(grouped['in-progress']).toHaveLength(1);
    expect(grouped.done).toHaveLength(1);
  });

  test('should return empty arrays for statuses with no tasks', () => {
    const singleTask: Task[] = [tasks[0]];
    const grouped = groupTasksByStatus(singleTask);

    expect(grouped.todo).toHaveLength(1);
    expect(grouped['in-progress']).toHaveLength(0);
    expect(grouped.done).toHaveLength(0);
  });
});

// =====================================================================
// QUESTION 10: filterTasksByDateRange Tests
// =====================================================================
describe('filterTasksByDateRange', () => {
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Desc',
      priority: 'low',
      status: 'todo',
      dueDate: '2024-12-25',
      tags: [],
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Desc',
      priority: 'high',
      status: 'done',
      dueDate: '2024-12-30',
      tags: [],
      createdAt: '2024-01-02',
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Desc',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2025-01-05',
      tags: [],
      createdAt: '2024-01-03',
    },
  ];

  test('should filter tasks within date range', () => {
    const filtered = filterTasksByDateRange(tasks, '2024-12-20', '2024-12-31');
    expect(filtered).toHaveLength(2);
    expect(filtered.map((t) => t.id)).toContain('1');
    expect(filtered.map((t) => t.id)).toContain('2');
  });

  test('should include tasks on boundary dates', () => {
    const filtered = filterTasksByDateRange(tasks, '2024-12-25', '2024-12-30');
    expect(filtered).toHaveLength(2);
  });

  test('should return empty array when no tasks in range', () => {
    const filtered = filterTasksByDateRange(tasks, '2024-11-01', '2024-11-30');
    expect(filtered).toHaveLength(0);
  });
});

// =====================================================================
// QUESTION 11: TaskCard Component Tests
// =====================================================================
describe('TaskCard', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'high',
    status: 'todo',
    dueDate: '2024-12-31',
    tags: ['work', 'urgent'],
    createdAt: '2024-01-01',
  };

  test('should render task information', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onStatusChange = jest.fn();

    render(
      <TaskCard
        task={mockTask}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />,
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText(/Test Description/)).toBeInTheDocument();
  });

  test('should apply priority CSS class', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onStatusChange = jest.fn();

    const { container } = render(
      <TaskCard
        task={mockTask}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />,
    );

    const card = container.querySelector('.priority-high');
    expect(card).toBeInTheDocument();
  });

  test('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onStatusChange = jest.fn();

    render(
      <TaskCard
        task={mockTask}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />,
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  test('should call onDelete when delete button is clicked', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onStatusChange = jest.fn();

    render(
      <TaskCard
        task={mockTask}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  test('should display tags', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onStatusChange = jest.fn();

    render(
      <TaskCard
        task={mockTask}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />,
    );

    expect(screen.getByText('work')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });
});

// =====================================================================
// QUESTION 12: TaskForm Component Tests
// =====================================================================
describe('TaskForm', () => {
  test('should render empty form', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();

    render(
      <TaskForm
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
  });

  test('should render form with initial data', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    const initialData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high' as const,
      dueDate: '2024-12-31',
      tags: 'work, urgent',
    };

    render(
      <TaskForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  test('should call onSubmit with form data', async () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();

    render(
      <TaskForm
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Task' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'New Description that is long enough' },
    });
    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: '2025-12-31' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit|save/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  test('should show validation errors', async () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();

    render(
      <TaskForm
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /submit|save/i }));

    await waitFor(() => {
      expect(screen.getByText(/title/i)).toBeInTheDocument();
    });
  });

  test('should call onCancel when cancel button is clicked', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();

    render(
      <TaskForm
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalled();
  });
});

// =====================================================================
// QUESTION 13: SearchBar Component Tests
// =====================================================================
describe('SearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should render search input', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  test('should debounce search input', () => {
    const onSearch = jest.fn();
    render(
      <SearchBar
        onSearch={onSearch}
        debounceMs={300}
      />,
    );

    const input = screen.getByPlaceholderText(/search/i);

    fireEvent.change(input, { target: { value: 'test' } });

    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onSearch).toHaveBeenCalledWith('test');
  });

  test('should use custom placeholder', () => {
    const onSearch = jest.fn();
    render(
      <SearchBar
        onSearch={onSearch}
        placeholder='Find tasks...'
      />,
    );

    expect(screen.getByPlaceholderText('Find tasks...')).toBeInTheDocument();
  });
});

// =====================================================================
// QUESTION 14: FilterPanel Component Tests
// =====================================================================
describe('FilterPanel', () => {
  test('should render filter controls', () => {
    const onFilterChange = jest.fn();
    render(<FilterPanel onFilterChange={onFilterChange} />);

    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
  });

  test('should call onFilterChange when status filter changes', () => {
    const onFilterChange = jest.fn();
    render(<FilterPanel onFilterChange={onFilterChange} />);

    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: 'todo' } });

    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'todo' }),
    );
  });

  test('should call onFilterChange when priority filter changes', () => {
    const onFilterChange = jest.fn();
    render(<FilterPanel onFilterChange={onFilterChange} />);

    const prioritySelect = screen.getByLabelText(/priority/i);
    fireEvent.change(prioritySelect, { target: { value: 'high' } });

    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ priority: 'high' }),
    );
  });

  test('should display active filter count', () => {
    const onFilterChange = jest.fn();
    render(<FilterPanel onFilterChange={onFilterChange} />);

    // Initially no filter count shown (count only shows when > 0)
    expect(screen.queryByText(/Filters selected/i)).not.toBeInTheDocument();

    // Change a filter
    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: 'todo' } });

    // Now should show count
    expect(screen.getByText(/Filters selected: 1/i)).toBeInTheDocument();
  });
});

// =====================================================================
// QUESTION 15: TaskList Component Tests
// =====================================================================
describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      priority: 'high',
      status: 'todo',
      dueDate: '2024-12-31',
      tags: [],
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      priority: 'low',
      status: 'done',
      dueDate: '2024-12-30',
      tags: [],
      createdAt: '2024-01-02',
    },
  ];

  test('should render list of tasks', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onStatusChange = jest.fn();

    render(
      <TaskList
        tasks={mockTasks}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />,
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  test('should show empty state when no tasks', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onStatusChange = jest.fn();

    render(
      <TaskList
        tasks={[]}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />,
    );

    expect(screen.getByText(/no tasks/i)).toBeInTheDocument();
  });

  test('should sort tasks', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onStatusChange = jest.fn();

    const { container } = render(
      <TaskList
        tasks={mockTasks}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        sortBy='title'
        sortOrder='asc'
      />,
    );

    const taskCards = container.querySelectorAll('.task-card');
    expect(taskCards).toHaveLength(2);
  });
});

// =====================================================================
// QUESTION 16-20: Integration Tests for Main App
// =====================================================================
describe('TaskManagerApp Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should render app header and add button', () => {
    render(<GeneralInterviewFunctions />);

    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    expect(screen.getByText(/add task/i)).toBeInTheDocument();
  });

  test('should open form when add button is clicked', () => {
    render(<GeneralInterviewFunctions />);

    fireEvent.click(screen.getByText(/add task/i));

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  test('should add a new task', async () => {
    render(<GeneralInterviewFunctions />);

    fireEvent.click(screen.getByText(/add task/i));

    fireEvent.change(screen.getByLabelText(/^title/i), {
      target: { value: 'New Task' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'New task description that is long enough' },
    });

    // Use getAllByLabelText and select the form one (second one, index 1)
    const priorityInputs = screen.getAllByLabelText(/priority/i);
    fireEvent.change(priorityInputs[priorityInputs.length - 1], {
      target: { value: 'high' },
    });

    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: '2027-12-31' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });
});
