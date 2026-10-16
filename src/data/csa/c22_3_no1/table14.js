/**
 * CSA C22.3 No. 1 — Table 14
 * "Minimum vertical clearances for crossings over aerial tramways"
 * (See Clause 5.8.1.1.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 92 (PDF Page 97)
 *   - Clause 5.8.1.1, Page 44 (PDF Page 49)
 *
 * All clearances in METRES.
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_14_META = {
  id: 'csa-c22.3-no1/table14',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum vertical clearances for crossings over aerial tramways',
  unit: 'm',
  references: ['5.8.1.1', '5.7.9'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
  },
  clauses: {
    '5.8.1.1': {
      title: 'Basic clearances',
      text:
        'The minimum vertical clearance between wires or conductors crossing each other and on different structures shall be as specified in Table 13. Table 14 covers the clearances for crossings over aerial tramways, including gondolas, T-bars, and chairlifts.\n' +
        'The clearances specified in Tables 13 and 14 shall apply under the following conditions:\n' +
        'a) the upper wire or conductor is in its maximum sag position; and\n' +
        'b) the lower wire or conductor is assumed to form a straight line between its points of support.',
    },
    '5.7.9': {
      title: 'Clearances for other wire facilities',
      text:
        'The minimum clearance between an aerial tramway, ski tow, T-bar, chairlift, or similar equipment and an overhead power line greater than 750 V, measured horizontally between the vertical planes passing through the closest points of the equipment and the overhead power line, shall be 15 m.',
    },
  },
};

export const TABLE_14_COLUMNS = [
  { id: 'comms', label: 'Communication conductors and cables, span and grounding wires carried aerially' },
  { id: 'ac_0_075', label: '0–750 V ac', vMin: 0, vMax: 0.75 },
  { id: 'ac_075_22', label: '> 0.75 ≤ 22 kV ac', vMin: 0.75, vMax: 22 },
  { id: 'ac_22_50', label: '> 22 ≤ 50 kV ac', vMin: 22, vMax: 50 },
  { id: 'ac_50_90', label: '> 50 ≤ 90 kV ac', vMin: 50, vMax: 90 },
  { id: 'ac_90_120', label: '> 90 ≤ 120 kV ac', vMin: 90, vMax: 120 },
  { id: 'ac_120_150', label: '> 120 ≤ 150 kV ac', vMin: 120, vMax: 150 },
  { id: 'ac_150_190', label: '> 150 ≤ 190 kV ac', vMin: 150, vMax: 190 },
  { id: 'ac_190_220', label: '> 190 ≤ 220 kV ac', vMin: 190, vMax: 220 },
  { id: 'ac_220_320', label: '> 220 ≤ 320 kV ac', vMin: 220, vMax: 320 },
  { id: 'ac_320_425', label: '> 320 ≤ 425 kV ac', vMin: 320, vMax: 425 },
  { id: 'dc_0_100', label: '0–100 kV dc', vMin: 0, vMax: 100 },
];

export const TABLE_14_ROWS = [
  {
    id: 'gondolas_enclosed',
    typeOfPlant: 'Gondolas and similar apparatus providing a roof over passengers',
    clearances_m: {
      comms: 0.15,
      ac_0_075: 0.15,
      ac_075_22: 0.5,
      ac_22_50: 0.8,
      ac_50_90: 1.2,
      ac_90_120: 1.5,
      ac_120_150: 1.8,
      ac_150_190: 2.4,
      ac_190_220: 2.7,
      ac_220_320: 3.9,
      ac_320_425: 4.6,
      dc_0_100: 0.5,
    },
  },
  {
    id: 'chairlifts_tbars_towers',
    typeOfPlant: 'Chairlifts, T-bars, and similar apparatus or towers of any type of aerial tramway',
    clearances_m: {
      comms: 1.7,
      ac_0_075: 1.7,
      ac_075_22: 2.0,
      ac_22_50: 2.3,
      ac_50_90: 2.7,
      ac_90_120: 3.0,
      ac_120_150: 3.4,
      ac_150_190: 3.9,
      ac_190_220: 4.3,
      ac_220_320: 5.4,
      ac_320_425: 6.0,
      dc_0_100: 2.0,
    },
  },
];
