import { useState } from 'react';

export const InputSanitizing = () => {
  const [passInputValue, setPassInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setPassword(passInputValue);
  };

  return (
    <div>
      <h1>Input Sanitizing</h1>
      <form
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
        <label>
          Enter password:
          <input
            value={passInputValue}
            placeholder='Exactly 7 digits'
            onChange={(e) => setPassInputValue(e.target.value)}
          />
        </label>
        <button type='submit'>Submit</button>
        {password ? password : null}
        {error ? error : null}
      </form>
    </div>
  );
};
