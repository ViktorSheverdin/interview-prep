import { useCallback, useState } from 'react';

const GET_EXPENSES_URL = 'https://jsonplaceholder.typicode.com/posts';

export const useGetDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [expenseDetails, setExpenseDetails] = useState([]);

  const fetchExpenseDetails = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${GET_EXPENSES_URL}/${id}`);
      const data = await res.json();
      setExpenseDetails(data);
    } catch {
      throw new Error();
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { isLoading, expenseDetails, fetchExpenseDetails };
};
