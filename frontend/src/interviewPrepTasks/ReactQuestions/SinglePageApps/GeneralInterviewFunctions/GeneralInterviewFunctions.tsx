import './GeneralInterviewFunctions.css';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { v4 as uuid } from 'uuid';

// =====================================================================
// TYPE DEFINITIONS
// =====================================================================

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  tags: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  tags: string;
}

// =====================================================================
// CONTEXT (QUESTION 1-2: Implement Context and Provider)
// =====================================================================

interface TaskContextValue {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  filterTasks: (status?: Task['status'], priority?: Task['priority']) => Task[];
  setTasks: (tasks: Task[]) => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //   Quick Reference
  // ┌────────────────────┬─────────────────────────────────────────────────────────────┬──────────────────────────────┐
  // │     Operation      │                        Array Method                         │            Logic             │
  // ├────────────────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────┤
  // │ Find one           │ .find(task => task.id === id)                               │ Returns first match          │
  // ├────────────────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────┤
  // │ Update             │ .map(task => task.id === id ? {...task, ...updates} : task) │ Transform matching item      │
  // ├────────────────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────┤
  // │ Delete             │ .filter(task => task.id !== id)                             │ Keep everything except match │
  // ├────────────────────┼─────────────────────────────────────────────────────────────┼──────────────────────────────┤
  // │ Filter by criteria │ .filter(task => task.status === 'done')                     │ Keep only matches            │
  // └────────────────────┴─────────────────────────────────────────────────────────────┴──────────────────────────────┘

  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);

  // TODO: Implement addTask - should generate unique id and createdAt timestamp
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      id: uuid(),
      createdAt: new Date().toLocaleDateString('us'),
      ...task,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  // TODO: Implement updateTask - should update task by id
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  };

  // TODO: Implement deleteTask - should remove task by id
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // TODO: Implement filterTasks - should filter by status and/or priority
  // If no filters provided, return all tasks
  const filterTasks = (
    status?: Task['status'],
    priority?: Task['priority'],
  ) => {
    return tasks.filter((task) => {
      const matchedStatus = !status || task.status === status;
      const matchedPriority = !priority || task.priority === priority;
      return matchedStatus && matchedPriority;
    });
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTask, deleteTask, filterTasks, setTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
};

// =====================================================================
// CUSTOM HOOKS (QUESTION 3-6)
// =====================================================================

// TODO QUESTION 3: Implement useDebounce hook
// Should debounce the value by the specified delay
export function useDebounce<T>(value: T, delay: number): T {
  // 1. Create state to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 2. Set up a timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 3. Cleanup function: cancel the timer if value changes before delay completes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  // 4. Return the debounced value
  return debouncedValue;
}

// TODO QUESTION 4: Implement useLocalStorage hook
// Should sync state with localStorage
// Handle JSON serialization/deserialization
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    } catch (err) {
      console.log(err);
      return initialValue;
    }
  });

  const setLocalStoreValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setStoredValue(valueToStore);
    } catch (err) {
      console.log(err);
    }
  };

  return [storedValue, setLocalStoreValue];
}

// TODO QUESTION 5: Implement usePrevious hook
// Should return the previous value from the previous render
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// TODO QUESTION 6: Implement useForm hook
// Should manage form state with validation
export function useForm<T extends object>(
  initialValues: T,
  onSubmit: (values: T) => void | Promise<void>,
) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setFieldErrors = (fieldErrors: Record<string, string>) => {
    setErrors(fieldErrors);
  };

  const reset = () => {
    setErrors({});
    setFormData(initialValues);
    setIsSubmitting(false);
  };

  return {
    values: formData,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    reset,
    setFieldErrors,
  };
}

// =====================================================================
// UTILITY FUNCTIONS (QUESTION 7-10)
// =====================================================================

// TODO QUESTION 7: Implement sortTasks
// Should sort tasks by multiple fields (primary: field, secondary: createdAt)
export function sortTasks(
  tasks: Task[],
  field: keyof Task,
  order: 'asc' | 'desc' = 'asc',
): Task[] {
  const sortedTasks = [...tasks];
  sortedTasks.sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    let comparison = 0;
    if (aValue < bValue) comparison = -1;
    else if (aValue > bValue) comparison = 1;
    else {
      comparison = a.createdAt < b.createdAt ? -1 : 1;
    }
    return order === 'asc' ? comparison : -comparison;
  });
  return sortedTasks;
}

