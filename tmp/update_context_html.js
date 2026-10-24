const fs = require('fs');
let html = fs.readFileSync('./Context.html', 'utf8');

const cardHtml = `
      <!-- 4. GD / FDR Closer Repair Codes & Reason Names -->
      <div class="context-card" id="repairCodesSection">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:14px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size: 20px;">🔧</span>
              <h3 style="font-size: 18px; font-weight: 800; color: #0f2e59; font-family:'Outfit',sans-serif; margin:0;">
                GD / FDR Closer Repair Codes &amp; Reason Names
              </h3>
            </div>
            <p style="font-size: 12.5px; color: var(--text-soft); margin-top: 4px; margin-bottom: 0;">
              Authoritative GSPN repair action codes and abbreviations used during request closures and GD/FDR completion reports.
            </p>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px;">
              381 Master Codes
            </span>
            <span style="background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px;">
              GD / FDR Active
            </span>
          </div>
        </div>

        <!-- Info callout -->
        <div style="background:#f8fafc; border-left:4px solid #3b82f6; padding:10px 14px; border-radius:6px; margin-bottom:16px; font-size:12.5px; color:#334155;">
          <strong>Operational Context:</strong> When closing any service order request or drafting GD/FDR files, select or reference these standardized repair codes to represent parts replacement, adjustments, cleaning, installation, and engineering operations.
        </div>

        <!-- Search & Filter Controls -->
        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
          <div style="position:relative; width:100%;">
            <input type="text" id="repairCodeSearchInput" placeholder="Search by Code (e.g. A01, B03, Q01, R24) or Reason (e.g. compressor, refrigerant, PCB, cleaning)..." style="width:100%; padding:10px 14px 10px 38px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; outline:none; transition:border-color 0.2s;" onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#cbd5e1'">
            <svg style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          <!-- Quick category pills -->
          <div style="display:flex; flex-wrap:wrap; gap:6px;" id="repairCategoryFilters">
            <button type="button" class="repair-filter-btn active" data-category="ALL" style="padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid #cbd5e1; background:#0f2e59; color:#fff;">All (381)</button>
            <button type="button" class="repair-filter-btn" data-category="A" style="padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid #cbd5e1; background:#fff; color:#1e293b;">Parts Replacement (A)</button>
            <button type="button" class="repair-filter-btn" data-category="B" style="padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid #cbd5e1; background:#fff; color:#1e293b;">Welding &amp; Sealed System (B)</button>
            <button type="button" class="repair-filter-btn" data-category="C" style="padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid #cbd5e1; background:#fff; color:#1e293b;">Adjustment &amp; Alignment (C)</button>
            <button type="button" class="repair-filter-btn" data-category="D" style="padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid #cbd5e1; background:#fff; color:#1e293b;">Cleaning &amp; Filters (D)</button>
            <button type="button" class="repair-filter-btn" data-category="E" style="padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid #cbd5e1; background:#fff; color:#1e293b;">Installation (E)</button>
            <button type="button" class="repair-filter-btn" data-category="F" style="padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid #cbd5e1; background:#fff; color:#1e293b;">Re-assembling (F)</button>
            <button type="button" class="repair-filter-btn" data-category="G" style="padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid #cbd5e1; background:#fff; color:#1e293b;">Customer Education (G)</button>
            <button type="button" class="repair-filter-btn" data-category="H" style="padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid #cbd5e1; background:#fff; color:#1e293b;">Software &amp; Firmware (H)</button>
            <button type="button" class="repair-filter-btn" data-category="M" style="padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid #cbd5e1; background:#fff; color:#1e293b;">Mechanical &amp; Optical (M)</button>
            <button type="button" class="repair-filter-btn" data-category="Q" style="padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid #cbd5e1; background:#fff; color:#1e293b;">System &amp; Diagnostic (Q)</button>
            <button type="button" class="repair-filter-btn" data-category="R" style="padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid #cbd5e1; background:#fff; color:#1e293b;">Display &amp; Module (R)</button>
          </div>
        </div>

        <div style="overflow-x:auto; max-height:480px; overflow-y:auto; border:1px solid #e2e8f0; border-radius:8px;">
          <table class="field-table" style="margin-top:0;">
            <thead style="position:sticky; top:0; z-index:2; background:#f8fafc;">
              <tr>
                <th style="width:70px; text-align:center;">Code</th>
                <th>Reason Name / Abbreviation</th>
                <th style="width:200px;">Category</th>
                <th style="width:120px; text-align:center;">Action</th>
              </tr>
            </thead>
            <tbody id="repairCodeTableBody">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-top:12px; font-size:12px; color:var(--text-soft);">
          <div>
            <strong>JavaScript Context API:</strong> 
            <code>window.GSPN_CONTEXT.getRepairCode("A01")</code> &bull; 
            <code>window.GSPN_CONTEXT.searchRepairCodes("compressor")</code>
          </div>
          <div id="repairCodeVisibleCount" style="font-weight:700; color:#0f2e59;">Showing 381 of 381 Codes</div>
        </div>
      </div>
`;

