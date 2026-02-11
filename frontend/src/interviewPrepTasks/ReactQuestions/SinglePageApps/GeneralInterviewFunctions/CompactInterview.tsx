import './GeneralInterviewFunctions.css';

import React, { useState } from 'react';

// =====================================================================
// INTERVIEW SESSION 1: Sorting & Basic Filtering (30 min)
// =====================================================================

// TODO Q1: Define Product interface with: id, name, price, stock, category
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

// TODO Q2: Implement sortProducts - sort by any field, asc or desc
export function sortProducts(
  products: Product[],
  field: keyof Product,
  order: 'asc' | 'desc' = 'asc',
): Product[] {
  const sortedProducts = [...products];
  sortedProducts.sort((a, b) => {
    const aField = a[field];
    const bField = b[field];

    if (aField < bField) return order === 'asc' ? -1 : 1;
    if (aField > bField) return order === 'asc' ? 1 : -1;

    return 0;
  });
  return sortedProducts;
}

// TODO Q3: Implement filterByCategory - filter products by category
export function filterByCategory(
  products: Product[],
  category: string,
): Product[] {
  if (category === '') return [...products];
  return products.filter((product) => product.category === category);
}

// TODO Q4: Implement filterByPriceRange - filter products within min/max price
export function filterByPriceRange(
  products: Product[],
  min: number,
  max: number,
): Product[] {
  return products.filter((p) => p.price <= max && p.price >= min);
}

// TODO Q5: Implement filterByStockRange - filter products with stock between min/max
export function filterByStockRange(
  products: Product[],
  min: number,
  max: number,
): Product[] {
  return products.filter((p) => p.stock <= max && p.stock >= min);
}

// TODO Q6: Implement ProductTable - display products in a table with sorting
// Should have clickable column headers to sort
// Should show sort direction (↑/↓)
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
  // Your implementation here
  return (
    <table className='product-table'>
      <thead>
        <tr>
          <th onClick={() => onSort('name')}>
            Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => onSort('price')}>
            Price {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => onSort('stock')}>
            Stock {sortField === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => onSort('category')}>
            Category{' '}
            {sortField === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => {
          return (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.category}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// TODO Q7: Implement combineFilters - apply multiple filters at once
// Should filter by category AND price range AND stock range
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
  let filteredProducts = [...products];
  if (filters?.category) {
    filteredProducts = filterByCategory(filteredProducts, filters.category);
  }
  if (filters?.minPrice && filters?.maxPrice) {
    filteredProducts = filterByPriceRange(
      filteredProducts,
      filters.minPrice,
      filters.maxPrice,
    );
  }
  if (filters?.minStock && filters?.maxStock) {
    filteredProducts = filterByStockRange(
      filteredProducts,
      filters.minStock,
      filters.maxStock,
    );
  }

  return filteredProducts;
}

// =====================================================================
// INTERVIEW SESSION 2: Form Validation & Number Handling (30 min)
// =====================================================================

export interface ProductFormData {
  name: string;
  price: string; // string because it comes from input
  stock: string; // string because it comes from input
  category: string;
}

// TODO Q8: Implement validateRequired - check if field is not empty
export function validateRequired(value: string): string {
  // Return error message if invalid, empty string if valid
  if (!value.trim()) return 'Required';
  return '';
}

// TODO Q9: Implement validateIsNumber - check if value is a valid number
export function validateIsNumber(value: string): string {
  // Return error message if invalid, empty string if valid
  const error = validateRequired(value);
  if (error) return error;
  if (isNaN(Number(value))) return 'Must be a number';
  return '';
}

// TODO Q10: Implement validatePositiveNumber - check if number is positive
export function validatePositiveNumber(value: string): string {
  // Return error message if invalid, empty string if valid
  const error = validateIsNumber(value);
  if (error) return error;
  if (Number(value) <= 0) return 'Must be positive';
  return '';
}

// TODO Q11: Implement validateInteger - check if value is an integer
export function validateInteger(value: string): string {
  const error = validateIsNumber(value);
  if (error) return error;
  if (!Number.isInteger(Number(value))) return 'Must be integer';
  // Return error message if invalid, empty string if valid
  return '';
}

// TODO Q12: Implement validateRange - check if number is within min/max
export function validateRange(value: string, min: number, max: number): string {
  // Return error message if invalid, empty string if valid
  const error = validateIsNumber(value);
  if (error) return error;

  const num = Number(value);
  if (num < min) return `Must be at least ${min}`;
  if (num > max) return `Must be at most ${max}`;
  return '';
}

// TODO Q13: Implement validateProductForm - validate entire form
// Rules:
// - name: required, min 2 chars
// - price: required, must be number, must be positive, max 10000
// - stock: required, must be integer, must be >= 0, max 1000
// - category: required

const runValidators = (
  value: string,
  ...validators: ((v: string) => string)[]
): string => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return '';
};

