/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 17
 * "Damage and failure limit of interface components"
 * (See Clauses 7.3.1 and 7.3.6.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 97 (PDF Page 209)
 *   - Canadian Deviation Clause 7.3.6 (PDF Page 18)
 */

export const TABLE_17_META = {
  id: 'csa-c22.3-60826/table17',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.3.1 Limit states for line components',
  title: 'Damage and failure limit of interface components',
  references: ['7.3.1', '7.3.6'],
  iecPage: 97,
  pdfPages: [209],
  notes: {
    note1:
      'Normally, fittings are designed in a manner to reduce or eliminate wear. Should wear be expected because of point-to-point contact, it should be considered in the design. In such case, the damage limit becomes "exceeding the expected wear".',
    note2:
      'The critical permanent deformation is defined as the state where the fittings cannot be easily taken apart.',
  },
  clauses: {
    '7.3.6 (Canadian Deviation)': {
      title: 'Insulator string design criteria (Canadian Deviation)',
      text:
        'When required, tests for fittings shall comply with the latest edition of CSA C83 or IEC 61284. CSA C83 shall take precedence, with IEC 61284 being used in the absence of requirements in CSA C83.',
    },
  },
};

export const TABLE_17_ROWS = [
  {
    id: 'cable_joints',
    interfaceComponentType: 'Cable joints (dead-end and junction fittings, suspension fittings)',
    damageLimit: 'Unacceptable permanent deformation (including slippage)',
    failureLimit: 'Rupture',
  },
  {
    id: 'insulators',
    interfaceComponentType: 'Insulators (porcelain and glass)',
    damageLimit: '70% strength rating or broken shed (glass only)',
    damageLimitRatingRatio: 0.70,
    failureLimit: 'Rupture of pin, cap, cement or shed',
  },
  {
    id: 'fittings',
    interfaceComponentType: 'Fittings',
    damageLimit: 'Critical permanent deformation',
    failureLimit: 'Rupture of fittings or shear of bolts',
  },
];

export const TABLE_17_INTERFACE_LIMIT_STATES = TABLE_17_ROWS;
