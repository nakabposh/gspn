/**
 * universalDataDialog.js — Universal Data Input Dialog with Page Fragments
 * 
 * Implements the Page Fragment Wireframe architecture:
 *   [Page Fragment 1]: Input Data (Formatted / Un-Formatted Data / File Upload)
 *   [Page Fragment 2]: Format into Simple Format (Required Data only / RAW Data toggle)
 *   [Page Fragment 3]: Formatting into the As per Required Sheet Format (28-Col Formulated)
 *   [Process & Add +]: Passes formulated & raw records back to caller via callback
 */

(function (root, factory) {
  const mod = factory();
  if (typeof root !== 'undefined') root.UniversalDataDialog = mod;
  if (typeof globalThis !== 'undefined') globalThis.UniversalDataDialog = mod;
  if (typeof module === 'object' && module && module.exports) module.exports = mod;
})(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  let dialogOverlay = null;
  let activeCallback = null;
  let activeOptions = {};
  let currentFragment = 1; // 1, 2, or 3
  let parsedState = {
    format: 'EMPTY',
    records: [],
    simpleRecords: [],
    rawRecords: [],
    totalCount: 0
  };
  let activeViewMode = 'simple'; // 'simple' or 'raw' in Fragment 2
  let searchQuery = '';

  /**
   * Builds the modal DOM element once
   */
  function ensureDialogDOM() {
    if (dialogOverlay) return;

    dialogOverlay = document.createElement('div');
    dialogOverlay.id = 'universalDataDialogOverlay';
    dialogOverlay.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm hidden';
    dialogOverlay.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans" style="font-family:'Inter',sans-serif;">
        
        <!-- DIALOG HEADER -->
        <div class="px-6 py-4 bg-gradient-to-r from-[#0f2e59] via-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-between flex-shrink-0 shadow-md">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              <svg class="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-extrabold text-white font-outfit tracking-wide" style="font-family:'Outfit',sans-serif;">Universal GSPN Data Importer</h3>
                <span id="uddSourceBadge" class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 hidden">Auto-Detected</span>
              </div>
              <p class="text-xs text-blue-100/90 mt-0.5">Multi-source parser: Service Order Management Light &middot; Bulk &middot; TSV &middot; Excel</p>
            </div>
          </div>
          <button type="button" id="uddBtnClose" class="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition" title="Close dialog">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- PAGE FRAGMENTS STEPPER BAR (Wireframe Image 1: Fragment 1 -> Fragment 2 -> Fragment 3) -->
        <div class="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center space-x-1 sm:space-x-2 text-xs font-semibold">
            <!-- Step 1 -->
            <button type="button" id="uddStepBtn1" class="udd-step-pill px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-bold text-blue-700 bg-blue-100 border border-blue-200">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">1</span>
              <span>Input Data</span>
            </button>
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <!-- Step 2 -->
            <button type="button" id="uddStepBtn2" class="udd-step-pill px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium text-slate-500 hover:text-slate-800">
              <span class="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[11px] font-bold">2</span>
              <span>Simple Format</span>
            </button>
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <!-- Step 3 -->
            <button type="button" id="uddStepBtn3" class="udd-step-pill px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium text-slate-500 hover:text-slate-800">
              <span class="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[11px] font-bold">3</span>
              <span>Required Sheet Format</span>
            </button>
          </div>

          <!-- Quick Stats / Status indicator -->
          <div id="uddStatusBadge" class="hidden text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            0 Records Ready
          </div>
        </div>

        <!-- DIALOG CONTENT AREA (PAGES FRAGMENTS) -->
        <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          <!-- ═══════════════════════════════════════════════════════════════ -->
          <!-- PAGE FRAGMENT 1: INPUT DATA (Formatted / Un-Formatted Data)   -->
          <!-- ═══════════════════════════════════════════════════════════════ -->
          <div id="uddFragment1" class="space-y-4">
            <div class="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
              <span class="text-base flex-shrink-0">📋</span>
              <div>
                <strong>Multi-Source Automatic Key Mapping:</strong>
                Supports pasting raw tables directly from Samsung GSPN:
                <span class="font-semibold text-blue-800">Service Order Management Light (14 cols)</span>,
                <span class="font-semibold text-blue-800">Service Order Management (Bulk) (9 cols)</span>,
                single-line TSV, or uploading Excel spreadsheets. Leading zeros and SO numbers are cleanly preserved.
              </div>
            </div>

            <!-- Input Mode Selector -->
            <div class="flex border-b border-slate-200 text-xs font-bold">
              <button type="button" id="uddTabPasteBtn" class="py-2 px-4 border-b-2 border-blue-600 text-blue-700 flex items-center gap-1.5 focus:outline-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                Paste Table Data (Ctrl + V)
              </button>
              <button type="button" id="uddTabFileBtn" class="py-2 px-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center gap-1.5 focus:outline-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                Upload File (.xlsx, .xls, .csv, .htm)
              </button>
            </div>

            <!-- Paste Area -->
            <div id="uddSectionPaste" class="space-y-3">
              <div class="relative">
                <textarea id="uddPasteTextarea" rows="9" class="w-full text-xs font-mono p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 shadow-inner" placeholder="Paste data here from GSPN or Excel... (Press Ctrl + V)&#10;&#10;Supports:&#10;• Service Order Management Light (2 Rows / Call)&#10;• Service Order Management Bulk (2 Rows / Call)&#10;• Single-Line Tabular TSV or HTML Table"></textarea>
              </div>
              <div class="flex items-center justify-between text-xs">
                <button type="button" id="uddBtnClipboard" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition">
                  <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                  Paste from Clipboard
                </button>
                <button type="button" id="uddBtnParseInput" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md transition flex items-center gap-1.5">
                  <span>Parse &amp; Inspect Data &rarr;</span>
                </button>
              </div>
            </div>

            <!-- File Upload Area -->
            <div id="uddSectionFile" class="space-y-3 hidden">
              <div id="uddDropArea" class="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 rounded-xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center">
                <input type="file" id="uddFileInput" accept=".xlsx,.xls,.csv,.htm,.html,.tsv" class="hidden" />
                <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                </div>
                <p class="text-sm font-bold text-slate-800">Click to browse or Drag &amp; Drop Excel file here</p>
                <p class="text-xs text-slate-500 mt-1">Supports GSPN Excel downloads &amp; TRIM DATA (.xlsx, .xls, .csv)</p>
                <div id="uddFileSelectedPill" class="hidden mt-3 px-3 py-1 bg-emerald-100 border border-emerald-300 rounded text-xs font-bold text-emerald-800"></div>
              </div>
            </div>
          </div>

          <!-- ═══════════════════════════════════════════════════════════════ -->
          <!-- PAGE FRAGMENT 2: SIMPLE FORMAT (Required Data Only / RAW Toggle)-->
          <!-- ═══════════════════════════════════════════════════════════════ -->
          <div id="uddFragment2" class="space-y-3 hidden">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 class="text-xs font-black uppercase text-slate-700 tracking-wider font-outfit" style="font-family:'Outfit',sans-serif;">Required Data Extracted</h4>
                <p class="text-xs text-slate-500">Core clean fields normalized from the raw input.</p>
              </div>

              <!-- "Showing the RAW Data by Click button" from Image 1 wireframe -->
              <div class="flex items-center gap-2">
                <div class="bg-slate-100 p-0.5 rounded-lg border border-slate-300 flex items-center text-xs font-bold">
                  <button type="button" id="uddToggleSimpleView" class="px-3 py-1 rounded-md bg-white text-blue-700 shadow-sm transition">Simple Required</button>
                  <button type="button" id="uddToggleRawView" class="px-3 py-1 rounded-md text-slate-600 hover:text-slate-900 transition">RAW Data (Without Formulation)</button>
                </div>
                <input type="text" id="uddFrag2Search" placeholder="Filter records..." class="text-xs px-3 py-1 border border-slate-300 rounded-lg w-40 focus:outline-none focus:border-blue-500">
              </div>
            </div>

            <!-- Table Container -->
            <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div class="max-h-[360px] overflow-x-auto overflow-y-auto">
                <table class="w-full text-xs text-left border-collapse" id="uddFrag2Table">
                  <thead class="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10 border-b border-slate-200 uppercase text-[11px] tracking-wider" id="uddFrag2Thead">
                    <!-- Dynamic Headers -->
                  </thead>
                  <tbody class="divide-y divide-slate-100" id="uddFrag2Tbody">
                    <!-- Dynamic Rows -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- ═══════════════════════════════════════════════════════════════ -->
          <!-- PAGE FRAGMENT 3: FORMATTING AS PER REQUIRED SHEET FORMAT      -->
          <!-- ═══════════════════════════════════════════════════════════════ -->
          <div id="uddFragment3" class="space-y-3 hidden">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 class="text-xs font-black uppercase text-slate-700 tracking-wider font-outfit" style="font-family:'Outfit',sans-serif;">Standardized Formulated Sheet Preview</h4>
                <p class="text-xs text-slate-500">Formulated with Aging, TAT Buckets, Warranty Code, Master Reason &amp; Category.</p>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold" id="uddFrag3TotalCount">0 Records</span>
              </div>
            </div>

            <!-- Formulated Table Container -->
            <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div class="max-h-[360px] overflow-x-auto overflow-y-auto">
                <table class="w-full text-xs text-left border-collapse" id="uddFrag3Table">
                  <thead class="bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold sticky top-0 z-10 border-b border-slate-700 text-[11px]" id="uddFrag3Thead">
                    <!-- 28 Standard Formulated Headers -->
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-mono text-[11.5px]" id="uddFrag3Tbody">
                    <!-- Formulated Data Rows -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        <!-- DIALOG FOOTER & ACTION (Wireframe: "Process & Add +" button + Shared Callback) -->
        <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-2 text-xs">
            <button type="button" id="uddBtnBack" class="px-3.5 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 transition hidden">
              &larr; Back
            </button>
            <span id="uddFooterNote" class="text-slate-500 text-xs">Ready to import data into report</span>
          </div>

          <div class="flex items-center gap-2">
            <button type="button" id="uddBtnCancel" class="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
              Cancel
            </button>
            <button type="button" id="uddBtnNext" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition hidden">
              Next &rarr;
            </button>
            <!-- EXACT BUTTON FROM IMAGE 1 WIREFRAME: "Process & Add +" -->
            <button type="button" id="uddBtnProcessAndAdd" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black shadow-md transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              <span>Process &amp; Add +</span>
            </button>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(dialogOverlay);
    bindDialogEvents();
  }

  /**
   * Binds user interactions inside Universal Data Dialog
   */
  function bindDialogEvents() {
    const btnClose = document.getElementById('uddBtnClose');
    const btnCancel = document.getElementById('uddBtnCancel');
    const stepBtn1 = document.getElementById('uddStepBtn1');
    const stepBtn2 = document.getElementById('uddStepBtn2');
    const stepBtn3 = document.getElementById('uddStepBtn3');
    const btnNext = document.getElementById('uddBtnNext');
    const btnBack = document.getElementById('uddBtnBack');
    const btnProcess = document.getElementById('uddBtnProcessAndAdd');

    const tabPasteBtn = document.getElementById('uddTabPasteBtn');
    const tabFileBtn = document.getElementById('uddTabFileBtn');
    const secPaste = document.getElementById('uddSectionPaste');
    const secFile = document.getElementById('uddSectionFile');

    const btnClipboard = document.getElementById('uddBtnClipboard');
    const btnParse = document.getElementById('uddBtnParseInput');
    const textarea = document.getElementById('uddPasteTextarea');

    const dropArea = document.getElementById('uddDropArea');
    const fileInput = document.getElementById('uddFileInput');

    const toggleSimple = document.getElementById('uddToggleSimpleView');
    const toggleRaw = document.getElementById('uddToggleRawView');
    const frag2Search = document.getElementById('uddFrag2Search');

    // Close
    [btnClose, btnCancel].forEach(b => {
      if (b) b.addEventListener('click', closeDialog);
    });

    // Stepper buttons
    if (stepBtn1) stepBtn1.addEventListener('click', () => switchFragment(1));
    if (stepBtn2) stepBtn2.addEventListener('click', () => { if (parsedState.records.length > 0) switchFragment(2); });
    if (stepBtn3) stepBtn3.addEventListener('click', () => { if (parsedState.records.length > 0) switchFragment(3); });

    if (btnBack) btnBack.addEventListener('click', () => {
      if (currentFragment > 1) switchFragment(currentFragment - 1);
    });

    if (btnNext) btnNext.addEventListener('click', () => {
      if (currentFragment === 1) {
        processInputText(textarea.value);
        if (parsedState.records.length > 0) switchFragment(2);
      } else if (currentFragment === 2) {
        switchFragment(3);
      }
    });

    // Input Tabs
    if (tabPasteBtn && tabFileBtn) {
      tabPasteBtn.addEventListener('click', () => {
        tabPasteBtn.classList.replace('text-slate-500', 'text-blue-700');
        tabPasteBtn.classList.replace('border-transparent', 'border-blue-600');
        tabFileBtn.classList.replace('text-blue-700', 'text-slate-500');
        tabFileBtn.classList.replace('border-blue-600', 'border-transparent');
        secPaste.classList.remove('hidden');
        secFile.classList.add('hidden');
      });

      tabFileBtn.addEventListener('click', () => {
        tabFileBtn.classList.replace('text-slate-500', 'text-blue-700');
        tabFileBtn.classList.replace('border-transparent', 'border-blue-600');
        tabPasteBtn.classList.replace('text-blue-700', 'text-slate-500');
        tabPasteBtn.classList.replace('border-blue-600', 'border-transparent');
        secFile.classList.remove('hidden');
        secPaste.classList.add('hidden');
      });
    }

    // Clipboard paste button
    if (btnClipboard) {
      btnClipboard.addEventListener('click', async () => {
        try {
          const text = await navigator.clipboard.readText();
          if (text && text.trim()) {
            textarea.value = text;
            processInputText(text);
          }
        } catch (e) {
          // If permission denied, prompt focus
          textarea.focus();
        }
      });
    }

    // Parse button
    if (btnParse) {
      btnParse.addEventListener('click', () => {
        processInputText(textarea.value);
        if (parsedState.records.length > 0) {
          switchFragment(2);
        }
      });
    }

    // Auto-parse on paste inside textarea
    if (textarea) {
      textarea.addEventListener('paste', () => {
        setTimeout(() => {
          processInputText(textarea.value);
        }, 80);
      });
    }

    // File Drag & Drop
    if (dropArea && fileInput) {
      dropArea.addEventListener('click', () => fileInput.click());
      dropArea.addEventListener('dragover', e => { e.preventDefault(); dropArea.classList.add('border-blue-500', 'bg-blue-50/50'); });
      dropArea.addEventListener('dragleave', e => { e.preventDefault(); dropArea.classList.remove('border-blue-500', 'bg-blue-50/50'); });
      dropArea.addEventListener('drop', e => {
        e.preventDefault();
        dropArea.classList.remove('border-blue-500', 'bg-blue-50/50');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileUploaded(e.dataTransfer.files[0]);
        }
      });
      fileInput.addEventListener('change', e => {
        if (e.target.files && e.target.files[0]) {
          handleFileUploaded(e.target.files[0]);
        }
      });
    }

    // Fragment 2 View Toggle (Simple vs RAW)
    if (toggleSimple && toggleRaw) {
      toggleSimple.addEventListener('click', () => {
        activeViewMode = 'simple';
        toggleSimple.classList.replace('text-slate-600', 'text-blue-700');
        toggleSimple.classList.add('bg-white', 'shadow-sm');
        toggleRaw.classList.replace('text-blue-700', 'text-slate-600');
        toggleRaw.classList.remove('bg-white', 'shadow-sm');
        renderFragment2Table();
      });

      toggleRaw.addEventListener('click', () => {
        activeViewMode = 'raw';
        toggleRaw.classList.replace('text-slate-600', 'text-blue-700');
        toggleRaw.classList.add('bg-white', 'shadow-sm');
        toggleSimple.classList.replace('text-blue-700', 'text-slate-600');
        toggleSimple.classList.remove('bg-white', 'shadow-sm');
        renderFragment2Table();
      });
    }

    if (frag2Search) {
      frag2Search.addEventListener('input', e => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderFragment2Table();
      });
    }

    // PROCESS & ADD + CALLBACK
    if (btnProcess) {
      btnProcess.addEventListener('click', () => {
        if (parsedState.records.length === 0) {
          processInputText(textarea.value);
        }

        if (parsedState.records.length === 0) {
          alert('Please enter or paste valid service order data first.');
          return;
        }

        if (typeof activeCallback === 'function') {
          // Send formulated records, raw records, and simple records to host page
          activeCallback(parsedState.records, {
            format: parsedState.format,
            rawRecords: parsedState.rawRecords,
            simpleRecords: parsedState.simpleRecords,
            totalCount: parsedState.totalCount
          });
        }

        closeDialog();
      });
    }
  }

  /**
   * Switches visible Page Fragment
   */
  function switchFragment(num) {
    currentFragment = num;
    const f1 = document.getElementById('uddFragment1');
    const f2 = document.getElementById('uddFragment2');
    const f3 = document.getElementById('uddFragment3');
    const bBack = document.getElementById('uddBtnBack');
    const bNext = document.getElementById('uddBtnNext');
    const s1 = document.getElementById('uddStepBtn1');
    const s2 = document.getElementById('uddStepBtn2');
    const s3 = document.getElementById('uddStepBtn3');

    [f1, f2, f3].forEach((f, idx) => {
      if (f) {
        if (idx + 1 === num) f.classList.remove('hidden');
        else f.classList.add('hidden');
      }
    });

    // Update Step Pills
    [s1, s2, s3].forEach((btn, idx) => {
      if (!btn) return;
      const stepNum = idx + 1;
      const circle = btn.querySelector('span');
      if (stepNum === num) {
        btn.className = 'udd-step-pill px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-bold text-blue-700 bg-blue-100 border border-blue-200';
        if (circle) circle.className = 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black';
      } else if (stepNum < num || (parsedState.records.length > 0)) {
        btn.className = 'udd-step-pill px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-semibold text-slate-700 hover:bg-slate-200';
        if (circle) circle.className = 'w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[11px] font-bold';
      } else {
        btn.className = 'udd-step-pill px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium text-slate-400';
        if (circle) circle.className = 'w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[11px] font-bold';
      }
    });

    if (bBack) {
      if (num > 1) bBack.classList.remove('hidden');
      else bBack.classList.add('hidden');
    }

    if (bNext) {
      if (num < 3 && parsedState.records.length > 0) bNext.classList.remove('hidden');
      else bNext.classList.add('hidden');
    }

    if (num === 2) renderFragment2Table();
    if (num === 3) renderFragment3Table();
  }

  /**
   * Processes input text via OpenPendingContext engine
   */
  function processInputText(text) {
    if (!text || !text.trim()) return;

    const ctx = (typeof window !== 'undefined' && window.OpenPendingContext) || (typeof globalThis !== 'undefined' && globalThis.OpenPendingContext);
    if (!ctx) {
      console.error('OpenPendingContext module not found!');
      return;
    }

    parsedState = ctx.parseMultiSourceData(text, { cutoffDate: activeOptions.cutoffDate || null });

    // Update UI status badges
    const badge = document.getElementById('uddSourceBadge');
    const statusBadge = document.getElementById('uddStatusBadge');
    const formatLabels = {
      'MANAGEMENT_LITE_2ROW': 'Management Lite (14-Col 2-Row)',
      'MANAGEMENT_BULK_2ROW': 'Management Bulk (9-Col 2-Row)',
      'SINGLE_LINE_GRID': 'Single-Line Standard Grid (TSV)',
      'HTML_TABLE': 'GSPN HTML Table'
    };

    if (badge) {
      badge.textContent = formatLabels[parsedState.format] || parsedState.format;
      badge.classList.remove('hidden');
    }

    if (statusBadge) {
      statusBadge.textContent = `${parsedState.records.length} Valid Service Orders`;
      statusBadge.classList.remove('hidden');
    }

    const btnProcess = document.getElementById('uddBtnProcessAndAdd');
    if (btnProcess) {
      btnProcess.disabled = parsedState.records.length === 0;
    }

    const bNext = document.getElementById('uddBtnNext');
    if (bNext && parsedState.records.length > 0) {
      bNext.classList.remove('hidden');
    }
  }

  /**
   * Handles uploaded file (Excel, CSV, HTM)
   */
  function handleFileUploaded(file) {
    const pill = document.getElementById('uddFileSelectedPill');
    if (pill) {
      pill.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      pill.classList.remove('hidden');
    }

    const reader = new FileReader();
    const isText = file.name.endsWith('.csv') || file.name.endsWith('.txt') || file.name.endsWith('.tsv') || file.name.endsWith('.htm') || file.name.endsWith('.html');

    if (isText) {
      reader.onload = e => {
        const text = e.target.result;
        document.getElementById('uddPasteTextarea').value = text;
        processInputText(text);
        switchFragment(2);
      };
      reader.readAsText(file);
    } else {
      // Excel binary using SheetJS XLSX
      reader.onload = e => {
        try {
          if (typeof XLSX === 'undefined') {
            alert('XLSX library not loaded. Please paste text instead.');
            return;
          }
          const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          const firstSheet = wb.Sheets[wb.SheetNames[0]];
          const tsv = XLSX.utils.sheet_to_csv(firstSheet, { FS: '\t' });
          document.getElementById('uddPasteTextarea').value = tsv;
          processInputText(tsv);
          switchFragment(2);
        } catch (err) {
          alert('Failed to read Excel file: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  /**
   * Renders Fragment 2 (Simple Required Data or RAW toggle)
   */
  function renderFragment2Table() {
    const thead = document.getElementById('uddFrag2Thead');
    const tbody = document.getElementById('uddFrag2Tbody');
    if (!thead || !tbody) return;

    if (activeViewMode === 'simple') {
      // Simple Required Headers
      thead.innerHTML = `
        <tr>
          <th class="py-2.5 px-3">#</th>
          <th class="py-2.5 px-3">Date</th>
          <th class="py-2.5 px-3">Service Order No.</th>
          <th class="py-2.5 px-3">Customer Name</th>
          <th class="py-2.5 px-3">Service Type</th>
          <th class="py-2.5 px-3">Model</th>
          <th class="py-2.5 px-3">Serial No</th>
          <th class="py-2.5 px-3">Status</th>
          <th class="py-2.5 px-3">Reason</th>
          <th class="py-2.5 px-3">City</th>
        </tr>
      `;

      let list = parsedState.simpleRecords || [];
      if (searchQuery) {
        list = list.filter(r => 
          r.service_order_no.toLowerCase().includes(searchQuery) ||
          r.customer_name.toLowerCase().includes(searchQuery) ||
          r.model.toLowerCase().includes(searchQuery) ||
          r.status.toLowerCase().includes(searchQuery) ||
          r.city.toLowerCase().includes(searchQuery)
        );
      }

      tbody.innerHTML = '';
      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="py-8 text-center text-slate-400">No records found matching query</td></tr>`;
        return;
      }

      list.forEach((r, idx) => {
        const tr = document.createElement('tr');
        tr.className = idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white';
        tr.innerHTML = `
          <td class="py-2 px-3 text-slate-400 font-bold">${idx + 1}</td>
          <td class="py-2 px-3 whitespace-nowrap">${r.date || '—'}</td>
          <td class="py-2 px-3 font-mono font-bold text-blue-700">${r.service_order_no}</td>
          <td class="py-2 px-3 font-medium text-slate-900">${r.customer_name}</td>
          <td class="py-2 px-3"><span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">${r.service_type}</span></td>
          <td class="py-2 px-3 font-mono font-bold text-slate-800">${r.model}</td>
          <td class="py-2 px-3 font-mono text-slate-600">${r.serial_no}</td>
          <td class="py-2 px-3 font-medium text-slate-700">${r.status}</td>
          <td class="py-2 px-3 text-slate-600">${r.reason}</td>
          <td class="py-2 px-3 font-semibold text-slate-800">${r.city}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      // RAW Data Without Formulation
      thead.innerHTML = `
        <tr>
          <th class="py-2.5 px-3">#</th>
          <th class="py-2.5 px-3">SO No</th>
          <th class="py-2.5 px-3">Job No</th>
          <th class="py-2.5 px-3">Created</th>
          <th class="py-2.5 px-3">Assigned</th>
          <th class="py-2.5 px-3">Time</th>
          <th class="py-2.5 px-3">Model</th>
          <th class="py-2.5 px-3">Serial</th>
          <th class="py-2.5 px-3">Wty</th>
          <th class="py-2.5 px-3">VOC</th>
          <th class="py-2.5 px-3">Customer</th>
          <th class="py-2.5 px-3">City</th>
          <th class="py-2.5 px-3">App Date</th>
          <th class="py-2.5 px-3">Svc Type</th>
          <th class="py-2.5 px-3">Status</th>
          <th class="py-2.5 px-3">Reason</th>
          <th class="py-2.5 px-3">B2B</th>
        </tr>
      `;

      let list = parsedState.rawRecords || [];
      if (searchQuery) {
        list = list.filter(r => 
          (r.service_order_no || '').toLowerCase().includes(searchQuery) ||
          (r.customer_name || '').toLowerCase().includes(searchQuery) ||
          (r.model || '').toLowerCase().includes(searchQuery)
        );
      }

      tbody.innerHTML = '';
      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="17" class="py-8 text-center text-slate-400">No raw records found</td></tr>`;
        return;
      }

      list.forEach((r, idx) => {
        const tr = document.createElement('tr');
        tr.className = idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white';
        tr.innerHTML = `
          <td class="py-2 px-3 text-slate-400 font-bold">${idx + 1}</td>
          <td class="py-2 px-3 font-mono font-bold text-slate-800">${r.service_order_no || '—'}</td>
          <td class="py-2 px-3 font-mono text-slate-600">${r.asc_job_no || '—'}</td>
          <td class="py-2 px-3">${r.created_date || '—'}</td>
          <td class="py-2 px-3">${r.assigned_date || '—'}</td>
          <td class="py-2 px-3">${r.assigned_time || '—'}</td>
          <td class="py-2 px-3 font-mono">${r.model || '—'}</td>
          <td class="py-2 px-3 font-mono">${r.serial_no || '—'}</td>
          <td class="py-2 px-3">${r.warranty_status || '—'}</td>
          <td class="py-2 px-3">${r.voc || '—'}</td>
          <td class="py-2 px-3">${r.customer_name || '—'}</td>
          <td class="py-2 px-3 font-bold">${r.city || '—'}</td>
          <td class="py-2 px-3">${r.app_date || '—'}</td>
          <td class="py-2 px-3">${r.service_type || '—'}</td>
          <td class="py-2 px-3">${r.status || '—'}</td>
          <td class="py-2 px-3">${r.reason || '—'}</td>
          <td class="py-2 px-3">${r.b2b || '—'}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  /**
   * Renders Fragment 3 (Standard 28-Column Formulated Sheet Preview)
   */
  function renderFragment3Table() {
    const thead = document.getElementById('uddFrag3Thead');
    const tbody = document.getElementById('uddFrag3Tbody');
    const countBadge = document.getElementById('uddFrag3TotalCount');
    if (!thead || !tbody) return;

    const ctx = (typeof window !== 'undefined' && window.OpenPendingContext) || (typeof globalThis !== 'undefined' && globalThis.OpenPendingContext);
    const cols = ctx ? ctx.STANDARD_28_COLUMNS : [];

    thead.innerHTML = `
      <tr>
        ${cols.map(c => `<th class="py-2.5 px-3 whitespace-nowrap text-center">${c.header}</th>`).join('')}
      </tr>
    `;

    const records = parsedState.records || [];
    if (countBadge) countBadge.textContent = `${records.length} Formulated Records`;

    tbody.innerHTML = '';
    if (records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${cols.length}" class="py-8 text-center text-slate-400">No records parsed yet</td></tr>`;
      return;
    }

    records.slice(0, 100).forEach((rec, idx) => {
      const tr = document.createElement('tr');
      tr.className = idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white';
      
      const tds = cols.map(c => {
        const val = rec[c.header] !== undefined ? rec[c.header] : (rec[c.key] || '');
        let cellClass = 'py-2 px-2.5 whitespace-nowrap';

        // Aging styling
        if (c.key === 'aging') {
          const numAge = Number(val) || 0;
          if (numAge > 15) return `<td class="${cellClass} text-center font-bold text-rose-700 bg-rose-50">${val}</td>`;
          if (numAge > 7) return `<td class="${cellClass} text-center font-bold text-amber-700 bg-amber-50">${val}</td>`;
          return `<td class="${cellClass} text-center text-blue-700">${val}</td>`;
        }

        // TAT Bucket styling
        if (c.key === 'tat_bucket') {
          return `<td class="${cellClass} text-center"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">${val}</span></td>`;
        }

        // Order Number
        if (c.key === 'service_order_no') {
          return `<td class="${cellClass} text-center font-bold text-blue-700 font-mono">${val}</td>`;
        }

        return `<td class="${cellClass} ${c.align === 'center' ? 'text-center' : (c.align === 'left' ? 'text-left' : 'text-right')}">${val !== '' ? val : '—'}</td>`;
      }).join('');

      tr.innerHTML = tds;
      tbody.appendChild(tr);
    });

    if (records.length > 100) {
      const noteTr = document.createElement('tr');
      noteTr.innerHTML = `<td colspan="${cols.length}" class="py-2.5 text-center bg-slate-100 text-slate-500 font-medium">Showing first 100 of ${records.length} records in preview. All records will be imported on Process &amp; Add.</td>`;
      tbody.appendChild(noteTr);
    }
  }

  /**
   * Opens Universal Data Dialog with callback
   */
  function openDialog(options = {}) {
    ensureDialogDOM();
    activeOptions = options || {};
    activeCallback = options.onApply || null;

    // Reset state
    currentFragment = 1;
    parsedState = { format: 'EMPTY', records: [], simpleRecords: [], rawRecords: [], totalCount: 0 };
    activeViewMode = 'simple';
    searchQuery = '';

    const textarea = document.getElementById('uddPasteTextarea');
    if (textarea) textarea.value = '';

    const badge = document.getElementById('uddSourceBadge');
    if (badge) badge.classList.add('hidden');

    const statusBadge = document.getElementById('uddStatusBadge');
    if (statusBadge) statusBadge.classList.add('hidden');

    const btnProcess = document.getElementById('uddBtnProcessAndAdd');
    if (btnProcess) btnProcess.disabled = true;

    switchFragment(1);

    if (dialogOverlay) {
      dialogOverlay.classList.remove('hidden');
      if (textarea) setTimeout(() => textarea.focus(), 100);
    }
  }

  /**
   * Closes the dialog
   */
  function closeDialog() {
    if (dialogOverlay) {
      dialogOverlay.classList.add('hidden');
    }
  }

  // Global helper on window
  if (typeof window !== 'undefined') {
    window.openUniversalDataDialog = openDialog;
  }

  return {
    open: openDialog,
    close: closeDialog,
    getParsedState: () => ({ ...parsedState })
  };
});
