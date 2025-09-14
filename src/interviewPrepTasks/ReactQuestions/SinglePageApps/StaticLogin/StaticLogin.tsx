import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  login: string;
  password: string;
}

interface FormErrors {
  login?: string;
  password?: string;
}

interface LoginResponse {
  status: string;
  message: string;
}

interface LoginUser {
  login: string;
  password: string;
}

const testUsers = [
  { login: 'user1', password: '123' },
  { login: 'user2', password: '1234' },
  { login: 'user3', password: '12345' },
];

const loginUser = async (props: LoginUser): Promise<LoginResponse> => {
  const { login, password } = props;
  return new Promise((resolve, reject) => {
    const user = testUsers.find((user) => user.login === login);
    if (!user) {
      reject({ status: '404', message: 'No user found' });
    } else if (user.password !== password) {
      reject({ status: '401', message: 'Wrong password' });
    } else {
      resolve({ status: '200', message: 'Success' });
    }
  });
};

export const StaticLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    login: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    login: '',
    password: '',
  });

  const requiredFileds: (keyof FormData)[] = ['login', 'password'];

  const handleFormUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: FormErrors = {};
    requiredFileds.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'Required Field';
      }
    });
    return newErrors;
  };

  const handleLogin = async () => {
    try {
      await loginUser({ login: formData.login, password: formData.password });
      navigate('/');
    } catch (err: unknown) {
      const error = err as LoginResponse;
      if (error.status === '404') {
        setFormErrors((prev) => ({ ...prev, login: error.message }));
      }
      if (error.status === '401') {
        setFormErrors((prev) => ({ ...prev, password: error.message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      await handleLogin();
      setFormErrors({});
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '60vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
        onSubmit={handleSubmit}
      >
        <label htmlFor='login'>Static Login</label>
        <input
          name='login'
          value={formData.login}
          onChange={handleFormUpdate}
        />
        {formErrors.login && <p style={{ color: 'red' }}>{formErrors.login}</p>}
        <label htmlFor='password'>Password</label>
        <input
          name='password'
          value={formData.password}
          onChange={handleFormUpdate}
          type='password'
        />
        {formErrors.password && (
          <p style={{ color: 'red' }}>{formErrors.password}</p>
        )}

        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};
