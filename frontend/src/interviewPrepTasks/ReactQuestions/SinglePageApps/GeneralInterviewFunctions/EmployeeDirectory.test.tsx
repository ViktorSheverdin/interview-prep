import { fireEvent, render, screen } from '@testing-library/react';

import {
  combineFilters,
  Employee,
  EmployeeForm,
  EmployeeTable,
  filterByDepartment,
  filterByExperienceRange,
  filterBySalaryRange,
  getEmployeeStats,
  searchEmployees,
  sortEmployees,
  validateEmail,
  validateEmployeeForm,
  validateInteger,
  validateIsNumber,
  validatePositiveNumber,
  validateRange,
  validateRequired,
} from './EmployeeDirectory';

const mockEmployees: Employee[] = [
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
];

const validForm = {
  name: 'John Doe',
  email: 'john@example.com',
  salary: '75000',
  yearsOfExperience: '5',
  department: 'Engineering',
};

// =====================================================================
// SESSION 1: Sorting, Filtering & Display
// =====================================================================

describe.only('Q2: sortEmployees', () => {
  it('should sort by salary ascending', () => {
    const result = sortEmployees(mockEmployees, 'salary', 'asc');
    expect(result[0].salary).toBe(55000);
    expect(result[result.length - 1].salary).toBe(110000);
  });

  it('should sort by salary descending', () => {
    const result = sortEmployees(mockEmployees, 'salary', 'desc');
    expect(result[0].salary).toBe(110000);
    expect(result[result.length - 1].salary).toBe(55000);
  });

  it('should sort by name ascending', () => {
    const result = sortEmployees(mockEmployees, 'name', 'asc');
    expect(result[0].name).toBe('Alice Johnson');
    expect(result[result.length - 1].name).toBe('Henry Taylor');
  });

  it('should sort by yearsOfExperience descending', () => {
    const result = sortEmployees(mockEmployees, 'yearsOfExperience', 'desc');
    expect(result[0].yearsOfExperience).toBe(12);
    expect(result[result.length - 1].yearsOfExperience).toBe(0);
  });

  it('should not mutate the original array', () => {
    const original = [...mockEmployees];
    sortEmployees(mockEmployees, 'salary', 'asc');
    expect(mockEmployees).toEqual(original);
  });

  it('should handle empty array', () => {
    const result = sortEmployees([], 'name', 'asc');
    expect(result).toEqual([]);
  });

  it('should handle single item', () => {
    const result = sortEmployees([mockEmployees[0]], 'name', 'asc');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice Johnson');
  });

  it('should default to ascending order', () => {
    const result = sortEmployees(mockEmployees, 'salary');
    expect(result[0].salary).toBe(55000);
  });
});

describe.only('Q3: filterByDepartment', () => {
  it('should filter by Engineering department', () => {
    const result = filterByDepartment(mockEmployees, 'Engineering');
    expect(result).toHaveLength(3);
    result.forEach((e) => expect(e.department).toBe('Engineering'));
  });

  it('should filter by Marketing department', () => {
    const result = filterByDepartment(mockEmployees, 'Marketing');
    expect(result).toHaveLength(2);
  });

  it('should return empty for non-existent department', () => {
    const result = filterByDepartment(mockEmployees, 'HR');
    expect(result).toHaveLength(0);
  });

  it('should be case-sensitive', () => {
    const result = filterByDepartment(mockEmployees, 'engineering');
    expect(result).toHaveLength(0);
  });

  it('should return all employees for empty string', () => {
    const result = filterByDepartment(mockEmployees, '');
    expect(result).toHaveLength(mockEmployees.length);
  });

  it('should handle empty array', () => {
    const result = filterByDepartment([], 'Engineering');
    expect(result).toEqual([]);
  });
});

