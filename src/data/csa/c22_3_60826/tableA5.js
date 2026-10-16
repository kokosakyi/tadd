/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.5
 * "Strength factor ΦN related to N components in series subjected to the critical load"
 * (See Annex A, Clause A.1.3.5 and Table 11.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 143 (PDF Page 255)
 */

export const TABLE_A5_META = {
  id: 'csa-c22.3-60826/tableA5',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.1.3.5 Number of components subjected to maximum load intensity',
  title: 'Strength factor ΦN related to N components in series subjected to the critical load',
  references: ['7.2.1', 'A.1.3.5', 'Table 10', 'Table 11'],
  iecPage: 143,
  pdfPages: [255],
  notes: {
    note1: 'Values in parentheses refer to log-normal distribution; primary values refer to normal (Gaussian) distribution.',
    note2: 'The range of values where the difference in ΦN between normal and log-normal is more than 10% is shown in italic characters in the standard.',
  },
  clauses: {
    'A.1.3.5': {
      title: 'Number of components subjected to maximum load intensity',
      text:
        'Table A.5 depicts strength factors ΦN depending on the number of components N in series or in parallel subjected simultaneously to the critical load obtained under the assumption of a normal and a log-normal distribution of their strength.',
    },
  },
};

export const TABLE_A5_ROWS = [
  {
    N: 1,
    cov_0_05: { normal: 1.00, logNormal: 1.00 },
    cov_0_075: { normal: 1.00, logNormal: 1.00 },
    cov_0_10: { normal: 1.00, logNormal: 1.00 },
    cov_0_15: { normal: 1.00, logNormal: 1.00 },
    cov_0_20: { normal: 1.00, logNormal: 1.00 },
    cov_0_25: { normal: 1.00, logNormal: 1.00 },
    cov_0_30: { normal: 1.00, logNormal: 1.00 },
  },
  {
    N: 2,
    cov_0_05: { normal: 0.98, logNormal: 0.98 },
    cov_0_075: { normal: 0.98, logNormal: 0.97 },
    cov_0_10: { normal: 0.97, logNormal: 0.97 },
    cov_0_15: { normal: 0.94, logNormal: 0.95 },
    cov_0_20: { normal: 0.91, logNormal: 0.93 },
    cov_0_25: { normal: 0.87, logNormal: 0.92 },
    cov_0_30: { normal: 0.84, logNormal: 0.90 },
  },
  {
    N: 5,
    cov_0_05: { normal: 0.96, logNormal: 0.96 },
    cov_0_075: { normal: 0.94, logNormal: 0.94 },
    cov_0_10: { normal: 0.92, logNormal: 0.93 },
    cov_0_15: { normal: 0.85, logNormal: 0.89 },
    cov_0_20: { normal: 0.80, logNormal: 0.86 },
    cov_0_25: { normal: 0.72, logNormal: 0.83 },
    cov_0_30: { normal: 0.64, logNormal: 0.80 },
  },
  {
    N: 10,
    cov_0_05: { normal: 0.94, logNormal: 0.95 },
    cov_0_075: { normal: 0.92, logNormal: 0.93 },
    cov_0_10: { normal: 0.89, logNormal: 0.90 },
    cov_0_15: { normal: 0.81, logNormal: 0.86 },
    cov_0_20: { normal: 0.72, logNormal: 0.82 },
    cov_0_25: { normal: 0.62, logNormal: 0.77 },
    cov_0_30: { normal: 0.51, logNormal: 0.73 },
  },
  {
    N: 20,
    cov_0_05: { normal: 0.93, logNormal: 0.94 },
    cov_0_075: { normal: 0.90, logNormal: 0.91 },
    cov_0_10: { normal: 0.85, logNormal: 0.88 },
    cov_0_15: { normal: 0.77, logNormal: 0.83 },
    cov_0_20: { normal: 0.66, logNormal: 0.77 },
    cov_0_25: { normal: 0.53, logNormal: 0.73 },
    cov_0_30: { normal: 0.38, logNormal: 0.68 },
  },
  {
    N: 40,
    cov_0_05: { normal: 0.92, logNormal: 0.93 },
    cov_0_075: { normal: 0.87, logNormal: 0.89 },
    cov_0_10: { normal: 0.83, logNormal: 0.86 },
    cov_0_15: { normal: 0.72, logNormal: 0.80 },
    cov_0_20: { normal: 0.59, logNormal: 0.74 },
    cov_0_25: { normal: 0.44, logNormal: 0.69 },
    cov_0_30: { normal: 0.26, logNormal: 0.64 },
  },
  {
    N: 60,
    cov_0_05: { normal: 0.91, logNormal: 0.92 },
    cov_0_075: { normal: 0.86, logNormal: 0.88 },
    cov_0_10: { normal: 0.81, logNormal: 0.85 },
    cov_0_15: { normal: 0.70, logNormal: 0.78 },
    cov_0_20: { normal: 0.56, logNormal: 0.72 },
    cov_0_25: { normal: 0.40, logNormal: 0.67 },
    cov_0_30: { normal: 0.20, logNormal: 0.62 },
  },
  {
    N: 80,
    cov_0_05: { normal: 0.91, logNormal: 0.92 },
    cov_0_075: { normal: 0.86, logNormal: 0.88 },
    cov_0_10: { normal: 0.80, logNormal: 0.84 },
    cov_0_15: { normal: 0.68, logNormal: 0.77 },
    cov_0_20: { normal: 0.53, logNormal: 0.71 },
    cov_0_25: { normal: 0.36, logNormal: 0.65 },
    cov_0_30: { normal: 0.16, logNormal: 0.60 },
  },
  {
    N: 160,
    cov_0_05: { normal: 0.90, logNormal: 0.91 },
    cov_0_075: { normal: 0.85, logNormal: 0.87 },
    cov_0_10: { normal: 0.79, logNormal: 0.83 },
    cov_0_15: { normal: 0.67, logNormal: 0.76 },
    cov_0_20: { normal: 0.52, logNormal: 0.69 },
    cov_0_25: { normal: 0.34, logNormal: 0.62 },
    cov_0_30: { normal: 0.13, logNormal: 0.57 },
  },
];

export const TABLE_A5_SERIES_STRENGTH_FACTOR_PHI_N = TABLE_A5_ROWS;
