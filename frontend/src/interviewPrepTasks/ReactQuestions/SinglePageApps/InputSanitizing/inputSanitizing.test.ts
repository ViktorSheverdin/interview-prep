import { isDigitsOnly, isValidLength } from './inputSanitizingUtils';

describe('isValidLength', () => {
  it('returns true when minLength is less than maxLength', () => {
    expect(isValidLength(3, 7, '123456')).toBe(true);
  });

  it('returns true when minLength equals maxLength', () => {
    expect(isValidLength(5, 5, '12345')).toBe(true);
  });

  it('returns false when minLength is greater than maxLength', () => {
    expect(isValidLength(10, 5, '234')).toBe(false);
  });
});

// Tests for isDigitsOnly utility

describe('isDigitsOnly', () => {
  it('returns true for a string containing only digits', () => {
    expect(isDigitsOnly('1234567')).toBe(true);
  });

  it('returns false for a string containing alphabetic characters', () => {
    expect(isDigitsOnly('12abc34')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isDigitsOnly('')).toBe(false);
  });

  it('returns false for leading spaces', () => {
    expect(isDigitsOnly(' 123')).toBe(false);
  });

  it('returns false for trailing spaces', () => {
    expect(isDigitsOnly(' 123  ')).toBe(false);
  });

  it('returns false for a string containing special characters or spaces', () => {
    expect(isDigitsOnly('123 456')).toBe(false);
    expect(isDigitsOnly('123-456')).toBe(false);
  });
});
