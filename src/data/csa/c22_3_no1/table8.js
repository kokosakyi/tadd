/**
 * CSA C22.3 No. 1 — Table 8
 * "Minimum design clearances of supply conductors attached to buildings"
 * (See Clause 5.7.2.)
 *
 * Transcribed from:
 *   - sandbox/csa c22 no 1/Table 8/Table 8.png
 *   - sandbox/csa c22 no 1/Table 8/Cl 5.7.2.png
 *
 * All clearances in METRES.
 * Note: Voltages are rms line-to-ground.
 *
 * This file is DATA ONLY. Evaluation and calculation logic live in src/utils/csaTable8Resolver.js.
 */

export const TABLE_8_META = {
  id: 'csa-c22.3-no1/table8',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum design clearances of supply conductors attached to buildings',
  unit: 'm',
  references: ['5.7.2', '5.7.2.1', '5.7.2.2', '5.2.7'],
  notes: {
    voltage: 'Voltages are rms line-to-ground.',
    generalFootnoteStar:
      'Clearances are applicable to non-metallic buildings or buildings whose metallic parts are effectively grounded. For other buildings, an assessment might be needed to determine additional clearances for electrostatic induction.',
    footnoteDagger:
      'For inaccessible surfaces, this value may be reduced to 0.08 m. At the service attachment point, this value may be further reduced to 0.02 m.',
    footnoteDoubleDagger:
      'This value may be reduced to 1.2 m where the building does not have fire escapes, balconies, and windows that can be opened adjacent to the conductor.',
    footnoteSection:
      'This value may be reduced to 1.5 m where the building does not have fire escapes, balconies, and windows that can be opened adjacent to the conductor.',
    footnoteDoubleStar:
      'Conductors of these voltage classes should not be carried over buildings where other suitable construction can be used.',
    footnoteDoubleDaggerDagger:
      'Where it is necessary to carry conductors of these voltage classes over buildings, it should be determined whether additional measures, including increased clearances, are needed to ensure that the crossed-over buildings can be used safely and appropriately.',
  },
  clauses: {
    '5.7.2': 'Clearances of supply conductors permanently attached to buildings',
    '5.7.2.1':
      'Where the permanent attachment of supply conductors to buildings is necessary (e.g., for a service conductor), the minimum clearance of conductors from the surface of buildings as specified in Table 8 shall apply under the following conditions: a) vertical clearances shall apply under conditions of maximum sag of the conductor; and b) horizontal clearances shall apply where the conductor is in the position of swing, as determined in accordance with Clause 5.2.7.',
    '5.7.2.2':
      "The point of attachment for supply conductors shall be on the same side of the building as the consumer's service head and shall be located such that a) the point of emergence of consumer's service conductors from the consumer's service head or the equivalent is a minimum of 150 mm and a maximum of 300 mm above the support for attachment of the overhead service conductors; and b) a minimum of 150 mm and a maximum of 300 mm horizontally from the consumer's service head.",
  },
};

/**
 * Clearance surface types (Table 8 columns)
 */
export const TABLE_8_SURFACE_TYPES = [
  {
    id: 'horizontal_to_surface',
    label: 'Horizontal to surface',
    description: 'Horizontal clearance to building surface (evaluated at swing per Clause 5.2.7)',
    orientation: 'horizontal',
  },
  {
    id: 'vertical_normally_inaccessible',
    label: 'Vertical to normally inaccessible surface',
    description: 'Vertical clearance to normally inaccessible surface (evaluated at max sag)',
    orientation: 'vertical',
  },
  {
    id: 'vertical_readily_accessible',
    label: 'Vertical to readily accessible surface',
    description: 'Vertical clearance to readily accessible surface (evaluated at max sag)',
    orientation: 'vertical',
  },
];

/**
 * Conductor category rows in Table 8
 */
