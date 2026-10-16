---
name: csa-digitized-code-library
description: Architecture, data schemas, and verification rules for the Digitized CSA Code Library (CSA C22.3 No. 1, CAN/CSA-C22.3 No. 60826, and CSA O15) including all 83 tables, 792 clauses, and E-Book reader components.
---

# Digitized CSA Code Library & Universal Table Architecture

Use this skill when modifying or extending the digitized CSA standards (`src/data/csa/`), the code registry (`src/core/code/`), or the E-Book Code Library UI (`src/components/codeLibrary/`).

## 1. Corpus Baseline Counts
- **Total Clauses**: **792** (`c22_3_no1`: 500, `c22_3_60826`: 206, `csa_o15`: 86)
- **Total Digitized Tables**: **83** (`c22_3_no1`: 31, `c22_3_60826`: 47, `csa_o15`: 5)
- **Total Definitions**: **150+**

## 2. The 5 Digitized Table Schemas (`UniversalTableRenderer.jsx`)
Never write ad-hoc `<table>` markup that only checks `details.columns`. All 83 tables resolve via `getTableDetails(tableId)` into one of 5 schemas handled by `src/components/codeLibrary/UniversalTableRenderer.jsx`:

1. **Keyed Matrix Tables (`details.columns` + `details.rows`)**:
   - Used in `c22_3_no1` Tables 2–6, 8–10, 13, 14, 18, 21–23.
   - Cell containers (`row.cells`, `row.separations`, `row.clearances`, `row.clearances_m`, `row.clearances_mm`, `row.separations_m`) are **objects keyed by `col.id`** (or `${col.id}_m`), NOT arrays.
   - Individual cell values may be objects `{ m, mm, baseM, formula, na, footnotes }`.
   - **Table 13** exports both AC crossing matrices (`columns` / `rows`) and DC crossing matrices (`dcColumns` / `dcRows`).
2. **Table 31 9-Column Overload & Strength Factor Matrix (`table.key === 'table31'`)**:
   - Each row contains `grades: [{ grade: 1, cov_le_10, cov_10_to_15, cov_ge_15 }, ...]`. All 3 COV tiers across Grades 1, 2, and 3 must be displayed.
3. **Table 1 Conductor Swing Factor Table (`table.key === 'table1'`)**:
   - `details.rows` is `{ non_sheltered: [{ dw, factor }], partially_sheltered: [{ dw, factor }] }`.
4. **Multi-Section Object Tables (`typeof details.rows === 'object' && !Array.isArray(details.rows)`)**:
   - Used in `csa_o15_table1` and `csa_o15_table2` (`{ metric: [...], imperial: [...] }`) and `c22_3_60826_tableC2` (`{ upperTailReturnPeriods: [...], lowerTailExclusionLimits: [...] }`).
5. **General Object-Array Tables (`Array.isArray(details.rows)` without `details.columns`)**:
   - Used across all 46 other `c22_3_60826` tables (including the 682-station `tableCA1`), `csa_o15` Tables 3, B.1, C.1, and 15 `c22_3_no1` tables.
   - Nested cell objects (`{ display }`, `{ min, max }`, `{ normal, logNormal }`, `{ U_mean, sigma_u }`, `{ alpha, phiS }`, `{ wind, iceWindC1, iceWindC2 }`, `spanMinimums`, `spansUpTo50m`) must be formatted through `formatTableCellValue(val)`.

## 3. Search & Clause Hygiene Rules
- **Empty Search Order**: When `searchQuery` is empty, clauses must remain sorted by `naturalClauseCompare(a.clauseNumber, b.clauseNumber)`.
- **OCR Split-Number Guardrail**: When importing or editing clauses in `src/data/csa/digitized/clauses_*.js`, verify that lines beginning with engineering numbers (`2.5%`, `1.0 kN`, `2.2 kN`) are merged into their parent clause text rather than emitted as standalone clause objects.
