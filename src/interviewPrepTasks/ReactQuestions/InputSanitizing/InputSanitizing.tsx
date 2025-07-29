import './InputSanitizing.css';

import React, { useState } from 'react';

import { isValidPassword } from './inputSanitizingUtils';

export const InputSanitizing = () => {
  const [passInputValue, setPassInputValue] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const sanitized = value.replace(/\D/g, '');
    setPassInputValue(sanitized);

    // Validate the sanitized value (digits only)
    const validationMsg = isValidPassword(sanitized);
    setError(validationMsg);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (error) {
      return;
    }
    setPassword(passInputValue);
    setPassInputValue('');
  };

  const isDisabled = !!error || passInputValue === '';

  return (
    <div className='input-sanitizing-container'>
      <h1>Input Sanitizing</h1>
      <form
        className='input-sanitizing-form'
        onSubmit={onSubmit}
      >
        <label htmlFor='password'>Enter password:</label>
        <input
          id='password'
          type='text'
          inputMode='numeric'
          pattern='\d*'
          value={passInputValue}
          placeholder='Exactly 7 digits'
          onChange={handleInput}
        />
        <button
          type='submit'
          disabled={isDisabled}
        >
          Submit
        </button>

        {password && <div className='success-msg'>Entered: {password}</div>}
        {error && <div className='error-msg'>{error}</div>}
      </form>
    </div>
  );
};
