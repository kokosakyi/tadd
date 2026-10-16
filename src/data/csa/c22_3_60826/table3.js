/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 3
 * "Design requirements for the system"
 * (See Clause 5.2.2.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 39 (PDF Page 151)
 */

export const TABLE_3_META = {
  id: 'csa-c22.3-60826/table3',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '5.2.2 Design requirements for the system',
  title: 'Design requirements for the system',
  references: ['5.2.2', '6.2', '6.3', '6.4', '6.5', '6.6', '7.1', '7.2'],
  iecPage: 39,
  pdfPages: [151],
  clauses: {
    '5.2.2': {
      title: 'Design requirements for the system',
      text:
        'Three types of design conditions shall be checked: reliability, security and safety. Table 3 summarizes the context of loads, the required performance and the limit states associated with each condition.',
    },
  },
};

export const TABLE_3_ROWS = [
  {
    id: 'reliability',
    condition: 'Reliability',
    typeOfLoad: 'Climatic loads due to wind, ice, ice plus wind, with a return period T',
    requiredPerformance: 'To ensure reliable and safe power transmission capability',
    correspondingLimitState: 'Damage limit',
  },
  {
    id: 'security',
    condition: 'Security',
    typeOfLoad: 'Torsional, vertical, and longitudinal loads',
    requiredPerformance: 'To reduce the probability of uncontrollable propagation of failures (failure containment)',
    correspondingLimitState: 'Failure limit',
  },
  {
    id: 'safety',
    condition: 'Safety',
    typeOfLoad: 'Construction and maintenance loads',
    requiredPerformance: 'To ensure safe construction and maintenance conditions',
    correspondingLimitState: 'Damage limit',
  },
];

export const TABLE_3_DESIGN_REQUIREMENTS = TABLE_3_ROWS;
