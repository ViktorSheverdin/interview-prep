import { IFilters } from "../componentTypes";
import { Expense } from "../types";
import { StatusFilter } from "./StatusFilter";

export const SortingAndFilterPanel = ({
  filters,
  setFilters,
  expenses,
}: {
  filters: IFilters;
  setFilters: (filters: IFilters) => void;
  expenses: Expense[];
}) => {
  return (
    <div>
      <div>
        <span>Search: </span>
        <input
          value={filters.query}
          onChange={(e) => {
            setFilters({ ...filters, query: e.target.value });
          }}
        />
      </div>
      <StatusFilter
        filters={filters}
        setFilters={setFilters}
        expenses={expenses}
      />
    </div>
  );
};
