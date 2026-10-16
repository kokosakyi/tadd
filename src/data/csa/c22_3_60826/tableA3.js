/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.3
 * "Typical strength coordination"
 * (See Annex A, Clause A.1.3.1 and Table 13.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 129 (PDF Page 241)
 */

export const TABLE_A3_META = {
  id: 'csa-c22.3-60826/tableA3',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.1.3.1 Criteria for strength coordination',
  title: 'Typical strength coordination',
  references: ['7.2.2', 'A.1.3.1', 'A.1.3.2', 'Table 13'],
  iecPage: 129,
  pdfPages: [241],
  notes: {
    footnoteStar: 'Within each major component the underlined component is the weakest with 90% confidence.',
  },
  clauses: {
    'A.1.3.1': {
      title: 'Criteria for strength coordination',
      text:
        'The logical consequence of the considerations above is that the suspension supports should constitute the component with the lowest strength. When a line designed according to this rule is subjected to climatic loads exceeding design values the suspension supports would fail first.',
    },
  },
};

export const TABLE_A3_ROWS = [
  {
    strengthCategory: 'Lowest strength',
    majorComponent: 'Suspension tower',
    coordinationWithinMajorComponents: ['Tower', 'Foundations', 'Fittings'],
    weakestSubComponent: 'Tower',
  },
  {
    strengthCategory: 'Not having lowest strength with 90% confidence',
    majorComponent: 'Tension tower',
    coordinationWithinMajorComponents: ['Tower', 'Foundations', 'Fittings'],
    weakestSubComponent: 'Tower',
  },
  {
    strengthCategory: 'Not having lowest strength with 90% confidence',
    majorComponent: 'Dead end tower',
    coordinationWithinMajorComponents: ['Tower', 'Foundations', 'Fittings'],
    weakestSubComponent: 'Tower',
  },
  {
    strengthCategory: 'Not having lowest strength with 90% confidence',
    majorComponent: 'Conductors',
    coordinationWithinMajorComponents: ['Conductors', 'Insulators', 'Fittings'],
    weakestSubComponent: 'Conductors',
  },
];

export const TABLE_A3_TYPICAL_STRENGTH_COORDINATION = TABLE_A3_ROWS;
