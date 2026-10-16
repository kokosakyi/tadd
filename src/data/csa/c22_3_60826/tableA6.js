/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.6
 * "Values of ue associated to exclusion limits"
 * (See Annex A, Clause A.2.1.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 145 (PDF Page 257)
 */

export const TABLE_A6_META = {
  id: 'csa-c22.3-60826/tableA6',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.2.1 Calculation of characteristic strength',
  title: 'Values of ue associated to exclusion limits',
  references: ['7.3.2', '7.3.3', 'A.2.1'],
  iecPage: 145,
  pdfPages: [257],
  notes: {
    formula: 'Φc = (1 - 1.28 vR) / (1 - ue vR), where (10%)R = Φc × Rc and Rc = R_mean (1 - ue vR).',
  },
  clauses: {
    'A.2.1': {
      title: 'Calculation of characteristic strength',
      text:
        'If the value of ue is not known, it can be estimated according to Table A.6 which is based on the frequency of rejects calculated from the normal distribution.',
    },
  },
};

export const TABLE_A6_ROWS = [
  {
    id: 'frequent',
    estimatedFrequencyOfRejects: 'Frequent',
    exclusionLimit_e: 'About 10%',
    exclusionLimitFraction: 0.10,
    ue: 1.28,
  },
  {
    id: 'some',
    estimatedFrequencyOfRejects: 'Some',
    exclusionLimit_e: '2% to 5%',
    exclusionLimitFraction: 0.05,
    ue: 1.6,
  },
  {
    id: 'rare',
    estimatedFrequencyOfRejects: 'Rare',
    exclusionLimit_e: '< 2%',
    exclusionLimitFraction: 0.02,
    ue: 2.1,
  },
];

export const TABLE_A6_EXCLUSION_LIMIT_UE = TABLE_A6_ROWS;
