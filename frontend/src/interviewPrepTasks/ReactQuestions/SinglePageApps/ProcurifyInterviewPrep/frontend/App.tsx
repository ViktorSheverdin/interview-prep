import React, { useEffect, useMemo, useState } from "react";

import { IFilters } from "./componentTypes";
import { ExpenseForm } from "./ExpenseForm";
import { useFetch } from "./hooks/useFetch";
import { usePostExpenses } from "./hooks/usePostExpense";
import { KpiDashboard } from "./KpiDashboard";
import { ListOfExpenses } from "./ListOfExpenses";
import { SidePanel } from "./SidePanel";
import { Expense, ExpenseCreate } from "./types";
import { sortBy } from "./utils";

const ProcurifyInterviewPrep: React.FC = () => {
  const { data: expenses, isLoading: isExpensesLoading } =
    useFetch<Expense[]>("expenses");
  const [displayExpenses, setDisplayExpenses] = useState<Expense[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const { postExpenses, expenses: newlyCreatedExpenses } = usePostExpenses();

  useEffect(() => {
    if (expenses) {
      setDisplayExpenses(expenses);
    }
  }, [expenses]);

  useEffect(() => {
    if (newlyCreatedExpenses.length > 0) {
      setDisplayExpenses((prev) => [...newlyCreatedExpenses, ...prev]);
    }
  }, [newlyCreatedExpenses]);

  const { data: expenseInfo } = useFetch<Expense>(
    selectedExpense?.id ? `expenses/${selectedExpense.id}` : null,
  );

  // Sorting & filtering
  const [sortField, setSortField] = useState<keyof Expense>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<IFilters>({ statuses: [] });

  const handleTableSort = (field: keyof Expense) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedExpenses = useMemo(() => {
    if (!displayExpenses || displayExpenses.length === 0) return [];
    let result = [...displayExpenses];
    if (filters.statuses.length > 0) {
      result = result.filter((e) => filters.statuses.includes(e.status));
    }
    return sortBy(result, sortField, sortOrder);
  }, [displayExpenses, sortField, sortOrder, filters]);

  const handleSubmit = (formState: ExpenseCreate) => {
    postExpenses(formState);
  };
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>Procurify Spend Management</h1>

      <KpiDashboard />
      <ExpenseForm onSubmit={handleSubmit} />
      {/* Expense Table */}
      {isExpensesLoading ? (
        "Loading..."
      ) : displayExpenses && displayExpenses.length > 0 ? (
        <ListOfExpenses
          expenses={sortedExpenses}
          handleTableSort={handleTableSort}
          sortOrder={sortOrder}
          sortField={sortField}
          filters={filters}
          setFilters={setFilters}
          setSelectedExpense={setSelectedExpense}
        />
      ) : null}

      {/* Side Panel */}
      {selectedExpense && (
        <SidePanel
          expenseInfo={expenseInfo}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  );
};

export default ProcurifyInterviewPrep;
