/**
 * CSA C22.3 No. 1 — Table 9
 * "Minimum design clearances from wires and conductors not attached to buildings, signs, and similar plant"
 * (See Clauses 5.7.3.1 to 5.7.3.3.)
 *
 * Transcribed from:
 *   - sandbox/csa c22 no 1/Table 9/Table 9.png
 *   - sandbox/csa c22 no 1/Table 9/Cl 5.7.3.1_5.7.3.2_5.7.3.3.png
 *
 * All clearances in METRES.
 * Note: Voltages are rms line-to-ground.
 *
 * This file is DATA ONLY. Evaluation and resolution logic live in src/utils/csaTable9Resolver.js.
 */

export const TABLE_9_META = {
  id: 'csa-c22.3-no1/table9',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum design clearances from wires and conductors not attached to buildings, signs, and similar plant',
  unit: 'm',
  references: ['5.7.3.1', '5.7.3.2', '5.7.3.3', '5.2.7', 'Tables 2 & 4'],
  notes: {
    voltage: 'Voltages are rms line-to-ground.',
    footnoteStar:
      'Clearances over or adjacent to portions of a building normally traversed by persons or vehicles are specified in Tables 2 and 4.',
    footnoteDagger:
      'Clearances are applicable to non-metallic buildings or buildings whose metallic parts are effectively grounded. For other buildings, an assessment might be needed to determine additional clearances for electrostatic induction (see Clause 5.7.3.3).',
    footnoteDoubleDagger:
      'Conductor swing shall be added to these values in accordance with Clause 5.7.3.1.',
    footnoteSection:
      'This clearance may be reduced to 1 m for portions of the building considered normally inaccessible.',
    footnoteDoubleStar:
      'Conductors of these voltage classes should not be carried over buildings where other suitable construction can be used.',
    footnoteDoubleDaggerDagger:
      'Where it is necessary to carry conductors of these voltage classes over buildings, it should be determined whether additional measures, including increased clearances, are needed to ensure that the crossed-over buildings can be used safely and effectively.',
    footnoteDoubleDoubleDagger:
      'This value may be reduced to 1.5 m where the building does not have fire escapes, balconies, and windows that can be opened adjacent to the conductor.',
  },
  clauses: {
    '5.7.3': 'Clearances of wires and conductors passing by or over buildings, signs, billboards, lamps, traffic signs, standards, and antennas (not attached)',
    '5.7.3.1': {
      title: 'Basic clearances',
      text: 'The minimum horizontal and vertical clearances from wires and conductors to buildings, signs, and similar plant specified in Table 9 shall apply under the following conditions:\n' +
        'a) clearances shall apply to any part of a building, including balconies, fire escapes, antennas and their supporting structures, and other permanent fixtures;\n' +
        'b) vertical clearances shall apply under conditions of maximum sag of the wire or conductor;\n' +
        'c) horizontal clearances shall apply when the wire or conductor is in the position of swing, as determined in accordance with Clause 5.2.7; and\n' +
        'd) guy wires, communication cables, and drop wires shall not be allowed to rub against buildings or other plant.',
    },
    '5.7.3.2': {
      title: 'Application of clearances',
      text: 'Note: In this Clause, the word "building" is used to refer to any of the plant specified in Clause 5.7.3.1.\n' +
        'The minimum required vertical clearance at any given point on a building shall apply when the wire or conductor is above that point and closer horizontally than the specified minimum horizontal clearance.\n' +
        'The minimum required horizontal clearance shall apply when the wire or conductor is closer vertically to the point in question than the specified minimum vertical clearance.\n' +
        'The vertical clearance from a wire passing under a building projection to the nearest point of that projection shall be not less than the horizontal clearance requirement.\n' +
        'Furthermore, the minimum clearances specified in this Clause shall apply to all points on the wire or conductor and all points on the building.\n' +
        'Where buildings contain flammable materials or explosives, the need for additional clearances shall be investigated.\n' +
        'When clearances as specified in Table 9 are applied, allowance shall be made for the swing of the sign or similar plant.',
    },
    '5.7.3.3': {
      title: 'Conductors energized above 200 kV',
      text: 'When buildings are located adjacent to a transmission corridor with lines operating above 200 kV, a study shall be conducted to determine suitable clearances between conductors and buildings greater than those specified in Table 9, taking into account electrostatic induction. In these situations, additional measures might be necessary to mitigate the effects of electrostatic induction on the building, its occupants, or construction and maintenance personnel. Measures that may be taken include\n' +
        'a) change in conductor height;\n' +
        'b) increased right-of-way width;\n' +
        'c) installation of shielding between the transmission line and buildings constructed at the edge of the right-of-way;\n' +
        'd) modification of the building configuration; or\n' +
        'e) grounding of metallic objects.\n' +
        'Note: The list in this Clause is not comprehensive.',
    },
    '5.2.7': {
      title: 'Wire or conductor swing for horizontal design clearances',
      text: 'Where specified horizontal clearances are required by this Standard to include an allowance for the swing of conductors, the deviation of the conductor shall be calculated as follows:\n' +
        'a) In exposed and open terrain, the horizontal deviation of the wire or conductor from its position at rest shall be as specified in Table 1.\n' +
        'b) In locations where the span of wire or conductor is partly sheltered from the full effect of transverse winds by buildings or other construction, as in built-up commercial or residential areas, the horizontal deviation of the wire or conductor from its position at rest shall be as specified in Table 1.\n' +
        'c) Where wires or conductors are fully sheltered from transverse wind loads that could cause them to swing, such as along narrow urban streets or lanes and between buildings that reach at least the height of the conductor or wire on both sides, no allowance is required for horizontal deviation.\n' +
        'd) For the purpose of determining wire or conductor swing, the sag at the point under consideration shall be taken as the final unloaded sag at a conductor temperature of 40 °C or, alternatively, the 2.5% July design temperature (as specified in the National Building Code of Canada) applicable to the area under consideration. The 2.5% July design temperature is the temperature at or above which 2.5% of the July hourly ambient temperature occurs.\n' +
        'e) Where suspension insulators that are not restrained from swinging transversely are used, the length of the insulator string shall be added to the conductor sag for the purpose of determining the sag used in Table 1.',
    },
  },
};

