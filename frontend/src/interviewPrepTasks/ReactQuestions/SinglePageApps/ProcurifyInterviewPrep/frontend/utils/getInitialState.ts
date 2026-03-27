import { FormFieldConfig } from "../types/componentTypes";

export const getInitialState = <T>(fields: FormFieldConfig<T>[]): T => {
  const state = {} as Record<string, string | number>;
  for (const field of fields) {
    state[field.field as string] = field.defaultValue;
  }
  return state as T;
};
