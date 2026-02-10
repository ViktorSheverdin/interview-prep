/**
 * ============================================================================
 * TYPESCRIPT GENERICS - COMPLETE GUIDE
 * ============================================================================
 */

/**
 * WHAT PROBLEM DO GENERICS SOLVE?
 *
 * Imagine you need a function that returns the first item of an array:
 */

// Without generics - lose type information
function getFirstBad(arr: any[]): any {
  return arr[0];
}

const numbers = [1, 2, 3];
const first = getFirstBad(numbers); // Type is 'any' 😢

/**
 * The problem: we lost type safety! TypeScript doesn't know `first` is a number.
 *
 * Generics solve this: They let you write code that works with multiple types
 * while preserving type information.
 */

// ============================================================================
// 1. BASIC GENERIC FUNCTIONS
// ============================================================================

/**
 * Syntax: <T> is a "type parameter"
 *
 * T is like a variable for types
 */
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

// TypeScript infers T automatically
const numbers2 = [1, 2, 3];
const first2 = getFirst(numbers2); // T is inferred as 'number' ✅

const names = ["Alice", "Bob"];
const firstName = getFirst(names); // T is inferred as 'string' ✅

// You can also specify T explicitly
const result = getFirst<number>([1, 2, 3]);

/**
 * Think of <T> as: "Hey TypeScript, remember whatever type I pass in,
 * and use it throughout this function"
 */

// ============================================================================
// 2. MULTIPLE TYPE PARAMETERS
// ============================================================================

function makePair<K, V>(key: K, value: V): { key: K; value: V } {
  return { key, value };
}

const pair1 = makePair("age", 30);        // { key: string, value: number }
const pair2 = makePair(1, "hello");       // { key: number, value: string }
const pair3 = makePair(true, [1, 2, 3]);  // { key: boolean, value: number[] }

// ============================================================================
// 3. GENERIC INTERFACES & TYPES
// ============================================================================

// Generic interface
interface Box<T> {
  value: T;
  getValue: () => T;
}

const numberBox: Box<number> = {
  value: 42,
  getValue: () => 42
};

const stringBox: Box<string> = {
  value: "hello",
  getValue: () => "hello"
};

// Generic type alias
type Response<T> = {
  data: T;
  status: number;
  message: string;
};

const userResponse: Response<{ id: number; name: string }> = {
  data: { id: 1, name: "Alice" },
  status: 200,
  message: "Success"
};

// ============================================================================
// 4. GENERIC CONSTRAINTS
// ============================================================================

/**
 * Sometimes you want to restrict what types can be used:
 */

// Without constraint - works with ANY type
function getLengthBad<T>(item: T): number {
  // return item.length; // ❌ Error! T might not have .length
  return 0;
}

// With constraint - T must have a 'length' property
function getLength<T extends { length: number }>(item: T): number {
  return item.length; // ✅ Now TypeScript knows T has .length
}

getLength("hello");      // ✅ strings have .length
getLength([1, 2, 3]);    // ✅ arrays have .length
getLength({ length: 5 }); // ✅ objects with .length work
// getLength(123);          // ❌ Error! numbers don't have .length

/**
 * COMMON CONSTRAINTS:
 */

// Must be an object
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

// Must have specific properties
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

const user = findById(users, 1); // Type: { id: number; name: string } | undefined

// ============================================================================
// 5. GENERIC WITH KEYOF (VERY POWERFUL!)
// ============================================================================

/**
 * Get a property from an object safely
 */
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

const name = getProperty(person, "name");     // Type: string ✅
const age = getProperty(person, "age");       // Type: number ✅
// const invalid = getProperty(person, "xyz");   // ❌ Error! 'xyz' is not a key

/**
 * Breaking it down:
 * - T = the type of the object
 * - K extends keyof T = K must be one of the keys of T
 * - T[K] = the type of the value at that key
 */

// ============================================================================
// 6. EXAMPLES FROM YOUR INTERVIEW CODE
// ============================================================================

/**
 * From useForm hook:
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => void | Promise<void>
) {
  // const [values, setValues] = useState<T>(initialValues);
  // ...

  return {
    values: initialValues,
    errors: {} as Record<string, string>,
    handleChange: (name: string, value: any) => {},
    handleSubmit: async (e: any) => {},
    isSubmitting: false,
    reset: () => {},
  };
}

/**
 * Usage:
 */
interface LoginForm {
  email: string;
  password: string;
}

const form = useForm<LoginForm>(
  { email: "", password: "" },
  async (values) => {
    // values is typed as LoginForm!
    console.log(values.email);    // ✅ TypeScript knows this exists
    // console.log(values.xyz);      // ❌ Error!
  }
);

/**
 * From useDebounce hook:
 */
export function useDebounce<T>(value: T, delay: number): T {
  // const [debouncedValue, setDebouncedValue] = useState<T>(value);
  // ...
  return value;
}

// Usage - works with ANY type:
const debouncedString = useDebounce("hello", 300);      // T = string
const debouncedNumber = useDebounce(42, 300);           // T = number
const debouncedObject = useDebounce({ x: 1 }, 300);     // T = { x: number }