export function validateProductForm(
  data: ProductFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};

  const nameError = runValidators(data.name, validateRequired, (v) =>
    v.trim().length < 2 ? 'Min 2 chars' : '',
  );
  if (nameError) errors.name = nameError;

  const priceError = runValidators(
    data.price,
    validateRequired,
    validateIsNumber,
    validatePositiveNumber,
    (v) => validateRange(v, 0, 10000),
  );
  if (priceError) errors.price = priceError;

  const stockError = runValidators(
    data.stock,
    validateRequired,
    validateInteger,
    (v) => validateRange(v, 0, 1000),
  );
  if (stockError) errors.stock = stockError;

  const categoryErrors = runValidators(data.category, validateRequired);
  if (categoryErrors) errors.category = categoryErrors;

  return errors;
}

// TODO Q14: Implement ProductForm - controlled form with validation
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
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateProductForm(formData);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form
      className='product-form'
      onSubmit={handleSubmit}
    >
      {/* TODO: Implement form fields with error display */}
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
        <label htmlFor='price'>price</label>
        <input
          id='price'
          name='price'
          type='number'
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
        />
        {errors.price && <span className='error'>{errors.price}</span>}
      </div>
      <div>
        <label htmlFor='stock'>stock</label>
        <input
          id='stock'
          name='stock'
          type='number'
          value={formData.stock}
          onChange={(e) => handleChange('stock', e.target.value)}
        />
        {errors.stock && <span className='error'>{errors.stock}</span>}
      </div>
      <div>
        <label htmlFor='category'>category</label>
        <input
          id='category'
          name='category'
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
        />
        {errors.category && <span className='error'>{errors.category}</span>}
      </div>

      {/* TODO: Add price, stock, category fields */}
      <button type='submit'>Submit</button>
    </form>
  );
};

// =====================================================================
// INTERVIEW SESSION 3: Advanced Filtering & Integration (30 min)
// =====================================================================

// TODO Q15: Implement searchProducts - search by name (case-insensitive)
export function searchProducts(products: Product[], query: string): Product[] {
  return products.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
}

// TODO Q16: Implement multiFieldSort - sort by primary field, then secondary
// Example: sort by category (asc), then by price (desc)
// export function multiFieldSort(
//   products: Product[],
//   primary: keyof Product,
//   primaryOrder: 'asc' | 'desc',
//   secondary: keyof Product,
//   secondaryOrder: 'asc' | 'desc',
// ): Product[] {
//   return [...products].sort((a, b) => {
//     const aPrimary = a[primary];
//     const bPrimary = b[primary];

//     if (aPrimary < bPrimary) return primaryOrder === 'asc' ? -1 : 1;
//     if (aPrimary > bPrimary) return primaryOrder === 'asc' ? 1 : -1;

//     const aSecondary = a[secondary];
//     const bSecondary = b[secondary];

//     if (aSecondary < bSecondary) return secondaryOrder === 'asc' ? -1 : 1;
//     if (aSecondary > bSecondary) return secondaryOrder === 'asc' ? 1 : -1;
//     return 0;
//   });
// }

