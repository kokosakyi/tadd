/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 18
 * "Default values for strength coefficients of variation (COV)"
 * (See Clause 7.3.2.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 97 (PDF Page 209)
 */

export const TABLE_18_META = {
  id: 'csa-c22.3-60826/table18',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.3.2 Strength data of line components',
  title: 'Default values for strength coefficients of variation (COV)',
  references: ['7.3.2', 'Table 11', 'Table 12', 'Table 19'],
  iecPage: 97,
  pdfPages: [209],
  clauses: {
    '7.3.2': {
      title: 'Strength data of line components',
      text:
        'If no specific tests are available, the characteristic strength Rc will be found in ruling standards; Rc may be assumed to correspond to e = 10%. Table 18 gives typical strength coefficient of variation vR to be used as default value in the absence of relevant data.',
    },
  },
};

export const TABLE_18_ROWS = [
  { id: 'conductors_ground_wires', component: 'Conductors and ground wires (strength usually limited by joints)', cov: 0.03 },
  { id: 'fittings', component: 'Fittings', cov: 0.05 },
  { id: 'insulators', component: 'Insulators', cov: 0.05 },
  { id: 'steel_poles', component: 'Steel poles', cov: 0.05 },
  { id: 'concrete_poles', component: 'Concrete poles', cov: 0.15 },
  { id: 'wood_poles', component: 'Wood poles', cov: 0.20 },
  { id: 'lattice_towers', component: 'Lattice towers', cov: 0.10 },
  { id: 'grouted_rock_anchors', component: 'Grouted rock anchors', cov: 0.10 },
  { id: 'pile_foundation', component: 'Pile foundation', cov: 0.25 },
  { id: 'foundation_undercut_compacted', component: 'Foundation with undercut or machine-compacted backfill', cov: 0.20 },
  { id: 'foundation_uncompacted', component: 'Foundation with uncompacted backfill', cov: 0.30 },
];

export const TABLE_18_DEFAULT_STRENGTH_COV = TABLE_18_ROWS;
