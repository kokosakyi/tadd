/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 11
 * "Strength factor ΦN related to the number N of components or elements subjected to the critical load intensity"
 * (See Clause 7.2.1 and Table A.5.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 91 (PDF Page 203)
 */

export const TABLE_11_META = {
  id: 'csa-c22.3-60826/table11',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.2.1 Values of strength factor ΦN',
  title: 'Strength factor ΦN related to the number N of components or elements subjected to the critical load intensity',
  references: ['7.2.1', 'Table 10', 'Table A.5'],
  iecPage: 91,
  pdfPages: [203],
  notes: {
    note1:
      'Values of ΦN are based on a normal distribution function. Values within brackets (lognormal) are based on the log-normal distribution function.',
    note2:
      'In the case of high values of vR and N (shaded cells where both normal and log-normal values are given), the value of ΦN is very sensitive to the choice of the distribution function.',
  },
  clauses: {
    '7.2.1': {
      title: 'Values of strength factor ΦN',
      text:
        'Values of ΦN are given in Table 11 and are based on a normal distribution function. In the same table, the values within brackets are based on the log-normal distribution function.',
    },
  },
};

export const TABLE_11_ROWS = [
  {
    N: 1,
    cov_0_05: { normal: 1.00, logNormal: null },
    cov_0_075: { normal: 1.00, logNormal: null },
    cov_0_10: { normal: 1.00, logNormal: null },
    cov_0_15: { normal: 1.00, logNormal: null },
    cov_0_20: { normal: 1.00, logNormal: null },
    cov_0_25: { normal: 1.00, logNormal: null },
    cov_0_30: { normal: 1.00, logNormal: null },
  },
  {
    N: 2,
    cov_0_05: { normal: 0.98, logNormal: null },
    cov_0_075: { normal: 0.98, logNormal: null },
    cov_0_10: { normal: 0.97, logNormal: null },
    cov_0_15: { normal: 0.94, logNormal: null },
    cov_0_20: { normal: 0.91, logNormal: null },
    cov_0_25: { normal: 0.87, logNormal: null },
    cov_0_30: { normal: 0.84, logNormal: null },
  },
  {
    N: 5,
    cov_0_05: { normal: 0.96, logNormal: null },
    cov_0_075: { normal: 0.94, logNormal: null },
    cov_0_10: { normal: 0.92, logNormal: null },
    cov_0_15: { normal: 0.85, logNormal: null },
    cov_0_20: { normal: 0.80, logNormal: null },
    cov_0_25: { normal: 0.72, logNormal: 0.83 },
    cov_0_30: { normal: 0.64, logNormal: 0.80 },
  },
  {
    N: 10,
    cov_0_05: { normal: 0.94, logNormal: null },
    cov_0_075: { normal: 0.92, logNormal: null },
    cov_0_10: { normal: 0.89, logNormal: null },
    cov_0_15: { normal: 0.81, logNormal: null },
    cov_0_20: { normal: 0.72, logNormal: 0.82 },
    cov_0_25: { normal: 0.62, logNormal: 0.77 },
    cov_0_30: { normal: 0.51, logNormal: 0.73 },
  },
  {
    N: 20,
    cov_0_05: { normal: 0.93, logNormal: null },
    cov_0_075: { normal: 0.90, logNormal: null },
    cov_0_10: { normal: 0.85, logNormal: null },
    cov_0_15: { normal: 0.77, logNormal: 0.83 },
    cov_0_20: { normal: 0.66, logNormal: 0.77 },
    cov_0_25: { normal: 0.53, logNormal: 0.73 },
    cov_0_30: { normal: 0.38, logNormal: 0.68 },
  },
  {
    N: 40,
    cov_0_05: { normal: 0.92, logNormal: null },
    cov_0_075: { normal: 0.87, logNormal: null },
    cov_0_10: { normal: 0.83, logNormal: null },
    cov_0_15: { normal: 0.72, logNormal: 0.80 },
    cov_0_20: { normal: 0.59, logNormal: 0.74 },
    cov_0_25: { normal: 0.44, logNormal: 0.69 },
    cov_0_30: { normal: 0.26, logNormal: 0.64 },
  },
  {
    N: 80,
    cov_0_05: { normal: 0.91, logNormal: null },
    cov_0_075: { normal: 0.86, logNormal: null },
    cov_0_10: { normal: 0.79, logNormal: 0.84 },
    cov_0_15: { normal: 0.68, logNormal: 0.77 },
    cov_0_20: { normal: 0.53, logNormal: 0.71 },
    cov_0_25: { normal: 0.36, logNormal: 0.65 },
    cov_0_30: { normal: 0.16, logNormal: 0.60 },
  },
  {
    N: 160,
    cov_0_05: { normal: 0.90, logNormal: null },
    cov_0_075: { normal: 0.85, logNormal: null },
    cov_0_10: { normal: 0.79, logNormal: 0.83 },
    cov_0_15: { normal: 0.67, logNormal: 0.76 },
    cov_0_20: { normal: 0.52, logNormal: 0.69 },
    cov_0_25: { normal: 0.34, logNormal: 0.62 },
    cov_0_30: { normal: 0.13, logNormal: 0.57 },
  },
];

export const TABLE_11_STRENGTH_FACTOR_PHI_N = TABLE_11_ROWS;
