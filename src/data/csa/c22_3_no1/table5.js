/**
 * CSA C22.3 No. 1 — Table 5
 * "Minimum separations (heights) of supply equipment from ground"
 * (See Clauses 5.3.2.1 and A.5.3.2 and Table 11.)
 *
 * Transcribed from:
 *   - sandbox/csa c22 no 1/Table 5/Table 5.png
 *   - sandbox/csa c22 no 1/Table 5/Cl. 5.3.2.1.png
 *   - sandbox/csa c22 no 1/Table 5/Table 11.png
 *
 * All separations/heights in METRES.
 * Note: Voltages are rms line-to-ground.
 *
 * This file is DATA ONLY. Evaluation and resolution logic live in src/utils/csaTable5Resolver.js.
 */

export const TABLE_5_META = {
  id: 'csa-c22.3-no1/table5',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum separations (heights) of supply equipment from ground',
  unit: 'm',
  references: ['5.3.2.1', 'A.5.3.2', 'Table 11'],
  notes: {
    1: 'Voltages are rms line-to-ground.',
  },
  annexA532: {
    scope: 'Table 5 specifies minimum separations from ground of supply equipment mounted on poles. It does not refer to equipment in an enclosed substation.',
    utilityHeightIncreaseNote: 'The specified separations of supply equipment from ground are minimum values. Utilities may increase the height; especially in areas such as farmyards, where hay racks or equipment of great height are commonly used.',
  },
};

/**
 * Voltage column classifications for Table 5
 */
export const TABLE_5_COLUMNS = [
  {
    id: 'col_0_750v',
    label: '0–750 V',
    vLgKv: { minInclusive: 0, maxInclusive: 0.75 },
  },
  {
    id: 'col_0_75_to_22kv',
    label: '> 0.75 kV ≤ 22 kV',
    vLgKv: { minExclusive: 0.75, maxInclusive: 22 },
  },
  {
    id: 'col_22_to_50kv',
    label: '> 22 kV ≤ 50 kV',
    vLgKv: { minExclusive: 22, maxInclusive: 50 },
  },
  {
    id: 'col_50_to_90kv',
    label: '> 50 kV ≤ 90 kV',
    vLgKv: { minExclusive: 50, maxInclusive: 90 },
  },
];

/**
 * Equipment categories and ground locations specified in Table 5
 */
export const TABLE_5_EQUIPMENT_TYPES = [
  {
    id: 'live_or_ungrounded',
    label: 'Live or exposed current-carrying parts of supply equipment (e.g., cable terminals, arresters, line switches) and ungrounded cases of supply equipment (e.g., transformers, regulators, capacitors)',
    shortLabel: 'Live / exposed current-carrying parts or ungrounded equipment cases',
    examples: ['cable terminals', 'arresters', 'line switches', 'ungrounded transformers', 'ungrounded regulators', 'ungrounded capacitors'],
  },
  {
    id: 'effectively_grounded',
    label: 'Effectively grounded cases of supply equipment (e.g., transformers, regulators, capacitors)',
    shortLabel: 'Effectively grounded supply equipment cases',
    examples: ['grounded transformers', 'grounded regulators', 'grounded capacitors'],
  },
];

export const TABLE_5_LOCATIONS = [
  {
    id: 'pedestrians_only',
    label: 'Areas accessible to pedestrians only',
  },
  {
    id: 'vehicles',
    label: 'Areas likely to be travelled by vehicles',
  },
];

/**
 * Table 5 Rows with mapped minimum separation values in metres
 */
export const TABLE_5_ROWS = [
  {
    id: 'live_pedestrians_only',
    equipmentTypeId: 'live_or_ungrounded',
    locationId: 'pedestrians_only',
    equipmentType: 'Live or exposed current-carrying parts of supply equipment (e.g., cable terminals, arresters, line switches) and ungrounded cases of supply equipment (e.g., transformers, regulators, capacitors)',
    location: 'Areas accessible to pedestrians only',
    separations: {
      col_0_750v: 3.0,
      col_0_75_to_22kv: 3.4,
      col_22_to_50kv: 3.7,
      col_50_to_90kv: 4.0,
    },
  },
  {
    id: 'live_vehicles',
    equipmentTypeId: 'live_or_ungrounded',
    locationId: 'vehicles',
    equipmentType: 'Live or exposed current-carrying parts of supply equipment (e.g., cable terminals, arresters, line switches) and ungrounded cases of supply equipment (e.g., transformers, regulators, capacitors)',
    location: 'Areas likely to be travelled by vehicles',
    separations: {
      col_0_750v: 4.4,
      col_0_75_to_22kv: 4.7,
      col_22_to_50kv: 5.2,
      col_50_to_90kv: 5.5,
    },
  },
  {
    id: 'grounded_pedestrians_only',
    equipmentTypeId: 'effectively_grounded',
    locationId: 'pedestrians_only',
    equipmentType: 'Effectively grounded cases of supply equipment (e.g., transformers, regulators, capacitors)',
    location: 'Areas accessible to pedestrians only',
    separations: {
      col_0_750v: 3.0,
      col_0_75_to_22kv: 3.0,
      col_22_to_50kv: 3.0,
      col_50_to_90kv: 3.0,
    },
  },
  {
    id: 'grounded_vehicles',
    equipmentTypeId: 'effectively_grounded',
    locationId: 'vehicles',
    equipmentType: 'Effectively grounded cases of supply equipment (e.g., transformers, regulators, capacitors)',
    location: 'Areas likely to be travelled by vehicles',
    separations: {
      col_0_750v: 4.4,
      col_0_75_to_22kv: 4.4,
      col_22_to_50kv: 4.4,
      col_50_to_90kv: 4.4,
    },
  },
];
