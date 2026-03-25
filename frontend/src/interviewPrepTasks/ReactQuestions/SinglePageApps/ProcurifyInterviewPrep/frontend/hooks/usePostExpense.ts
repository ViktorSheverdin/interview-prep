import { useCallback, useState } from "react";

import { Expense, ExpenseCreate } from "../types";

export const usePostExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postExpenses = useCallback(async (expenseData: ExpenseCreate) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Indicate the content type
        },
        body: JSON.stringify(expenseData),
      });
      if (!res.ok) throw new Error("Error posting expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }, []);
  return { postExpenses, expenses, isLoading, error };
};
