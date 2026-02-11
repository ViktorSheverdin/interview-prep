import './GeneralInterviewFunctions.css';

import React, { useState } from 'react';

// =====================================================================
// INTERVIEW SESSION 1: Sorting, Filtering & Display (30 min)
// =====================================================================

// TODO Q1: Define Employee interface with: id, name, email, salary, yearsOfExperience, department
export interface Employee {
  id: number;
  name: string;
  email: string;
  salary: number;
  yearsOfExperience: number;
  department: string;
}

// TODO Q2: Implement sortEmployees - sort by any field, asc or desc
// Return a new sorted array. Do not mutate the original.
export function sortEmployees(
  employees: Employee[],
  field: keyof Employee,
  order: 'asc' | 'desc' = 'asc',
): Employee[] {
  return [...employees].sort((a, b) => {
    const aField = a[field];
    const bField = b[field];

    if (aField < bField) return order === 'asc' ? -1 : 1;
    if (aField > bField) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

// TODO Q3: Implement filterByDepartment - filter employees by department
// Return all employees if department is empty string
export function filterByDepartment(
  employees: Employee[],
  department: string,
): Employee[] {
  // Your implementation here
  if (department === '') return [...employees];

  return employees.filter((e) => e.department === department);
}

// TODO Q4: Implement filterBySalaryRange - filter employees within min/max salary
export function filterBySalaryRange(
  employees: Employee[],
  min: number,
  max: number,
): Employee[] {
  // Your implementation here

  return employees.filter((e) => e.salary >= min && e.salary <= max);
}

// TODO Q5: Implement filterByExperienceRange - filter employees with yearsOfExperience between min/max
export function filterByExperienceRange(
  employees: Employee[],
  min: number,
  max: number,
): Employee[] {
  // Your implementation here

  return employees.filter(
    (e) => e.yearsOfExperience >= min && e.yearsOfExperience <= max,
  );
}

// TODO Q6: Implement combineFilters - apply multiple filters at once
// Should filter by department AND salary range AND experience range
export function combineFilters(
  employees: Employee[],
  filters: {
    department?: string;
    minSalary?: number;
    maxSalary?: number;
    minExperience?: number;
    maxExperience?: number;
  },
): Employee[] {
  let filteredE = [...employees];
  if (filters.department) {
    filteredE = filterByDepartment(filteredE, filters.department);
  }
  if (filters.minSalary && filters.maxSalary) {
    filteredE = filterBySalaryRange(
      filteredE,
      filters.minSalary,
      filters.maxSalary,
    );
  }
  if (filters.minExperience && filters.maxExperience) {
    filteredE = filterByExperienceRange(
      filteredE,
      filters.minExperience,
      filters.maxExperience,
    );
  }
  // Your implementation here
  return filteredE;
}

// TODO Q7: Implement EmployeeTable - display employees in a table with sorting
// Should have clickable column headers to sort
// Should show sort direction (↑/↓)
interface EmployeeTableProps {
  employees: Employee[];
  onSort: (field: keyof Employee) => void;
  sortField: keyof Employee;
  sortOrder: 'asc' | 'desc';
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onSort,
  sortField,
  sortOrder,
}) => {
  // TODO: Render table with columns: Name, Email, Salary, Experience, Department
  // Each header should be clickable and show sort direction

  return (
    <table className='product-table'>
      <thead>
        <tr>
          <th
            onClick={() => {
              onSort('name');
            }}
          >
            Name{' '}
            {sortField === 'name' && (
              <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            )}
          </th>
          <th
            onClick={() => {
              onSort('email');
            }}
          >
            email{' '}
            {sortField === 'email' && (
              <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            )}
          </th>
          <th
            onClick={() => {
              onSort('salary');
            }}
          >
            salary{' '}
            {sortField === 'salary' && (
              <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            )}
          </th>
          <th
            onClick={() => {
              onSort('yearsOfExperience');
            }}
          >
            yearsOfExperience{' '}
            {sortField === 'yearsOfExperience' && (
              <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            )}
          </th>
          <th
            onClick={() => {
              onSort('department');
            }}
          >
            department{' '}
            {sortField === 'department' && (
              <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            )}
          </th>
        </tr>
      </thead>
      <tbody>
        {employees.map((e) => {
          return (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{e.salary}</td>
              <td>{e.yearsOfExperience}</td>
              <td>{e.department}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// TODO Q8: Implement searchEmployees - search by name OR email (case-insensitive)
// Return all employees if query is empty/whitespace
export function searchEmployees(
  employees: Employee[],
  query: string,
): Employee[] {
  const trimedQ = query.trim().toLowerCase();
  return employees.filter(
    (e) =>
      e.name.trim().toLowerCase().includes(trimedQ) ||
      e.email.trim().toLowerCase().includes(trimedQ),
  );
}

// =====================================================================
// INTERVIEW SESSION 2: Validation, Stats & Integration (30 min)
// =====================================================================

export interface EmployeeFormData {
  name: string;
  email: string;
  salary: string; // string because it comes from input
  yearsOfExperience: string; // string because it comes from input
  department: string;
}

// TODO Q9: Implement validateRequired - check if field is not empty
export function validateRequired(value: string): string {
  // Return error message if invalid, empty string if valid
  if (!value.trim()) return 'Required';
  return '';
}

// TODO Q10: Implement validateEmail - check if value is a valid email format
// Must contain exactly one @, non-empty local part, domain with at least one dot
export function validateEmail(value: string): string {
  const testPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const error = validateRequired(value);
  if (error) return error;
  if (!testPattern.test(value)) return 'invalid email';
  // Return error message if invalid, empty string if valid
  return '';
}

// TODO Q11a: Implement validateIsNumber - check if value is a valid number
export function validateIsNumber(value: string): string {
  const error = validateRequired(value);
  if (error) return error;
  if (isNaN(Number(value))) return 'Invalid Number';
  // Return error message if invalid, empty string if valid
  return '';
}

// TODO Q11b: Implement validatePositiveNumber - check if number is positive
export function validatePositiveNumber(value: string): string {
  // Return error message if invalid, empty string if valid
  const error = validateIsNumber(value);
  if (error) return error;
  if (Number(value) <= 0) return 'Must be positive';
  return '';
}

// TODO Q12a: Implement validateInteger - check if value is an integer
export function validateInteger(value: string): string {
  const error = validateRequired(value);
  if (error) return error;
  if (!Number.isInteger(Number(value))) return 'Must be int';
  // Return error message if invalid, empty string if valid
  return '';
}

// TODO Q12b: Implement validateRange - check if number is within min/max
export function validateRange(value: string, min: number, max: number): string {
  // Return error message if invalid, empty string if valid
  const error = validateIsNumber(value);
  if (error) return error;
  if (Number(value) > max) return 'Must be less';
  if (Number(value) < min) return 'Must be mroe';
  return '';
}

// TODO Q13: Implement validateEmployeeForm - validate entire form
// Rules:
// - name: required, min 2 chars
// - email: required, valid email format
// - salary: required, must be number, must be positive, range 30000-300000
// - yearsOfExperience: required, must be integer, range 0-50
// - department: required

export function validateEmployeeForm(
  data: EmployeeFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};

  const nameE =
    validateRequired(data.name) || data.name.trim().length < 2
      ? 'Too small'
      : '';
  if (nameE) errors.name = nameE;

  const emailE = validateRequired(data.email) || validateEmail(data.email);
  if (emailE) errors.email = emailE;

  const salaryE =
    validateRequired(data.salary) ||
    validateIsNumber(data.salary) ||
    validatePositiveNumber(data.salary) ||
    validateRange(data.salary, 30000, 300000);
  if (salaryE) errors.salary = salaryE;

  const yearsOfExperienceE =
    validateRequired(data.yearsOfExperience) ||
    validateInteger(data.yearsOfExperience) ||
    validateRange(data.yearsOfExperience, 0, 50);
  if (yearsOfExperienceE) errors.yearsOfExperience = yearsOfExperienceE;

  const departmentE = validateRequired(data.department);
  if (departmentE) errors.department = departmentE;

  // Your implementation here
  return errors;
}

// TODO Q14: Implement EmployeeForm - controlled form with validation
// Fields: name, email, salary, yearsOfExperience, department
// Show validation errors on submit
// Clear field error when user types in it
interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => void;
  initialData?: Partial<EmployeeFormData>;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    salary: initialData?.salary || '',
    yearsOfExperience: initialData?.yearsOfExperience || '',
    department: initialData?.department || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Validate and submit
  };

  return (
    <form
      className='product-form'
      onSubmit={handleSubmit}
    >
      {/* TODO: Implement form fields with error display */}
      <button type='submit'>Submit</button>
    </form>
  );
};

// TODO Q15: Implement getEmployeeStats - calculate statistics
// Handle empty array (return all zeros)
export function getEmployeeStats(employees: Employee[]): {
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  avgExperience: number;
  totalEmployees: number;
} {
  // Your implementation here
  return {
    minSalary: 0,
    maxSalary: 0,
    avgSalary: 0,
    avgExperience: 0,
    totalEmployees: 0,
  };
}

const parseNumberInput = (value: string, defaultValue: number = 0): number => {
  const errors = validateIsNumber(value);
  if (errors) return defaultValue;
  return Number(value);
};

// TODO Q16: Implement the complete EmployeeDirectory component
// Should integrate all features:
// - Display employees in sortable table
// - Add employees with validated form
// - Search by name or email
// - Filter by department (dropdown)
// - Filter by salary range (min/max inputs)
// - Filter by experience range (min/max inputs)
// - Show employee statistics
// - Toggle sort order for each column

interface FilterState {
  search: string;
  department: string;
  minSalary: string;
  maxSalary: string;
  minExperience: string;
  maxExperience: string;
}

export const EmployeeDirectoryApp: React.FC = () => {
  // Sample data
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@company.com',
      salary: 95000,
      yearsOfExperience: 8,
      department: 'Engineering',
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@company.com',
      salary: 72000,
      yearsOfExperience: 3,
      department: 'Marketing',
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol@company.com',
      salary: 110000,
      yearsOfExperience: 12,
      department: 'Engineering',
    },
    {
      id: 4,
      name: 'Dan Wilson',
      email: 'dan@company.com',
      salary: 65000,
      yearsOfExperience: 1,
      department: 'Sales',
    },
    {
      id: 5,
      name: 'Eve Martinez',
      email: 'eve@company.com',
      salary: 88000,
      yearsOfExperience: 5,
      department: 'Engineering',
    },
    {
      id: 6,
      name: 'Frank Brown',
      email: 'frank@company.com',
      salary: 78000,
      yearsOfExperience: 4,
      department: 'Marketing',
    },
    {
      id: 7,
      name: 'Grace Lee',
      email: 'grace@company.com',
      salary: 105000,
      yearsOfExperience: 10,
      department: 'Sales',
    },
    {
      id: 8,
      name: 'Henry Taylor',
      email: 'henry@company.com',
      salary: 55000,
      yearsOfExperience: 0,
      department: 'Intern',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState<keyof Employee>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    department: '',
    minSalary: '',
    maxSalary: '',
    minExperience: '',
    maxExperience: '',
  });

  // TODO: Implement handleSort - toggle sort order if same field, default to asc
  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortOrder('asc');
      setSortField(field);
    }
  };

  const handleUpdateFilters = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // TODO: Implement handleAddEmployee - convert form data to Employee and add to list
  const handleAddEmployee = (data: EmployeeFormData) => {
    // Your implementation here
  };

  // TODO: Implement getFilteredAndSortedEmployees - apply all filters, search, and sorting
  const getFilteredAndSortedEmployees = (): Employee[] => {
    // Your implementation here
    let filteredAndSearchEmployees = [...employees];
    filteredAndSearchEmployees = searchEmployees(
      filteredAndSearchEmployees,
      filters.search,
    );
    filteredAndSearchEmployees = combineFilters(filteredAndSearchEmployees, {
      department: filters.department,
      minSalary: parseNumberInput(filters.minSalary),
      maxSalary: parseNumberInput(filters.maxSalary),
      minExperience: parseNumberInput(filters.minExperience),
      maxExperience: parseNumberInput(filters.maxExperience),
    });

    return filteredAndSearchEmployees;
  };

  const stats = getEmployeeStats(getFilteredAndSortedEmployees());
  const departments = Array.from(new Set(employees.map((e) => e.department)));

  return (
    <div className='product-manager'>
      <header>
        <h1>Employee Directory</h1>
        <button onClick={() => setShowForm(true)}>+ Add Employee</button>
      </header>

      {/* TODO: Search and Filters */}
      <div className='filters'>
        <div>
          <input
            name='search'
            id='search'
            value={filters.search}
            onChange={(e) => handleUpdateFilters(e)}
          />
        </div>
        {/* TODO: Search input */}
        {/* TODO: Department dropdown */}
        {/* TODO: Salary range inputs */}
        <div>
          <label htmlFor='minSalary'>Min Salary</label>
          <input
            name='minSalary'
            id='minSalary'
            value={filters.minSalary}
            onChange={(e) => {
              handleUpdateFilters(e);
            }}
          />
          <label htmlFor='maxSalary'>Max Salary</label>
          <input
            name='maxSalary'
            id='maxSalary'
            value={filters.maxSalary}
            onChange={(e) => {
              handleUpdateFilters(e);
            }}
          />
        </div>
        {/* TODO: Experience range inputs */}
      </div>

      {/* TODO: Stats */}
      <div className='stats'>
        {/* TODO: Show employee count, salary range, avg salary, avg experience */}
      </div>

      {/* TODO: Employee Table */}
      <EmployeeTable
        employees={getFilteredAndSortedEmployees()}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      {/* TODO: Form Modal */}
      {showForm && (
        <div className='modal-overlay'>
          <div className='modal'>
            <button
              className='close-btn'
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
            <EmployeeForm onSubmit={handleAddEmployee} />
          </div>
        </div>
      )}
    </div>
  );
};

export const EmployeeDirectory: React.FC = () => {
  return <EmployeeDirectoryApp />;
};