describe.only('Q4: filterBySalaryRange', () => {
  it('should filter within salary range', () => {
    const result = filterBySalaryRange(mockEmployees, 70000, 100000);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((e) => {
      expect(e.salary).toBeGreaterThanOrEqual(70000);
      expect(e.salary).toBeLessThanOrEqual(100000);
    });
  });

  it('should include employees at exact min salary', () => {
    const result = filterBySalaryRange(mockEmployees, 55000, 60000);
    expect(result.some((e) => e.salary === 55000)).toBe(true);
  });

  it('should include employees at exact max salary', () => {
    const result = filterBySalaryRange(mockEmployees, 100000, 110000);
    expect(result.some((e) => e.salary === 110000)).toBe(true);
  });

  it('should handle min === max', () => {
    const result = filterBySalaryRange(mockEmployees, 95000, 95000);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice Johnson');
  });

  it('should return empty when min > max', () => {
    const result = filterBySalaryRange(mockEmployees, 100000, 50000);
    expect(result).toHaveLength(0);
  });

  it('should handle very large range', () => {
    const result = filterBySalaryRange(mockEmployees, 0, 1000000);
    expect(result).toHaveLength(mockEmployees.length);
  });

  it('should handle empty array', () => {
    const result = filterBySalaryRange([], 50000, 100000);
    expect(result).toEqual([]);
  });
});

describe.only('Q5: filterByExperienceRange', () => {
  it('should filter within experience range', () => {
    const result = filterByExperienceRange(mockEmployees, 3, 8);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((e) => {
      expect(e.yearsOfExperience).toBeGreaterThanOrEqual(3);
      expect(e.yearsOfExperience).toBeLessThanOrEqual(8);
    });
  });

  it('should include employees at exact boundaries', () => {
    const result = filterByExperienceRange(mockEmployees, 0, 12);
    expect(result).toHaveLength(mockEmployees.length);
  });

  it('should handle zero minimum (catch the intern)', () => {
    const result = filterByExperienceRange(mockEmployees, 0, 1);
    expect(result.some((e) => e.yearsOfExperience === 0)).toBe(true);
    expect(result.some((e) => e.yearsOfExperience === 1)).toBe(true);
  });

  it('should return empty when min > max', () => {
    const result = filterByExperienceRange(mockEmployees, 10, 5);
    expect(result).toHaveLength(0);
  });
});

describe.only('Q6: combineFilters', () => {
  it('should apply department filter only', () => {
    const result = combineFilters(mockEmployees, { department: 'Engineering' });
    expect(result).toHaveLength(3);
  });

  it('should apply salary range filter only', () => {
    const result = combineFilters(mockEmployees, {
      minSalary: 80000,
      maxSalary: 120000,
    });
    result.forEach((e) => {
      expect(e.salary).toBeGreaterThanOrEqual(80000);
      expect(e.salary).toBeLessThanOrEqual(120000);
    });
  });

  it('should apply experience range filter only', () => {
    const result = combineFilters(mockEmployees, {
      minExperience: 5,
      maxExperience: 10,
    });
    result.forEach((e) => {
      expect(e.yearsOfExperience).toBeGreaterThanOrEqual(5);
      expect(e.yearsOfExperience).toBeLessThanOrEqual(10);
    });
  });

  it('should combine department and salary filters', () => {
    const result = combineFilters(mockEmployees, {
      department: 'Engineering',
      minSalary: 90000,
      maxSalary: 120000,
    });
    result.forEach((e) => {
      expect(e.department).toBe('Engineering');
      expect(e.salary).toBeGreaterThanOrEqual(90000);
    });
  });

  it('should combine all three filters', () => {
    const result = combineFilters(mockEmployees, {
      department: 'Engineering',
      minSalary: 80000,
      maxSalary: 120000,
      minExperience: 5,
      maxExperience: 10,
    });
    // Alice (95k, 8yr) and Eve (88k, 5yr) match; Carol (110k, 12yr) is out of experience range
    expect(result).toHaveLength(2);
  });

  it('should return all employees when no filters provided', () => {
    const result = combineFilters(mockEmployees, {});
    expect(result).toHaveLength(mockEmployees.length);
  });

  it('should return empty when filters match nothing', () => {
    const result = combineFilters(mockEmployees, {
      department: 'Engineering',
      minSalary: 200000,
      maxSalary: 300000,
    });
    expect(result).toHaveLength(0);
  });

  it('should handle undefined filter values', () => {
    const result = combineFilters(mockEmployees, {
      department: undefined,
      minSalary: undefined,
      maxSalary: undefined,
    });
    expect(result).toHaveLength(mockEmployees.length);
  });
});

