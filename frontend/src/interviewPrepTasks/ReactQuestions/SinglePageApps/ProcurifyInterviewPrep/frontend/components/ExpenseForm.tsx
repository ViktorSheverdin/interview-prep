import { useState } from "react";

import { expenseFormSchema } from "../schemas/expenseFormSchema";
import { ExpenseCreate } from "../types/types";
import { getInitialState } from "../utils/getInitialState";
import { validateForm } from "../utils/validators";

type IExpenseForm = {
  onSubmit: (formState: ExpenseCreate) => void;
};
export const ExpenseForm = (props: IExpenseForm) => {
  const { onSubmit } = props;
  const [formState, setFormState] = useState(
    getInitialState(expenseFormSchema),
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ExpenseCreate, value: string | number) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    const validatorErrors = validateForm(formState, expenseFormSchema);
    if (Object.keys(validatorErrors).length !== 0) {
      setFormErrors(validatorErrors);
      return;
    }
    onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit}>
      {expenseFormSchema.map(({ field, type, label, options }) => {
        if (type === "select") {
          return (
            <div key={field}>
              <select
                value={String(formState[field])}
                onChange={(e) => handleChange(field, e.target.value)}
              >
                <option value="">Select {label}</option>
                {options?.map((option) => {
                  return <option key={option.label}>{option.label}</option>;
                })}
              </select>
              {formErrors[field] ? <span>{formErrors[field]}</span> : null}
            </div>
          );
        }
        return (
          <div key={String(field)}>
            <label htmlFor={String(field)}>{label}</label>
            <input
              name={String(field)}
              id={String(field)}
              type={String(type)}
              value={String(formState[field])}
              onChange={(e) => handleChange(field, e.target.value)}
            />
            {formErrors[field] && <span>{formErrors[field]}</span>}
          </div>
        );
      })}
      <button type="submit">Submit</button>
    </form>
  );
};
