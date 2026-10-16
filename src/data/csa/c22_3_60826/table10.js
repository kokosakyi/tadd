/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 10
 * "Number of supports subjected to maximum load intensity during any single occurrence of a climatic event"
 * (See Clause 7.2.1 and Table 11.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 89 (PDF Page 201)
 */

export const TABLE_10_META = {
  id: 'csa-c22.3-60826/table10',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.2.1 Values of strength factor ΦN',
  title: 'Number of supports subjected to maximum load intensity during any single occurrence of a climatic event',
  references: ['7.2.1', 'Table 11', 'Table A.5'],
  iecPage: 89,
  pdfPages: [201],
  notes: {
    note1: 'Values in brackets represent the typical range of supports based on a span of 400 m.',
    usage: 'The number of components other than supports can be directly derived from the number of supports thus selected.',
  },
  clauses: {
    '7.2.1': {
      title: 'Values of strength factor ΦN',
      text:
        'Whenever a number N of components are expected to be subjected to the same critical load QT during a single occurrence of a climatic event, the characteristic strength of individual components shall be de-rated (multiplied) by a strength factor ΦN. In the absence of specific experience, the number N of supports subjected to the maximum load intensity during a single occurrence of climatic events can be derived from Table 10.',
    },
  },
};

export const TABLE_10_ROWS = [
  {
    id: 'max_gust_wind',
    loading: 'Maximum gust wind',
    flatToRollingTerrain: { defaultN: 1, rangeMin: 1, rangeMax: 5, display: '1 (1 to 5)' },
    mountains: { defaultN: 1, rangeMin: 1, rangeMax: 2, display: '1 (1 to 2)' },
  },
  {
    id: 'max_ice',
    loading: 'Maximum ice',
    flatToRollingTerrain: { defaultN: 20, rangeMin: 10, rangeMax: 50, display: '20 (10 to 50)' },
    mountains: { defaultN: 2, rangeMin: 1, rangeMax: 10, display: '2 (1 to 10)' },
  },
  {
    id: 'max_ice_and_wind',
    loading: 'Maximum ice and wind',
    flatToRollingTerrain: { defaultN: 1, rangeMin: 1, rangeMax: 5, display: '1 (1 to 5)' },
    mountains: { defaultN: 1, rangeMin: 1, rangeMax: 5, display: '1 (1 to 5)' },
  },
];

export const TABLE_10_SUPPORTS_SUBJECTED_TO_MAX_LOAD = TABLE_10_ROWS;
