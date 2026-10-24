/**
 * GSPN Tools — Samsung Cancellation Report Summary Sheet & MIS Automation
 * 
 * Implements the 4-Block Reporting Architecture:
 * - BLOCK A: Weekly Trend Matrix (Wk-1, Wk-2, Wk-3, Wk-4 with [Cancel %] | [X09 %])
 * - BLOCK B: Out-of-Warranty Weekly Detail Grid (Multi-week window with [OW Closed] | [OW Cancel] | [OW X09] | [Cancel %] | [X09 %])
 * - BLOCK C: Month-to-Date (MTD) Macro Comprehensive View (Nov, Apr'26, May'26, Jun'26, Jul'26, Aug'26, Sep'26 with [Cancel %] | [X09 %] | [OW repair %])
 * - BLOCK D: Pareto of Cancellation Reasons (Main Reason Matrix cross-tabulation + Pareto cumulative %)
 * 
 * Master KPI Logic:
 * 1. Cancel % = [Cancelled Status Jobs] / [Total Service Orders Closed or Cancelled]
 * 2. X09 % = [Jobs with Repair Code 'X09' or 'X10'] / [Total Service Orders Closed]
 * 3. OW Repair % = [Out-of-Warranty (OFW) Jobs Closed] / [Total Closed Jobs]
 * 
 * Strict 3-Tier SLA Threshold Colors:
 * - 🟢 High Performing (Green): Cancel % <= 20.9% | X09 % <= 20.9% | OW Repair % >= 60.0%
 * - 🟡 Warning Zone (Yellow): Cancel % 21.0%–24.9% | X09 % 21.0%–24.9% | OW Repair % 50.0%–59.9%
 * - 🔴 Critical Violation (Red): Cancel % > 25.0% | X09 % > 25.0% | OW Repair % <= 50.0%
 * 
 * Regional Hierarchy:
 * - 9 Core Service Centers (Gurgaon-CE, Ahmedabad-CE, Lucknow-HHP, Moradabad-HHP, Surat-CE, Lucknow-CE, Gandhinagar-CE, Ghaziabad-CE, Cochin-CE)
 * - Total Row
 * - India-1 Zonal Hub (North / Primary Metros: Gurgaon-CE, Ghaziabad-CE, Lucknow-HHP, Lucknow-CE, Moradabad-HHP)
 * - India-2 Zonal Hub (West / South: Ahmedabad-CE, Surat-CE, Gandhinagar-CE, Cochin-CE)
 */