/**
 * From sortTasks:
 */
interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  dueDate: string;
  description: string;
  tags: string[];
}

function sortTasks(
  tasks: Task[],
  field: keyof Task,  // field MUST be a valid key of Task
  order: 'asc' | 'desc'
): Task[] {
  return tasks;
}

// Usage:
// sortTasks(tasks, "title", "asc");      // ✅
// sortTasks(tasks, "priority", "desc");  // ✅
// sortTasks(tasks, "invalidKey", "asc"); // ❌ Error!

// ============================================================================
// 7. PRACTICAL PATTERNS
// ============================================================================

/**
 * Pattern 1: Generic Array Helper
 */
function filterByProperty<T, K extends keyof T>(
  array: T[],
  key: K,
  value: T[K]
): T[] {
  return array.filter(item => item[key] === value);
}

const tasks = [
  { id: 1, status: 'todo', title: 'Task 1' },
  { id: 2, status: 'done', title: 'Task 2' },
  { id: 3, status: 'todo', title: 'Task 3' }
];

const todoTasks = filterByProperty(tasks, 'status', 'todo');
// Type: { id: number; status: string; title: string }[]

/**
 * Pattern 2: Generic Promise Handler
 */
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as T;
}

interface User {
  id: number;
  name: string;
}

// TypeScript knows the result is User
// const user = await fetchData<User>('/api/user/1');
// console.log(user.name); // ✅

/**
 * Pattern 3: Generic Component (React)
 */
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage:
// <List
//   items={[1, 2, 3]}
//   renderItem={(num) => <span>{num * 2}</span>}
// />

// <List
//   items={[{ name: 'Alice' }, { name: 'Bob' }]}
//   renderItem={(person) => <span>{person.name}</span>}
// />

// ============================================================================
// 8. DEFAULT GENERIC TYPES
// ============================================================================

// T defaults to 'string' if not specified
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

createArray(3, "hello");  // T = string
createArray(3, 42);       // T = number
createArray<string>(3, "test");   // T = string (default)

// ============================================================================
// 9. COMMON MISTAKES & FIXES
// ============================================================================

/**
 * ❌ Mistake 1: Not using generics when needed
 */

// Bad: loses type information
function identityBad(value: any): any {
  return value;
}

// Good: preserves type
function identity<T>(value: T): T {
  return value;
}

/**
 * ❌ Mistake 2: Too generic
 */

// Bad: T could be anything
function processBad<T>(value: T) {
  // return value.toString(); // ❌ Error! T might not have .toString()
  return String(value);
}

// Good: constrain T
function process<T extends { toString(): string }>(value: T) {
  return value.toString(); // ✅
}

/**
 * ❌ Mistake 3: Not inferring properly
 */

// Unnecessary - TypeScript can infer
// const result = useState<number>(0);

// Better - let TypeScript infer
// const result = useState(0); // TypeScript knows it's number

// ============================================================================
// 10. QUIZ YOURSELF
// ============================================================================

/**
 * Try to understand what type these return:
 */

function wrap<T>(value: T): { data: T } {
  return { data: value };
}

const a = wrap(42);              // Type: ?
const b = wrap("hello");         // Type: ?
const c = wrap([1, 2, 3]);       // Type: ?
const d = wrap({ x: 1, y: 2 });  // Type: ?

/**
 * ANSWERS:
 *
 * const a = wrap(42);              // { data: number }
 * const b = wrap("hello");         // { data: string }
 * const c = wrap([1, 2, 3]);       // { data: number[] }
 * const d = wrap({ x: 1, y: 2 });  // { data: { x: number; y: number } }
 */

// ============================================================================
// 11. SUMMARY
// ============================================================================

/**
 * ┌─────────────────┬────────────────────┬──────────────────────────────┐
 * │ Concept         │ Syntax             │ Use Case                     │
 * ├─────────────────┼────────────────────┼──────────────────────────────┤
 * │ Basic Generic   │ <T>                │ Function works with any type │
 * │ Multiple Types  │ <T, U>             │ Need multiple type params    │
 * │ Constraint      │ <T extends Type>   │ Restrict what T can be       │
 * │ keyof           │ K extends keyof T  │ K must be a key of T         │
 * │ Default         │ <T = string>       │ Provide default type         │
 * └─────────────────┴────────────────────┴──────────────────────────────┘
 */

/**
 * KEY INSIGHTS:
 *
 * 1. Generics = Type Safety + Reusability
 *    Write once, use with many types while maintaining type checking
 *
 * 2. <T> is like a variable for types
 *    It gets "filled in" when you use the function/component
 *
 * 3. Use constraints when you need specific capabilities
 *    <T extends { length: number }> means T must have .length
 *
 * 4. keyof is extremely powerful
 *    Ensures you only access properties that actually exist
 *
 * 5. TypeScript usually infers T correctly
 *    Only specify explicitly when TypeScript can't figure it out
 */

export {};
