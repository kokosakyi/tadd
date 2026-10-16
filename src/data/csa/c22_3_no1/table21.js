/**
 * CSA C22.3 No. 1 — Table 21
 * "Minimum in-span vertical clearances between supply conductors of different circuits that are attached to the same supporting structure"
 * (See Clause 5.9.2.4.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 97 (PDF Page 102)
 *   - Clause 5.9.2.4, Page 47 (PDF Page 52)
 *   - Clause A.5.9.2.4, Page 129 (PDF Page 134)
 *
 * All clearances in MILLIMETRES (mm).
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_21_META = {
  id: 'csa-c22.3-no1/table21',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum in-span vertical clearances between supply conductors of different circuits that are attached to the same supporting structure',
  unit: 'mm',
  references: ['5.9.2.4', 'A.5.9.2.4'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
  },
  clauses: {
    '5.9.2.4': {
      title: 'In-span vertical clearances between supply-line conductors of different circuits',
      text:
        'The minimum in-span vertical clearance between supply-line conductors of different circuits of the same or different voltage classes and attached to the same supporting structure shall be as specified in Table 21, and shall apply under the following conditions:\n' +
        'a) the upper conductor shall be assumed to be at maximum sag; and\n' +
        'b) the lower conductor shall be assumed to be at initial unloaded sag at the mean annual temperature.',
    },
    'A.5.9.2.4': {
      title: 'In-span vertical clearances between supply-line conductors of different circuits',
      text:
        'Where conductors of one circuit are above those of another, it is reasonable to assume that the two circuits will not be at maximum sag at the same time. Experience suggests that the initial unloaded sag at the mean annual temperature is an appropriate worst-case design condition.',
    },
  },
};

export const TABLE_21_UPPER_VOLTAGE_COLUMNS = [
  { id: 'v_5', label: '5 kV', kv: 5 },
  { id: 'v_10', label: '10 kV', kv: 10 },
  { id: 'v_17', label: '17 kV', kv: 17 },
  { id: 'v_22', label: '22 kV', kv: 22 },
  { id: 'v_30', label: '30 kV', kv: 30 },
  { id: 'v_50', label: '50 kV', kv: 50 },
  { id: 'v_90', label: '90 kV', kv: 90 },
];

export const TABLE_21_ROWS = [
  {
    lowerVlgKv: 0.75,
    clearances_mm: { v_5: 150, v_10: 150, v_17: 250, v_22: 350, v_30: 450, v_50: 750, v_90: 1000 },
  },
  {
    lowerVlgKv: 5,
    clearances_mm: { v_5: 150, v_10: 200, v_17: 250, v_22: 350, v_30: 450, v_50: 750, v_90: 1000 },
  },
  {
    lowerVlgKv: 10,
    clearances_mm: { v_5: null, v_10: 250, v_17: 300, v_22: 400, v_30: 450, v_50: 800, v_90: 1050 },
  },
  {
    lowerVlgKv: 17,
    clearances_mm: { v_5: null, v_10: null, v_17: 300, v_22: 400, v_30: 500, v_50: 800, v_90: 1050 },
  },
  {
    lowerVlgKv: 22,
    clearances_mm: { v_5: null, v_10: null, v_17: null, v_22: 450, v_30: 500, v_50: 800, v_90: 1050 },
  },
  {
    lowerVlgKv: 30,
    clearances_mm: { v_5: null, v_10: null, v_17: null, v_22: null, v_30: 550, v_50: 850, v_90: 1100 },
  },
  {
    lowerVlgKv: 50,
    clearances_mm: { v_5: null, v_10: null, v_17: null, v_22: null, v_30: null, v_50: 900, v_90: 1150 },
  },
  {
    lowerVlgKv: 90,
    clearances_mm: { v_5: null, v_10: null, v_17: null, v_22: null, v_30: null, v_50: null, v_90: 1250 },
  },
];
