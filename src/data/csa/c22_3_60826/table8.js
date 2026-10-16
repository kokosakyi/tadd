/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 8
 * "Drag coefficients of ice-covered conductors"
 * (See Clause 6.4.5 and Table A.14.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 77 (PDF Page 189)
 */

export const TABLE_8_META = {
  id: 'csa-c22.3-60826/table8',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '6.4.5 Drag coefficients of ice-covered conductors',
  title: 'Drag coefficients of ice-covered conductors',
  references: ['6.4.5', '6.4.6.1', 'Figure 13', 'Table A.14'],
  iecPage: 77,
  pdfPages: [189],
  notes: {
    note1:
      'The uniform thickness of ice around the conductor corresponds to the minimum overall diameter, i.e. the most compact projected area.',
    note2:
      'It is assumed that the value of Ci is the same for the ice coverings related to T = 50, 150, 500 years.',
  },
  clauses: {
    '6.4.5': {
      title: 'Drag coefficients of ice-covered conductors',
      text:
        'The effective drag coefficient is a multiplying factor on the assumed cylindrical shape for the specified ice volume (see Figure 13).',
    },
  },
};

export const TABLE_8_ROWS = [
  {
    id: 'wet_snow',
    icingCategory: 'Precipitation',
    iceType: 'Wet snow',
    effectiveDragCoefficient_CiH: 1.0,
    associatedIceDensity_kg_m3: 600,
  },
  {
    id: 'soft_rime',
    icingCategory: 'In-cloud',
    iceType: 'Soft rime',
    effectiveDragCoefficient_CiH: 1.2,
    associatedIceDensity_kg_m3: 600,
  },
  {
    id: 'hard_rime',
    icingCategory: 'In-cloud',
    iceType: 'Hard rime',
    effectiveDragCoefficient_CiH: 1.1,
    associatedIceDensity_kg_m3: 900,
  },
  {
    id: 'glaze_ice',
    icingCategory: 'Precipitation',
    iceType: 'Glaze ice',
    effectiveDragCoefficient_CiH: 1.0,
    associatedIceDensity_kg_m3: 900,
  },
];

export const TABLE_8_ICE_DRAG_COEFFICIENTS = TABLE_8_ROWS;
