import { useEffect, useState } from "react";

import { DashboardKPIs } from "../types/types";
import { fetchJson } from "../utils/api";

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
