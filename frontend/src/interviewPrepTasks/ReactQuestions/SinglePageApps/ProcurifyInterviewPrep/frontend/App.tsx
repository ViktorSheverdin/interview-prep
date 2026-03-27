import React, { useEffect, useMemo, useState } from "react";

import { useDebounce } from "../../GeneralInterviewFunctions/GeneralInterviewFunctions";
import { ExpenseForm } from "./components/ExpenseForm";
import { KpiDashboard } from "./components/KpiDashboard";
import { ListOfExpenses } from "./components/ListOfExpenses";
import { PageNavigation } from "./components/PageNavigation";
import { SidePanel } from "./components/SidePanel";
import { SortingAndFilterPanel } from "./components/SortingAndFilterPanel";
import { useExpenses } from "./hooks/useExpenses";
import { useFetch } from "./hooks/useFetch";
import { usePostExpenses } from "./hooks/usePostExpense";
import { IFilters } from "./types/componentTypes";
import { Expense, ExpenseCreate, PaginatedExpenses } from "./types/types";
import { sortBy } from "./utils/utils";

const ProcurifyInterviewPrep: React.FC = () => {
  // Sorting & filtering
  const [sortField, setSortField] = useState<keyof Expense>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<IFilters>({ statuses: [], query: "" });
  const debouncedValue = useDebounce(filters.query, 300);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const expensesEndpoint = useMemo(() => {
    const params = new URLSearchParams();

    if (debouncedValue) params.set("search", debouncedValue);

    params.set("page", String(page));
    params.set("page_size", String(pageSize));

    const query = params.toString();
    return `expenses${query ? `?${query}` : ""}`;
  }, [debouncedValue, page, pageSize]);

  const { data: paginatedExpenses, isLoading: isExpensesLoading } =
    useFetch<PaginatedExpenses>(expensesEndpoint);

  const { data: dedupedExpenses } = useExpenses({
    page,
    pageSize,
    search: filters.query,
  });

  const [displayExpenses, setDisplayExpenses] = useState<Expense[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const { postExpenses, expenses: newlyCreatedExpenses } = usePostExpenses();

  useEffect(() => {
    if (paginatedExpenses) {
      setDisplayExpenses(paginatedExpenses.items);
    }
  }, [paginatedExpenses]);

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleFiltersChange = (newFilters: IFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSubmit = (formState: ExpenseCreate) => {
    postExpenses(formState);
  };
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>Procurify Spend Management</h1>

      <KpiDashboard />
      <ExpenseForm onSubmit={handleSubmit} />
      <div>
        Total Count from deduped and cached API: {dedupedExpenses?.total_count}
      </div>
      <SortingAndFilterPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        expenses={sortedExpenses}
      />
      <PageNavigation
        page={page}
        onPageChange={handlePageChange}
        totalPages={paginatedExpenses?.total_pages}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
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