export function multiFieldSort(
  products: Product[],
  categories: { field: keyof Product; order?: 'asc' | 'desc' }[],
): Product[] {
  return [...products].sort((a, b) => {
    for (const { field, order = 'asc' } of categories) {
      const aField = a[field];
      const bField = b[field];
      if (aField < bField) return order === 'asc' ? -1 : 1;
      if (aField > bField) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

// TODO Q17: Implement filterByCategories - filter by multiple categories
export function filterByCategories(
  products: Product[],
  categories: string[],
): Product[] {
  if (categories.length === 0) return [...products];
  return products.filter((product) => categories.includes(product.category));
}

// TODO Q18: Implement getProductStats - calculate min, max, avg price and total stock
export function getProductStats(products: Product[]): {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  totalStock: number;
} {
  if (products.length === 0) {
    return { minPrice: 0, maxPrice: 0, avgPrice: 0, totalStock: 0 };
  }

  const stats = products.reduce(
    (acc, product) => {
      acc.minPrice = Math.min(acc.minPrice, product.price);
      acc.maxPrice = Math.max(acc.maxPrice, product.price);
      acc.avgPrice = acc.avgPrice + product.price;
      acc.totalStock = acc.totalStock + product.stock;
      return acc;
    },
    { minPrice: Infinity, maxPrice: -Infinity, avgPrice: 0, totalStock: 0 },
  );

  return {
    minPrice: stats.minPrice,
    maxPrice: stats.maxPrice,
    avgPrice: stats.avgPrice / products.length,
    totalStock: stats.totalStock,
  };
}

// TODO Q19: Implement parseNumberInput - safely parse string to number
// Should handle: empty string, invalid input, decimals
export function parseNumberInput(
  value: string,
  defaultValue: number = 0,
): number {
  // Your implementation here
  const error = validateIsNumber(value);
  if (error) return defaultValue;
  return Number(value);
}

// TODO Q20: Implement the complete ProductManager component
// Should integrate all features:
// - Display products in sortable table
// - Add/edit products with validated form
// - Search by name
// - Filter by category (dropdown)
// - Filter by price range (min/max inputs)
// - Filter by stock range (min/max inputs)
// - Show product statistics
// - Toggle sort order for each column

interface FilterState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minStock: string;
  maxStock: string;
}

export const ProductManager: React.FC = () => {
  // Sample data
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

  // TODO: Implement all handlers and logic
  const handleSort = (field: keyof Product) => {
    // Toggle sort order if clicking same field
    // Otherwise, default to ascending
    if (field === sortField) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleAddProduct = (data: ProductFormData) => {
    const newProduct: Product = {
      id:
        products.reduce((acc, p) => ({ maxId: Math.max(acc.maxId, p.id) }), {
          maxId: -Infinity,
        }).maxId + 1,
      name: data.name,
      price: parseNumberInput(data.price),
      stock: parseNumberInput(data.stock),
      category: data.category,
    };
    setProducts((prev) => [newProduct, ...prev]);
    setShowForm(false);
  };

  const getFilteredAndSortedProducts = (): Product[] => {
    // TODO: Apply all filters, search, and sorting
    let sortedAndFilteredProducts = [...products];

    sortedAndFilteredProducts = searchProducts(
      sortedAndFilteredProducts,
      filters.search,
    );
    // sortedAndFilteredProducts = filterByCategory(products, filters.category);
    sortedAndFilteredProducts = combineFilters(sortedAndFilteredProducts, {
      category: filters.category,
      minPrice: parseNumberInput(filters.minPrice),
      maxPrice: parseNumberInput(filters.maxPrice),
      minStock: parseNumberInput(filters.minStock),
      maxStock: parseNumberInput(filters.maxStock),
    });

    sortedAndFilteredProducts = sortProducts(
      sortedAndFilteredProducts,
      sortField,
      sortOrder,
    );
    // sortedAndFilteredProducts = combineFilters(sortedAndFilteredProducts, {
    //   category: filters.category,
    //   minPrice: filters.minPrice,
    //   maxPrice: filters.maxPrice,
    //   minStock: filters.minStock,
    //   maxStock: filters.maxStock,
    // });

    return sortedAndFilteredProducts;
  };

  const stats = getProductStats(getFilteredAndSortedProducts());
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className='product-manager'>
      <header>
        <h1>Product Manager</h1>
        <button onClick={() => setShowForm(true)}>+ Add Product</button>
      </header>

      {/* Search and Filters */}
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

      {/* Stats */}
      <div className='stats'>
        <span>Products: {getFilteredAndSortedProducts().length}</span>
        <span>
          Price: ${stats.minPrice} - ${stats.maxPrice}
        </span>
        <span>Avg: ${stats.avgPrice.toFixed(2)}</span>
        <span>Total Stock: {stats.totalStock}</span>
      </div>

      {/* Product Table */}
      <ProductTable
        products={getFilteredAndSortedProducts()}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      {/* Form Modal */}
      {showForm && (
        <div className='modal-overlay'>
          <div className='modal'>
            <button
              className='close-btn'
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
            <ProductForm onSubmit={handleAddProduct} />
          </div>
        </div>
      )}
    </div>
  );
};

export const CompactInterview: React.FC = () => {
  return <ProductManager />;
};
