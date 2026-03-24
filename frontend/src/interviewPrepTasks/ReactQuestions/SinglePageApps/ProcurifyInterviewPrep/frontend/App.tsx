import React, { useMemo, useState } from "react";
import { IFilters } from "./componentTypes";
import { useFetch } from "./hooks/useFetch";
import { usePostExpenses } from "./hooks/usePostExpense";
import { KpiDashboard } from "./KpiDashboard";
import { ListOfExpenses } from "./ListOfExpenses";
import { SidePanel } from "./SidePanel";
import { Expense } from "./types";
import { sortBy } from "./utils";

const ProcurifyInterviewPrep: React.FC = () => {
  const { data: expenses, isLoading: isExpensesLoading } =
    useFetch<Expense[]>("expenses");

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const { data: expenseInfo } = useFetch<Expense>(
    selectedExpense?.id ? `expenses/${selectedExpense.id}` : null,
  );

  const {
    postExpenses,
    expenses: newlyCreatedExpenses,
    isLoading: isPostExpensesLoading,
  } = usePostExpenses();

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
    if (!expenses || expenses.length === 0) return [];
    let result = [...expenses];
    if (filters.statuses.length > 0) {
      result = result.filter((e) => filters.statuses.includes(e.status));
    }
    return sortBy(result, sortField, sortOrder);
  }, [expenses, sortField, sortOrder, filters]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>Procurify Spend Management</h1>

      <KpiDashboard />

      {/* Expense Table */}
      {isExpensesLoading ? (
        "Loading..."
      ) : expenses && expenses.length > 0 ? (
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
