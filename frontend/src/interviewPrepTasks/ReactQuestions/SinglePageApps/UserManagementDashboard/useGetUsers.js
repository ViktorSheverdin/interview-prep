import { useEffect, useState } from 'react';

const URL = 'https://jsonplaceholder.typicode.com/users';
export const useGetUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(URL);
        const res = await data.json();
        setUsers(res);
      } catch (e) {
        throw new Error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return { isLoading, users, setUsers };
};
