import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useGetUsers } from './useGetUsers';
import { usePost } from './usePostUser';

export const UserManagementDashboard = () => {
  const { isLoading, users, setUsers } = useGetUsers();
  const { isLoadingPost, usePostUser } = usePost();
  const uniqueId = uuidv4();
  const [form, setForm] = useState({
    userName: '',
    email: '',
    companyName: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((field) => {
      if (!form[field]) {
        newErrors[field] = 'Required field';
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
      const newUser = {
        id: uniqueId,
        name: form.userName,
        email: form.email,
        company: { name: form.companyName },
      };
      setUsers((prev) => [...prev, newUser]);
      usePostUser(newUser);
      setErrors({});
      setForm({ userName: '', email: '', companyName: '' });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <div>User management dashboard</div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label htmlFor='userName'>User Name: </label>
          <input
            id='userName'
            name='userName'
            value={form['userName']}
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <div style={{ color: 'red' }}>{errors['userName']}</div>
        </div>
        <div>
          <label htmlFor='email'>Email: </label>
          <input
            id='email'
            name='email'
            value={form['email']}
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <div style={{ color: 'red' }}>{errors['email']}</div>
        </div>
        <div>
          <label htmlFor='companyName'>Company Name: </label>
          <input
            id='companyName'
            name='companyName'
            value={form['companyName']}
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </div>
        <div style={{ color: 'red' }}>{errors['companyName']}</div>

        <button type='submit'>Add user</button>
      </form>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Company Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.id}>
                <td>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.company.name}</td>
              </tr>
            );
          })}
          <div>{isLoadingPost ? 'Adding User' : null}</div>
        </tbody>
      </table>
    </div>
  );
};
