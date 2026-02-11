import './GeneralInterviewFunctions.css';

import React, { useState } from 'react';

// =====================================================================
// INTERVIEW SESSION 1: Sorting & Basic Filtering (30 min) - SOLUTIONS
// =====================================================================

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

// Q2: Sort products by any field, ascending or descending
export function sortProducts(
  products: Product[],
  field: keyof Product,
  order: 'asc' | 'desc' = 'asc',
): Product[] {
  return [...products].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

// Q3: Filter products by category
export function filterByCategory(
  products: Product[],
  category: string,
): Product[] {
  if (!category) return products;
  return products.filter((p) => p.category === category);
}

// Q4: Filter products within price range
export function filterByPriceRange(
  products: Product[],
  min: number,
  max: number,
): Product[] {
  return products.filter((p) => p.price >= min && p.price <= max);
}

// Q5: Filter products with stock between min/max
export function filterByStockRange(
  products: Product[],
  min: number,
  max: number,
): Product[] {
  return products.filter((p) => p.stock >= min && p.stock <= max);
}

// Q6: Product table with sortable columns
interface ProductTableProps {
  products: Product[];
  onSort: (field: keyof Product) => void;
  sortField: keyof Product;
  sortOrder: 'asc' | 'desc';
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onSort,
  sortField,
  sortOrder,
}) => {
  const renderSortIcon = (field: keyof Product) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <table className='product-table'>
      <thead>
        <tr>
          <th onClick={() => onSort('name')}>Name{renderSortIcon('name')}</th>
          <th onClick={() => onSort('price')}>
            Price{renderSortIcon('price')}
          </th>
          <th onClick={() => onSort('stock')}>
            Stock{renderSortIcon('stock')}
          </th>
          <th onClick={() => onSort('category')}>
            Category{renderSortIcon('category')}
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>${product.price}</td>
            <td>{product.stock}</td>
            <td>{product.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Q7: Apply multiple filters at once
export function combineFilters(
  products: Product[],
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    maxStock?: number;
  },
): Product[] {
  let result = products;

  if (filters.category) {
    result = filterByCategory(result, filters.category);
  }

  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    result = filterByPriceRange(result, filters.minPrice, filters.maxPrice);
  }

  if (filters.minStock !== undefined && filters.maxStock !== undefined) {
    result = filterByStockRange(result, filters.minStock, filters.maxStock);
  }

  return result;
}

// =====================================================================
// INTERVIEW SESSION 2: Form Validation & Number Handling - SOLUTIONS
// =====================================================================

export interface ProductFormData {
  name: string;
  price: string;
  stock: string;
  category: string;
}

// Q8: Check if field is not empty
export function validateRequired(value: string): string {
  return value.trim() === '' ? 'This field is required' : '';
}

// Q9: Check if value is a valid number
export function validateIsNumber(value: string): string {
  if (value.trim() === '') return 'Required';
  if (isNaN(Number(value))) return 'Must be a number';
  return '';
}

// Q10: Check if number is positive
export function validatePositiveNumber(value: string): string {
  const numError = validateIsNumber(value);
  if (numError) return numError;
  return Number(value) <= 0 ? 'Must be positive' : '';
}

// Q11: Check if value is an integer
export function validateInteger(value: string): string {
  const numError = validateIsNumber(value);
  if (numError) return numError;
  return !Number.isInteger(Number(value)) ? 'Must be an integer' : '';
}

// Q12: Check if number is within min/max
export function validateRange(value: string, min: number, max: number): string {
  const numError = validateIsNumber(value);
  if (numError) return numError;

  const num = Number(value);
  if (num < min) return `Must be at least ${min}`;
  if (num > max) return `Must be at most ${max}`;
  return '';
}

