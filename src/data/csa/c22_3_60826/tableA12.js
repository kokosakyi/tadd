/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.12
 * "Statistical parameters of ice loads"
 * (See Annex A, Clause A.5.8.1.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 179 (PDF Page 291)
 */

export const TABLE_A12_META = {
  id: 'csa-c22.3-60826/tableA12',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.5.8.1 Evaluation of information on ice loads',
  title: 'Statistical parameters of ice loads',
  references: ['6.3.4', 'A.5.8.1'],
  iecPage: 179,
  pdfPages: [291],
  notes: {
    noStatisticalDataFallback:
      'If only the maximum value gmax of ice load during a certain number of years is available (no statistical data), the mean value g_mean should be taken as 0.45 gmax and standard deviation σg as 0.5 g_mean.',
  },
  clauses: {
    'A.5.8.1': {
      title: 'Evaluation of information on ice loads',
      text:
        'If records of yearly maximum ice loads during a period of at least 10 years are available, the mean value g_mean is derived from the records of the yearly maximum ice load; the standard deviation σg is calculated or estimated according to Table A.12.',
    },
  },
};

export const TABLE_A12_ROWS = [
  {
    id: 'n_10_to_20',
    yearsOfObservationRange: '10 ≤ n ≤ 20',
    nMin: 10,
    nMax: 20,
    meanValue: 'g_mean',
    standardDeviationRule: '0.5 g_mean ≤ σg ≤ 0.7 g_mean',
    covRange: { min: 0.50, max: 0.70 },
  },
  {
    id: 'n_ge_20',
    yearsOfObservationRange: 'n ≥ 20',
    nMin: 20,
    nMax: null,
    meanValue: 'g_mean',
    standardDeviationRule: 'σg < 0.7 g_mean',
    covRange: { min: null, max: 0.70 },
  },
];

export const TABLE_A12_ICE_STATISTICAL_PARAMS = TABLE_A12_ROWS;
