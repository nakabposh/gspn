# Implementation Summary: Zero Percentage & Red Color Highlighting for SALT Report

## Changes Implemented

1. **Replaced `#DIV/0!` with `0%`**:
   - Updated `formatPct(pct, total)` in `/saltReport.html` to return `0%` whenever `total === 0`, `!total`, `pct === 0`, or if `pct` is `NaN`/non-finite.
   - Guaranteed that no table cell, footer row, TSV copy, or Excel export displays `#DIV/0!`.

2. **Red Color Highlighting for Zero Values**:
   - **(Over all Calls) / Total**:
     - Applied `text-rose-600 bg-rose-50/70 font-bold` (`getZeroCountClass`) whenever call count is `0`.
   - **Happy Code (HC)**:
     - HC count: styled in red when `0`.
     - HC %: `getHCPctColorClass` updated to return `'heat-red'` (`background-color: #FCA5A5 !important; color: #7f1d1d !important;`) whenever `r.total === 0`, `r.hc === 0`, or `r.hcPct === 0`.
   - **Visit Time**:
     - Overall Visit `0~10` and B2B Visit `0~10` counts: styled in red when `0`.
     - Overall Visit `0~10 %` and B2B Visit `0~10 %`: `getTAT010020ColorClass` updated to return `'heat-red'` whenever compliance is `0` or `0%` (or when HC is `0`).
   - **Service Time**:
     - Overall Service `0~20` and B2B Service `0~20` counts: styled in red when `0`.
     - Overall Service `0~20 %` and B2B Service `0~20 %`: `getTAT010020ColorClass` updated to return `'heat-red'` whenever compliance is `0` or `0%` (or when HC is `0`).

3. **Total Footer Row & Top KPI Summary**:
   - Added `fZero` helper in table footers to highlight total counts or percentages in bold red (`text-rose-400 font-black`) if they are `0` or `0%`.
   - Updated top metric cards (`statTotalJobs`, `statHappyYes`, `statHappyRate`, `statOverallVisit010`, `statOverallService020`) to display in red when zero.

4. **Excel Export (`exportExcelSameTheme`)**:
   - In both `TL Summary` and `Eng Summary` worksheets:
     - Count cells for Total, HC, Visit Time, and Service Time with `0` receive soft red fill (`#FEE2E2`) and bold dark red text (`#B91C1C`).
     - Percentage cells with `0` or `0%` receive standard heat-red fill (`#FCA5A5`) and dark red text (`#7F1D1D`), formatted as `0%`.
     - Footer summary totals with `0` or `0%` receive deep red fill (`#991B1B`) and bold white text (`#FFFFFF`), formatted as `0%`.