/**
 * Plant / Target Categories and Clearance Column Dimensions (Table 9 columns)
 */
export const TABLE_9_TARGET_CATEGORIES = [
  {
    id: 'buildings',
    label: 'To buildings',
    description: 'Clearance to buildings (footnotes * and † apply)',
    columns: [
      {
        id: 'buildings_horizontal',
        dimension: 'horizontal',
        label: 'Horizontal to surface',
        description: 'Horizontal clearance to building surface (conductor swing applied per Clause 5.7.3.1/5.2.7)',
      },
      {
        id: 'buildings_vertical',
        dimension: 'vertical',
        label: 'Vertical to surface',
        description: 'Vertical clearance to building surface (evaluated at max sag per Clause 5.7.3.1)',
      },
    ],
  },
  {
    id: 'signs_and_plant',
    label: 'To signs, billboards, lamp and traffic sign standards, and similar plant',
    description: 'Clearance to signs, billboards, lamp and traffic sign standards, and similar plant',
    columns: [
      {
        id: 'signs_horizontal',
        dimension: 'horizontal',
        label: 'Horizontal to object',
        description: 'Horizontal clearance to sign/object (conductor swing and sign swing applied per Clauses 5.7.3.1 and 5.7.3.2)',
      },
      {
        id: 'signs_vertical',
        dimension: 'vertical',
        label: 'Vertical to object',
        description: 'Vertical clearance to sign/object (evaluated at max sag per Clause 5.7.3.1)',
      },
    ],
  },
];

/**
 * Table 9 Rows (Wire or conductor classifications)
 */
