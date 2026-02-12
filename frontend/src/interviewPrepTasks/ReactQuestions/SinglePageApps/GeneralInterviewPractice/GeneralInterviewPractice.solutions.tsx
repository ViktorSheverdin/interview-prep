import './GeneralInterviewPractice.css';

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * SOLUTIONS FILE - Complete working implementations
 * Check this file only AFTER attempting the exercises
 */

// ============================================================================
// SESSION 1: DATA OPERATIONS & ARRAY MANIPULATION
// ============================================================================

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string; // YYYY-MM-DD
  createdAt: string; // YYYY-MM-DD
}

export function filterByStatus(
  tasks: Task[],
  status?: 'todo' | 'in-progress' | 'done',
): Task[] {
  if (!status) return [...tasks];
  return tasks.filter((task) => task.status === status);
}

export function filterByPriority(
  tasks: Task[],
  priority?: 'low' | 'medium' | 'high',
): Task[] {
  if (!priority) return [...tasks];
  return tasks.filter((task) => task.priority === priority);
}

export function filterByAssignee(tasks: Task[], assignee: string): Task[] {
  if (!assignee.trim()) return [...tasks];
  return tasks.filter(
    (task) => task.assignee.toLowerCase() === assignee.toLowerCase(),
  );
}

export function sortTasks(
  tasks: Task[],
  field: 'title' | 'dueDate' | 'priority' | 'createdAt',
  order: 'asc' | 'desc' = 'asc',
): Task[] {
  return [...tasks].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];

    // Convert priority to numeric for sorting
    if (field === 'priority') {
      const priorityMap = { low: 1, medium: 2, high: 3 };
      aValue = String(priorityMap[a.priority]);
      bValue = String(priorityMap[b.priority]);
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function groupByStatus(
  tasks: Task[],
): Record<'todo' | 'in-progress' | 'done', Task[]> {
  return tasks.reduce(
    (acc, task) => {
      acc[task.status].push(task);
      return acc;
    },
    { 'todo': [], 'in-progress': [], 'done': [] } as Record<
      'todo' | 'in-progress' | 'done',
      Task[]
    >,
  );
}

export function getTaskStats(tasks: Task[]): {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueCount: number;
} {
  const grouped = groupByStatus(tasks);
  const today = new Date().toISOString().split('T')[0];
  const overdueCount = tasks.filter(
    (t) => t.status !== 'done' && t.dueDate < today,
  ).length;

  return {
    totalTasks: tasks.length,
    completedTasks: grouped.done.length,
    inProgressTasks: grouped['in-progress'].length,
    todoTasks: grouped.todo.length,
    overdueCount,
  };
}

export function getOverdueTasks(tasks: Task[]): Task[] {
  const today = new Date().toISOString().split('T')[0];
  return tasks.filter((task) => task.status !== 'done' && task.dueDate < today);
}

// ============================================================================
// SESSION 2: FORM VALIDATION & TYPE SAFETY
// ============================================================================

export type ValidationResult = { isValid: boolean; error?: string };

export function validateRequired(value: string): ValidationResult {
  if (!value.trim()) {
    return { isValid: false, error: 'This field is required' };
  }
  return { isValid: true };
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  return { isValid: true };
}

export function validateDate(dateStr: string): ValidationResult {
  // Check format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return { isValid: false, error: 'Date must be in YYYY-MM-DD format' };
  }

  // Check if valid date
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date' };
  }

  // Check if today or future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    return { isValid: false, error: 'Date must be today or in the future' };
  }

  return { isValid: true };
}

export function validatePriority(
  priority: string,
): ValidationResult & { value?: 'low' | 'medium' | 'high' } {
  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(priority)) {
    return { isValid: false, error: 'Priority must be low, medium, or high' };
  }
  return { isValid: true, value: priority as 'low' | 'medium' | 'high' };
}

export interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
}

