// write a react component that takes an object with title, and a form array.
// The array has objects {type, name, placeholder}.
// The type is an arbitrary and can be string, number, or country.
// When it is country - it should display a select component with us and Canada.
// Each form item should be rendered with label and an input.
// All fields are required.
// Display an error if field is not filled in submit.
// If the type is url - do a validation that it starts with http or https and has a dot after domain

import { useState } from 'react';

const config = {
  title: 'User Info',
  form: [
    { type: 'string', name: 'fullName', placeholder: 'Full Name' },
    { type: 'number', name: 'age', placeholder: 'Age' },
    { type: 'country', name: 'country', placeholder: 'Select Country' },
    { type: 'url', name: 'website', placeholder: 'Website URL' },
  ],
};

export const DynamicForm = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const testUrl = (url) => {
    const pattern =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/gi;
    return pattern.test(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    config.form.forEach((field) => {
      const formValue = (form[field.name] || '').trim();
      if (!formValue) {
        newErrors[field.name] = 'Required field';
      }
      if (field.type === 'url' && !testUrl(formValue)) {
        newErrors[field.name] = 'Invalid URL';
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log(form);
    }
    console.log(form);
  };

  const renderField = (field) => {
    const { name, type, placeholder } = field;

    if (type === 'country') {
      return (
        <select
          name={name}
          id={name}
          value={form[name] || ''}
          onChange={(e) => {
            handleChange(e);
          }}
        >
          <option value=''>Select a country</option>
          <option value='us'>US</option>
          <option value='canada'>Canada</option>
        </select>
      );
    }
    return (
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
        value={form[name] || ''}
        onChange={(e) => handleChange(e)}
      />
    );
  };

  return (
    <div>
      <h3>Title: {config.title}</h3>
      <div>Dynamic Form</div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        {config.form.map((field) => {
          return (
            <div key={field.name}>
              <label htmlFor={field.name}>{field.name}: </label>
              {renderField(field)}
              <div style={{ color: 'red' }}>{errors[field.name]}</div>
            </div>
          );
        })}
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};