// Q13: Validate entire product form
export function validateProductForm(
  data: ProductFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Price validation
  const priceError = validatePositiveNumber(data.price);
  if (priceError) {
    errors.price = priceError;
  } else if (Number(data.price) > 10000) {
    errors.price = 'Price must be at most 10000';
  }

  // Stock validation
  const stockError = validateInteger(data.stock);
  if (stockError) {
    errors.stock = stockError;
  } else {
    const stock = Number(data.stock);
    if (stock < 0) errors.stock = 'Stock must be at least 0';
    if (stock > 1000) errors.stock = 'Stock must be at most 1000';
  }

  // Category validation
  if (!data.category.trim()) {
    errors.category = 'Category is required';
  }

  return errors;
}

// Q14: Controlled form with validation
interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  initialData?: Partial<ProductFormData>;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    price: initialData?.price || '',
    stock: initialData?.stock || '',
    category: initialData?.category || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateProductForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
    // Reset form
    setFormData({ name: '', price: '', stock: '', category: '' });
    setErrors({});
  };

  return (
    <form
      className='product-form'
      onSubmit={handleSubmit}
    >
      <div>
        <label>Name *</label>
        <input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder='Product name'
        />
        {errors.name && <span className='error'>{errors.name}</span>}
      </div>

      <div>
        <label>Price *</label>
        <input
          type='number'
          step='0.01'
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          placeholder='0.00'
        />
        {errors.price && <span className='error'>{errors.price}</span>}
      </div>

      <div>
        <label>Stock *</label>
        <input
          type='number'
          value={formData.stock}
          onChange={(e) => handleChange('stock', e.target.value)}
          placeholder='0'
        />
        {errors.stock && <span className='error'>{errors.stock}</span>}
      </div>

      <div>
        <label>Category *</label>
        <input
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          placeholder='Electronics, Furniture, etc.'
        />
        {errors.category && <span className='error'>{errors.category}</span>}
      </div>

      <button type='submit'>Submit</button>
    </form>
  );
};

// =====================================================================
// INTERVIEW SESSION 3: Advanced Filtering & Integration - SOLUTIONS
// =====================================================================

// Q15: Search by name (case-insensitive)
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;
  const lowerQuery = query.toLowerCase();
  return products.filter((p) => p.name.toLowerCase().includes(lowerQuery));
}

// Q16: Sort by primary field, then secondary
export function multiFieldSort(
  products: Product[],
  primary: keyof Product,
  primaryOrder: 'asc' | 'desc',
  secondary: keyof Product,
  secondaryOrder: 'asc' | 'desc',
): Product[] {
  return [...products].sort((a, b) => {
    const aValPrimary = a[primary];
    const bValPrimary = b[primary];

    // Compare primary field
    if (aValPrimary < bValPrimary) {
      return primaryOrder === 'asc' ? -1 : 1;
    }
    if (aValPrimary > bValPrimary) {
      return primaryOrder === 'asc' ? 1 : -1;
    }

    // If primary fields are equal, compare secondary
    const aValSecondary = a[secondary];
    const bValSecondary = b[secondary];

    if (aValSecondary < bValSecondary) {
      return secondaryOrder === 'asc' ? -1 : 1;
    }
    if (aValSecondary > bValSecondary) {
      return secondaryOrder === 'asc' ? 1 : -1;
    }

    return 0;
  });
}

// Q17: Filter by multiple categories
export function filterByCategories(
  products: Product[],
  categories: string[],
): Product[] {
  if (categories.length === 0) return products;
  return products.filter((p) => categories.includes(p.category));
}

// Q18: Calculate product statistics
export function getProductStats(products: Product[]): {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  totalStock: number;
} {
  if (products.length === 0) {
    return { minPrice: 0, maxPrice: 0, avgPrice: 0, totalStock: 0 };
  }

  const prices = products.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  return { minPrice, maxPrice, avgPrice, totalStock };
}

