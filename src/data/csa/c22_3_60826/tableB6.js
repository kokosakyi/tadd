/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table B.6
 * "Use factor coefficient γu for different strength coefficients of variation"
 * (See Annex B, Clause B.4.4 and Table B.5.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex B, Page 211 (PDF Page 323)
 */

export const TABLE_B6_META = {
  id: 'csa-c22.3-60826/tableB6',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex B — B.4.4 Generalized results for use factor coefficients γu',
  title: 'Use factor coefficient γu for different strength coefficients of variation',
  references: ['5.2.3', 'B.4.4', 'Table B.3', 'Table B.4', 'Table B.5'],
  iecPage: 211,
  pdfPages: [323],
  clauses: {
    'B.4.4': {
      title: 'Generalized results for use factor coefficients γu',
      text:
        'Values of use factor coefficient γu similar to those given in Table B.5 were obtained for other vR values (0.05, 0.075, 0.10, 0.15, 0.20 and 0.25). These values were found almost constant, especially when the variation of the use factor coefficient is low. Table B.6 summarises results of γu.',
    },
  },
};

export const TABLE_B6_ROWS = [
  {
    U_mean: 0.95,
    sigma_u: 0.05,
    recommendedGammaU: 0.95,
    byN: [
      { N: 1, cov_0_05: 0.97, cov_0_10: 0.96, cov_0_15: 0.96, cov_0_20: 0.96 },
      { N: 10, cov_0_05: 0.97, cov_0_10: 0.97, cov_0_15: 0.96, cov_0_20: 0.97 },
      { N: 100, cov_0_05: 0.98, cov_0_10: 0.97, cov_0_15: 0.97, cov_0_20: 0.97 },
    ],
  },
  {
    U_mean: 0.85,
    sigma_u: 0.10,
    recommendedGammaU: 0.90,
    byN: [
      { N: 1, cov_0_05: 0.92, cov_0_10: 0.90, cov_0_15: 0.88, cov_0_20: 0.87 },
      { N: 10, cov_0_05: 0.94, cov_0_10: 0.92, cov_0_15: 0.89, cov_0_20: 0.88 },
      { N: 100, cov_0_05: 0.96, cov_0_10: 0.94, cov_0_15: 0.90, cov_0_20: 0.92 },
    ],
  },
  {
    U_mean: 0.80,
    sigma_u: 0.15,
    recommendedGammaU: 0.88,
    byN: [
      { N: 1, cov_0_05: 0.92, cov_0_10: 0.89, cov_0_15: 0.86, cov_0_20: 0.84 },
      { N: 10, cov_0_05: 0.94, cov_0_10: 0.91, cov_0_15: 0.88, cov_0_20: 0.87 },
      { N: 100, cov_0_05: 0.96, cov_0_10: 0.94, cov_0_15: 0.90, cov_0_20: 0.88 },
    ],
  },
  {
    U_mean: 0.75,
    sigma_u: 0.10,
    recommendedGammaU: 0.83,
    byN: [
      { N: 1, cov_0_05: 0.83, cov_0_10: 0.81, cov_0_15: 0.79, cov_0_20: 0.78 },
      { N: 10, cov_0_05: 0.87, cov_0_10: 0.83, cov_0_15: 0.80, cov_0_20: 0.78 },
      { N: 100, cov_0_05: 0.88, cov_0_10: 0.84, cov_0_15: 0.81, cov_0_20: 0.78 },
    ],
  },
];

export const TABLE_B6_GENERALIZED_USE_FACTOR_GAMMA_U = TABLE_B6_ROWS;
