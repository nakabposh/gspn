# Implementation Plan: Multiple Branches Closer (`multiBranchCloser.html`)

Create a dedicated **Multiple Branches Closer** page that combines the multi-branch workflow from `reportMaking.html` with the robust CE closer calculation logic from `masterCloser.html`. It presents a consolidated multi-branch table, service-type filters (`All`, `IH + PS`, `IIDM + DM`, `Others`), intuitive branch-level data loader dialogs, and styled multi-sheet Excel exports.

---

## 1. User Alignment & Clarified Decisions
- **Page Purpose**: Track and compare closure performance across multiple Samsung service branches in one executive screen.
- **Table Presentation**: Consolidated matrix table displaying one row per branch plus an overall summary total row, with expandable branch details.
- **Service Type Filter**: Dedicated quick-toggle segmented button bar above the table supporting:
  - `All Service Types` (Complete branch workload)
  - `IH + PS` (In-Home & Pick-Up Service)
  - `IIDM + DM` (Initial Installation & Demonstration)
  - `Others` (Customer Care / CC, Carry In, Stock Repair, etc.)
- **Data Loading**: "ADD BRANCH" dialog featuring the standard branch selector from `reportMaking.html` (`GSPN_BRANCHES`) with 3 datasets per branch (`1st Morning Open`, `2nd Today Inflow`, `3rd Current Open`) supporting both spreadsheet file upload (`.ods`, `.xls`, `.xlsx`, `.csv`) and raw pasted text (1-row and 2-row GSPN formats).

---

## 2. Proposed Architecture & UI Layout

### A. Navigation & Top Action Bar
- Synchronized top navigation with dropdowns linking to Home, Report Maker, Open Pending, CE-Service Center Closer, and the new **Multiple Branches Closer**.
- Executive Action Header with:
  - Date selector (defaults to current date in `DD.MM.YYYY` format)
  - Quick action buttons: **Add Branch**, **Load Demo All Branches**, **Copy Report HTML (Email)**, **Export Excel (Multi-Sheet)**, and **Closer Trend Chart**.

### B. Service Type Quick-Toggle Segmented Controls
- Positioned prominently above the main table:
  - `All Service Types` (Default)
  - `IH + PS` (In-Home & Pick-Up Service)
  - `IIDM + DM` (Installation & Demonstration)
  - `Others` (Customer Care & other service codes)
- Instant client-side recalculation of branch closure percentages upon toggle.

### C. Consolidated Multi-Branch Closer Matrix Table
- Headers:
  - `#`
  - `Branch / Service Center` (with Zone & City context)
  - `SVC Code`
  - `Opening (Morning)`
  - `Inflow (Today)`
  - `Total Workload`
  - `Closed Calls`
  - `Current Open`
  - `Closer %` (Color-coded executive badge)
  - `Actions` (Upload / Edit / Remove)
- **Overall Total Row**: Aggregates all active branches with collective closer percentage.
- **Expandable Row Details**: Click on any branch to see its individual product breakdown (`AC`, `REF`, `WM`, `AV`, `Others`, `IIDM - AC`, `IIDM NON AC`, `AC-CC`).

### D. Multi-Branch Closer Modal (`addBranchModal`)
- Branch selection dropdown populated from `assets/js/context.js` (`Ghaziabad`, `Ahmedabad`, `Surat`, `Gandhinagar`, `Cochin`, `Lucknow`, `Gurgaon`, `Custom...`) with automatic SVC Code synchronization.
- Segmented dataset selector: `Morning Open`, `Today Inflow`, `Current Open`.
- Tab 1: **Upload File** (`.ods`, `.xls`, `.xlsx`, `.csv`) with drag-and-drop zone and SheetJS/TSV processing.
- Tab 2: **Paste Text** with support for GSPN 2-row Management Lite layout, 24/25 standard columns, and 18-column formats.
- Instant parse feedback and verification counters before saving.

### E. Excel Export Engine (ExcelJS & SheetJS)
- **Sheet 1: Summary** (Consolidated Multi-Branch Closer matrix with brand headers, styling, and formulas).
- **Sheet 2: MorningOpen** (Raw calls tagged by Branch Name and SVC Code in standard 24-column format).
- **Sheet 3: InFlow** (Raw today flow calls tagged by Branch).
- **Sheet 4: Current** (Raw remaining open calls tagged by Branch).
- **Sheet 5: Closed calls** (Calculated closed calls tagged by Branch for manual auditing).

---

## 3. Files to Create and Update
1. **Create `multiBranchCloser.html`**:
   - Complete HTML, styling, interactive state management, multi-format parser, calculation engine, and export functions.
2. **Update `index.html`**:
   - Add card and link to **Multiple Branches Closer** under Reports.
3. **Update `reportMaking.html` & `masterCloser.html`**:
   - Add **Multiple Branches Closer** in the Reports navigation dropdown.

---

## 4. Verification & Testing
- Validate syntax and clean execution across Node VM.
- Test with user's GSPN 2-row pasted data across branches.
- Verify that filtering by `IH + PS`, `IIDM + DM`, and `Others` accurately adjusts opening, inflow, and closed tallies.
- Confirm full export of all 5 sheets in `.xlsx` format.
- Run `compile_applet` and `lint_applet`.
