import './UserRegistrationForm.css';

import React, { useEffect, useState } from 'react';
export const UserRegistrationForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    age: '',
    country: '',
    bio: '',
  });
  const [errors, setErrors] = useState({});
  const [availableCountries, setAvailableCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          'https://restcountries.com/v3.1/all?fields=name',
        );
        const data = await res.json();
        const countries = data.map((country) => country.name.common);
        setAvailableCountries(countries);
      } catch (e) {
        throw new Error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((field) => {
      if (field === 'fullName') {
        if (form[field].length < 1) newErrors['fullName'] = 'Required';
        if (!form[field].match(/^[a-zA-Z\s]*$/) && form[field].length < 2) {
          newErrors['fullName'] =
            'Required, minimum 2 characters, letters and spaces only';
        }
      }
      //   if (field === 'email') {
      //     if (form[field].length < 1) newErrors['email'] = 'Required';
      //     if (
      //       !form[field].match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      //     ) {
      //       newErrors['email'] = 'must be a valid email format ';
      //     }
      //   }
      //   if (field === 'phone') {
      //     if (form[field].length < 1) newErrors['phone'] = 'Required';
      //     if (
      //       form[field].length > 15 ||
      //       form[field].length < 10 ||
      //       !form[field].match(/^[\\d -]/)
      //     )
      //       newErrors['phone'] =
      //         'must contain only digits, dashes, or spaces (10-15 characters';
      //   }
      //   if (field === 'age') {
      //     if (form[field].length < 1) newErrors['age'] = 'Required';
      //     if (!form[field].match(/^\\d+$/)) newErrors['age'] = 'Digits only';
      //   }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log('Submit');
    }
  };

  return (
    <div className='regestration-form'>
      <div>User Registration Form</div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <button type='submit'>Register</button>
        <div>
          <label htmlFor='fullName'>fullName</label>
          <input
            id='fullName'
            name='fullName'
            onChange={(e) => handleChange(e)}
            value={form['fullName']}
          />
          {errors['fullName'] ? (
            <div style={{ color: 'red' }}>{errors.fullName}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor='country'>country</label>
          {isLoading ? (
            <div>Loading... </div>
          ) : (
            <select
              id='country'
              name='country'
              value={form['country']}
              onChange={(e) => handleChange(e)}
            >
              {availableCountries.map((country) => {
                return <option key={country}>{country}</option>;
              })}
            </select>
          )}
          {errors['country'] ? (
            <div style={{ color: 'red' }}>{errors.country}</div>
          ) : null}
        </div>
      </form>
    </div>
  );
};
