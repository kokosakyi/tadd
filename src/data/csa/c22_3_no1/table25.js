/**
 * CSA C22.3 No. 1 — Table 25
 * "Minimum clearances from guys to plant of another system"
 * (See Clauses 5.11.2.1 and A.5.11.2 and Figure A.8.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 100 (PDF Page 105)
 *   - Clause 5.11.2.1, Page 51 (PDF Page 56)
 *   - Clause A.5.11.2, Page 131 (PDF Page 136)
 *
 * All clearances in METRES.
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_25_META = {
  id: 'csa-c22.3-no1/table25',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum clearances from guys to plant of another system',
  unit: 'm',
  references: ['5.11.2.1', 'A.5.11.2', 'Figure A.8'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
  },
  clauses: {
    '5.11.2.1': {
      title: 'Clearances between guys and plant of another system',
      text: 'The clearance between a guy that is attached to a joint-use structure and plant of another system (not supported by the same joint-use structure) shall be as specified in Table 25. Guys shall not abrade one another.',
    },
    'A.5.11.2': {
      title: 'Guys attached to joint-use structures and Tables 25 and 26',
      text: 'Where one utility places a guy on a joint-use pole for support of its attachments and where the guy runs near other systems not attached to the joint-use pole, the clearances in Table 25 apply, but clearances between this guy and circuits on the same structure are specified in Table 26.',
    },
  },
};

export const TABLE_25_ROWS = [
  {
    plantType: 'Communication line plant',
    clearance_m: 0.6,
  },
  {
    plantType: 'Trolley contact conductors, dc: 0–750 V',
    system: 'dc',
    vMinKv: 0,
    vMaxKv: 0.75,
    clearance_m: 1.2,
  },
  {
    plantType: 'Trolley contact conductors, dc: > 0.75 kV and ≤ 22 kV',
    system: 'dc',
    vMinKv: 0.75,
    vMaxKv: 22,
    clearance_m: 1.8,
  },
  {
    plantType: 'Trolley contact conductors, dc: > 22 kV',
    system: 'dc',
    vMinKv: 22,
    baseClearance_m: 1.8,
    adderPerKv: 0.01,
    thresholdKv: 22,
    formula: '1.8 + 0.01 m/kV over 22 kV',
  },
  {
    plantType: 'Current-carrying supply plant, ac: 0–750 V',
    system: 'ac',
    vMinKv: 0,
    vMaxKv: 0.75,
    clearance_m: 0.6,
  },
  {
    plantType: 'Current-carrying supply plant, ac: > 0.75 kV and ≤ 22 kV',
    system: 'ac',
    vMinKv: 0.75,
    vMaxKv: 22,
    clearance_m: 1.2,
  },
  {
    plantType: 'Current-carrying supply plant, ac: > 22 kV',
    system: 'ac',
    vMinKv: 22,
    baseClearance_m: 1.2,
    adderPerKv: 0.01,
    thresholdKv: 22,
    formula: '1.2 + 0.01 m/kV over 22 kV',
  },
  {
    plantType: 'Supply guy wires and span wires',
    clearance_m: 0.6,
  },
];
