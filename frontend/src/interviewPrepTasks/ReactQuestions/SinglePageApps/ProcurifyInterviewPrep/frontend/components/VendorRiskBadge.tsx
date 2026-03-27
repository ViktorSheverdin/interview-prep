import React from "react";

import { VendorRisk } from "../types/types";

interface IVendorRiskBadge {
  riskLevel: VendorRisk;
  name: string;
}

const riskColor: Record<VendorRisk, string> = {
  [VendorRisk.LOW]: "green",
  [VendorRisk.CRITICAL]: "red",
  [VendorRisk.HIGH]: "orange",
  [VendorRisk.MEDIUM]: "blue",
};

export const VendorRiskBadge = React.memo<IVendorRiskBadge>((props) => {
  const { riskLevel, name } = props;
  return <div style={{ color: riskColor[riskLevel] }}>{name}</div>;
});

VendorRiskBadge.displayName = "VendorRiskBadge";
