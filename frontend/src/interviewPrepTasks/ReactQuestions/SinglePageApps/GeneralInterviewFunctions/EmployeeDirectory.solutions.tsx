import './GeneralInterviewFunctions.css';

import React, { useState } from 'react';

// =====================================================================
// INTERVIEW SESSION 1: Sorting, Filtering & Display (30 min)
// =====================================================================

// Q1: Employee interface
export interface Employee {
  id: number;
  name: string;
  email: string;
  salary: number;
  yearsOfExperience: number;
  department: string;
}

// Q2: sortEmployees
export function sortEmployees(
  employees: Employee[],
  field: keyof Employee,
  order: 'asc' | 'desc' = 'asc',
): Employee[] {
  return [...employees].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

// Q3: filterByDepartment
export function filterByDepartment(
  employees: Employee[],
  department: string,
): Employee[] {
  if (department === '') return [...employees];
  return employees.filter((e) => e.department === department);
}

// Q4: filterBySalaryRange
export function filterBySalaryRange(
  employees: Employee[],
  min: number,
  max: number,
): Employee[] {
  return employees.filter((e) => e.salary >= min && e.salary <= max);
}

// Q5: filterByExperienceRange
export function filterByExperienceRange(
  employees: Employee[],
  min: number,
  max: number,
): Employee[] {
  return employees.filter(
    (e) => e.yearsOfExperience >= min && e.yearsOfExperience <= max,
  );
}

// Q6: combineFilters
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
  let result = [...employees];

  if (filters.department) {
    result = filterByDepartment(result, filters.department);
  }
  if (
    filters.minSalary !== undefined &&
    filters.maxSalary !== undefined
  ) {
    result = filterBySalaryRange(result, filters.minSalary, filters.maxSalary);
  }
  if (
    filters.minExperience !== undefined &&
    filters.maxExperience !== undefined
  ) {
    result = filterByExperienceRange(
      result,
      filters.minExperience,
      filters.maxExperience,
    );
  }

  return result;
}