describe.only('Q8: searchEmployees', () => {
  it('should find by exact name', () => {
    const result = searchEmployees(mockEmployees, 'Alice Johnson');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice Johnson');
  });

  it('should be case-insensitive for name', () => {
    const result = searchEmployees(mockEmployees, 'alice');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice Johnson');
  });

  it('should find by partial name match', () => {
    const result = searchEmployees(mockEmployees, 'son');
    // Alice Johnson, Dan Wilson
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it('should find by email match', () => {
    const result = searchEmployees(mockEmployees, 'bob@company.com');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Bob Smith');
  });

  it('should find by partial email match', () => {
    const result = searchEmployees(mockEmployees, 'alice@');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice Johnson');
  });

  it('should return multiple matches', () => {
    // "an" matches Dan, Frank by name
    const result = searchEmployees(mockEmployees, 'an');
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it('should return empty for no matches', () => {
    const result = searchEmployees(mockEmployees, 'zzz');
    expect(result).toHaveLength(0);
  });

  it('should return all for empty query', () => {
    const result = searchEmployees(mockEmployees, '');
    expect(result).toHaveLength(mockEmployees.length);
  });

  it('should return all for whitespace-only query', () => {
    const result = searchEmployees(mockEmployees, '   ');
    expect(result).toHaveLength(mockEmployees.length);
  });
});

// =====================================================================
// SESSION 2: Validation, Stats & Integration
// =====================================================================

describe.only('Q9: validateRequired', () => {
  it('should accept non-empty value', () => {
    expect(validateRequired('hello')).toBe('');
  });

  it('should reject empty string', () => {
    expect(validateRequired('')).toBeTruthy();
  });

  it('should reject whitespace only', () => {
    expect(validateRequired('   ')).toBeTruthy();
  });

  it('should accept value with leading/trailing spaces', () => {
    expect(validateRequired('  hello  ')).toBe('');
  });
});

describe.only('Q10: validateEmail', () => {
  it('should accept valid email', () => {
    expect(validateEmail('user@example.com')).toBe('');
  });

  it('should accept email with subdomains', () => {
    expect(validateEmail('user@mail.example.com')).toBe('');
  });

  it('should reject missing @ sign', () => {
    expect(validateEmail('userexample.com')).toBeTruthy();
  });

  it('should reject multiple @ signs', () => {
    expect(validateEmail('user@@example.com')).toBeTruthy();
  });

  it('should reject empty local part', () => {
    expect(validateEmail('@example.com')).toBeTruthy();
  });

  it('should reject missing domain', () => {
    expect(validateEmail('user@')).toBeTruthy();
  });

  it('should reject domain without dot', () => {
    expect(validateEmail('user@example')).toBeTruthy();
  });

  it('should reject empty string', () => {
    expect(validateEmail('')).toBeTruthy();
  });
});

describe.only('Q11a: validateIsNumber', () => {
  it('should accept valid integers', () => {
    expect(validateIsNumber('42')).toBe('');
  });

  it('should accept valid decimals', () => {
    expect(validateIsNumber('3.14')).toBe('');
  });

  it('should accept negative numbers', () => {
    expect(validateIsNumber('-5')).toBe('');
  });

  it('should reject non-numeric strings', () => {
    expect(validateIsNumber('abc')).toBeTruthy();
  });

  it('should reject empty string', () => {
    expect(validateIsNumber('')).toBeTruthy();
  });

  it('should reject NaN', () => {
    expect(validateIsNumber('NaN')).toBeTruthy();
  });
});

describe.only('Q11b: validatePositiveNumber', () => {
  it('should accept positive integers', () => {
    expect(validatePositiveNumber('5')).toBe('');
  });

  it('should accept positive decimals', () => {
    expect(validatePositiveNumber('3.14')).toBe('');
  });

  it('should reject zero', () => {
    expect(validatePositiveNumber('0')).toBeTruthy();
  });

  it('should reject negative numbers', () => {
    expect(validatePositiveNumber('-5')).toBeTruthy();
  });

  it('should reject non-numeric', () => {
    expect(validatePositiveNumber('abc')).toBeTruthy();
  });
});

describe.only('Q12a: validateInteger', () => {
  it('should accept integers', () => {
    expect(validateInteger('42')).toBe('');
  });

  it('should accept zero', () => {
    expect(validateInteger('0')).toBe('');
  });

  it('should accept negative integers', () => {
    expect(validateInteger('-5')).toBe('');
  });

  it('should reject decimals', () => {
    expect(validateInteger('3.14')).toBeTruthy();
  });

  it('should reject non-numeric', () => {
    expect(validateInteger('abc')).toBeTruthy();
  });
});

describe.only('Q12b: validateRange', () => {
  it('should accept value within range', () => {
    expect(validateRange('50', 0, 100)).toBe('');
  });

  it('should accept value at min boundary', () => {
    expect(validateRange('0', 0, 100)).toBe('');
  });

  it('should accept value at max boundary', () => {
    expect(validateRange('100', 0, 100)).toBe('');
  });

  it('should reject value below min', () => {
    expect(validateRange('-1', 0, 100)).toBeTruthy();
  });

  it('should reject value above max', () => {
    expect(validateRange('101', 0, 100)).toBeTruthy();
  });

  it('should reject non-numeric value', () => {
    expect(validateRange('abc', 0, 100)).toBeTruthy();
  });

  it('should handle negative ranges', () => {
    expect(validateRange('-5', -10, 0)).toBe('');
  });
});

describe.only('Q13: validateEmployeeForm', () => {
  it('should return no errors for valid form', () => {
    const errors = validateEmployeeForm(validForm);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  describe('name validation', () => {
    it('should require name', () => {
      const errors = validateEmployeeForm({ ...validForm, name: '' });
      expect(errors.name).toBeTruthy();
    });

    it('should reject name shorter than 2 chars', () => {
      const errors = validateEmployeeForm({ ...validForm, name: 'A' });
      expect(errors.name).toBeTruthy();
    });

    it('should accept name with exactly 2 chars', () => {
      const errors = validateEmployeeForm({ ...validForm, name: 'Jo' });
      expect(errors.name).toBeFalsy();
    });

    it('should reject whitespace-only name', () => {
      const errors = validateEmployeeForm({ ...validForm, name: '   ' });
      expect(errors.name).toBeTruthy();
    });
  });

  describe('email validation', () => {
    it('should require email', () => {
      const errors = validateEmployeeForm({ ...validForm, email: '' });
      expect(errors.email).toBeTruthy();
    });

    it('should reject invalid email format', () => {
      const errors = validateEmployeeForm({
        ...validForm,
        email: 'notanemail',
      });
      expect(errors.email).toBeTruthy();
    });

    it('should accept valid email', () => {
      const errors = validateEmployeeForm({
        ...validForm,
        email: 'test@test.com',
      });
      expect(errors.email).toBeFalsy();
    });
  });

  describe('salary validation', () => {
    it('should require salary', () => {
      const errors = validateEmployeeForm({ ...validForm, salary: '' });
      expect(errors.salary).toBeTruthy();
    });

    it('should reject non-numeric salary', () => {
      const errors = validateEmployeeForm({ ...validForm, salary: 'abc' });
      expect(errors.salary).toBeTruthy();
    });

    it('should reject negative salary', () => {
      const errors = validateEmployeeForm({ ...validForm, salary: '-1000' });
      expect(errors.salary).toBeTruthy();
    });

    it('should reject salary below 30000', () => {
      const errors = validateEmployeeForm({ ...validForm, salary: '29999' });
      expect(errors.salary).toBeTruthy();
    });

    it('should reject salary above 300000', () => {
      const errors = validateEmployeeForm({ ...validForm, salary: '300001' });
      expect(errors.salary).toBeTruthy();
    });

    it('should accept salary at min boundary 30000', () => {
      const errors = validateEmployeeForm({ ...validForm, salary: '30000' });
      expect(errors.salary).toBeFalsy();
    });

    it('should accept salary at max boundary 300000', () => {
      const errors = validateEmployeeForm({ ...validForm, salary: '300000' });
      expect(errors.salary).toBeFalsy();
    });

    it('should accept decimal salary', () => {
      const errors = validateEmployeeForm({ ...validForm, salary: '75000.50' });
      expect(errors.salary).toBeFalsy();
    });
  });

  describe('yearsOfExperience validation', () => {
    it('should require yearsOfExperience', () => {
      const errors = validateEmployeeForm({
        ...validForm,
        yearsOfExperience: '',
      });
      expect(errors.yearsOfExperience).toBeTruthy();
    });

    it('should reject decimal experience', () => {
      const errors = validateEmployeeForm({
        ...validForm,
        yearsOfExperience: '3.5',
      });
      expect(errors.yearsOfExperience).toBeTruthy();
    });

    it('should reject negative experience', () => {
      const errors = validateEmployeeForm({
        ...validForm,
        yearsOfExperience: '-1',
      });
      expect(errors.yearsOfExperience).toBeTruthy();
    });

    it('should accept zero experience (intern)', () => {
      const errors = validateEmployeeForm({
        ...validForm,
        yearsOfExperience: '0',
      });
      expect(errors.yearsOfExperience).toBeFalsy();
    });

    it('should accept exactly 50 years', () => {
      const errors = validateEmployeeForm({
        ...validForm,
        yearsOfExperience: '50',
      });
      expect(errors.yearsOfExperience).toBeFalsy();
    });

    it('should reject more than 50 years', () => {
      const errors = validateEmployeeForm({
        ...validForm,
        yearsOfExperience: '51',
      });
      expect(errors.yearsOfExperience).toBeTruthy();
    });
  });

  describe('department validation', () => {
    it('should require department', () => {
      const errors = validateEmployeeForm({ ...validForm, department: '' });
      expect(errors.department).toBeTruthy();
    });

    it('should reject whitespace-only department', () => {
      const errors = validateEmployeeForm({ ...validForm, department: '   ' });
      expect(errors.department).toBeTruthy();
    });

    it('should accept valid department', () => {
      const errors = validateEmployeeForm({
        ...validForm,
        department: 'Sales',
      });
      expect(errors.department).toBeFalsy();
    });
  });

  it('should return multiple errors for multiple invalid fields', () => {
    const errors = validateEmployeeForm({
      name: '',
      email: '',
      salary: '',
      yearsOfExperience: '',
      department: '',
    });
    expect(Object.keys(errors).length).toBeGreaterThanOrEqual(5);
  });
});

describe('Q15: getEmployeeStats', () => {
  it('should calculate correct minSalary', () => {
    const stats = getEmployeeStats(mockEmployees);
    expect(stats.minSalary).toBe(55000);
  });

  it('should calculate correct maxSalary', () => {
    const stats = getEmployeeStats(mockEmployees);
    expect(stats.maxSalary).toBe(110000);
  });

  it('should calculate correct avgSalary', () => {
    const stats = getEmployeeStats(mockEmployees);
    const expectedAvg =
      (95000 + 72000 + 110000 + 65000 + 88000 + 78000 + 105000 + 55000) / 8;
    expect(stats.avgSalary).toBeCloseTo(expectedAvg);
  });

  it('should calculate correct avgExperience', () => {
    const stats = getEmployeeStats(mockEmployees);
    const expectedAvg = (8 + 3 + 12 + 1 + 5 + 4 + 10 + 0) / 8;
    expect(stats.avgExperience).toBeCloseTo(expectedAvg);
  });

  it('should calculate correct totalEmployees', () => {
    const stats = getEmployeeStats(mockEmployees);
    expect(stats.totalEmployees).toBe(8);
  });

  it('should handle empty array', () => {
    const stats = getEmployeeStats([]);
    expect(stats.minSalary).toBe(0);
    expect(stats.maxSalary).toBe(0);
    expect(stats.avgSalary).toBe(0);
    expect(stats.avgExperience).toBe(0);
    expect(stats.totalEmployees).toBe(0);
  });

  it('should handle single employee', () => {
    const stats = getEmployeeStats([mockEmployees[0]]);
    expect(stats.minSalary).toBe(95000);
    expect(stats.maxSalary).toBe(95000);
    expect(stats.avgSalary).toBe(95000);
    expect(stats.totalEmployees).toBe(1);
  });

  it('should handle employees with same salary', () => {
    const sameSalary: Employee[] = [
      { ...mockEmployees[0], salary: 80000 },
      { ...mockEmployees[1], salary: 80000 },
    ];
    const stats = getEmployeeStats(sameSalary);
    expect(stats.minSalary).toBe(80000);
    expect(stats.maxSalary).toBe(80000);
    expect(stats.avgSalary).toBe(80000);
  });
});

// =====================================================================
// Integration Tests
// =====================================================================

describe('Integration', () => {
  it('should filter, sort, and calculate stats correctly', () => {
    const filtered = filterByDepartment(mockEmployees, 'Engineering');
    const sorted = sortEmployees(filtered, 'salary', 'desc');
    const stats = getEmployeeStats(sorted);

    expect(sorted[0].name).toBe('Carol Davis');
    expect(stats.totalEmployees).toBe(3);
    expect(stats.maxSalary).toBe(110000);
  });

  it('should combine filters and search', () => {
    const filtered = combineFilters(mockEmployees, {
      department: 'Engineering',
      minSalary: 80000,
      maxSalary: 120000,
    });
    const searched = searchEmployees(filtered, 'alice');
    expect(searched).toHaveLength(1);
    expect(searched[0].name).toBe('Alice Johnson');
  });

  it('should validate form and check stats', () => {
    const formData = {
      name: 'Test User',
      email: 'test@test.com',
      salary: '85000',
      yearsOfExperience: '3',
      department: 'Engineering',
    };
    const errors = validateEmployeeForm(formData);
    expect(Object.keys(errors)).toHaveLength(0);

    const stats = getEmployeeStats(mockEmployees);
    expect(stats.totalEmployees).toBe(8);
  });
});

// =====================================================================
// Component Tests
// =====================================================================

describe('EmployeeTable component', () => {
  it('should render all employee rows', () => {
    const onSort = jest.fn();
    render(
      <EmployeeTable
        employees={mockEmployees}
        onSort={onSort}
        sortField='name'
        sortOrder='asc'
      />,
    );
    mockEmployees.forEach((e) => {
      expect(screen.getByText(e.name)).toBeTruthy();
    });
  });

  it('should call onSort when header is clicked', () => {
    const onSort = jest.fn();
    render(
      <EmployeeTable
        employees={mockEmployees}
        onSort={onSort}
        sortField='name'
        sortOrder='asc'
      />,
    );
    fireEvent.click(screen.getByText(/Name/));
    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('should show sort direction indicator on active column', () => {
    const onSort = jest.fn();
    render(
      <EmployeeTable
        employees={mockEmployees}
        onSort={onSort}
        sortField='salary'
        sortOrder='asc'
      />,
    );
    expect(screen.getByText(/Salary/).textContent).toContain('↑');
  });
});

describe('EmployeeForm component', () => {
  // it('should show validation errors on empty submit', () => {
  //   const onSubmit = jest.fn();
  //   render(<EmployeeForm onSubmit={onSubmit} />);
  //   fireEvent.click(screen.getByText('Submit'));
  //   expect(onSubmit).not.toHaveBeenCalled();
  //   // Should show at least one error
  //   const errors = screen.getAllByClassName ? [] : document.querySelectorAll('.error');
  //   expect(errors.length).toBeGreaterThan(0);
  // });

  it('should call onSubmit with valid data', () => {
    const onSubmit = jest.fn();
    render(<EmployeeForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/salary/i), {
      target: { value: '75000' },
    });
    fireEvent.change(screen.getByLabelText(/experience/i), {
      target: { value: '5' },
    });
    fireEvent.change(screen.getByLabelText(/department/i), {
      target: { value: 'Engineering' },
    });

    fireEvent.click(screen.getByText('Submit'));
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@test.com',
      salary: '75000',
      yearsOfExperience: '5',
      department: 'Engineering',
    });
  });
});
