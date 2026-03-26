import { useRef, useState } from "react";

import { IColumns, IListOfExpenses } from "./componentTypes";
import { statusColor } from "./StatusFilter";
import { CurrencyConversion, Expense, ExpenseStatus } from "./types";
import { formatCurrency } from "./utils";

export const ListOfExpenses = (props: IListOfExpenses) => {
  const {
    expenses,
    sortOrder,
    sortField,
    handleTableSort,
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
    if (cache.current?.[cacheKey]) {
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
      <div style={{ display: "flex", flexDirection: "row" }}>
        <table>
          <thead>
            <tr>
              {COLUMNS.map((col) => {
                return (
                  <th
                    key={String(col.key)}
                    onClick={() => handleTableSort(col.key)}
                    style={{ cursor: "pointer" }}
                  >
                    {col.label}
                    {col.key === sortField
                      ? sortOrder === "asc"
                        ? " ^"
                        : " V"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExpense(expense);
                  }}
                  style={{ cursor: "pointer" }}
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
      </div>
    </div>
  );
};
