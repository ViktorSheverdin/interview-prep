import { useCallback, useEffect, useState } from "react";

import { PaginatedExpenses } from "../types/types";

interface ExpenseFilters {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}

interface UseExpensesResult {
  data: PaginatedExpenses | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  totalCount: number;
}

const cache = new Map<string, PaginatedExpenses>();

const makeUrl = (filters: ExpenseFilters): string => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(filters.page));
  searchParams.set("page_size", String(filters.pageSize));
  if (filters?.status) searchParams.set("status", filters.status);
  if (filters?.search) searchParams.set("search", filters.search);
  return `http://localhost:8000/api/expenses/?${searchParams}`;
};

const fetchDataWithCache = async (
  cacheId: string,
  url: string,
  setData: (data: PaginatedExpenses) => void,
  setError: (data: string) => void,
  setIsLoading: (isLoaiding: boolean) => void,
  signal: AbortSignal,
) => {
  try {
    const cached = cache.get(cacheId);
    if (!cached) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setData(cached);
    }
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`${res.status}`);
    const resData: PaginatedExpenses = await res.json();

    cache.set(cacheId, resData);
    setData(resData);
    setIsLoading(false);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return;
    setError(err instanceof Error ? err.message : "Oops...");
  }
};

export const useExpenses = (filters: ExpenseFilters): UseExpensesResult => {
  const cacheId = JSON.stringify(filters);
  const [data, setData] = useState<PaginatedExpenses | null>(
    cache.get(cacheId) ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!cache.get(cacheId));
  const url = makeUrl(filters);

  useEffect(() => {
    const controller = new AbortController();

    fetchDataWithCache(
      cacheId,
      url,
      setData,
      setError,
      setIsLoading,
      controller.signal,
    );
    return () => controller.abort();
  }, [cacheId]);

  const refetch = useCallback(async () => {
    cache.delete(cacheId);
    const controller = new AbortController();

    fetchDataWithCache(
      cacheId,
      url,
      setData,
      setError,
      setIsLoading,
      controller.signal,
    );
  }, [cacheId]);
  return {
    data,
    error,
    isLoading,
    refetch,
    totalCount: data?.total_count ?? 0,
  };
};
