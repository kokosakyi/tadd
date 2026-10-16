# CSA O15-15: Wood Utility Poles and Reinforcing Stubs — Extracted Data & Criteria Tables

This directory contains the extracted tables, clauses, and engineering parameters from **CAN/CSA-O15-15 (Wood utility poles and reinforcing stubs)**.

## Standards Coverage
- **Standard**: CAN/CSA-O15-15 (Approved February 2016, Update No. 1 June 2016)
- **Supersedes**: CSA O15-05, O15-90, O15-83
- **Primary Source File**: `sandbox/csa c22 no 1/CSA-015-15-Wood-Utility-Poles.pdf`
- **Machine-Readable Clauses**: `sandbox/csa_o15_clauses.json`
- **Application JS Data Modules**: `src/data/csa/o15/`

---

## Key Extracted Tables

1. **[Table 3 / Table E.3 — Species Mechanical Properties](./Table%203/README.md)**
   - Fibre stresses (psi and MPa)
   - Moduli of Elasticity MOE (ksi and MPa)
   - Coefficients of Variation (COV %)
   - Species identification codes (Clause 6.5.3) and botanical classifications (alphabetically sorted per project rules)
2. **[Table B.1 — Standard Pole Classes & Breaking Loads](./Table%20B1/README.md)**
   - Transverse horizontal breaking loads (Classes H6 down to 8: 50.7 kN down to 4.3 kN)
   - 0.95 species load factor for western red cedar, red pine, and jack pine
3. **[Table C.1 — Reinforcing Stub Classes](./Table%20C1/README.md)**
   - Classes Z, Y, X, W and associated pole classes (1 to 8)
4. **[Table 1 / Table E.1 — Maximum Knot Sizes](./Table%201/README.md)**
   - Single knot and sum of knots limits across pole lengths
5. **[Table 2 / Table E.2 — Maximum Spiral Grain](./Table%202/README.md)**
   - Grain twist limits per unit length

---

## Easily Retrievable JSON & CLI Tool
- All 86 clauses and 50 tables are retrievable via `sandbox/clause_retriever.py`:
  ```bash
  # Retrieve a specific clause
  python sandbox/clause_retriever.py o15 4.3
  python sandbox/clause_retriever.py o15 4.4.7
  python sandbox/clause_retriever.py o15 6.5.3
  python sandbox/clause_retriever.py o15 B.1.1

  # Retrieve a table
  python sandbox/clause_retriever.py o15 "Table 3"
  python sandbox/clause_retriever.py o15 "Table B.1"

  # Search across CSA C22.3 No 1, CSA C22.3 No 60826, and CSA O15
  python sandbox/clause_retriever.py search "knot diameter"
  python sandbox/clause_retriever.py search "fibre stress"
  ```