// Insert before the last closing </div></div> before bottomNav
const anchor = '      </div>\n\n    </div>\n  </div>\n\n  <!-- BOTTOM NAVBAR -->';
if (!html.includes(anchor)) {
  console.error("Card anchor not found!");
  process.exit(1);
}

html = html.replace(anchor, '      </div>\n' + cardHtml + '\n    </div>\n  </div>\n\n  <!-- BOTTOM NAVBAR -->');

// Now add JS logic to handle repair codes table
const scriptAnchor = '      // Initial render\n      renderTable();\n    });';
const repairJs = `      // Initial render
      renderTable();

      // --- GD / FDR REPAIR CODES LOGIC ---
      const repairTbody = document.getElementById("repairCodeTableBody");
      const repairSearchInput = document.getElementById("repairCodeSearchInput");
      const repairCountEl = document.getElementById("repairCodeVisibleCount");
      const repairCatBtns = document.querySelectorAll(".repair-filter-btn");

      if (repairTbody && window.GSPN_CONTEXT && window.GSPN_CONTEXT.REPAIR_CODES) {
        const allRepairCodes = window.GSPN_CONTEXT.REPAIR_CODES;
        let activeRepairCat = "ALL";
        let repairSearchQuery = "";

        function renderRepairTable() {
          const filtered = allRepairCodes.filter(item => {
            const matchesCat = activeRepairCat === "ALL" || 
              (activeRepairCat.length === 1 ? item.code.startsWith(activeRepairCat) : item.code.includes(activeRepairCat));
            const matchesSearch = !repairSearchQuery ||
              item.code.toLowerCase().includes(repairSearchQuery) ||
              item.abbreviation.toLowerCase().includes(repairSearchQuery) ||
              (item.category && item.category.toLowerCase().includes(repairSearchQuery));
            return matchesCat && matchesSearch;
          });

          repairTbody.innerHTML = "";
          if (filtered.length === 0) {
            repairTbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:24px; color:#94a3b8; font-size:13px;">No repair codes found matching "' + repairSearchQuery + '"</td></tr>';
            if (repairCountEl) repairCountEl.textContent = 'Showing 0 of ' + allRepairCodes.length + ' Codes';
            return;
          }

          filtered.forEach((item, idx) => {
            const tr = document.createElement("tr");
            tr.style.background = idx % 2 === 1 ? "#fcfdff" : "#ffffff";
            tr.innerHTML = \`
              <td style="text-align:center;">
                <span class="col-name-badge" style="font-size:12px; background:#eff6ff; color:#1d4ed8; padding:3px 8px; border-radius:6px; font-weight:800;">\${item.code}</span>
              </td>
              <td><strong style="color:#0f172a; font-family:'Inter',sans-serif; font-size:13px;">\${item.abbreviation}</strong></td>
              <td><span style="font-size:11px; padding:2px 8px; border-radius:6px; background:#f1f5f9; color:#475569; border:1px solid #e2e8f0; font-weight:600;">\${item.category || 'General Repair'}</span></td>
              <td style="text-align:center;">
                <button type="button" class="btn-copy-code" style="padding:3px 10px; font-size:11px; font-weight:700; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer; color:#0f2e59;" onclick="navigator.clipboard.writeText('\${item.code}'); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 1500);">Copy</button>
              </td>
            \`;
            repairTbody.appendChild(tr);
          });

          if (repairCountEl) {
            repairCountEl.textContent = 'Showing ' + filtered.length + ' of ' + allRepairCodes.length + ' Codes';
          }
        }

        repairCatBtns.forEach(btn => {
          btn.addEventListener("click", () => {
            repairCatBtns.forEach(b => {
              b.classList.remove("active");
              b.style.background = "#fff";
              b.style.color = "#1e293b";
            });
            btn.classList.add("active");
            btn.style.background = "#0f2e59";
            btn.style.color = "#fff";
            activeRepairCat = btn.dataset.category;
            renderRepairTable();
          });
        });

        if (repairSearchInput) {
          repairSearchInput.addEventListener("input", (e) => {
            repairSearchQuery = e.target.value.toLowerCase().trim();
            renderRepairTable();
          });
        }

        renderRepairTable();
      }
    });`;

if (!html.includes(scriptAnchor)) {
  console.error("Script anchor not found!");
  process.exit(1);
}

html = html.replace(scriptAnchor, repairJs);

fs.writeFileSync('./Context.html', html, 'utf8');
console.log('Context.html updated successfully!');
