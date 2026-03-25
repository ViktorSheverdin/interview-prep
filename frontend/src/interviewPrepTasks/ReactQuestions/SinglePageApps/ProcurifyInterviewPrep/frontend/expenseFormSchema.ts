import { FormFieldConfig } from "./componentTypes";
import { ExpenseCategory, ExpenseCreate } from "./types";
import { minLength, required } from "./validators";

export const expenseFormSchema: FormFieldConfig<ExpenseCreate>[] = [
  {
    field: "title",
    type: "text",
    label: "Title",
    rules: [required(), minLength(2)],
    defaultValue: "",
  },
  {
    field: "category",
    type: "select",
    label: "Category",
    rules: [required()],
    defaultValue: "",
    options: Object.values(ExpenseCategory).map((c) => ({
      value: c,
      label: c,
    })),
  },
];
