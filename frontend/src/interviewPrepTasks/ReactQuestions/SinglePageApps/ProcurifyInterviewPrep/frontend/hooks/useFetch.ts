import { useEffect, useState } from "react";
import { fetchJson } from "../api";
const BASE_URL = "http://localhost:8000/api/";
export const useFetch = <T>(url: string | null) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!url) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // const data = await fetchJson<T>(url);
        const result = await fetch(`${BASE_URL}${url}`);
        if (!result.ok) throw new Error("Failed fetching");
        const data: T = await result.json();
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [url]);
  return { data, error, isLoading };
};
