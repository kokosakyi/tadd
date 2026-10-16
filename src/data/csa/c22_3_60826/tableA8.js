/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.8
 * "Factors describing wind action depending on terrain category"
 * (See Annex A, Clause A.4.2 and Table 4.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 153 (PDF Page 265)
 */

export const TABLE_A8_META = {
  id: 'csa-c22.3-60826/tableA8',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.4.2 Assessment of meteorological measurements',
  title: 'Factors describing wind action depending on terrain category',
  references: ['6.2.2', '6.2.3', 'A.4.2', 'Table 4', 'Table A.7'],
  iecPage: 153,
  pdfPages: [265],
  notes: {
    powerLawFormula: 'Vz = VR × (z / 10)^α, where z is height above ground (m) and α is the power law exponent in Table A.8.',
  },
  clauses: {
    'A.4.2': {
      title: 'Assessment of meteorological measurements',
      text:
        'If height z (m) differs from 10 m, the variation of wind speed with height z can be derived from the power law Vz = VR (z/10)^α, where α and roughness factor KR are given in Table A.8.',
    },
  },
};

export const TABLE_A8_ROWS = [
  {
    category: 'A',
    roughnessLength_Z0_m: 0.01,
    powerLawExponent_alpha: { min: 0.10, max: 0.12, default: 0.11, display: '0.10 to 0.12' },
    KR: 1.08,
  },
  {
    category: 'B',
    roughnessLength_Z0_m: 0.05,
    powerLawExponent_alpha: { min: 0.16, max: 0.16, default: 0.16, display: '0.16' },
    KR: 1.00,
  },
  {
    category: 'C',
    roughnessLength_Z0_m: 0.30,
    powerLawExponent_alpha: { min: 0.22, max: 0.22, default: 0.22, display: '0.22' },
    KR: 0.85,
  },
  {
    category: 'D',
    roughnessLength_Z0_m: 1.00,
    powerLawExponent_alpha: { min: 0.28, max: 0.28, default: 0.28, display: '0.28' },
    KR: 0.67,
  },
];

export const TABLE_A8_WIND_ACTION_FACTORS = TABLE_A8_ROWS;
