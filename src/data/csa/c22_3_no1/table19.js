/**
 * CSA C22.3 No. 1 — Table 19
 * "Vertical spacings between supply-line conductors of 0 to 750 V on vertical brackets"
 * (See Clause 5.9.2.2.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 95 (PDF Page 100)
 *   - Clause 5.9.2.2, Page 47 (PDF Page 52)
 *
 * All spacings in MILLIMETRES (mm).
 */

export const TABLE_19_META = {
  id: 'csa-c22.3-no1/table19',
  standard: 'CSA C22.3 No. 1',
  title: 'Vertical spacings between supply-line conductors of 0 to 750 V on vertical brackets',
  unit: 'mm',
  references: ['5.9.2.2'],
  notes: {
    topConductorToCrossarmAbove: 'Minimum vertical spacing between the top conductors on the vertical bracket and the centre of the nearest crossarm above shall be 600 mm.',
  },
  clauses: {
    '5.9.2.2': {
      title: 'Vertical spacings between supply-line conductors of 0 to 750 V on vertical brackets',
      text:
        'The average vertical spacings between supply-line conductors of 0 to 750 V that are supported on vertical brackets shall be not less than those specified in Table 19 and shall apply under the following conditions:\n' +
        'a) conductors shall be erected and maintained in a manner that prevents in-span contact under normal operating conditions; and\n' +
        'b) the minimum vertical spacing between the top conductors supported on the vertical bracket and the centre of the nearest crossarm above shall be 600 mm.',
    },
  },
};

export const TABLE_19_ROWS = [
  { maxSpanLengthM: 20, minAverageSpacing_mm: 100 },
  { maxSpanLengthM: 45, minAverageSpacing_mm: 150 },
  { maxSpanLengthM: 60, minAverageSpacing_mm: 200 },
  { maxSpanLengthM: 75, minAverageSpacing_mm: 250 },
];
