import React, { useEffect, useState } from 'react';

// Type
type Book = {
  title: string;
  author: string;
  notes: string;
  year: string;
};

// -------------------------
// Main Component
// -------------------------
const BookApp: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        console.error('Failed to fetch books', err);
        setBooks([]); // fallback
      }
    };

    fetchBooks();
  }, []);

  const addBook = (book: Book) => {
    setBooks((prev) => [...prev, book]);
  };

  return (
    <div>
      <h1>Book Tracker</h1>
      <BookForm onAddBook={addBook} />
      <BookList
        books={books}
        setBooks={setBooks}
      />
    </div>
  );
};

type BookFormProps = {
  onAddBook: (book: Book) => void;
};

const BookForm: React.FC<BookFormProps> = ({ onAddBook }) => {
  const [formData, setFormData] = useState<Book>({
    title: '',
    author: '',
    notes: '',
    year: '',
  });

  const [formErrors, setFormErrors] = useState({
    title: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on valid input
    if (formErrors.hasOwnProperty(name) && value.trim() !== '') {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['title'] as const;
    const newErrors = {} as Record<(typeof requiredFields)[number], boolean>;
    let hasError = false;

    requiredFields.forEach((field) => {
      if (formData[field].trim() === '') {
        newErrors[field] = true;
        hasError = true;
      } else {
        newErrors[field] = false;
      }
    });

    setFormErrors(newErrors);

    if (hasError) return;

    onAddBook(formData);

    setFormData({ title: '', author: '', notes: '', year: '' });
    setFormErrors({ title: false });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title *</label>
        <input
          type='text'
          name='title'
          value={formData.title}
          onChange={handleChange}
          className={`${
            formErrors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formErrors.title && (
          <p style={{ color: 'red' }}>This field is required.</p>
        )}
      </div>

      <div>
        <label>Author</label>
        <input
          type='text'
          name='author'
          value={formData.author}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Year</label>
        <input
          type='text'
          name='year'
          value={formData.year}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Notes</label>
        <textarea
          name='notes'
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <button type='submit'>Add Book</button>
    </form>
  );
};

// -------------------------
// BookList Component
// -------------------------
type BookListProps = {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
};

const BookList: React.FC<BookListProps> = ({ books, setBooks }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault(); // Necessary to allow drop
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedBooks = [...books];
    const [movedBook] = updatedBooks.splice(draggedIndex, 1);
    updatedBooks.splice(index, 0, movedBook);
    setBooks(updatedBooks);
    setDraggedIndex(null);
  };

  return (
    <div>
      <h2>Books List</h2>
      {books.length === 0 ? (
        <p>No books yet.</p>
      ) : (
        <ul>
          {books.map((book, index) => (
            <li
              key={book.title}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              style={{
                cursor: 'move',
                padding: '0.5rem',
                border: '1px solid #ccc',
                marginBottom: '0.5rem',
                background: '#f9f9f9',
              }}
            >
              <strong>{book.title}</strong> by {book.author} ({book.year})
              {book.notes && <p>{book.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default BookApp;
