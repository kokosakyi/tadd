# Project Architecture & Agent Rules

## Domain & System Architecture
`tad_app` is an engineering web application for transmission and distribution (T&D) overhead pole line design compliant with Canadian Standards Association (CSA) codes:
- **CSA C22.3 No. 1** (Overhead Systems, Ground Clearances & Overload Factors)
- **CAN/CSA-C22.3 No. 60826** (Climatic Loading, Return-Period Wind & Ice Scaling)
- **CSA O15** (Wood Utility Poles and Reinforcing Stubs)

### Directory Structure & Code Boundaries
- `src/core/`: Pure deterministic domain calculation engines and mathematical resolvers:
  - `src/core/clearance/`: Ground and road vertical clearance calculation engine (`clearanceEngine.js`).
  - `src/core/weather/`: Geoclimatic criteria scaling and PLS-CADD criteria generator (`weatherEngine.js`).
  - `src/core/woodPole/`: Wood pole structural loading and moment capacity engine (`woodPoleEngine.js`).
  - `src/core/code/`: Digitized CSA code registry, table content resolution, and search.
  - `src/core/trace/`: Calculation audit trace recorder (`calcTrace.js`).
- `src/components/`: React UI components (calculators, forms, interactive charts, Leaflet maps).
- `src/data/`: Static geo-databases and digitized CSA clauses, tables, and glossaries.
- `tests/`: Automated Vitest test suites, component tests, golden benchmark fixtures, and fast-check property fuzzers.

---

## Agent Verification Protocol
**CRITICAL**: Before concluding any code changes, feature additions, or refactors, agents MUST execute and verify:
```bash
npm run verify
```
This runs the full test suite (`vitest run`) and builds the production bundle (`vite build`). All 50+ unit, property, and benchmark tests must pass without regressions.

---

## UI Data Selectors & Dropdown Ordering
- **Alphabetical Sorting**: Whenever rendering UI dropdown selectors (`<select>`) or list selectors populated from database objects, array collections, or lookup tables (e.g. weather stations, provinces, utility options), always sort the options in alphabetical order using string comparison (`localeCompare`). Ensure both initial state selection logic and component render mappings use sorted collections.

---

## Engineering Calculation Invariants
- **Finite Math**: Structural and climatic functions must never produce `NaN`, `Infinity`, or negative dimensions unless explicitly part of a signed differential margin.
- **Audit Trace**: Pure domain engines must output an immutable calculation audit trace (`trace.calcId`, `steps`, `citations`, `inputs`, `result`).
- **Benchmark Consistency**: When updating calculation engines, run `npx vitest run tests/goldenBenchmark.test.js` to ensure reference benchmark outputs remain intact or are consciously updated with justification.

---

## Digitized CSA Code & Table Rendering Invariants
- **Universal Table Rendering**: Always use `UniversalTableRenderer.jsx` to render digitized CSA tables. Never assume a table has `details.columns` or array-based `row.cells`—all 5 table schemas (Matrix keyed-by-`col.id`, Table 31 9-column COV grades, Table 1 paired swing arrays, Multi-Section `{ metric, imperial }` objects, and Object-Array rows) must be supported.
- **Zero `[object Object]` & Zero Silent Truncation**: Nested cell objects (`{ m, baseM, formula, footnotes }`, `{ display }`, `{ min, max }`, `{ normal, logNormal }`) must be formatted via `formatTableCellValue()`. Large engineering tables (e.g., Table CA.1 with 682 weather stations) must provide filtering/pagination and a "Show All" option rather than hard-slicing rows.
- **Default Clause Ordering**: When the search query is empty, clauses must always be ordered by `naturalClauseCompare` (hierarchical numeric order `0, 1, 1.1, 2...`), never by cross-reference count or arbitrary relevance score.