// Q19: Safely parse string to number
export function parseNumberInput(
  value: string,
  defaultValue: number = 0,
): number {
  if (!value || value.trim() === '') return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Q20: Complete ProductManager component
interface FilterState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minStock: string;
  maxStock: string;
}

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Laptop', price: 999, stock: 15, category: 'Electronics' },
    { id: 2, name: 'Mouse', price: 25, stock: 50, category: 'Electronics' },
    { id: 3, name: 'Desk', price: 299, stock: 8, category: 'Furniture' },
    { id: 4, name: 'Chair', price: 199, stock: 12, category: 'Furniture' },
    { id: 5, name: 'Keyboard', price: 79, stock: 30, category: 'Electronics' },
    { id: 6, name: 'Monitor', price: 349, stock: 20, category: 'Electronics' },
    { id: 7, name: 'Lamp', price: 45, stock: 25, category: 'Furniture' },
    { id: 8, name: 'Notebook', price: 5, stock: 100, category: 'Stationery' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
  });

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      // Toggle order if clicking same field
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAddProduct = (data: ProductFormData) => {
    const newProduct: Product = {
      id: Math.max(0, ...products.map((p) => p.id)) + 1,
      name: data.name,
      price: Number(data.price),
      stock: Number(data.stock),
      category: data.category,
    };
    setProducts((prev) => [...prev, newProduct]);
    setShowForm(false);
  };

  const getFilteredAndSortedProducts = (): Product[] => {
    let result = products;

    // Apply search
    if (filters.search) {
      result = searchProducts(result, filters.search);
    }

    // Apply category filter
    if (filters.category) {
      result = filterByCategory(result, filters.category);
    }

    // Apply price range filter
    const minPrice = parseNumberInput(filters.minPrice, 0);
    const maxPrice = parseNumberInput(filters.maxPrice, Infinity);
    if (filters.minPrice || filters.maxPrice) {
      result = filterByPriceRange(result, minPrice, maxPrice);
    }

    // Apply stock range filter
    const minStock = parseNumberInput(filters.minStock, 0);
    const maxStock = parseNumberInput(filters.maxStock, Infinity);
    if (filters.minStock || filters.maxStock) {
      result = filterByStockRange(result, minStock, maxStock);
    }

    // Apply sorting
    result = sortProducts(result, sortField, sortOrder);

    return result;
  };

  const filteredProducts = getFilteredAndSortedProducts();
  const stats = getProductStats(filteredProducts);
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className='product-manager'>
      <header>
        <h1>Product Manager</h1>
        <button onClick={() => setShowForm(true)}>+ Add Product</button>
      </header>

      <div className='filters'>
        <input
          type='text'
          placeholder='Search by name...'
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
        >
          <option value=''>All Categories</option>
          {categories.map((cat) => (
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>

        <div className='range-filter'>
          <label>Price:</label>
          <input
            type='number'
            placeholder='Min'
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
            }
          />
          <input
            type='number'
            placeholder='Max'
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
            }
          />
        </div>

        <div className='range-filter'>
          <label>Stock:</label>
          <input
            type='number'
            placeholder='Min'
            value={filters.minStock}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minStock: e.target.value }))
            }
          />
          <input
            type='number'
            placeholder='Max'
            value={filters.maxStock}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxStock: e.target.value }))
            }
          />
        </div>
      </div>

      <div className='stats'>
        <span>Products: {filteredProducts.length}</span>
        <span>
          Price: ${stats.minPrice.toFixed(2)} - ${stats.maxPrice.toFixed(2)}
        </span>
        <span>Avg: ${stats.avgPrice.toFixed(2)}</span>
        <span>Total Stock: {stats.totalStock}</span>
      </div>

      <ProductTable
        products={filteredProducts}
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
            <h2>Add New Product</h2>
            <ProductForm onSubmit={handleAddProduct} />
          </div>
        </div>
      )}
    </div>
  );
};

export const CompactInterviewSolutions: React.FC = () => {
  return <ProductManager />;
};
