import { useEffect, useState } from "react";
import { fetchJson } from "../api";
import { DashboardKPIs } from "../types";

// /api/dashboard/kpis
export const useGetKpis = () => {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getKpis = async () => {
      try {
        setIsLoading(true);
        const data: DashboardKPIs = await fetchJson("/dashboard/kpis");
        console.log(data);
        setKpis(data);
      } catch (err) {
        setErrors(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    getKpis();
  }, []);
  return { kpis, errors, isLoading };
};
