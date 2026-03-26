# Procurify Mock Interview — Progressive Feature Build

## Interview Format: "Build the Product"

Unlike traditional question-and-answer interviews, this simulates a real Procurify
live coding session. You are building a **Spend Management Dashboard** from scratch.
Each question adds a feature. Later questions depend on earlier ones. Talk through
your reasoning as you code — that's what the interviewer evaluates.

**Backend**: FastAPI at `http://localhost:8000` (Swagger docs at `/docs`)
**Frontend**: React + TypeScript
**Types**: Pre-defined in `types.ts`
**API helper**: Pre-defined in `api.ts`

---

## Phase 1: Foundation (Questions 1–5)

### Q1 — KPI Dashboard Cards

**Difficulty: ⭐**
Fetch data from `GET /api/dashboard/kpis` and render a row of KPI cards showing:

- Pending Approvals (count + total $)
- Monthly Spend
- Over-Budget Departments
- High-Risk Vendors

Requirements:

- Use `useEffect` + `useState` for data fetching
- Handle loading and error states
- Format currency values with `Intl.NumberFormat`
- Cards should be responsive (CSS Grid or Flexbox)

---

### Q2 — Expense List Table

**Difficulty: ⭐⭐**
Fetch expenses from `GET /api/expenses` and display them in a sortable table.

Requirements:

- Columns: Title, Amount, Currency, Category, Status, Department, Vendor, Date
- Color-code the Status column (green=approved, yellow=pending, red=rejected, gray=draft, blue=paid)
- Clicking a column header should sort by that column (toggle asc/desc)
- Client-side sorting is fine for now
- Show a loading skeleton while data is fetching

---

### Q3 — Status Filter Bar

**Difficulty: ⭐⭐**
Add a horizontal filter bar above the expense table with toggleable status chips.

Requirements:

- Show all `ExpenseStatus` values as filter chips
- Multiple statuses can be active simultaneously
- Show count badge on each chip (e.g., "Pending (7)")
- "All" chip to reset filters
- Filters should update the table in real-time (client-side filtering)
- Animate chip selection with CSS transitions

---

### Q4 — Currency Display with Conversion Tooltip

**Difficulty: ⭐⭐**
When a user hovers over an amount that is NOT in USD, show a tooltip with the
USD-equivalent using `GET /api/currency/convert`.

Requirements:

- Only fetch conversion on hover (not for every row)
- Cache conversions so the same amount+currency pair doesn't re-fetch
- Show a tiny spinner in the tooltip while loading
- Tooltip should position itself correctly (not overflow viewport)
- Handle API errors gracefully in the tooltip

---

### Q5 — Expense Detail Side Panel

**Difficulty: ⭐⭐⭐**
Clicking a row in the expense table opens a slide-in side panel showing full details.

Requirements:

- Fetch full expense data from `GET /api/expenses/{id}`
- Animate the panel sliding in from the right (CSS transitions)
- Show all expense fields in a structured layout
- Display receipt image/link if `receipt_url` is present
- Show tags as styled badges
- Close button + click-outside-to-close + Escape key to close
- Panel should not block interaction with the rest of the page (no modal overlay)

---

## Phase 2: Interactivity (Questions 6–10)

### Q6 — Create Expense Form

**Difficulty: ⭐⭐⭐**
Build a form to create a new expense via `POST /api/expenses`.

Requirements:

- Fields: title, amount, currency (dropdown), category (dropdown), department (dropdown),
  vendor (dropdown fetched from `/api/vendors`), description (textarea), tags (multi-input)
- Client-side validation:
  - Title: 3–200 chars
  - Amount: must be > 0 and ≤ 1,000,000
  - Description: minimum 10 chars
  - All required fields must be filled
- Show inline validation errors (not alerts)
- Submit button disabled until form is valid
- On success: close the form, refresh the expense list, show a success toast
- On error: show error from API response

---

### Q7 — Approval Workflow Actions

**Difficulty: ⭐⭐⭐**
In the expense detail panel (Q5), add Approve/Reject buttons for expenses with
status "pending". Uses `POST /api/expenses/{id}/approve`.

Requirements:

- Only show action buttons when status is "pending"
- "Approve" button: sends `{ action: "approve" }`
- "Reject" button: opens a small modal requiring a rejection reason (min 10 chars)
- Optimistic UI update — change the status immediately, revert on error
- Disable buttons while the request is in flight
- After action: update both the detail panel AND the expense list
- Show confirmation dialog before approving amounts > $10,000

---

### Q8 — Real-Time Search with Debounce

**Difficulty: ⭐⭐⭐**
Add a search input above the table that filters expenses via the API's `search` param.

