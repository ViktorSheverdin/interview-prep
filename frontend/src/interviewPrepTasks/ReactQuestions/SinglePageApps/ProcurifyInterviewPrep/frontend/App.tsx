import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFetch } from "./hooks/useFetch";
import { useGetKpis } from "./hooks/useGetKpis";
import {
  CurrencyConversion,
  DashboardKPIs,
  Expense,
  ExpenseStatus,
} from "./types";
import { formatCurrency, sortBy } from "./utils";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROCURIFY SPEND MANAGEMENT — MOCK INTERVIEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Welcome! This is your progressive feature-building interview.
// See QUESTIONS.md for the full list of 20 tasks.
//
// The FastAPI backend is already running at http://localhost:8000
// Swagger docs available at http://localhost:8000/docs
//
// Build your features below. Each question builds on the previous ones.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface IColumns<T> {
  key: keyof T;
  label: string;
  render?: (val: T[keyof T], row: T) => React.ReactNode;
}
interface IListOfExpenses {
  expenses: Expense[];
  sortField: keyof Expense;
  sortOrder: "asc" | "desc";
  handleTableSort: (column: keyof Expense) => void;
  filters: IFilters;
  setFilters: (filter: IFilters) => void;
  expenseInfo: Expense | null;
  setSelectedExpense: (expense: Expense) => void;
}
const statusColor: Record<ExpenseStatus, string> = {
  [ExpenseStatus.APPROVED]: "green",
  [ExpenseStatus.PENDING]: "#cc9900",
  [ExpenseStatus.REJECTED]: "red",
  [ExpenseStatus.DRAFT]: "gray",
  [ExpenseStatus.PAID]: "blue",
};

const StatusFilter = ({
  filters,
  setFilters,
  expenses,
}: {
  filters: IFilters;
  setFilters: (filters: IFilters) => void;
  expenses: Expense[];
}) => {
  const toggleStatus = (status: ExpenseStatus) => {
    const current = filters.statuses;
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    setFilters({ ...filters, statuses: updated });
  };

  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
      <button
        onClick={() => setFilters({ ...filters, statuses: [] })}
        style={{
          padding: "4px 12px",
          borderRadius: "16px",
          border: "1px solid #ccc",
          background: filters.statuses.length === 0 ? "#333" : "white",
          color: filters.statuses.length === 0 ? "white" : "#333",
          cursor: "pointer",
        }}
      >
        All
      </button>
      {Object.values(ExpenseStatus).map((status) => {
        const isActive = filters.statuses.includes(status);
        const count = expenses.filter((e) => e.status === status).length;
        return (
          <button
            key={status}
            onClick={() => toggleStatus(status)}
            style={{
              padding: "4px 12px",
              borderRadius: "16px",
              border: `1px solid ${statusColor[status]}`,
              background: isActive ? statusColor[status] : "white",
              color: isActive ? "white" : statusColor[status],
              cursor: "pointer",
            }}
          >
            {status} ({count})
          </button>
        );
      })}
    </div>
  );
};

