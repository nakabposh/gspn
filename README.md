# Samsung Service Center Operations & Analytics Platform (GSPN Suite)

A comprehensive operations suite built for authorized Samsung Service Centers (ASCs), branch coordinators, and service managers to process GSPN raw extracts, audit engineer performance, track turnaround times (TAT), calculate multi-branch closure metrics, and export executive reports.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features & Modules](#key-features--modules)
  - [1. SALT Report (`saltReport.html`)](#1-salt-report-saltreporthtml)
  - [2. Multiple Branches Closer (`multiBranchCloser.html`)](#2-multiple-branches-closer-multibranchcloserhtml)
  - [3. Master Closer (`masterCloser.html`)](#3-master-closer-mastercloserhtml)
  - [4. Report Maker (`reportMaking.html`)](#4-report-maker-reportmakinghtml)
  - [5. Open Pending Calls (`openPending.html`)](#5-open-pending-calls-openpendinghtml)
  - [6. Cancellation Report (`cancellationReport.html`)](#6-cancellation-report-cancellationreporthtml)
  - [7. SVC Information & Master Roster (`svcInformation.html`)](#7-svc-information--master-roster-svcinformationhtml)
- [SALT Report Specification & Logic](#salt-report-specification--logic)
  - [VLOOKUP by EngineerId & Composite Names](#vlookup-by-engineerid--composite-names)
  - [Happy Code Rule](#happy-code-rule)
  - [Turnaround Time (TAT) Buckets](#turnaround-time-tat-buckets)
  - [B2B vs B2C Classification](#b2b-vs-b2c-classification)
  - [Excel Export Architecture](#excel-export-architecture)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
- [Technology Stack](#technology-stack)

---

## 🌟 Overview

Authorized Samsung Service Centers process daily call logs through Samsung's Global Service Partner Network (GSPN). This platform ingests raw GSPN call dumps, cleans text artifacts, enriches records with service center manpower rosters, and produces executive reports with exact brand styling and audit compliance.

---

## 🚀 Key Features & Modules

### 1. SALT Report (`saltReport.html`)
The **Service & Labor Turnaround (SALT)** report tracks technician efficiency, on-site visit speed, repair duration, and Happy Code verification status.
- **Smart Data Import**: Drag-and-drop Excel files (`.xlsx`, `.xls`, `.csv`, `.tsv`) or paste raw tab-separated GSPN tables directly.
- **Auto-VLOOKUP Engine**: Matches each call's `EngineerId` against the active SVC Manpower Roster (`context/manpower.json`) to assign the exact **TL Name** (Team Leader) and **Eng Name** (Engineer Name).
- **100% Unaltered RAW Preservation**: Original raw columns are maintained untouched, with calculated audit columns appended.
- **Executive Three-Sheet Excel Export**: Downloads a publication-ready `.xlsx` with exact Samsung styling:
  1. `TL Summary` (Team Leader aggregated metrics)
  2. `Eng Summary` (Technician breakdown with Happy Code rates)
  3. `RAW` (Centered Gravity data with highlighted TL/Eng anchors)

### 2. Multiple Branches Closer (`multiBranchCloser.html`)
Consolidates daily closure performance across multiple Samsung branches into a unified matrix view.
- Supports multi-dataset ingestion: **Morning Open**, **Today Inflow**, and **Current Open**.
- Segmented service-type toggles: `All Service Types`, `IH + PS` (In-Home & Pick-Up), `IIDM + DM` (Installation & Demo), and `Others`.
- Real-time closure rate recalculation and multi-branch Excel exports.

### 3. Master Closer (`masterCloser.html`)
Deep-dive closure analytics for single-center Consumer Electronics (CE) operations.
- Product-wise breakdown across AC, Refrigerator, Washing Machine, Audio-Visual, and Commercial Displays.
- Generates executive email summaries and formatted tabular outputs for management review.

### 4. Report Maker (`reportMaking.html`)
Multi-source daily workflow builder allowing ASC managers to compare opening backlogs against incoming workloads to track operational velocity.

### 5. Open Pending Calls (`openPending.html`)
Tracks aging tickets, allocation delays, parts backorders, and escalations to reduce turnaround bottlenecks.

### 6. Cancellation Report (`cancellationReport.html`)
Categorizes cancelled and rejected jobs by root cause (customer reschedule, cancellation request, wrong address, technician delay) to monitor operational leakage.

### 7. SVC Information & Master Roster (`svcInformation.html`)
Centralized management console for ASC technician master data (`context/manpower.json`):
- Assigns technicians to Team Leaders (e.g. *Sanjeev, Sandeep, Binod, Harry, Khushi, Ravi, Ramji, Sunil, Jitender, Vikash*).
- Stores unique `EngineerId`, employee codes, contact numbers, and product skillsets.
- Provides REST APIs (`/api/manpower`) to synchronize live changes with the reporting tools.

---

## ⚙️ SALT Report Specification & Logic

### VLOOKUP by EngineerId & Composite Names
The lookup engine dynamically resolves engineer records using a multi-priority resolution algorithm:
1. **Numeric ID Match**: Direct lookup using `EngineerId` (e.g., `8486272728` &rarr; `SOHAN LAL`, TL: `SUNIL`).
2. **Composite Name Deconstruction**: Handles GSPN composite strings like `Sohan Lal - 8486272728` by extracting both the numeric ID and the name portion.
3. **Trade-Cleaned Name Matching**: Strips trade suffixes (`AC`, `REF`, `WM`, `INSTALLER`) to ensure reliable roster binding.
4. **Dynamic Cache**: Newly resolved pairs are cached immediately to optimize batch processing of large call volumes.

### Happy Code Rule
- Samsung evaluates performance only on successfully verified jobs where `HappyCodeVerifyStatus = "Yes"`.
- TAT percentage denominators strictly use the verified Happy Code count (`HC`), eliminating unverified or cancelled calls from the efficiency denominator:
  $$\text{Visit TAT \%} = \frac{\text{Count}(\text{Visit Time } 0\sim 10)}{\text{Total Verified HC Calls}}$$

### Turnaround Time (TAT) Buckets
- **Visit TAT**:
  - `0~10`: Total visit duration &le; 10 minutes.
  - `>10`: Total visit duration > 10 minutes.
- **Service Time TAT**:
  - `0~20`: Total service duration &le; 20 minutes.
  - `>20`: Total service duration > 20 minutes.
- **Minute String Trimming**: Automatically parses text entries like `"74 Minute"`, `" 16 Minute "`, or decimal values into pure numeric minutes.

### B2B vs B2C Classification
Calls are tagged as **B2B** if:
- The `Reason` or `ServiceType` mentions `B2B`, `Commercial`, `IIDM`, or `Corporate`.
- The product model starts with Samsung Commercial display prefixes (e.g., `LH`, `QM`, `QB`, `QH`, `BE`, `OM`).

### Excel Export Architecture
The exported Excel workbook (`.xlsx`) uses `ExcelJS` to enforce strict corporate formatting:
- **Sheet 1 (`TL Summary`)**:
  - Top header: Dark Teal (`#0A4D68`) with white text.
  - Subheaders: Muted Blue (`#0369A1`) and Pale Cyan (`#CFE2FE`).
  - Columns: `TL NAME`, `Total`, `HC`, `HC %`, `Visit 0~10`, `Visit 0~10 %`, `Service 0~20`, `Service 0~20 %`, `B2B Visit`, `B2B Service`.
  - Row height: Fixed at `22pt`.
- **Sheet 2 (`Eng Summary`)**:
  - Technician-level breakdown grouped under each Team Leader.
  - Columns: `ENG NAME`, `TL NAME`, `Total`, `HC`, `HC %`, `Visit 0~10`, `Visit 0~10 %`, `Service 0~20`, `Service 0~20 %`.
  - Row height: Fixed at `22pt`.
- **Sheet 3 (`RAW`)**:
  - **Gravity Center Formatting**: Every data cell is vertically centered and horizontally centered (`vertical: 'middle', horizontal: 'center'`).
  - **Visual Core Anchors**: `TL Name` and `Eng Name` columns are styled with soft blue fill (`#E0F2FE`), bold navy typography (`#0C2340`), and width `18`.
  - Appends audit columns without modifying or trimming any original raw input fields.
  - Row height: Fixed at `22pt`.

---

## 📁 Directory Structure

```plaintext
├── saltReport.html            # Primary SALT Report UI & processing engine
├── multiBranchCloser.html     # Consolidated multi-branch closer dashboard
├── masterCloser.html          # CE single-branch closer analytics
├── reportMaking.html          # Multi-dataset report generator
├── openPending.html           # Open & aging calls tracker
├── cancellationReport.html    # Cancellation & rejected calls auditor
├── svcInformation.html        # ASC Manpower & technician master editor
├── context/
│   └── manpower.json          # Master technician roster (IDs, Names, TLs)
├── assets/
│   ├── js/                    # Shared context and utility scripts
│   └── css/                   # Stylesheets and custom utilities
├── public/
│   └── assets/                # Reference UI templates and sample assets
├── server.ts                  # Express backend & API proxy server (Port 3000)
├── package.json               # Dependencies and scripts
└── README.md                  # System documentation
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm or bun

### Installation
```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install
```

### Running the Application
```bash
# Start the local development server (serves on port 3000)
npm run dev
```

Visit `http://localhost:3000/saltReport.html` in your browser to access the SALT Report.

---

## 💻 Technology Stack

- **Runtime & Backend**: Node.js, Express, TypeScript
- **Styling & UI**: Tailwind CSS, Outfit & Inter typography, responsive glassmorphism design
- **Spreadsheet & Data Processing**:
  - [ExcelJS](https://github.com/exceljs/exceljs) for multi-sheet, brand-formatted `.xlsx` workbook generation
  - [SheetJS (xlsx.full.min.js)](https://sheetjs.com/) for fast multi-format parsing
- **Data Persistence**: Local JSON master file (`context/manpower.json`) with client-side localStorage fallback

---

## 📄 License

This software is developed for Samsung Authorized Service Centers and internal operational management. All rights reserved.
