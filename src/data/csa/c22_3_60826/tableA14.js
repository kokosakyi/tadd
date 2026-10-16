/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.14
 * "Drag coefficients and density of ice-covered conductors"
 * (See Annex A, Clause A.6.2 and Table 8.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 183 (PDF Page 295)
 */

export const TABLE_A14_META = {
  id: 'csa-c22.3-60826/tableA14',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.6.2 Drag coefficients of ice-covered conductors',
  title: 'Drag coefficients and density of ice-covered conductors',
  references: ['6.4.5', 'A.6.2', 'Table 8', 'Table A.13'],
  iecPage: 183,
  pdfPages: [295],
  clauses: {
    'A.6.2': {
      title: 'Drag coefficients of ice-covered conductors',
      text:
        'As long as statistical data on the effective drag coefficients and densities are not available, it is suggested, in the absence of other experimental values, that the values given in Table A.14 should be used.',
    },
  },
};

export const TABLE_A14_ROWS = [
  {
    id: 'wet_snow',
    iceType: 'Wet snow',
    effectiveDragCoefficient_CIH: 1.0,
    density_delta1_kg_m3: 600,
    effectiveDragCoefficient_CIL: 1.4,
    density_delta2_kg_m3: 400,
  },
  {
    id: 'soft_rime',
    iceType: 'Soft rime',
    effectiveDragCoefficient_CIH: 1.2,
    density_delta1_kg_m3: 600,
    effectiveDragCoefficient_CIL: 1.7,
    density_delta2_kg_m3: 400,
  },
  {
    id: 'hard_rime',
    iceType: 'Hard rime',
    effectiveDragCoefficient_CIH: 1.1,
    density_delta1_kg_m3: 900,
    effectiveDragCoefficient_CIL: 1.5,
    density_delta2_kg_m3: 700,
  },
  {
    id: 'glaze_ice',
    iceType: 'Glaze ice',
    effectiveDragCoefficient_CIH: 1.0,
    density_delta1_kg_m3: 900,
    effectiveDragCoefficient_CIL: 1.4,
    density_delta2_kg_m3: 900,
  },
];

export const TABLE_A14_ICE_DRAG_AND_DENSITY = TABLE_A14_ROWS;
