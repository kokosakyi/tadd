/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table C.2
 * "Values of u1 for given values of function F(u1) = I(u1, p3 - 1)"
 * (See Annex C, Clause C.6 and Figure C.5.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex C, Page 235 (PDF Page 347)
 */

export const TABLE_C2_META = {
  id: 'csa-c22.3-60826/tableC2',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex C — C.6 Gamma distribution',
  title: 'Values of u1 for given values of function F(u1) = I(u1, p3 - 1)',
  references: ['C.6', 'Figure C.5'],
  iecPage: 235,
  pdfPages: [347],
  notes: {
    structure:
      'Upper sub-table gives u1 for upper tail return periods T = 50 (FT = 0.98), 150 (FT = 0.993), and 500 (FT = 0.998) for shape parameter p3 in [0.05, 1.00]. Lower sub-table gives u1 for lower tail exclusion limits e = 2% (Fe = 0.02), 5% (Fe = 0.05), and 10% (Fe = 0.10) for shape parameter p3 in [1.0, 3.0].',
  },
  clauses: {
    'C.6': {
      title: 'Gamma distribution',
      text:
        'Table C.2 provides quantiles u1 of the standardized Gamma distribution F(u1) = I(u1, p3 - 1) for return periods T (load tail) and exclusion limits e (strength tail).',
    },
  },
};

export const TABLE_C2_UPPER_TAIL_RETURN_PERIODS = [
  { p3: 0.05, T_50_FT_0_98: 3.06, T_150_FT_0_993: 6.04, T_500_FT_0_998: 9.86 },
  { p3: 0.10, T_50_FT_0_98: 3.54, T_150_FT_0_993: 5.95, T_500_FT_0_998: 8.87 },
  { p3: 0.15, T_50_FT_0_98: 3.68, T_150_FT_0_993: 5.78, T_500_FT_0_998: 8.27 },
  { p3: 0.20, T_50_FT_0_98: 3.74, T_150_FT_0_993: 5.64, T_500_FT_0_998: 7.86 },
  { p3: 0.25, T_50_FT_0_98: 3.77, T_150_FT_0_993: 5.53, T_500_FT_0_998: 7.55 },
  { p3: 0.30, T_50_FT_0_98: 3.79, T_150_FT_0_993: 5.44, T_500_FT_0_998: 7.32 },
  { p3: 0.35, T_50_FT_0_98: 3.80, T_150_FT_0_993: 5.36, T_500_FT_0_998: 7.14 },
  { p3: 0.40, T_50_FT_0_98: 3.81, T_150_FT_0_993: 5.30, T_500_FT_0_998: 6.99 },
  { p3: 0.45, T_50_FT_0_98: 3.82, T_150_FT_0_993: 5.25, T_500_FT_0_998: 6.86 },
  { p3: 0.50, T_50_FT_0_98: 3.83, T_150_FT_0_993: 5.20, T_500_FT_0_998: 6.75 },
  { p3: 0.55, T_50_FT_0_98: 3.84, T_150_FT_0_993: 5.17, T_500_FT_0_998: 6.66 },
  { p3: 0.60, T_50_FT_0_98: 3.84, T_150_FT_0_993: 5.14, T_500_FT_0_998: 6.58 },
  { p3: 0.65, T_50_FT_0_98: 3.85, T_150_FT_0_993: 5.11, T_500_FT_0_998: 6.52 },
  { p3: 0.70, T_50_FT_0_98: 3.86, T_150_FT_0_993: 5.09, T_500_FT_0_998: 6.46 },
  { p3: 0.75, T_50_FT_0_98: 3.87, T_150_FT_0_993: 5.07, T_500_FT_0_998: 6.40 },
  { p3: 0.80, T_50_FT_0_98: 3.88, T_150_FT_0_993: 5.05, T_500_FT_0_998: 6.36 },
  { p3: 0.85, T_50_FT_0_98: 3.88, T_150_FT_0_993: 5.04, T_500_FT_0_998: 6.31 },
  { p3: 0.90, T_50_FT_0_98: 3.89, T_150_FT_0_993: 5.03, T_500_FT_0_998: 6.28 },
  { p3: 0.95, T_50_FT_0_98: 3.90, T_150_FT_0_993: 5.02, T_500_FT_0_998: 6.25 },
  { p3: 1.00, T_50_FT_0_98: 3.91, T_150_FT_0_993: 5.01, T_500_FT_0_998: 6.22 },
];

export const TABLE_C2_LOWER_TAIL_EXCLUSION_LIMITS = [
  { p3: 1.0, e_2pct_Fe_0_02: 0.021, e_5pct_Fe_0_05: 0.053, e_10pct_Fe_0_10: 0.106 },
  { p3: 1.1, e_2pct_Fe_0_02: 0.026, e_5pct_Fe_0_05: 0.066, e_10pct_Fe_0_10: 0.131 },
  { p3: 1.2, e_2pct_Fe_0_02: 0.033, e_5pct_Fe_0_05: 0.083, e_10pct_Fe_0_10: 0.157 },
  { p3: 1.3, e_2pct_Fe_0_02: 0.042, e_5pct_Fe_0_05: 0.104, e_10pct_Fe_0_10: 0.183 },
  { p3: 1.4, e_2pct_Fe_0_02: 0.053, e_5pct_Fe_0_05: 0.122, e_10pct_Fe_0_10: 0.211 },
  { p3: 1.5, e_2pct_Fe_0_02: 0.067, e_5pct_Fe_0_05: 0.141, e_10pct_Fe_0_10: 0.238 },
  { p3: 1.6, e_2pct_Fe_0_02: 0.084, e_5pct_Fe_0_05: 0.161, e_10pct_Fe_0_10: 0.265 },
  { p3: 1.7, e_2pct_Fe_0_02: 0.104, e_5pct_Fe_0_05: 0.184, e_10pct_Fe_0_10: 0.293 },
  { p3: 1.8, e_2pct_Fe_0_02: 0.116, e_5pct_Fe_0_05: 0.207, e_10pct_Fe_0_10: 0.320 },
  { p3: 1.9, e_2pct_Fe_0_02: 0.130, e_5pct_Fe_0_05: 0.227, e_10pct_Fe_0_10: 0.347 },
  { p3: 2.0, e_2pct_Fe_0_02: 0.145, e_5pct_Fe_0_05: 0.248, e_10pct_Fe_0_10: 0.375 },
  { p3: 2.1, e_2pct_Fe_0_02: 0.162, e_5pct_Fe_0_05: 0.271, e_10pct_Fe_0_10: 0.403 },
  { p3: 2.2, e_2pct_Fe_0_02: 0.181, e_5pct_Fe_0_05: 0.295, e_10pct_Fe_0_10: 0.429 },
  { p3: 2.3, e_2pct_Fe_0_02: 0.202, e_5pct_Fe_0_05: 0.316, e_10pct_Fe_0_10: 0.455 },
  { p3: 2.4, e_2pct_Fe_0_02: 0.217, e_5pct_Fe_0_05: 0.337, e_10pct_Fe_0_10: 0.482 },
  { p3: 2.5, e_2pct_Fe_0_02: 0.233, e_5pct_Fe_0_05: 0.359, e_10pct_Fe_0_10: 0.509 },
  { p3: 2.6, e_2pct_Fe_0_02: 0.250, e_5pct_Fe_0_05: 0.382, e_10pct_Fe_0_10: 0.534 },
  { p3: 2.7, e_2pct_Fe_0_02: 0.268, e_5pct_Fe_0_05: 0.406, e_10pct_Fe_0_10: 0.559 },
  { p3: 2.8, e_2pct_Fe_0_02: 0.289, e_5pct_Fe_0_05: 0.426, e_10pct_Fe_0_10: 0.585 },
  { p3: 2.9, e_2pct_Fe_0_02: 0.308, e_5pct_Fe_0_05: 0.447, e_10pct_Fe_0_10: 0.611 },
  { p3: 3.0, e_2pct_Fe_0_02: 0.324, e_5pct_Fe_0_05: 0.469, e_10pct_Fe_0_10: 0.635 },
];

export const TABLE_C2_ROWS = {
  upperTailReturnPeriods: TABLE_C2_UPPER_TAIL_RETURN_PERIODS,
  lowerTailExclusionLimits: TABLE_C2_LOWER_TAIL_EXCLUSION_LIMITS,
};

export const TABLE_C2_GAMMA_U1_VALUES = TABLE_C2_ROWS;
