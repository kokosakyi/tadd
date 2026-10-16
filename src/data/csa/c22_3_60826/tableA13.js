/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.13
 * "Combined wind and ice loading conditions"
 * (See Annex A, Clause A.6.1 and Table 7.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 183 (PDF Page 295)
 */

export const TABLE_A13_META = {
  id: 'csa-c22.3-60826/tableA13',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.6.1 Combined probabilities',
  title: 'Combined wind and ice loading conditions',
  references: ['6.4.1', 'A.6.1', 'Table 7', 'Table A.14'],
  iecPage: 183,
  pdfPages: [295],
  notes: {
    indexDefinitions:
      'The high probability (index H) is considered to be the average of extreme yearly values, while the low probability (index L) of the variable is the one corresponding to a return period T.',
  },
  clauses: {
    'A.6.1': {
      title: 'Combined probabilities',
      text:
        'Three combined wind and ice loading conditions can be formulated by combining one low probability variable (return period T) with high probability (average of extreme yearly values) for the remaining variables.',
    },
  },
};

export const TABLE_A13_ROWS = [
  {
    id: 'condition_1',
    loadingCondition: 'Condition 1',
    iceWeight: 'gL (low probability / extreme ice of return period T)',
    windSpeed: 'VIH (high probability / average yearly max wind during icing)',
    effectiveDragCoefficient: 'CIH',
    density: 'δ1',
  },
  {
    id: 'condition_2',
    loadingCondition: 'Condition 2',
    iceWeight: 'gH (high probability / average yearly max ice)',
    windSpeed: 'VIL (low probability / extreme wind during icing of return period T)',
    effectiveDragCoefficient: 'CIH',
    density: 'δ1',
  },
  {
    id: 'condition_3',
    loadingCondition: 'Condition 3',
    iceWeight: 'gH (high probability / average yearly max ice)',
    windSpeed: 'VIH (high probability / average yearly max wind during icing)',
    effectiveDragCoefficient: 'CIL (low probability / extreme drag coefficient)',
    density: 'δ2',
  },
];

export const TABLE_A13_COMBINED_LOADING_CONDITIONS = TABLE_A13_ROWS;
