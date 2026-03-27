import { useCallback, useEffect, useState } from "react";

import { PaginatedExpenses } from "../types";

interface ExpenseFilters {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}

interface UseExpensesResult {
  data: PaginatedExpenses | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  totalCount: number;
}

const cache = new Map<string, PaginatedExpenses>();
const inFlight = new Map<string, Promise<PaginatedExpenses>>();

const buildUrl = (filters: ExpenseFilters): string => {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("page_size", String(filters.pageSize));
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  return `http://localhost:8000/api/expenses?${params}`;
};

const doFetch = async (
  url: string,
  signal: AbortSignal,
): Promise<PaginatedExpenses> => {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Status code: ${res.status}`);
  const data = await res.json();
  return data;
};

const tryDedup = async (key: string): Promise<PaginatedExpenses | null> => {
  if (!inFlight.has(key)) return null;
  return inFlight.get(key)!;
};

const tryCache = (
  key: string,
  setData: (data: PaginatedExpenses) => void,
  setIsLoading: (isLoading: boolean) => void,
): boolean => {
  if (!cache.has(key)) return false;
  setData(cache.get(key)!);
  setIsLoading(false);
  return true;
};
const fetchWithDedup = async (
  key: string,
  url: string,
  signal: AbortSignal,
): Promise<PaginatedExpenses> => {
  const promise = doFetch(url, signal);
  inFlight.set(key, promise);
  try {
    const res = await promise;
    return res;
  } finally {
    inFlight.delete(key);
  }
};

const fetchWithCache = async (
  key: string,
  filters: ExpenseFilters,
  signal: AbortSignal,
  setData: (data: PaginatedExpenses) => void,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: Error | null) => void,
): Promise<void> => {
  try {
    const deduped = await tryDedup(key);
    if (deduped) {
      setData(deduped);
      setIsLoading(false);
      return;
    }
    const cached = tryCache(key, setData, setIsLoading);
    if (!cached) {
      setIsLoading(true);
    }

    const result = await fetchWithDedup(key, buildUrl(filters), signal);
    cache.set(key, result);
    setData(result);
    setIsLoading(false);
    setError(null);
  } catch (err) {
    if ((err as Error).name === "AbortSignal") return;
    setError(err as Error);
    setIsLoading(false);
  }
};
export const useExpenses = (filters: ExpenseFilters): UseExpensesResult => {
  const key = JSON.stringify(filters);
  const [data, setData] = useState<PaginatedExpenses | null>(
    cache.get(key) ?? null,
  );
  const [isLoading, setIsLoading] = useState(!cache.has(key));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchWithCache(
      key,
      filters,
      controller.signal,
      setData,
      setIsLoading,
      setError,
    );
    return () => controller.abort();
  }, [key]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchWithCache(
      key,
      filters,
      controller.signal,
      setData,
      setIsLoading,
      setError,
    );
  }, [key, filters]);

  return {
    data,
    isLoading,
    error,
    refetch,
    totalCount: data?.total_count ?? 0,
  };
};
