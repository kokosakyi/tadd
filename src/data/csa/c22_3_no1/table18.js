/**
 * CSA C22.3 No. 1 — Table 18
 * "Minimum vertical separations between supply-line conductors attached to the same supporting structure, ac"
 * (See Clause 5.9.2.1.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 95 (PDF Page 100)
 *   - Clause 5.9.2.1, Page 47 (PDF Page 52)
 *
 * All separations in METRES.
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_18_META = {
  id: 'csa-c22.3-no1/table18',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum vertical separations between supply-line conductors attached to the same supporting structure, ac',
  unit: 'm',
  references: ['5.9.2.1'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'This category also includes dc.',
    footnoteDagger: 'This value does not apply to conductors on adjacent supports of the same circuit or circuits.',
  },
  clauses: {
    '5.9.2.1': {
      title: 'Minimum vertical separations between supply-line conductors attached to the same supporting structure',
      text:
        'Where supply-line conductors of the same or different voltage classifications are supported by the same structure, but at different levels, the minimum vertical separations shall be as specified in Table 18. Where galloping or ice drop-off are likely to occur, increased separation should be considered to ensure adequate in-span clearance.',
    },
  },
};

export const TABLE_18_HIGHER_LEVEL_COLUMNS = [
  { id: 'col_0_075', label: '0–750 V', vMin: 0, vMax: 0.75 },
  { id: 'col_075_5', label: '> 0.75 kV ≤ 5 kV', vMin: 0.75, vMax: 5 },
  { id: 'col_5_22', label: '> 5 kV ≤ 22 kV', vMin: 5, vMax: 22 },
  { id: 'col_22_50', label: '> 22 kV ≤ 50 kV', vMin: 22, vMax: 50 },
  { id: 'col_50_90', label: '> 50 kV ≤ 90 kV', vMin: 50, vMax: 90 },
];

export const TABLE_18_ROWS = [
  {
    lowerVoltageClass: '0–750 V*',
    vLowerMin: 0,
    vLowerMax: 0.75,
    includesDc: true,
    separations_m: {
      col_0_075: 0.1,
      col_075_5: 0.4,
      col_5_22: 0.4,
      col_22_50: 1.0,
      col_50_90: 1.5,
    },
  },
  {
    lowerVoltageClass: '> 0.75 kV ≤ 5 kV',
    vLowerMin: 0.75,
    vLowerMax: 5,
    separations_m: {
      col_0_075: null,
      col_075_5: 0.4,
      col_5_22: 0.4,
      col_22_50: 1.0,
      col_50_90: 1.5,
    },
  },
  {
    lowerVoltageClass: '> 5 kV ≤ 22 kV',
    vLowerMin: 5,
    vLowerMax: 22,
    separations_m: {
      col_0_075: null,
      col_075_5: null,
      col_5_22: 0.4, // footnote † (does not apply to conductors on adjacent supports of same circuit)
      col_22_50: 1.0,
      col_50_90: 1.5,
    },
  },
  {
    lowerVoltageClass: '> 22 kV ≤ 50 kV',
    vLowerMin: 22,
    vLowerMax: 50,
    separations_m: {
      col_0_075: null,
      col_075_5: null,
      col_5_22: null,
      col_22_50: 1.0, // footnote †
      col_50_90: 1.5,
    },
  },
  {
    lowerVoltageClass: '> 50 kV ≤ 90 kV',
    vLowerMin: 50,
    vLowerMax: 90,
    separations_m: {
      col_0_075: null,
      col_075_5: null,
      col_5_22: null,
      col_22_50: null,
      col_50_90: 1.5, // footnote †
    },
  },
];
