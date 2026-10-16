/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 7
 * "Return period of combined ice and wind load"
 * (See Clause 6.4.1 and Table A.13.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 73 (PDF Page 185)
 */

export const TABLE_7_META = {
  id: 'csa-c22.3-60826/table7',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '6.4.1 Combined probabilities – Principle proposed',
  title: 'Return period of combined ice and wind load',
  references: ['6.4.1', '6.4.2', '6.4.3', '6.4.4', 'Table A.13'],
  iecPage: 73,
  pdfPages: [185],
  notes: {
    principle:
      'A low probability (index L, return period T) value of one variable is combined with high probability (index H, average of yearly maximum values) of the remaining variables.',
    combinations:
      'Two loading combinations are considered: Condition 1 (Low ice probability gL with average yearly wind during icing VIH) and Condition 2 (Low probability wind during icing VIL with average yearly maximum icing gH).',
  },
  clauses: {
    '6.4.1': {
      title: 'Combined probabilities – Principle proposed',
      text:
        'Assuming that maximum loads are most likely to be related to combinations involving at least one maximum value of a variable (either of wind speed, ice weight or ice shape), a simplified method is proposed: a low probability (index L) value of a variable is combined with high probability (index H) values of the other two variables, as is shown in Table 7.',
    },
  },
};

export const TABLE_7_ROWS = [
  {
    reliabilityLevel: 1,
    returnPeriod_yr: 50,
    lowProbabilityVariableReturnPeriod_yr: 50,
    remainingVariablesReturnPeriod: 'Average of yearly maximum values',
  },
  {
    reliabilityLevel: 2,
    returnPeriod_yr: 150,
    lowProbabilityVariableReturnPeriod_yr: 150,
    remainingVariablesReturnPeriod: 'Average of yearly maximum values',
  },
  {
    reliabilityLevel: 3,
    returnPeriod_yr: 500,
    lowProbabilityVariableReturnPeriod_yr: 500,
    remainingVariablesReturnPeriod: 'Average of yearly maximum values',
  },
];

export const TABLE_7_COMBINED_ICE_WIND_RETURN_PERIODS = TABLE_7_ROWS;
