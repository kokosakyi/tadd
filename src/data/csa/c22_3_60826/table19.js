/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 19
 * "u factors for log-normal distribution function for e = 10%"
 * (See Clause 7.3.2.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 99 (PDF Page 211)
 */

export const TABLE_19_META = {
  id: 'csa-c22.3-60826/table19',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.3.2 Strength data of line components',
  title: 'u factors for log-normal distribution function for e = 10%',
  references: ['7.3.2', 'Table 18'],
  iecPage: 99,
  pdfPages: [211],
  notes: {
    formula: 'Rc = (10%)R = (1 – u × vR) × R_mean; if R is assumed normally distributed, u = 1.28, or given in Table 19 for log-normal distribution function.',
  },
  clauses: {
    '7.3.2': {
      title: 'Strength data of line components',
      text:
        'If tests are available, Rc = (10%)R = (1 – u × vR) R_mean; if R is assumed normally distributed, u = 1.28, or given in Table 19 for log-normal distribution function.',
    },
  },
};

export const TABLE_19_ROWS = [
  { cov: 0.05, u: 1.26 },
  { cov: 0.10, u: 1.24 },
  { cov: 0.20, u: 1.19 },
  { cov: 0.30, u: 1.14 },
  { cov: 0.40, u: 1.08 },
];

export const TABLE_19_LOGNORMAL_U_FACTORS = TABLE_19_ROWS;