const ListOfExpenses = (props: IListOfExpenses) => {
  const {
    expenses,
    sortOrder,
    sortField,
    handleTableSort,
    filters,
    setFilters,
    expenseInfo,
    setSelectedExpense,
  } = props;
  const [tooltip, setTooltip] = useState<{
    id: string;
    value: number;
    isLoading: boolean;
  } | null>(null);

  const cache = useRef<Record<string, number>>({});
  const handleHover = async (
    expenseId: string,
    amount: number,
    currency: string,
  ) => {
    if (currency === "USD") return;
    const cacheKey = `${amount}-${currency}`;
    if (cache.current[cacheKey]) {
      setTooltip({
        id: expenseId,
        value: cache.current[cacheKey],
        isLoading: false,
      });
      return;
    }
    try {
      setTooltip({ id: expenseId, value: 0, isLoading: true });
      const res = await fetch(
        `http://localhost:8000/api/currency/convert?amount=${amount}&from_currency=${currency}&to_currency=USD`,
      );
      const data: CurrencyConversion = await res.json();
      cache.current[cacheKey] = data.converted_amount;
      setTooltip({
        id: expenseId,
        value: data.converted_amount,
        isLoading: false,
      });
    } catch {
      setTooltip({ id: expenseId, value: 0, isLoading: false });
    }
  };

  const COLUMNS: IColumns<Expense>[] = [
    { key: "title", label: "Title" },
    {
      key: "amount",
      label: "Amount",
      render: (val, row) => {
        return (
          <span
            onMouseEnter={() => handleHover(row.id, row.amount, row.currency)}
            onMouseLeave={() => setTooltip(null)}
            title={
              tooltip?.id === row.id
                ? tooltip.isLoading
                  ? "Loading..."
                  : String(tooltip.value)
                : undefined
            }
          >
            {formatCurrency(val as number, row.currency)}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <div style={{ color: statusColor[val as ExpenseStatus] }}>
          {String(val)}
        </div>
      ),
    },
  ];

  return (
    <div>
      <StatusFilter
        filters={filters}
        setFilters={setFilters}
        expenses={expenses}
      />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <table>
          <thead>
            <tr>
              {COLUMNS.map((col) => {
                return (
                  <th
                    key={String(col.key)}
                    onClick={() => {
                      handleTableSort(col.key);
                    }}
                  >
                    {col.label}
                    {col.key === sortField
                      ? sortOrder === "asc"
                        ? "^"
                        : "V"
                      : null}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              return (
                <tr
                  key={String(expense.id)}
                  onClick={() => {
                    setSelectedExpense(expense);
                  }}
                >
                  {COLUMNS.map((col) => {
                    return (
                      <td key={String(col.key)}>
                        {col.render
                          ? col.render(expense[col.key], expense)
                          : String(expense[col.key])}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div>
          Expense Info:
          <div>Expense vendor id: {expenseInfo?.vendor_id}</div>
        </div>
      </div>
    </div>
  );
};

interface IFilters {
  statuses: ExpenseStatus[];
}
const ProcurifyInterviewPrep: React.FC = () => {
  const {
    data: kpis,
    error: kpiErros,
    isLoading: isKpiLoading,
  } = useFetch<DashboardKPIs>("dashboard/kpis");
  const { data: expenses, isLoading: isExpencesLoading } =
    useFetch<Expense[]>("expenses");

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const { data: expenseInfo } = useFetch<Expense>(
    selectedExpense?.id ? `expenses/${selectedExpense?.id ?? ""}` : null,
  );

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
    let filteredAndSortedTable = [...expenses];
    if (filters.statuses.length > 0) {
      filteredAndSortedTable = filteredAndSortedTable.filter((e) =>
        filters.statuses.includes(e.status),
      );
    }
    filteredAndSortedTable = sortBy(
      filteredAndSortedTable,
      sortField,
      sortOrder,
    );
    return filteredAndSortedTable;
  }, [expenses, sortField, sortOrder, filters]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>Procurify Spend Management</h1>
      <p>Start building your features here. See QUESTIONS.md for tasks.</p>
      {kpis && (
        <div>
          KPIs:
          <div>
            <div>
              Pending Approvals:{formatCurrency(kpis.pending_approvals)}
            </div>
            <div>Month spend:{formatCurrency(kpis.monthly_spend)}</div>
          </div>
        </div>
      )}
      {/* ── Q1: Build your KPI Dashboard Cards here ── */}
      {expenses && expenses?.length > 0 ? (
        <ListOfExpenses
          expenses={sortedExpenses}
          handleTableSort={handleTableSort}
          sortOrder={sortOrder}
          sortField={sortField}
          filters={filters}
          setFilters={setFilters}
          expenseInfo={expenseInfo}
          setSelectedExpense={setSelectedExpense}
        />
      ) : null}
      {/* ── Q2: Build your Expense List Table here ── */}

      {/* ── Continue adding features as you progress through the questions ── */}
    </div>
  );
};

export default ProcurifyInterviewPrep;
