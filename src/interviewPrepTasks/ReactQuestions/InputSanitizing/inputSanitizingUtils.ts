export const isValidLength = (minLength: number, maxLength: number) => {
  return maxLength - minLength >= 0;
};

export const isDigitsOnly = (input: string) => {
  return /^\d+$/.test(input);
};
