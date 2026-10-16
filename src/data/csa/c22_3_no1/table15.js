/**
 * CSA C22.3 No. 1 — Table 15
 * "Clearances between conductors supported by different structures but not crossing each other — Clearance increments to be added to horizontal displacement"
 * (See Clauses 5.8.2 and A.5.8.2.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 93 (PDF Page 98)
 *   - Clause 5.8.2, Page 45 (PDF Page 50)
 *   - Clause A.5.8.2, Page 128 (PDF Page 133)
 *
 * All clearance increments in MILLIMETRES (mm).
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_15_META = {
  id: 'csa-c22.3-no1/table15',
  standard: 'CSA C22.3 No. 1',
  title: 'Clearances between conductors supported by different structures but not crossing each other — Clearance increments to be added to horizontal displacement',
  unit: 'mm',
  references: ['5.8.2', 'A.5.8.2', '5.2.7', 'Table 1'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'Communication conductors are assumed to operate at less than 130 V dc at 0.25 A or less per pair (1500 pairs or fewer).',
  },
  clauses: {
    '5.8.2': {
      title: 'Clearances between conductors supported by different structures but not crossing each other',
      text:
        'Where conductors are supported by different structures but do not cross each other, they shall have\n' +
        'a) a minimum vertical clearance in accordance with Clause 5.8.1; or\n' +
        'b) minimum horizontal clearances with the conductors in the at-rest position that are equal to the sum of the calculated conductor displacement due to a transverse conductor swing plus the appropriate increment from Table 15. This conductor displacement shall be calculated in accordance with the following:\n' +
        '  i) where the conductor of one line is free to swing so that it approaches the conductor of a second line at a point where this conductor is not free to move (e.g., a structure of one line near the midspan position of the second line), the conductor displacement at midspan shall be calculated in accordance with Clause 5.2.7; and\n' +
        '  ii) where lines run alongside each other and the adjacent conductors are free to approach one another, the conductor of the line having the greater sag shall be considered to be displaced one-half the distance calculated in accordance with Clause 5.2.7, and the conductor of the second line shall be considered at rest.',
    },
    'A.5.8.2': {
      title: 'Clearances between conductors supported by different structures but not crossing each other and Table 15',
      text:
        'Provides worked examples showing how horizontal swing deviation from Table 1 is added to the clearance increment from Table 15. The voltage used is the sum of the line-to-ground voltages of both conductors.',
    },
  },
};

export const TABLE_15_ROWS = [
  {
    voltageSum: '0–750 V',
    vSumMinKv: 0,
    vSumMaxKv: 0.75,
    systemType: 'all',
    clearanceIncrement_mm: 300,
    formula: '300 mm',
  },
  {
    voltageSum: '> 750 V ac',
    vSumMinKv: 0.75,
    systemType: 'ac',
    baseIncrement_mm: 300,
    adderPerKv: 10,
    thresholdKv: 0.75,
    clearanceIncrement_mm: '300 + 10 mm/kV over 750 V',
    formula: '300 + 10 * (vSumKv - 0.75)',
  },
  {
    voltageSum: '> 750 V dc',
    vSumMinKv: 0.75,
    systemType: 'dc',
    baseIncrement_mm: 300,
    adderPerKv: 6,
    thresholdKv: 0.75,
    clearanceIncrement_mm: '300 + 6 mm/kV over 750 V',
    formula: '300 + 6 * (vSumKv - 0.75)',
  },
];
