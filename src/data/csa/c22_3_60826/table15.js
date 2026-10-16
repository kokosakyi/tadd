/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 15
 * "Damage and failure limits of foundations"
 * (See Clause 7.3.1 and 7.3.4.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 95 (PDF Page 207)
 */

export const TABLE_15_META = {
  id: 'csa-c22.3-60826/table15',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.3.1 Limit states for line components',
  title: 'Damage and failure limits of foundations',
  references: ['7.3.1', '7.3.4', 'Table 14'],
  iecPage: 95,
  pdfPages: [207],
  notes: {
    note1: 'Takes into account the interaction between the support and its foundation.',
    note2:
      'A determinate movement is one that does not induce internal efforts in the structure. For example the displacement of one foundation of a three-legged support is a determinate movement, while the displacement of a four-legged support is an indeterminate movement.',
    note3: 'Y is the horizontal distance between foundations.',
    note4: 'Some rigid foundations (e.g. pile) may require lower limits.',
  },
  clauses: {
    '7.3.4 (Canadian Deviation)': {
      title: 'Foundation design strength (Canadian Deviation)',
      text:
        'The following default (simplified) values may be used for foundation design strength and are acceptable in the majority of lines:\n' +
        '(a) foundations of suspension towers: ΦR = 0.9 for intact loading cases and ΦR = 1.0 for failure loading cases; and\n' +
        '(b) foundations of angle and dead-end towers: intact ΦR = 0.8 and failed system ΦR = 0.9, where ΦR = ΦN ΦS ΦQ ΦC.',
    },
  },
};

export const TABLE_15_ROWS = [
  {
    foundationLoadingType: 'Uplift',
    supportType: 'Guyed',
    staticallyDeterminateMovement: true,
    damageLimit: 'Need to readjust tension in guys',
    failureLimit: 'Excessive out-of-plane uplift movement (plane formed by the other three foundations) in the order of 5–10 cm',
  },
  {
    foundationLoadingType: 'Uplift',
    supportType: 'Guyed',
    staticallyDeterminateMovement: false,
    damageLimit: '5% reduction in support strength',
    failureLimit: 'Excessive out-of-plane uplift movement (plane formed by the other three foundations) in the order of 5–10 cm',
  },
  {
    foundationLoadingType: 'Uplift',
    supportType: 'Self-supporting',
    staticallyDeterminateMovement: true,
    damageLimit: '1° (degree) rotation of the support',
    failureLimit: 'Excessive out-of-plane uplift movement (plane formed by the other three foundations) in the order of 5–10 cm',
  },
  {
    foundationLoadingType: 'Uplift',
    supportType: 'Self-supporting',
    staticallyDeterminateMovement: false,
    damageLimit: 'Differential vertical displacement equal to Y/300 to Y/500 with a maximum of 2 cm',
    failureLimit: 'Excessive out-of-plane uplift movement (plane formed by the other three foundations) in the order of 5–10 cm',
  },
  {
    foundationLoadingType: 'Compression',
    supportType: 'All types',
    staticallyDeterminateMovement: true,
    damageLimit: 'Displacement corresponding to a 5% reduction in the support strength',
    failureLimit: 'Excessive out-of-plane settlement (plane formed by the other three foundations) in the order of 5–10 cm',
  },
  {
    foundationLoadingType: 'Compression',
    supportType: 'All types',
    staticallyDeterminateMovement: false,
    damageLimit: 'Differential vertical displacement equal to Y/300 to Y/500 with a maximum of 2 cm',
    failureLimit: 'Excessive out-of-plane settlement (plane formed by the other three foundations) in the order of 5–10 cm',
  },
  {
    foundationLoadingType: 'Moments (rotations)',
    supportType: 'Poles',
    staticallyDeterminateMovement: true,
    damageLimit: '2° (degree) rotation of the support',
    failureLimit: 'Excessive rotation in the order of 5° to 10°',
  },
  {
    foundationLoadingType: 'Moments (rotations)',
    supportType: 'Poles',
    staticallyDeterminateMovement: false,
    damageLimit: 'Rotation corresponding to a 10% increase in the total moment due to eccentricity',
    failureLimit: 'Excessive rotation in the order of 5° to 10°',
  },
];

export const TABLE_15_FOUNDATION_LIMIT_STATES = TABLE_15_ROWS;
