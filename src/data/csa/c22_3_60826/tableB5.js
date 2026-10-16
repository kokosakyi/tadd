/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table B.5
 * "Values of use factor coefficient γu as a function of U_mean and N for vR = 0.10"
 * (See Annex B, Clause B.4.3 and Table B.6.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex B, Page 209 (PDF Page 321)
 */

export const TABLE_B5_META = {
  id: 'csa-c22.3-60826/tableB5',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex B — B.4.3 Joint effect of use factor and strength variation',
  title: 'Values of use factor coefficient γu as a function of U_mean and N for vR = 0.10',
  references: ['5.2.3', 'B.4.3', 'Table B.6'],
  iecPage: 209,
  pdfPages: [321],
  notes: {
    formula: 'γu = (10%)min_N(R) / (10%)min_N(R/U). Obtained by Monte-Carlo simulation for vR = 0.10.',
  },
  clauses: {
    'B.4.3': {
      title: 'Joint effect of use factor and strength variation',
      text:
        'From Table B.5 we notice that the use factor coefficient γu increases very slightly with increasing number of supports N and can be taken as nearly constant.',
    },
  },
};

export const TABLE_B5_ROWS = [
  {
    U_mean: 0.95,
    sigma_u: 0.05,
    gammaUByN: { N_1: 0.96, N_2: 0.96, N_5: 0.97, N_10: 0.97, N_20: 0.97, N_50: 0.97, N_100: 0.97 },
  },
  {
    U_mean: 0.85,
    sigma_u: 0.10,
    gammaUByN: { N_1: 0.90, N_2: 0.90, N_5: 0.91, N_10: 0.92, N_20: 0.94, N_50: 0.94, N_100: 0.94 },
  },
  {
    U_mean: 0.80,
    sigma_u: 0.15,
    gammaUByN: { N_1: 0.89, N_2: 0.90, N_5: 0.91, N_10: 0.91, N_20: 0.92, N_50: 0.93, N_100: 0.94 },
  },
];

export const TABLE_B5_USE_FACTOR_GAMMA_U = TABLE_B5_ROWS;
