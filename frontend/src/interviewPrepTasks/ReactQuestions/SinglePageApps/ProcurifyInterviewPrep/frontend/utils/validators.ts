import { FormFieldConfig, Rule } from "../types/componentTypes";

export const required = <T>(msg = "Required"): Rule<T> => {
  return (val: T[keyof T]): string | null => {
    if (!val && val !== 0) return msg;
    return null;
  };
};

export const minLength = <T>(min: number): Rule<T> => {
  return (val: T[keyof T]): string | null => {
    if ((val as string).length < min)
      return `Must be at least ${min} characters`;
    return null;
  };
};

export const maxLength = <T>(max: number): Rule<T> => {
  return (val: T[keyof T]): string | null => {
    if ((val as string).length > max) return `Must be under ${max} characters`;
    return null;
  };
};

export const minValue = <T>(min: number): Rule<T> => {
  return (val: T[keyof T]): string | null => {
    if ((val as number) <= min) return `Must be greater than ${min}`;
    return null;
  };
};

export const maxValue = <T>(max: number): Rule<T> => {
  return (val: T[keyof T]): string | null => {
    if ((val as number) > max) return `Must be under ${max}`;
    return null;
  };
};

export function validateForm<T>(
  form: T,
  fields: FormFieldConfig<T>[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const { field, rules } of fields) {
    for (const rule of rules) {
      const error = rule(form[field], form);
      if (error) {
        errors[field as string] = error;
        break;
      }
    }
  }
  return errors;
}