Requirements:

- Debounce input by 300ms (implement your own, no libraries)
- Show a "searching..." indicator
- Clear button to reset search
- Preserve other active filters (status chips from Q3) alongside search
- Handle the case where a new search fires before the previous one resolves
  (cancel stale requests using AbortController)
- Show "No results" state with a clear message
- Highlight matching text in search results

---

### Q9 — Pagination

**Difficulty: ⭐⭐⭐**
The expense list should paginate using the API's `page` and `page_size` params.

Requirements:

- Show page controls: Previous, page numbers, Next
- Show "Showing X–Y of Z results" text
- Page size selector (10, 25, 50)
- Reset to page 1 when filters or search change
- Preserve pagination state in URL query params (use `useSearchParams` or manual
  `window.history.pushState`)
- Disable Previous/Next when on first/last page

---

### Q10 — Vendor Risk Indicator Component

**Difficulty: ⭐⭐**
Create a reusable `<VendorRiskBadge>` component and integrate it into the expense table.

Requirements:

- Props: `riskLevel: VendorRisk`, `size?: "sm" | "md" | "lg"`
- Color scheme: low=green, medium=yellow, high=orange, critical=red with pulsing animation
- Fetch vendor data from `/api/vendors` and join with expense data by `vendor_id`
- Show the badge next to the vendor name in the table
- Include a tooltip on hover showing vendor details (contract end date, payment terms)
- Memoize the component to prevent unnecessary re-renders

---

## Phase 3: Advanced Patterns (Questions 11–15)

### Q11 — Budget Utilization Bar Chart

**Difficulty: ⭐⭐⭐⭐**
Build a budget visualization component WITHOUT any charting library — pure CSS/SVG.

Requirements:

- Fetch from `GET /api/budgets`
- Horizontal bar chart showing allocated vs. spent for each department
- Bars that exceed 100% should visually overflow with a red danger zone
- Animate bars on mount (CSS animation, not JS)
- Hover effect showing exact numbers
- Group by department, stack by category
- Responsive — bars should scale with container width
- Include a legend

---

### Q12 — Custom `useExpenses` Hook with Caching

**Difficulty: ⭐⭐⭐⭐**
Refactor all expense data fetching into a custom hook.

Requirements:

- `useExpenses(filters)` hook that returns `{ data, loading, error, refetch, totalCount }`
- Implement a simple in-memory cache (keyed by serialized filter params)
- Stale-while-revalidate pattern: return cached data immediately, fetch fresh in background
- Cache invalidation after mutations (create, approve, reject, delete)
- Support `AbortController` for cleanup on unmount
- Deduplication: if the same request is in flight, don't fire a duplicate
- The hook should be composable — used by the table, search, filters, and pagination

---

### Q13 — Drag-and-Drop Expense Prioritization

**Difficulty: ⭐⭐⭐⭐**
Build a Kanban-style board where pending expenses can be drag-and-dropped to change
their priority order. NO external drag libraries.

Requirements:

- Implement using native HTML5 Drag and Drop API
- Three columns: "Low Priority", "Medium Priority", "High Priority"
- Drag expenses between columns
- Visual drag preview (ghost image)
- Drop zone highlight on dragover
- Persist order to local state (no API endpoint for this — client-only)
- Animate cards moving between columns (CSS transitions)
- Touch support for mobile (use pointer events as fallback)
- Accessible keyboard alternative (arrow keys to move between columns)

---

### Q14 — Spend Analytics Dashboard with Drill-Down

**Difficulty: ⭐⭐⭐⭐⭐**
Build an analytics page using `GET /api/analytics/spend-summary`.

Requirements:

- Donut chart (SVG) showing spend by category
  - Clickable segments that drill down to show expenses in that category
  - Animated segment transitions
  - Center text showing total or selected category
- Monthly spend trend line (SVG path)
  - Hover shows exact values per month
  - Smooth bezier curve interpolation between data points
- Top vendors ranked list with progress bars
- Approval metrics: approval rate gauge (SVG arc), avg time
- All charts should be responsive
- Add a department filter that re-renders all charts with filtered data
- No chart libraries allowed — pure SVG + CSS

---

### Q15 — Audit Log with Virtual Scrolling

**Difficulty: ⭐⭐⭐⭐⭐**
Build an audit log viewer using `GET /api/audit-log` with virtual scrolling for
performance. NO external virtualization libraries.

Requirements:

- Implement windowed rendering: only render visible rows + buffer
- Calculate scroll position to determine which items to show
- Fixed row height for simpler calculations
- Smooth scrolling without flicker
- Show timestamp, user, action, entity details in each row
- Filter by action type and user
- Clickable entity_id links back to the expense detail panel
- Handle dynamic data (new audit entries appearing)
- Maintain scroll position when data updates

