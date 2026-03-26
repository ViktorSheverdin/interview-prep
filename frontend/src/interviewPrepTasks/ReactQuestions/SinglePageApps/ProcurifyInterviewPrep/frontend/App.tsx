import React, { useEffect, useMemo, useState } from "react";

import { useDebounce } from "../../GeneralInterviewFunctions/GeneralInterviewFunctions";
import { IFilters } from "./componentTypes";
import { ExpenseForm } from "./ExpenseForm";
import { useFetch } from "./hooks/useFetch";
import { usePostExpenses } from "./hooks/usePostExpense";
import { KpiDashboard } from "./KpiDashboard";
import { ListOfExpenses } from "./ListOfExpenses";
import { SidePanel } from "./SidePanel";
import { SortingAndFilterPanel } from "./SortingAndFilterPanel";
import { Expense, ExpenseCreate } from "./types";
import { sortBy } from "./utils";

const ProcurifyInterviewPrep: React.FC = () => {
  // Sorting & filtering
  const [sortField, setSortField] = useState<keyof Expense>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<IFilters>({ statuses: [], query: "" });
  const debouncedValue = useDebounce(filters.query, 300);

  const expensesEndpoint = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedValue) params.set("search", debouncedValue);
    const query = params.toString();
    return `expenses${query ? `?${query}` : ""}`;
  }, [debouncedValue]);

  const { data: expenses, isLoading: isExpensesLoading } =
    useFetch<Expense[]>(expensesEndpoint);
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
      <SortingAndFilterPanel
        filters={filters}
        setFilters={setFilters}
        expenses={sortedExpenses}
      />
      {/* Expense Table */}
      {isExpensesLoading ? (
        "Loading..."
      ) : displayExpenses && displayExpenses.length > 0 ? (
        <ListOfExpenses
          expenses={sortedExpenses}
          handleTableSort={handleTableSort}
          sortOrder={sortOrder}
          sortField={sortField}
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
