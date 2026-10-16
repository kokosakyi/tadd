/**
 * CSA C22.3 No. 1 — Table 10
 * "Minimum design clearances from supply conductors to bridges"
 * (See Clauses 5.7.4.1 and 5.7.4.2.)
 *
 * Transcribed from:
 *   - sandbox/csa c22 no 1/Table 10/Table 10.png
 *   - sandbox/csa c22 no 1/Table 10/Cl. 5.7.4.2.png
 *   - sandbox/csa c22 no 1/Table 4/Cl 5.7.4.1.png
 *
 * All clearances in METRES.
 * Note: Voltages are rms line-to-ground.
 *
 * This file is DATA ONLY. Evaluation and resolution logic live in src/utils/csaTable10Resolver.js.
 */

export const TABLE_10_META = {
  id: 'csa-c22.3-no1/table10',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum design clearances from supply conductors to bridges',
  unit: 'm',
  references: ['5.7.4', '5.7.4.1', '5.7.4.2', '5.2.7', 'Tables 2 & 4'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    note2: 'Grounding conductors or conductors installed in effectively grounded conduit do not require clearance under a bridge.',
    footnoteStar:
      'Readily accessible portions include portions of a bridge likely to be used by workers and portions readily accessible to the public. Bridge seats of steel bridges supported by masonry, brick, or concrete abutments that need periodic inspection should be considered readily accessible portions. Concrete, brick, or masonry portions that need to be passed by workers so that they can gain access to other areas shall be considered readily accessible portions.',
    footnoteDagger:
      'This clearance may be reduced to 1 m where the portion of the bridge involved is readily accessible to workers but not to the public.',
  },
  voltageAdders: {
    ac: {
      thresholdKv: 50,
      adderPerKv: 0.010, // +0.010 m/kV over 50 kV
      description: 'Clearances required at > 22 and ≤ 50 kV + 0.010 m/kV over 50 kV',
    },
    dc: {
      thresholdKv: 50,
      adderPerKv: 0.005, // +0.005 m/kV over 50 kV
      description: 'Clearances required at > 22 and ≤ 50 kV + 0.005 m/kV over 50 kV',
    },
  },
  clauses: {
    '5.7.4': 'Clearances to bridges',
    '5.7.4.1': {
      title: 'General',
      text:
        'Clause 5.7.4 specifies clearances for supply wires and conductors that are attached to or pass under, over, or near a bridge. Clause 5.7.4 does not cover clearances over a bridge used solely for a railway or over portions of a bridge normally traversed by pedestrians, road vehicles, or trains. Clearances over or adjacent to portions of the bridge that are normally traversed by pedestrians, road vehicles, or trains are specified in Tables 2 and 4.',
    },
    '5.7.4.2': {
      title: 'Basic clearances for supply conductors',
      text:
        'The minimum clearance from supply conductors to bridges as specified in Table 10 shall apply under the following conditions:\n' +
        'a) vertical clearances shall apply under conditions of maximum sag for a conductor above the portion of the bridge involved, and shall apply to the initial sag at the lowest anticipated temperature for the area for a conductor under the portion of the bridge involved; and\n' +
        'b) horizontal clearances shall apply when a wire is in the position of swing, as determined in accordance with Clause 5.2.7.',
    },
  },
};

/**
 * Bridge Accessibility Categories & Column Definitions
 * 8 clearance columns total in Table 10:
 * - Readily accessible portions:
 *   1. Horizontal - Conductor attached to bridge
 *   2. Horizontal - Conductor not attached
 *   3. Vertical - Conductor attached to bridge - Over bridge
 *   4. Vertical - Conductor attached to bridge - Under bridge
 *   5. Vertical - Conductor not attached - Over bridge
 *   6. Vertical - Conductor not attached - Under bridge
 * - Inaccessible portions:
 *   7. Horizontal - Conductor attached to bridge
 *   8. Horizontal - Conductor not attached
 *   9. Vertical - Conductor attached to bridge - Over bridge
 *   10. Vertical - Conductor attached to bridge - Under bridge
 *   11. Vertical - Conductor not attached - Over bridge
 *   12. Vertical - Conductor not attached - Under bridge
 */
