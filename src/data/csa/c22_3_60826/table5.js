/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 5
 * "Correction factor τ of dynamic reference wind pressure q0 due to altitude and temperatures"
 * (See Clause 6.2.5.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 47 (PDF Page 159)
 *   - Canadian Deviation Clause 6.2.5 (PDF Page 14)
 */

export const TABLE_5_META = {
  id: 'csa-c22.3-60826/table5',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '6.2.5 Unit action of the wind speed on any line component or element',
  title: 'Correction factor τ of dynamic reference wind pressure q0 due to altitude and temperatures',
  references: ['6.2.5', '6.4.6.1', 'Table CB.1'],
  iecPage: 47,
  pdfPages: [159],
  notes: {
    note1: 'The reference value (τ = 1.00) corresponds to 0 m altitude and a temperature of 15 °C (air density μ = 1.225 kg/m³ at 101.3 kPa).',
    canadianDeviation:
      'Per Clause 6.2.5 (Canadian Deviation): The air density correction factor shall be 1.04 for wind conditions without ice and 1.1 for combined ice and wind. These factors may also be used for mountainous regions because the reduced temperature compensates for the altitude.',
  },
  clauses: {
    '6.2.5': {
      title: 'Unit action of the wind speed on any line component or element',
      text:
        'q0 = (1/2) μ τ (KR VRB)² where μ = 1.225 kg/m³ at 15 °C and 101.3 kPa at sea level, and τ is the air density correction factor given in Table 5.',
    },
    '6.2.5 (Canadian Deviation)': {
      title: 'Unit action of the wind speed (Canadian Deviation)',
      text:
        'The air density correction factor shall be 1.04 for wind conditions without ice and 1.1 for combined ice and wind. These factors may also be used for mountainous regions because the reduced temperature compensates for the altitude.',
    },
  },
};

export const TABLE_5_ROWS = [
  { temperature_C: 30, altitude_0m: 0.95, altitude_1000m: 0.84, altitude_2000m: 0.75, altitude_3000m: 0.66 },
  { temperature_C: 15, altitude_0m: 1.00, altitude_1000m: 0.89, altitude_2000m: 0.79, altitude_3000m: 0.69 },
  { temperature_C: 0, altitude_0m: 1.04, altitude_1000m: 0.94, altitude_2000m: 0.83, altitude_3000m: 0.73 },
  { temperature_C: -15, altitude_0m: 1.12, altitude_1000m: 0.99, altitude_2000m: 0.88, altitude_3000m: 0.77 },
  { temperature_C: -30, altitude_0m: 1.19, altitude_1000m: 1.05, altitude_2000m: 0.93, altitude_3000m: 0.82 },
];

export const TABLE_5_TAU_CORRECTION_FACTORS = TABLE_5_ROWS;
