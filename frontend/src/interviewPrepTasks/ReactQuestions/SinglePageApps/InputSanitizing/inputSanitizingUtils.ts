export const isValidLength = (
  minLength: number,
  maxLength: number,
  input: string
) => {
  return input.length >= minLength && input.length <= maxLength;
};

export const isDigitsOnly = (input: string) => {
  return /^\d+$/.test(input);
};

export const isValidPassword = (input: string) => {
  if (!isValidLength(7, 7, input)) {
    return 'Password should be 7 chars';
  }

  if (!isDigitsOnly(input)) {
    return 'Password should be digits only';
  }

  return '';
};
