/**
 * openPendingContext.js — Authoritative Formulations, Key Mappings, and Extensible Column Registry
 * 
 * Part of GSPN Helper Tools Architecture.
 * Organizes all calculation formulas, column definitions, and key-based alias dictionaries
 * so that new columns, formulas, and GSPN formats can be added cleanly in a single location.
 */

(function (root, factory) {
  const mod = factory();
  if (typeof root !== 'undefined') {
    root.OpenPendingContext = mod;
    if (root.GSPN_CONTEXT) {
      root.GSPN_CONTEXT.OPEN_PENDING = mod;
    }
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.OpenPendingContext = mod;
    if (globalThis.GSPN_CONTEXT) {
      globalThis.GSPN_CONTEXT.OPEN_PENDING = mod;
    }
  }
  if (typeof module === 'object' && module && module.exports) {
    module.exports = mod;
  }
})(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  // ═════════════════════════════════════════════════════════════════════════
  // 1. KEY-BASED HEADER ALIAS DICTIONARY
  // Maps multiple variations of header names across GSPN exports to exact semantic keys
  // ═════════════════════════════════════════════════════════════════════════
  const FIELD_KEY_ALIASES = {
    service_order_no: [
      'SERVICE ORDER NO.', 'SERVICE ORDER NO', 'SERVICE ORDER NUMBER', 'SERVICE_ORDER_NO',
      'SERVICE ORDER', 'SO NO', 'SO NO.', 'SO_NO', 'TRACKING NO', 'TRACKING NO.', 'TRACKING_NO',
      'TRACKING NUMBER', 'ORDER NO', 'CALL ID', 'CALL_ID'
    ],
    asc_job_no: [
      'ASC JOB NO', 'ASC JOB NO.', 'ASC_JOB_NO', 'ASC JOB NUMBER', 'ASC REF. NO',
      'ASC REF NO', 'ASC_REF_NO', 'ASC REF NUMBER', 'JOB NO', 'JOB NO.', 'JOB_NO'
    ],
    created_date: [
      'CREATED', 'CREATED DATE', 'CREATED_DATE', 'CREATION DATE', 'CREATION_DATE',
      'REQUESTED DATE', 'REQUESTED_DATE', 'REQUEST DATE', 'REQ DATE', 'REQ_DATE'
    ],
    assigned_date: [
      'ASSIGNED', 'ASSIGNED DATE', 'ASSIGNED_DATE', 'ASC ASSIGNED', 'ASC ASSIGNED DATE',
      'ASC_ASSIGNED', 'ASSIGN DATE', 'ASSIGN_DATE'
    ],
    assigned_time: [
      'ASSIGNED TIME', 'ASSIGNED_TIME', 'ASC ASSIGNED TIME', 'ASSIGN TIME', 'ASSIGN_TIME',
      'CREATED TIME', 'CREATION TIME'
    ],
    model: [
      'MODEL', 'MODEL NO', 'MODEL NO.', 'MODEL_NO', 'MODEL CODE', 'MODEL_CODE',
      'MODEL NAME', 'MODEL_NAME', 'MODEL NUMBER'
    ],
    serial_no: [
      'SERIAL', 'SERIAL NO', 'SERIAL NO.', 'SERIAL_NO', 'SERIAL NUMBER', 'SERIAL_NUMBER',
      'IMEI', 'IMEI NO', 'IMEI NUMBER', 'SN', 'S/N'
    ],
    warranty_status: [
      'WTY STATUS', 'WTY_STATUS', 'WARRANTY STATUS', 'WARRANTY_STATUS', 'WARRANTY',
      'WTY', 'IW/OW', 'WTY TYPE', 'WAR STATUS'
    ],
    customer_name: [
      'CUSTOMER NAME', 'CUSTOMER_NAME', 'CUSTOMER', 'CUST NAME', 'CUST_NAME',
      'CUSTOMER CARE', 'CARE', 'CLIENT NAME', 'CLIENT', 'NAME', 'CX NAME', 'CX_NAME'
    ],
    city: [
      'CITY', 'LOCATION', 'DISTRICT', 'TOWN', 'PLACE', 'CITY NAME'
    ],
    app_date: [
      'APP DATE', 'APP_DATE', 'APPOINTMENT DATE', 'APPOINTMENT_DATE', 'FIRST ANTICIPATED DATE',
      'ANTICIPATED DATE', 'FIRST_ANTICIPATED_DATE', 'PROMISE DATE', 'APPT DATE', 'APPT_DATE'
    ],
    app_time: [
      'APP TIME', 'APP_TIME', 'APPOINTMENT TIME', 'APPOINTMENT_TIME', 'APPT TIME',
      'ANTICIPATED TIME', 'FIRST ANTICIPATED TIME', 'PROMISE TIME'
    ],
    service_type: [
      'SERVICE TYPE', 'SERVICE_TYPE', 'SERVICE TYPE (STATUS)', 'SVC TYPE', 'SVC_TYPE',
      'TYPE OF SERVICE', 'CALL TYPE', 'CALL_TYPE'
    ],
    status: [
      'STATUS', 'STATUS (GSPN)', 'CALL STATUS', 'JOB STATUS', 'CURRENT STATUS',
      'PROGRESS STATUS', 'GSPN STATUS', 'ORDER STATUS'
    ],
    reason: [
      'REASON', 'REASON (GSPN)', 'SUB REASON', 'SUB_REASON', 'PENDING REASON',
      'DELAY REASON', 'HOLD REASON', 'STATUS REASON', 'REASON / REMARKS', 'REMARKS'
    ],
    voc: [
      'VOC', 'CUSTOMER VOC', 'CUSTOMER_VOC', 'COMPLAINT', 'DEFECT', 'PROBLEM',
      'CUSTOMER COMPLAINT', 'SYMPTOM', 'VOC CODE'
    ],
    b2b: [
      'B2B', 'IS B2B', 'B2B CALL', 'BUSINESS', 'B2B_CALL'
    ],
    redo: [
      'REDO', 'RE-DO', 'RE DO', 'REPEAT', 'IS REDO', 'IS_REDO'
    ],
    risk_sensing: [
      'RISK SENSING', 'RISK_SENSING', 'RISK', 'RISK TYPE'
    ],
    risk_reason: [
      'RISK REASON', 'RISK_REASON', 'RISK REMARKS', 'REMARK', 'NOTE', 'NOTES'
    ],
    red: [
      'RED', 'RED CALL', 'IS RED', 'RED ALERT'
    ],
    high_priority: [
      'HIGH PRIORITY', 'HIGH_PRIORITY', 'PRIORITY', 'PRIORITY LEVEL', 'VIP'
    ],
    branch_name: [
      'BRANCH NAME', 'BRANCH_NAME', 'BRANCH', 'CP NAME', 'CP_NAME', 'SVC',
      'SERVICE CENTER NAME', 'SERVICE CENTER'
    ],
    no: [
      'NO', 'NO.', 'S.NO', 'S NO', 'SL NO', 'SR NO', 'SR.NO', 'SR_NO'
    ]
  };

  // Build reverse lookup index for instantaneous header string matching
  const HEADER_TO_KEY = {};
  Object.keys(FIELD_KEY_ALIASES).forEach(key => {
    FIELD_KEY_ALIASES[key].forEach(alias => {
      HEADER_TO_KEY[alias.toUpperCase().trim()] = key;
    });
  });

  // ═════════════════════════════════════════════════════════════════════════
  // 2. FORMULATION & NORMALIZATION FUNCTIONS
  // Clean, pure calculation functions decoupled from UI rendering
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Cleans Service Order numbers from artifacts like "4444364376 Edit",
   * trailing spaces, address strings, and preserves leading zeros.
   */
  function cleanServiceOrderNumber(val) {
    if (!val && val !== 0) return '';
    let str = String(val).trim();
    // Strip trailing UI actions from GSPN tables
    str = str.replace(/\s*(Edit|View|Print|Detail|Action|Open)\s*$/i, '').trim();

    // Check for 10-digit SO number anywhere in the string
    const match10 = str.match(/\b(4\d{9})\b/);
    if (match10) return match10[1];

    const any10 = str.match(/\b(\d{10})\b/);
    if (any10) return any10[1];

    // Fallback: strip all non-alphanumeric
    return str.replace(/[^\w-]/g, '').trim();
  }

  /**
   * Smart Date Parser handling DD.MM.YYYY, YYYY-MM-DD, Excel serial timestamps,
   * rejects invalid/dummy dates like 00.00.0000.
   */
  function parseDateSmart(val) {
    if (!val && val !== 0) return null;
    if (val instanceof Date) {
      return isNaN(val.getTime()) ? null : val;
    }

    if (typeof val === 'number') {
      if (val > 30000 && val < 65000) {
        // Excel serial date to JS Date
        return new Date(Math.round((val - 25569) * 86400 * 1000));
      }
      return null;
    }

    const s = String(val).trim();
    if (!s || s === '-' || s === '—' || s.startsWith('00.00') || s.startsWith('00/00') || s.startsWith('0000-00')) {
      return null;
    }

    // Match DD.MM.YYYY or DD/MM/YYYY
    const dmy = s.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{2,4})/);
    if (dmy) {
      let day = parseInt(dmy[1], 10);
      let month = parseInt(dmy[2], 10) - 1;
      let year = parseInt(dmy[3], 10);
      if (year < 100) year += 2000;
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? null : d;
    }

    // Match YYYY-MM-DD
    const ymd = s.match(/^(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})/);
    if (ymd) {
      let year = parseInt(ymd[1], 10);
      let month = parseInt(ymd[2], 10) - 1;
      let day = parseInt(ymd[3], 10);
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? null : d;
    }

    const parsed = new Date(s);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  /**
   * Formats a date value consistently into DD.MM.YYYY. Returns empty string if invalid.
   */
  function formatStandardDate(val) {
    const d = parseDateSmart(val);
    if (!d) return '';
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  }

  /**
   * Formats time strings and strips dummy 00:00:00
   */
  function formatStandardTime(val) {
    if (!val && val !== 0) return '';
    const s = String(val).trim();
    if (s === '00:00:00' || s === '00:00' || s === '-') return '';
    return s;
  }

  /**
   * Calculates aging in calendar days from assigned/created date to cutoff date.
   */
  function calcAging(assignedDateVal, cutoffDateVal) {
    const assignedDate = parseDateSmart(assignedDateVal);
    if (!assignedDate) return 0;

    let cutoff = cutoffDateVal ? parseDateSmart(cutoffDateVal) : new Date();
    if (!cutoff) cutoff = new Date();

    const dAssigned = new Date(assignedDate.getFullYear(), assignedDate.getMonth(), assignedDate.getDate());
    const dCutoff = new Date(cutoff.getFullYear(), cutoff.getMonth(), cutoff.getDate());

    const diffDays = Math.floor((dCutoff.getTime() - dAssigned.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Returns TAT Bucket based on aging days
   */
  function getTATBucket(agingDays) {
    const days = Number(agingDays) || 0;
    if (days <= 2) return '0–2 Days';
    if (days <= 7) return '3–7 Days';
    if (days <= 10) return '8–10 Days';
    if (days <= 14) return '11–14 Days';
    if (days <= 30) return '15–30 Days';
    return '30+ Days';
  }

  /**
   * Standardizes warranty status and resolves warranty code (IW, OW, OFW, P-IW)
   */
  function normalizeWarrantyStatus(wtyVal, serviceTypeVal) {
    const sType = String(serviceTypeVal || '').toUpperCase();
    if (sType === 'INITIAL INSTALLATION' || sType === 'DEMONSTRATION' || sType.includes('INSTALLATION')) {
      return 'In Warranty';
    }

    if (!wtyVal) return 'In Warranty';
    const s = String(wtyVal).trim().toUpperCase();

    if (s.includes('OUT') || s === 'OW' || s === 'OOW' || s.includes('EXPIRE')) {
      return 'Out of Warranty';
    }
    if (s.includes('POLICY') || s === 'PIW' || s === 'P-IW') {
      return 'Policy In Warranty';
    }
    if (s.includes('OFW') || s.includes('ONE FAULT')) {
      return 'One Fault Warranty';
    }
    if (s.includes('IN') || s === 'IW' || s === 'LPW') {
      return 'In Warranty';
    }
    return 'In Warranty';
  }

  function getWarrantyCode(wtyStatus) {
    const s = String(wtyStatus || '').toUpperCase();
    if (s.includes('OUT') || s === 'OW' || s === 'OOW') return 'OW';
    if (s.includes('POLICY') || s === 'PIW') return 'P-IW';
    if (s.includes('OFW')) return 'OFW';
    return 'IW';
  }

  /**
   * Converts GSPN short service types to standard descriptions
   */
  function convertServiceType(val) {
    if (!val) return 'In-Home';
    const u = String(val).trim().toUpperCase();
    if (u === 'IH' || u.includes('IN-HOME') || u.includes('IN HOME')) return 'In-Home';
    if (u === 'CI' || u.includes('CARRY IN') || u.includes('CARRY-IN')) return 'Carry-In';
    if (u === 'PU' || u.includes('PICK-UP') || u.includes('PICK UP')) return 'Pick-Up';
    if (u.includes('INSTALL') || u.includes('INITIAL')) return 'Initial Installation';
    if (u.includes('DEMO')) return 'Demonstration';
    if (u.includes('STOCK')) return 'Stock Repair';
    if (u.includes('CUSTOMER CARE') || u.includes('CARE')) return 'Customer Care';
    return val;
  }

  /**
   * Infers Samsung Product Category from Model Number Prefix
   */
  function getSamsungCategory(modelStr) {
    if (!modelStr) return 'Other';
    const m = String(modelStr).toUpperCase().trim();
    if (/^(RT|RR|RS|RF|RB|RL|RA|RH)/.test(m)) return 'REF';
    if (/^(WA|WW|WD|WF|WT)/.test(m)) return 'WM';
    if (/^(AR|AJ|AC|AM)/.test(m)) return 'AC';
    if (/^(UA|QA|QA|UE|QN|GQ|QE|UN|HG|LH|LS)/.test(m)) return 'CTV';
    if (/^(MC|MS|MG|ME|MW)/.test(m)) return 'MWO';
    if (/^(HW|MX|HT)/.test(m)) return 'AUD';
    if (/^(DW)/.test(m)) return 'DW';
    if (/^(SM-|GT-|SM[A-Z0-9])/i.test(m)) return 'HHP';
    if (/^(NP|XE|NT)/.test(m)) return 'IT';
    return 'Other';
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 3. EXTENSIBLE COLUMN REGISTRY
  // Allows registering new columns with custom formula calculators
  // ═════════════════════════════════════════════════════════════════════════
  const REGISTERED_COLUMNS = [];

  function registerColumn(colDef) {
    if (!colDef || !colDef.key) return;
    const existing = REGISTERED_COLUMNS.findIndex(c => c.key === colDef.key);
    if (existing !== -1) {
      REGISTERED_COLUMNS[existing] = { ...REGISTERED_COLUMNS[existing], ...colDef };
    } else {
      REGISTERED_COLUMNS.push(colDef);
    }
  }

  // Initial GGN Standard 28-Column Definitions
  const STANDARD_28_COLUMNS = [
    { key: 'date', header: 'DATE', width: 13, align: 'center', formula: r => r.date || formatStandardDate(r.created_date) },
    { key: 'branch_name', header: 'SVC', width: 18, align: 'left', formula: r => r.branch_name || '' },
    { key: 'no', header: 'No.', width: 8, align: 'center', formula: (r, idx) => r.no || (idx + 1) },
    { key: 'service_order_no', header: 'Service Order No.', width: 18, align: 'center', numFmt: '@', formula: r => cleanServiceOrderNumber(r.service_order_no) },
    { key: 'asc_job_no', header: 'ASC Job No', width: 18, align: 'center', numFmt: '@', formula: r => cleanServiceOrderNumber(r.asc_job_no) || cleanServiceOrderNumber(r.service_order_no) },
    { key: 'created_date', header: 'Created', width: 14, align: 'center', formula: r => formatStandardDate(r.created_date) },
    { key: 'assigned_date', header: 'Assigned', width: 14, align: 'center', formula: r => formatStandardDate(r.assigned_date) || formatStandardDate(r.created_date) },
    { key: 'assigned_time', header: 'Assigned Time', width: 13, align: 'center', formula: r => formatStandardTime(r.assigned_time) },
    { key: 'model', header: 'Model', width: 22, align: 'left', formula: r => String(r.model || '').toUpperCase().trim() },
    { key: 'serial_no', header: 'Serial', width: 18, align: 'left', numFmt: '@', formula: r => String(r.serial_no || '').trim() },
    { key: 'warranty_status', header: 'Wty Status', width: 16, align: 'center', formula: r => normalizeWarrantyStatus(r.warranty_status, r.service_type) },
    { key: 'voc', header: 'VOC', width: 18, align: 'left', formula: r => r.voc || '' },
    { key: 'remarks', header: 'Remarks', width: 14, align: 'center', formula: () => '' },
    { key: 'sub_remarks', header: 'Sub Remarks', width: 14, align: 'center', formula: () => '' },
    { key: 'pending_at', header: 'Pending At', width: 14, align: 'center', formula: () => '' },
    { key: 'pending_reason', header: 'Pending Reason', width: 14, align: 'center', formula: () => '' },
    { key: 'customer_name', header: 'Customer Name', width: 22, align: 'left', formula: r => r.customer_name || '' },
    { key: 'city', header: 'City', width: 16, align: 'left', formula: r => String(r.city || '').toUpperCase().trim() },
    { key: 'app_date', header: 'App Date', width: 14, align: 'center', formula: r => formatStandardDate(r.app_date) },
    { key: 'app_time', header: 'App Time', width: 12, align: 'center', formula: r => formatStandardTime(r.app_time) },
    { key: 'service_type', header: 'Service Type', width: 20, align: 'left', formula: r => convertServiceType(r.service_type) },
    { key: 'status', header: 'Status', width: 20, align: 'left', formula: r => r.status || 'Open' },
    { key: 'reason', header: 'Reason', width: 26, align: 'left', formula: r => r.reason || '' },
    { key: 'master_reason', header: 'Master Reason', width: 22, align: 'left', formula: r => {
      if (r.master_reason) return r.master_reason;
      if (typeof window !== 'undefined' && window.GSPN_CONTEXT && typeof window.GSPN_CONTEXT.getReasonBySubReason === 'function') {
        return window.GSPN_CONTEXT.getReasonBySubReason(r.reason) || window.GSPN_CONTEXT.getReasonBySubReason(r.status) || 'Svc Working';
      }
      return r.reason || 'Svc Working';
    }},
    { key: 'aging', header: 'Aging (Days)', width: 12, align: 'center', formula: (r, idx, ctx) => calcAging(r.assigned_date || r.created_date, ctx ? ctx.cutoffDate : null) },
    { key: 'tat_bucket', header: 'TAT Bucket', width: 14, align: 'center', formula: (r, idx, ctx) => getTATBucket(calcAging(r.assigned_date || r.created_date, ctx ? ctx.cutoffDate : null)) },
    { key: 'product_category', header: 'Product', width: 14, align: 'center', formula: r => getSamsungCategory(r.model) },
    { key: 'redo', header: 'REDO', width: 10, align: 'center', formula: r => String(r.redo || 'N').toUpperCase().trim() }
  ];

  // Core simple columns (for Simple Format Fragment)
  const SIMPLE_RAW_COLUMNS = [
    { key: 'created_date', header: 'DATE', width: 14, align: 'center' },
    { key: 'service_order_no', header: 'SERVICE ORDER NO.', width: 18, align: 'center' },
    { key: 'customer_name', header: 'CX Name', width: 22, align: 'left' },
    { key: 'service_type', header: 'Service Type', width: 18, align: 'left' },
    { key: 'model', header: 'Model', width: 20, align: 'left' },
    { key: 'serial_no', header: 'Serial No', width: 18, align: 'left' },
    { key: 'status', header: 'Status', width: 18, align: 'left' },
    { key: 'reason', header: 'Reason', width: 24, align: 'left' },
    { key: 'city', header: 'City', width: 16, align: 'left' }
  ];

  STANDARD_28_COLUMNS.forEach(registerColumn);

  // ═════════════════════════════════════════════════════════════════════════
  // 4. MULTI-SOURCE KEY-BASED PARSER ENGINE
  // Intelligently maps Management Light, Management Bulk, and Tabular TSV
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Resolves row headers to standardized field keys
   */
  function mapHeaderRowToKeys(headers) {
    return headers.map(h => {
      const clean = String(h || '').toUpperCase().trim();
      return HEADER_TO_KEY[clean] || clean;
    });
  }

  /**
   * Splits string by tab or multiple consecutive spaces
   */
  function splitTokens(line) {
    if (line.includes('\t')) return line.split('\t').map(s => s.trim());
    return line.split(/\s{2,}/).map(s => s.trim());
  }

  /**
   * Detects source format of the input text
   */
  function detectSourceFormat(rawText) {
    if (!rawText) return 'EMPTY';
    const text = String(rawText).trim();
    if (/<table[\s>]/i.test(text) || /<tr[\s>]/i.test(text)) {
      return 'HTML_TABLE';
    }

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return 'EMPTY';

    const upper = text.toUpperCase();
    const hasAssignedTime = upper.includes('ASSIGNED TIME') || upper.includes('APP TIME');
    const hasRiskSensing = upper.includes('RISK SENSING') || upper.includes('REDO');

    if (upper.includes('SERVICE ORDER NO') && (upper.includes('CUSTOMER NAME') || upper.includes('SERVICE TYPE'))) {
      if (hasAssignedTime || hasRiskSensing) {
        return 'MANAGEMENT_LITE_2ROW'; // Format 1: 14 cols top row
      }
      return 'MANAGEMENT_BULK_2ROW'; // Format 2: 9 cols top row
    }

    // Check line tab counts
    const firstLineCols = lines[0].split('\t').length;
    if (firstLineCols >= 18) {
      return 'SINGLE_LINE_GRID'; // Standard 25 or 28 column TSV
    }

    // Fallback heuristic: check if alternate lines contain SO numbers
    let soCount = 0;
    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      if (/\b4\d{9}\b/.test(lines[i])) soCount++;
    }
    if (soCount > 0 && lines.length > soCount * 1.5) {
      return hasAssignedTime ? 'MANAGEMENT_LITE_2ROW' : 'MANAGEMENT_BULK_2ROW';
    }

    return 'GENERIC_TSV';
  }

  /**
   * Parses arbitrary GSPN input using Key-Based Schema Mapping
   */
  function parseMultiSourceData(rawInput, options = {}) {
    if (!rawInput || !rawInput.trim()) {
      return { format: 'EMPTY', records: [], simpleRecords: [], rawRecords: [], errors: [] };
    }

    const format = detectSourceFormat(rawInput);
    const trimmed = rawInput.trim();
    const records = [];

    if (format === 'HTML_TABLE') {
      return parseHtmlSource(trimmed, options);
    }

    const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      return { format, records: [], simpleRecords: [], rawRecords: [], errors: [] };
    }

    // Inspect headers
    let header1Keys = [];
    let header2Keys = [];
    let dataStartIdx = 0;

    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      const tokens = splitTokens(lines[i]);
      const mapped = mapHeaderRowToKeys(tokens);
      if (mapped.includes('service_order_no')) {
        header1Keys = mapped;
        dataStartIdx = Math.max(dataStartIdx, i + 1);
      } else if (mapped.includes('customer_name') || mapped.includes('city') || mapped.includes('service_type')) {
        header2Keys = mapped;
        dataStartIdx = Math.max(dataStartIdx, i + 1);
      }
    }

    // Set default keys if headers weren't pasted
    const isBulk = format === 'MANAGEMENT_BULK_2ROW' || (!header1Keys.includes('assigned_time') && header1Keys.length <= 10 && header1Keys.length > 0);

    if (header1Keys.length === 0) {
      if (isBulk) {
        header1Keys = ['no', 'service_order_no', 'asc_job_no', 'created_date', 'assigned_date', 'model', 'serial_no', 'warranty_status', 'voc'];
      } else {
        header1Keys = ['no', 'service_order_no', 'asc_job_no', 'created_date', 'assigned_date', 'assigned_time', 'model', 'serial_no', 'warranty_status', 'voc', 'redo', 'risk_sensing', 'red', 'high_priority'];
      }
    }

    if (header2Keys.length === 0) {
      if (isBulk) {
        header2Keys = ['customer_name', 'city', 'app_date', 'service_type', 'status', 'reason', 'b2b'];
      } else {
        header2Keys = ['customer_name', 'city', 'app_date', 'app_time', 'service_type', 'status', 'reason', 'b2b', 'risk_reason'];
      }
    }

    // Map column indices to keys based on header rows
    const colKeyMap1 = {};
    const colKeyMap2 = {};

    if (header1Keys.length > 0) {
      header1Keys.forEach((key, idx) => {
        if (key) colKeyMap1[idx] = key;
      });
    }

    if (header2Keys.length > 0) {
      header2Keys.forEach((key, idx) => {
        if (key) colKeyMap2[idx] = key;
      });
    }

    // Iterate through data lines
    let i = dataStartIdx;
    while (i < lines.length) {
      const line1 = lines[i];
      const tokens1 = line1.split('\t').map(s => s.trim());

      // Check if line1 has an SO number
      const soIdx = tokens1.findIndex(t => /\b4\d{9}\b/.test(t) || /^\d{10}\s*(Edit|View)?$/i.test(t));
      
      if (soIdx !== -1 || format === 'SINGLE_LINE_GRID') {
        const rawItem = {};

        if (tokens1.length >= 18) {
          // Single-line TSV format
          tokens1.forEach((val, idx) => {
            const key = colKeyMap1[idx] || (idx < STANDARD_28_COLUMNS.length ? STANDARD_28_COLUMNS[idx].key : `col_${idx}`);
            rawItem[key] = val;
          });
        } else {
          // 2-Row Format (Management Light or Management Bulk)
          tokens1.forEach((val, idx) => {
            const key = colKeyMap1[idx];
            if (key) rawItem[key] = val;
          });

          // Check line 2 for row pair
          if (i + 1 < lines.length) {
            const line2 = lines[i + 1];
            // Don't consume next line if it is itself another service order row
            const nextSo = line2.split('\t').some(t => /\b4\d{9}\b/.test(t));
            if (!nextSo) {
              const tokens2 = line2.split('\t').map(s => s.trim());
              tokens2.forEach((val, idx) => {
                const key = colKeyMap2[idx];
                if (key && val) rawItem[key] = val;
              });

              // Self-healing fallback if header2 alignment missed
              if (!rawItem.customer_name && !rawItem.service_type) {
                extractSecondaryTokensHeuristically(tokens2.filter(Boolean), rawItem);
              }
              i++; // Consumed secondary row
            }
          }
        }

        // Clean SO number and normalize fields
        const cleanSo = cleanServiceOrderNumber(rawItem.service_order_no || rawItem.asc_job_no);
        if (cleanSo) {
          rawItem.service_order_no = cleanSo;
          rawItem.asc_job_no = cleanServiceOrderNumber(rawItem.asc_job_no) || cleanSo;
          rawItem.model = String(rawItem.model || '').toUpperCase().trim();
          rawItem.city = String(rawItem.city || '').toUpperCase().trim();
          rawItem.service_type = convertServiceType(rawItem.service_type);
          rawItem.warranty_status = normalizeWarrantyStatus(rawItem.warranty_status, rawItem.service_type);

          records.push(rawItem);
        }
      }
      i++;
    }

    // Formulate final formulated output and simple output
    const formulatedRecords = records.map((rec, idx) => {
      const formulated = {};
      STANDARD_28_COLUMNS.forEach(col => {
        formulated[col.header] = col.formula ? col.formula(rec, idx, options) : (rec[col.key] || '');
      });
      // Also retain lower snake_case keys for internal JS logic
      Object.keys(rec).forEach(k => {
        formulated[k] = rec[k];
      });
      return formulated;
    });

    const simpleRecords = records.map(rec => ({
      date: formatStandardDate(rec.created_date || rec.assigned_date),
      service_order_no: rec.service_order_no,
      customer_name: rec.customer_name || '—',
      service_type: rec.service_type || '—',
      model: rec.model || '—',
      serial_no: rec.serial_no || '—',
      status: rec.status || 'Open',
      reason: rec.reason || '—',
      city: rec.city || '—',
      warranty_status: rec.warranty_status
    }));

    return {
      format,
      records: formulatedRecords,
      simpleRecords,
      rawRecords: records,
      totalCount: records.length
    };
  }

  /**
   * Helper to parse HTML tables (DOMParser)
   */
  function parseHtmlSource(htmlStr, options = {}) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlStr, 'text/html');
    const rows = Array.from(doc.querySelectorAll('tr'));
    const records = [];

    let header1Keys = [];
    let header2Keys = [];

    // Find headers
    rows.slice(0, 4).forEach(r => {
      const texts = Array.from(r.querySelectorAll('th, td')).map(c => c.textContent.trim());
      const mapped = mapHeaderRowToKeys(texts);
      if (mapped.includes('service_order_no')) {
        header1Keys = mapped;
      } else if (mapped.includes('customer_name') || mapped.includes('service_type')) {
        header2Keys = mapped;
      }
    });

    let i = 0;
    while (i < rows.length) {
      const cells1 = Array.from(rows[i].querySelectorAll('th, td')).map(c => c.textContent.trim());
      const soCandidate = cells1.find(txt => /\b4\d{9}\b/.test(txt) || /^\d{10}\s*(Edit|View)?$/i.test(txt));

      if (soCandidate) {
        const rawItem = {};
        header1Keys.forEach((k, idx) => {
          if (idx < cells1.length) rawItem[k] = cells1[idx];
        });

        // Inspect row 2
        if (i + 1 < rows.length) {
          const cells2 = Array.from(rows[i + 1].querySelectorAll('th, td')).map(c => c.textContent.trim());
          if (header2Keys.length > 0) {
            header2Keys.forEach((k, idx) => {
              if (idx < cells2.length) rawItem[k] = cells2[idx];
            });
          } else {
            extractSecondaryTokensHeuristically(cells2.filter(Boolean), rawItem);
          }
          i++;
        }

        const cleanSo = cleanServiceOrderNumber(rawItem.service_order_no || rawItem.asc_job_no);
        if (cleanSo) {
          rawItem.service_order_no = cleanSo;
          rawItem.asc_job_no = cleanServiceOrderNumber(rawItem.asc_job_no) || cleanSo;
          rawItem.model = String(rawItem.model || '').toUpperCase().trim();
          rawItem.city = String(rawItem.city || '').toUpperCase().trim();
          rawItem.service_type = convertServiceType(rawItem.service_type);
          rawItem.warranty_status = normalizeWarrantyStatus(rawItem.warranty_status, rawItem.service_type);

          records.push(rawItem);
        }
      }
      i++;
    }

    const formulatedRecords = records.map((rec, idx) => {
      const formulated = {};
      STANDARD_28_COLUMNS.forEach(col => {
        formulated[col.header] = col.formula ? col.formula(rec, idx, options) : (rec[col.key] || '');
      });
      Object.keys(rec).forEach(k => {
        formulated[k] = rec[k];
      });
      return formulated;
    });

    const simpleRecords = records.map(rec => ({
      date: formatStandardDate(rec.created_date || rec.assigned_date),
      service_order_no: rec.service_order_no,
      customer_name: rec.customer_name || '—',
      service_type: rec.service_type || '—',
      model: rec.model || '—',
      serial_no: rec.serial_no || '—',
      status: rec.status || 'Open',
      reason: rec.reason || '—',
      city: rec.city || '—',
      warranty_status: rec.warranty_status
    }));

    return {
      format: 'HTML_TABLE',
      records: formulatedRecords,
      simpleRecords,
      rawRecords: records,
      totalCount: records.length
    };
  }

  function extractSecondaryTokensHeuristically(tokens, targetObj) {
    if (!tokens || tokens.length === 0) return;

    // Find date
    const dateIdx = tokens.findIndex(t => /^\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4}$/.test(t));
    if (dateIdx !== -1) {
      targetObj.app_date = tokens[dateIdx];
      if (dateIdx === 1) {
        targetObj.city = tokens[0];
      } else if (dateIdx >= 2) {
        targetObj.customer_name = tokens[0];
        targetObj.city = tokens[1];
      }
    }

    // Find time
    const timeIdx = tokens.findIndex(t => /^\d{1,2}:\d{2}(?::\d{2})?$/.test(t));
    if (timeIdx !== -1) {
      targetObj.app_time = tokens[timeIdx];
    }

    // Find known service types
    const knownTypes = ['INITIAL INSTALLATION', 'IN-HOME', 'DEMONSTRATION', 'STOCK REPAIR', 'CUSTOMER CARE', 'PICK-UP SERVICE', 'CARRY IN'];
    const sTypeIdx = tokens.findIndex(t => knownTypes.includes(t.toUpperCase()));
    if (sTypeIdx !== -1) {
      targetObj.service_type = tokens[sTypeIdx];
      if (!targetObj.customer_name && sTypeIdx >= 2) {
        targetObj.customer_name = tokens[0];
        targetObj.city = tokens[1];
      } else if (!targetObj.city && sTypeIdx >= 1) {
        targetObj.city = tokens[0];
      }
      if (sTypeIdx + 1 < tokens.length) targetObj.status = tokens[sTypeIdx + 1];
      if (sTypeIdx + 2 < tokens.length) targetObj.reason = tokens[sTypeIdx + 2];
      if (sTypeIdx + 3 < tokens.length) targetObj.b2b = tokens[sTypeIdx + 3];
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 5. PUBLIC API EXPORT
  // ═════════════════════════════════════════════════════════════════════════
  return {
    FIELD_KEY_ALIASES,
    STANDARD_28_COLUMNS,
    SIMPLE_RAW_COLUMNS,
    cleanServiceOrderNumber,
    parseDateSmart,
    formatStandardDate,
    formatStandardTime,
    calcAging,
    getTATBucket,
    normalizeWarrantyStatus,
    getWarrantyCode,
    convertServiceType,
    getSamsungCategory,
    detectSourceFormat,
    parseMultiSourceData,
    registerColumn,
    getRegisteredColumns: () => [...REGISTERED_COLUMNS]
  };
});
