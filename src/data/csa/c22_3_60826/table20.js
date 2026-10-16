/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 20
 * "Value of quality factor ΦQ for lattice towers"
 * (See Clause 7.3.3.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 99 (PDF Page 211)
 *   - Canadian Deviation Clause 7.3.3 (PDF Page 17)
 */

export const TABLE_20_META = {
  id: 'csa-c22.3-60826/table20',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.3.3 Support design strength',
  title: 'Value of quality factor ΦQ for lattice towers',
  references: ['7.3.3', 'IEC 60652'],
  iecPage: 99,
  pdfPages: [211],
  notes: {
    canadianSimplifiedPhiR:
      'Per Clause 7.3.3 (Canadian Deviation): The following default (simplified) values may be used for lattice steel towers in the majority of lines: (a) suspension towers: ΦR = 0.9 for intact loading cases and ΦR = 1.0 for failure loading cases; and (b) angle and dead-end towers: intact ΦR = 0.8 and failed system ΦR = 0.9, where ΦR = ΦN ΦS ΦQ ΦC.',
  },
  clauses: {
    '7.3.3': {
      title: 'Support design strength',
      text:
        'Supports shall be designed for a characteristic strength Rc ≥ Support design loads / (ΦN ΦS ΦQ ΦC). For lattice towers, Table 20 gives recommended values for ΦQ, to take into account the quality in calculation method, fabrication and erection.',
    },
    '7.3.3 (Canadian Deviation)': {
      title: 'Support design strength (Canadian Deviation)',
      text:
        'The following default (simplified) values may be used for lattice steel towers in the majority of lines:\n(a) suspension towers: ΦR = 0.9 for intact loading cases and ΦR = 1.0 for failure loading cases; and\n(b) angle and dead-end towers: intact ΦR = 0.8 and failed system ΦR = 0.9\nwhere ΦR = ΦN ΦS ΦQ ΦC.',
    },
  },
};

export const TABLE_20_ROWS = [
  {
    id: 'very_good',
    qualityControl: 'Very good quality control such as involving third party inspection',
    phiQ: 1.00,
  },
  {
    id: 'good',
    qualityControl: 'Good quality control',
    phiQ: 0.95,
  },
  {
    id: 'average',
    qualityControl: 'Average quality control',
    phiQ: 0.90,
  },
];

export const TABLE_20_QUALITY_FACTOR_PHI_Q = TABLE_20_ROWS;
