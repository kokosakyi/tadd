/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.10
 * "Physical properties of ice"
 * (See Annex A, Clause A.5.4.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 171 (PDF Page 283)
 */

export const TABLE_A10_META = {
  id: 'csa-c22.3-60826/tableA10',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.5.4 Physical properties of ice',
  title: 'Physical properties of ice',
  references: ['6.3', '6.4.5', 'A.5.4', 'Table 8', 'Table A.11', 'Table A.14'],
  iecPage: 171,
  pdfPages: [283],
  clauses: {
    'A.5.4': {
      title: 'Physical properties of ice',
      text: 'The physical properties of atmospheric ice may vary within rather wide limits. Typical properties are listed in Table A.10.',
    },
  },
};

export const TABLE_A10_ROWS = [
  {
    id: 'glaze_ice',
    iceType: 'Glaze ice',
    densityRange_kg_m3: { min: 700, max: 900, display: '700 – 900' },
    adhesion: 'Strong',
    cohesion: 'Strong',
    appearance: {
      colour: 'Transparent',
      shape: 'Cylindrical icicles',
    },
  },
  {
    id: 'wet_snow',
    iceType: 'Wet snow',
    densityRange_kg_m3: { min: 400, max: 700, display: '400 – 700' },
    adhesion: 'Medium',
    cohesion: 'Medium to strong',
    appearance: {
      colour: 'White',
      shape: 'Cylindrical',
    },
  },
  {
    id: 'hard_rime',
    iceType: 'Hard rime',
    densityRange_kg_m3: { min: 700, max: 900, display: '700 – 900' },
    adhesion: 'Strong',
    cohesion: 'Very strong',
    appearance: {
      colour: 'Opaque to transparent',
      shape: 'Eccentric pennants into wind',
    },
  },
  {
    id: 'soft_rime',
    iceType: 'Soft rime',
    densityRange_kg_m3: { min: 200, max: 600, display: '200 – 600' },
    adhesion: 'Medium',
    cohesion: 'Low to medium',
    appearance: {
      colour: 'White',
      shape: 'Eccentric pennants into wind',
    },
  },
];

export const TABLE_A10_ICE_PHYSICAL_PROPERTIES = TABLE_A10_ROWS;
