import { IStatusFilterProps } from "./componentTypes";
import { ExpenseStatus } from "./types";

const statusColor: Record<ExpenseStatus, string> = {
  [ExpenseStatus.APPROVED]: "green",
  [ExpenseStatus.PENDING]: "#cc9900",
  [ExpenseStatus.REJECTED]: "red",
  [ExpenseStatus.DRAFT]: "gray",
  [ExpenseStatus.PAID]: "blue",
};

export { statusColor };

export const StatusFilter = ({
  filters,
  setFilters,
  expenses,
}: IStatusFilterProps) => {
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
