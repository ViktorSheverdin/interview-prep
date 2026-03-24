import React from "react";
import { useFetch } from "./hooks/useFetch";
import { DashboardKPIs } from "./types";
import { formatCurrency } from "./utils";

export const KpiDashboard = () => {
  const {
    data: kpis,
    error: kpiError,
    isLoading: isKpiLoading,
  } = useFetch<DashboardKPIs>("dashboard/kpis");

  if (isKpiLoading) return <div>Loading...</div>;
  if (kpiError) return <div>Error: {kpiError}</div>;
  if (!kpis) return null;

  return (
    <div>
      KPIs:
      <div>
        <div>Pending Approvals: {formatCurrency(kpis.pending_approvals)}</div>
        <div>Monthly Spend: {formatCurrency(kpis.monthly_spend)}</div>
      </div>
    </div>
  );
};