export function validateTaskForm(
  data: TaskFormData,
): Record<keyof TaskFormData, string> {
  const errors: Record<string, string> = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (data.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  // Description validation
  if (data.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  // Status validation
  const validStatuses = ['todo', 'in-progress', 'done'];
  if (!validStatuses.includes(data.status)) {
    errors.status = 'Status must be todo, in-progress, or done';
  }

  // Priority validation
  const priorityResult = validatePriority(data.priority);
  if (!priorityResult.isValid) {
    errors.priority = priorityResult.error!;
  }

  // Assignee validation
  const emailResult = validateEmail(data.assignee);
  if (!emailResult.isValid) {
    errors.assignee = emailResult.error!;
  }

  // Due date validation
  const dateResult = validateDate(data.dueDate);
  if (!dateResult.isValid) {
    errors.dueDate = dateResult.error!;
  }

  // Fill in empty strings for valid fields
  return {
    title: errors.title || '',
    description: errors.description || '',
    status: errors.status || '',
    priority: errors.priority || '',
    assignee: errors.assignee || '',
    dueDate: errors.dueDate || '',
  };
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  initialData?: Partial<TaskFormData>;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'todo',
    priority: initialData?.priority || 'medium',
    assignee: initialData?.assignee || '',
    dueDate: initialData?.dueDate || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateTaskForm(formData);
    const hasErrors = Object.values(validationErrors).some((err) => err !== '');

    if (hasErrors) {
      setErrors(validationErrors);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form
      className='task-form'
      onSubmit={handleSubmit}
    >
      <div className='form-field'>
        <label htmlFor='title'>Title *</label>
        <input
          id='title'
          type='text'
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        {errors.title && <span className='error'>{errors.title}</span>}
      </div>

      <div className='form-field'>
        <label htmlFor='description'>Description</label>
        <textarea
          id='description'
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        {errors.description && (
          <span className='error'>{errors.description}</span>
        )}
      </div>

      <div className='form-field'>
        <label htmlFor='status'>Status *</label>
        <select
          id='status'
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value='todo'>To Do</option>
          <option value='in-progress'>In Progress</option>
          <option value='done'>Done</option>
        </select>
        {errors.status && <span className='error'>{errors.status}</span>}
      </div>

      <div className='form-field'>
        <label htmlFor='priority'>Priority *</label>
        <select
          id='priority'
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
        >
          <option value='low'>Low</option>
          <option value='medium'>Medium</option>
          <option value='high'>High</option>
        </select>
        {errors.priority && <span className='error'>{errors.priority}</span>}
      </div>

      <div className='form-field'>
        <label htmlFor='assignee'>Assignee (Email) *</label>
        <input
          id='assignee'
          type='email'
          value={formData.assignee}
          onChange={(e) => handleChange('assignee', e.target.value)}
        />
        {errors.assignee && <span className='error'>{errors.assignee}</span>}
      </div>

      <div className='form-field'>
        <label htmlFor='dueDate'>Due Date *</label>
        <input
          id='dueDate'
          type='date'
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
        />
        {errors.dueDate && <span className='error'>{errors.dueDate}</span>}
      </div>

      <button type='submit'>Submit</button>
    </form>
  );
};

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// ============================================================================
// SESSION 3: CUSTOM HOOKS & STATE MANAGEMENT
// ============================================================================

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useToggle(
  initialValue: boolean = false,
): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((prev) => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse];
}

export function usePrevious<T>(value: T): T | undefined {
  // const ref = useRef<T>();

  // useEffect(() => {
  //   ref.current = value;
  // }, [value]);

  // return ref.current;
  return;
}

export function useFilter(
  tasks: Task[],
  filters: {
    status?: 'todo' | 'in-progress' | 'done';
    priority?: 'low' | 'medium' | 'high';
    assignee?: string;
    searchQuery?: string;
  },
): Task[] {
  return tasks.filter((task) => {
    // Status filter
    if (filters.status && task.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Assignee filter
    if (
      filters.assignee &&
      !task.assignee.toLowerCase().includes(filters.assignee.toLowerCase())
    ) {
      return false;
    }

    // Search query (searches title and description)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesDescription = task.description.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }

    return true;
  });
}

export function useTaskManager(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((id: number, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  }, []);

  const deleteTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    loading,
    error,
  };
}

// ============================================================================
// SESSION 4: API & ASYNC OPERATIONS
// ============================================================================

const API_DELAY = 500;

let mockTasksDb: Task[] = [
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
];

export async function fetchTasks(): Promise<Task[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockTasksDb]);
    }, API_DELAY);
  });
}

export async function createTask(
  data: Omit<Task, 'id' | 'createdAt'>,
): Promise<Task> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const newTask: Task = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      mockTasksDb.push(newTask);
      resolve(newTask);
    }, API_DELAY);
  });
}

export async function updateTask(
  id: number,
  updates: Partial<Task>,
): Promise<Task> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTasksDb.findIndex((t) => t.id === id);
      if (index === -1) {
        reject(new Error('Task not found'));
      } else {
        mockTasksDb[index] = { ...mockTasksDb[index], ...updates };
        resolve(mockTasksDb[index]);
      }
    }, API_DELAY);
  });
}