// TODO QUESTION 8: Implement validateTaskForm
// Should validate task form data and return errors
// Rules:
// - title: required, min 3 chars
// - description: required, min 10 chars
// - dueDate: required, must be future date
// - tags: if provided, must be comma-separated words
export function validateTaskForm(data: TaskFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  const { title, description, dueDate, tags } = data;
  if (!title || title.trim().length < 3) errors.title = 'Min 3 chars';
  if (!description || description.trim().length < 10)
    errors.description = 'Min 10 chars';
  if (!dueDate) {
    errors.dueDate = 'Required';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dueDate);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.dueDate = 'Must be in the future';
    }
  }

  if (tags && tags.trim().length > 0) {
    const tagsPattern = /^[a-zA-Z0-9\s]+(,\s*[a-zA-Z0-9\s]+)*$/;
    if (!tagsPattern.test(tags.trim()))
      errors.tags = 'must be comma sepparated';
  }
  return errors;
}

// TODO QUESTION 9: Implement groupTasksByStatus
// Should group tasks by their status
export function groupTasksByStatus(
  tasks: Task[],
): Record<Task['status'], Task[]> {
  const grouped: Record<Task['status'], Task[]> = {
    'todo': [],
    'in-progress': [],
    'done': [],
  };

  tasks.forEach((task) => {
    grouped[task.status].push(task);
  });

  return grouped;
}

// TODO QUESTION 10: Implement filterTasksByDateRange
// Should filter tasks where dueDate is between startDate and endDate (inclusive)
export function filterTasksByDateRange(
  tasks: Task[],
  startDate: string,
  endDate: string,
): Task[] {
  const filteredTasks = [...tasks];
  const start = new Date(startDate);
  const end = new Date(endDate);

  return filteredTasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    return taskDate >= start && taskDate <= end;
  });
}

// =====================================================================
// COMPONENTS (QUESTION 11-15)
// =====================================================================

// TODO QUESTION 11: Implement TaskCard component
// Should display task information with proper styling based on priority
// Should show edit/delete buttons
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  // TODO: Implement TaskCard
  // Should display all task fields
  // Should have buttons for edit, delete, and status change
  // Should apply different CSS classes based on priority

  return (
    <div className={`task-card priority-${task.priority}`}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-meta">
        <span className={`task-badge priority-${task.priority}`}>{task.priority}</span>
        <span className={`task-badge status-${task.status}`}>{task.status}</span>
        <span>Due: {task.dueDate}</span>
      </div>
      {task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag) => {
            return <span key={tag} className="tag">{tag}</span>;
          })}
        </div>
      )}
      <div className="task-actions">
        <button
          onClick={() => {
            onEdit(task);
          }}
        >
          Edit
        </button>
        <button
          onClick={() => {
            onDelete(task.id);
          }}
        >
          Delete
        </button>
        <button
          onClick={() => {
            onStatusChange(task.id, task.status);
          }}
        >
          Status Change
        </button>
      </div>
    </div>
  );
};

// TODO QUESTION 12: Implement TaskForm component
// Should be a controlled form with validation
// Should show validation errors
// Should handle submission
interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void | Promise<void>;
  onCancel: () => void;
}

