/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 9
 * "Additional security measures"
 * (See Clauses 6.6.2 and 6.6.3.3.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 87 (PDF Page 199)
 *   - Canadian Deviation Clauses 6.6.2 and 6.6.3.1 (PDF Page 17)
 */

export const TABLE_9_META = {
  id: 'csa-c22.3-60826/table9',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '6.6.3.3 Additional security measures',
  title: 'Additional security measures',
  references: ['6.6.2', '6.6.3.1', '6.6.3.3'],
  iecPage: 87,
  pdfPages: [199],
  clauses: {
    '6.6.3.3': {
      title: 'Additional security measures',
      text: 'The designer can increase the security by adopting some of the requirements listed in Table 9.',
    },
    '6.6.2 (Canadian Deviation)': {
      title: 'Security requirements (Canadian Deviation)',
      text:
        'If the requirements stated in Clause 6.6 are impractical for wood pole structures, these requirements may be replaced by either of the following:\n' +
        '(a) Structures capable of resisting all static broken bare conductor tensions at 0 °C shall be located at intervals not exceeding every 25 structures.\n' +
        '(b) A study shall demonstrate that anti-cascading capabilities are inherent in the wood pole structures and will limit cascading damage to a distance equivalent to that of Item (a).',
    },
  },
};

export const TABLE_9_ROWS = [
  {
    id: 'increase_rsl_factor',
    measure: 'Increase the RSL by a factor of 1.5 at any one point',
    comment: 'Lines where higher security is justified',
  },
  {
    id: 'increase_torsional_load_points',
    measure:
      'Increase the number of torsional/flexural load points to either two phases or two ground wires where the residual static load (RSL) is applied',
    comment: 'Advisable for double or multi-circuit lines',
  },
  {
    id: 'rsl_3yr_climatic_load',
    measure:
      'Calculate the RSL for tensions higher than the every day load by using wind or ice load corresponding to a 3 year return period in conjunction with this loading case',
    comment: 'Advisable for angle structures or lines subjected to severe climatic conditions',
  },
  {
    id: 'anti_cascading_towers',
    measure:
      'Insertion of anti-cascading towers at intervals, typically every tenth tower. These towers shall be designed for all broken conductors with limit loads',
    comment: 'To be considered for important lines in heavy icing areas',
  },
];

export const TABLE_9_SECURITY_MEASURES = TABLE_9_ROWS;
