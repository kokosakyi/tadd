/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 2
 * "Default γT factors for adjustment of climatic loads in relation to return period T vs. 50 years"
 * (See Clause 5.2.1 and Canadian Deviation Table CA.2.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 39 (PDF Page 151)
 *   - Canadian Deviation Clause 5.2.1 (PDF Page 13) & Table CA.2 (PDF Page 39)
 */

export const TABLE_2_META = {
  id: 'csa-c22.3-60826/table2',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '5.2.1 Limit load',
  title: 'Default γT factors for adjustment of climatic loads in relation to return period T vs. 50 years',
  references: ['5.2.1', 'Table CA.2'],
  iecPage: 39,
  pdfPages: [151],
  notes: {
    note1:
      'The above γ values are sufficiently accurate for a COV of up to 0.16 for wind speed, 0.30 for ice thickness and 0.65 for unit ice weight and are derived from the Gumbel distribution function.',
    canadianDeviationNote:
      'In Canada, Clause 5.2.1 adds Table CA.2 (which provides γTw and γTi for T = 25, 50, 100, 150, 200, 400, and 500 years). See tableCA2.js.',
  },
  clauses: {
    '5.2.1': {
      title: 'Limit load',
      text:
        'QT can be obtained from the statistical analysis of climatic data in accordance with techniques detailed in Annexes A to C. In some national standards, a reference (usually a 50 year return period value) climatic variable is specified. In such case, the climatic variable for any return period T (years) can be estimated by multiplying the 50 year reference value of the climatic variable by the load factor γT, given in Table 2.',
    },
    '5.2.1 (Canadian Deviation)': {
      title: 'Limit load (Canadian Deviation)',
      text:
        'Factors γT specified in Table CA.2 are default values that can be used to adjust climatic load in relation to the return period, if different from 50 years. If return periods other than those given in Table CA.2 are used, the corresponding weather variables may be deduced by direct interpolation between the values specified in Table CA.2.',
    },
  },
};

export const TABLE_2_ROWS = [
  {
    returnPeriod_yr: 50,
    gammaWT_windSpeed: 1.00,
    gammaItT_iceThickness: 1.00,
    gammaIwT_iceWeight: 1.00,
  },
  {
    returnPeriod_yr: 150,
    gammaWT_windSpeed: 1.10,
    gammaItT_iceThickness: 1.15,
    gammaIwT_iceWeight: 1.20,
  },
  {
    returnPeriod_yr: 500,
    gammaWT_windSpeed: 1.20,
    gammaItT_iceThickness: 1.30,
    gammaIwT_iceWeight: 1.45,
  },
];

export const TABLE_2_GAMMA_FACTORS = TABLE_2_ROWS;
