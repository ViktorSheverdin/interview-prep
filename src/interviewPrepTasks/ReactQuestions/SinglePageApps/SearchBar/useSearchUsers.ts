import { useEffect, useState } from 'react';

import { SeachUsersApiResponse, User } from './SearchBar';

const GET_USERS_API = 'https://dummyjson.com/users';

export const useSearchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(GET_USERS_API);
        const data: SeachUsersApiResponse = await res.json();
        setUsers(data.users);
      } catch {
        setError('Error fetching users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, error, isLoading };
};