---

## Phase 4: Architecture & Edge Cases (Questions 16–20)

### Q16 — Error Boundary with Retry & Fallback UI

**Difficulty: ⭐⭐⭐⭐**
Implement a comprehensive error handling strategy.

Requirements:

- Create a React Error Boundary class component
  - Catches render errors in child components
  - Shows a styled fallback UI with error details (in development only)
  - "Retry" button that resets the error state and re-renders children
  - "Report Issue" button (mock — just logs the error)
- Create an `<ApiErrorFallback>` component for API errors
  - Different UI for 404, 400, 500, network errors
  - Exponential backoff retry for 500/network errors (max 3 attempts)
  - Show user-friendly messages, not raw error text
- Wrap major sections of the app with appropriate error boundaries
- Demonstrate error recovery without full page reload

---

### Q17 — Accessibility Audit & ARIA Implementation

**Difficulty: ⭐⭐⭐⭐**
Make the entire application WCAG 2.1 AA compliant.

Requirements:

- All interactive elements must be keyboard navigable (tab order, focus management)
- The expense table must have proper ARIA table roles and `aria-sort` on sorted columns
- The side panel (Q5) must trap focus when open
- Status chips (Q3) must be `role="checkbox"` with `aria-checked`
- Forms (Q6) must have proper `aria-invalid`, `aria-describedby` for errors
- The approval confirmation (Q7) must be a proper ARIA dialog
- Color is never the ONLY indicator (add icons/text alongside colors)
- Screen reader announcements for:
  - Data loading/loaded
  - Filter changes
  - Expense created/approved/rejected
  - Page navigation
- Test with a screen reader or browser accessibility tools

---

### Q18 — Performance Optimization

**Difficulty: ⭐⭐⭐⭐⭐**
Optimize the application for performance.

Requirements:

- Identify and fix unnecessary re-renders using React DevTools Profiler
  (describe what you'd look for)
- Implement `React.memo` on the expense table rows with a custom comparator
- Use `useMemo` for expensive computations (filtering, sorting, analytics calculations)
- Use `useCallback` for event handlers passed as props
- Lazy load the analytics page (Q14) and audit log (Q15) with `React.lazy` + `Suspense`
- Implement code splitting at the route/feature level
- Add `loading="lazy"` for receipt images
- Debounce window resize handlers
- Explain: when would you NOT use `React.memo`? When does memoization hurt?
- Bonus: implement a simple `useTransition` usage for non-urgent state updates

---

### Q19 — State Management Architecture

**Difficulty: ⭐⭐⭐⭐⭐**
Refactor the app to use React Context + useReducer for global state (NO external
state libraries).

Requirements:

- Design a state shape that covers: expenses, filters, pagination, selected expense,
  UI state (panel open, form open, toasts)
- Create a typed reducer with discriminated union action types
- Context provider with memoized value to prevent unnecessary re-renders
- Split into domain-specific contexts (ExpenseContext, UIContext, FilterContext)
  to minimize re-render blast radius
- Custom hooks for each context (`useExpenseState`, `useUIState`, etc.)
- Explain your state management decisions:
  - What goes in context vs. local state?
  - Why split contexts?
  - How do you handle async actions in useReducer?
  - What are the tradeoffs vs. Redux/Zustand?

---

### Q20 — Integration Testing & Edge Cases

**Difficulty: ⭐⭐⭐⭐⭐**
Write comprehensive tests for the application.

Requirements:

- Write tests for the `useExpenses` hook (Q12):
  - Test cache hit/miss scenarios
  - Test stale-while-revalidate behavior
  - Test abort on unmount
  - Test concurrent request deduplication
- Write component tests for the Approval Workflow (Q7):
  - Test optimistic update + rollback on error
  - Test the confirmation dialog for high-value expenses
  - Test that rejected expenses require a reason
- Write tests for the Create Expense Form (Q6):
  - Test all validation rules
  - Test form submission and error handling
  - Test vendor dropdown loading state
- Edge cases to handle and test:
  - What happens if the API returns an expense with an unknown status?
  - What if an expense amount is 0 or negative? (API shouldn't allow it, but what about the UI?)
  - What if the vendor list is empty?
  - What if two users approve the same expense simultaneously?
  - Network disconnection mid-approval
  - Extremely long expense titles / descriptions
  - Currency conversion for the same currency (USD → USD)
  - Browser back button while side panel is open
- Use React Testing Library patterns (no enzyme, no shallow rendering)
- Mock the API using `msw` or manual fetch mocks