const PRIORITY_OPTIONS: Task['priority'][] = ['low', 'medium', 'high'];
const STATUS_OPTIONS: Task['status'][] = ['todo', 'in-progress', 'done'];

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  // TODO: Implement TaskForm using useForm hook
  // Should validate on submit
  // Should show validation errors
  // Should disable submit button while submitting
  const defaultValues: TaskFormData = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: '',
  };
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldErrors,
  } = useForm<TaskFormData>(
    { ...defaultValues, ...(initialData ?? {}) },
    async (values) => {
      const validationErrors = validateTaskForm(values);
      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors);
        return;
      }
      await onSubmit(values);
    },
  );
  return (
    <form
      className='task-form'
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor='title'>Title *</label>
        <input
          id='title'
          name='title'
          type='text'
          value={values.title}
          onChange={(e) => {
            handleChange('title', e.target.value);
          }}
          placeholder='Title...'
          disabled={isSubmitting}
        />
        {errors?.title ? <p>{errors.title}</p> : null}
      </div>
      <div>
        <label htmlFor='description'>description *</label>
        <input
          id='description'
          name='description'
          type='text'
          value={values.description}
          onChange={(e) => {
            handleChange('description', e.target.value);
          }}
          placeholder='description...'
          disabled={isSubmitting}
        />
        {errors?.description ? <p>{errors.description}</p> : null}
      </div>
      <div>
        <label htmlFor='priority'>priority *</label>
        <select
          name='priority'
          id='priority'
          value={values.priority}
          onChange={(e) => {
            handleChange('priority', e.target.value);
          }}
        >
          {PRIORITY_OPTIONS.map((priority) => {
            return (
              <option
                key={priority}
                value={priority}
              >
                {priority}
              </option>
            );
          })}
        </select>
        {errors?.priority ? <p>{errors.priority}</p> : null}
      </div>
      <div>
        <label htmlFor='dueDate'>dueDate *</label>
        <input
          id='dueDate'
          name='dueDate'
          type='date'
          value={values.dueDate}
          onChange={(e) => {
            handleChange('dueDate', e.target.value);
          }}
          placeholder='dueDate...'
          disabled={isSubmitting}
        />
        {errors?.dueDate ? <p>{errors.dueDate}</p> : null}
      </div>
      <div>
        <label htmlFor='tags'>tags *</label>
        <input
          id='tags'
          name='tags'
          type='text'
          value={values.tags}
          onChange={(e) => {
            handleChange('tags', e.target.value);
          }}
          placeholder='tags...'
          disabled={isSubmitting}
        />
        {errors?.tags ? <p>{errors.tags}</p> : null}
      </div>
      <button
        type='submit'
        disabled={isSubmitting}
      >
        Submit
      </button>
      <button
        onClick={() => {
          onCancel();
        }}
      >
        Cancel
      </button>
    </form>
  );
};

// TODO QUESTION 13: Implement SearchBar component
// Should debounce search input
// Should call onSearch with debounced value
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
}) => {
  // TODO: Implement SearchBar with debounce
  // Use useDebounce hook
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className='search-bar'>
      <input
        type='text'
        id='query'
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder={placeholder}
      />
    </div>
  );
};

// TODO QUESTION 14: Implement FilterPanel component
// Should allow filtering by status and priority
// Should show active filter count
interface FilterPanelProps {
  onFilterChange: (filters: {
    status?: Task['status'];
    priority?: Task['priority'];
  }) => void;
}

const isValidOption = <T extends string>(
  value: string,
  validOptions: readonly T[],
): value is T => (validOptions as readonly string[]).includes(value);

const createSelectHandler =
  <T extends string>(
    validOptions: readonly T[],
    setState: (value: T | '') => void,
  ) =>
  (value: string): void => {
    if (value === '' || isValidOption(value, validOptions)) {
      setState(value as T | '');
    }
  };

