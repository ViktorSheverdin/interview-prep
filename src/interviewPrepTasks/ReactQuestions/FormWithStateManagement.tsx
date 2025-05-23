import { useState } from 'react';
import { v4 as uuid } from 'uuid';

interface User {
  uuid: string;
  name: string;
  lastName: string;
  phone?: string;
  email?: string;
}

interface FormData {
  name: string;
  lastName: string;
  phone?: string;
  email?: string;
}

interface FormDataErrors {
  name?: string;
  lastName?: string;
}

interface UserFormProps {
  onSubmit: (user: User) => void;
}

const UserCard = (props: User) => {
  const { name, lastName, phone, email } = props;
  return (
    <div>
      <h3>
        {name} {lastName}
      </h3>
      <p>{phone}</p>
      <p>{email}</p>
    </div>
  );
};

const UserForm = (props: UserFormProps) => {
  const { onSubmit } = props;
  const [formData, setFormData] = useState<FormData>({
    name: '',
    lastName: '',
    phone: '',
    email: '',
  });

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({
    name: '',
    lastName: '',
  });

  const requiredFields: (keyof FormData)[] = ['name', 'lastName'];

  const validate = () => {
    const newErrors: FormDataErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field as keyof FormDataErrors] = 'Required field';
      }
    });
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formDataErrors[name as keyof FormDataErrors]) {
      setFormDataErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormDataErrors];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFormDataErrors(validationErrors);
    } else {
      const newUser: User = {
        uuid: uuid(),
        ...formData,
      };
      onSubmit(newUser);
      setFormData({
        name: '',
        lastName: '',
        phone: '',
        email: '',
      });
      setFormDataErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type='text'
          name='name'
          placeholder='Name'
          value={formData.name}
          onChange={(e) => {
            handleChange(e);
          }}
          style={{
            borderColor: formDataErrors.name ? 'red' : undefined,
          }}
        />
        {formDataErrors.name ? <span>{formDataErrors.name}</span> : null}
      </div>
      <div>
        <input
          type='text'
          name='lastName'
          placeholder='Last Name'
          value={formData.lastName}
          onChange={handleChange}
          style={{
            borderColor: formDataErrors.lastName ? 'red' : undefined,
          }}
        />
        {formDataErrors.lastName ? (
          <span>{formDataErrors.lastName}</span>
        ) : null}
      </div>
      <div>
        <input
          type='number'
          name='phone'
          placeholder='Phone'
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type='text'
          name='email'
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <button>Add User</button>
    </form>
  );
};

export const FormWithStateManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      uuid: '1',
      name: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
    },
  ]);

  const handleSubmit = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  return (
    <div>
      <h1>Form with State Management</h1>
      <div>
        Add new user:
        <UserForm onSubmit={handleSubmit} />
      </div>
      <div>
        List of users:
        {users.map((user) => {
          return (
            <UserCard
              key={user.uuid}
              {...user}
            />
          );
        })}
      </div>
    </div>
  );
};