export async function deleteTask(id: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockTasksDb = mockTasksDb.filter((t) => t.id !== id);
      resolve(true);
    }, API_DELAY);
  });
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, delayMs * Math.pow(2, attempt)),
        );
      }
    }
  }

  throw lastError!;
}

export class TaskQueue {
  private concurrency: number;
  private running: number = 0;
  private queue: Array<{
    operation: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor(concurrency: number = 3) {
    this.concurrency = concurrency;
  }

  async add<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ operation, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    this.running++;

    try {
      const result = await item.operation();
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    } finally {
      this.running--;
      this.processQueue();
    }
  }

  getPendingCount(): number {
    return this.queue.length;
  }
}

// ============================================================================
// COMPLETE TASK MANAGER COMPONENT
// ============================================================================

export const TaskManager: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTaskManager();
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    'todo' | 'in-progress' | 'done' | undefined
  >(undefined);
  const [filterPriority, setFilterPriority] = useState<
    'low' | 'medium' | 'high' | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<
    'title' | 'dueDate' | 'priority' | 'createdAt'
  >('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredTasks = useFilter(tasks, {
    status: filterStatus,
    priority: filterPriority,
    searchQuery: debouncedSearch,
  });

  const sortedTasks = sortTasks(filteredTasks, sortField, sortOrder);
  const stats = getTaskStats(tasks);
  const overdueTasks = getOverdueTasks(sortedTasks);

  const handleAddTask = (data: TaskFormData) => {
    addTask({
      title: data.title,
      description: data.description,
      status: data.status as any,
      priority: data.priority as any,
      assignee: data.assignee,
      dueDate: data.dueDate,
    });
    setShowForm(false);
  };

  const handleToggleStatus = (task: Task) => {
    const nextStatus =
      task.status === 'todo'
        ? 'in-progress'
        : task.status === 'in-progress'
          ? 'done'
          : 'todo';
    updateTask(task.id, { status: nextStatus });
  };

  return (
    <div className='task-manager'>
      <header>
        <h1>Task Manager</h1>
        <button onClick={() => setShowForm(true)}>+ Add Task</button>
      </header>

      <div className='filters'>
        <input
          type='text'
          placeholder='Search tasks...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='search-input'
        />

        <select
          value={filterStatus || ''}
          onChange={(e) =>
            setFilterStatus((e.target.value as any) || undefined)
          }
        >
          <option value=''>All Status</option>
          <option value='todo'>To Do</option>
          <option value='in-progress'>In Progress</option>
          <option value='done'>Done</option>
        </select>

        <select
          value={filterPriority || ''}
          onChange={(e) =>
            setFilterPriority((e.target.value as any) || undefined)
          }
        >
          <option value=''>All Priorities</option>
          <option value='low'>Low</option>
          <option value='medium'>Medium</option>
          <option value='high'>High</option>
        </select>

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as any)}
        >
          <option value='title'>Sort by Title</option>
          <option value='dueDate'>Sort by Due Date</option>
          <option value='priority'>Sort by Priority</option>
          <option value='createdAt'>Sort by Created</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <div className='task-stats'>
        <span>Total: {stats.totalTasks}</span>
        <span>Todo: {stats.todoTasks}</span>
        <span>In Progress: {stats.inProgressTasks}</span>
        <span>Completed: {stats.completedTasks}</span>
        <span className='overdue'>Overdue: {stats.overdueCount}</span>
      </div>

      <div className='task-list'>
        {sortedTasks.length === 0 ? (
          <p className='empty-state'>No tasks found</p>
        ) : (
          sortedTasks.map((task) => {
            const isOverdue = overdueTasks.some((t) => t.id === task.id);
            return (
              <div
                key={task.id}
                className={`task-card ${task.status} ${isOverdue ? 'overdue' : ''}`}
              >
                <div className='task-header'>
                  <h3>{task.title}</h3>
                  <span className={`priority-badge ${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
                <p className='task-description'>{task.description}</p>
                <div className='task-meta'>
                  <span>Assignee: {task.assignee}</span>
                  <span>Due: {formatDate(task.dueDate)}</span>
                </div>
                <div className='task-actions'>
                  <button onClick={() => handleToggleStatus(task)}>
                    {task.status}
                  </button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showForm && (
        <div className='modal-overlay'>
          <div className='modal'>
            <button
              className='close-btn'
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
            <h2>Add New Task</h2>
            <TaskForm onSubmit={handleAddTask} />
          </div>
        </div>
      )}
    </div>
  );
};

export const GeneralInterviewPractice: React.FC = () => {
  return <TaskManager />;
};