export const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  // TODO: Implement FilterPanel
  // Should have dropdowns/buttons for status and priority
  // Should display count of active filters
  const [statusFilter, setStatusFilter] = useState<Task['status'] | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | ''>(
    '',
  );
  const activeFiltersCount = [statusFilter, priorityFilter].filter(
    Boolean,
  ).length;

  useEffect(() => {
    onFilterChange({
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
    });
  }, [statusFilter, priorityFilter, onFilterChange]);

  const onClear = () => {
    setStatusFilter('');
    setPriorityFilter('');
  };

  const handleStatusSelect = createSelectHandler(
    STATUS_OPTIONS,
    setStatusFilter,
  );

  const handlePrioritySelect = createSelectHandler(
    PRIORITY_OPTIONS,
    setPriorityFilter,
  );

  return (
    <div className='filter-panel'>
      {activeFiltersCount > 0 && (
        <div>Filters selected: {activeFiltersCount}</div>
      )}
      <div>
        <label htmlFor='statusFilter'>Status</label>
        <select
          id='statusFilter'
          name='statusFilter'
          value={statusFilter}
          onChange={(e) => {
            handleStatusSelect(e.target.value);
          }}
        >
          <option value=''>All</option>
          {STATUS_OPTIONS.map((status) => {
            return (
              <option
                value={status}
                key={status}
              >
                {status}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <label htmlFor='priorityFilter'>Priority</label>
        <select
          id='priorityFilter'
          name='priorityFilter'
          value={priorityFilter}
          onChange={(e) => handlePrioritySelect(e.target.value)}
        >
          <option value=''>All</option>
          {PRIORITY_OPTIONS.map((priority) => {
            return (
              <option
                key={priority}
                value={priority}
              >
                {priority}
              </option>
            );
          })}
        </select>
      </div>
      {activeFiltersCount > 0 && (
        <button onClick={() => onClear()}>Clear Filters</button>
      )}
    </div>
  );
};

// TODO QUESTION 15: Implement TaskList component
// Should display tasks in a list/grid
// Should handle sorting
// Should show "no tasks" message when empty
interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
  sortBy?: keyof Task;
  sortOrder?: 'asc' | 'desc';
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}) => {
  // TODO: Implement TaskList
  // Should sort tasks using sortTasks utility
  // Should render TaskCard for each task
  // Should show message if no tasks

  const sortedTasks = sortTasks(tasks, sortBy, sortOrder);

  if (sortedTasks.length === 0) return <span>No tasks</span>;

  return (
    <div className='task-list'>
      <div>
        {sortedTasks.map((task) => {
          return (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          );
        })}
      </div>
    </div>
  );
};

// =====================================================================
// MAIN APP COMPONENT (QUESTION 16-20)
// =====================================================================

// TODO QUESTION 16-20: Complete the main TaskManager component
// Should implement all features:
// - Add/Edit/Delete tasks
// - Search functionality
// - Filter by status/priority
// - Sort tasks
// - Persist to localStorage
export const TaskManagerApp: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    status?: Task['status'];
    priority?: Task['priority'];
  }>({});
  const [sortConfig, setSortConfig] = useState<{
    field: keyof Task;
    order: 'asc' | 'desc';
  }>({
    field: 'createdAt',
    order: 'desc',
  });

  // TODO: Get context and implement all handlers
  const { tasks, addTask, updateTask, deleteTask, filterTasks } =
    useTaskContext();

  // TODO: Implement search functionality
  // Filter tasks by searchQuery (search in title and description)
  const getFilteredTasks = (): Task[] => {
    // First apply status and priority filters using context function
    let filteredTasks = filterTasks(filters.status, filters.priority);

    // Then apply search filter
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filteredTasks;
  };

  // TODO: Implement form submission handler
  const handleFormSubmit = async (data: TaskFormData) => {
    // Your implementation here
    // Convert tags string to array
    // Either add new task or update existing task
    // Close form after submission
    const tagsArray = data.tags
      ? data.tags.split(',').map((tag) => tag.trim())
      : [];

    if (editingTask) {
      updateTask(editingTask.id, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
        tags: tagsArray,
      });
    } else {
      addTask({
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: 'todo',
        dueDate: data.dueDate,
        tags: tagsArray,
      });
    }
    setShowForm(false);
    setEditingTask(null);
  };

  // TODO: Implement edit handler
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // TODO: Implement delete handler
  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  // TODO: Implement status change handler
  const handleStatusChange = (id: string, status: Task['status']) => {
    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask) return;

    const currentStatusIndex = STATUS_OPTIONS.indexOf(currentTask.status);
    const nextIndex = (currentStatusIndex + 1) % STATUS_OPTIONS.length;
    const nextStatus = STATUS_OPTIONS[nextIndex];
    updateTask(id, { status: nextStatus });
  };

  // TODO: Persist tasks to localStorage using useLocalStorage hook
  // Load tasks on mount, save on changes

  return (
    <div className='task-manager'>
      <header className='task-manager-header'>
        <h1>Task Manager</h1>
        <button
          onClick={() => setShowForm(true)}
          className='btn-primary'
        >
          + Add Task
        </button>
      </header>

      <div className='task-manager-controls'>
        <SearchBar onSearch={setSearchQuery} />
        <FilterPanel onFilterChange={setFilters} />
      </div>

      <div className='task-manager-content'>
        {showForm && (
          <div className='modal-overlay'>
            <div className='modal'>
              <TaskForm
                initialData={
                  editingTask
                    ? {
                        title: editingTask.title,
                        description: editingTask.description,
                        priority: editingTask.priority,
                        dueDate: editingTask.dueDate,
                        tags: editingTask.tags.join(', '),
                      }
                    : undefined
                }
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            </div>
          </div>
        )}
        result
        <TaskList
          tasks={getFilteredTasks()}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          sortBy={sortConfig.field}
          sortOrder={sortConfig.order}
        />
      </div>
    </div>
  );
};

// Wrap the app with provider
export const GeneralInterviewFunctions: React.FC = () => {
  return (
    <TaskProvider>
      <TaskManagerApp />
    </TaskProvider>
  );
};
