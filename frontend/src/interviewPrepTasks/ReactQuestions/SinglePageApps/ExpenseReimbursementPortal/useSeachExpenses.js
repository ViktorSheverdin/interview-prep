import { useCallback, useState } from 'react';

const GET_EXPENSES_URL = 'https://jsonplaceholder.typicode.com/posts';

export const useSeachExpenses = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = useCallback(async (email, from, to) => {
    try {
      setIsLoading(true);
      const res = await fetch(GET_EXPENSES_URL);
      const data = await res.json();
      const filtered = data.filter((expense) => expense);
      setExpenses(filtered);
    } catch {
      throw new Error();
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { isLoading, expenses, fetchExpenses };
};
