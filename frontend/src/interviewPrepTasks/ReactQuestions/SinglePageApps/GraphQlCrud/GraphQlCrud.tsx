import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { GetBooksQuery } from '../../../../gql/graphql';
import { getBooks } from './getBooks';

interface FormData {
  name: string;
  authorId: number | undefined;
}

export const GraphQlCrud = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    authorId: undefined,
  });

  const getBooksQuery = useQuery<GetBooksQuery>({
    queryKey: ['books'],
    queryFn: getBooks,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  console.log(getBooksQuery.data);

  return (
    <div>
      <h2>GraphQl CRUD</h2>
      <form onSubmit={handleSubmit}>
        <input
          name='title'
          placeholder='Book title'
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name='authorId'
          placeholder='Author Id'
          value={formData.authorId}
          onChange={handleChange}
        />
      </form>

      <h4>List of books</h4>
      {getBooksQuery?.data?.books?.map((book) => {
        return (
          <div key={book?.id}>
            <p>Book Name: {book?.name} </p>
            <p>Author Name: {book?.author?.name}</p>
          </div>
        );
      })}
    </div>
  );
};
