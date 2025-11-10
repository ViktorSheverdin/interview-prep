import { useCallback, useState } from 'react';
const DETAILS_API = 'https://jsonplaceholder.typicode.com/posts/';
export const useGetDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState({});

  const fetchDetails = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const data = await fetch(`${DETAILS_API}/${id}`);
      const res = await data.json();
      setDetails(res);
    } catch {
      throw new Error('Failed fetching details');
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { fetchDetails, isLoading, details };
};
