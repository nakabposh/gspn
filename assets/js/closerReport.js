/**
 * SVC Closer Report Engine — Lite Multi-File Closure Tracking Report
 */

(function () {
  'use strict';

  const PRODUCT_ORDER = ['AC', 'REF', 'WM', 'AV', 'OTHERS IH/PS'];

  const closerState = {
    mrngRecords: [],
    inflowRecords: [],
    currentRecords: [],
    mrngFiles: [],
    inflowFiles: [],
    currentFiles: [],
    isSampleMode: false,
    activePreviewTab: 'summary',
    activePasteSlot: 'mrng',
    pastedImageData: null
  };

  // --- TOAST NOTIFICATIONS ---
  function showToast(msg, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold text-white flex items-center gap-2 transition-all duration-300 pointer-events-auto ${
      type === 'success' ? 'bg-emerald-600' : (type === 'error' ? 'bg-rose-600' : 'bg-amber-600')
    }`;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // --- HELPERS ---
  function isDateOrTime(str) {
    if (!str) return false;
    const s = String(str).trim();
    return /^\d{1,4}[\.\/\-]\d{1,2}[\.\/\-]\d{2,4}/.test(s) || /^\d{1,2}:\d{2}(:\d{2})?/.test(s);
  }

  function cleanSO(val) {
    if (!val) return '';
    return String(val).replace(/[\u00A0\s]*Edit[\u00A0\s]*$/i, '').replace(/[\u00A0\s]+/g, ' ').trim();
  }

  function extractSO(str) {
    if (!str || isDateOrTime(str)) return '';
    const cleaned = cleanSO(str).replace(/[^\w]/g, '');
    const m = cleaned.match(/\d{7,13}/);
    return m ? m[0] : '';
  }

  function normalizeSOKey(val) {
    if (!val) return '';
    const s = cleanSO(val).replace(/\s+/g, '').toUpperCase();
    if (!s || s.startsWith('CALL_')) return '';
    return /^\d+$/.test(s) ? s.replace(/^0+/, '') : s;
  }

  function findSOInRow(row, preferredIdx = 0) {
    if (!Array.isArray(row)) return '';
    if (preferredIdx !== undefined && row[preferredIdx] !== undefined) {
      const candidate = extractSO(row[preferredIdx]);
      if (candidate) return candidate;
    }
    for (let i = 0; i < Math.min(row.length, 5); i++) {
      const candidate = extractSO(row[i]);
      if (candidate) return candidate;
    }
    return '';
  }

  function isSubRow(row, soIdx = 1, noIdx = 0) {
    if (!Array.isArray(row) || row.length === 0) return false;
    if (findSOInRow(row, soIdx)) return false;
    const first = String(row[noIdx] || '').trim();
    if (/^\d+$/.test(first) && Number(first) > 0) return false;
    return true;
  }

  // --- EXACT EXCEL MODEL CODE FORMULA ---
  // IF(LEFT(G,1)="S","HHP", IF(LEFT(G,1)="A","AC", IF(LEFT(G,2)="HT","AUD",
  // IF(LEFT(G,2)="HW","AUD", IF(LEFT(G,1)="Q","AV", IF(LEFT(G,1)="U","AV",
  // IF(LEFT(G,1)="N","IT", IF(LEFT(G,2)="LH","IT", IF(LEFT(G,2)="LC","IT",
  // IF(LEFT(G,1)="M","MW", IF(LEFT(G,1)="R","REF", IF(LEFT(G,1)="W","WM",
  // IF(LEFT(G,1)="D","DW", IF(LEFT(G,2)="CE","MW", IF(LEFT(G,2)="LS","IT","Other")))))))))))))))
  function classifyModelByFormula(model) {
    if (!model) return 'Other';
    const m = String(model).trim().toUpperCase().replace(/\s+/g, '');
    if (!m) return 'Other';
    const c1 = m.slice(0, 1);
    const c2 = m.slice(0, 2);
    if (c1 === 'S') return 'HHP';
    if (c1 === 'A') return 'AC';
    if (c2 === 'HT') return 'AUD';
    if (c2 === 'HW') return 'AUD';
    if (c1 === 'Q') return 'AV';
    if (c1 === 'U') return 'AV';
    if (c1 === 'N') return 'IT';
    if (c2 === 'LH') return 'IT';
    if (c2 === 'LC') return 'IT';
    if (c1 === 'M') return 'MW';
    if (c1 === 'R') return 'REF';
    if (c1 === 'W') return 'WM';
    if (c1 === 'D') return 'DW';
    if (c2 === 'CE') return 'MW';
    if (c2 === 'LS') return 'IT';
    return 'Other';
  }

  function mapToShortForm(rawProd, model) {
    if (model && String(model).trim() && String(model).trim().toUpperCase() !== 'MODEL') {
      return classifyModelByFormula(model);
    }
    if (rawProd) {
      const s = String(rawProd).trim().toUpperCase();
      if (s === 'HHP' || s.includes('PHONE') || s.includes('MOBILE')) return 'HHP';
      if (s === 'AC' || s.includes('AIR') || s === 'A/C') return 'AC';
      if (s === 'AUD' || s.includes('AUDIO') || s.includes('SOUND')) return 'AUD';
      if (s === 'AV' || s === 'CTV' || s === 'TV' || s.includes('TELEVISION')) return 'AV';
      if (s === 'IT' || s.includes('MONITOR') || s.includes('COMPUTER')) return 'IT';
      if (s === 'MW' || s === 'MWO' || s.includes('MICRO')) return 'MW';
      if (s === 'REF' || s.includes('FRIDGE') || s.includes('REFRIGERATOR')) return 'REF';
      if (s === 'WM' || s.includes('WASH') || s.includes('DRYER')) return 'WM';
      if (s === 'DW' || s.includes('DISH')) return 'DW';
    }
    return 'Other';
  }

  function toReportBucket(prod) {
    if (prod === 'AC' || prod === 'REF' || prod === 'WM' || prod === 'AV') return prod;
    return 'OTHERS IH/PS';
  }

  function isIHorPS(st) {
    if (!st) return false;
    const s = String(st).toUpperCase().trim();
    return s === 'IH' || s === 'PS' || s === 'PU' ||
      s.includes('IN-HOME') || s.includes('IN HOME') ||
      s.includes('PICK-UP') || s.includes('PICKUP') || s.includes('PICK UP');
  }

  function isIIDM(st) {
    if (!st) return false;
    const s = String(st).toUpperCase().trim();
    return s.includes('INSTALLATION') || s.includes('DEMO') || s === 'II' || s === 'IIDM';
  }

  function getCallCategory(st) {
    if (isIHorPS(st)) return 'IH/PS';
    if (isIIDM(st)) return 'IIDM';
    return 'CC';
  }

  // --- PARSER FOR IMAGE 2 (FLAT EXPORT) & IMAGE 4 (2-ROW GSPN GRID) ---
  function parseGSPNGrid(rows, sourceFile = '') {
    if (!Array.isArray(rows) || rows.length === 0) return [];

    let h1Idx = -1;
    let h2Idx = -1;
    const colMap1 = {};
    const colMap2 = {};

    for (let i = 0; i < Math.min(rows.length, 15); i++) {
      const row = rows[i];
      if (!Array.isArray(row)) continue;
      const cellsLower = row.map(c => String(c || '').trim().toLowerCase());
      const rowStr = cellsLower.join(' ');

      const hasPrimaryId = rowStr.includes('tracking no') || rowStr.includes('service order') ||
        rowStr.includes('so no') || rowStr.includes('so number') || rowStr.includes('order no');
      const hasPrimaryMeta = rowStr.includes('model') || rowStr.includes('asc ref') ||
        rowStr.includes('asc job') || rowStr.includes('service type') || rowStr.includes('serial');

      if (h1Idx === -1 && hasPrimaryId && hasPrimaryMeta) {
        h1Idx = i;
        cellsLower.forEach((c, idx) => {
          if (!c) return;
          if ((c === 'no' || c === '#' || c === 'sl') && !c.includes('order') && !c.includes('tracking')) colMap1.no = idx;
          if (c.includes('tracking no') || c.includes('service order') || c.includes('so no') || c.includes('so number') || c.includes('order no')) colMap1.so = idx;
          if (c.includes('asc ref') || c.includes('asc job') || c.includes('job no')) colMap1.ascJob = idx;
          if (c.includes('cp code')) colMap1.cpCode = idx;
          if (c.includes('cp name')) colMap1.cpName = idx;
          if (c.includes('created') || c.includes('requested date')) colMap1.created = idx;
          if (c.includes('assigned') && !c.includes('time')) colMap1.assigned = idx;
          if (c.includes('model')) colMap1.model = idx;
          if (c.includes('serial')) colMap1.serial = idx;
          if (c.includes('wty') || c.includes('warranty')) colMap1.wty = idx;
          if (c === 'voc') colMap1.voc = idx;
          if (c.includes('customer name') || c.includes('cust name') || c === 'customer') colMap1.customer = idx;
          if (c.includes('city')) colMap1.city = idx;
          if (c.includes('service type') || c.includes('svc type')) colMap1.svcType = idx;
          if (c.includes('first anticipated') || c.includes('app date') || c.includes('appointment date')) colMap1.appDate = idx;
          if (c.includes('status') && !c.includes('wty')) colMap1.status = idx;
          if (c.includes('reason')) colMap1.reason = idx;
          if (c === 'b2b') colMap1.b2b = idx;
          if (c.includes('dealer bp')) colMap1.dealerBp = idx;
          if (c.includes('dealer name')) colMap1.dealerName = idx;
          if (c.includes('phone') || c.includes('mobile')) colMap1.phone = idx;
          if (c.includes('email')) colMap1.email = idx;
        });
        continue;
      }

      if (h1Idx !== -1 && i === h1Idx + 1) {
        const isSecondHeader = (rowStr.includes('city') || rowStr.includes('app date') || rowStr.includes('customer')) &&
          (rowStr.includes('service type') || rowStr.includes('status') || rowStr.includes('reason') || rowStr.includes('b2b')) &&
          !findSOInRow(row, colMap1.so);
        if (isSecondHeader) {
          h2Idx = i;
          cellsLower.forEach((c, idx) => {
            if (!c) return;
            if (c.includes('customer name') || c.includes('cust name') || c === 'customer') colMap2.customer = idx;
            if (c.includes('city')) colMap2.city = idx;
            if (c.includes('app date') || c.includes('appointment date')) colMap2.appDate = idx;
            if (c.includes('service type') || c.includes('svc type')) colMap2.svcType = idx;
            if (c.includes('status') && !c.includes('wty')) colMap2.status = idx;
            if (c.includes('reason')) colMap2.reason = idx;
            if (c === 'b2b') colMap2.b2b = idx;
          });
        }
      }
    }

    const startRow = Math.max(h1Idx, h2Idx) !== -1 ? Math.max(h1Idx, h2Idx) + 1 : 0;

    if (h1Idx === -1) {
      colMap1.so = 1;
      colMap1.model = 5;
    }

    let nonEmptyRows = 0;
    let soRows = 0;
    for (let r = startRow; r < rows.length; r++) {
      const row = rows[r] || [];
      if (row.some(c => String(c || '').trim())) {
        nonEmptyRows++;
        if (findSOInRow(row, colMap1.so)) soRows++;
      }
    }
    const soDensity = nonEmptyRows > 0 ? (soRows / nonEmptyRows) : 0;
    const isTwoRowFormat = (h1Idx !== -1 && h2Idx > h1Idx) || (h1Idx === -1 && soDensity < 0.65 && soDensity > 0.35);

    const records = [];

    for (let r = startRow; r < rows.length; r++) {
      const row1 = rows[r] || [];
      if (row1.every(c => !String(c || '').trim())) continue;

      let soVal = findSOInRow(row1, colMap1.so !== undefined ? colMap1.so : 0);
      const noVal = colMap1.no !== undefined ? String(row1[colMap1.no] || '').trim() : '';
      const modelColVal = colMap1.model !== undefined ? String(row1[colMap1.model] || '').trim() : '';

      const isCallRow = Boolean(soVal) || (/^\d+$/.test(noVal) && Number(noVal) > 0) ||
        (modelColVal.length >= 3 && !isSubRow(row1, colMap1.so, colMap1.no));

      if (!isCallRow) continue;
      if (!soVal) soVal = `CALL_${records.length + 1}`;

      let row2 = [];
      if (isTwoRowFormat && r + 1 < rows.length) {
        const nextRow = rows[r + 1] || [];
        if (nextRow.some(c => String(c || '').trim()) && isSubRow(nextRow, colMap1.so, colMap1.no)) {
          row2 = nextRow;
          r++;
        }
      }

      const pick1 = (key) => (colMap1[key] !== undefined ? String(row1[colMap1[key]] || '').trim() : '');
      const pick2 = (key) => (colMap2[key] !== undefined ? String(row2[colMap2[key]] || '').trim() : '') || pick1(key);

      const modelVal = modelColVal || 'MODEL';
      let svcTypeVal = pick2('svcType');

      if (!svcTypeVal) {
        const searchCells = [...row1, ...row2];
        searchCells.forEach(cell => {
          const s = String(cell || '').trim();
          if (!svcTypeVal && /^(IN-HOME|CARRY-IN|IH|CI|PICK-UP|PICKUP|PICK UP|Customer Care|Initial Installation|Demonstration|IIDM|CC)/i.test(s)) {
            svcTypeVal = s;
          }
        });
      }

      const prodCode = mapToShortForm('', modelVal);

      records.push({
        no: noVal || records.length + 1,
        so: soVal,
        ascJob: cleanSO(pick1('ascJob')) || soVal,
        cpCode: pick1('cpCode'),
        cpName: pick1('cpName'),
        created: pick1('created'),
        assigned: pick1('assigned'),
        model: modelVal,
        serial: pick1('serial') || 'M000',
        wty: pick1('wty'),
        voc: pick1('voc'),
        customer: pick2('customer'),
        city: pick2('city'),
        appDate: pick2('appDate'),
        svcType: svcTypeVal || 'IN-HOME',
        status: pick2('status'),
        reason: pick2('reason'),
        b2b: pick2('b2b'),
        dealerBp: pick1('dealerBp'),
        dealerName: pick1('dealerName'),
        phone: pick1('phone'),
        email: pick1('email'),
        product: prodCode,
        sourceFile: sourceFile || ''
      });
    }

    return records;
  }

  function parseHtmlTableRows(htmlText) {
    if (typeof DOMParser === 'undefined') return [];
    const doc = new DOMParser().parseFromString(htmlText, 'text/html');
    const tables = Array.from(doc.querySelectorAll('table'));
    if (!tables.length) return [];
    let bestTable = tables[0];
    tables.forEach(t => {
      if (t.querySelectorAll('tr').length > bestTable.querySelectorAll('tr').length) bestTable = t;
    });
    return Array.from(bestTable.querySelectorAll('tr')).map(tr =>
      Array.from(tr.querySelectorAll('th,td')).map(td => (td.textContent || '').replace(/\u00a0/g, ' ').trim())
    );
  }

  // --- SLOT STATE MANAGEMENT (MULTI-FILE CLUBBING) ---
  function getSlotKeys(slotKey) {
    const cap = slotKey.charAt(0).toUpperCase() + slotKey.slice(1);
    return {
      cap,
      recordsProp: slotKey === 'mrng' ? 'mrngRecords' : (slotKey === 'inflow' ? 'inflowRecords' : 'currentRecords'),
      filesProp: slotKey === 'mrng' ? 'mrngFiles' : (slotKey === 'inflow' ? 'inflowFiles' : 'currentFiles')
    };
  }

  function refreshSlotUI(slotKey) {
    const { cap, recordsProp, filesProp } = getSlotKeys(slotKey);
    const records = closerState[recordsProp];
    const files = closerState[filesProp];
    const count = records.length;

    const badge = document.getElementById(`badge${cap}`);
    const prompt = document.getElementById(`dropPrompt${cap}`);
    const success = document.getElementById(`dropSuccess${cap}`);
    const nameEl = document.getElementById(`fileName${cap}`);
    const countEl = document.getElementById(`recordCount${cap}`);
    const listEl = document.getElementById(`fileList${cap}`);

    if (badge) {
      if (count > 0) {
        badge.textContent = files.length > 1 ? `${files.length} files · ${count} rows` : `${count} rows`;
        badge.className = 'px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap tabular-nums';
      } else {
        badge.textContent = '0 rows';
        badge.className = 'px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap tabular-nums';
      }
    }

    if (count > 0) {
      if (prompt) prompt.classList.add('hidden');
      if (success) success.classList.remove('hidden');
      if (nameEl) nameEl.textContent = files.length > 1 ? `${files.length} files clubbed` : (files[0]?.name || 'Loaded');
      if (countEl) countEl.textContent = `${count} rows`;
      if (listEl) {
        listEl.innerHTML = files.map((f, idx) => `
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-medium text-slate-700">
            <span class="truncate max-w-[120px]">${f.name}</span>
            <span class="text-slate-400">(${f.count})</span>
            <button type="button" onclick="event.stopPropagation(); removeSlotFile('${slotKey}', ${idx})" class="text-slate-400 hover:text-rose-600 font-bold ml-0.5" title="Remove">&times;</button>
          </span>
        `).join('');
      }
    } else {
      if (prompt) prompt.classList.remove('hidden');
      if (success) success.classList.add('hidden');
      if (listEl) listEl.innerHTML = '';
    }
  }

  function resetAllSlotsQuietly() {
    closerState.mrngRecords = [];
    closerState.inflowRecords = [];
    closerState.currentRecords = [];
    closerState.mrngFiles = [];
    closerState.inflowFiles = [];
    closerState.currentFiles = [];
    ['mrng', 'inflow', 'current'].forEach(refreshSlotUI);
  }

  function appendToSlotState(slotKey, fileName, records) {
    if (closerState.isSampleMode) {
      resetAllSlotsQuietly();
      closerState.isSampleMode = false;
    }

    const { recordsProp, filesProp } = getSlotKeys(slotKey);
    const tagged = records.map(r => ({ ...r, sourceFile: r.sourceFile || fileName }));
    closerState[recordsProp] = closerState[recordsProp].concat(tagged);
    closerState[filesProp].push({ name: fileName, count: tagged.length });

    refreshSlotUI(slotKey);
    computeAndRenderCloserReport();
  }

  function replaceSlotState(slotKey, fileName, records) {
    const { recordsProp, filesProp } = getSlotKeys(slotKey);
    closerState[recordsProp] = records.map(r => ({ ...r, sourceFile: r.sourceFile || fileName }));
    closerState[filesProp] = records.length ? [{ name: fileName, count: records.length }] : [];
    refreshSlotUI(slotKey);
    computeAndRenderCloserReport();
  }

  window.removeSlotFile = function (slotKey, fileIdx) {
    const { recordsProp, filesProp } = getSlotKeys(slotKey);
    const removed = closerState[filesProp][fileIdx];
    if (!removed) return;
    closerState[filesProp].splice(fileIdx, 1);
    let skipped = 0;
    closerState[recordsProp] = closerState[recordsProp].filter(r => {
      if (r.sourceFile === removed.name && skipped < removed.count) {
        skipped++;
        return false;
      }
      return true;
    });
    refreshSlotUI(slotKey);
    computeAndRenderCloserReport();
  };

  window.clearSlot = function (slotKey) {
    const { recordsProp, filesProp } = getSlotKeys(slotKey);
    closerState[recordsProp] = [];
    closerState[filesProp] = [];
    closerState.isSampleMode = false;
    refreshSlotUI(slotKey);
    computeAndRenderCloserReport();
  };

  // --- LITE SAMPLE DATA ---
  function loadAttachedSampleData() {
    resetAllSlotsQuietly();
    closerState.isSampleMode = true;

    const mrng = [];
    const inflow = [];
    const current = [];
    let soNum = 4445130000;

    function makeRecord(opts, soOverride) {
      soNum++;
      const soVal = soOverride || String(soNum);
      return {
        no: 1,
        so: soVal,
        ascJob: soVal,
        cpCode: '',
        cpName: '',
        created: '17.11.2026',
        assigned: '17.11.2026',
        model: opts.model,
        serial: 'M000',
        wty: opts.wty || 'In Warranty',
        voc: '',
        customer: opts.customer || `${opts.tag}`,
        city: 'GHAZIABAD',
        appDate: '18.11.2026',
        svcType: opts.svcType,
        status: opts.status,
        reason: opts.reason || '',
        b2b: '',
        dealerBp: '',
        dealerName: '',
        phone: '',
        email: '',
        product: classifyModelByFormula(opts.model),
        sourceFile: opts.sourceFile
      };
    }

    function seedGroupWithCarryover(mrngCount, flowCount, currCount, opts, declineCount = 0) {
      const mList = [];
      for (let i = 0; i < mrngCount; i++) {
        const rec = makeRecord({ ...opts, status: 'Pending', sourceFile: 'sample_morning_open.xlsx', customer: `${opts.tag} M${i + 1}` });
        rec.no = mrng.length + 1;
        mrng.push(rec);
        mList.push(rec);
      }
      const fList = [];
      for (let i = 0; i < flowCount; i++) {
        const rec = makeRecord({ ...opts, status: 'Engineer Assigned', reason: opts.reason || 'FTF(Ready to go)', sourceFile: 'sample_inflow.xlsx', customer: `${opts.tag} F${i + 1}` });
        rec.no = inflow.length + 1;
        inflow.push(rec);
        fList.push(rec);
      }
      const carryoverPool = [...mList, ...fList];
      const matchedNeeded = Math.max(0, currCount - declineCount);
      for (let i = 0; i < matchedNeeded && i < carryoverPool.length; i++) {
        const src = carryoverPool[i];
        current.push({
          ...src,
          no: current.length + 1,
          status: 'Pending',
          reason: '',
          sourceFile: 'sample_current_open.xlsx'
        });
      }
      for (let i = 0; i < declineCount; i++) {
        const rec = makeRecord({ ...opts, status: 'Pending', sourceFile: 'sample_current_open.xlsx', customer: `${opts.tag} Decline ${i + 1}` }, String(4445990001 + i));
        rec.no = current.length + 1;
        current.push(rec);
      }
    }

    const ihSample = [
      { model: 'AR18CY3AAGBNNA', tag: 'AC', mrng: 4, flow: 2, curr: 3, decline: 0 },
      { model: 'RT34DG5A4DS8HL', tag: 'REF', mrng: 8, flow: 4, curr: 6, decline: 0 },
      { model: 'WF600B0BHWQUTL', tag: 'WM', mrng: 9, flow: 5, curr: 7, decline: 1 },
      { model: 'UA43DU7700KLXL', tag: 'AV', mrng: 6, flow: 3, curr: 5, decline: 0 },
      { model: 'DW60M5042FS/TL', tag: 'OTH', mrng: 5, flow: 2, curr: 4, decline: 0 }
    ];

    ihSample.forEach(item => {
      seedGroupWithCarryover(item.mrng, item.flow, item.curr, { model: item.model, tag: item.tag, svcType: 'IN-HOME' }, item.decline);
    });

    // IIDM AC & IIDM NON AC
    seedGroupWithCarryover(6, 0, 2, { model: 'AR12BY4AMWKNNA', tag: 'IIDM-AC', svcType: 'Initial Installation' }, 0);
    seedGroupWithCarryover(5, 4, 3, { model: 'UA43F5600FUXXL', tag: 'IIDM-NON', svcType: 'Initial Installation', reason: 'Repair in progress' }, 0);

    // CC AC only
    seedGroupWithCarryover(1, 2, 1, { model: 'AR18CY3AAGBNNA', tag: 'CC-AC', svcType: 'Customer Care' }, 0);

    replaceSlotState('mrng', 'sample_morning_open.xlsx', mrng);
    replaceSlotState('inflow', 'sample_inflow.xlsx', inflow);
    replaceSlotState('current', 'sample_current_open.xlsx', current);
  }

  // --- METRICS COMPUTATION (WITH DECLINE CALLS LOGIC) ---
  function calcPct(closed, flow) {
    if (!flow || flow <= 0) return 0;
    return (closed / flow) * 100;
  }

  function formatPct(closed, flow) {
    if (!flow || flow <= 0) return '0%';
    const pct = (closed / flow) * 100;
    if (Math.abs(pct - Math.round(pct)) < 0.005) return `${Math.round(pct)}%`;
    return `${pct.toFixed(2)}%`;
  }

  function computeDeclineCalls(mrng, inflow, current) {
    const clubRecords = [
      ...mrng.map(r => ({ ...r, clubOrigin: 'Morning Open' })),
      ...inflow.map(r => ({ ...r, clubOrigin: 'InFlow' }))
    ];
    const clubSoSet = new Set();
    clubRecords.forEach(r => {
      const key = normalizeSOKey(r.so) || normalizeSOKey(r.ascJob);
      if (key) clubSoSet.add(key);
    });

    const declineRecords = [];
    const currentWithMatch = current.map(r => {
      const key = normalizeSOKey(r.so) || normalizeSOKey(r.ascJob);
      const isFound = key ? clubSoSet.has(key) : true;
      const vlookupStatus = isFound ? 'Found in Club Data' : '#N/A';
      if (!isFound) {
        declineRecords.push({
          ...r,
          vlookupStatus: '#N/A',
          declineNote: 'Decline Call (Missing in Morning Open + InFlow)'
        });
      }
      return { ...r, vlookupStatus };
    });

    return { clubRecords, declineRecords, currentWithMatch };
  }

  function computeCloserReportData() {
    const mrng = closerState.mrngRecords;
    const inflow = closerState.inflowRecords;
    const current = closerState.currentRecords;

    // Decline Calls Logic:
    // Club Data = Morning Open + InFlow
    // VLOOKUP(Current Open Call ID, Club Data, 1, 0) -> #N/A values are Decline Calls -> add into Flow
    const { clubRecords, declineRecords, currentWithMatch } = computeDeclineCalls(mrng, inflow, current);
    const effectiveInflow = [...inflow, ...declineRecords];

    // 1. IH/PS Product Buckets
    const prodMap = {};
    PRODUCT_ORDER.forEach(code => {
      prodMap[code] = { code, mrng: 0, flow: 0, rawFlow: 0, decline: 0, closed: 0, current: 0, pct: 0 };
    });

    mrng.forEach(r => { if (isIHorPS(r.svcType)) prodMap[toReportBucket(r.product)].mrng++; });
    inflow.forEach(r => { if (isIHorPS(r.svcType)) prodMap[toReportBucket(r.product)].rawFlow++; });
    declineRecords.forEach(r => { if (isIHorPS(r.svcType)) prodMap[toReportBucket(r.product)].decline++; });
    effectiveInflow.forEach(r => { if (isIHorPS(r.svcType)) prodMap[toReportBucket(r.product)].flow++; });
    current.forEach(r => { if (isIHorPS(r.svcType)) prodMap[toReportBucket(r.product)].current++; });

    let ihMrng = 0, ihFlow = 0, ihClosed = 0, ihCurrent = 0;
    const products = PRODUCT_ORDER.map(code => {
      const p = prodMap[code];
      p.closed = Math.max(0, (p.mrng + p.flow) - p.current);
      p.pct = calcPct(p.closed, p.flow);
      ihMrng += p.mrng;
      ihFlow += p.flow;
      ihClosed += p.closed;
      ihCurrent += p.current;
      return p;
    });

    const ihSubtotal = {
      code: 'IH/PS TOTAL',
      mrng: ihMrng,
      flow: ihFlow,
      closed: ihClosed,
      current: ihCurrent,
      pct: calcPct(ihClosed, ihFlow)
    };

    // 2. IIDM
    const iidmAC = { code: 'IIDM AC', mrng: 0, flow: 0, closed: 0, current: 0, pct: 0 };
    const iidmNonAC = { code: 'IIDM NON AC', mrng: 0, flow: 0, closed: 0, current: 0, pct: 0 };

    function tallyIIDM(list, key) {
      list.forEach(r => {
        if (isIIDM(r.svcType)) {
          if (r.product === 'AC') iidmAC[key]++;
          else iidmNonAC[key]++;
        }
      });
    }
    tallyIIDM(mrng, 'mrng');
    tallyIIDM(effectiveInflow, 'flow');
    tallyIIDM(current, 'current');

    [iidmAC, iidmNonAC].forEach(item => {
      item.closed = Math.max(0, (item.mrng + item.flow) - item.current);
      item.pct = calcPct(item.closed, item.flow);
    });

    const iidmTotal = {
      code: 'IIDM TOTAL',
      mrng: iidmAC.mrng + iidmNonAC.mrng,
      flow: iidmAC.flow + iidmNonAC.flow,
      closed: iidmAC.closed + iidmNonAC.closed,
      current: iidmAC.current + iidmNonAC.current,
      pct: calcPct(iidmAC.closed + iidmNonAC.closed, iidmAC.flow + iidmNonAC.flow)
    };

    // 3. Total Closed (IH/PS + IIDM)
    const grandTotal = {
      code: 'Total Closed',
      mrng: ihSubtotal.mrng + iidmTotal.mrng,
      flow: ihSubtotal.flow + iidmTotal.flow,
      closed: ihSubtotal.closed + iidmTotal.closed,
      current: ihSubtotal.current + iidmTotal.current,
      pct: calcPct(ihSubtotal.closed + iidmTotal.closed, ihSubtotal.flow + iidmTotal.flow)
    };

    // 4. CC AC ONLY (No CC NON AC separate category)
    const ccAC = { code: 'CC AC', mrng: 0, flow: 0, closed: 0, current: 0, pct: 0 };
    function tallyCCAC(list, key) {
      list.forEach(r => {
        if (!isIHorPS(r.svcType) && !isIIDM(r.svcType) && r.product === 'AC') {
          ccAC[key]++;
        }
      });
    }
    tallyCCAC(mrng, 'mrng');
    tallyCCAC(effectiveInflow, 'flow');
    tallyCCAC(current, 'current');
    ccAC.closed = Math.max(0, (ccAC.mrng + ccAC.flow) - ccAC.current);
    ccAC.pct = calcPct(ccAC.closed, ccAC.flow);

    return {
      products,
      ihSubtotal,
      iidm: { ac: iidmAC, nonAc: iidmNonAC, total: iidmTotal },
      grandTotal,
      cc: { ac: ccAC },
      clubRecords,
      declineRecords,
      currentWithMatch,
      rawCounts: {
        mrng: mrng.length,
        flow: inflow.length,
        decline: declineRecords.length,
        effectiveFlow: effectiveInflow.length,
        current: current.length,
        total: mrng.length + inflow.length + current.length
      }
    };
  }

  // --- SINGLE-LINE REPORT TABLE BUILDER ---
  const BD = 'border:1px solid #1e293b; white-space:nowrap;';
  const FONT_TBL = "font-family:'Inter',Arial,sans-serif; border-collapse:collapse; font-size:13px; font-variant-numeric:tabular-nums;";

  function renderStdRow(label, row) {
    return `
      <tr style="background-color:#f3f4f6; color:#000000;">
        <td style="${BD} padding:7px 16px; text-align:left; font-weight:600;">${label}</td>
        <td style="${BD} padding:7px 16px; text-align:center;">${row.mrng}</td>
        <td style="${BD} padding:7px 16px; text-align:center;">${row.flow}</td>
        <td style="${BD} padding:7px 16px; text-align:center; background-color:#f3e7c9; font-weight:700;">${row.closed}</td>
        <td style="${BD} padding:7px 16px; text-align:center;">${row.current}</td>
        <td style="${BD} padding:7px 16px; text-align:center; font-weight:700;">${formatPct(row.closed, row.flow)}</td>
      </tr>
    `;
  }

  function renderTotalRow(label, row, bg, color) {
    return `
      <tr style="background-color:${bg}; color:${color}; font-weight:700;">
        <td style="${BD} padding:7px 16px; text-align:left;">${label}</td>
        <td style="${BD} padding:7px 16px; text-align:center;">${row.mrng}</td>
        <td style="${BD} padding:7px 16px; text-align:center;">${row.flow}</td>
        <td style="${BD} padding:7px 16px; text-align:center;">${row.closed}</td>
        <td style="${BD} padding:7px 16px; text-align:center;">${row.current}</td>
        <td style="${BD} padding:7px 16px; text-align:center;">${formatPct(row.closed, row.flow)}</td>
      </tr>
    `;
  }

  function buildSummaryTableHtml(data) {
    const prodRows = data.products.map(p => renderStdRow(p.code, p)).join('');
    return `
      <table style="${FONT_TBL} min-width:780px; width:100%; max-width:920px; margin:0 auto;">
        <thead>
          <tr style="background-color:#a66904; color:#ffffff; font-weight:700; font-size:14px;">
            <th colspan="6" style="${BD} padding:9px 16px; text-align:center;">Closure Tracking Report</th>
          </tr>
          <tr style="background-color:#d9a507; color:#000000; font-weight:700;">
            <th style="${BD} padding:7px 16px; text-align:left;">Product</th>
            <th style="${BD} padding:7px 16px; text-align:center;">Morning Open</th>
            <th style="${BD} padding:7px 16px; text-align:center;">Flow</th>
            <th style="${BD} padding:7px 16px; text-align:center;">Closed Calls</th>
            <th style="${BD} padding:7px 16px; text-align:center;">Current Open</th>
            <th style="${BD} padding:7px 16px; text-align:center;">CLOSURE %</th>
          </tr>
        </thead>
        <tbody>
          ${prodRows}
          ${renderTotalRow('IH/PS TOTAL', data.ihSubtotal, '#92b450', '#000000')}
          ${renderStdRow('IIDM AC', data.iidm.ac)}
          ${renderStdRow('IIDM NON AC', data.iidm.nonAc)}
          ${renderTotalRow('IIDM TOTAL', data.iidm.total, '#92b450', '#000000')}
          ${renderTotalRow('Total Closed', data.grandTotal, '#df3e0b', '#ffffff')}
          <tr style="background-color:#c4bd97; color:#000000; font-weight:700;">
            <td style="${BD} padding:7px 16px; text-align:left;">PRODUCT</td>
            <td style="${BD} padding:7px 16px; text-align:center;">Morning Open</td>
            <td style="${BD} padding:7px 16px; text-align:center;">Flow</td>
            <td style="${BD} padding:7px 16px; text-align:center;">Closed Calls</td>
            <td style="${BD} padding:7px 16px; text-align:center;">Current Open</td>
            <td style="${BD} padding:7px 16px; text-align:center;">CLOSURE %</td>
          </tr>
          ${renderStdRow('CC AC', data.cc.ac)}
        </tbody>
      </table>
    `;
  }

  function computeAndRenderCloserReport() {
    const area = document.getElementById('closerReportRenderArea');
    if (!area) return;

    const data = computeCloserReportData();

    if (data.rawCounts.total === 0) {
      area.innerHTML = `
        <div class="py-12 text-center text-slate-400 text-xs">
          Drop Morning Open, InFlow, and Current Open Excel files above, then click Process or
          <button id="btnEmptyLoadSample" class="text-[#a66904] font-bold underline ml-1">Load Sample</button>.
        </div>
      `;
      const btn = document.getElementById('btnEmptyLoadSample');
      if (btn) btn.addEventListener('click', loadAttachedSampleData);
      return;
    }

    area.innerHTML = buildSummaryTableHtml(data);
  }

  function processReportExplicitly() {
    const data = computeCloserReportData();
    computeAndRenderCloserReport();
    if (data.rawCounts.total === 0) {
      showToast('Drop Excel files before processing.', 'info');
      return;
    }
    const declText = data.rawCounts.decline > 0 ? ` (+${data.rawCounts.decline} Decline)` : '';
    showToast(`Processed: Morning ${data.rawCounts.mrng} · Flow ${data.rawCounts.flow}${declText} · Current ${data.rawCounts.current}`);
  }

  // --- SEPARATE TABBED PREVIEW MODAL ---
  function renderPreviewRawTable(records, slotTitle, showMatchCol = false) {
    if (!records || records.length === 0) {
      return `<div class="py-12 text-center text-slate-400 text-xs">No calls in ${slotTitle}.</div>`;
    }
    const rowsHtml = records.map((r, i) => `
      <tr class="hover:bg-slate-50 border-b border-slate-200 text-xs">
        <td class="p-2 text-slate-500 font-mono whitespace-nowrap">${i + 1}</td>
        <td class="p-2 font-mono font-bold text-blue-700 whitespace-nowrap">${r.so}</td>
        <td class="p-2 font-mono text-slate-700 whitespace-nowrap">${r.model}</td>
        <td class="p-2 font-bold text-slate-900 whitespace-nowrap">${r.product}</td>
        <td class="p-2 font-semibold text-slate-700 whitespace-nowrap">${getCallCategory(r.svcType)}</td>
        <td class="p-2 whitespace-nowrap">${r.svcType}</td>
        <td class="p-2 whitespace-nowrap">${r.status || '-'}</td>
        <td class="p-2 whitespace-nowrap">${r.wty || '-'}</td>
        ${showMatchCol ? `<td class="p-2 whitespace-nowrap font-bold ${r.vlookupStatus === '#N/A' ? 'text-rose-700 bg-rose-50' : 'text-emerald-700'}">${r.vlookupStatus || '-'}</td>` : ''}
        <td class="p-2 whitespace-nowrap">${r.customer || '-'}</td>
        <td class="p-2 whitespace-nowrap">${r.city || '-'}</td>
        <td class="p-2 text-slate-500 whitespace-nowrap">${r.sourceFile || ''}</td>
      </tr>
    `).join('');

    return `
      <div class="border border-slate-200 rounded-xl overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-100 text-slate-800 text-[11px] font-bold uppercase sticky top-0 border-b border-slate-300">
            <tr>
              <th class="p-2 whitespace-nowrap">#</th>
              <th class="p-2 whitespace-nowrap">Tracking / SO</th>
              <th class="p-2 whitespace-nowrap">Model Code</th>
              <th class="p-2 whitespace-nowrap">Product</th>
              <th class="p-2 whitespace-nowrap">Group</th>
              <th class="p-2 whitespace-nowrap">Service Type</th>
              <th class="p-2 whitespace-nowrap">Status</th>
              <th class="p-2 whitespace-nowrap">Wty</th>
              ${showMatchCol ? '<th class="p-2 whitespace-nowrap">Club VLOOKUP</th>' : ''}
              <th class="p-2 whitespace-nowrap">Customer</th>
              <th class="p-2 whitespace-nowrap">City</th>
              <th class="p-2 whitespace-nowrap">Source File</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;
  }

  function renderPreviewModalBody() {
    const data = computeCloserReportData();
    const tab = closerState.activePreviewTab || 'summary';

    const tabSummary = document.getElementById('pvTabSummary');
    const tabMrng = document.getElementById('pvTabMrng');
    const tabInflow = document.getElementById('pvTabInflow');
    const tabCurrent = document.getElementById('pvTabCurrent');
    const tabDecline = document.getElementById('pvTabDecline');
    const countsEl = document.getElementById('previewSummaryCounts');
    const footerEl = document.getElementById('previewFooterMeta');
    const bodyEl = document.getElementById('previewModalBody');

    if (tabMrng) tabMrng.textContent = `Morning Open (${data.rawCounts.mrng})`;
    if (tabInflow) tabInflow.textContent = `InFlow (${data.rawCounts.flow})`;
    if (tabCurrent) tabCurrent.textContent = `Current Open (${data.rawCounts.current})`;
    if (tabDecline) tabDecline.textContent = `Decline Calls (${data.rawCounts.decline})`;
    if (countsEl) {
      countsEl.textContent = `Morning: ${data.rawCounts.mrng} | InFlow: ${data.rawCounts.flow} + ${data.rawCounts.decline} Decline = ${data.rawCounts.effectiveFlow} | Current: ${data.rawCounts.current}`;
    }
    if (footerEl) {
      footerEl.textContent = `${data.rawCounts.total} uploaded rows · ${data.rawCounts.decline} Decline (#N/A) added to Flow`;
    }

    [
      [tabSummary, 'summary'],
      [tabMrng, 'mrng'],
      [tabInflow, 'inflow'],
      [tabCurrent, 'current'],
      [tabDecline, 'decline']
    ].forEach(([el, key]) => {
      if (!el) return;
      if (key === tab) el.classList.add('active');
      else el.classList.remove('active');
    });

    if (!bodyEl) return;
    if (tab === 'mrng') {
      bodyEl.innerHTML = renderPreviewRawTable(closerState.mrngRecords, 'Morning Open');
    } else if (tab === 'inflow') {
      bodyEl.innerHTML = renderPreviewRawTable(closerState.inflowRecords, 'InFlow');
    } else if (tab === 'current') {
      bodyEl.innerHTML = renderPreviewRawTable(data.currentWithMatch, 'Current Open', true);
    } else if (tab === 'decline') {
      const banner = `
        <div class="mb-3 px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
          <span><strong>Decline Calls Logic:</strong> Club Data = Morning Open (${data.rawCounts.mrng}) + InFlow (${data.rawCounts.flow}) &rarr; VLOOKUP against Current Open (${data.rawCounts.current}). <strong>${data.rawCounts.decline}</strong> #N/A calls added into Flow.</span>
        </div>
      `;
      bodyEl.innerHTML = banner + renderPreviewRawTable(data.declineRecords, 'Decline Calls (#N/A vs Club Data)', true);
    } else {
      bodyEl.innerHTML = `<div class="p-4 overflow-x-auto">${buildSummaryTableHtml(data)}</div>`;
    }
  }

  window.openPreviewModal = function (initialTab = 'summary') {
    closerState.activePreviewTab = initialTab || 'summary';
    renderPreviewModalBody();
    const modal = document.getElementById('previewModal');
    if (modal) modal.classList.remove('hidden');
  };

  window.closePreviewModal = function () {
    const modal = document.getElementById('previewModal');
    if (modal) modal.classList.add('hidden');
  };

  window.openCloserRawViewer = function (slotKey) {
    window.openPreviewModal(slotKey || 'mrng');
  };

  // --- COPY TABLE ---
  function copyCloserReportToMail() {
    const area = document.getElementById('closerReportRenderArea');
    if (!area || !area.querySelector('table')) {
      showToast('No report to copy!', 'error');
      return;
    }

    const htmlContent = area.innerHTML;
    const plainText = area.innerText || area.textContent;

    if (navigator.clipboard && window.ClipboardItem) {
      const blobHtml = new Blob([htmlContent], { type: 'text/html' });
      const blobText = new Blob([plainText], { type: 'text/plain' });
      navigator.clipboard.write([new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })])
        .then(() => showToast('Table copied!'))
        .catch(() => fallbackCopyText(plainText));
    } else {
      fallbackCopyText(plainText);
    }
  }

  function fallbackCopyText(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Copied!');
    } catch (_) {
      showToast('Copy failed.', 'error');
    }
    document.body.removeChild(ta);
  }

  // --- EXPORT EXCEL: Summary, Morning Open, InFlow, Current Open, Decline Calls, Club Data ---
  async function exportCloserToExcel() {
    const data = computeCloserReportData();
    if (data.rawCounts.total === 0) {
      showToast('No data to export.', 'error');
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `Closure_Tracking_Report_${dateStr}.xlsx`;
    const clubbedHeaders = [
      'Tracking / SO No', 'ASC Ref / Job', 'Product', 'Report Bucket', 'Category',
      'Model Code', 'Service Type', 'Status', 'Reason', 'Wty Status', 'B2B',
      'Requested / Created', 'Assigned', 'App / Anticipated Date', 'Serial No',
      'Customer Name', 'City', 'CP Code', 'CP Name', 'Dealer BP', 'Dealer Name',
      'Phone Number', 'Email Id', 'Source File'
    ];
    const currentHeaders = [...clubbedHeaders, 'Club Data VLOOKUP'];
    const declineHeaders = [...clubbedHeaders, 'Club Data VLOOKUP', 'Decline Note'];
    const clubDataHeaders = ['Source Sheet', ...clubbedHeaders];

    function mapRecordRow(r) {
      return [
        r.so, r.ascJob, r.product, toReportBucket(r.product), getCallCategory(r.svcType),
        r.model, r.svcType, r.status || '', r.reason || '', r.wty || '', r.b2b || '',
        r.created || '', r.assigned || '', r.appDate || '', r.serial || '',
        r.customer || '', r.city || '', r.cpCode || '', r.cpName || '', r.dealerBp || '', r.dealerName || '',
        r.phone || '', r.email || '', r.sourceFile || ''
      ];
    }

    if (typeof ExcelJS !== 'undefined') {
      try {
        const wb = new ExcelJS.Workbook();
        const thinBorder = {
          top: { style: 'thin', color: { argb: 'FF1E293B' } },
          left: { style: 'thin', color: { argb: 'FF1E293B' } },
          bottom: { style: 'thin', color: { argb: 'FF1E293B' } },
          right: { style: 'thin', color: { argb: 'FF1E293B' } }
        };

        function styleSummaryRow(ws, rowIdx, fillHex, textHex, bold = false, highlightClosed = false) {
          const r = ws.getRow(rowIdx);
          for (let c = 1; c <= 6; c++) {
            const cell = r.getCell(c);
            const cellFill = (highlightClosed && c === 4) ? 'FFF3E7C9' : fillHex;
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: cellFill } };
            cell.font = { name: 'Calibri', size: 11, bold: bold || (highlightClosed && (c === 4 || c === 6)), color: { argb: textHex } };
            cell.border = thinBorder;
            cell.alignment = { horizontal: c === 1 ? 'left' : 'center', vertical: 'middle' };
          }
        }

        // Sheet 1: Summary
        const ws1 = wb.addWorksheet('Summary');
        ws1.columns = [
          { width: 22 }, { width: 16 }, { width: 12 }, { width: 16 }, { width: 16 }, { width: 14 }
        ];
        ws1.addRow(['Closure Tracking Report', '', '', '', '', '']);
        ws1.mergeCells('A1:F1');
        styleSummaryRow(ws1, 1, 'FFA66904', 'FFFFFFFF', true);
        ws1.getRow(1).getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

        ws1.addRow(['Product', 'Morning Open', 'Flow', 'Closed Calls', 'Current Open', 'CLOSURE %']);
        styleSummaryRow(ws1, 2, 'FFD9A507', 'FF000000', true);

        let rIdx = 3;
        data.products.forEach(p => {
          ws1.addRow([p.code, p.mrng, p.flow, p.closed, p.current, formatPct(p.closed, p.flow)]);
          styleSummaryRow(ws1, rIdx++, 'FFF3F4F6', 'FF000000', false, true);
        });

        ws1.addRow(['IH/PS TOTAL', data.ihSubtotal.mrng, data.ihSubtotal.flow, data.ihSubtotal.closed, data.ihSubtotal.current, formatPct(data.ihSubtotal.closed, data.ihSubtotal.flow)]);
        styleSummaryRow(ws1, rIdx++, 'FF92B450', 'FF000000', true);

        ws1.addRow(['IIDM AC', data.iidm.ac.mrng, data.iidm.ac.flow, data.iidm.ac.closed, data.iidm.ac.current, formatPct(data.iidm.ac.closed, data.iidm.ac.flow)]);
        styleSummaryRow(ws1, rIdx++, 'FFF3F4F6', 'FF000000', false, true);

        ws1.addRow(['IIDM NON AC', data.iidm.nonAc.mrng, data.iidm.nonAc.flow, data.iidm.nonAc.closed, data.iidm.nonAc.current, formatPct(data.iidm.nonAc.closed, data.iidm.nonAc.flow)]);
        styleSummaryRow(ws1, rIdx++, 'FFF3F4F6', 'FF000000', false, true);

        ws1.addRow(['IIDM TOTAL', data.iidm.total.mrng, data.iidm.total.flow, data.iidm.total.closed, data.iidm.total.current, formatPct(data.iidm.total.closed, data.iidm.total.flow)]);
        styleSummaryRow(ws1, rIdx++, 'FF92B450', 'FF000000', true);

        ws1.addRow(['Total Closed', data.grandTotal.mrng, data.grandTotal.flow, data.grandTotal.closed, data.grandTotal.current, formatPct(data.grandTotal.closed, data.grandTotal.flow)]);
        styleSummaryRow(ws1, rIdx++, 'FFDF3E0B', 'FFFFFFFF', true);

        ws1.addRow(['PRODUCT', 'Morning Open', 'Flow', 'Closed Calls', 'Current Open', 'CLOSURE %']);
        styleSummaryRow(ws1, rIdx++, 'FFC4BD97', 'FF000000', true);

        ws1.addRow(['CC AC', data.cc.ac.mrng, data.cc.ac.flow, data.cc.ac.closed, data.cc.ac.current, formatPct(data.cc.ac.closed, data.cc.ac.flow)]);
        styleSummaryRow(ws1, rIdx++, 'FFF3F4F6', 'FF000000', false, true);

        // Helper for data sheets
        function addStyledSheet(sheetName, headers, rowsList, headerBg = 'FFD9A507', headerFg = 'FF000000') {
          const ws = wb.addWorksheet(sheetName);
          ws.columns = headers.map((h, i) => ({
            width: i <= 1 ? 16 : (h.includes('Note') || h.includes('VLOOKUP') ? 28 : 18)
          }));
          const hdr = ws.addRow(headers);
          hdr.eachCell(cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerBg } };
            cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: headerFg } };
            cell.border = thinBorder;
          });
          rowsList.forEach(rowArr => ws.addRow(rowArr));
        }

        addStyledSheet('Morning Open', clubbedHeaders, closerState.mrngRecords.map(mapRecordRow));
        addStyledSheet('InFlow', clubbedHeaders, closerState.inflowRecords.map(mapRecordRow));
        addStyledSheet('Current Open', currentHeaders, data.currentWithMatch.map(r => [...mapRecordRow(r), r.vlookupStatus]));
        addStyledSheet(
          'Decline Calls',
          declineHeaders,
          data.declineRecords.map(r => [...mapRecordRow(r), r.vlookupStatus, r.declineNote]),
          'FFE11D48',
          'FFFFFFFF'
        );
        addStyledSheet('Club Data', clubDataHeaders, data.clubRecords.map(r => [r.clubOrigin, ...mapRecordRow(r)]));

        const buf = await wb.xlsx.writeBuffer();
        const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Exported Excel with Decline Calls sheet!');
        return;
      } catch (err) {
        console.warn('ExcelJS export failed, falling back to XLSX:', err);
      }
    }

    if (typeof XLSX === 'undefined') {
      showToast('Excel library not loaded!', 'error');
      return;
    }

    const wb = XLSX.utils.book_new();
    const summaryRows = [
      ['Closure Tracking Report'],
      ['Product', 'Morning Open', 'Flow', 'Closed Calls', 'Current Open', 'CLOSURE %']
    ];
    data.products.forEach(p => summaryRows.push([p.code, p.mrng, p.flow, p.closed, p.current, formatPct(p.closed, p.flow)]));
    summaryRows.push(['IH/PS TOTAL', data.ihSubtotal.mrng, data.ihSubtotal.flow, data.ihSubtotal.closed, data.ihSubtotal.current, formatPct(data.ihSubtotal.closed, data.ihSubtotal.flow)]);
    summaryRows.push(['IIDM AC', data.iidm.ac.mrng, data.iidm.ac.flow, data.iidm.ac.closed, data.iidm.ac.current, formatPct(data.iidm.ac.closed, data.iidm.ac.flow)]);
    summaryRows.push(['IIDM NON AC', data.iidm.nonAc.mrng, data.iidm.nonAc.flow, data.iidm.nonAc.closed, data.iidm.nonAc.current, formatPct(data.iidm.nonAc.closed, data.iidm.nonAc.flow)]);
    summaryRows.push(['IIDM TOTAL', data.iidm.total.mrng, data.iidm.total.flow, data.iidm.total.closed, data.iidm.total.current, formatPct(data.iidm.total.closed, data.iidm.total.flow)]);
    summaryRows.push(['Total Closed', data.grandTotal.mrng, data.grandTotal.flow, data.grandTotal.closed, data.grandTotal.current, formatPct(data.grandTotal.closed, data.grandTotal.flow)]);
    summaryRows.push(['PRODUCT', 'Morning Open', 'Flow', 'Closed Calls', 'Current Open', 'CLOSURE %']);
    summaryRows.push(['CC AC', data.cc.ac.mrng, data.cc.ac.flow, data.cc.ac.closed, data.cc.ac.current, formatPct(data.cc.ac.closed, data.cc.ac.flow)]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryRows), 'Summary');

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([clubbedHeaders, ...closerState.mrngRecords.map(mapRecordRow)]), 'Morning Open');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([clubbedHeaders, ...closerState.inflowRecords.map(mapRecordRow)]), 'InFlow');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([currentHeaders, ...data.currentWithMatch.map(r => [...mapRecordRow(r), r.vlookupStatus])]), 'Current Open');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([declineHeaders, ...data.declineRecords.map(r => [...mapRecordRow(r), r.vlookupStatus, r.declineNote])]), 'Decline Calls');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([clubDataHeaders, ...data.clubRecords.map(r => [r.clubOrigin, ...mapRecordRow(r)])]), 'Club Data');

    XLSX.writeFile(wb, fileName);
    showToast('Exported Excel with Decline Calls sheet!');
  }

  // --- PASTE MODAL & OCR ---
  window.openPasteModal = function (slotKey) {
    closerState.activePasteSlot = slotKey;
    closerState.pastedImageData = null;
    const titleEl = document.getElementById('pasteModalTitle');
    const slotNames = { mrng: '1. Morning Open', inflow: '2. Flow (In-Flow)', current: '3. Current Open' };
    if (titleEl) titleEl.textContent = `Paste Data — ${slotNames[slotKey] || slotKey}`;
    const ta = document.getElementById('pasteTextarea');
    if (ta) ta.value = '';
    const imgPreview = document.getElementById('pasteImagePreviewArea');
    if (imgPreview) imgPreview.classList.add('hidden');
    switchPasteTab('text');
    const modal = document.getElementById('pasteModal');
    if (modal) modal.classList.remove('hidden');
  };

  window.closePasteModal = function () {
    const modal = document.getElementById('pasteModal');
    if (modal) modal.classList.add('hidden');
  };

  window.switchPasteTab = function (tab) {
    const btnText = document.getElementById('tabBtnText');
    const btnImage = document.getElementById('tabBtnImage');
    const panelText = document.getElementById('tabPanelText');
    const panelImage = document.getElementById('tabPanelImage');
    if (tab === 'text') {
      if (btnText) btnText.className = 'px-4 py-2 border-b-2 border-amber-700 font-bold text-amber-900 text-xs';
      if (btnImage) btnImage.className = 'px-4 py-2 border-b-2 border-transparent font-medium text-slate-500 hover:text-slate-700 text-xs';
      if (panelText) panelText.classList.remove('hidden');
      if (panelImage) panelImage.classList.add('hidden');
    } else {
      if (btnText) btnText.className = 'px-4 py-2 border-b-2 border-transparent font-medium text-slate-500 hover:text-slate-700 text-xs';
      if (btnImage) btnImage.className = 'px-4 py-2 border-b-2 border-amber-700 font-bold text-amber-900 text-xs';
      if (panelText) panelText.classList.add('hidden');
      if (panelImage) panelImage.classList.remove('hidden');
    }
  };

  async function extractCallsFromImage(base64Data, mimeType, slotKey) {
    showToast('Extracting image...', 'info');
    const targetSlot = slotKey || closerState.activePasteSlot || 'mrng';
    try {
      const resp = await fetch('/api/extract-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data, mimeType: mimeType || 'image/jpeg', slot: targetSlot })
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const result = await resp.json();
      if (result.records && Array.isArray(result.records) && result.records.length > 0) {
        const parsed = result.records.map((r, i) => ({
          no: r.no || i + 1,
          so: cleanSO(r.so || `CALL_${i + 1}`),
          ascJob: cleanSO(r.ascJob || r.so || `CALL_${i + 1}`),
          model: String(r.model || 'MODEL').trim(),
          product: mapToShortForm(r.product, r.model),
          customer: r.customer || '',
          city: r.city || '',
          svcType: r.svcType || 'IN-HOME',
          status: r.status || '',
          reason: r.reason || '',
          wty: r.wty || '',
          b2b: r.b2b || '',
          sourceFile: 'screenshot.png'
        }));
        appendToSlotState(targetSlot, 'screenshot.png', parsed);
        closePasteModal();
        showToast(`Added ${parsed.length} rows.`);
        return;
      }
      throw new Error('No rows detected');
    } catch (err) {
      if (typeof Tesseract !== 'undefined') {
        try {
          const ocr = await Tesseract.recognize(base64Data, 'eng');
          const text = (ocr && ocr.data && ocr.data.text) ? ocr.data.text : '';
          const lines = text.split(/\r?\n/).map(l => l.split(/[\t\s]{2,}/));
          const records = parseGSPNGrid(lines, 'ocr_image.png');
          if (records.length > 0) {
            appendToSlotState(targetSlot, 'ocr_image.png', records);
            closePasteModal();
            showToast(`Added ${records.length} rows.`);
            return;
          }
        } catch (_) { /* ignore OCR error */ }
      }
      showToast(`Image parse failed: ${err.message}`, 'error');
    }
  }

  function handlePastedImageFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
      closerState.pastedImageData = e.target.result;
      const previewArea = document.getElementById('pasteImagePreviewArea');
      const previewImg = document.getElementById('pasteImagePreview');
      if (previewArea && previewImg) {
        previewImg.src = e.target.result;
        previewArea.classList.remove('hidden');
      }
      switchPasteTab('image');
    };
    reader.readAsDataURL(file);
  }

  function applyPasteData() {
    const isImageTab = document.getElementById('tabPanelImage') && !document.getElementById('tabPanelImage').classList.contains('hidden');
    if (isImageTab && closerState.pastedImageData) {
      extractCallsFromImage(closerState.pastedImageData, 'image/png', closerState.activePasteSlot);
      return;
    }

    const ta = document.getElementById('pasteTextarea');
    if (!ta) return;
    const text = ta.value.trim();
    if (!text) {
      showToast('Paste rows first!', 'error');
      return;
    }
    const slot = closerState.activePasteSlot || 'mrng';
    const lines = text.split(/\r?\n/).map(l => l.split('\t'));
    const records = parseGSPNGrid(lines, `pasted_${slot}.tsv`);
    if (records.length === 0) {
      showToast('Could not recognize rows.', 'error');
      return;
    }
    appendToSlotState(slot, `pasted_${slot}.tsv`, records);
    closePasteModal();
    showToast(`Added ${records.length} rows.`);
  }

  // --- MULTI-FILE UPLOAD & DROP HANDLERS ---
  function setupFileSlot(slotKey) {
    const capKey = slotKey.charAt(0).toUpperCase() + slotKey.slice(1);
    const dropCard = document.getElementById(`dropCard${capKey}`) || document.getElementById(`dropZone${capKey}`);
    const dropZone = document.getElementById(`dropZone${capKey}`);
    const fileInput = document.getElementById(`file${capKey}`);
    if (!dropZone || !fileInput) return;

    dropZone.addEventListener('click', () => fileInput.click());

    const dragTarget = dropCard || dropZone;
    dragTarget.addEventListener('dragover', e => {
      e.preventDefault();
      dragTarget.classList.add('dragover');
    });
    dragTarget.addEventListener('dragleave', e => {
      e.preventDefault();
      dragTarget.classList.remove('dragover');
    });
    dragTarget.addEventListener('drop', e => {
      e.preventDefault();
      dragTarget.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUploadedFiles(e.dataTransfer.files, slotKey);
      }
    });

    fileInput.addEventListener('change', e => {
      if (e.target.files && e.target.files.length > 0) {
        handleUploadedFiles(e.target.files, slotKey);
        e.target.value = '';
      }
    });
  }

  function handleUploadedFiles(fileList, slotKey) {
    const files = Array.from(fileList || []);
    files.forEach(file => handleSingleFile(file, slotKey));
  }

  function handleSingleFile(file, slotKey) {
    const fileName = file.name;
    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|bmp)$/i.test(fileName);

    if (isImage) {
      const reader = new FileReader();
      reader.onload = e => extractCallsFromImage(e.target.result, file.type || 'image/jpeg', slotKey);
      reader.readAsDataURL(file);
      return;
    }

    const lower = fileName.toLowerCase();
    if (lower.endsWith('.csv') || lower.endsWith('.tsv') || lower.endsWith('.txt') || lower.endsWith('.htm') || lower.endsWith('.html')) {
      const reader = new FileReader();
      reader.onload = e => {
        const text = String(e.target.result || '');
        const rows = /<table/i.test(text)
          ? parseHtmlTableRows(text)
          : text.split(/\r?\n/).map(l => l.split(lower.endsWith('.tsv') || text.includes('\t') ? '\t' : ','));
        const records = parseGSPNGrid(rows, fileName);
        appendToSlotState(slotKey, fileName, records);
        showToast(`Clubbed ${records.length} rows from ${fileName}`);
      };
      reader.readAsText(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const buf = new Uint8Array(e.target.result);
        const headText = new TextDecoder('utf-8', { fatal: false }).decode(buf.slice(0, 512));
        if (/<html|<table/i.test(headText)) {
          const fullText = new TextDecoder('utf-8', { fatal: false }).decode(buf);
          const rows = parseHtmlTableRows(fullText);
          const records = parseGSPNGrid(rows, fileName);
          appendToSlotState(slotKey, fileName, records);
          showToast(`Clubbed ${records.length} rows from ${fileName}`);
          return;
        }
        const workbook = XLSX.read(buf, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
        const records = parseGSPNGrid(rows, fileName);
        appendToSlotState(slotKey, fileName, records);
        showToast(`Clubbed ${records.length} rows from ${fileName}`);
      } catch (err) {
        console.error(err);
        showToast(`Error reading ${fileName}`, 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function clearAllData() {
    closerState.isSampleMode = false;
    resetAllSlotsQuietly();
    computeAndRenderCloserReport();
    showToast('Cleared.');
  }

  // --- GLOBAL PASTE LISTENER (Ctrl+V SCREENSHOTS) ---
  window.addEventListener('paste', e => {
    if (!e.clipboardData || !e.clipboardData.items) return;
    for (let i = 0; i < e.clipboardData.items.length; i++) {
      const item = e.clipboardData.items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          handlePastedImageFile(file);
          openPasteModal(closerState.activePasteSlot || 'mrng');
          switchPasteTab('image');
          return;
        }
      }
    }
  });

  // --- INIT ---
  document.addEventListener('DOMContentLoaded', () => {
    setupFileSlot('mrng');
    setupFileSlot('inflow');
    setupFileSlot('current');

    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };

    bind('btnTopLoadSample', loadAttachedSampleData);
    bind('btnLoadSampleFiles', loadAttachedSampleData);
    bind('btnClearAll', clearAllData);
    bind('btnProcessReport', processReportExplicitly);
    bind('btnPreviewData', () => window.openPreviewModal('summary'));
    bind('btnTopCopyMail', copyCloserReportToMail);
    bind('btnCopyCloserHtml', copyCloserReportToMail);
    bind('btnTopExportExcel', exportCloserToExcel);
    bind('btnExportCloserExcel', exportCloserToExcel);
    bind('btnApplyPaste', applyPasteData);

    document.querySelectorAll('.preview-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-preview-tab');
        if (tab) {
          closerState.activePreviewTab = tab;
          renderPreviewModalBody();
        }
      });
    });

    const modalImgInput = document.getElementById('modalImageInput');
    if (modalImgInput) {
      modalImgInput.addEventListener('change', e => {
        if (e.target.files && e.target.files.length > 0) {
          handlePastedImageFile(e.target.files[0]);
        }
      });
    }

    loadAttachedSampleData();
  });

})();
