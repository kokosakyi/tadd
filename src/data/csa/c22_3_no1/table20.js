/**
 * CSA C22.3 No. 1 — Table 20
 * "Minimum in-span vertical clearances between supply conductors of the same circuit that are attached to the same supporting structure"
 * (See Clause 5.9.2.3.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 96 (PDF Page 101)
 *   - Clause 5.9.2.3, Page 47 (PDF Page 52)
 *   - Clause A.5.9.2.3, Page 129 (PDF Page 134)
 *
 * All clearances in MILLIMETRES (mm).
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_20_META = {
  id: 'csa-c22.3-no1/table20',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum in-span vertical clearances between supply conductors of the same circuit that are attached to the same supporting structure',
  unit: 'mm',
  references: ['5.9.2.3', 'A.5.9.2.3'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
  },
  clauses: {
    '5.9.2.3': {
      title: 'In-span vertical clearances between supply-line conductors of the same circuit',
      text:
        'The minimum in-span vertical clearance between supply-line conductors of the same circuit that are attached to the same supporting structure shall be as specified in Table 20, and shall apply\n' +
        'a) at maximum sag for conductors of the same voltage class;\n' +
        'b) at final unloaded sag at a 40 °C design conductor temperature for neutrals or conductors of 0 to 750 V, which are considered to be of the same circuit of a voltage class other than 0 to 750 V, and are attached below the other circuit conductors; and\n' +
        'c) where the maximum sag of the circuit conductors (other than 0 to 750 V) associated with the neutral (i.e., the circuit phase conductors) is determined by the ice-loading conditions, the conditions for the neutral or conductors of 0 to 750 V shall be the final unloaded sag at a 0 °C design conductor temperature.',
    },
    'A.5.9.2.3': {
      title: 'In-span vertical clearances between supply-line conductors of the same circuit and Table 20',
      text:
        'Conductors of the same voltage class and circuit generally consist of 2- or 3-phase conductors of a primary voltage or 2, 3, or 4 secondary conductors. Their sag at a given time is assumed to be similar. Neutral thermal loading is lower; therefore 40 °C or 0 °C is specified as design condition.',
    },
  },
};

export const TABLE_20_ROWS = [
  { maxVlgKv: 0.75, minClearanceNeutralToCircuit_mm: 100, minClearanceBetweenCircuitConductors_mm: 100 },
  { maxVlgKv: 5, minClearanceNeutralToCircuit_mm: 150, minClearanceBetweenCircuitConductors_mm: 150 },
  { maxVlgKv: 10, minClearanceNeutralToCircuit_mm: 150, minClearanceBetweenCircuitConductors_mm: 250 },
  { maxVlgKv: 15, minClearanceNeutralToCircuit_mm: 250, minClearanceBetweenCircuitConductors_mm: 300 },
  { maxVlgKv: 22, minClearanceNeutralToCircuit_mm: 350, minClearanceBetweenCircuitConductors_mm: 450 },
  { maxVlgKv: 50, minClearanceNeutralToCircuit_mm: 750, minClearanceBetweenCircuitConductors_mm: 900 },
  { maxVlgKv: 90, minClearanceNeutralToCircuit_mm: 1000, minClearanceBetweenCircuitConductors_mm: 1250 },
];
