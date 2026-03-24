// ─── Enums ───────────────────────────────────────────────────────────────────

export enum ExpenseStatus {
  DRAFT = "draft",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  PAID = "paid",
}

export enum ExpenseCategory {
  TRAVEL = "travel",
  SOFTWARE = "software",
  OFFICE_SUPPLIES = "office_supplies",
  MARKETING = "marketing",
  CONSULTING = "consulting",
  EQUIPMENT = "equipment",
  MEALS = "meals",
  UTILITIES = "utilities",
}

export enum Currency {
  USD = "USD",
  CAD = "CAD",
  EUR = "EUR",
  GBP = "GBP",
}

export enum ApprovalAction {
  APPROVE = "approve",
  REJECT = "reject",
  REQUEST_INFO = "request_info",
}

export enum VendorRisk {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: Currency;
  category: ExpenseCategory;
  status: ExpenseStatus;
  submitted_by: string;
  department: string;
  vendor_id: string;
  vendor_name: string;
  description: string;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
  approved_by: string | null;
  rejection_reason: string | null;
  tags: string[];
  is_recurring: boolean;
  po_number: string | null;
}

export interface ExpenseCreate {
  title: string;
  amount: number;
  currency: Currency;
  category: ExpenseCategory;
  department: string;
  vendor_id: string;
  description: string;
  receipt_url?: string;
  tags: string[];
  is_recurring: boolean;
}

export interface ApprovalRequest {
  action: ApprovalAction;
  comment?: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact_email: string;
  category: string;
  risk_level: VendorRisk;
  total_spend: number;
  contract_end_date: string;
  payment_terms: number;
  is_preferred: boolean;
  country: string;
}

export interface Budget {
  id: string;
  department: string;
  category: ExpenseCategory;
  allocated: number;
  spent: number;
  remaining: number;
  currency: Currency;
  fiscal_year: number;
  fiscal_quarter: number;
}

export interface SpendAnalytics {
  total_spend: number;
  spend_by_category: Record<string, number>;
  spend_by_department: Record<string, number>;
  spend_by_month: { month: string; total: number }[];
  top_vendors: { vendor: string; total_spend: number }[];
  approval_rate: number;
  average_approval_time_hours: number;
  budget_utilization_percent: number;
  pending_count: number;
  over_budget_departments: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user: string;
  details: string;
  ip_address: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id: string;
  vendor_name: string;
  items: { name: string; quantity: number; unit_price: number }[];
  total_amount: number;
  currency: Currency;
  status: string;
  created_by: string;
  approved_by: string | null;
  created_at: string;
  delivery_date: string | null;
  notes: string;
}

export interface DashboardKPIs {
  pending_approvals: number;
  pending_total: number;
  monthly_spend: number;
  total_vendors: number;
  active_purchase_orders: number;
  over_budget_count: number;
  high_risk_vendors: number;
  expenses_this_quarter: number;
}

export interface CurrencyConversion {
  original_amount: number;
  from_currency: Currency;
  to_currency: Currency;
  converted_amount: number;
  exchange_rate: number;
}