// Q7: EmployeeTable component
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
  const indicator = (field: keyof Employee) =>
    sortField === field ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <table className='product-table'>
      <thead>
        <tr>
          <th onClick={() => onSort('name')}>Name{indicator('name')}</th>
          <th onClick={() => onSort('email')}>Email{indicator('email')}</th>
          <th onClick={() => onSort('salary')}>Salary{indicator('salary')}</th>
          <th onClick={() => onSort('yearsOfExperience')}>
            Experience{indicator('yearsOfExperience')}
          </th>
          <th onClick={() => onSort('department')}>
            Department{indicator('department')}
          </th>
        </tr>
      </thead>
      <tbody>
        {employees.map((e) => (
          <tr key={e.id}>
            <td>{e.name}</td>
            <td>{e.email}</td>
            <td>{e.salary}</td>
            <td>{e.yearsOfExperience}</td>
            <td>{e.department}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Q8: searchEmployees
export function searchEmployees(
  employees: Employee[],
  query: string,
): Employee[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [...employees];
  return employees.filter(
    (e) =>
      e.name.toLowerCase().includes(trimmed) ||
      e.email.toLowerCase().includes(trimmed),
  );
}

// =====================================================================
// INTERVIEW SESSION 2: Validation, Stats & Integration (30 min)
// =====================================================================

export interface EmployeeFormData {
  name: string;
  email: string;
  salary: string;
  yearsOfExperience: string;
  department: string;
}

// Q9: validateRequired
export function validateRequired(value: string): string {
  if (!value.trim()) return 'Required';
  return '';
}

// Q10: validateEmail
export function validateEmail(value: string): string {
  const error = validateRequired(value);
  if (error) return error;

  const parts = value.split('@');
  if (parts.length !== 2) return 'Invalid email format';
  const [local, domain] = parts;
  if (!local) return 'Invalid email format';
  if (!domain || !domain.includes('.')) return 'Invalid email format';
  return '';
}

// Q11a: validateIsNumber
export function validateIsNumber(value: string): string {
  const error = validateRequired(value);
  if (error) return error;
  if (isNaN(Number(value))) return 'Must be a number';
  return '';
}

// Q11b: validatePositiveNumber
export function validatePositiveNumber(value: string): string {
  const error = validateIsNumber(value);
  if (error) return error;
  if (Number(value) <= 0) return 'Must be positive';
  return '';
}

// Q12a: validateInteger
export function validateInteger(value: string): string {
  const error = validateIsNumber(value);
  if (error) return error;
  if (!Number.isInteger(Number(value))) return 'Must be integer';
  return '';
}

// Q12b: validateRange
export function validateRange(
  value: string,
  min: number,
  max: number,
): string {
  const error = validateIsNumber(value);
  if (error) return error;
  const num = Number(value);
  if (num < min) return `Must be at least ${min}`;
  if (num > max) return `Must be at most ${max}`;
  return '';
}

// Q13: validateEmployeeForm
export function validateEmployeeForm(
  data: EmployeeFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};

  const nameRequired = validateRequired(data.name);
  if (nameRequired) {
    errors.name = nameRequired;
  } else if (data.name.trim().length < 2) {
    errors.name = 'Must be at least 2 characters';
  }

  const emailRequired = validateRequired(data.email);
  if (emailRequired) {
    errors.email = emailRequired;
  } else {
    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;
  }

  const salaryError =
    validatePositiveNumber(data.salary) ||
    validateRange(data.salary, 30000, 300000);
  if (salaryError) errors.salary = salaryError;

  const expError =
    validateInteger(data.yearsOfExperience) ||
    validateRange(data.yearsOfExperience, 0, 50);
  if (expError) errors.yearsOfExperience = expError;

  const deptError = validateRequired(data.department);
  if (deptError) errors.department = deptError;

  return errors;
}

// Q14: EmployeeForm component
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
    const validationErrors = validateEmployeeForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form className='product-form' onSubmit={handleSubmit}>
      <div>
        <label htmlFor='name'>Name</label>
        <input
          id='name'
          name='name'
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        {errors.name && <span className='error'>{errors.name}</span>}
      </div>
      <div>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          name='email'
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        {errors.email && <span className='error'>{errors.email}</span>}
      </div>
      <div>
        <label htmlFor='salary'>Salary</label>
        <input
          id='salary'
          name='salary'
          type='number'
          value={formData.salary}
          onChange={(e) => handleChange('salary', e.target.value)}
        />
        {errors.salary && <span className='error'>{errors.salary}</span>}
      </div>
      <div>
        <label htmlFor='yearsOfExperience'>Experience</label>
        <input
          id='yearsOfExperience'
          name='yearsOfExperience'
          type='number'
          value={formData.yearsOfExperience}
          onChange={(e) => handleChange('yearsOfExperience', e.target.value)}
        />
        {errors.yearsOfExperience && (
          <span className='error'>{errors.yearsOfExperience}</span>
        )}
      </div>
      <div>
        <label htmlFor='department'>Department</label>
        <input
          id='department'
          name='department'
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
        />
        {errors.department && (
          <span className='error'>{errors.department}</span>
        )}
      </div>
      <button type='submit'>Submit</button>
    </form>
  );
};

// Q15: getEmployeeStats
export function getEmployeeStats(employees: Employee[]): {
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  avgExperience: number;
  totalEmployees: number;
} {
  if (employees.length === 0) {
    return {
      minSalary: 0,
      maxSalary: 0,
      avgSalary: 0,
      avgExperience: 0,
      totalEmployees: 0,
    };
  }

  const stats = employees.reduce(
    (acc, e) => {
      acc.minSalary = Math.min(acc.minSalary, e.salary);
      acc.maxSalary = Math.max(acc.maxSalary, e.salary);
      acc.totalSalary += e.salary;
      acc.totalExperience += e.yearsOfExperience;
      return acc;
    },
    {
      minSalary: Infinity,
      maxSalary: -Infinity,
      totalSalary: 0,
      totalExperience: 0,
    },
  );

  return {
    minSalary: stats.minSalary,
    maxSalary: stats.maxSalary,
    avgSalary: stats.totalSalary / employees.length,
    avgExperience: stats.totalExperience / employees.length,
    totalEmployees: employees.length,
  };
}

// Q16: EmployeeDirectory component
interface FilterState {
  search: string;
  department: string;
  minSalary: string;
  maxSalary: string;
  minExperience: string;
  maxExperience: string;
}

const parseNumberInput = (value: string, defaultValue: number = 0): number => {
  if (!value.trim() || isNaN(Number(value))) return defaultValue;
  return Number(value);
};

