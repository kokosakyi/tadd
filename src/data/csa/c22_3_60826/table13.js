/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 13
 * "Typical strength coordination of line components"
 * (See Clause 7.2.2 and Table A.3.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 93 (PDF Page 205)
 *   - Canadian Deviation Clause 7.2.2 (PDF Page 17)
 */

export const TABLE_13_META = {
  id: 'csa-c22.3-60826/table13',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.2.2 Strength factor ΦS related to the coordination of strength',
  title: 'Typical strength coordination of line components',
  references: ['7.2.2', 'Table 12', 'Table 16', 'Table A.3'],
  iecPage: 93,
  pdfPages: [205],
  notes: {
    footnoteStar: 'Within each major component, the underlined component is the least reliable with 90% confidence.',
    footnoteDoubleStar: 'With the strength limits specified in Table 16, conductors are usually the most reliable component of the line.',
    canadianDeviation:
      'Per Clause 7.2.2 (Canadian Deviation): Despite the prescription of a preferred sequence of failure, the line can fail in a different mode. For example, conductors can break due to overstressing caused by a collapsed tower rather than from overload. Dead-end insulators can also fail due to dynamic loads caused by adjacent tower failures.',
  },
  clauses: {
    '7.2.2 (Canadian Deviation)': {
      title: 'Strength factor ΦS related to the coordination of strength (Canadian Deviation)',
      text:
        'Despite the prescription of a preferred sequence of failure, the line can fail in a different mode. For example, conductors can break due to overstressing caused by a collapsed tower rather than from overload. Dead-end insulators can also fail due to dynamic loads caused by adjacent tower failures.',
    },
  },
};

export const TABLE_13_ROWS = [
  {
    reliabilityClass: 'Less reliable (first to fail)',
    majorComponent: 'Suspension tower',
    elementsWithinMajorComponent: ['Tower', 'Foundations', 'Interfaces'],
    leastReliableSubComponent: 'Tower',
  },
  {
    reliabilityClass: 'More reliable with 90% confidence',
    majorComponent: 'Tension tower',
    elementsWithinMajorComponent: ['Tower', 'Foundations', 'Interfaces'],
    leastReliableSubComponent: 'Tower',
  },
  {
    reliabilityClass: 'More reliable with 90% confidence',
    majorComponent: 'Dead-end tower',
    elementsWithinMajorComponent: ['Tower', 'Foundations', 'Interfaces'],
    leastReliableSubComponent: 'Tower',
  },
  {
    reliabilityClass: 'More reliable with 90% confidence (most reliable)',
    majorComponent: 'Conductors',
    elementsWithinMajorComponent: ['Conductors', 'Insulators', 'Interfaces'],
    leastReliableSubComponent: 'Conductors',
    footnote: 'footnoteDoubleStar',
  },
];

export const TABLE_13_STRENGTH_COORDINATION_HIERARCHY = TABLE_13_ROWS;
