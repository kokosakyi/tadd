/**
 * CSA C22.3 No. 1 — Table 16
 * "Minimum design clearances between conductors of one line and supporting structures of another line"
 * (See Clause 5.8.3.1.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 93 (PDF Page 98)
 *   - Clause 5.8.3, Page 45 (PDF Page 50)
 *
 * All clearances in MILLIMETRES (mm).
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_16_META = {
  id: 'csa-c22.3-no1/table16',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum design clearances between conductors of one line and supporting structures of another line',
  unit: 'mm',
  references: ['5.8.3.1', '5.8.3.2', '5.8.3.3', '5.2.7'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'Communication conductors are assumed to operate at less than 130 V dc at 0.25 A or less per pair (1500 pairs or fewer).',
  },
  clauses: {
    '5.8.3.1': {
      title: 'Basic clearances',
      text:
        'The minimum clearances in any direction between conductors of one line and supporting structures of another line, where conductors of the first line are not attached to the supporting structure of the second line, shall be as specified in Table 16. The clearances shall apply for the more applicable of the following conditions:\n' +
        'a) the conductor is at its maximum sag condition; and\n' +
        'b) the conductor is in a position of swing, as specified in Clause 5.2.7.',
    },
    '5.8.3.2': {
      title: 'Climbing space and working space',
      text: 'The climbing space (see Clause 4.1.4) and working space (see Clause 4.1.5) on a structure of one line shall not be reduced by a conductor of another line.',
    },
    '5.8.3.3': {
      title: 'Joint-use common structure',
      text: 'Where communication circuits are in joint use with supply conductors rated up to 50 kV, midspan structures that support only the communication conductors shall be avoided. To ensure adequate clearances are maintained, the supply conductors and communication facilities shall be attached to the common structure.',
    },
  },
};

export const TABLE_16_ROWS = [
  {
    voltageClass: '0–5 kV',
    vMinKv: 0,
    vMaxKv: 5,
    standardClearance_mm: 1000,
    practicableRule: '1000 wherever practicable, but in no case less than the span-dependent absolute minimums below:',
    spanMinimums: [
      { spanRange: '0–6 m', spanMinM: 0, spanMaxM: 6, absoluteMinClearance_mm: 150 },
      { spanRange: '> 6 and ≤ 15 m', spanMinM: 6, spanMaxM: 15, absoluteMinClearance_mm: 230 },
      { spanRange: '> 15 m', spanMinM: 15, spanMaxM: null, absoluteMinClearance_mm: 300 },
    ],
  },
  {
    voltageClass: '> 5 and ≤ 22 kV',
    vMinKv: 5,
    vMaxKv: 22,
    standardClearance_mm: 1000,
    practicableRule: '1000 wherever practicable, but in no case less than 500 mm',
    absoluteMinClearance_mm: 500,
  },
  {
    voltageClass: '> 22 and ≤ 50 kV',
    vMinKv: 22,
    vMaxKv: 50,
    standardClearance_mm: 1000,
    absoluteMinClearance_mm: 1000,
  },
  {
    voltageClass: '> 50 kV',
    vMinKv: 50,
    vMaxKv: null,
    baseClearance_mm: 1000,
    adderPerKv: 10,
    thresholdKv: 50,
    standardClearanceFormula: '1000 + 10 mm/kV over 50 kV',
  },
];