export const EmployeeDirectoryApp: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@company.com', salary: 95000, yearsOfExperience: 8, department: 'Engineering' },
    { id: 2, name: 'Bob Smith', email: 'bob@company.com', salary: 72000, yearsOfExperience: 3, department: 'Marketing' },
    { id: 3, name: 'Carol Davis', email: 'carol@company.com', salary: 110000, yearsOfExperience: 12, department: 'Engineering' },
    { id: 4, name: 'Dan Wilson', email: 'dan@company.com', salary: 65000, yearsOfExperience: 1, department: 'Sales' },
    { id: 5, name: 'Eve Martinez', email: 'eve@company.com', salary: 88000, yearsOfExperience: 5, department: 'Engineering' },
    { id: 6, name: 'Frank Brown', email: 'frank@company.com', salary: 78000, yearsOfExperience: 4, department: 'Marketing' },
    { id: 7, name: 'Grace Lee', email: 'grace@company.com', salary: 105000, yearsOfExperience: 10, department: 'Sales' },
    { id: 8, name: 'Henry Taylor', email: 'henry@company.com', salary: 55000, yearsOfExperience: 0, department: 'Intern' },
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

  const handleSort = (field: keyof Employee) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAddEmployee = (data: EmployeeFormData) => {
    const newEmployee: Employee = {
      id:
        employees.reduce(
          (acc, e) => ({ maxId: Math.max(acc.maxId, e.id) }),
          { maxId: -Infinity },
        ).maxId + 1,
      name: data.name,
      email: data.email,
      salary: parseNumberInput(data.salary),
      yearsOfExperience: parseNumberInput(data.yearsOfExperience),
      department: data.department,
    };
    setEmployees((prev) => [newEmployee, ...prev]);
    setShowForm(false);
  };

  const getFilteredAndSortedEmployees = (): Employee[] => {
    let result = [...employees];

    result = searchEmployees(result, filters.search);

    result = combineFilters(result, {
      department: filters.department,
      minSalary: filters.minSalary
        ? parseNumberInput(filters.minSalary)
        : undefined,
      maxSalary: filters.maxSalary
        ? parseNumberInput(filters.maxSalary)
        : undefined,
      minExperience: filters.minExperience
        ? parseNumberInput(filters.minExperience)
        : undefined,
      maxExperience: filters.maxExperience
        ? parseNumberInput(filters.maxExperience)
        : undefined,
    });

    result = sortEmployees(result, sortField, sortOrder);

    return result;
  };

  const stats = getEmployeeStats(getFilteredAndSortedEmployees());
  const departments = Array.from(new Set(employees.map((e) => e.department)));

  return (
    <div className='product-manager'>
      <header>
        <h1>Employee Directory</h1>
        <button onClick={() => setShowForm(true)}>+ Add Employee</button>
      </header>

      <div className='filters'>
        <input
          type='text'
          placeholder='Search by name or email...'
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />

        <select
          value={filters.department}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, department: e.target.value }))
          }
        >
          <option value=''>All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <div className='range-filter'>
          <label>Salary:</label>
          <input
            type='number'
            placeholder='Min'
            value={filters.minSalary}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minSalary: e.target.value }))
            }
          />
          <input
            type='number'
            placeholder='Max'
            value={filters.maxSalary}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxSalary: e.target.value }))
            }
          />
        </div>

        <div className='range-filter'>
          <label>Experience:</label>
          <input
            type='number'
            placeholder='Min'
            value={filters.minExperience}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                minExperience: e.target.value,
              }))
            }
          />
          <input
            type='number'
            placeholder='Max'
            value={filters.maxExperience}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                maxExperience: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className='stats'>
        <span>Employees: {stats.totalEmployees}</span>
        <span>
          Salary: ${stats.minSalary.toLocaleString()} - $
          {stats.maxSalary.toLocaleString()}
        </span>
        <span>Avg Salary: ${stats.avgSalary.toFixed(0)}</span>
        <span>Avg Experience: {stats.avgExperience.toFixed(1)} yrs</span>
      </div>

      <EmployeeTable
        employees={getFilteredAndSortedEmployees()}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      />

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

export const EmployeeDirectorySolutions: React.FC = () => {
  return <EmployeeDirectoryApp />;
};
