/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 1
 * "Reliability levels for transmission lines"
 * (See Clause 5.1.1.1 and A.1.2.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 35 (PDF Page 147)
 */

export const TABLE_1_META = {
  id: 'csa-c22.3-60826/table1',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '5.1.1.1 Reliability levels',
  title: 'Reliability levels for transmission lines',
  references: ['5.1.1.1', '5.1.1.2', 'A.1.2', 'Table A.2'],
  iecPage: 35,
  pdfPages: [147],
  notes: {
    note1:
      'Some national regulations and/or codes of practice, sometimes impose, directly or indirectly, design requirements that may restrict the choice offered to designers.',
    note2:
      'Other values of T in the range of 50–500 years, such as 100, 200 and 400 years, can be used if justified by local conditions.',
    temporaryLines:
      'For temporary lines, some wooden poles or lines of limited importance, return periods of about 25 years may be appropriate.',
  },
  clauses: {
    '5.1.1.1': {
      title: 'Reliability levels',
      text:
        'Lines can be designed for higher reliability levels by increasing the return period T of climatic events. A higher reliability can be justified for example by the importance of the line in the network. Three reliability levels are proposed in this standard and are assumed to cover the range of values to be considered for most transmission lines. These levels are expressed in terms of return periods of climatic limit loads as shown in Table 1.',
    },
  },
};

export const TABLE_1_ROWS = [
  {
    reliabilityLevel: 1,
    returnPeriod_yr: 50,
    theoreticalYearlyReliability: 0.99, // ~ 1 - 1/(2T)
    description: 'Standard reliability level (minimum requirement for all permanent lines; typical for ≤ 230 kV)',
  },
  {
    reliabilityLevel: 2,
    returnPeriod_yr: 150,
    theoreticalYearlyReliability: 0.9967,
    description: 'High reliability level (lines > 230 kV or important lines ≤ 230 kV that are the sole/principal source of supply)',
  },
  {
    reliabilityLevel: 3,
    returnPeriod_yr: 500,
    theoreticalYearlyReliability: 0.999,
    description: 'Very high reliability level (major EHV/UHV lines > 230 kV essential for system stability or sole supply to huge load centers)',
  },
];

export const TABLE_1_RELIABILITY_LEVELS = TABLE_1_ROWS;
