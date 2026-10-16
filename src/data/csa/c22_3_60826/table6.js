/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 6
 * "Non-uniform ice loading conditions"
 * (See Clause 6.3.6.3 and Figure 12.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 71 (PDF Page 183)
 *   - Canadian Deviation Clauses 6.3.6.3.1A and 6.3.6.3.1B (PDF Pages 16–17)
 */

export const TABLE_6_META = {
  id: 'csa-c22.3-60826/table6',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '6.3.6.3 Non-uniform ice formation on phase conductors and ground wires',
  title: 'Non-uniform ice loading conditions',
  references: ['6.3.6.3', '6.3.6.3.1A', '6.3.6.3.1B', 'Figure 12'],
  iecPage: 71,
  pdfPages: [183],
  notes: {
    note1:
      'In this table, the uppercase letters A, B, C, D, E, F (phase conductors) and X, Y (ground wires) represent conductors and spans loaded with 0.7 gR, while the lowercase letters a, b, c, d, e, f, x, y represent conductors and spans loaded with 0.4 × 0.7 gR (= 0.28 gR). Factors 0.7 and 0.4 are suggested and other values can be used as substantiated by experience.',
    canadianDeviation:
      'Per Clauses 6.3.6.3.1A and 6.3.6.3.1B (Canadian Deviation): Non-uniform ice loading examples where the structure is subjected to 70% of the design ice weight on the left or right spans while the other spans are loaded with 28% (40% of 70%) of the same design ice weight are illustrated in Figure 12 and Table 6. The unbalanced ice loading cases shall be calculated under: (a) temperature of –5 °C; (b) no wind; and (c) conductor in the final condition (after creep).',
  },
  clauses: {
    '6.3.6.3.1A (Canadian Deviation)': {
      title: 'Non-uniform ice loading examples',
      text:
        'Non-uniform ice loading examples where the structure is subjected to 70% of the design ice weight on the left or right spans while the other spans are loaded with 28% (40% of 70%) of the same design ice weight are illustrated in Figure 12 and Table 6.',
    },
    '6.3.6.3.1B (Canadian Deviation)': {
      title: 'Unbalanced ice loading calculation conditions',
      text:
        'The unbalanced ice loading cases shall be calculated under the following conditions:\n(a) temperature of –5 °C;\n(b) no wind; and\n(c) conductor in the final condition (after creep).\nThe flexibility of the structures may be considered in order to reduce the unbalanced ice loading.',
    },
  },
};

export const TABLE_6_ROWS = [
  {
    id: 'single_circuit',
    supportType: 'Single circuit',
    longitudinalBending: {
      leftSpan: 'xyabc',
      rightSpan: 'XYABC',
      leftSpanRatioOfgR: 0.28,
      rightSpanRatioOfgR: 0.70,
    },
    transverseBending: {
      leftSpan: 'XYabC',
      rightSpan: 'xYabC',
    },
    torsional: {
      leftSpan: 'XYabC',
      rightSpan: 'XYABC',
    },
  },
  {
    id: 'double_circuit',
    supportType: 'Double circuit',
    longitudinalBending: {
      leftSpan: 'xabcdef',
      rightSpan: 'XABCDEF',
      leftSpanRatioOfgR: 0.28,
      rightSpanRatioOfgR: 0.70,
    },
    transverseBending: {
      leftSpan: 'XabcDEF',
      rightSpan: 'XabcDEF',
    },
    torsional: {
      leftSpan: 'XabcDEF',
      rightSpan: 'XABCDEF',
    },
  },
];

export const TABLE_6_NON_UNIFORM_ICE_CONDITIONS = TABLE_6_ROWS;
