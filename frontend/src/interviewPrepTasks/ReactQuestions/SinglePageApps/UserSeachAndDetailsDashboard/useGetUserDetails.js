import { useCallback, useState } from 'react';
const GET_USER = 'https://jsonplaceholder.typicode.com/users';

export const useGetUserDetails = () => {
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const getUserDetails = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${GET_USER}/${id}`);
      const data = await res.json();
      setDetails(data);
    } catch {
      throw new Error();
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { isLoading, details, getUserDetails };
};
