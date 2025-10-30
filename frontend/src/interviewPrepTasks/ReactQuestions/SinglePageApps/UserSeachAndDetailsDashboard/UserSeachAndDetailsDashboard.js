import { useEffect, useState } from 'react';

import { useGetUserDetails } from './useGetUserDetails';
import { useSearchUsers } from './useSearchUsers';

export const UserSeachAndDetailsDashboard = () => {
  const [form, setForm] = useState({ name: '', country: '' });
  const [errors, setErrors] = useState({});
  const [pages, setPages] = useState(0);
  const {
    isLoading: isUserSearchLoading,
    users,
    searchUsers,
  } = useSearchUsers();
  const {
    isLoading: isGetUserDetailsLoading,
    details,
    getUserDetails,
  } = useGetUserDetails();
  const [displayUsers, setDisplayUser] = useState([]);

  useEffect(() => {
    setDisplayUser(users.slice(pages, pages + 5));
  }, [pages, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };
  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((field) => {
      if (!form[field] && field !== 'country') {
        newErrors[field] = 'Required';
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
    } else {
      searchUsers(form.name, form.country);
    }
  };

  const handleDetails = (id) => {
    getUserDetails(id);
  };

  return (
    <div>
      <div>UserSeachAndDetailsDashboard</div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            name='name'
            placeholder='Name...'
            value={form.name}
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <div style={{ color: 'red' }}>{errors.name}</div>
        </div>
        <div>
          <label htmlFor='country'>Country</label>
          <select
            id='country'
            name='country'
            value={form.country}
            onChange={(e) => {
              handleChange(e);
            }}
          >
            <option value=''>All</option>
            <option value='us'>USA</option>
            <option value='canada'>Canada</option>
          </select>
        </div>
        <button
          disabled={isUserSearchLoading}
          type='submit'
        >
          Seach for user
        </button>
      </form>
      <div>
        <div>
          {isUserSearchLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {displayUsers.map((user) => {
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      handleDetails(user.id);
                    }}
                  >
                    {user.name}
                  </div>
                );
              })}
            </div>
          )}
          <button
            disabled={pages <= 0}
            onClick={() => {
              if (pages - 5 < 0) {
                setPages(0);
              }
              setPages((prev) => prev - 5);
            }}
          >
            Back
          </button>
          <button
            disabled={pages + 5 >= users.length - 1}
            onClick={() => {
              setPages((prev) => prev + 5);
            }}
          >
            Next
          </button>
        </div>
        <p>Users Details</p>
        {isGetUserDetailsLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {details && (
              <div>
                <div>{details.name}</div>
                <div>{details.phone}</div>
                <div>{details.website}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
