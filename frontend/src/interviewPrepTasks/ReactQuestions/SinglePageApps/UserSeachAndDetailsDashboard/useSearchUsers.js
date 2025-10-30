import { useCallback, useState } from 'react';

const GET_USERS = 'https://jsonplaceholder.typicode.com/users';
export const useSearchUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const searchUsers = useCallback(async (name, country) => {
    try {
      setIsLoading(true);
      const res = await fetch(GET_USERS);
      const data = await res.json();
      const filteredUsers = data.filter(
        (user) =>
          user.name.includes(name) || user.address.city.includes(country)
      );
      setUsers(filteredUsers);
    } catch {
      throw new Error();
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { isLoading, users, searchUsers };
};
