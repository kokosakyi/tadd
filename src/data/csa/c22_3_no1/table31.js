/**
 * CSA C22.3 No. 1 — Table 31
 * "Minimum load factors for non-linear analysis of structures"
 * (See Clauses 7.4.2, 7.5.2, 7.6.4, 7.7.2, 7.8.1.2, 8.1.3, 8.3.10.1, 8.3.12.2, and A.7.4.2.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 105 (PDF Page 110)
 *   - Clauses 7.4.2, 7.5.2, 7.6.4, 7.7.2, 7.8.1.2, 8.1.3, 8.3.10.1, 8.3.12.2, Pages 54-62 (PDF Pages 59-67)
 *   - Clause A.7.4.2, Page 133 (PDF Page 138)
 *
 * Material Coefficient of Variation (COV):
 *   - Steel default: COV ≤ 10%
 *   - Concrete default: 10% < COV < 15%
 *   - Wood default: COV ≥ 15%
 */

export const TABLE_31_META = {
  id: 'csa-c22.3-no1/table31',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum load factors for non-linear analysis of structures',
  references: ['7.4.2', '7.5.2', '7.6.4', '7.7.2', '7.8.1.2', '8.1.3', '8.3.10.1', '8.3.12.2', 'A.7.4.2', 'Table 32'],
  notes: {
    note1: 'Non-linear analysis, including stability (buckling) check, is the method of analysis of structures specified in this Standard.',
    note2: 'Default COV values for pole and structure materials are:\n  a) steel — ≤ 10%;\n  b) concrete — 10% < COV < 15%; and\n  c) wood — ≥ 15%.',
    note3:
      'The selection of appropriate minimum load factors for steel, concrete, fibre-reinforced composite, laminated wood, and wood poles is based on the coefficient of variation (COV), for the given pole material as verified by the pole manufacturer. The lowest minimum load factors (steel pole default) may be used for concrete, laminated wood, and FRP composite structures if manufacturers verify COV ≤ 10%. The next lowest (concrete pole default) may be used if 10% < COV < 15%. The highest (wood default) shall be used if manufacturer is unable to verify COV < 15%.',
  },
  clauses: {
    '7.4.2': {
      title: 'Application of load factors',
      text: 'The strength requirements for wood, concrete, and fibre-reinforced composite structures and for guys shall be calculated by multiplying the loads of each category in Clause 7.4.1 by the appropriate load factors in Tables 31 and 32 for the type of load being considered.',
    },
    '8.1.3': {
      title: 'Non-linear analysis method',
      text: 'Non-linear analysis, including second-order P-delta effects and stability/buckling checks, shall be used to verify structure capacity under factored loads.',
    },
    '8.3.10.1': {
      title: 'Metal poles, metal towers, and metal supports',
      text: 'In the design of metal poles, metal towers, and metal supports, the "load factor" specified in Table 31 shall be interpreted such that the completed structure will support, with only negligible deformation of component parts (see Table A.4), the assumed loads to which it will be subjected.',
    },
    '8.3.12.2': {
      title: 'Fibre-reinforced composite poles',
      text: 'In the design of fibre-reinforced composite poles, the "minimum load factor" of Table 31 shall be interpreted such that the completed structure will support the assumed loads to which it will be subjected. Fibre-reinforced composite poles may use steel factors if proven 5th percentile strength.',
    },
    'A.7.4.2': {
      title: 'Rationale for load factors',
      text: 'The load factors take into account the grade of construction and the type of material being used and the fact that weather loadings cannot be accurately determined. Minimum values to prevent failure.',
    },
  },
};

export const TABLE_31_LOAD_FACTORS = [
  {
    loadType: 'Vertical',
    loadKey: 'vertical',
    grades: [
      { grade: 1, cov_le_10: 1.30, cov_10_to_15: 1.60, cov_ge_15: 2.00 },
      { grade: 2, cov_le_10: 1.15, cov_10_to_15: 1.30, cov_ge_15: 1.50 },
      { grade: 3, cov_le_10: 1.00, cov_10_to_15: 1.10, cov_ge_15: 1.20 },
    ],
  },
  {
    loadType: 'Transverse',
    loadKey: 'transverse',
    grades: [
      { grade: 1, cov_le_10: 1.20, cov_10_to_15: 1.50, cov_ge_15: 1.90 },
      { grade: 2, cov_le_10: 1.10, cov_10_to_15: 1.20, cov_ge_15: 1.30 },
      { grade: 3, cov_le_10: 1.00, cov_10_to_15: 1.10, cov_ge_15: 1.10 },
    ],
  },
  {
    loadType: 'Longitudinal with terminations or tension changes',
    loadKey: 'longitudinal_with_terminations',
    grades: [
      { grade: 1, cov_le_10: 1.20, cov_10_to_15: 1.50, cov_ge_15: 1.90 },
      { grade: 2, cov_le_10: 1.10, cov_10_to_15: 1.20, cov_ge_15: 1.30 },
      { grade: 3, cov_le_10: 1.00, cov_10_to_15: 1.10, cov_ge_15: 1.10 },
    ],
  },
  {
    loadType: 'Longitudinal without terminations or tension changes',
    loadKey: 'longitudinal_without_terminations',
    grades: [
      { grade: 1, cov_le_10: 1.10, cov_10_to_15: 1.20, cov_ge_15: 1.20 },
      { grade: 2, cov_le_10: 1.00, cov_10_to_15: 1.00, cov_ge_15: 1.00 },
      { grade: 3, cov_le_10: 1.00, cov_10_to_15: 1.00, cov_ge_15: 1.00 },
    ],
  },
];