export const TABLE_8_ROWS = [
  // Row 1: 0–750 V, Insulated or grounded
  {
    id: 'supply_0_750v_insulated_grounded',
    voltageRange: '0–750 V',
    vLgKv: { minInclusive: 0, maxInclusive: 0.75 },
    conductorCondition: 'Insulated or grounded',
    label: '0–750 V — Insulated or grounded',
    description: 'Conductor attached to building: 0–750 V, insulated or grounded',
    clearances: {
      horizontal_to_surface: 1.0, // footnote † applies
      vertical_normally_inaccessible: 1.0,
      vertical_readily_accessible: 2.5,
    },
    allowsInaccessibleReductionTo0_08m: true, // footnote †
    allowsServiceAttachmentPointReductionTo0_02m: true, // footnote †
  },
  // Row 2: 0–750 V, Enclosed in effectively grounded metallic sheath
  {
    id: 'supply_0_750v_grounded_metallic_sheath',
    voltageRange: '0–750 V',
    vLgKv: { minInclusive: 0, maxInclusive: 0.75 },
    conductorCondition: 'Enclosed in effectively grounded metallic sheath',
    label: '0–750 V — Enclosed in effectively grounded metallic sheath',
    description: 'Conductor attached to building: 0–750 V, enclosed in effectively grounded metallic sheath',
    clearances: {
      horizontal_to_surface: 0,
      vertical_normally_inaccessible: 0,
      vertical_readily_accessible: 0,
    },
  },
  // Row 3: 0–750 V, Not insulated, grounded, nor enclosed in effectively grounded metallic sheath
  {
    id: 'supply_0_750v_bare_open',
    voltageRange: '0–750 V',
    vLgKv: { minInclusive: 0, maxInclusive: 0.75 },
    conductorCondition: 'Not insulated, grounded, nor enclosed in effectively grounded metallic sheath',
    label: '0–750 V — Not insulated, grounded, nor enclosed in effectively grounded metallic sheath',
    description: 'Conductor attached to building: 0–750 V, open / uninsulated',
    clearances: {
      horizontal_to_surface: 1.0, // footnote † applies
      vertical_normally_inaccessible: 1.0,
      vertical_readily_accessible: 2.5,
    },
    allowsInaccessibleReductionTo0_08m: true, // footnote †
    allowsServiceAttachmentPointReductionTo0_02m: true, // footnote †
  },
  // Row 4: > 0.75 kV <= 5 kV, Enclosed in effectively grounded metallic sheath
  {
    id: 'supply_0_75_to_5kv_grounded_metallic_sheath',
    voltageRange: '> 0.75 kV ≤ 5 kV',
    vLgKv: { minExclusive: 0.75, maxInclusive: 5 },
    conductorCondition: 'Enclosed in effectively grounded metallic sheath',
    label: '> 0.75 kV ≤ 5 kV — Enclosed in effectively grounded metallic sheath',
    description: 'Conductor attached to building: > 0.75 kV ≤ 5 kV, enclosed in effectively grounded metallic sheath',
    clearances: {
      horizontal_to_surface: 0,
      vertical_normally_inaccessible: 0,
      vertical_readily_accessible: 0,
    },
  },
  // Row 5: > 0.75 kV <= 5 kV, Not enclosed in effectively grounded metallic sheath
  {
    id: 'supply_0_75_to_5kv_not_sheathed',
    voltageRange: '> 0.75 kV ≤ 5 kV',
    vLgKv: { minExclusive: 0.75, maxInclusive: 5 },
    conductorCondition: 'Not enclosed in effectively grounded metallic sheath',
    label: '> 0.75 kV ≤ 5 kV — Not enclosed in effectively grounded metallic sheath',
    description: 'Conductor attached to building: > 0.75 kV ≤ 5 kV, not enclosed in effectively grounded metallic sheath',
    clearances: {
      horizontal_to_surface: 2.0, // footnote ‡ applies: reducible to 1.2 m
      vertical_normally_inaccessible: 1.2,
      vertical_readily_accessible: 2.7,
    },
    reducibleHorizontalClearance: 1.2, // footnote ‡: if building does not have fire escapes, balconies, and windows that can be opened adjacent to conductor
  },
  // Row 6: > 5 kV <= 22 kV, Enclosed in effectively grounded metallic sheath
  {
    id: 'supply_5_to_22kv_grounded_metallic_sheath',
    voltageRange: '> 5 kV ≤ 22 kV',
    vLgKv: { minExclusive: 5, maxInclusive: 22 },
    conductorCondition: 'Enclosed in effectively grounded metallic sheath',
    label: '> 5 kV ≤ 22 kV — Enclosed in effectively grounded metallic sheath',
    description: 'Conductor attached to building: > 5 kV ≤ 22 kV, enclosed in effectively grounded metallic sheath',
    clearances: {
      horizontal_to_surface: 0,
      vertical_normally_inaccessible: 0,
      vertical_readily_accessible: 0,
    },
  },
  // Row 7: > 5 kV <= 22 kV, Not enclosed in effectively grounded metallic sheath
  {
    id: 'supply_5_to_22kv_not_sheathed',
    voltageRange: '> 5 kV ≤ 22 kV',
    vLgKv: { minExclusive: 5, maxInclusive: 22 },
    conductorCondition: 'Not enclosed in effectively grounded metallic sheath',
    label: '> 5 kV ≤ 22 kV — Not enclosed in effectively grounded metallic sheath',
    description: 'Conductor attached to building: > 5 kV ≤ 22 kV, not enclosed in effectively grounded metallic sheath',
    clearances: {
      horizontal_to_surface: 2.0, // footnote § applies: reducible to 1.5 m
      vertical_normally_inaccessible: 1.5, // footnote ** applies
      vertical_readily_accessible: 3.0, // footnote ** applies
    },
    reducibleHorizontalClearance: 1.5, // footnote §: if building does not have fire escapes, balconies, and windows that can be opened adjacent to conductor
    advisoryNotCarriedOverBuildings: true, // footnote **
  },
  // Row 8: > 22 kV
  {
    id: 'supply_over_22kv',
    voltageRange: '> 22 kV',
    vLgKv: { minExclusive: 22 },
    conductorCondition: '—',
    label: '> 22 kV',
    description: 'Conductor attached to building: > 22 kV (voltage adder applied over 22 kV)',
    clearances: {
      horizontal_to_surface: 2.0,
      vertical_normally_inaccessible: 3.6,
      vertical_readily_accessible: 3.6,
    },
    voltageIncrementPerKvOver22: 0.01, // 0.01 m/kV over 22 kV
    advisoryNotCarriedOverBuildings: true, // footnote **
    requiresCrossOverSafetyAssessment: true, // footnote ††
  },
];
