from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timedelta
from enum import Enum
import random
import uuid

app = FastAPI(title="Procurify Spend Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Enums ───────────────────────────────────────────────────────────────────

class ExpenseStatus(str, Enum):
    DRAFT = "draft"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    PAID = "paid"


class ExpenseCategory(str, Enum):
    TRAVEL = "travel"
    SOFTWARE = "software"
    OFFICE_SUPPLIES = "office_supplies"
    MARKETING = "marketing"
    CONSULTING = "consulting"
    EQUIPMENT = "equipment"
    MEALS = "meals"
    UTILITIES = "utilities"


class Currency(str, Enum):
    USD = "USD"
    CAD = "CAD"
    EUR = "EUR"
    GBP = "GBP"


class ApprovalAction(str, Enum):
    APPROVE = "approve"
    REJECT = "reject"
    REQUEST_INFO = "request_info"


class VendorRisk(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# ─── Models ──────────────────────────────────────────────────────────────────

class Expense(BaseModel):
    id: str
    title: str
    amount: float
    currency: Currency
    category: ExpenseCategory
    status: ExpenseStatus
    submitted_by: str
    department: str
    vendor_id: str
    vendor_name: str
    description: str
    receipt_url: Optional[str] = None
    created_at: str
    updated_at: str
    approved_by: Optional[str] = None
    rejection_reason: Optional[str] = None
    tags: list[str] = []
    is_recurring: bool = False
    po_number: Optional[str] = None


class ExpenseCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    amount: float = Field(..., gt=0, le=1000000)
    currency: Currency = Currency.USD
    category: ExpenseCategory
    department: str
    vendor_id: str
    description: str = Field(..., min_length=10)
    receipt_url: Optional[str] = None
    tags: list[str] = []
    is_recurring: bool = False


class ApprovalRequest(BaseModel):
    action: ApprovalAction
    comment: Optional[str] = None


class Vendor(BaseModel):
    id: str
    name: str
    contact_email: str
    category: str
    risk_level: VendorRisk
    total_spend: float
    contract_end_date: str
    payment_terms: int
    is_preferred: bool
    country: str


class Budget(BaseModel):
    id: str
    department: str
    category: ExpenseCategory
    allocated: float
    spent: float
    remaining: float
    currency: Currency
    fiscal_year: int
    fiscal_quarter: int


class SpendAnalytics(BaseModel):
    total_spend: float
    spend_by_category: dict[str, float]
    spend_by_department: dict[str, float]
    spend_by_month: list[dict]
    top_vendors: list[dict]
    approval_rate: float
    average_approval_time_hours: float
    budget_utilization_percent: float
    pending_count: int
    over_budget_departments: list[str]


class AuditLogEntry(BaseModel):
    id: str
    timestamp: str
    action: str
    entity_type: str
    entity_id: str
    user: str
    details: str
    ip_address: str


class PurchaseOrder(BaseModel):
    id: str
    po_number: str
    vendor_id: str
    vendor_name: str
    items: list[dict]
    total_amount: float
    currency: Currency
    status: str
    created_by: str
    approved_by: Optional[str]
    created_at: str
    delivery_date: Optional[str]
    notes: str


# ─── Seed Data ───────────────────────────────────────────────────────────────

DEPARTMENTS = ["Engineering", "Marketing", "Sales", "Operations", "Finance", "HR", "Product", "Design"]
USERS = ["Alice Chen", "Bob Martinez", "Carol Davis", "David Kim", "Eve Johnson", "Frank Wilson", "Grace Lee", "Henry Brown"]

VENDORS: list[Vendor] = [
    Vendor(id="v1", name="AWS", contact_email="billing@aws.amazon.com", category="Cloud Infrastructure", risk_level=VendorRisk.LOW, total_spend=245000, contract_end_date="2027-03-15", payment_terms=30, is_preferred=True, country="US"),
    Vendor(id="v2", name="Figma Inc.", contact_email="sales@figma.com", category="Design Software", risk_level=VendorRisk.LOW, total_spend=18000, contract_end_date="2026-12-01", payment_terms=30, is_preferred=True, country="US"),
    Vendor(id="v3", name="WeWork", contact_email="accounts@wework.com", category="Office Space", risk_level=VendorRisk.MEDIUM, total_spend=96000, contract_end_date="2026-09-30", payment_terms=15, is_preferred=False, country="US"),
    Vendor(id="v4", name="Catered Delights", contact_email="orders@catereddelights.com", category="Catering", risk_level=VendorRisk.LOW, total_spend=12400, contract_end_date="2026-06-15", payment_terms=7, is_preferred=True, country="CA"),
    Vendor(id="v5", name="GlobalTech Consulting", contact_email="pm@globaltech.io", category="Consulting", risk_level=VendorRisk.HIGH, total_spend=180000, contract_end_date="2026-08-01", payment_terms=45, is_preferred=False, country="UK"),
    Vendor(id="v6", name="OfficeMax Pro", contact_email="b2b@officemax.com", category="Office Supplies", risk_level=VendorRisk.LOW, total_spend=8500, contract_end_date="2027-01-01", payment_terms=30, is_preferred=True, country="US"),
    Vendor(id="v7", name="TravelCorp", contact_email="corporate@travelcorp.com", category="Travel Services", risk_level=VendorRisk.MEDIUM, total_spend=67000, contract_end_date="2026-11-30", payment_terms=15, is_preferred=True, country="CA"),
    Vendor(id="v8", name="Datadog", contact_email="billing@datadoghq.com", category="Monitoring", risk_level=VendorRisk.LOW, total_spend=42000, contract_end_date="2027-02-28", payment_terms=30, is_preferred=True, country="US"),
]

VENDOR_MAP = {v.id: v for v in VENDORS}


def generate_expenses() -> list[Expense]:
    expenses = []
    now = datetime.now()
    for i in range(50):
        vendor = random.choice(VENDORS)
        status = random.choice(list(ExpenseStatus))
        category = random.choice(list(ExpenseCategory))
        dept = random.choice(DEPARTMENTS)
        submitter = random.choice(USERS)
        created = now - timedelta(days=random.randint(0, 90), hours=random.randint(0, 23))
        amount = round(random.uniform(25, 50000), 2)

        expense = Expense(
            id=f"exp-{uuid.uuid4().hex[:8]}",
            title=f"{category.value.replace('_', ' ').title()} - {vendor.name}",
            amount=amount,
            currency=random.choice(list(Currency)),
            category=category,
            status=status,
            submitted_by=submitter,
            department=dept,
            vendor_id=vendor.id,
            vendor_name=vendor.name,
            description=f"Expense for {category.value.replace('_', ' ')} from {vendor.name} for {dept} department.",
            receipt_url=f"https://receipts.procurify.local/{uuid.uuid4().hex[:8]}.pdf" if random.random() > 0.3 else None,
            created_at=created.isoformat(),
            updated_at=(created + timedelta(hours=random.randint(1, 48))).isoformat(),
            approved_by=random.choice(USERS) if status in [ExpenseStatus.APPROVED, ExpenseStatus.PAID] else None,
            rejection_reason="Exceeds department budget limit" if status == ExpenseStatus.REJECTED else None,
            tags=random.sample(["urgent", "Q1", "Q2", "recurring", "one-time", "capex", "opex"], k=random.randint(0, 3)),
            is_recurring=random.random() > 0.7,
            po_number=f"PO-{random.randint(1000, 9999)}" if random.random() > 0.5 else None,
        )
        expenses.append(expense)
    return expenses


random.seed(42)
EXPENSES = generate_expenses()

BUDGETS: list[Budget] = []
for dept in DEPARTMENTS:
    for cat in list(ExpenseCategory)[:4]:
        allocated = round(random.uniform(10000, 200000), 2)
        spent = round(random.uniform(0, allocated * 1.2), 2)
        BUDGETS.append(Budget(
            id=f"bgt-{uuid.uuid4().hex[:8]}",
            department=dept,
            category=cat,
            allocated=allocated,
            spent=spent,
            remaining=round(allocated - spent, 2),
            currency=Currency.USD,
            fiscal_year=2026,
            fiscal_quarter=1,
        ))

AUDIT_LOG: list[AuditLogEntry] = []
for i in range(30):
    exp = random.choice(EXPENSES)
    AUDIT_LOG.append(AuditLogEntry(
        id=f"audit-{uuid.uuid4().hex[:8]}",
        timestamp=(datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
        action=random.choice(["created", "updated", "approved", "rejected", "submitted"]),
        entity_type="expense",
        entity_id=exp.id,
        user=random.choice(USERS),
        details=f"Expense '{exp.title}' was {random.choice(['created', 'updated', 'approved', 'rejected'])}",
        ip_address=f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
    ))

PURCHASE_ORDERS: list[PurchaseOrder] = []
for i in range(15):
    vendor = random.choice(VENDORS)
    items = [
        {"name": f"Item {j+1}", "quantity": random.randint(1, 50), "unit_price": round(random.uniform(10, 5000), 2)}
        for j in range(random.randint(1, 5))
    ]
    total = round(sum(item["quantity"] * item["unit_price"] for item in items), 2)
    created = datetime.now() - timedelta(days=random.randint(0, 60))
    PURCHASE_ORDERS.append(PurchaseOrder(
        id=f"po-{uuid.uuid4().hex[:8]}",
        po_number=f"PO-{2026}-{1000 + i}",
        vendor_id=vendor.id,
        vendor_name=vendor.name,
        items=items,
        total_amount=total,
        currency=random.choice(list(Currency)),
        status=random.choice(["draft", "pending", "approved", "fulfilled", "cancelled"]),
        created_by=random.choice(USERS),
        approved_by=random.choice(USERS) if random.random() > 0.3 else None,
        created_at=created.isoformat(),
        delivery_date=(created + timedelta(days=random.randint(7, 30))).isoformat() if random.random() > 0.3 else None,
        notes=f"Purchase order for {vendor.name}",
    ))


# ─── Endpoints ───────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Procurify Spend Management API", "version": "1.0.0"}


# ── Expenses ──

@app.get("/api/expenses", response_model=list[Expense])
def get_expenses(
    status: Optional[ExpenseStatus] = None,
    category: Optional[ExpenseCategory] = None,
    department: Optional[str] = None,
    vendor_id: Optional[str] = None,
    min_amount: Optional[float] = Query(None, ge=0),
    max_amount: Optional[float] = Query(None, ge=0),
    search: Optional[str] = None,
    sort_by: Optional[str] = Query(None, pattern="^(amount|created_at|title|status)$"),
    sort_order: Optional[str] = Query("desc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    filtered = EXPENSES[:]

    if status:
        filtered = [e for e in filtered if e.status == status]
    if category:
        filtered = [e for e in filtered if e.category == category]
    if department:
        filtered = [e for e in filtered if e.department.lower() == department.lower()]
    if vendor_id:
        filtered = [e for e in filtered if e.vendor_id == vendor_id]
    if min_amount is not None:
        filtered = [e for e in filtered if e.amount >= min_amount]
    if max_amount is not None:
        filtered = [e for e in filtered if e.amount <= max_amount]
    if search:
        q = search.lower()
        filtered = [e for e in filtered if q in e.title.lower() or q in e.description.lower() or q in e.vendor_name.lower()]

    reverse = sort_order == "desc"
    if sort_by:
        filtered.sort(key=lambda e: getattr(e, sort_by), reverse=reverse)
    else:
        filtered.sort(key=lambda e: e.created_at, reverse=True)

    start = (page - 1) * page_size
    return filtered[start:start + page_size]


@app.get("/api/expenses/{expense_id}", response_model=Expense)
def get_expense(expense_id: str):
    for e in EXPENSES:
        if e.id == expense_id:
            return e
    raise HTTPException(status_code=404, detail="Expense not found")


@app.post("/api/expenses", response_model=Expense, status_code=201)
def create_expense(data: ExpenseCreate):
    vendor = VENDOR_MAP.get(data.vendor_id)
    if not vendor:
        raise HTTPException(status_code=400, detail="Invalid vendor_id")

    now = datetime.now().isoformat()
    expense = Expense(
        id=f"exp-{uuid.uuid4().hex[:8]}",
        title=data.title,
        amount=data.amount,
        currency=data.currency,
        category=data.category,
        status=ExpenseStatus.DRAFT,
        submitted_by="Current User",
        department=data.department,
        vendor_id=data.vendor_id,
        vendor_name=vendor.name,
        description=data.description,
        receipt_url=data.receipt_url,
        created_at=now,
        updated_at=now,
        tags=data.tags,
        is_recurring=data.is_recurring,
    )
    EXPENSES.append(expense)
    return expense


@app.post("/api/expenses/{expense_id}/submit", response_model=Expense)
def submit_expense(expense_id: str):
    for e in EXPENSES:
        if e.id == expense_id:
            if e.status != ExpenseStatus.DRAFT:
                raise HTTPException(status_code=400, detail="Only draft expenses can be submitted")
            e.status = ExpenseStatus.PENDING
            e.updated_at = datetime.now().isoformat()
            return e
    raise HTTPException(status_code=404, detail="Expense not found")


@app.post("/api/expenses/{expense_id}/approve", response_model=Expense)
def approve_expense(expense_id: str, req: ApprovalRequest):
    for e in EXPENSES:
        if e.id == expense_id:
            if e.status != ExpenseStatus.PENDING:
                raise HTTPException(status_code=400, detail="Only pending expenses can be approved/rejected")
            if req.action == ApprovalAction.APPROVE:
                e.status = ExpenseStatus.APPROVED
                e.approved_by = "Manager User"
            elif req.action == ApprovalAction.REJECT:
                e.status = ExpenseStatus.REJECTED
                e.rejection_reason = req.comment or "No reason provided"
            e.updated_at = datetime.now().isoformat()
            return e
    raise HTTPException(status_code=404, detail="Expense not found")


@app.delete("/api/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: str):
    for i, e in enumerate(EXPENSES):
        if e.id == expense_id:
            if e.status not in [ExpenseStatus.DRAFT, ExpenseStatus.REJECTED]:
                raise HTTPException(status_code=400, detail="Can only delete draft or rejected expenses")
            EXPENSES.pop(i)
            return
    raise HTTPException(status_code=404, detail="Expense not found")


# ── Vendors ──

@app.get("/api/vendors", response_model=list[Vendor])
def get_vendors(
    risk_level: Optional[VendorRisk] = None,
    is_preferred: Optional[bool] = None,
    country: Optional[str] = None,
):
    filtered = VENDORS[:]
    if risk_level:
        filtered = [v for v in filtered if v.risk_level == risk_level]
    if is_preferred is not None:
        filtered = [v for v in filtered if v.is_preferred == is_preferred]
    if country:
        filtered = [v for v in filtered if v.country.lower() == country.lower()]
    return filtered


@app.get("/api/vendors/{vendor_id}", response_model=Vendor)
def get_vendor(vendor_id: str):
    vendor = VENDOR_MAP.get(vendor_id)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor


# ── Budgets ──

@app.get("/api/budgets", response_model=list[Budget])
def get_budgets(
    department: Optional[str] = None,
    category: Optional[ExpenseCategory] = None,
    over_budget_only: bool = False,
):
    filtered = BUDGETS[:]
    if department:
        filtered = [b for b in filtered if b.department.lower() == department.lower()]
    if category:
        filtered = [b for b in filtered if b.category == category]
    if over_budget_only:
        filtered = [b for b in filtered if b.remaining < 0]
    return filtered


# ── Analytics ──

@app.get("/api/analytics/spend-summary", response_model=SpendAnalytics)
def get_spend_analytics():
    approved_or_paid = [e for e in EXPENSES if e.status in [ExpenseStatus.APPROVED, ExpenseStatus.PAID]]
    total = sum(e.amount for e in approved_or_paid)

    by_category: dict[str, float] = {}
    for e in approved_or_paid:
        by_category[e.category.value] = by_category.get(e.category.value, 0) + e.amount

    by_department: dict[str, float] = {}
    for e in approved_or_paid:
        by_department[e.department] = by_department.get(e.department, 0) + e.amount

    by_month: list[dict] = []
    for month_offset in range(6):
        dt = datetime.now() - timedelta(days=30 * month_offset)
        month_key = dt.strftime("%Y-%m")
        month_total = sum(
            e.amount for e in approved_or_paid
            if e.created_at[:7] == month_key
        )
        by_month.append({"month": month_key, "total": round(month_total, 2)})

    top_vendors = sorted(
        [{"vendor": v.name, "total_spend": v.total_spend} for v in VENDORS],
        key=lambda x: x["total_spend"],
        reverse=True,
    )[:5]

    total_decisions = len([e for e in EXPENSES if e.status in [ExpenseStatus.APPROVED, ExpenseStatus.REJECTED, ExpenseStatus.PAID]])
    approved_count = len([e for e in EXPENSES if e.status in [ExpenseStatus.APPROVED, ExpenseStatus.PAID]])
    approval_rate = (approved_count / total_decisions * 100) if total_decisions > 0 else 0

    over_budget_depts = list(set(b.department for b in BUDGETS if b.remaining < 0))

    return SpendAnalytics(
        total_spend=round(total, 2),
        spend_by_category={k: round(v, 2) for k, v in by_category.items()},
        spend_by_department={k: round(v, 2) for k, v in by_department.items()},
        spend_by_month=by_month,
        top_vendors=top_vendors,
        approval_rate=round(approval_rate, 1),
        average_approval_time_hours=round(random.uniform(4, 72), 1),
        budget_utilization_percent=round(random.uniform(60, 95), 1),
        pending_count=len([e for e in EXPENSES if e.status == ExpenseStatus.PENDING]),
        over_budget_departments=over_budget_depts,
    )


# ── Audit Log ──

@app.get("/api/audit-log", response_model=list[AuditLogEntry])
def get_audit_log(
    entity_type: Optional[str] = None,
    user: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
):
    filtered = AUDIT_LOG[:]
    if entity_type:
        filtered = [a for a in filtered if a.entity_type == entity_type]
    if user:
        filtered = [a for a in filtered if a.user.lower() == user.lower()]
    filtered.sort(key=lambda a: a.timestamp, reverse=True)
    return filtered[:limit]


# ── Purchase Orders ──

@app.get("/api/purchase-orders", response_model=list[PurchaseOrder])
def get_purchase_orders(
    status: Optional[str] = None,
    vendor_id: Optional[str] = None,
):
    filtered = PURCHASE_ORDERS[:]
    if status:
        filtered = [po for po in filtered if po.status == status]
    if vendor_id:
        filtered = [po for po in filtered if po.vendor_id == vendor_id]
    return filtered


@app.get("/api/purchase-orders/{po_id}", response_model=PurchaseOrder)
def get_purchase_order(po_id: str):
    for po in PURCHASE_ORDERS:
        if po.id == po_id:
            return po
    raise HTTPException(status_code=404, detail="Purchase order not found")


# ── Dashboard KPIs ──

class DashboardKPIs(BaseModel):
    pending_approvals: int
    pending_total: float
    monthly_spend: float
    total_vendors: int
    active_purchase_orders: int
    over_budget_count: int
    high_risk_vendors: int
    expenses_this_quarter: int


@app.get("/api/dashboard/kpis", response_model=DashboardKPIs)
def get_dashboard_kpis():
    pending = [e for e in EXPENSES if e.status == ExpenseStatus.PENDING]
    approved = [e for e in EXPENSES if e.status in [ExpenseStatus.APPROVED, ExpenseStatus.PAID]]
    over_budget = [b for b in BUDGETS if b.remaining < 0]

    return {
        "pending_approvals": len(pending),
        "pending_total": round(sum(e.amount for e in pending), 2),
        "monthly_spend": round(sum(e.amount for e in approved if e.created_at[:7] == datetime.now().strftime("%Y-%m")), 2),
        "total_vendors": len(VENDORS),
        "active_purchase_orders": len([po for po in PURCHASE_ORDERS if po.status in ["pending", "approved"]]),
        "over_budget_count": len(over_budget),
        "high_risk_vendors": len([v for v in VENDORS if v.risk_level in [VendorRisk.HIGH, VendorRisk.CRITICAL]]),
        "expenses_this_quarter": len([e for e in EXPENSES if e.created_at[:7] >= "2026-01"]),
    }


# ── Currency conversion (mock) ──

EXCHANGE_RATES = {
    "USD": 1.0,
    "CAD": 1.36,
    "EUR": 0.92,
    "GBP": 0.79,
}

class CurrencyConversion(BaseModel):
    original_amount: float
    from_currency: Currency
    to_currency: Currency
    converted_amount: float
    exchange_rate: float


@app.get("/api/currency/convert", response_model=CurrencyConversion)
def convert_currency(
    amount: float = Query(..., gt=0),
    from_currency: Currency = Query(...),
    to_currency: Currency = Query(...),
):
    usd_amount = amount / EXCHANGE_RATES[from_currency.value]
    converted = usd_amount * EXCHANGE_RATES[to_currency.value]
    return {
        "original_amount": amount,
        "from_currency": from_currency,
        "to_currency": to_currency,
        "converted_amount": round(converted, 2),
        "exchange_rate": round(EXCHANGE_RATES[to_currency.value] / EXCHANGE_RATES[from_currency.value], 6),
    }