export const TABLE_10_COLUMNS = [
  // Readily Accessible Portions
  {
    id: 'accessible_horizontal_attached',
    accessibility: 'readily_accessible',
    orientation: 'horizontal',
    attachment: 'attached',
    position: 'adjacent',
    label: 'Readily accessible — Horizontal (Attached to bridge)',
    description: 'Horizontal clearance to readily accessible portion when conductor is attached to bridge',
    reducibleWorkerOnly: true, // footnote † (can reduce from 1.2 to 1.0 m)
  },
  {
    id: 'accessible_horizontal_not_attached',
    accessibility: 'readily_accessible',
    orientation: 'horizontal',
    attachment: 'not_attached',
    position: 'adjacent',
    label: 'Readily accessible — Horizontal (Conductor not attached)',
    description: 'Horizontal clearance to readily accessible portion when conductor is not attached (swing per Cl. 5.2.7)',
    reducibleWorkerOnly: true, // footnote † (can reduce from 1.2 to 1.0 m)
  },
  {
    id: 'accessible_vertical_attached_over',
    accessibility: 'readily_accessible',
    orientation: 'vertical',
    attachment: 'attached',
    position: 'over_bridge',
    label: 'Readily accessible — Vertical (Attached, Over bridge)',
    description: 'Vertical clearance over readily accessible portion when conductor is attached (evaluated at max sag)',
  },
  {
    id: 'accessible_vertical_attached_under',
    accessibility: 'readily_accessible',
    orientation: 'vertical',
    attachment: 'attached',
    position: 'under_bridge',
    label: 'Readily accessible — Vertical (Attached, Under bridge)',
    description: 'Vertical clearance under readily accessible portion when conductor is attached (evaluated at initial sag at lowest temp)',
  },
  {
    id: 'accessible_vertical_not_attached_over',
    accessibility: 'readily_accessible',
    orientation: 'vertical',
    attachment: 'not_attached',
    position: 'over_bridge',
    label: 'Readily accessible — Vertical (Not attached, Over bridge)',
    description: 'Vertical clearance over readily accessible portion when conductor is not attached (evaluated at max sag)',
  },
  {
    id: 'accessible_vertical_not_attached_under',
    accessibility: 'readily_accessible',
    orientation: 'vertical',
    attachment: 'not_attached',
    position: 'under_bridge',
    label: 'Readily accessible — Vertical (Not attached, Under bridge)',
    description: 'Vertical clearance under readily accessible portion when conductor is not attached (evaluated at initial sag at lowest temp)',
  },

  // Inaccessible Portions
  {
    id: 'inaccessible_horizontal_attached',
    accessibility: 'inaccessible',
    orientation: 'horizontal',
    attachment: 'attached',
    position: 'adjacent',
    label: 'Inaccessible — Horizontal (Attached to bridge)',
    description: 'Horizontal clearance to inaccessible portion when conductor is attached to bridge',
  },
  {
    id: 'inaccessible_horizontal_not_attached',
    accessibility: 'inaccessible',
    orientation: 'horizontal',
    attachment: 'not_attached',
    position: 'adjacent',
    label: 'Inaccessible — Horizontal (Conductor not attached)',
    description: 'Horizontal clearance to inaccessible portion when conductor is not attached (swing per Cl. 5.2.7)',
  },
  {
    id: 'inaccessible_vertical_attached_over',
    accessibility: 'inaccessible',
    orientation: 'vertical',
    attachment: 'attached',
    position: 'over_bridge',
    label: 'Inaccessible — Vertical (Attached, Over bridge)',
    description: 'Vertical clearance over inaccessible portion when conductor is attached (evaluated at max sag)',
  },
  {
    id: 'inaccessible_vertical_attached_under',
    accessibility: 'inaccessible',
    orientation: 'vertical',
    attachment: 'attached',
    position: 'under_bridge',
    label: 'Inaccessible — Vertical (Attached, Under bridge)',
    description: 'Vertical clearance under inaccessible portion when conductor is attached (evaluated at initial sag at lowest temp)',
  },
  {
    id: 'inaccessible_vertical_not_attached_over',
    accessibility: 'inaccessible',
    orientation: 'vertical',
    attachment: 'not_attached',
    position: 'over_bridge',
    label: 'Inaccessible — Vertical (Not attached, Over bridge)',
    description: 'Vertical clearance over inaccessible portion when conductor is not attached (evaluated at max sag)',
  },
  {
    id: 'inaccessible_vertical_not_attached_under',
    accessibility: 'inaccessible',
    orientation: 'vertical',
    attachment: 'not_attached',
    position: 'under_bridge',
    label: 'Inaccessible — Vertical (Not attached, Under bridge)',
    description: 'Vertical clearance under inaccessible portion when conductor is not attached (evaluated at initial sag at lowest temp)',
  },
];

