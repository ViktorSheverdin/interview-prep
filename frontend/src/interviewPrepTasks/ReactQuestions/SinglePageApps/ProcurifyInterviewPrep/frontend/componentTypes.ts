import React from "react";

import { Expense, ExpenseCreate, ExpenseStatus } from "./types";

export interface IColumns<T> {
  key: keyof T;
  label: string;
  render?: (val: T[keyof T], row: T) => React.ReactNode;
}

export interface IFilters {
  statuses: ExpenseStatus[];
}

export interface IListOfExpenses {
  expenses: Expense[];
  sortField: keyof Expense;
  sortOrder: "asc" | "desc";
  handleTableSort: (column: keyof Expense) => void;
  filters: IFilters;
  setFilters: (filter: IFilters) => void;
  setSelectedExpense: (expense: Expense) => void;
}

export interface IStatusFilterProps {
  filters: IFilters;
  setFilters: (filters: IFilters) => void;
  expenses: Expense[];
}

export type Rule<T> = (value: T[keyof T], form: T) => string | null;

export type FormFieldConfig<T> = {
  field: keyof T;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  rules: Rule<T>[];
  defaultValue: string | number;
};
