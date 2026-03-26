import { IFilters } from "../componentTypes";
import { Expense } from "../types";
import { StatusFilter } from "./StatusFilter";

export const SortingAndFilterPanel = ({
  filters,
  onFiltersChange,
  expenses,
}: {
  filters: IFilters;
  onFiltersChange: (filters: IFilters) => void;
  expenses: Expense[];
}) => {
  return (
    <div>
      <div>
        <span>Search: </span>
        <input
          value={filters.query}
          onChange={(e) => {
            onFiltersChange({ ...filters, query: e.target.value });
          }}
        />
      </div>
      <StatusFilter
        filters={filters}
        onFiltersChange={onFiltersChange}
        expenses={expenses}
      />
    </div>
  );
};