export const TABLE_9_ROWS = [
  // Row 1: Guys, communication cables, and drop wires
  {
    id: 'guys_comm_drop',
    group: 'communication_and_guys',
    label: 'Guys, communication cables, and drop wires',
    description: 'Guys, communication cables, and drop wires (Clause 5.7.3.1(d): shall not rub against buildings or other plant)',
    voltageRange: 'N/A',
    vLgKv: { minInclusive: 0, maxInclusive: 0 },
    clearances: {
      buildings_horizontal: 0,
      buildings_vertical: 0.08,
      signs_horizontal: 0,
      signs_vertical: 0.08,
    },
    prohibitRubbing: true, // Clause 5.7.3.1(d)
  },

  // Row 2: Supply conductors 0–750 V: Insulated or grounded
  {
    id: 'supply_0_750v_insulated_grounded',
    group: 'supply',
    voltageRange: '0–750 V',
    vLgKv: { minInclusive: 0, maxInclusive: 0.75 },
    conductorCondition: 'Insulated or grounded',
    label: '0–750 V — Insulated or grounded',
    description: 'Supply conductors 0–750 V, insulated or grounded',
    clearances: {
      buildings_horizontal: 1.0,
      buildings_vertical: 2.5, // reducible to 1.0 m if normally inaccessible (§)
      signs_horizontal: 0.3,
      signs_vertical: 0.5,
    },
    reducibleVerticalInaccessibleClearance: 1.0, // footnote §
  },

  // Row 3: Supply conductors 0–750 V: Enclosed in effectively grounded metallic sheath
  {
    id: 'supply_0_750v_grounded_metallic_sheath',
    group: 'supply',
    voltageRange: '0–750 V',
    vLgKv: { minInclusive: 0, maxInclusive: 0.75 },
    conductorCondition: 'Enclosed in effectively grounded metallic sheath',
    label: '0–750 V — Enclosed in effectively grounded metallic sheath',
    description: 'Supply conductors 0–750 V, enclosed in effectively grounded metallic sheath',
    clearances: {
      buildings_horizontal: 0,
      buildings_vertical: 0,
      signs_horizontal: 0,
      signs_vertical: 0.08,
    },
  },

  // Row 4: Supply conductors 0–750 V: Not insulated, grounded, or enclosed in effectively grounded metallic sheath
  {
    id: 'supply_0_750v_bare_open',
    group: 'supply',
    voltageRange: '0–750 V',
    vLgKv: { minInclusive: 0, maxInclusive: 0.75 },
    conductorCondition: 'Not insulated, grounded, or enclosed in effectively grounded metallic sheath',
    label: '0–750 V — Not insulated, grounded, or enclosed in effectively grounded metallic sheath',
    description: 'Supply conductors 0–750 V, open / uninsulated / ungrounded',
    clearances: {
      buildings_horizontal: 1.0,
      buildings_vertical: 2.5, // reducible to 1.0 m if normally inaccessible (§)
      signs_horizontal: 1.0,
      signs_vertical: 0.5,
    },
    reducibleVerticalInaccessibleClearance: 1.0, // footnote §
  },

  // Row 5: Supply conductors > 0.75 kV <= 22 kV: Enclosed in effectively grounded metallic sheath
  {
    id: 'supply_0_75_to_22kv_grounded_metallic_sheath',
    group: 'supply',
    voltageRange: '> 0.75 kV ≤ 22 kV',
    vLgKv: { minExclusive: 0.75, maxInclusive: 22 },
    conductorCondition: 'Enclosed in effectively grounded metallic sheath',
    label: '> 0.75 kV ≤ 22 kV — Enclosed in effectively grounded metallic sheath',
    description: 'Supply conductors > 0.75 kV ≤ 22 kV, enclosed in effectively grounded metallic sheath',
    clearances: {
      buildings_horizontal: 0,
      buildings_vertical: 0,
      signs_horizontal: 0,
      signs_vertical: 0.08,
    },
  },

  // Row 6: Supply conductors > 0.75 kV <= 22 kV: Not enclosed in effectively grounded metallic sheath
  {
    id: 'supply_0_75_to_22kv_not_sheathed',
    group: 'supply',
    voltageRange: '> 0.75 kV ≤ 22 kV',
    vLgKv: { minExclusive: 0.75, maxInclusive: 22 },
    conductorCondition: 'Not enclosed in effectively grounded metallic sheath',
    label: '> 0.75 kV ≤ 22 kV — Not enclosed in effectively grounded metallic sheath',
    description: 'Supply conductors > 0.75 kV ≤ 22 kV, open / not enclosed in metallic sheath',
    clearances: {
      buildings_horizontal: 2.0, // reducible to 1.5 m if no fire escapes, balconies, openable windows (‡‡)
      buildings_vertical: 3.0, // footnote ** applies
      signs_horizontal: 2.0,
      signs_vertical: 2.5,
    },
    reducibleHorizontalClearance: 1.5, // footnote ‡‡
    advisoryNotCarriedOverBuildings: true, // footnote **
  },

  // Row 7: Supply conductors > 22 kV
  {
    id: 'supply_over_22kv',
    group: 'supply',
    voltageRange: '> 22 kV',
    vLgKv: { minExclusive: 22 },
    conductorCondition: '—',
    label: '> 22 kV',
    description: 'Supply conductors > 22 kV (0.01 m/kV voltage adder over 22 kV applies to all 4 columns)',
    clearances: {
      buildings_horizontal: 2.0,
      buildings_vertical: 3.6,
      signs_horizontal: 2.0,
      signs_vertical: 3.6,
    },
    voltageIncrementPerKvOver22: 0.01, // 0.01 m/kV over 22 kV for all columns
    advisoryNotCarriedOverBuildings: true, // footnote **
    requiresCrossOverSafetyAssessment: true, // footnote ††
  },
];