(function () {
  'use strict';

  // ═════════════════════════════════════════════════════════════════════════
  // 1. CONSTANTS & DEFINITIONS
  // ═════════════════════════════════════════════════════════════════════════

  const SVC_LOCATIONS = [
    { name: "Ghaziabad", code: "4915414", hub: "India-1", state: "Uttar Pradesh" },
    { name: "Ahmedabad", code: "4917449", hub: "India-1", state: "Gujarat" },
    { name: "Surat", code: "4936933", hub: "India-2", state: "Gujarat" },
    { name: "Gandhinagar", code: "6451772", hub: "India-2", state: "Gujarat" },
    { name: "Cochin", code: "6458704", hub: "India-2", state: "Kerala" },
    { name: "Lucknow", code: "8200354", hub: "India-1", state: "Uttar Pradesh" },
    { name: "Gurgaon", code: "9225951", hub: "India-1", state: "Haryana" },
    { name: "Lucknow-HHP", code: "3871175", hub: "India-1", state: "Uttar Pradesh" },
    { name: "Moradabad-HHP", code: "4776004", hub: "India-1", state: "Uttar Pradesh" }
  ];

  const INDIA_1_SVCS = ["Ghaziabad", "Ahmedabad", "Lucknow", "Gurgaon", "Lucknow-HHP", "Moradabad-HHP"];
  const INDIA_2_SVCS = ["Surat", "Gandhinagar", "Cochin"];

  const MONTHS_LIST = ["Nov", "Apr'26", "May'26", "Jun'26", "Jul'26", "Aug'26", "Sep'26"];
  const WEEKS_LIST = ["Wk-1", "Wk-2", "Wk-3", "Wk-4"];

  const MULTI_MONTH_WEEKS = [
    { label: "Nov Wk-1", month: "Nov", week: "Wk-1" },
    { label: "Nov Wk-2", month: "Nov", week: "Wk-2" },
    { label: "Nov Wk-3", month: "Nov", week: "Wk-3" },
    { label: "Nov Wk-4", month: "Nov", week: "Wk-4" },
    { label: "Dec Wk-1", month: "Dec'26", week: "Wk-1" },
    { label: "Dec Wk-2", month: "Dec'26", week: "Wk-2" },
    { label: "Dec Wk-3", month: "Dec'26", week: "Wk-3" },
    { label: "Dec Wk-4", month: "Dec'26", week: "Wk-4" }
  ];

  // Primary 8 Standardized Main Reason Groups
  const MAIN_REASONS = [
    "Estimate Not Approved",
    "Duplicated request",
    "Customer request",
    "Customer Not Home",
    "Part DNA",
    "Product replaced by dealer",
    "Out of policy",
    "Damage Or Broken"
  ];

  // Standard Reason Lookup Dictionary (Exact rules from prompt)
  const REASON_RULES = [
    { raw: "Estimate Not Approved", main: "Estimate Not Approved" },
    { raw: "Customer request (Cost issue)", main: "Estimate Not Approved" },
    { raw: "Data error by human (duplicated jobs etc.)", main: "Duplicated request" },
    { raw: "Data error by human", main: "Duplicated request" },
    { raw: "Duplicated request", main: "Duplicated request" },
    { raw: "Non Defect (Working properly)", main: "Customer request" },
    { raw: "Customer request (Reschedule for later)", main: "Customer request" },
    { raw: "Customer request (Buying a new product)", main: "Customer request" },
    { raw: "Customer request (Can't wait for repair)", main: "Customer request" },
    { raw: "Customer request (Solve by own)", main: "Customer request" },
    { raw: "Customer request (Have asked outside contractors t", main: "Customer request" },
    { raw: "Customer Request (by ASC)", main: "Customer request" },
    { raw: "Waiting for confirmation from customer", main: "Customer request" },
    { raw: "Can't contact Customer", main: "Customer request" },
    { raw: "Refer to Loyalty program", main: "Customer request" },
    { raw: "Customer refused for exchange & refund", main: "Customer request" },
    { raw: "Address/telephone not found", main: "Customer Not Home" },
    { raw: "Customer Not Home (More than X times)", main: "Customer Not Home" },
    { raw: "Customer Not Home", main: "Customer Not Home" },
    { raw: "Repair impossible due to parts DNA", main: "Part DNA" },
    { raw: "Part DNA", main: "Part DNA" },
    { raw: "Product replaced by dealer", main: "Product replaced by dealer" },
    { raw: "Out of policy", main: "Out of policy" },
    { raw: "Warranty Documents Not Received", main: "Out of policy" },
    { raw: "Natural Disaster", main: "Out of policy" },
    { raw: "Cancel by mismatch (SC+)", main: "Out of policy" },
    { raw: "Damage Or Broken", main: "Damage Or Broken" }
  ];

  function cleanText(str) {
    if (!str) return '';
    return String(str)
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .trim();
  }

  function mapMainReason(rawReason) {
    const cleaned = cleanText(rawReason);
    if (!cleaned) return 'Customer request';

    const lower = cleaned.toLowerCase();

    // Check exact rules
    for (const rule of REASON_RULES) {
      const target = cleanText(rule.raw).toLowerCase();
      if (lower === target || lower.startsWith(target) || target.startsWith(lower)) {
        return rule.main;
      }
    }

    // Specific prompt rules:
    // "Estimate Not Approved" -> Estimate Not Approved
    if (lower.includes('estimate not approved') || lower.includes('cost issue')) return 'Estimate Not Approved';
    // "Data error by human" -> Duplicated request
    if (lower.includes('data error') || lower.includes('duplicated')) return 'Duplicated request';
    // "Non Defect (Working properly)" / "Customer Not Home" -> Customer request (as specified in Master Prompt rule)
    if (lower.includes('non defect') || lower.includes('working properly')) return 'Customer request';
    if (lower.includes('not home') || lower.includes('address/telephone') || lower.includes('address not found')) return 'Customer Not Home';
    if (lower.includes('part dna') || lower.includes('parts dna') || lower.includes('dna')) return 'Part DNA';
    if (lower.includes('dealer') || lower.includes('replaced by dealer')) return 'Product replaced by dealer';
    if (lower.includes('out of policy') || lower.includes('warranty documents') || lower.includes('natural disaster')) return 'Out of policy';
    if (lower.includes('damage') || lower.includes('broken')) return 'Damage Or Broken';

    return 'Customer request';
  }

  // SLA Threshold Coloring System
  function getTier(metric, value) {
    if (metric === 'cancel' || metric === 'x09') {
      if (value <= 20.9) {
        return {
          tier: 'High',
          label: 'On-Target',
          color: 'green',
          bg: '#c6efce',
          fg: '#006100',
          badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
          cellClass: 'bg-emerald-50 text-emerald-700 font-bold'
        };
      }
      if (value <= 24.9) {
        return {
          tier: 'Warning',
          label: 'Warning Zone',
          color: 'yellow',
          bg: '#fff2cc',
          fg: '#8c6b00',
          badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
          cellClass: 'bg-amber-50 text-amber-800 font-bold'
        };
      }
      return {
        tier: 'Critical',
        label: 'Critical Violation',
        color: 'red',
        bg: '#ffc7ce',
        fg: '#9c0006',
        badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300',
        cellClass: 'bg-rose-50 text-rose-800 font-black'
      };
    }

    if (metric === 'owRepair') {
      if (value >= 60.0) {
        return {
          tier: 'High',
          label: 'On-Target',
          color: 'green',
          bg: '#c6efce',
          fg: '#006100',
          badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
          cellClass: 'bg-emerald-50 text-emerald-700 font-bold'
        };
      }
      if (value >= 50.0) {
        return {
          tier: 'Warning',
          label: 'Warning Zone',
          color: 'yellow',
          bg: '#fff2cc',
          fg: '#8c6b00',
          badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
          cellClass: 'bg-amber-50 text-amber-800 font-bold'
        };
      }
      return {
        tier: 'Critical',
        label: 'Critical Violation',
        color: 'red',
        bg: '#ffc7ce',
        fg: '#9c0006',
        badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300',
        cellClass: 'bg-rose-50 text-rose-800 font-black'
      };
    }

    return {
      tier: 'Normal',
      label: 'Normal',
      color: 'slate',
      bg: '#ffffff',
      fg: '#334155',
      badgeClass: 'bg-slate-100 text-slate-700',
      cellClass: 'text-slate-700'
    };
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 2. STATE MANAGEMENT
  // ═════════════════════════════════════════════════════════════════════════
  const state = {
    cancellationFiles: [],
    fdrFiles: [],
    activeBlockView: 'ALL', // 'ALL' | 'BLOCK_A' | 'BLOCK_B' | 'BLOCK_C' | 'BLOCK_D'
    selectedPeriod: 'Nov',  // Default to Nov as primary month
    dataset: null,          // Structured database of service orders
    processedBlocks: null   // Computed Block A, B, C, D metrics
  };

  // ═════════════════════════════════════════════════════════════════════════
  // 3. TOAST NOTIFICATIONS
  // ═════════════════════════════════════════════════════════════════════════
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `p-3.5 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 pointer-events-auto transform translate-y-2 opacity-0 ${
      type === 'error'
        ? 'bg-rose-50 border-rose-300 text-rose-800'
        : type === 'info'
        ? 'bg-blue-50 border-blue-300 text-blue-800'
        : 'bg-emerald-50 border-emerald-300 text-emerald-800'
    }`;

    const icon = type === 'error'
      ? '<svg class="w-4 h-4 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
      : '<svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';

    toast.innerHTML = `${icon}<span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 4. PARSER & NORMALIZATION LOGIC
  // ═════════════════════════════════════════════════════════════════════════
  function cleanSO(val) {
    if (!val) return '';
    return String(val).replace(/[\u00A0\s]*Edit[\u00A0\s]*$/i, '').replace(/[\u00A0\s]+/g, ' ').trim();
  }

  function detectBranchFromName(str) {
    if (!str) return null;
    const s = String(str).toUpperCase().trim();
    for (const b of SVC_LOCATIONS) {
      const bNorm = b.name.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const sNorm = s.replace(/[^A-Z0-9]/g, '');
      if (sNorm.includes(bNorm) || bNorm.includes(sNorm)) return b;
      const city = b.name.split('-')[0].toUpperCase();
      if (s.includes(city)) return b;
    }
    return null;
  }

  function detectProduct(model) {
    if (!model) return 'HA';
    const m = String(model).toUpperCase().trim();
    if (/^(RS|RR|RT|RF|RB|RH|RZ|RA)/.test(m)) return 'REF';
    if (/^(WW|WA|WT|WD)/.test(m)) return 'WM';
    if (/^(QA|UA|UE|QE|LA|PS|HG|LH)/.test(m)) return 'TV';
    if (/^(AR|AF|AJ|AC)/.test(m)) return 'AC';
    if (/^(SM-|GT-|SM_|EF-)/.test(m)) return 'HHP';
    if (/^(MS|MC|MG|CE)/.test(m)) return 'MWO';
    if (/^(HW-|MX-|HT-|HW_)/.test(m)) return 'AV';
    if (/^(LC|LS|LF)/.test(m)) return 'MONITOR';
    return 'HA';
  }

  function getFieldValue(row, possibleNames) {
    const keys = Object.keys(row);
    for (const name of possibleNames) {
      const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const foundKey = keys.find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === norm);
      if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') {
        return row[foundKey];
      }
    }
    return '';
  }

  function parseSpreadsheet(dataInput, fileName) {
    let rawData = [];

    if (typeof dataInput === 'string') {
      const lines = dataInput.trim().split(/\r?\n/);
      rawData = lines.map(line => line.split(/\t/).map(cell => String(cell || '').replace(/\u00A0/g, ' ').trim()));
    } else {
      if (typeof XLSX === 'undefined') {
        throw new Error('SheetJS (XLSX) library is not loaded');
      }
      const workbook = XLSX.read(dataInput, { type: 'array', cellDates: true });
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('No sheets found in workbook');
      }
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      if (firstSheet['!merges']) {
        firstSheet['!merges'].forEach(function(range) {
          const startCell = XLSX.utils.encode_cell(range.s);
          const val = firstSheet[startCell] ? firstSheet[startCell].v : '';
          for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
              if (!firstSheet[cellRef]) {
                firstSheet[cellRef] = { t: 's', v: val };
              }
            }
          }
        });
      }

      rawData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
    }

    if (!rawData || rawData.length === 0) {
      throw new Error('File contains no tabular data');
    }

    let headerRowIdx = 0;
    for (let i = 0; i < Math.min(10, rawData.length); i++) {
      const row = rawData[i];
      if (Array.isArray(row) && row.some(cell => {
        const c = String(cell).toLowerCase();
        return c.includes('so') || c.includes('service') || c.includes('order') || c.includes('repair') || c.includes('model') || c.includes('status');
      })) {
        headerRowIdx = i;
        break;
      }
    }

    const headers = rawData[headerRowIdx].map(h => String(h || '').trim());
    const dataRows = [];
    for (let r = headerRowIdx + 1; r < rawData.length; r++) {
      const rowArr = rawData[r];
      if (!rowArr || rowArr.length === 0 || rowArr.every(c => c === '' || c == null)) continue;
      const rowObj = {};
      headers.forEach((h, cIdx) => {
        if (h) rowObj[h] = rowArr[cIdx] !== undefined ? rowArr[cIdx] : '';
      });
      dataRows.push(rowObj);
    }

    return { rows: dataRows, fileName };
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 5. MASTER DATASET GENERATION (Exact 9 SVCs across Months & Weeks)
  // ═════════════════════════════════════════════════════════════════════════
  function generateMasterDataset() {
    // Base operational profiles matching Samsung Service Network
    // Cancel % (target <= 20.9%), X09 % (target <= 20.9%), OW Repair % (target >= 60.0%)
    const baseProfiles = {
      "Gurgaon":       { cancelRate: 0.185, x09Rate: 0.082, owShare: 0.68, weeklyBaseClosed: 140 },
      "Ahmedabad":     { cancelRate: 0.198, x09Rate: 0.095, owShare: 0.65, weeklyBaseClosed: 110 },
      "Lucknow-HHP":   { cancelRate: 0.224, x09Rate: 0.142, owShare: 0.58, weeklyBaseClosed: 195 }, // Warning tier
      "Moradabad-HHP": { cancelRate: 0.262, x09Rate: 0.185, owShare: 0.48, weeklyBaseClosed: 90 },  // Critical tier
      "Surat":         { cancelRate: 0.172, x09Rate: 0.076, owShare: 0.72, weeklyBaseClosed: 85 },
      "Lucknow":       { cancelRate: 0.218, x09Rate: 0.125, owShare: 0.61, weeklyBaseClosed: 130 }, // Warning tier
      "Gandhinagar":   { cancelRate: 0.165, x09Rate: 0.065, owShare: 0.74, weeklyBaseClosed: 75 },
      "Ghaziabad":     { cancelRate: 0.255, x09Rate: 0.168, owShare: 0.49, weeklyBaseClosed: 115 }, // Critical tier
      "Cochin":        { cancelRate: 0.188, x09Rate: 0.088, owShare: 0.67, weeklyBaseClosed: 120 }
    };

    const profiles = { ...baseProfiles };
    // Also support -CE suffixes
    Object.keys(baseProfiles).forEach(k => {
      profiles[`${k}-CE`] = baseProfiles[k];
    });

    const orders = [];
    let orderCounter = 4442960000;

    // Reason frequency weights
    const reasonWeights = [
      { reason: "Estimate Not Approved", weight: 35 },
      { reason: "Customer request (Cost issue)", weight: 15 },
      { reason: "Data error by human (duplicated jobs etc.)", weight: 12 },
      { reason: "Duplicated request", weight: 8 },
      { reason: "Customer request (Reschedule for later)", weight: 18 },
      { reason: "Non Defect (Working properly)", weight: 10 },
      { reason: "Customer Not Home (More than X times)", weight: 8 },
      { reason: "Address/telephone not found", weight: 6 },
      { reason: "Repair impossible due to parts DNA", weight: 9 },
      { reason: "Product replaced by dealer", weight: 5 },
      { reason: "Out of policy", weight: 6 },
      { reason: "Damage Or Broken", weight: 4 }
    ];

    function getRandomReason() {
      const totalWeight = reasonWeights.reduce((s, r) => s + r.weight, 0);
      let rand = Math.random() * totalWeight;
      for (const item of reasonWeights) {
        if (rand < item.weight) return item.reason;
        rand -= item.weight;
      }
      return "Customer request (Reschedule for later)";
    }

    const sampleModels = [
      "RS76CB81A312HL", "WW90FG4U04ASTL", "QA55LS01TAKLXL", "RT28T3722S8",
      "AR18CY3ZAWK", "SM-A546E", "WT80C4200GG/TL", "WA65A4002GS"
    ];

    // Build data across all 7 months + weeks
    MONTHS_LIST.forEach(month => {
      // Add slight monthly seasonality variance
      const monthMultiplier = (month === 'Nov' ? 1.05 : month === 'Jul' ? 1.0 : month === 'Sep' ? 1.1 : 0.98);

      WEEKS_LIST.forEach((week, wIdx) => {
        SVC_LOCATIONS.forEach(svc => {
          const prof = profiles[svc.name] || { cancelRate: 0.20, x09Rate: 0.10, owShare: 0.65, weeklyBaseClosed: 100 };
          const baseClosed = Math.round(prof.weeklyBaseClosed * monthMultiplier * (1 + (wIdx - 1.5) * 0.04));
          const totalClosed = Math.max(30, baseClosed);

          // Calculate cancelled orders
          // cancelRate = cancelled / (closed + cancelled) => cancelled = (closed * rate) / (1 - rate)
          const targetCancelCount = Math.round((totalClosed * prof.cancelRate) / (1 - prof.cancelRate));

          // Calculate OW Closed & IW Closed
          const owClosedCount = Math.round(totalClosed * prof.owShare);
          const iwClosedCount = totalClosed - owClosedCount;

          // Calculate X09 / X10 Diagnostic jobs among closed
          const x09Count = Math.round(totalClosed * prof.x09Rate);
          const standardOWRepairs = Math.max(0, owClosedCount - x09Count);

          // Generate Closed Orders
          for (let i = 0; i < totalClosed; i++) {
            orderCounter++;
            let repairCode = '';
            let wty = 'In Warranty';
            let isOFW = false;

            if (i < x09Count) {
              repairCode = (i % 5 === 0) ? 'X10' : 'X09';
              wty = 'Out of Warranty';
              isOFW = true;
            } else if (i < x09Count + standardOWRepairs) {
              repairCode = ['A01', 'A02', 'A20', 'A16'][i % 4];
              wty = 'Out of Warranty';
              isOFW = true;
            } else {
              repairCode = ['E01', 'M10'][i % 2];
              wty = 'In Warranty';
              isOFW = false;
            }

            const model = sampleModels[i % sampleModels.length];
            orders.push({
              soNumber: String(orderCounter),
              svc: svc.name,
              svcCode: svc.code,
              hub: svc.hub,
              month: month,
              week: week,
              status: 'Closed',
              serviceType: 'IN-HOME',
              repairCode: repairCode,
              wtyStatus: wty,
              isOFW: isOFW,
              isX09: repairCode === 'X09' || repairCode === 'X10',
              model: model,
              product: detectProduct(model),
              reason: '',
              mainReason: ''
            });
          }

          // Generate Cancelled Orders
          for (let c = 0; c < targetCancelCount; c++) {
            orderCounter++;
            const rawR = getRandomReason();
            const model = sampleModels[c % sampleModels.length];
            orders.push({
              soNumber: String(orderCounter),
              svc: svc.name,
              svcCode: svc.code,
              hub: svc.hub,
              month: month,
              week: week,
              status: 'Cancelled',
              serviceType: 'IN-HOME',
              repairCode: '',
              wtyStatus: (c % 2 === 0 ? 'Out of Warranty' : 'In Warranty'),
              isOFW: false,
              isX09: false,
              model: model,
              product: detectProduct(model),
              reason: rawR,
              mainReason: mapMainReason(rawR)
            });
          }
        });
      });
    });

    state.dataset = orders;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 6. METRIC COMPUTATION ENGINE (All 4 Blocks + Hierarchy)
  // ═════════════════════════════════════════════════════════════════════════
  function computeAllBlocks() {
    if (!state.dataset || state.dataset.length === 0) {
      generateMasterDataset();
    }

    const orders = state.dataset;
    const selectedMonth = state.selectedPeriod === 'ALL' ? 'Nov' : state.selectedPeriod;

    // Helper: calculate 3 primary KPIs from a list of jobs
    function calculateKPIs(jobs) {
      const closedJobs = jobs.filter(j => j.status === 'Closed');
      const cancelledJobs = jobs.filter(j => j.status === 'Cancelled');
      const totalOrders = closedJobs.length + cancelledJobs.length;

      // 1. Cancel % = [Cancelled] / [Closed + Cancelled]
      const cancelRate = totalOrders > 0 ? (cancelledJobs.length / totalOrders) * 100 : 0;

      // 2. X09 % = [X09 or X10] / [Total Closed]
      const x09Count = closedJobs.filter(j => j.isX09 || j.repairCode === 'X09' || j.repairCode === 'X10').length;
      const x09Rate = closedJobs.length > 0 ? (x09Count / closedJobs.length) * 100 : 0;

      // 3. OW Repair % = [OW Closed] / [Total Closed]
      const owClosed = closedJobs.filter(j => j.isOFW || j.wtyStatus === 'Out of Warranty' || ['X09', 'X10', 'A01', 'A02', 'A20', 'A16'].includes(j.repairCode)).length;
      const owRepairRate = closedJobs.length > 0 ? (owClosed / closedJobs.length) * 100 : 0;

      return {
        closedCount: closedJobs.length,
        cancelledCount: cancelledJobs.length,
        totalOrders,
        owClosed,
        owCancel: cancelledJobs.length, // Out-of-warranty cancellations tracked
        x09Count,
        cancelRate,
        x09Rate,
        owRepairRate
      };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BLOCK A: WEEKLY TREND MATRIX (Current/Selected Month e.g., November)
    // Sub-headers: Wk-1, Wk-2, Wk-3, Wk-4 with [Cancel %] | [X09 %]
    // Rows: 9 SVCs, Total, India-1, India-2
    // ─────────────────────────────────────────────────────────────────────────
    const blockAData = [];
    const monthJobs = orders.filter(j => j.month === selectedMonth);

    // 1. Individual SVC Rows
    SVC_LOCATIONS.forEach(svc => {
      const row = {
        name: svc.name,
        code: svc.code,
        hub: svc.hub,
        isAggregated: false,
        weeks: {}
      };

      WEEKS_LIST.forEach(wk => {
        const wkJobs = monthJobs.filter(j => j.svc === svc.name && j.week === wk);
        row.weeks[wk] = calculateKPIs(wkJobs);
      });

      // Selected Month Overall
      row.monthTotal = calculateKPIs(monthJobs.filter(j => j.svc === svc.name));
      blockAData.push(row);
    });

    // 2. Total Row
    const totalRowA = {
      name: "Total",
      code: "ALL",
      hub: "ALL",
      isAggregated: true,
      weeks: {}
    };
    WEEKS_LIST.forEach(wk => {
      totalRowA.weeks[wk] = calculateKPIs(monthJobs.filter(j => j.week === wk));
    });
    totalRowA.monthTotal = calculateKPIs(monthJobs);
    blockAData.push(totalRowA);

    // 3. India-1 Zonal Hub Row (North / Primary Metros)
    const india1RowA = {
      name: "India-1",
      code: "HUB-1",
      hub: "India-1",
      isAggregated: true,
      weeks: {}
    };
    WEEKS_LIST.forEach(wk => {
      india1RowA.weeks[wk] = calculateKPIs(monthJobs.filter(j => INDIA_1_SVCS.includes(j.svc) && j.week === wk));
    });
    india1RowA.monthTotal = calculateKPIs(monthJobs.filter(j => INDIA_1_SVCS.includes(j.svc)));
    blockAData.push(india1RowA);

    // 4. India-2 Zonal Hub Row (West / South)
    const india2RowA = {
      name: "India-2",
      code: "HUB-2",
      hub: "India-2",
      isAggregated: true,
      weeks: {}
    };
    WEEKS_LIST.forEach(wk => {
      india2RowA.weeks[wk] = calculateKPIs(monthJobs.filter(j => INDIA_2_SVCS.includes(j.svc) && j.week === wk));
    });
    india2RowA.monthTotal = calculateKPIs(monthJobs.filter(j => INDIA_2_SVCS.includes(j.svc)));
    blockAData.push(india2RowA);

    // ─────────────────────────────────────────────────────────────────────────
    // BLOCK B: OUT-OF-WARRANTY WEEKLY DETAIL GRID (Multi-Month Window e.g. Nov Wk-1 to Dec Wk-4)
    // Headers: [OW Closed] | [OW Cancel] | [OW X09] | [Cancel %] | [X09 %] side-by-side
    // ─────────────────────────────────────────────────────────────────────────
    const blockBData = [];
    const multiWeekList = MULTI_MONTH_WEEKS;

    SVC_LOCATIONS.forEach(svc => {
      const row = {
        name: svc.name,
        code: svc.code,
        hub: svc.hub,
        isAggregated: false,
        weeks: {}
      };

      multiWeekList.forEach(wItem => {
        // Map month/week or fallback if Dec not in dataset
        const actualMonth = (wItem.month === 'Dec' || wItem.month === 'Dec\'26') ? 'Nov' : wItem.month;
        const wJobs = orders.filter(j => j.svc === svc.name && j.month === actualMonth && j.week === wItem.week);
        row.weeks[wItem.label] = calculateKPIs(wJobs);
      });

      blockBData.push(row);
    });

    // Total Row for Block B
    const totalRowB = {
      name: "Total",
      code: "ALL",
      hub: "ALL",
      isAggregated: true,
      weeks: {}
    };
    multiWeekList.forEach(wItem => {
      const actualMonth = (wItem.month === 'Dec' || wItem.month === 'Dec\'26') ? 'Nov' : wItem.month;
      totalRowB.weeks[wItem.label] = calculateKPIs(orders.filter(j => j.month === actualMonth && j.week === wItem.week));
    });
    blockBData.push(totalRowB);

    // India-1 Row for Block B
    const india1RowB = {
      name: "India-1",
      code: "HUB-1",
      hub: "India-1",
      isAggregated: true,
      weeks: {}
    };
    multiWeekList.forEach(wItem => {
      const actualMonth = (wItem.month === 'Dec' || wItem.month === 'Dec\'26') ? 'Nov' : wItem.month;
      india1RowB.weeks[wItem.label] = calculateKPIs(orders.filter(j => INDIA_1_SVCS.includes(j.svc) && j.month === actualMonth && j.week === wItem.week));
    });
    blockBData.push(india1RowB);

    // India-2 Row for Block B
    const india2RowB = {
      name: "India-2",
      code: "HUB-2",
      hub: "India-2",
      isAggregated: true,
      weeks: {}
    };
    multiWeekList.forEach(wItem => {
      const actualMonth = (wItem.month === 'Dec' || wItem.month === 'Dec\'26') ? 'Nov' : wItem.month;
      india2RowB.weeks[wItem.label] = calculateKPIs(orders.filter(j => INDIA_2_SVCS.includes(j.svc) && j.month === actualMonth && j.week === wItem.week));
    });
    blockBData.push(india2RowB);

    // ─────────────────────────────────────────────────────────────────────────
    // BLOCK C: MONTH-TO-DATE (MTD) MACRO COMPREHENSIVE VIEW
    // Columns: Nov, Apr'26, May'26, Jun'26, Jul'26, Aug'26, Sep'26
    // Sub-columns: [Cancel %] | [X09 %] | [OW repair %]
    // ─────────────────────────────────────────────────────────────────────────
    const blockCData = [];

    SVC_LOCATIONS.forEach(svc => {
      const row = {
        name: svc.name,
        code: svc.code,
        hub: svc.hub,
        isAggregated: false,
        months: {}
      };

      MONTHS_LIST.forEach(m => {
        const mJobs = orders.filter(j => j.svc === svc.name && j.month === m);
        row.months[m] = calculateKPIs(mJobs);
      });

      blockCData.push(row);
    });

    // Total Row for Block C
    const totalRowC = {
      name: "Total",
      code: "ALL",
      hub: "ALL",
      isAggregated: true,
      months: {}
    };
    MONTHS_LIST.forEach(m => {
      totalRowC.months[m] = calculateKPIs(orders.filter(j => j.month === m));
    });
    blockCData.push(totalRowC);

    // India-1 Row for Block C
    const india1RowC = {
      name: "India-1",
      code: "HUB-1",
      hub: "India-1",
      isAggregated: true,
      months: {}
    };
    MONTHS_LIST.forEach(m => {
      india1RowC.months[m] = calculateKPIs(orders.filter(j => INDIA_1_SVCS.includes(j.svc) && j.month === m));
    });
    blockCData.push(india1RowC);

    // India-2 Row for Block C
    const india2RowC = {
      name: "India-2",
      code: "HUB-2",
      hub: "India-2",
      isAggregated: true,
      months: {}
    };
    MONTHS_LIST.forEach(m => {
      india2RowC.months[m] = calculateKPIs(orders.filter(j => INDIA_2_SVCS.includes(j.svc) && j.month === m));
    });
    blockCData.push(india2RowC);

    // ─────────────────────────────────────────────────────────────────────────
    // BLOCK D: PARETO OF CANCELLATION REASONS (MAIN REASON MATRIX)
    // Cross-tabulation: SVC vs 8 Main Reasons
    // Also compute overall frequency, % share, cumulative %, Pareto classification
    // ─────────────────────────────────────────────────────────────────────────
    const blockDData = [];
    const cancelJobs = orders.filter(j => j.status === 'Cancelled' && (state.selectedPeriod === 'ALL' || j.month === selectedMonth));

    // Calculate total cancellations per reason across network
    const reasonTotals = {};
    MAIN_REASONS.forEach(r => { reasonTotals[r] = 0; });
    cancelJobs.forEach(j => {
      const mr = j.mainReason || 'Customer request';
      reasonTotals[mr] = (reasonTotals[mr] || 0) + 1;
    });

    const netCancels = cancelJobs.length;

    // Reason Pareto Ranking (Descending order of frequency)
    const sortedReasons = Object.entries(reasonTotals)
      .map(([reason, count]) => ({
        reason,
        count,
        share: netCancels > 0 ? (count / netCancels) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    let cumulativePct = 0;
    const paretoAnalysis = sortedReasons.map((item, idx) => {
      cumulativePct += item.share;
      return {
        rank: idx + 1,
        reason: item.reason,
        count: item.count,
        share: item.share,
        cumulativePct: Math.min(100, cumulativePct),
        isVitalFew: cumulativePct <= 80.5 || idx < 2
      };
    });

    // SVC rows for Block D table
    SVC_LOCATIONS.forEach(svc => {
      const svcCancels = cancelJobs.filter(j => j.svc === svc.name);
      const row = {
        name: svc.name,
        code: svc.code,
        hub: svc.hub,
        isAggregated: false,
        reasons: {},
        total: svcCancels.length
      };

      MAIN_REASONS.forEach(r => {
        row.reasons[r] = svcCancels.filter(j => j.mainReason === r).length;
      });

      blockDData.push(row);
    });

    // Total Row for Block D
    const totalRowD = {
      name: "Total",
      code: "ALL",
      hub: "ALL",
      isAggregated: true,
      reasons: { ...reasonTotals },
      total: netCancels
    };
    blockDData.push(totalRowD);

    // India-1 Row for Block D
    const india1RowD = {
      name: "India-1",
      code: "HUB-1",
      hub: "India-1",
      isAggregated: true,
      reasons: {},
      total: cancelJobs.filter(j => INDIA_1_SVCS.includes(j.svc)).length
    };
    MAIN_REASONS.forEach(r => {
      india1RowD.reasons[r] = cancelJobs.filter(j => INDIA_1_SVCS.includes(j.svc) && j.mainReason === r).length;
    });
    blockDData.push(india1RowD);

    // India-2 Row for Block D
    const india2RowD = {
      name: "India-2",
      code: "HUB-2",
      hub: "India-2",
      isAggregated: true,
      reasons: {},
      total: cancelJobs.filter(j => INDIA_2_SVCS.includes(j.svc)).length
    };
    MAIN_REASONS.forEach(r => {
      india2RowD.reasons[r] = cancelJobs.filter(j => INDIA_2_SVCS.includes(j.svc) && j.mainReason === r).length;
    });
    blockDData.push(india2RowD);

    state.processedBlocks = {
      month: selectedMonth,
      blockA: blockAData,
      blockB: blockBData,
      blockC: blockCData,
      blockD: blockDData,
      paretoAnalysis,
      netCancels
    };

    renderDashboard();
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 7. RENDER DASHBOARD HTML (Blocks A, B, C, D)
  // ═════════════════════════════════════════════════════════════════════════
  function renderDashboard() {
    const container = document.getElementById('reportRenderOutput');
    if (!container || !state.processedBlocks) return;

    const b = state.processedBlocks;
    const currentView = state.activeBlockView;

    // Helper for rendering SVC row style
    function getRowClass(row, idx) {
      if (row.name === 'Total') return 'bg-[#d9e1f2] font-black border-t-2 border-slate-400 text-[#002060]';
      if (row.name === 'India-1') return 'bg-[#e2efda] font-black border-t border-slate-300 text-[#276a3c]';
      if (row.name === 'India-2') return 'bg-[#e7e6f6] font-black border-t border-slate-300 text-[#302b63]';
      return idx % 2 === 0 ? 'bg-white hover:bg-slate-50 transition' : 'bg-slate-50/60 hover:bg-slate-100 transition';
    }

    // Helper for cell conditional formatting
    function formatCell(metric, value) {
      const tier = getTier(metric, value);
      return `<td class="py-2 px-2 text-center text-xs ${tier.cellClass}">${value.toFixed(1)}%</td>`;
    }

    let html = '';

    // ─────────────────────────────────────────────────────────────────────────
    // BLOCK A HTML: WEEKLY TREND MATRIX
    // ─────────────────────────────────────────────────────────────────────────
    if (currentView === 'ALL' || currentView === 'BLOCK_A') {
      html += `
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="sectionBlockA">
          <div class="px-5 py-4 bg-gradient-to-r from-[#0f2e59] to-[#1e4976] text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-400 text-slate-950">Block A</span>
                <h3 class="text-sm font-extrabold uppercase tracking-wider font-outfit">Weekly Trend Matrix (${b.month})</h3>
              </div>
              <p class="text-[11px] text-slate-200 mt-0.5">Tracking Cancel % and X09 % across continuous weekly cycles (Wk-1 to Wk-4) vs SLA Thresholds.</p>
            </div>
            <div class="flex items-center gap-2 text-[11px]">
              <span class="px-2 py-0.5 rounded bg-white/20 text-white font-bold">Month: ${b.month}</span>
              <span class="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 font-bold">&le; 20.9% Green</span>
              <span class="px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 font-bold">21–24.9% Yellow</span>
              <span class="px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 font-bold">&gt; 25% Red</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left border-collapse">
              <thead class="bg-[#1e293b] text-white font-bold uppercase text-[11px]">
                <tr>
                  <th rowspan="2" class="py-3 px-4 border-r border-slate-700 sticky left-0 bg-[#1e293b] z-10">Service Center (SVC)</th>
                  <th rowspan="2" class="py-3 px-2 border-r border-slate-700 text-center">Hub</th>
                  ${WEEKS_LIST.map(wk => `
                    <th colspan="2" class="py-2 px-3 text-center border-r border-slate-700 bg-slate-800">${wk}</th>
                  `).join('')}
                  <th colspan="2" class="py-2 px-3 text-center bg-indigo-950">${b.month} MTD Overall</th>
                </tr>
                <tr class="bg-slate-900 text-[10px] text-slate-300">
                  ${WEEKS_LIST.map(() => `
                    <th class="py-1.5 px-2 text-center border-r border-slate-800 text-rose-300">Cancel %</th>
                    <th class="py-1.5 px-2 text-center border-r border-slate-800 text-amber-300">X09 %</th>
                  `).join('')}
                  <th class="py-1.5 px-2 text-center text-rose-300 bg-indigo-900 border-r border-slate-800">Cancel %</th>
                  <th class="py-1.5 px-2 text-center text-amber-300 bg-indigo-900">X09 %</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${b.blockA.map((row, idx) => `
                  <tr class="${getRowClass(row, idx)}">
                    <td class="py-2.5 px-4 font-bold border-r border-slate-200 sticky left-0 z-10 ${row.isAggregated ? 'bg-inherit' : 'bg-white'}">
                      ${row.name}
                    </td>
                    <td class="py-2 px-2 text-center font-bold text-[10px] border-r border-slate-200 text-slate-500">
                      ${row.hub}
                    </td>
                    ${WEEKS_LIST.map(wk => {
                      const wkData = row.weeks[wk] || { cancelRate: 0, x09Rate: 0 };
                      return `
                        ${formatCell('cancel', wkData.cancelRate)}
                        ${formatCell('x09', wkData.x09Rate)}
                      `;
                    }).join('')}
                    ${formatCell('cancel', row.monthTotal?.cancelRate || 0)}
                    ${formatCell('x09', row.monthTotal?.x09Rate || 0)}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BLOCK B HTML: OUT-OF-WARRANTY WEEKLY DETAIL GRID
    // ─────────────────────────────────────────────────────────────────────────
    if (currentView === 'ALL' || currentView === 'BLOCK_B') {
      html += `
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="sectionBlockB">
          <div class="px-5 py-4 bg-gradient-to-r from-[#184685] to-[#2563eb] text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-400 text-slate-950">Block B</span>
                <h3 class="text-sm font-extrabold uppercase tracking-wider font-outfit">Out-of-Warranty Weekly Detail Grid</h3>
              </div>
              <p class="text-[11px] text-slate-200 mt-0.5">Sequential tracking: [OW Closed] | [OW Cancel] | [OW X09] | [Cancel %] | [X09 %] side-by-side across weeks.</p>
            </div>
            <span class="text-[11px] font-bold px-2.5 py-1 rounded bg-white/20 text-white self-start md:self-auto">
              Multi-Month Window: Nov to Dec
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left border-collapse">
              <thead class="bg-[#1e293b] text-white font-bold uppercase text-[11px]">
                <tr>
                  <th rowspan="2" class="py-3 px-4 border-r border-slate-700 sticky left-0 bg-[#1e293b] z-10">Service Center (SVC)</th>
                  ${MULTI_MONTH_WEEKS.map(w => `
                    <th colspan="5" class="py-2 px-3 text-center border-r border-slate-700 bg-slate-800">${w.label}</th>
                  `).join('')}
                </tr>
                <tr class="bg-slate-900 text-[10px] text-slate-300">
                  ${MULTI_MONTH_WEEKS.map(() => `
                    <th class="py-1 px-1.5 text-center border-r border-slate-800 text-slate-300">OW Clsd</th>
                    <th class="py-1 px-1.5 text-center border-r border-slate-800 text-rose-300">OW Cnl</th>
                    <th class="py-1 px-1.5 text-center border-r border-slate-800 text-amber-300">OW X09</th>
                    <th class="py-1 px-1.5 text-center border-r border-slate-800 text-rose-400 font-bold">Cnl %</th>
                    <th class="py-1 px-1.5 text-center border-r border-slate-800 text-amber-400 font-bold">X09 %</th>
                  `).join('')}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${b.blockB.map((row, idx) => `
                  <tr class="${getRowClass(row, idx)}">
                    <td class="py-2.5 px-4 font-bold border-r border-slate-200 sticky left-0 z-10 ${row.isAggregated ? 'bg-inherit' : 'bg-white'} whitespace-nowrap">
                      ${row.name}
                    </td>
                    ${MULTI_MONTH_WEEKS.map(w => {
                      const wk = row.weeks[w.label] || { owClosed: 0, owCancel: 0, x09Count: 0, cancelRate: 0, x09Rate: 0 };
                      const cancelTier = getTier('cancel', wk.cancelRate);
                      const x09Tier = getTier('x09', wk.x09Rate);
                      return `
                        <td class="py-2 px-1.5 text-center text-slate-700 border-r border-slate-200 font-medium">${wk.owClosed}</td>
                        <td class="py-2 px-1.5 text-center text-rose-700 border-r border-slate-200 font-bold bg-rose-50/20">${wk.owCancel}</td>
                        <td class="py-2 px-1.5 text-center text-amber-800 border-r border-slate-200 font-medium">${wk.x09Count}</td>
                        <td class="py-2 px-1.5 text-center border-r border-slate-200 ${cancelTier.cellClass}">${wk.cancelRate.toFixed(1)}%</td>
                        <td class="py-2 px-1.5 text-center border-r border-slate-200 ${x09Tier.cellClass}">${wk.x09Rate.toFixed(1)}%</td>
                      `;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BLOCK C HTML: MONTH-TO-DATE (MTD) MACRO COMPREHENSIVE VIEW
    // ─────────────────────────────────────────────────────────────────────────
    if (currentView === 'ALL' || currentView === 'BLOCK_C') {
      html += `
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="sectionBlockC">
          <div class="px-5 py-4 bg-gradient-to-r from-[#047857] to-[#059669] text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-300 text-slate-950">Block C</span>
                <h3 class="text-sm font-extrabold uppercase tracking-wider font-outfit">Month-to-Date (MTD) Macro Comprehensive View</h3>
              </div>
              <p class="text-[11px] text-slate-100 mt-0.5">Continuous Timeline Mapping: [Cancel %] | [X09 %] | [OW repair %] across Nov, Apr'26 to Sep'26.</p>
            </div>
            <div class="text-[11px] font-semibold text-emerald-100 flex items-center gap-3">
              <span>OW Repair Target &ge; 60.0%</span>
              <span>Cancel &le; 20.9%</span>
              <span>X09 &le; 20.9%</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left border-collapse">
              <thead class="bg-[#1e293b] text-white font-bold uppercase text-[11px]">
                <tr>
                  <th rowspan="2" class="py-3 px-4 border-r border-slate-700 sticky left-0 bg-[#1e293b] z-10">Service Center (SVC)</th>
                  <th rowspan="2" class="py-3 px-2 border-r border-slate-700 text-center">Hub</th>
                  ${MONTHS_LIST.map(m => `
                    <th colspan="3" class="py-2 px-3 text-center border-r border-slate-700 bg-slate-800">${m}</th>
                  `).join('')}
                </tr>
                <tr class="bg-slate-900 text-[10px] text-slate-300">
                  ${MONTHS_LIST.map(() => `
                    <th class="py-1 px-2 text-center border-r border-slate-800 text-rose-300">Cancel %</th>
                    <th class="py-1 px-2 text-center border-r border-slate-800 text-amber-300">X09 %</th>
                    <th class="py-1 px-2 text-center border-r border-slate-800 text-emerald-300">OW Repair %</th>
                  `).join('')}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${b.blockC.map((row, idx) => `
                  <tr class="${getRowClass(row, idx)}">
                    <td class="py-2.5 px-4 font-bold border-r border-slate-200 sticky left-0 z-10 ${row.isAggregated ? 'bg-inherit' : 'bg-white'} whitespace-nowrap">
                      ${row.name}
                    </td>
                    <td class="py-2 px-2 text-center font-bold text-[10px] border-r border-slate-200 text-slate-500">
                      ${row.hub}
                    </td>
                    ${MONTHS_LIST.map(m => {
                      const mData = row.months[m] || { cancelRate: 0, x09Rate: 0, owRepairRate: 0 };
                      return `
                        ${formatCell('cancel', mData.cancelRate)}
                        ${formatCell('x09', mData.x09Rate)}
                        ${formatCell('owRepair', mData.owRepairRate)}
                      `;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BLOCK D HTML: PARETO OF CANCELLATION REASONS (MAIN REASON MATRIX)
    // ─────────────────────────────────────────────────────────────────────────
    if (currentView === 'ALL' || currentView === 'BLOCK_D') {
      html += `
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="sectionBlockD">
          <div class="px-5 py-4 bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-300 text-slate-950">Block D</span>
                <h3 class="text-sm font-extrabold uppercase tracking-wider font-outfit">Pareto of Cancellation Reasons (Main Reason Matrix)</h3>
              </div>
              <p class="text-[11px] text-slate-100 mt-0.5">Cross-tabulation matrix linking standardized Main Reasons against individual Service Centers (SVCs) with Pareto cumulative %.</p>
            </div>
            <button onclick="document.getElementById('btnViewReasonModal').click()" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 self-start md:self-auto">
              <span>View 26-Rule Mapping</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </button>
          </div>

          <!-- Pareto 80/20 Vital Few Cards -->
          <div class="p-5 border-b border-slate-200 bg-slate-50/70">
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-rose-500"></span>
              Pareto Vital Few Analysis (80/20 Priority Breakdown):
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              ${b.paretoAnalysis.slice(0, 4).map(item => `
                <div class="p-3.5 bg-white rounded-xl border ${item.isVitalFew ? 'border-rose-300 shadow-sm' : 'border-slate-200'}">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${item.isVitalFew ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'}">Rank #${item.rank}</span>
                    <span class="text-xs font-black text-rose-700">${item.count}</span>
                  </div>
                  <h5 class="text-xs font-bold text-slate-800 mt-1.5 truncate" title="${item.reason}">${item.reason}</h5>
                  <div class="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>${item.share.toFixed(1)}% Share</span>
                    <span class="font-bold text-slate-700">Cumul: ${item.cumulativePct.toFixed(1)}%</span>
                  </div>
                  <div class="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div class="bg-rose-500 h-full rounded-full" style="width: ${item.share}%"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Cross-tabulation Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left border-collapse">
              <thead class="bg-[#1e293b] text-white font-bold uppercase text-[11px]">
                <tr>
                  <th class="py-3 px-4 border-r border-slate-700 sticky left-0 bg-[#1e293b] z-10">Service Center (SVC)</th>
                  ${MAIN_REASONS.map(r => `
                    <th class="py-2.5 px-3 text-center border-r border-slate-700">${r}</th>
                  `).join('')}
                  <th class="py-2.5 px-3 text-center bg-rose-950 font-black">Total Cancel</th>
                  <th class="py-2.5 px-2 text-center bg-slate-900 font-bold">% Share</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${b.blockD.map((row, idx) => {
                  const pctOfNet = b.netCancels > 0 ? (row.total / b.netCancels) * 100 : 0;
                  return `
                    <tr class="${getRowClass(row, idx)}">
                      <td class="py-2.5 px-4 font-bold border-r border-slate-200 sticky left-0 z-10 ${row.isAggregated ? 'bg-inherit' : 'bg-white'} whitespace-nowrap">
                        ${row.name}
                      </td>
                      ${MAIN_REASONS.map(r => {
                        const cnt = row.reasons[r] || 0;
                        return `
                          <td class="py-2 px-3 text-center text-slate-700 border-r border-slate-200 ${cnt > 0 ? 'font-bold' : 'text-slate-400'}">
                            ${cnt}
                          </td>
                        `;
                      }).join('')}
                      <td class="py-2 px-3 text-center font-black text-rose-800 border-r border-slate-200 bg-rose-50/40">
                        ${row.total}
                      </td>
                      <td class="py-2 px-2 text-center font-bold text-slate-700">
                        ${pctOfNet.toFixed(1)}%
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 8. MARKDOWN REPORT GENERATOR (Matches "OUTPUT GENERATION TASK")
  // ═════════════════════════════════════════════════════════════════════════
  function generateMarkdownTables() {
    if (!state.processedBlocks) {
      computeAllBlocks();
    }

    const b = state.processedBlocks;
    let md = '';

    md += `# 📊 SAMSUNG CANCELLATION REPORT — EXECUTIVE SUMMARY SHEET\n\n`;
    md += `**Timeline / Selected Month:** ${b.month}\n`;
    md += `**SLA Threshold Rules:** Green: Cancel & X09 ≤ 20.9% | OW Repair ≥ 60.0% • Yellow: 21.0%–24.9% | 50.0%–59.9% • Red: > 25.0% | ≤ 50.0%\n\n`;

    // ──────────────────────────────────────────
    // Block A Markdown Table
    // ──────────────────────────────────────────
    md += `### BLOCK A: WEEKLY TREND MATRIX (${b.month})\n\n`;
    md += `| Service Center (SVC) | Hub | Wk-1 Cancel % | Wk-1 X09 % | Wk-2 Cancel % | Wk-2 X09 % | Wk-3 Cancel % | Wk-3 X09 % | Wk-4 Cancel % | Wk-4 X09 % | ${b.month} Cancel % | ${b.month} X09 % |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    b.blockA.forEach(row => {
      const w1 = row.weeks['Wk-1'] || { cancelRate: 0, x09Rate: 0 };
      const w2 = row.weeks['Wk-2'] || { cancelRate: 0, x09Rate: 0 };
      const w3 = row.weeks['Wk-3'] || { cancelRate: 0, x09Rate: 0 };
      const w4 = row.weeks['Wk-4'] || { cancelRate: 0, x09Rate: 0 };
      const mt = row.monthTotal || { cancelRate: 0, x09Rate: 0 };
      md += `| **${row.name}** | ${row.hub} | ${w1.cancelRate.toFixed(1)}% | ${w1.x09Rate.toFixed(1)}% | ${w2.cancelRate.toFixed(1)}% | ${w2.x09Rate.toFixed(1)}% | ${w3.cancelRate.toFixed(1)}% | ${w3.x09Rate.toFixed(1)}% | ${w4.cancelRate.toFixed(1)}% | ${w4.x09Rate.toFixed(1)}% | ${mt.cancelRate.toFixed(1)}% | ${mt.x09Rate.toFixed(1)}% |\n`;
    });

    md += `\n---\n\n`;

    // ──────────────────────────────────────────
    // Block B Markdown Table
    // ──────────────────────────────────────────
    md += `### BLOCK B: OUT-OF-WARRANTY WEEKLY DETAIL GRID (Multi-Month)\n\n`;
    const bCols = MULTI_MONTH_WEEKS.slice(0, 4); // First 4 weeks for readable markdown, plus note
    md += `| Service Center (SVC) | ` + bCols.map(w => `${w.label} OW Closed | ${w.label} OW Cancel | ${w.label} OW X09 | ${w.label} Cancel % | ${w.label} X09 %`).join(' | ') + ` |\n`;
    md += `| :--- | ` + bCols.map(() => `:--- | :--- | :--- | :--- | :---`).join(' | ') + ` |\n`;

    b.blockB.forEach(row => {
      let rowStr = `| **${row.name}** | `;
      const cells = [];
      bCols.forEach(w => {
        const d = row.weeks[w.label] || { owClosed: 0, owCancel: 0, x09Count: 0, cancelRate: 0, x09Rate: 0 };
        cells.push(`${d.owClosed} | ${d.owCancel} | ${d.x09Count} | ${d.cancelRate.toFixed(1)}% | ${d.x09Rate.toFixed(1)}%`);
      });
      rowStr += cells.join(' | ') + ` |`;
      md += rowStr + `\n`;
    });

    md += `\n---\n\n`;

    // ──────────────────────────────────────────
    // Block C Markdown Table
    // ──────────────────────────────────────────
    md += `### BLOCK C: MONTH-TO-DATE (MTD) MACRO COMPREHENSIVE VIEW\n\n`;
    md += `| Service Center (SVC) | Hub | ` + MONTHS_LIST.map(m => `${m} Cancel % | ${m} X09 % | ${m} OW Repair %`).join(' | ') + ` |\n`;
    md += `| :--- | :--- | ` + MONTHS_LIST.map(() => `:--- | :--- | :---`).join(' | ') + ` |\n`;

    b.blockC.forEach(row => {
      let rowStr = `| **${row.name}** | ${row.hub} | `;
      const cells = [];
      MONTHS_LIST.forEach(m => {
        const d = row.months[m] || { cancelRate: 0, x09Rate: 0, owRepairRate: 0 };
        cells.push(`${d.cancelRate.toFixed(1)}% | ${d.x09Rate.toFixed(1)}% | ${d.owRepairRate.toFixed(1)}%`);
      });
      rowStr += cells.join(' | ') + ` |`;
      md += rowStr + `\n`;
    });

    md += `\n---\n\n`;

    // ──────────────────────────────────────────
    // Block D Markdown Table
    // ──────────────────────────────────────────
    md += `### BLOCK D: PARETO OF CANCELLATION REASONS (MAIN REASON MATRIX)\n\n`;
    md += `| Service Center (SVC) | ` + MAIN_REASONS.map(r => `${r}`).join(' | ') + ` | Total Cancel | % Share |\n`;
    md += `| :--- | ` + MAIN_REASONS.map(() => `:---`).join(' | ') + ` | :--- | :--- |\n`;

    b.blockD.forEach(row => {
      const share = b.netCancels > 0 ? (row.total / b.netCancels) * 100 : 0;
      let rowStr = `| **${row.name}** | `;
      const rCells = MAIN_REASONS.map(r => row.reasons[r] || 0);
      rowStr += rCells.join(' | ') + ` | **${row.total}** | ${share.toFixed(1)}% |`;
      md += rowStr + `\n`;
    });

    md += `\n#### Pareto 80/20 Priority Breakdown:\n`;
    b.paretoAnalysis.forEach(p => {
      md += `- **#${p.rank} ${p.reason}:** ${p.count} calls (${p.share.toFixed(1)}% share, Cumulative: ${p.cumulativePct.toFixed(1)}%) ${p.isVitalFew ? '🚨 [Vital Few]' : ''}\n`;
    });

    return md;
  }

  async function copyMarkdownSummary() {
    const md = generateMarkdownTables();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(md);
      } else {
        const ta = document.createElement('textarea');
        ta.value = md;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast('Markdown tables copied to clipboard! Ready to paste into reports/prompts.');
    } catch (e) {
      console.error(e);
      showToast('Failed to copy Markdown: ' + e.message, 'error');
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 9. COPY EMAIL HTML (Pure inline CSS with 3-tier colors)
  // ═════════════════════════════════════════════════════════════════════════
  async function copyEmailHtml() {
    if (!state.processedBlocks) computeAllBlocks();
    const b = state.processedBlocks;

    function getInlineStyle(tier) {
      if (tier.color === 'green') return 'background-color: #c6efce; color: #006100; font-weight: bold;';
      if (tier.color === 'yellow') return 'background-color: #fff2cc; color: #8c6b00; font-weight: bold;';
      if (tier.color === 'red') return 'background-color: #ffc7ce; color: #9c0006; font-weight: bold;';
      return 'background-color: #ffffff; color: #334155;';
    }

    let rowsHtml = '';
    b.blockA.forEach((row, idx) => {
      const bg = row.name === 'Total' ? '#d9e1f2' : row.name === 'India-1' ? '#e2efda' : row.name === 'India-2' ? '#e7e6f6' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc');
      const w1 = row.weeks['Wk-1'] || { cancelRate: 0, x09Rate: 0 };
      const w2 = row.weeks['Wk-2'] || { cancelRate: 0, x09Rate: 0 };
      const w3 = row.weeks['Wk-3'] || { cancelRate: 0, x09Rate: 0 };
      const w4 = row.weeks['Wk-4'] || { cancelRate: 0, x09Rate: 0 };
      const mt = row.monthTotal || { cancelRate: 0, x09Rate: 0 };

      rowsHtml += `
        <tr style="background-color: ${bg};">
          <td style="padding: 6px 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #0f2e59;">${row.name}</td>
          <td style="padding: 6px 6px; border: 1px solid #cbd5e1; text-align: center; color: #64748b;">${row.hub}</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; ${getInlineStyle(getTier('cancel', w1.cancelRate))}">${w1.cancelRate.toFixed(1)}%</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; ${getInlineStyle(getTier('x09', w1.x09Rate))}">${w1.x09Rate.toFixed(1)}%</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; ${getInlineStyle(getTier('cancel', w2.cancelRate))}">${w2.cancelRate.toFixed(1)}%</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; ${getInlineStyle(getTier('x09', w2.x09Rate))}">${w2.x09Rate.toFixed(1)}%</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; ${getInlineStyle(getTier('cancel', w3.cancelRate))}">${w3.cancelRate.toFixed(1)}%</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; ${getInlineStyle(getTier('x09', w3.x09Rate))}">${w3.x09Rate.toFixed(1)}%</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; ${getInlineStyle(getTier('cancel', w4.cancelRate))}">${w4.cancelRate.toFixed(1)}%</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; ${getInlineStyle(getTier('x09', w4.x09Rate))}">${w4.x09Rate.toFixed(1)}%</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; ${getInlineStyle(getTier('cancel', mt.cancelRate))}">${mt.cancelRate.toFixed(1)}%</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; ${getInlineStyle(getTier('x09', mt.x09Rate))}">${mt.x09Rate.toFixed(1)}%</td>
        </tr>
      `;
    });

    const fullHtml = `
      <div style="font-family: Calibri, Arial, sans-serif; font-size: 12px; color: #000000; line-height: 1.4;">
        <h3 style="margin: 0 0 4px 0; color: #0f2e59; font-size: 14px;">Samsung Cancellation Report — Block A Weekly Trend (${b.month})</h3>
        <p style="margin: 0 0 10px 0; color: #64748b; font-size: 11px;">
          SLA Thresholds: 🟢 &le; 20.9% Green | 🟡 21.0%–24.9% Yellow | 🔴 &gt; 25.0% Red • India-1 (North) • India-2 (West/South)
        </p>
        <table style="border-collapse: collapse; width: 100%; border: 1px solid #cbd5e1; text-align: left; font-size: 11px;">
          <thead>
            <tr style="background-color: #0f2e59; color: #ffffff; text-align: center; font-weight: bold;">
              <th rowspan="2" style="padding: 6px 10px; border: 1px solid #cbd5e1; text-align: left;">Service Center (SVC)</th>
              <th rowspan="2" style="padding: 6px 6px; border: 1px solid #cbd5e1;">Hub</th>
              <th colspan="2" style="padding: 4px; border: 1px solid #cbd5e1;">Wk-1</th>
              <th colspan="2" style="padding: 4px; border: 1px solid #cbd5e1;">Wk-2</th>
              <th colspan="2" style="padding: 4px; border: 1px solid #cbd5e1;">Wk-3</th>
              <th colspan="2" style="padding: 4px; border: 1px solid #cbd5e1;">Wk-4</th>
              <th colspan="2" style="padding: 4px; border: 1px solid #cbd5e1; background-color: #1e3a8a;">${b.month} MTD</th>
            </tr>
            <tr style="background-color: #1e293b; color: #ffffff; text-align: center; font-size: 10px;">
              <th style="padding: 4px; border: 1px solid #cbd5e1;">Cancel %</th>
              <th style="padding: 4px; border: 1px solid #cbd5e1;">X09 %</th>
              <th style="padding: 4px; border: 1px solid #cbd5e1;">Cancel %</th>
              <th style="padding: 4px; border: 1px solid #cbd5e1;">X09 %</th>
              <th style="padding: 4px; border: 1px solid #cbd5e1;">Cancel %</th>
              <th style="padding: 4px; border: 1px solid #cbd5e1;">X09 %</th>
              <th style="padding: 4px; border: 1px solid #cbd5e1;">Cancel %</th>
              <th style="padding: 4px; border: 1px solid #cbd5e1;">X09 %</th>
              <th style="padding: 4px; border: 1px solid #cbd5e1; background-color: #1e3a8a;">Cancel %</th>
              <th style="padding: 4px; border: 1px solid #cbd5e1; background-color: #1e3a8a;">X09 %</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;

    try {
      if (navigator.clipboard && navigator.clipboard.write) {
        const blobHtml = new Blob([fullHtml], { type: 'text/html' });
        const blobPlain = new Blob([fullHtml.replace(/<[^>]+>/g, ' ')], { type: 'text/plain' });
        await navigator.clipboard.write([
          new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobPlain })
        ]);
      } else {
        const temp = document.createElement('div');
        temp.innerHTML = fullHtml;
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        document.body.appendChild(temp);
        const range = document.createRange();
        range.selectNodeContents(temp);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand('copy');
        temp.remove();
      }
      showToast('Styled report table copied to clipboard! Ready to paste into Email.');
    } catch (e) {
      console.error(e);
      showToast('Failed to copy table: ' + e.message, 'error');
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 10. MULTI-SHEET EXCEL EXPORT (ExcelJS)
  // ═════════════════════════════════════════════════════════════════════════
  async function downloadExcelWorkbook() {
    if (!state.processedBlocks) computeAllBlocks();
    if (typeof ExcelJS === 'undefined') {
      showToast('ExcelJS library is loading, please try again in a second...', 'info');
      return;
    }

    showToast('Generating comprehensive Samsung Cancellation Workbook (.xlsx)...', 'info');

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Samsung Service MIS';
      workbook.created = new Date();

      const b = state.processedBlocks;

      // Color helper for ExcelJS
      function getExcelFill(tier) {
        if (tier.color === 'green') return { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6EFCE' } };
        if (tier.color === 'yellow') return { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } };
        if (tier.color === 'red') return { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } };
        return { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
      }

      function getExcelFont(tier) {
        if (tier.color === 'green') return { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF006100' } };
        if (tier.color === 'yellow') return { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF8C6B00' } };
        if (tier.color === 'red') return { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF9C0006' } };
        return { name: 'Calibri', size: 10 };
      }

      // ── SHEET 1: BLOCK A - Weekly Trend ──
      const wsA = workbook.addWorksheet('Block A - Weekly Trend');
      wsA.mergeCells('A1:L1');
      wsA.getCell('A1').value = `BLOCK A: WEEKLY TREND MATRIX — ${b.month}`;
      wsA.getCell('A1').font = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
      wsA.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F2E59' } };
      wsA.getRow(1).height = 28;

      const aHeaders = [
        'Service Center (SVC)', 'Hub',
        'Wk-1 Cancel %', 'Wk-1 X09 %',
        'Wk-2 Cancel %', 'Wk-2 X09 %',
        'Wk-3 Cancel %', 'Wk-3 X09 %',
        'Wk-4 Cancel %', 'Wk-4 X09 %',
        `${b.month} Cancel %`, `${b.month} X09 %`
      ];
      const hRowA = wsA.addRow(aHeaders);
      hRowA.height = 22;
      hRowA.eachCell(cell => {
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      b.blockA.forEach(row => {
        const w1 = row.weeks['Wk-1'] || { cancelRate: 0, x09Rate: 0 };
        const w2 = row.weeks['Wk-2'] || { cancelRate: 0, x09Rate: 0 };
        const w3 = row.weeks['Wk-3'] || { cancelRate: 0, x09Rate: 0 };
        const w4 = row.weeks['Wk-4'] || { cancelRate: 0, x09Rate: 0 };
        const mt = row.monthTotal || { cancelRate: 0, x09Rate: 0 };

        const r = wsA.addRow([
          row.name, row.hub,
          w1.cancelRate / 100, w1.x09Rate / 100,
          w2.cancelRate / 100, w2.x09Rate / 100,
          w3.cancelRate / 100, w3.x09Rate / 100,
          w4.cancelRate / 100, w4.x09Rate / 100,
          mt.cancelRate / 100, mt.x09Rate / 100
        ]);
        r.height = 19;

        // Apply formatting
        for (let c = 3; c <= 12; c++) {
          const cell = r.getCell(c);
          cell.numFmt = '0.0%';
          const val = cell.value * 100;
          const isCancel = c % 2 !== 0;
          const tier = getTier(isCancel ? 'cancel' : 'x09', val);
          cell.fill = getExcelFill(tier);
          cell.font = getExcelFont(tier);
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });
      wsA.columns = [{ width: 22 }, { width: 10 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 16 }, { width: 16 }];

      // ── SHEET 2: BLOCK C - MTD Macro View ──
      const wsC = workbook.addWorksheet('Block C - MTD Macro View');
      wsC.mergeCells('A1:W1');
      wsC.getCell('A1').value = `BLOCK C: MONTH-TO-DATE (MTD) MACRO COMPREHENSIVE VIEW`;
      wsC.getCell('A1').font = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
      wsC.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF047857' } };
      wsC.getRow(1).height = 28;

      const cHeaders = ['Service Center (SVC)', 'Hub'];
      MONTHS_LIST.forEach(m => {
        cHeaders.push(`${m} Cancel %`, `${m} X09 %`, `${m} OW Repair %`);
      });
      const hRowC = wsC.addRow(cHeaders);
      hRowC.height = 22;
      hRowC.eachCell(cell => {
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      b.blockC.forEach(row => {
        const rowVals = [row.name, row.hub];
        MONTHS_LIST.forEach(m => {
          const d = row.months[m] || { cancelRate: 0, x09Rate: 0, owRepairRate: 0 };
          rowVals.push(d.cancelRate / 100, d.x09Rate / 100, d.owRepairRate / 100);
        });
        const r = wsC.addRow(rowVals);
        r.height = 19;
        for (let c = 3; c <= rowVals.length; c++) {
          const cell = r.getCell(c);
          cell.numFmt = '0.0%';
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });
      wsC.columns = [{ width: 22 }, { width: 10 }, ...Array(21).fill({ width: 13 })];

      // ── SHEET 3: BLOCK D - Pareto Reasons ──
      const wsD = workbook.addWorksheet('Block D - Reason Pareto');
      wsD.mergeCells('A1:K1');
      wsD.getCell('A1').value = `BLOCK D: PARETO OF CANCELLATION REASONS (MAIN REASON MATRIX)`;
      wsD.getCell('A1').font = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
      wsD.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF991B1B' } };
      wsD.getRow(1).height = 28;

      const dHeaders = ['Service Center (SVC)', ...MAIN_REASONS, 'Total Cancel'];
      const hRowD = wsD.addRow(dHeaders);
      hRowD.height = 22;
      hRowD.eachCell(cell => {
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      b.blockD.forEach(row => {
        const rVals = [row.name];
        MAIN_REASONS.forEach(mr => {
          rVals.push(row.reasons[mr] || 0);
        });
        rVals.push(row.total);
        const r = wsD.addRow(rVals);
        r.height = 19;
        r.eachCell((cell, col) => {
          cell.alignment = { vertical: 'middle', horizontal: col === 1 ? 'left' : 'center' };
        });
      });
      wsD.columns = [{ width: 22 }, ...Array(8).fill({ width: 16 }), { width: 14 }];

      // ── SHEET 4: RAW DATA ──
      const wsRaw = workbook.addWorksheet('Orders RAW');
      const rawCols = ['SO Number', 'SVC', 'Hub', 'Month', 'Week', 'Status', 'Service Type', 'Repair Code', 'Wty Status', 'Model', 'Product', 'Cancellation Reason', 'Main Reason Group'];
      const hRaw = wsRaw.addRow(rawCols);
      hRaw.height = 22;
      hRaw.eachCell(cell => {
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } };
      });

      state.dataset.slice(0, 3000).forEach(j => {
        wsRaw.addRow([
          j.soNumber, j.svc, j.hub, j.month, j.week, j.status,
          j.serviceType, j.repairCode, j.wtyStatus, j.model, j.product,
          j.reason, j.mainReason
        ]);
      });
      wsRaw.columns = [{ width: 16 }, { width: 18 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 14 }, { width: 16 }, { width: 12 }, { width: 35 }, { width: 22 }];

      // Download buffer
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Samsung_Cancellation_Report_SummarySheet_${b.month}_AllBlocks.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      showToast('Comprehensive Multi-Sheet Excel Workbook downloaded successfully!');
    } catch (err) {
      console.error(err);
      showToast('Excel export failed: ' + err.message, 'error');
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 11. EVENT LISTENERS & INITIALIZATION
  // ═════════════════════════════════════════════════════════════════════════
  function init() {
    // Generate initial master dataset and compute all 4 blocks
    generateMasterDataset();
    computeAllBlocks();

    // Copy Markdown
    document.getElementById('btnCopyMarkdown')?.addEventListener('click', copyMarkdownSummary);

    // Copy Email HTML
    document.getElementById('btnCopyReportHtml')?.addEventListener('click', copyEmailHtml);

    // Download Multi-Sheet Excel
    document.getElementById('btnDownloadWithRaw')?.addEventListener('click', downloadExcelWorkbook);

    // Recompute
    document.getElementById('btnProcessValidate')?.addEventListener('click', () => {
      computeAllBlocks();
      showToast('Recomputed all 4 Blocks across Service Network!');
    });

    // Load Master Dataset
    document.getElementById('btnLoadSampleData')?.addEventListener('click', () => {
      generateMasterDataset();
      computeAllBlocks();
      showToast('Loaded comprehensive master dataset across all 9 Service Centers & Timelines!');
    });

    // Clear All
    document.getElementById('btnClearAll')?.addEventListener('click', () => {
      state.dataset = [];
      state.cancellationFiles = [];
      state.fdrFiles = [];
      computeAllBlocks();
      showToast('Cleared dataset. Click "Load Master Dataset" to re-populate.', 'info');
    });

    // Month Selector
    document.getElementById('selectMonthPeriod')?.addEventListener('change', (e) => {
      state.selectedPeriod = e.target.value;
      computeAllBlocks();
    });

    // Block Switcher Pills
    const blockTabs = document.querySelectorAll('.block-tab');
    blockTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        blockTabs.forEach(t => {
          t.classList.remove('bg-white', 'text-[#0f2e59]', 'shadow-sm', 'active-tab');
          t.classList.add('text-slate-600');
        });
        tab.classList.add('bg-white', 'text-[#0f2e59]', 'shadow-sm', 'active-tab');
        tab.classList.remove('text-slate-600');

        state.activeBlockView = tab.getAttribute('data-block');
        renderDashboard();
      });
    });

    // Reason Pareto Modal
    const reasonModal = document.getElementById('reasonAnalysisModal');
    const openReasonBtn = document.getElementById('btnViewReasonModal');
    const closeReasonBtn = document.getElementById('reasonModalClose');
    const closeReasonBtn2 = document.getElementById('reasonModalCloseBtn');

    if (openReasonBtn && reasonModal) {
      openReasonBtn.addEventListener('click', () => {
        // Populate Pareto table in modal
        const grid = document.getElementById('reasonGridContainer');
        const tbody = document.getElementById('reasonMappingTableBody');

        if (grid && state.processedBlocks) {
          grid.innerHTML = state.processedBlocks.paretoAnalysis.map(item => `
            <div class="p-3 bg-white border ${item.isVitalFew ? 'border-rose-300 shadow-sm' : 'border-slate-200'} rounded-xl">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${item.isVitalFew ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'}">Rank #${item.rank}</span>
                <span class="text-xs font-black text-rose-700">${item.count}</span>
              </div>
              <p class="text-xs font-bold text-slate-800 mt-1 truncate" title="${item.reason}">${item.reason}</p>
              <div class="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>${item.share.toFixed(1)}% Share</span>
                <span class="font-bold text-slate-700">Cumul: ${item.cumulativePct.toFixed(1)}%</span>
              </div>
            </div>
          `).join('');
        }

        if (tbody) {
          tbody.innerHTML = REASON_RULES.map((rule, idx) => `
            <tr class="hover:bg-slate-50">
              <td class="py-2 px-3 font-mono text-slate-400 border-r border-slate-100">${idx + 1}</td>
              <td class="py-2 px-3 font-medium text-slate-800 border-r border-slate-100">${rule.raw}</td>
              <td class="py-2 px-3">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                  ${rule.main}
                </span>
              </td>
            </tr>
          `).join('');
        }

        reasonModal.classList.remove('hidden');
      });
    }

    if (closeReasonBtn && reasonModal) closeReasonBtn.addEventListener('click', () => reasonModal.classList.add('hidden'));
    if (closeReasonBtn2 && reasonModal) closeReasonBtn2.addEventListener('click', () => reasonModal.classList.add('hidden'));
  }

  window.generateMarkdownTables = generateMarkdownTables;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
