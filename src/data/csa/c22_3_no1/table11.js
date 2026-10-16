/**
 * CSA C22.3 No. 1 — Table 11
 * "Minimum separation of equipment and clearances of conductors from swimming pools"
 * (See Clauses 5.7.5 and A.5.7.5 and Figure 1.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 88 (PDF Page 93)
 *   - Clause 5.7.5, Page 43 (PDF Page 48)
 *   - Clause A.5.7.5, Page 122 (PDF Page 127)
 *
 * All clearances in METRES.
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_11_META = {
  id: 'csa-c22.3-no1/table11',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum separation of equipment and clearances of conductors from swimming pools',
  unit: 'm',
  references: ['5.7.5', 'A.5.7.5', '5.3.1', '5.3.2', 'Figure 1', 'Table 2', 'Table 4', 'Table 5'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    note2: 'See Figure 1 for an illustration of swimming pool clearance limits.',
    footnoteStar:
      'Supply conductors greater than 150 kV shall not cross over swimming pools or be closer to the edge of a pool than 8.0 m + 0.01 m/kV above 150 kV.',
  },
  voltageAdders: {
    over22kvUpTo150kv: {
      thresholdKv: 22,
      maxKv: 150,
      adderPerKv: 0.010, // +0.01 m/kV above 22 kV
      formula: '6.7 + 0.010 * (vLgKv - 22)',
    },
    over150kvEdgeRestriction: {
      thresholdKv: 150,
      prohibitedOverPool: true,
      minEdgeClearanceFormula: '8.0 + 0.010 * (vLgKv - 150)',
    },
  },
  clauses: {
    '5.7.5': {
      title: 'Minimum separation of equipment and clearances of conductors over and adjacent to swimming pools',
      text:
        'Conductors and equipment shall not be located over or adjacent to a swimming pool unless it is not practical to locate them elsewhere. If equipment and conductors need to pass over a swimming pool or the area surrounding a pool, the minimum clearance of conductors and separation of equipment from swimming pools shall be as specified in Table 11 and as shown in Figure 1.\n' +
        'Conductor sags shall be determined in accordance with Clauses 5.2.5 and 5.2.7 for vertical and swing conditions.',
    },
    'A.5.7.5': {
      title: 'Minimum separation of equipment and clearances of conductors over and adjacent to swimming pools and Table 11',
      text:
        'In general, conductors over swimming pools are undesirable for new construction. However, due to various conditions (e.g., limited lot size), it can be difficult to avoid this situation.\n' +
        'Clearances used in Table 11 have been determined based on the assumption that cleaning tools (up to 4.6 m in length) might be manoeuvred by inexperienced and/or young people.',
    },
  },
};

export const TABLE_11_ROWS = [
  {
    id: 'supply_equipment',
    category: 'Supply equipment',
    dimA_m: 4.6, // Measured in any direction from water level, edge of pool, or diving platform
    dimB_m: 'See Clause 5.3.2 and Table 5', // Measured vertically over land
    description: 'Supply equipment (transformers, regulators, capacitors, switches, etc.)',
  },
  {
    id: 'guys_messengers_communication_secondary',
    category:
      'Guys, messengers, span wires, communication circuits, secondary cable 0–750 V, and multi-grounded neutral conductors',
    dimA_m: 4.6,
    dimB_m: 'See Clause 5.3.1 and Tables 2 and 4',
    description: 'Guys, messengers, span wires, comms, 0-750V secondary cable, MG neutral',
  },
  {
    id: 'supply_conductors_up_to_22kv',
    category: 'Other supply conductors ≤ 22 kV',
    vLgKvMax: 22,
    dimA_m: 6.7,
    dimB_m: 'See Clause 5.3.1 and Tables 2 and 4',
    description: 'Open supply conductors up to 22 kV rms line-to-ground',
  },
  {
    id: 'supply_conductors_22kv_to_150kv',
    category: 'Supply conductors > 22 kV and ≤ 150 kV',
    vLgKvMin: 22,
    vLgKvMax: 150,
    baseDimA_m: 6.7,
    adderPerKv: 0.01,
    dimA_formula: '6.7 + 0.01 m/kV above 22 kV',
    dimB_m: 'See Clause 5.3.1 and Tables 2 and 4',
    description: 'High voltage supply conductors between 22 kV and 150 kV',
  },
  {
    id: 'supply_conductors_over_150kv',
    category: 'Supply conductors > 150 kV',
    vLgKvMin: 150,
    prohibitedOverPool: true,
    dimA_edge_m: '8.0 + 0.01 m/kV above 150 kV',
    dimB_m: 'See Clause 5.3.1 and Tables 2 and 4',
    footnote: 'footnoteStar',
    description: 'EHV conductors > 150 kV (prohibited from crossing over swimming pools; minimum edge distance applies)',
  },
];
