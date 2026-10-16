/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 12
 * "Values of ΦS2"
 * (See Clause 7.2.2 and Table A.4.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 91 (PDF Page 203)
 */

export const TABLE_12_META = {
  id: 'csa-c22.3-60826/table12',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.2.2 Strength factor ΦS related to the coordination of strength',
  title: 'Values of ΦS2',
  references: ['7.2.2', 'Table 13', 'Table A.4'],
  iecPage: 91,
  pdfPages: [203],
  notes: {
    note1:
      'In the above table, R2 is the component designed more reliable than R1 (with 90% confidence that R2 will not fail before R1). A factor ΦS1 = 1.0 is applied to the first component to fail (R1).',
  },
  clauses: {
    '7.2.2': {
      title: 'Strength factor ΦS related to the coordination of strength',
      text:
        'In order to achieve such strength coordination, a strength reduction factor ΦS2 is applied to the strength of components R2 chosen to be more reliable while a factor ΦS1 = 1.0 is applied to the first component to fail. Factor ΦS2 depends on the coefficient of variation of both components and is given in Table 12. It is based on a confidence of 90% that the second component R2 will not fail before the first R1.',
    },
  },
};

export const TABLE_12_ROWS = [
  {
    covR2Range: '0.05–0.10',
    covR2Min: 0.05,
    covR2Max: 0.10,
    phiS2ByCovR1: {
      covR1_0_05: 0.92,
      covR1_0_075: 0.87,
      covR1_0_10: 0.82,
      covR1_0_20: 0.63,
    },
  },
  {
    covR2Range: '0.10–0.40',
    covR2Min: 0.10,
    covR2Max: 0.40,
    phiS2ByCovR1: {
      covR1_0_05: 0.94,
      covR1_0_075: 0.89,
      covR1_0_10: 0.86,
      covR1_0_20: 0.66,
    },
  },
];

export const TABLE_12_STRENGTH_COORDINATION_PHI_S2 = TABLE_12_ROWS;
