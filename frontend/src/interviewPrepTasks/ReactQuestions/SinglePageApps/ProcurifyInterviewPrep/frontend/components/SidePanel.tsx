import React, { useEffect, useRef } from "react";

import { Expense } from "../types";

interface ISidePanelProps {
  expenseInfo: Expense | null;
  onClose: () => void;
}

export const SidePanel = ({ expenseInfo, onClose }: ISidePanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        width: "400px",
        background: "white",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
        padding: "1rem",
      }}
    >
      Expense Info:
      <div>Expense vendor id: {expenseInfo?.vendor_id}</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};