/**
 * Table 10 Rows (Supply conductor voltage classifications)
 */
export const TABLE_10_ROWS = [
  // Row 1: 0–750 V
  {
    id: 'supply_0_750v',
    voltageRange: '0–750 V',
    label: '0–750 V',
    description: 'Supply conductors 0–750 V (rms line-to-ground)',
    vLgKv: { minInclusive: 0, maxInclusive: 0.75 },
    clearances: {
      accessible_horizontal_attached: 1.2, // reducible to 1.0 m if worker-only (†)
      accessible_horizontal_not_attached: 1.2, // reducible to 1.0 m if worker-only (†)
      accessible_vertical_attached_over: 2.5,
      accessible_vertical_attached_under: 0.3,
      accessible_vertical_not_attached_over: 2.5,
      accessible_vertical_not_attached_under: 0.3,

      inaccessible_horizontal_attached: 0.15,
      inaccessible_horizontal_not_attached: 0.3,
      inaccessible_vertical_attached_over: 0.9,
      inaccessible_vertical_attached_under: 1.5,
      inaccessible_vertical_not_attached_over: 2.5,
      inaccessible_vertical_not_attached_under: 0.3,
    },
    reducibleWorkerOnlyClearance: 1.0, // Footnote †
  },

  // Row 2: > 0.75 kV to <= 22 kV
  {
    id: 'supply_0_75_to_22kv',
    voltageRange: '> 0.75 ≤ 22 kV',
    label: '> 0.75 ≤ 22 kV',
    description: 'Supply conductors > 0.75 kV to ≤ 22 kV (rms line-to-ground)',
    vLgKv: { minExclusive: 0.75, maxInclusive: 22 },
    clearances: {
      accessible_horizontal_attached: 1.5,
      accessible_horizontal_not_attached: 1.5,
      accessible_vertical_attached_over: 2.7,
      accessible_vertical_attached_under: 0.9,
      accessible_vertical_not_attached_over: 2.7,
      accessible_vertical_not_attached_under: 0.9,

      inaccessible_horizontal_attached: 0.5,
      inaccessible_horizontal_not_attached: 0.6,
      inaccessible_vertical_attached_over: 1.2,
      inaccessible_vertical_attached_under: 0.5,
      inaccessible_vertical_not_attached_over: 2.7,
      inaccessible_vertical_not_attached_under: 0.9,
    },
  },

  // Row 3: > 22 kV to <= 50 kV
  {
    id: 'supply_22_to_50kv',
    voltageRange: '> 22 ≤ 50 kV',
    label: '> 22 ≤ 50 kV',
    description: 'Supply conductors > 22 kV to ≤ 50 kV (rms line-to-ground)',
    vLgKv: { minExclusive: 22, maxInclusive: 50 },
    clearances: {
      accessible_horizontal_attached: 1.8,
      accessible_horizontal_not_attached: 1.8,
      accessible_vertical_attached_over: 3.0,
      accessible_vertical_attached_under: 1.2,
      accessible_vertical_not_attached_over: 3.0,
      accessible_vertical_not_attached_under: 1.2,

      inaccessible_horizontal_attached: 0.9,
      inaccessible_horizontal_not_attached: 0.9,
      inaccessible_vertical_attached_over: 1.5,
      inaccessible_vertical_attached_under: 0.9,
      inaccessible_vertical_not_attached_over: 3.3,
      inaccessible_vertical_not_attached_under: 1.2,
    },
  },

  // Row 4: > 50 kV AC
  {
    id: 'supply_over_50kv_ac',
    voltageRange: '> 50 kV ac',
    systemType: 'ac',
    label: '> 50 kV ac',
    description: 'Supply conductors > 50 kV ac (Base = Row 3 values + 0.010 m/kV over 50 kV)',
    vLgKv: { minExclusive: 50 },
    baseRowId: 'supply_22_to_50kv',
    adderPerKv: 0.010,
    thresholdKv: 50,
  },

  // Row 5: > 50 kV DC
  {
    id: 'supply_over_50kv_dc',
    voltageRange: '> 50 kV dc',
    systemType: 'dc',
    label: '> 50 kV dc',
    description: 'Supply conductors > 50 kV dc (Base = Row 3 values + 0.005 m/kV over 50 kV)',
    vLgKv: { minExclusive: 50 },
    baseRowId: 'supply_22_to_50kv',
    adderPerKv: 0.005,
    thresholdKv: 50,
  },
];
