import { useEffect, useState } from 'react';

import { useSearchUsers } from './useSearchUsers';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SeachUsersApiResponse {
  users: User[];
}

export const SearchBar = () => {
  const { users, error, isLoading } = useSearchUsers();
  const [input, setInput] = useState('');
  const [seachTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchTerm(input);
    }, 300);
    return () => {
      clearTimeout(timerId);
    };
  }, [input]);

  const handleSeach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputLower = e.target.value.toLowerCase();
    setInput(inputLower);
  };

  const filteredUsers = users.filter((user) => {
    return `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(seachTerm);
  });

  if (error) return <div>Error fetching users</div>;
  if (isLoading) return <div>Fetching users</div>;

  return (
    <div>
      <div>
        <input
          value={input}
          onChange={handleSeach}
          placeholder='Seach...'
        />
      </div>
      <div>
        {filteredUsers.map((user) => {
          return (
            <div key={user.id}>
              {user.firstName} {user.lastName}
            </div>
          );
        })}
      </div>
    </div>
  );
};
