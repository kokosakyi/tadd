/**
 * CSA C22.3 No. 60826-10 (R2015) — Table CA.2
 * "Factors γT to modify the 50-year return period weather variable to any other return period T"
 * (See Clauses 5.2.1 and 6.3.4.1 and Table CB.1.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 60826-10, Annex CA, Page CSA/37 (PDF Page 39)
 *   - Clauses 5.2.1 and 6.3.4.1 (Canadian Deviations, PDF Pages 13, 16)
 */

export const TABLE_CA2_META = {
  id: 'csa-c22.3-60826/tableCA2',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  section: 'Annex CA (Informative)',
  title: 'Factors γT to modify the 50-year return period weather variable to any other return period T',
  references: ['5.2.1', '6.3.4.1', 'Table CB.1', 'Table 2'],
  pdfPages: [39],
  notes: {
    note1: 'γTw applies to wind speed and γTi applies to ice thickness.',
    interpolationRule:
      'Per Clause 5.2.1 (Canadian Deviation): If return periods other than those given in Table CA.2 are used, the corresponding weather variables may be deduced by direct interpolation between the values specified in Table CA.2.',
  },
  clauses: {
    '5.2.1 (Canadian Deviation)': {
      title: 'Limit load',
      text:
        'Factors γT specified in Table CA.2 are default values that can be used to adjust climatic load in relation to the return period, if different from 50 years.\n' +
        'Note: γTi applies to ice thickness and γTw applies to wind speed.\n' +
        'If return periods other than those given in Table CA.2 are used, the corresponding weather variables may be deduced by direct interpolation between the values specified in Table CA.2.',
    },
  },
};

export const TABLE_CA2_ROWS = [
  { returnPeriod_yr: 25, gammaTw: 0.95, gammaTi: 0.87 },
  { returnPeriod_yr: 50, gammaTw: 1.00, gammaTi: 1.00 },
  { returnPeriod_yr: 100, gammaTw: 1.07, gammaTi: 1.13 },
  { returnPeriod_yr: 150, gammaTw: 1.10, gammaTi: 1.20 },
  { returnPeriod_yr: 200, gammaTw: 1.14, gammaTi: 1.26 },
  { returnPeriod_yr: 400, gammaTw: 1.18, gammaTi: 1.38 },
  { returnPeriod_yr: 500, gammaTw: 1.20, gammaTi: 1.42 },
];

export const TABLE_CA2_GAMMA_FACTORS = TABLE_CA2_ROWS;
