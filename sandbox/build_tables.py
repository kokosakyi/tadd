import os

OUT_DIR = 'src/data/csa/c22_3_no1'
SANDBOX_DIR = 'sandbox/csa c22 no 1'

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(SANDBOX_DIR, exist_ok=True)

# -------------------------------------------------------------
# TABLE 11
# -------------------------------------------------------------
t11_js = """/**
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
        'Conductors and equipment shall not be located over or adjacent to a swimming pool unless it is not practical to locate them elsewhere. If equipment and conductors need to pass over a swimming pool or the area surrounding a pool, the minimum clearance of conductors and separation of equipment from swimming pools shall be as specified in Table 11 and as shown in Figure 1.\\n' +
        'Conductor sags shall be determined in accordance with Clauses 5.2.5 and 5.2.7 for vertical and swing conditions.',
    },
    'A.5.7.5': {
      title: 'Minimum separation of equipment and clearances of conductors over and adjacent to swimming pools and Table 11',
      text:
        'In general, conductors over swimming pools are undesirable for new construction. However, due to various conditions (e.g., limited lot size), it can be difficult to avoid this situation.\\n' +
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
"""

with open(f'{OUT_DIR}/table11.js', 'w', encoding='utf-8') as f:
    f.write(t11_js)

# -------------------------------------------------------------
# TABLE 12
# -------------------------------------------------------------
t12_js = """/**
 * CSA C22.3 No. 1 — Table 12
 * "Minimum horizontal separations from supply equipment to buildings"
 * (See Clauses 5.7.6 and A.5.7.6.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 88 (PDF Page 93)
 *   - Clause 5.7.6, Page 43 (PDF Page 48)
 *   - Clause A.5.7.6, Page 122 (PDF Page 127)
 *
 * All separations in METRES.
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_12_META = {
  id: 'csa-c22.3-no1/table12',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum horizontal separations from supply equipment to buildings',
  unit: 'm',
  references: ['5.7.6', 'A.5.7.6'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'Exposed live parts include any parts not effectively grounded.',
    footnoteDagger: 'This equipment shall not be attached in any readily accessible location.',
  },
  clauses: {
    '5.7.6': {
      title: 'Horizontal separations from supply equipment to buildings',
      text:
        'The minimum horizontal separations from supply equipment to buildings shall be as specified in Table 12. The supply equipment shall not inhibit the normal use of balconies, doors, windows, fire escapes, permanent ladders, catwalks, and other such structures.',
    },
    'A.5.7.6': {
      title: 'Horizontal separations from supply equipment to buildings and Table 12',
      text:
        'Horizontal separations for equipment attached to normally inaccessible surfaces of buildings provide a safe flashover distance. The separation for a readily accessible surface, where equipment is not attached to the surface, provides approximately 1 m for the possible reach of a person, plus a voltage increment.',
    },
  },
};

export const TABLE_12_ROWS = [
  {
    voltageClass: '0–750 V',
    equipmentType: 'Effectively grounded equipment',
    equipmentKey: 'effectively_grounded',
    attachedNormallyInaccessible_m: 0,
    attachedReadilyAccessible_m: 0,
    unattachedNormallyInaccessible_m: 0.15,
    unattachedReadilyAccessible_m: 1.0,
  },
  {
    voltageClass: '0–750 V',
    equipmentType: 'Exposed live parts*',
    equipmentKey: 'exposed_live_parts',
    attachedNormallyInaccessible_m: 1.0,
    attachedReadilyAccessible_m: null, // Prohibited (†)
    attachedReadilyAccessibleProhibited: true,
    unattachedNormallyInaccessible_m: 1.0,
    unattachedReadilyAccessible_m: 1.0,
  },
  {
    voltageClass: '> 0.75 kV ≤ 22 kV',
    equipmentType: 'Effectively grounded equipment',
    equipmentKey: 'effectively_grounded',
    attachedNormallyInaccessible_m: 0,
    attachedReadilyAccessible_m: null, // Prohibited (†)
    attachedReadilyAccessibleProhibited: true,
    unattachedNormallyInaccessible_m: 0.15,
    unattachedReadilyAccessible_m: 1.0,
  },
  {
    voltageClass: '> 0.75 kV ≤ 22 kV',
    equipmentType: 'Exposed live parts*',
    equipmentKey: 'exposed_live_parts',
    attachedNormallyInaccessible_m: 1.5,
    attachedReadilyAccessible_m: null, // Prohibited (†)
    attachedReadilyAccessibleProhibited: true,
    unattachedNormallyInaccessible_m: 1.5,
    unattachedReadilyAccessible_m: 2.0,
  },
];
"""

with open(f'{OUT_DIR}/table12.js', 'w', encoding='utf-8') as f:
    f.write(t12_js)

# -------------------------------------------------------------
# TABLE 13
# -------------------------------------------------------------
t13_js = """/**
 * CSA C22.3 No. 1 — Table 13
 * "Minimum design vertical clearances between wires crossing each other and supported by different supporting structures"
 * (See Clauses 5.8.1.1, 5.8.1.2, A.5.8.1, and A.5.8.1.3.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Pages 89-91 (PDF Pages 94-96)
 *   - Clauses 5.8.1.1, 5.8.1.2, 5.8.1.3, Pages 44-45 (PDF Pages 49-50)
 *   - Clause A.5.8.1, Pages 125-128 (PDF Pages 130-133)
 *
 * All clearances in METRES.
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_13_META = {
  id: 'csa-c22.3-no1/table13',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum design vertical clearances between wires crossing each other and supported by different supporting structures',
  unit: 'm',
  references: ['5.8.1.1', '5.8.1.2', '5.8.1.3', 'A.5.8.1', 'A.5.8.1.3', 'Table 14', 'Table 15'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    note2: 'Refer to Clause A.5.8.1 for explanation of the calculation method used to produce the clearance values shown in this Table.',
    note3: 'Refer to Table A.1 for typical nominal system voltages and overvoltage values.',
    footnoteStar:
      'Where the trolley pole is not prevented from de-wiring, the clearance shall be increased so as to maintain the minimum specified clearance between the trolley pole in the de-wired position and the crossing conductor.',
  },
  clauses: {
    '5.8.1.1': {
      title: 'Basic clearances',
      text:
        'The minimum vertical clearance between wires or conductors crossing each other and on different structures shall be as specified in Table 13. Table 14 covers the clearances for crossings over aerial tramways, including gondolas, T-bars, and chairlifts.\\n' +
        'The clearances specified in Tables 13 and 14 shall apply under the following conditions:\\n' +
        'a) the upper wire or conductor is in its maximum sag position; and\\n' +
        'b) the lower wire or conductor is assumed to form a straight line between its points of support.\\n' +
        'Note: This straight line is called the \"line of sight\" of the lower line.',
    },
    '5.8.1.2': {
      title: 'Reduced clearances',
      text:
        'Where the ice- and wind-loaded sag of the lower wire or conductor exceeds 6 m at the point where it crosses under the upper wire or conductor, the clearance in Table 13 may be reduced by one-half the difference between the ice- and wind-loaded sag and 6 m. Particular attention shall be paid to the possibility of sudden ice drop-off, which could cause the lower conductor to jump upwards.',
    },
    '5.8.1.3': {
      title: 'In-span vertical clearances between supply and communication conductors',
      text:
        'Where supply conductors between 0.75 and 22 kV cross communication conductors, a common structure at the point of crossing shall be provided, where practicable, to which the supply and communication conductors shall be attached. Where coordinated electrical protection cannot be achieved, a higher grade of construction shall be used.',
    },
    'A.5.8.1': {
      title: 'Vertical clearances at crossings of line wires and conductors supported by different structures and Table 13',
      text:
        'The calculation method determines switching surge flashover distance plus basic physical buffer under maximum sag of the upper line and line of sight of the lower line. Clearances cover AC vs AC, AC vs DC, and DC vs DC crossings.',
    },
  },
};

export const TABLE_13_UPPER_COLUMNS_AC = [
  { id: 'comms_guys', label: 'Guys, span wires, aerial grounding conductors, and communication wires and cables' },
  { id: 'ac_0_075', label: '0–0.75 kV ac', vMin: 0, vMax: 0.75 },
  { id: 'ac_075_22', label: '> 0.75 ≤ 22 kV ac', vMin: 0.75, vMax: 22 },
  { id: 'ac_22_50', label: '> 22 ≤ 50 kV ac', vMin: 22, vMax: 50 },
  { id: 'ac_50_90', label: '> 50 ≤ 90 kV ac', vMin: 50, vMax: 90 },
  { id: 'ac_90_120', label: '> 90 ≤ 120 kV ac', vMin: 90, vMax: 120 },
  { id: 'ac_120_150', label: '> 120 ≤ 150 kV ac', vMin: 120, vMax: 150 },
  { id: 'ac_150_190', label: '> 150 ≤ 190 kV ac', vMin: 150, vMax: 190 },
  { id: 'ac_190_220', label: '> 190 ≤ 220 kV ac', vMin: 190, vMax: 220 },
  { id: 'ac_220_320', label: '> 220 ≤ 320 kV ac', vMin: 220, vMax: 320 },
  { id: 'ac_320_425', label: '> 320 ≤ 425 kV ac', vMin: 320, vMax: 425 },
];

export const TABLE_13_UPPER_COLUMNS_DC = [
  { id: 'comms_guys', label: 'Guys, span wires, aerial grounding conductors, and communication wires and cables' },
  { id: 'dc_0_100', label: '0–100 kV dc', vMin: 0, vMax: 100 },
  { id: 'dc_100_150', label: '> 100 ≤ 150 kV dc', vMin: 100, vMax: 150 },
  { id: 'dc_150_200', label: '> 150 ≤ 200 kV dc', vMin: 150, vMax: 200 },
  { id: 'dc_200_250', label: '> 200 ≤ 250 kV dc', vMin: 200, vMax: 250 },
  { id: 'dc_250_300', label: '> 250 ≤ 300 kV dc', vMin: 250, vMax: 300 },
  { id: 'dc_300_350', label: '> 300 ≤ 350 kV dc', vMin: 300, vMax: 350 },
  { id: 'dc_350_400', label: '> 350 ≤ 400 kV dc', vMin: 350, vMax: 400 },
  { id: 'dc_400_450', label: '> 400 ≤ 450 kV dc', vMin: 400, vMax: 450 },
  { id: 'dc_450_500', label: '> 450 ≤ 500 kV dc', vMin: 450, vMax: 500 },
];

/**
 * Matrix of clearances when Upper Conductor is AC (Page 89, PDF Page 94)
 */
export const TABLE_13_CROSSINGS_AC_UPPER = [
  {
    lowerType: 'Communication wires and cables',
    clearances_m: {
      comms_guys: 0.2,
      ac_0_075: 0.3,
      ac_075_22: 0.6,
      ac_22_50: 0.9,
      ac_50_90: 1.2,
      ac_90_120: 1.5,
      ac_120_150: 1.8,
      ac_150_190: 2.4,
      ac_190_220: 2.7,
      ac_220_320: 3.9,
      ac_320_425: 4.6,
    },
  },
  {
    lowerType: 'Open supply conductors, ac 0–0.75 kV',
    clearances_m: {
      comms_guys: null,
      ac_0_075: 0.3,
      ac_075_22: 0.3,
      ac_22_50: 0.7,
      ac_50_90: 1.0,
      ac_90_120: 1.2,
      ac_120_150: 1.6,
      ac_150_190: 2.1,
      ac_190_220: 2.6,
      ac_220_320: 3.7,
      ac_320_425: 4.4,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 0.75 ≤ 22 kV',
    clearances_m: {
      comms_guys: null,
      ac_0_075: null,
      ac_075_22: 0.4,
      ac_22_50: 0.8,
      ac_50_90: 1.1,
      ac_90_120: 1.3,
      ac_120_150: 1.7,
      ac_150_190: 2.3,
      ac_190_220: 2.7,
      ac_220_320: 3.8,
      ac_320_425: 4.5,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 22 ≤ 50 kV',
    clearances_m: {
      comms_guys: null,
      ac_0_075: null,
      ac_075_22: null,
      ac_22_50: 0.9,
      ac_50_90: 1.2,
      ac_90_120: 1.4,
      ac_120_150: 1.9,
      ac_150_190: 2.4,
      ac_190_220: 2.8,
      ac_220_320: 3.9,
      ac_320_425: 4.7,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 50 ≤ 90 kV',
    clearances_m: {
      comms_guys: null,
      ac_0_075: null,
      ac_075_22: null,
      ac_22_50: null,
      ac_50_90: 1.3,
      ac_90_120: 1.6,
      ac_120_150: 2.1,
      ac_150_190: 2.6,
      ac_190_220: 3.0,
      ac_220_320: 4.1,
      ac_320_425: 4.9,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 90 ≤ 120 kV',
    clearances_m: {
      comms_guys: null,
      ac_0_075: null,
      ac_075_22: null,
      ac_22_50: null,
      ac_50_90: null,
      ac_90_120: 1.8,
      ac_120_150: 2.2,
      ac_150_190: 2.8,
      ac_190_220: 3.2,
      ac_220_320: 4.3,
      ac_320_425: 5.1,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 120 ≤ 150 kV',
    clearances_m: {
      comms_guys: null,
      ac_0_075: null,
      ac_075_22: null,
      ac_22_50: null,
      ac_50_90: null,
      ac_90_120: null,
      ac_120_150: 2.4,
      ac_150_190: 2.9,
      ac_190_220: 3.4,
      ac_220_320: 4.5,
      ac_320_425: 5.2,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 150 ≤ 190 kV',
    clearances_m: {
      comms_guys: null,
      ac_0_075: null,
      ac_075_22: null,
      ac_22_50: null,
      ac_50_90: null,
      ac_90_120: null,
      ac_120_150: null,
      ac_150_190: 3.2,
      ac_190_220: 3.6,
      ac_220_320: 4.7,
      ac_320_425: 5.4,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 190 ≤ 220 kV',
    clearances_m: {
      comms_guys: null,
      ac_0_075: null,
      ac_075_22: null,
      ac_22_50: null,
      ac_50_90: null,
      ac_90_120: null,
      ac_120_150: null,
      ac_150_190: null,
      ac_190_220: 3.7,
      ac_220_320: 4.8,
      ac_320_425: 5.6,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 220 ≤ 320 kV',
    clearances_m: {
      comms_guys: null,
      ac_0_075: null,
      ac_075_22: null,
      ac_22_50: null,
      ac_50_90: null,
      ac_90_120: null,
      ac_120_150: null,
      ac_150_190: null,
      ac_190_220: null,
      ac_220_320: 5.4,
      ac_320_425: 6.1,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 320 ≤ 425 kV',
    clearances_m: {
      comms_guys: null,
      ac_0_075: null,
      ac_075_22: null,
      ac_22_50: null,
      ac_50_90: null,
      ac_90_120: null,
      ac_120_150: null,
      ac_150_190: null,
      ac_190_220: null,
      ac_220_320: null,
      ac_320_425: 6.7,
    },
  },
  {
    lowerType: 'Guys, span wires, and aerial grounding wires',
    clearances_m: {
      comms_guys: 0.2,
      ac_0_075: 0.2,
      ac_075_22: 0.5,
      ac_22_50: 0.8,
      ac_50_90: 1.2,
      ac_90_120: 1.5,
      ac_120_150: 1.8,
      ac_150_190: 2.4,
      ac_190_220: 2.7,
      ac_220_320: 3.4,
      ac_320_425: 4.6,
    },
  },
];

/**
 * Matrix of clearances when Upper Conductor is DC (Pages 90-91, PDF Pages 95-96)
 */
export const TABLE_13_CROSSINGS_DC_UPPER = [
  {
    lowerType: 'Communication wires and cables',
    clearances_m: {
      comms_guys: 0.2,
      dc_0_100: 0.6,
      dc_100_150: 0.8,
      dc_150_200: 1.1,
      dc_200_250: 1.2,
      dc_250_300: 1.4,
      dc_300_350: 1.7,
      dc_350_400: 1.8,
      dc_400_450: 2.0,
      dc_450_500: 2.2,
    },
  },
  {
    lowerType: 'Open supply conductors, ac 0–0.75 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: 0.3,
      dc_100_150: 0.6,
      dc_150_200: 0.8,
      dc_200_250: 1.0,
      dc_250_300: 1.3,
      dc_300_350: 1.5,
      dc_350_400: 1.7,
      dc_400_450: 2.0,
      dc_450_500: 2.2,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 0.75 ≤ 22 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: 0.5,
      dc_100_150: 0.7,
      dc_150_200: 0.9,
      dc_200_250: 1.1,
      dc_250_300: 1.4,
      dc_300_350: 1.6,
      dc_350_400: 1.8,
      dc_400_450: 2.1,
      dc_450_500: 2.3,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 22 ≤ 50 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: 0.9,
      dc_100_150: 1.0,
      dc_150_200: 1.2,
      dc_200_250: 1.3,
      dc_250_300: 1.5,
      dc_300_350: 1.7,
      dc_350_400: 1.9,
      dc_400_450: 2.2,
      dc_450_500: 2.4,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 50 ≤ 90 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: 1.2,
      dc_100_150: 1.3,
      dc_150_200: 1.4,
      dc_200_250: 1.6,
      dc_250_300: 1.7,
      dc_300_350: 1.9,
      dc_350_400: 2.1,
      dc_400_450: 2.3,
      dc_450_500: 2.5,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 90 ≤ 120 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: 1.4,
      dc_100_150: 1.5,
      dc_150_200: 1.6,
      dc_200_250: 1.8,
      dc_250_300: 1.9,
      dc_300_350: 2.1,
      dc_350_400: 2.2,
      dc_400_450: 2.4,
      dc_450_500: 2.6,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 120 ≤ 150 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: 1.8,
      dc_100_150: 1.9,
      dc_150_200: 2.0,
      dc_200_250: 2.2,
      dc_250_300: 2.3,
      dc_300_350: 2.5,
      dc_350_400: 2.6,
      dc_400_450: 2.8,
      dc_450_500: 2.9,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 150 ≤ 190 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: 2.3,
      dc_100_150: 2.4,
      dc_150_200: 2.6,
      dc_200_250: 2.7,
      dc_250_300: 2.9,
      dc_300_350: 3.0,
      dc_350_400: 3.2,
      dc_400_450: 3.3,
      dc_450_500: 3.5,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 190 ≤ 220 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: 2.8,
      dc_100_150: 2.9,
      dc_150_200: 3.0,
      dc_200_250: 3.2,
      dc_250_300: 3.3,
      dc_300_350: 3.4,
      dc_350_400: 3.6,
      dc_400_450: 3.7,
      dc_450_500: 3.9,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 220 ≤ 320 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: null,
      dc_100_150: 4.0,
      dc_150_200: 4.1,
      dc_200_250: 4.3,
      dc_250_300: 4.4,
      dc_300_350: 4.5,
      dc_350_400: 4.7,
      dc_400_450: 4.8,
      dc_450_500: 5.0,
    },
  },
  {
    lowerType: 'Open supply conductors, ac > 320 ≤ 425 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: null,
      dc_100_150: null,
      dc_150_200: 4.9,
      dc_200_250: 5.0,
      dc_250_300: 5.2,
      dc_300_350: 5.3,
      dc_350_400: 5.4,
      dc_400_450: 5.6,
      dc_450_500: 5.7,
    },
  },
  // Open supply conductors, dc rows (Page 91)
  {
    lowerType: 'Trolley contact conductors*, 0–0.75 kV dc',
    clearances_m: {
      comms_guys: 0.6,
      dc_0_100: 0.9,
      dc_100_150: 1.2,
      dc_150_200: 1.4,
      dc_200_250: 1.5,
      dc_250_300: 1.8,
      dc_300_350: 2.0,
      dc_350_400: 2.1,
      dc_400_450: 2.4,
      dc_450_500: 2.6,
    },
  },
  {
    lowerType: 'Open supply conductors, dc > 0.75–100 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: 0.6,
      dc_100_150: 0.9,
      dc_150_200: 1.1,
      dc_200_250: 1.3,
      dc_250_300: 1.6,
      dc_300_350: 1.8,
      dc_350_400: 2.0,
      dc_400_450: 2.3,
      dc_450_500: 2.5,
    },
  },
  {
    lowerType: 'Open supply conductors, dc > 100 ≤ 150 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: null,
      dc_100_150: 1.0,
      dc_150_200: 1.2,
      dc_200_250: 1.5,
      dc_250_300: 1.7,
      dc_300_350: 1.9,
      dc_350_400: 2.2,
      dc_400_450: 2.4,
      dc_450_500: 2.6,
    },
  },
  {
    lowerType: 'Open supply conductors, dc > 150 ≤ 200 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: null,
      dc_100_150: null,
      dc_150_200: 1.4,
      dc_200_250: 1.6,
      dc_250_300: 1.9,
      dc_300_350: 2.1,
      dc_350_400: 2.3,
      dc_400_450: 2.6,
      dc_450_500: 2.8,
    },
  },
  {
    lowerType: 'Open supply conductors, dc > 200 ≤ 250 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: null,
      dc_100_150: null,
      dc_150_200: null,
      dc_200_250: 1.8,
      dc_250_300: 2.0,
      dc_300_350: 2.2,
      dc_350_400: 2.5,
      dc_400_450: 2.7,
      dc_450_500: 2.9,
    },
  },
  {
    lowerType: 'Open supply conductors, dc > 250 ≤ 300 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: null,
      dc_100_150: null,
      dc_150_200: null,
      dc_200_250: null,
      dc_250_300: 2.2,
      dc_300_350: 2.4,
      dc_350_400: 2.6,
      dc_400_450: 2.9,
      dc_450_500: 3.1,
    },
  },
  {
    lowerType: 'Open supply conductors, dc > 300 ≤ 350 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: null,
      dc_100_150: null,
      dc_150_200: null,
      dc_200_250: null,
      dc_250_300: null,
      dc_300_350: 2.5,
      dc_350_400: 2.8,
      dc_400_450: 3.0,
      dc_450_500: 3.2,
    },
  },
  {
    lowerType: 'Open supply conductors, dc > 350 ≤ 400 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: null,
      dc_100_150: null,
      dc_150_200: null,
      dc_200_250: null,
      dc_250_300: null,
      dc_300_350: null,
      dc_350_400: 2.9,
      dc_400_450: 3.1,
      dc_450_500: 3.3,
    },
  },
  {
    lowerType: 'Open supply conductors, dc > 400 ≤ 450 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: null,
      dc_100_150: null,
      dc_150_200: null,
      dc_200_250: null,
      dc_250_300: null,
      dc_300_350: null,
      dc_350_400: null,
      dc_400_450: 3.3,
      dc_450_500: 3.5,
    },
  },
  {
    lowerType: 'Open supply conductors, dc > 450 ≤ 500 kV',
    clearances_m: {
      comms_guys: null,
      dc_0_100: null,
      dc_100_150: null,
      dc_150_200: null,
      dc_200_250: null,
      dc_250_300: null,
      dc_300_350: null,
      dc_350_400: null,
      dc_400_450: null,
      dc_450_500: 3.7,
    },
  },
  {
    lowerType: 'Guys, span wires, and aerial grounding wires',
    clearances_m: {
      comms_guys: 0.2,
      dc_0_100: 0.5,
      dc_100_150: 0.7,
      dc_150_200: 0.9,
      dc_200_250: 1.1,
      dc_250_300: 1.3,
      dc_300_350: 1.5,
      dc_350_400: 1.7,
      dc_400_450: 1.9,
      dc_450_500: 2.1,
    },
  },
];
"""

with open(f'{OUT_DIR}/table13.js', 'w', encoding='utf-8') as f:
    f.write(t13_js)

# -------------------------------------------------------------
# TABLE 14
# -------------------------------------------------------------
t14_js = """/**
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
        'The minimum vertical clearance between wires or conductors crossing each other and on different structures shall be as specified in Table 13. Table 14 covers the clearances for crossings over aerial tramways, including gondolas, T-bars, and chairlifts.\\n' +
        'The clearances specified in Tables 13 and 14 shall apply under the following conditions:\\n' +
        'a) the upper wire or conductor is in its maximum sag position; and\\n' +
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
"""

with open(f'{OUT_DIR}/table14.js', 'w', encoding='utf-8') as f:
    f.write(t14_js)

# -------------------------------------------------------------
# TABLE 15
# -------------------------------------------------------------
t15_js = """/**
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
        'Where conductors are supported by different structures but do not cross each other, they shall have\\n' +
        'a) a minimum vertical clearance in accordance with Clause 5.8.1; or\\n' +
        'b) minimum horizontal clearances with the conductors in the at-rest position that are equal to the sum of the calculated conductor displacement due to a transverse conductor swing plus the appropriate increment from Table 15. This conductor displacement shall be calculated in accordance with the following:\\n' +
        '  i) where the conductor of one line is free to swing so that it approaches the conductor of a second line at a point where this conductor is not free to move (e.g., a structure of one line near the midspan position of the second line), the conductor displacement at midspan shall be calculated in accordance with Clause 5.2.7; and\\n' +
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
"""

with open(f'{OUT_DIR}/table15.js', 'w', encoding='utf-8') as f:
    f.write(t15_js)

# -------------------------------------------------------------
# TABLE 16
# -------------------------------------------------------------
t16_js = """/**
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
        'The minimum clearances in any direction between conductors of one line and supporting structures of another line, where conductors of the first line are not attached to the supporting structure of the second line, shall be as specified in Table 16. The clearances shall apply for the more applicable of the following conditions:\\n' +
        'a) the conductor is at its maximum sag condition; and\\n' +
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
"""

with open(f'{OUT_DIR}/table16.js', 'w', encoding='utf-8') as f:
    f.write(t16_js)

# -------------------------------------------------------------
# TABLE 17
# -------------------------------------------------------------
t17_js = """/**
 * CSA C22.3 No. 1 — Table 17
 * "Minimum horizontal separations of supply-line conductors attached to the same supporting structure"
 * (See Clauses 5.9.1.1, 5.9.1.2, and 5.9.1.3.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 94 (PDF Page 99)
 *   - Clause 5.9.1, Page 46 (PDF Page 51)
 *
 * All separations in MILLIMETRES (mm).
 * Note: Voltages are line-to-ground unless specified as phase-to-phase / circuit sum.
 */

export const TABLE_17_META = {
  id: 'csa-c22.3-no1/table17',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum horizontal separations of supply-line conductors attached to the same supporting structure',
  unit: 'mm',
  references: ['5.9.1.1', '5.9.1.2', '5.9.1.3'],
  notes: {
    footnoteStar:
      'For spans longer than 450 m, the separation shall be based on best engineering practices, but shall be not less than the separations specified for spans of 450 m.',
    footnoteDagger:
      'Phase-to-phase voltages for the same circuit or the sum of phase-to-ground voltages for different circuits.',
    footnoteDblDagger:
      'There is no minimum separation for conductors of the same polarity in the same circuit.',
  },
  clauses: {
    '5.9.1.1': {
      title: 'General',
      text: 'The minimum separations between supply-line conductors of the same circuit or different circuits that are at the same level or within 45° of the horizontal on the same supporting structure shall be as specified in Table 17.',
    },
    '5.9.1.2': {
      title: 'Voltages applicable to Table 17',
      text:
        'When applying the separations specified in Table 17, voltages shall be\\n' +
        'a) for dc, the voltage differences between the conductors involved;\\n' +
        'b) for ac conductors in the same circuit, normal operating phase-to-phase voltages; and\\n' +
        'c) for ac conductors in two different circuits, the sum of the normal operating phase-to-ground voltages of both circuits.',
    },
    '5.9.1.3': {
      title: 'Suspension insulators',
      text: 'Where suspension insulators are used and are not restrained from swinging transversely, the sags specified in Table 17 shall include the length of the insulator string.',
    },
  },
};

export const TABLE_17_LONG_SPAN_INCREMENTS_DESCRIPTION =
  '300 mm base + the following three increments:\\n' +
  '(a) 3 × the distance (in m) by which the span length exceeds 50 m;\\n' +
  '(b) 83 × the final unloaded sag (in m) at 15 °C conductor temperature for conductor(s) having the greatest sag; and\\n' +
  '(c) 10 mm/kV over 5 kV.';

export const TABLE_17_ROWS = [
  {
    voltageClass: '0–5 kV ac',
    systemType: 'ac',
    vMinKv: 0,
    vMaxKv: 5,
    spansUpTo50m: [
      { spanMinM: 0, spanMaxM: 6, separation_mm: 225 },
      { spanMinM: 6, spanMaxM: 50, separation_mm: 300 },
    ],
    spansOver50mFormula: '300 + 3 * (spanM - 50) + 83 * sag15cM + 10 * Math.max(0, vKv - 5)',
  },
  {
    voltageClass: '> 5 kV ac',
    systemType: 'ac',
    vMinKv: 5,
    vMaxKv: null,
    spansUpTo50mFormula: '300 + 10 mm/kV over 1 kV',
    spansOver50mFormula: '300 + 3 * (spanM - 50) + 83 * sag15cM + 10 * Math.max(0, vKv - 5)',
  },
  {
    voltageClass: '0–750 V dc, same polarity, different circuits',
    systemType: 'dc',
    polarity: 'same',
    spansUpTo50m: [{ spanMinM: 0, spanMaxM: 50, separation_mm: 150 }],
    spansOver50mFormula: '150 + 3 * (spanM - 50) + 83 * sag15cM',
  },
  {
    voltageClass: '0–750 V dc, opposite polarity',
    systemType: 'dc',
    polarity: 'opposite',
    spansUpTo50m: [{ spanMinM: 0, spanMaxM: 50, separation_mm: 300 }],
    spansOver50mFormula: '300 + 3 * (spanM - 50) + 83 * sag15cM',
  },
  {
    voltageClass: '> 0.75 kV and ≤ 22 kV dc, same polarity, different circuits',
    systemType: 'dc',
    polarity: 'same',
    spansUpTo50m: [
      { spanMinM: 0, spanMaxM: 6, separation_mm: 225 },
      { spanMinM: 6, spanMaxM: 50, separation_mm: 300 },
    ],
    spansOver50mFormula: '300 + 3 * (spanM - 50) + 83 * sag15cM',
  },
  {
    voltageClass: '> 0.75 kV and ≤ 22 kV dc, opposite polarity',
    systemType: 'dc',
    polarity: 'opposite',
    spansUpTo50m: [{ spanMinM: 0, spanMaxM: 50, separation_mm: 375 }],
    spansOver50mFormula: '375 + 3 * (spanM - 50) + 83 * sag15cM',
  },
  {
    voltageClass: '> 22 kV dc',
    systemType: 'dc',
    vMinKv: 22,
    spansUpTo50mFormula: '375 + 5 mm/kV over 22 kV',
    spansOver50mFormula: '375 + 5 * (vKv - 22) + 3 * (spanM - 50) + 83 * sag15cM',
  },
];
"""

with open(f'{OUT_DIR}/table17.js', 'w', encoding='utf-8') as f:
    f.write(t17_js)

# -------------------------------------------------------------
# TABLE 18
# -------------------------------------------------------------
t18_js = """/**
 * CSA C22.3 No. 1 — Table 18
 * "Minimum vertical separations between supply-line conductors attached to the same supporting structure, ac"
 * (See Clause 5.9.2.1.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 95 (PDF Page 100)
 *   - Clause 5.9.2.1, Page 47 (PDF Page 52)
 *
 * All separations in METRES.
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_18_META = {
  id: 'csa-c22.3-no1/table18',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum vertical separations between supply-line conductors attached to the same supporting structure, ac',
  unit: 'm',
  references: ['5.9.2.1'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'This category also includes dc.',
    footnoteDagger: 'This value does not apply to conductors on adjacent supports of the same circuit or circuits.',
  },
  clauses: {
    '5.9.2.1': {
      title: 'Minimum vertical separations between supply-line conductors attached to the same supporting structure',
      text:
        'Where supply-line conductors of the same or different voltage classifications are supported by the same structure, but at different levels, the minimum vertical separations shall be as specified in Table 18. Where galloping or ice drop-off are likely to occur, increased separation should be considered to ensure adequate in-span clearance.',
    },
  },
};

export const TABLE_18_HIGHER_LEVEL_COLUMNS = [
  { id: 'col_0_075', label: '0–750 V', vMin: 0, vMax: 0.75 },
  { id: 'col_075_5', label: '> 0.75 kV ≤ 5 kV', vMin: 0.75, vMax: 5 },
  { id: 'col_5_22', label: '> 5 kV ≤ 22 kV', vMin: 5, vMax: 22 },
  { id: 'col_22_50', label: '> 22 kV ≤ 50 kV', vMin: 22, vMax: 50 },
  { id: 'col_50_90', label: '> 50 kV ≤ 90 kV', vMin: 50, vMax: 90 },
];

export const TABLE_18_ROWS = [
  {
    lowerVoltageClass: '0–750 V*',
    vLowerMin: 0,
    vLowerMax: 0.75,
    includesDc: true,
    separations_m: {
      col_0_075: 0.1,
      col_075_5: 0.4,
      col_5_22: 0.4,
      col_22_50: 1.0,
      col_50_90: 1.5,
    },
  },
  {
    lowerVoltageClass: '> 0.75 kV ≤ 5 kV',
    vLowerMin: 0.75,
    vLowerMax: 5,
    separations_m: {
      col_0_075: null,
      col_075_5: 0.4,
      col_5_22: 0.4,
      col_22_50: 1.0,
      col_50_90: 1.5,
    },
  },
  {
    lowerVoltageClass: '> 5 kV ≤ 22 kV',
    vLowerMin: 5,
    vLowerMax: 22,
    separations_m: {
      col_0_075: null,
      col_075_5: null,
      col_5_22: 0.4, // footnote † (does not apply to conductors on adjacent supports of same circuit)
      col_22_50: 1.0,
      col_50_90: 1.5,
    },
  },
  {
    lowerVoltageClass: '> 22 kV ≤ 50 kV',
    vLowerMin: 22,
    vLowerMax: 50,
    separations_m: {
      col_0_075: null,
      col_075_5: null,
      col_5_22: null,
      col_22_50: 1.0, // footnote †
      col_50_90: 1.5,
    },
  },
  {
    lowerVoltageClass: '> 50 kV ≤ 90 kV',
    vLowerMin: 50,
    vLowerMax: 90,
    separations_m: {
      col_0_075: null,
      col_075_5: null,
      col_5_22: null,
      col_22_50: null,
      col_50_90: 1.5, // footnote †
    },
  },
];
"""

with open(f'{OUT_DIR}/table18.js', 'w', encoding='utf-8') as f:
    f.write(t18_js)

# -------------------------------------------------------------
# TABLE 19
# -------------------------------------------------------------
t19_js = """/**
 * CSA C22.3 No. 1 — Table 19
 * "Vertical spacings between supply-line conductors of 0 to 750 V on vertical brackets"
 * (See Clause 5.9.2.2.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 95 (PDF Page 100)
 *   - Clause 5.9.2.2, Page 47 (PDF Page 52)
 *
 * All spacings in MILLIMETRES (mm).
 */

export const TABLE_19_META = {
  id: 'csa-c22.3-no1/table19',
  standard: 'CSA C22.3 No. 1',
  title: 'Vertical spacings between supply-line conductors of 0 to 750 V on vertical brackets',
  unit: 'mm',
  references: ['5.9.2.2'],
  notes: {
    topConductorToCrossarmAbove: 'Minimum vertical spacing between the top conductors on the vertical bracket and the centre of the nearest crossarm above shall be 600 mm.',
  },
  clauses: {
    '5.9.2.2': {
      title: 'Vertical spacings between supply-line conductors of 0 to 750 V on vertical brackets',
      text:
        'The average vertical spacings between supply-line conductors of 0 to 750 V that are supported on vertical brackets shall be not less than those specified in Table 19 and shall apply under the following conditions:\\n' +
        'a) conductors shall be erected and maintained in a manner that prevents in-span contact under normal operating conditions; and\\n' +
        'b) the minimum vertical spacing between the top conductors supported on the vertical bracket and the centre of the nearest crossarm above shall be 600 mm.',
    },
  },
};

export const TABLE_19_ROWS = [
  { maxSpanLengthM: 20, minAverageSpacing_mm: 100 },
  { maxSpanLengthM: 45, minAverageSpacing_mm: 150 },
  { maxSpanLengthM: 60, minAverageSpacing_mm: 200 },
  { maxSpanLengthM: 75, minAverageSpacing_mm: 250 },
];
"""

with open(f'{OUT_DIR}/table19.js', 'w', encoding='utf-8') as f:
    f.write(t19_js)

# -------------------------------------------------------------
# TABLE 20
# -------------------------------------------------------------
t20_js = """/**
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
        'The minimum in-span vertical clearance between supply-line conductors of the same circuit that are attached to the same supporting structure shall be as specified in Table 20, and shall apply\\n' +
        'a) at maximum sag for conductors of the same voltage class;\\n' +
        'b) at final unloaded sag at a 40 °C design conductor temperature for neutrals or conductors of 0 to 750 V, which are considered to be of the same circuit of a voltage class other than 0 to 750 V, and are attached below the other circuit conductors; and\\n' +
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
"""

with open(f'{OUT_DIR}/table20.js', 'w', encoding='utf-8') as f:
    f.write(t20_js)

# -------------------------------------------------------------
# TABLE 21
# -------------------------------------------------------------
t21_js = """/**
 * CSA C22.3 No. 1 — Table 21
 * "Minimum in-span vertical clearances between supply conductors of different circuits that are attached to the same supporting structure"
 * (See Clause 5.9.2.4.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 97 (PDF Page 102)
 *   - Clause 5.9.2.4, Page 47 (PDF Page 52)
 *   - Clause A.5.9.2.4, Page 129 (PDF Page 134)
 *
 * All clearances in MILLIMETRES (mm).
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_21_META = {
  id: 'csa-c22.3-no1/table21',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum in-span vertical clearances between supply conductors of different circuits that are attached to the same supporting structure',
  unit: 'mm',
  references: ['5.9.2.4', 'A.5.9.2.4'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
  },
  clauses: {
    '5.9.2.4': {
      title: 'In-span vertical clearances between supply-line conductors of different circuits',
      text:
        'The minimum in-span vertical clearance between supply-line conductors of different circuits of the same or different voltage classes and attached to the same supporting structure shall be as specified in Table 21, and shall apply under the following conditions:\\n' +
        'a) the upper conductor shall be assumed to be at maximum sag; and\\n' +
        'b) the lower conductor shall be assumed to be at initial unloaded sag at the mean annual temperature.',
    },
    'A.5.9.2.4': {
      title: 'In-span vertical clearances between supply-line conductors of different circuits',
      text:
        'Where conductors of one circuit are above those of another, it is reasonable to assume that the two circuits will not be at maximum sag at the same time. Experience suggests that the initial unloaded sag at the mean annual temperature is an appropriate worst-case design condition.',
    },
  },
};

export const TABLE_21_UPPER_VOLTAGE_COLUMNS = [
  { id: 'v_5', label: '5 kV', kv: 5 },
  { id: 'v_10', label: '10 kV', kv: 10 },
  { id: 'v_17', label: '17 kV', kv: 17 },
  { id: 'v_22', label: '22 kV', kv: 22 },
  { id: 'v_30', label: '30 kV', kv: 30 },
  { id: 'v_50', label: '50 kV', kv: 50 },
  { id: 'v_90', label: '90 kV', kv: 90 },
];

export const TABLE_21_ROWS = [
  {
    lowerVlgKv: 0.75,
    clearances_mm: { v_5: 150, v_10: 150, v_17: 250, v_22: 350, v_30: 450, v_50: 750, v_90: 1000 },
  },
  {
    lowerVlgKv: 5,
    clearances_mm: { v_5: 150, v_10: 200, v_17: 250, v_22: 350, v_30: 450, v_50: 750, v_90: 1000 },
  },
  {
    lowerVlgKv: 10,
    clearances_mm: { v_5: null, v_10: 250, v_17: 300, v_22: 400, v_30: 450, v_50: 800, v_90: 1050 },
  },
  {
    lowerVlgKv: 17,
    clearances_mm: { v_5: null, v_10: null, v_17: 300, v_22: 400, v_30: 500, v_50: 800, v_90: 1050 },
  },
  {
    lowerVlgKv: 22,
    clearances_mm: { v_5: null, v_10: null, v_17: null, v_22: 450, v_30: 500, v_50: 800, v_90: 1050 },
  },
  {
    lowerVlgKv: 30,
    clearances_mm: { v_5: null, v_10: null, v_17: null, v_22: null, v_30: 550, v_50: 850, v_90: 1100 },
  },
  {
    lowerVlgKv: 50,
    clearances_mm: { v_5: null, v_10: null, v_17: null, v_22: null, v_30: null, v_50: 900, v_90: 1150 },
  },
  {
    lowerVlgKv: 90,
    clearances_mm: { v_5: null, v_10: null, v_17: null, v_22: null, v_30: null, v_50: null, v_90: 1250 },
  },
];
"""

with open(f'{OUT_DIR}/table21.js', 'w', encoding='utf-8') as f:
    f.write(t21_js)

# -------------------------------------------------------------
# TABLE 22
# -------------------------------------------------------------
t22_js = """/**
 * CSA C22.3 No. 1 — Table 22
 * "Minimum separations or clearances in any direction from supply conductors to other supply plant attached to the same supporting structure"
 * (See Clauses 5.9.5 and A.5.9.5.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 98 (PDF Page 103)
 *   - Clause 5.9.5, Page 48 (PDF Page 53)
 *   - Clause A.5.9.5, Page 129 (PDF Page 134)
 *
 * All separations in MILLIMETRES (mm).
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_22_META = {
  id: 'csa-c22.3-no1/table22',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum separations or clearances in any direction from supply conductors to other supply plant attached to the same supporting structure',
  unit: 'mm',
  references: ['5.9.5', 'A.5.9.5', '5.2.7', '5.9.1'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'Clearances from connecting wires to switches or arresters may be less than that from line wires to switches or arresters.',
    footnoteDagger: 'For voltages exceeding 50 kV, clearances shall be based on best engineering practices, but shall be not less than the separations specified for 50 kV.',
    footnoteDblDagger: 'Add 10 mm/kV over 22 kV.',
    footnoteSection: 'Add 5 mm/kV over 22 kV.',
    footnoteDblStar: 'This clearance may be reduced to 0 mm for conductors and cables 0–750 V, provided that the conductors are attached to the surface of the structure and grounded or covered by material of adequate insulating and mechanical properties.',
    footnoteDaggerDagger: 'Where this clearance cannot be achieved, adequate insulation shall be applied to the supply conductor.',
    footnoteDoubleDblDagger: 'This clearance shall be increased to 300 mm for voltages 0.75–8 kV for a span wire or span guy wire running parallel to the supply conductor.',
    footnoteDoubleSection: 'The clearance shall be not less than the separations specified in Clause 5.9.1.',
  },
  clauses: {
    '5.9.5': {
      title: 'Separations or clearances in any direction from supply conductors to other supply plant',
      text:
        'The minimum separations or clearances in any direction between supply conductors and other supply plant (e.g., vertical or lateral conductors, guys, and lightning protection wires) shall be as specified in Table 22.\\n' +
        'a) The voltage specified in Table 22 for ac conductors shall be taken as\\n' +
        '  i) the normal operating phase-to-phase voltage of the circuit for conductors of the same circuit; or\\n' +
        '  ii) the sum of the normal operating phase-to-ground voltages of both circuits for conductors of different circuits.\\n' +
        'b) Horizontal clearances shall apply when a conductor or wire is in the position of swing as determined in accordance with Clause 5.2.7.',
    },
    'A.5.9.5': {
      title: 'Table 22 voltage scope',
      text:
        'The highest voltage level in Table 22 is 50 kV, because it is recognized that at higher voltage levels there can be significant differences in switching surge levels, depending on system design. The inclusion of conservative increments above 50 kV could result in clearances that would require structural dimensions greater than those necessary for safe operation.',
    },
  },
};

export const TABLE_22_COLUMNS = [
  { id: 'ac_0_075', label: '0–750 V ac', system: 'ac', vMin: 0, vMax: 0.75 },
  { id: 'ac_075_5', label: '> 0.75 kV ≤ 5 kV ac', system: 'ac', vMin: 0.75, vMax: 5 },
  { id: 'ac_5_22', label: '> 5 kV ≤ 22 kV ac', system: 'ac', vMin: 5, vMax: 22 },
  { id: 'ac_22_50', label: '> 22 kV ≤ 50 kV ac†', system: 'ac', vMin: 22, vMax: 50, adderFormula: '+10 mm/kV over 22 kV' },
  { id: 'dc_0_075', label: '0–750 V dc', system: 'dc', vMin: 0, vMax: 0.75 },
  { id: 'dc_075_22', label: '> 0.75 kV ≤ 22 kV dc', system: 'dc', vMin: 0.75, vMax: 22 },
  { id: 'dc_22_50', label: '> 22 kV ≤ 50 kV dc†', system: 'dc', vMin: 22, vMax: 50, adderFormula: '+5 mm/kV over 22 kV' },
];

export const TABLE_22_ROWS = [
  {
    id: 'lateral_vertical_to_lateral_vertical',
    item: 'Supply lateral, vertical, or line conductors and supply lateral or vertical conductors of the same or different circuits but not connected together',
    clearances_mm: {
      ac_0_075: 75,
      ac_075_5: 100,
      ac_5_22: 300,
      ac_22_50: '300 + 10 mm/kV over 22 kV',
      dc_0_075: 75,
      dc_075_22: 120,
      dc_22_50: '120 + 5 mm/kV over 22 kV',
    },
  },
  {
    id: 'conductors_to_structure_surface_crossarms',
    item: 'Supply lateral, vertical, or line conductors and surface of structure, crossarms, and other non-energized supply plant, including grounding conductors',
    clearances_mm: {
      ac_0_075: 75, // reducible to 0 mm per footnote **
      ac_075_5: 100,
      ac_5_22: 150,
      ac_22_50: '150 + 10 mm/kV over 22 kV',
      dc_0_075: 75,
      dc_075_22: 120,
      dc_22_50: '120 + 5 mm/kV over 22 kV',
    },
    notes: 'For 0-750V, reducible to 0 mm if attached to surface and grounded or insulated.',
  },
  {
    id: 'conductors_to_span_or_guy_wire',
    item: 'Supply lateral, vertical, or line conductors and span or guy wire, except where conductors are supported by the span wire',
    clearances_mm: {
      ac_0_075: 100,
      ac_075_5: 170, // 300 mm if parallel span/guy wire (footnote ‡‡)
      ac_5_22: 380,
      ac_22_50: '380 + 10 mm/kV over 22 kV',
      dc_0_075: 75,
      dc_075_22: 200,
      dc_22_50: '200 + 5 mm/kV over 22 kV',
    },
  },
  {
    id: 'conductor_to_parallel_lightning_wire',
    item: 'Supply-line conductor and lightning protection wire parallel to the line',
    clearances_mm: {
      ac_0_075: 'Clause 5.9.1',
      ac_075_5: 'Clause 5.9.1',
      ac_5_22: 'Clause 5.9.1',
      ac_22_50: 'Clause 5.9.1',
      dc_0_075: 'Clause 5.9.1',
      dc_075_22: 'Clause 5.9.1',
      dc_22_50: 'Clause 5.9.1',
    },
    notes: 'The clearance shall be not less than the separations specified in Clause 5.9.1 / Table 17.',
  },
];
"""

with open(f'{OUT_DIR}/table22.js', 'w', encoding='utf-8') as f:
    f.write(t22_js)

# -------------------------------------------------------------
# TABLE 23
# -------------------------------------------------------------
t23_js = """/**
 * CSA C22.3 No. 1 — Table 23
 * "Minimum vertical separations at a joint-use structure"
 * (See Clauses 5.10.1.1, 5.10.1.6, 5.10.1.7, 5.10.6.2, and A.5.10.1 and Figures A.6 and A.7.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 99 (PDF Page 104)
 *   - Clauses 5.10.1, 5.10.2, 5.10.6, Pages 48-51 (PDF Pages 53-56)
 *   - Clause A.5.10.1, Pages 129-131 (PDF Pages 134-136)
 *
 * All separations in METRES.
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_23_META = {
  id: 'csa-c22.3-no1/table23',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum vertical separations at a joint-use structure',
  unit: 'm',
  references: ['5.10.1.1', '5.10.1.6', '5.10.1.7', '5.10.6.2', 'A.5.10.1', 'Figure A.6', 'Figure A.7'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'For voltages greater than 50 kV, add 0.010 m/kV over 50 kV.',
    footnoteDagger: 'On lateral communication drop wire plant, this separation may be reduced to 0.6 m.',
    footnoteDblDagger: 'See Clause 5.2.6 for requirements for neutral conductors.',
    footnoteSection: 'Option A or Option B shall be selected in accordance with Clauses 5.10.1.6 and 5.10.1.7.',
  },
  clauses: {
    '5.10.1.1': {
      title: 'Normal level arrangement',
      text: 'Vertical separations between supply and communication attachments at a joint-use structure shall comply with Table 23. Greater separation might be necessary in order to meet the clearances in the span specified by Clause 5.10.3.',
    },
    '5.10.1.6': {
      title: 'Option A selection',
      text: 'Option A of Table 23 shall be used except where the conditions of Clause 5.10.1.7 are met.',
    },
    '5.10.1.7': {
      title: 'Option B selection',
      text:
        'Option B of Table 23 may be used, provided that\\n' +
        'a) the supply and communication facilities are owned and operated by the same company, or there is an agreement between the companies involved;\\n' +
        'b) communication workers are trained to work with not more than head and shoulders above the longitudinal communication plant; and\\n' +
        'c) safety measures and precautions are agreed upon.',
    },
    'A.5.10.1': {
      title: 'Joint use workspace and safety space',
      text:
        'Table 23 provides a communication workspace (typically 0.75 m) and communication safety space based on voltage. Neutral conductors require same clearance unless complying with Clause 5.2.6 (0-750V).',
    },
  },
};

export const TABLE_23_VOLTAGE_COLUMNS = [
  { id: 'v_0_075', label: '0–750 V', vMin: 0, vMax: 0.75 },
  { id: 'v_075_22', label: '> 0.75 kV ≤ 22 kV', vMin: 0.75, vMax: 22 },
  { id: 'v_22_50', label: '> 22 kV ≤ 50 kV*', vMin: 22, vMax: 50, adderFormula: '+0.010 m/kV over 50 kV' },
];

export const TABLE_23_ROWS = [
  {
    id: 'live_supply_plant_to_communication',
    between: 'Live or current-carrying supply plant (including neutrals) and communication line plant',
    v_0_075_m: 1.0, // reducible to 0.6 m on lateral drops (†)
    v_075_22_m: 1.2,
    v_22_50_m: 1.5,
    reducibleDropM: 0.6,
  },
  {
    id: 'non_energized_supply_option_a_ungrounded',
    between: 'Non-energized supply plant (excluding luminaire span wire/brackets) and communication line plant — Option A: Ungrounded',
    option: 'A',
    grounding: 'ungrounded',
    v_0_075_m: 1.0,
    v_075_22_m: 1.0,
    v_22_50_m: 1.5,
  },
  {
    id: 'non_energized_supply_option_a_grounded',
    between: 'Non-energized supply plant (excluding luminaire span wire/brackets) and communication line plant — Option A: Effectively grounded',
    option: 'A',
    grounding: 'effectively_grounded',
    v_0_075_m: 0.75,
    v_075_22_m: 0.75,
    v_22_50_m: 1.0,
  },
  {
    id: 'non_energized_supply_option_b_ungrounded',
    between: 'Non-energized supply plant (excluding luminaire span wire/brackets) and communication line plant — Option B: Ungrounded',
    option: 'B',
    grounding: 'ungrounded',
    v_0_075_m: 0.75,
    v_075_22_m: 1.0,
    v_22_50_m: 1.5,
  },
  {
    id: 'non_energized_supply_option_b_grounded',
    between: 'Non-energized supply plant (excluding luminaire span wire/brackets) and communication line plant — Option B: Effectively grounded',
    option: 'B',
    grounding: 'effectively_grounded',
    v_0_075_m: 0.10,
    v_075_22_m: 0.30,
    v_22_50_m: 0.30,
  },
  {
    id: 'trolley_span_wires_to_communication',
    between: 'Trolley span wires or brackets and communication line plant',
    v_0_075_m: 0.30,
    v_075_22_m: null,
    v_22_50_m: null,
  },
  {
    id: 'luminaire_span_wires_ungrounded',
    between: 'Luminaire span wires or brackets and communication line plant — Ungrounded',
    grounding: 'ungrounded',
    v_0_075_m: 1.0,
    v_075_22_m: 1.0,
    v_22_50_m: null,
  },
  {
    id: 'luminaire_span_wires_grounded',
    between: 'Luminaire span wires or brackets and communication line plant — Effectively grounded',
    grounding: 'effectively_grounded',
    v_0_075_m: 0.10,
    v_075_22_m: 0.10,
    v_22_50_m: null,
  },
  {
    id: 'attachment_point_combined_service',
    between: 'Point of attachment of combined communication drop and supply service conductor and communication line plant',
    v_0_075_m: 1.0, // reducible to 0.6 m on drop
    v_075_22_m: null,
    v_22_50_m: null,
  },
  {
    id: 'housing_communication_power_supply',
    between: 'Housing containing communication power supply, compressor dehydrator, or other communication equipment (effectively grounded or insulated) and communication cable',
    v_0_075_m: 0,
    v_075_22_m: null,
    v_22_50_m: null,
  },
];
"""

with open(f'{OUT_DIR}/table23.js', 'w', encoding='utf-8') as f:
    f.write(t23_js)

# -------------------------------------------------------------
# TABLE 24
# -------------------------------------------------------------
t24_js = """/**
 * CSA C22.3 No. 1 — Table 24
 * "Minimum in-span vertical clearances between supply and communication conductors"
 * (See Clauses 5.10.3.2 and A.5.10.3.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 100 (PDF Page 105)
 *   - Clause 5.10.3.2, 5.10.3.3, Page 49-50 (PDF Page 54-55)
 *   - Clause A.5.10.3, Page 131 (PDF Page 136)
 *
 * All clearances in MILLIMETRES (mm).
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_24_META = {
  id: 'csa-c22.3-no1/table24',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum in-span vertical clearances between supply and communication conductors',
  unit: 'mm',
  references: ['5.10.3.2', '5.10.3.3', 'A.5.10.3'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'For effectively grounded neutral, see Clause 5.10.3.3.',
    footnoteDagger:
      'While the use of the design limit of 75 mm can yield a minimum actual clearance of approximately 300 mm under the worst expected conditions, most situations will result in clearances in excess of 600 mm.',
  },
  clauses: {
    '5.10.3.2': {
      title: 'In-span vertical clearances',
      text: 'The minimum in-span vertical clearances between supply conductors and communication wire or cable under the condition of maximum sag in the supply conductors shall be as specified in Table 24.',
    },
    '5.10.3.3': {
      title: 'Multi-grounded neutral requirements',
      text:
        'For effectively grounded neutral conductors of multi-grounded neutral distribution circuits that do not exceed 26 kV and are located 300 mm or more below phase conductors:\\n' +
        'a) on spans ≤ 75 m, minimum separations at the structure shall be adjusted such that the neutral does not fall below the line of sight of the highest communication conductor; and\\n' +
        'b) on spans > 75 m, the common grounded neutral may sag below the line of sight of the communication attachments, provided that it is a minimum of 300 mm above the in-span communication conductors under maximum sag (thermal or winter load) and communication sag at 45 °C.',
    },
    'A.5.10.3': {
      title: 'Table 24 rationale',
      text: 'Table 24 specifies a minimum 75 mm clearance under conditions of maximum sag in the upper conductor with little or no sag in the lower wire. The lower wire can be galloping, so that the highest point in the span is level with the points of support.',
    },
  },
};

export const TABLE_24_ROWS = [
  {
    voltageClass: '0–750 V with thermoplastic weatherproof covering',
    vMinKv: 0,
    vMaxKv: 0.75,
    covering: 'thermoplastic_weatherproof',
    minClearanceAboveLineOfSight_mm: 2,
  },
  {
    voltageClass: '0–750 V with other covering or bare',
    vMinKv: 0,
    vMaxKv: 0.75,
    covering: 'bare_or_other',
    minClearanceAboveLineOfSight_mm: 75,
  },
  {
    voltageClass: '> 0.75 kV and ≤ 15 kV',
    vMinKv: 0.75,
    vMaxKv: 15,
    minClearanceAboveLineOfSight_mm: 300,
  },
  {
    voltageClass: '> 15 kV and ≤ 22 kV',
    vMinKv: 15,
    vMaxKv: 22,
    minClearanceAboveLineOfSight_mm: 380,
  },
  {
    voltageClass: '> 22 kV and ≤ 250 kV',
    vMinKv: 22,
    vMaxKv: 250,
    baseClearance_mm: 380,
    adderPerKv: 10,
    thresholdKv: 22,
    formula: '380 + 10 mm/kV over 22 kV',
  },
];
"""

with open(f'{OUT_DIR}/table24.js', 'w', encoding='utf-8') as f:
    f.write(t24_js)

# -------------------------------------------------------------
# TABLE 25
# -------------------------------------------------------------
t25_js = """/**
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
"""

with open(f'{OUT_DIR}/table25.js', 'w', encoding='utf-8') as f:
    f.write(t25_js)

# -------------------------------------------------------------
# TABLE 26
# -------------------------------------------------------------
t26_js = """/**
 * CSA C22.3 No. 1 — Table 26
 * "Minimum clearance or separation between guys and other plant attached to the joint-use structure"
 * (See Clauses 5.11.2.2 and A.5.11.2 and Figure A.8.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 101 (PDF Page 106)
 *   - Clause 5.11.2.2, Page 51 (PDF Page 56)
 *   - Clause A.5.11.2, Page 131 (PDF Page 136)
 *
 * All clearances in MILLIMETRES (mm).
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_26_META = {
  id: 'csa-c22.3-no1/table26',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum clearance or separation between guys and other plant attached to the joint-use structure',
  unit: 'mm',
  references: ['5.11.2.2', 'A.5.11.2', '5.11.1', 'Figure A.8'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'This clearance may be reduced to 75 mm where adequate insulation is provided.',
  },
  clauses: {
    '5.11.2.2': {
      title: 'Clearances or separations between guys and other plant attached to a joint-use structure',
      text:
        'At any point, with the exception of attachments, the clearance or separation between a guy and other plant attached to a joint-use structure shall be as specified in Table 26. For vertical separations between attachments at joint-use structures, see Clause 5.11.1.',
    },
    'A.5.11.2': {
      title: 'Guys on joint-use structures',
      text: 'Clearances between this guy and circuits on the same structure are specified in Table 26. (See Figure A.8.)',
    },
  },
};

export const TABLE_26_ROWS = [
  {
    plantType: 'Communication line plant',
    notParallel_mm: 150, // reducible to 75 mm with insulation (*)
    parallel_mm: 75,
    insulatedNotParallelReduction_mm: 75,
  },
  {
    plantType: 'Current-carrying supply plant: 0–750 V',
    vMinKv: 0,
    vMaxKv: 0.75,
    notParallel_mm: 150,
    parallel_mm: 150, // reducible to 75 mm with insulation (*)
    insulatedParallelReduction_mm: 75,
  },
  {
    plantType: 'Current-carrying supply plant: > 0.75 kV and ≤ 5 kV',
    vMinKv: 0.75,
    vMaxKv: 5,
    notParallel_mm: 150,
    parallel_mm: 230,
  },
  {
    plantType: 'Current-carrying supply plant: > 5 kV and ≤ 15 kV',
    vMinKv: 5,
    vMaxKv: 15,
    notParallel_mm: 230,
    parallel_mm: 300,
  },
  {
    plantType: 'Current-carrying supply plant: > 15 kV and ≤ 22 kV',
    vMinKv: 15,
    vMaxKv: 22,
    notParallel_mm: 300,
    parallel_mm: 380,
  },
  {
    plantType: 'Current-carrying supply plant: > 22 kV',
    vMinKv: 22,
    notParallelBase_mm: 300,
    notParallelAdderPerKv: 10,
    notParallelFormula: '300 + 10 mm/kV over 22 kV',
    parallelBase_mm: 380,
    parallelAdderPerKv: 10,
    parallelFormula: '380 + 10 mm/kV over 22 kV',
  },
];
"""

with open(f'{OUT_DIR}/table26.js', 'w', encoding='utf-8') as f:
    f.write(t26_js)

# -------------------------------------------------------------
# TABLE 27
# -------------------------------------------------------------
t27_js = """/**
 * CSA C22.3 No. 1 — Table 27
 * "Minimum grades of construction for crossings"
 * (See Clauses 6.3.1, 6.3.2.1, 7.8.1.1, 7.8.2.1, 7.8.2.4, 7.9.1, A.7.8.2, and A.8.1.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 102 (PDF Page 107)
 *   - Clause 6.3.2.1, Page 52 (PDF Page 57)
 *
 * Grades of construction: Grade 1 (strongest), Grade 2, Grade 3.
 */

export const TABLE_27_META = {
  id: 'csa-c22.3-no1/table27',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum grades of construction for crossings',
  references: ['6.3.1', '6.3.2.1', '7.8.1.1', '7.8.2.1', '7.8.2.4', '7.9.1', 'A.7.8.2', 'A.8.1'],
  notes: {
    footnoteStar:
      'The grade of construction may be Grade 2 where one of the following conditions exists:\\n' +
      'a) the supply and communication lines have coordinated electrical protection (see Clause 4.4);\\n' +
      'b) where coordinated electrical protection is not practical, the supply conductors have a rated tensile strength of 12.4 kN or greater; or\\n' +
      'c) the supply conductors are enclosed in effectively grounded continuous metallic sheathed cable.',
    footnoteDagger:
      'The communication line may be Grade 3 where the supply conductors are in effectively grounded continuous metallic sheathed cable.',
    footnoteDblDagger:
      'Grade 3 construction may be used where the supply conductors at the upper level are in effectively grounded continuous metallic sheathed cable.',
  },
  clauses: {
    '6.3.1': {
      title: 'General',
      text: 'Tables 27, 28, and 29 specify the minimum grades of construction for crossings, lines in proximity, and joint use.',
    },
    '6.3.2.1': {
      title: 'Crossings',
      text: 'Table 27 specifies the minimum grades of construction for in-span crossings of supply and communication circuits over each other and other facilities.',
    },
  },
};

export const TABLE_27_ROWS = [
  {
    itemAtLowerLevel: 'Railway control facilities and tracks',
    communicationUpperGrade: 1,
    supply0to750vUpperGrade: 1,
    supplyOver750vUpperGrade: 1,
  },
  {
    itemAtLowerLevel: 'Limited- or controlled-access highways',
    communicationUpperGrade: 1,
    supply0to750vUpperGrade: 1,
    supplyOver750vUpperGrade: 1,
  },
  {
    itemAtLowerLevel: 'Roads and highways — General',
    communicationUpperGrade: 3,
    supply0to750vUpperGrade: 3,
    supplyOver750vUpperGrade: 3,
  },
  {
    itemAtLowerLevel: 'Pipelines',
    communicationUpperGrade: 3,
    supply0to750vUpperGrade: 3,
    supplyOver750vUpperGrade: 3,
  },
  {
    itemAtLowerLevel: 'Navigable waterways requiring permits',
    communicationUpperGrade: 1,
    supply0to750vUpperGrade: 1,
    supplyOver750vUpperGrade: 1,
  },
  {
    itemAtLowerLevel: 'Aerial tramways',
    communicationUpperGrade: 1,
    supply0to750vUpperGrade: 1,
    supplyOver750vUpperGrade: 1,
  },
  {
    itemAtLowerLevel: 'Other private or public property',
    communicationUpperGrade: 3,
    supply0to750vUpperGrade: 3,
    supplyOver750vUpperGrade: 3,
  },
  {
    itemAtLowerLevel: 'Communications: Cable',
    communicationUpperGrade: 3,
    supply0to750vUpperGrade: 3,
    supplyOver750vUpperGrade: '1*', // reducible to Grade 2 per footnote *
  },
  {
    itemAtLowerLevel: 'Communications: Open wire — General',
    communicationUpperGrade: 3,
    supply0to750vUpperGrade: 3,
    supplyOver750vUpperGrade: '1*', // reducible to Grade 2 per footnote *
  },
  {
    itemAtLowerLevel: 'Communications: Drop wire',
    communicationUpperGrade: 3,
    supply0to750vUpperGrade: 3,
    supplyOver750vUpperGrade: 3,
  },
  {
    itemAtLowerLevel: 'Supply: 0–750 V',
    communicationUpperGrade: '2†', // Grade 3 if supply is grounded metallic sheathed
    supply0to750vUpperGrade: 3,
    supplyOver750vUpperGrade: '2‡', // Grade 3 if upper supply is grounded metallic sheathed
  },
  {
    itemAtLowerLevel: 'Supply: > 750 V',
    communicationUpperGrade: '1†',
    supply0to750vUpperGrade: 2,
    supplyOver750vUpperGrade: 2,
  },
];
"""

with open(f'{OUT_DIR}/table27.js', 'w', encoding='utf-8') as f:
    f.write(t27_js)

# -------------------------------------------------------------
# TABLE 28
# -------------------------------------------------------------
t28_js = """/**
 * CSA C22.3 No. 1 — Table 28
 * "Minimum grades of construction for proximities"
 * (See Clauses 6.3.1, 6.3.3, 7.8.1.1, 7.8.2.1, 7.8.2.4, 7.9.1, A.7.8.2, and A.8.1.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 103 (PDF Page 108)
 *   - Clause 6.3.3, Page 52 (PDF Page 57)
 */

export const TABLE_28_META = {
  id: 'csa-c22.3-no1/table28',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum grades of construction for proximities',
  references: ['6.3.1', '6.3.3', '7.8.1.1', '7.8.2.1', '7.8.2.4', '7.9.1', 'A.7.8.2', 'A.8.1'],
  notes: {
    footnoteStar: 'The line may be Grade 2 if the supply and communications lines have coordinated electrical protection (see Clause 4.4).',
    footnoteDagger: 'Grade 3 construction may be used where the supply conductors at the upper level, or the supply conductors creating the proximity, are in effectively grounded continuous metallic sheathed cable.',
  },
  clauses: {
    '6.3.3': {
      title: 'Proximities',
      text: 'Table 28 specifies the minimum grades of construction where structures or conductors of one line are in proximity to another line or facility.',
    },
  },
};

export const TABLE_28_ROWS = [
  {
    inProximityTo: 'Railway control facilities and tracks',
    communicationGrade: 1,
    supply0to750vOrMetallicGrade: 1,
    supplyOver750vGrade: 1,
  },
  {
    inProximityTo: 'Limited- or controlled-access highways',
    communicationGrade: 1,
    supply0to750vOrMetallicGrade: 1,
    supplyOver750vGrade: 1,
  },
  {
    inProximityTo: 'Roads and highways — General',
    communicationGrade: 3,
    supply0to750vOrMetallicGrade: 3,
    supplyOver750vGrade: 3,
  },
  {
    inProximityTo: 'Pipelines and waterways that do not require permits',
    communicationGrade: 3,
    supply0to750vOrMetallicGrade: 3,
    supplyOver750vGrade: 3,
  },
  {
    inProximityTo: 'Navigable waterways requiring permits',
    communicationGrade: 1,
    supply0to750vOrMetallicGrade: 1,
    supplyOver750vGrade: 1,
  },
  {
    inProximityTo: 'Aerial tramways',
    communicationGrade: 1,
    supply0to750vOrMetallicGrade: 1,
    supplyOver750vGrade: 1,
  },
  {
    inProximityTo: 'Other private or public property',
    communicationGrade: 3,
    supply0to750vOrMetallicGrade: 3,
    supplyOver750vGrade: 3,
  },
  {
    inProximityTo: 'Communications: Cable',
    communicationGrade: 3,
    supply0to750vOrMetallicGrade: 2,
    supplyOver750vGrade: '1*',
  },
  {
    inProximityTo: 'Communications: Open wire — General',
    communicationGrade: 3,
    supply0to750vOrMetallicGrade: 2,
    supplyOver750vGrade: '1*',
  },
  {
    inProximityTo: 'Communications: Drop wire',
    communicationGrade: 3,
    supply0to750vOrMetallicGrade: 3,
    supplyOver750vGrade: 3,
  },
  {
    inProximityTo: 'Supply: 0–750 V',
    communicationGrade: 2,
    supply0to750vOrMetallicGrade: 3,
    supplyOver750vGrade: '2†',
  },
  {
    inProximityTo: 'Supply: > 750 V',
    communicationGrade: 1,
    supply0to750vOrMetallicGrade: 2,
    supplyOver750vGrade: 2,
  },
];
"""

with open(f'{OUT_DIR}/table28.js', 'w', encoding='utf-8') as f:
    f.write(t28_js)

# -------------------------------------------------------------
# TABLE 29
# -------------------------------------------------------------
t29_js = """/**
 * CSA C22.3 No. 1 — Table 29
 * "Minimum grades of construction for joint use"
 * (See Clauses 6.3.1, 6.3.4, 7.8.1.1, 7.8.2.1, 7.8.2.4, 7.9.1, A.7.8.2, and A.8.1.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Pages 103-104 (PDF Pages 108-109)
 *   - Clause 6.3.4, Page 52 (PDF Page 57)
 */

export const TABLE_29_META = {
  id: 'csa-c22.3-no1/table29',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum grades of construction for joint use',
  references: ['6.3.1', '6.3.4', '7.8.1.1', '7.8.2.1', '7.8.2.4', '7.9.1', 'A.7.8.2', 'A.8.1'],
  notes: {
    footnoteStar:
      'The grade of construction may be Grade 2 where one of the following conditions exists:\\n' +
      'a) the supply and communications lines have coordinated electrical protection (see Clause 4.4);\\n' +
      'b) where coordinated electrical protection is not practical, the supply conductors have a rated tensile strength of 12.4 kN or greater; or\\n' +
      'c) the supply conductors are enclosed in effectively grounded continuous metallic sheathed cable.',
  },
  clauses: {
    '6.3.4': {
      title: 'Joint use',
      text: 'Table 29 specifies the minimum grades of construction for joint use.',
    },
  },
};

export const TABLE_29_ROWS = [
  {
    conductorAtLowerLevels: 'Communications: Cable',
    supply0to750vOrMetallicGrade: 2,
    supplyOver750vGrade: '1*', // Grade 2 if coordinated protection, RTS >= 12.4 kN, or metallic sheath
  },
  {
    conductorAtLowerLevels: 'Communications: Open wire in general',
    supply0to750vOrMetallicGrade: 2,
    supplyOver750vGrade: '1*',
  },
  {
    conductorAtLowerLevels: 'Communications: Drop wire',
    supply0to750vOrMetallicGrade: 3,
    supplyOver750vGrade: 3,
  },
  {
    conductorAtLowerLevels: 'Supply: All voltages',
    supply0to750vOrMetallicGrade: 3,
    supplyOver750vGrade: 3,
  },
];
"""

with open(f'{OUT_DIR}/table29.js', 'w', encoding='utf-8') as f:
    f.write(t29_js)

# -------------------------------------------------------------
# TABLE 30
# -------------------------------------------------------------
t30_js = """/**
 * CSA C22.3 No. 1 — Table 30
 * "Deterministic weather loads"
 * (See Clauses 7.2, 7.3.1, 7.3.5, 7.5.1, 7.6.2.1, and A.7.3.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 104 (PDF Page 109)
 *   - Clauses 7.2, 7.3, Pages 53-55 (PDF Pages 58-60)
 *   - Clause A.7.3, Page 132 (PDF Page 137)
 */

export const TABLE_30_META = {
  id: 'csa-c22.3-no1/table30',
  standard: 'CSA C22.3 No. 1',
  title: 'Deterministic weather loads',
  references: ['7.2', '7.3.1', '7.3.5', '7.5.1', '7.6.2.1', 'A.7.3', 'Annex C'],
  notes: {
    footnoteStar: 'When large conductors are used in locations where high winds are prevalent, the loading on bare conductors should be assessed, as high winds can produce a transverse loading in excess of the wind and ice combinations.',
    footnoteDagger: 'On small conductors, the ice effect is more significant than on large conductors, as it constitutes a greater percentage of the total mass.',
    footnoteDblDagger: 'See Clause 7.2 and Annex C for geographic loading area boundaries across Canada.',
    windVelocityEquivalents: '400 N/m² corresponds to ~25 m/s (~90 km/h) hourly steady-state wind; 300 N/m² corresponds to ~21 m/s (~76 km/h).',
    iceDensity: 'Ice density is assumed to be 900 kg/m³ per Clause 7.3.1(a).',
  },
  clauses: {
    '7.2': {
      title: 'Weather loads',
      text:
        'This Standard recognizes the following four deterministic weather load conditions (see Table 30):\\n' +
        'a) severe loading area;\\n' +
        'b) heavy loading area;\\n' +
        'c) medium loading area A; and\\n' +
        'd) medium loading area B.\\n' +
        'The territorial and provincial boundaries of each loading area are shown on the loading map in Annex C. Loading boundaries are approximate and utilities may adopt higher loadings where local experience indicates.',
    },
    '7.3.1': {
      title: 'Assumed loads for wire and cable attachments',
      text:
        'The assumed loads on line conductors, cables, and messengers shall be determined using\\n' +
        'a) the radial thickness of ice specified in Table 30 and assuming the density of ice to be 900 kg/m³; and\\n' +
        'b) the wind pressure (as specified in Table 30) acting horizontally on ice-covered wires and cable attachments.',
    },
    '7.5.1': {
      title: 'Assumed vertical load on supports',
      text: 'The assumed vertical load on a structure shall be its own weight plus the vertical load from attachments. The radial thickness of ice, as specified in Table 30, shall be applied only to wire and cable attachments. Structures and attachments not supporting wires need not be assumed ice-covered under deterministic loads.',
    },
    '7.6.2.1': {
      title: 'Assumed transverse load on a structure',
      text: 'The assumed transverse load on a structure shall be the wire load specified in Clause 7.6.1 plus the load created by wind pressure (as specified in Table 30) on the surfaces of the structure without an ice covering.',
    },
  },
};

export const TABLE_30_LOADING_AREAS = [
  {
    id: 'severe',
    name: 'Severe',
    radialIceThickness_mm: 19.0,
    horizontalWindPressure_Pa: 400, // N/m²
    temperature_C: -20,
    approxWindVelocity_ms: 25,
    description: 'Severe loading area (coastal / extreme icing regions)',
  },
  {
    id: 'heavy',
    name: 'Heavy',
    radialIceThickness_mm: 12.5,
    horizontalWindPressure_Pa: 400, // N/m²
    temperature_C: -20,
    approxWindVelocity_ms: 25,
    description: 'Heavy loading area (standard across most of Eastern/Central Canada)',
  },
  {
    id: 'medium_a',
    name: 'Medium A',
    radialIceThickness_mm: 6.5,
    horizontalWindPressure_Pa: 400, // N/m²
    temperature_C: -20,
    approxWindVelocity_ms: 25,
    description: 'Medium loading area A (prairie & interior regions with lower ice, 400 Pa wind)',
  },
  {
    id: 'medium_b',
    name: 'Medium B',
    radialIceThickness_mm: 12.5,
    horizontalWindPressure_Pa: 300, // N/m²
    temperature_C: -20,
    approxWindVelocity_ms: 21,
    description: 'Medium loading area B (interior valleys with higher ice, 300 Pa wind)',
  },
];
"""

with open(f'{OUT_DIR}/table30.js', 'w', encoding='utf-8') as f:
    f.write(t30_js)

# -------------------------------------------------------------
# TABLE 31
# -------------------------------------------------------------
t31_js = """/**
 * CSA C22.3 No. 1 — Table 31
 * "Minimum load factors for non-linear analysis of structures"
 * (See Clauses 7.4.2, 7.5.2, 7.6.4, 7.7.2, 7.8.1.2, 8.1.3, 8.3.10.1, 8.3.12.2, and A.7.4.2.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 105 (PDF Page 110)
 *   - Clauses 7.4.2, 7.5.2, 7.6.4, 7.7.2, 7.8.1.2, 8.1.3, 8.3.10.1, 8.3.12.2, Pages 54-62 (PDF Pages 59-67)
 *   - Clause A.7.4.2, Page 133 (PDF Page 138)
 *
 * Material Coefficient of Variation (COV):
 *   - Steel default: COV ≤ 10%
 *   - Concrete default: 10% < COV < 15%
 *   - Wood default: COV ≥ 15%
 */

export const TABLE_31_META = {
  id: 'csa-c22.3-no1/table31',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum load factors for non-linear analysis of structures',
  references: ['7.4.2', '7.5.2', '7.6.4', '7.7.2', '7.8.1.2', '8.1.3', '8.3.10.1', '8.3.12.2', 'A.7.4.2', 'Table 32'],
  notes: {
    note1: 'Non-linear analysis, including stability (buckling) check, is the method of analysis of structures specified in this Standard.',
    note2: 'Default COV values for pole and structure materials are:\\n  a) steel — ≤ 10%;\\n  b) concrete — 10% < COV < 15%; and\\n  c) wood — ≥ 15%.',
    note3:
      'The selection of appropriate minimum load factors for steel, concrete, fibre-reinforced composite, laminated wood, and wood poles is based on the coefficient of variation (COV), for the given pole material as verified by the pole manufacturer. The lowest minimum load factors (steel pole default) may be used for concrete, laminated wood, and FRP composite structures if manufacturers verify COV ≤ 10%. The next lowest (concrete pole default) may be used if 10% < COV < 15%. The highest (wood default) shall be used if manufacturer is unable to verify COV < 15%.',
  },
  clauses: {
    '7.4.2': {
      title: 'Application of load factors',
      text: 'The strength requirements for wood, concrete, and fibre-reinforced composite structures and for guys shall be calculated by multiplying the loads of each category in Clause 7.4.1 by the appropriate load factors in Tables 31 and 32 for the type of load being considered.',
    },
    '8.1.3': {
      title: 'Non-linear analysis method',
      text: 'Non-linear analysis, including second-order P-delta effects and stability/buckling checks, shall be used to verify structure capacity under factored loads.',
    },
    '8.3.10.1': {
      title: 'Metal poles, metal towers, and metal supports',
      text: 'In the design of metal poles, metal towers, and metal supports, the \"load factor\" specified in Table 31 shall be interpreted such that the completed structure will support, with only negligible deformation of component parts (see Table A.4), the assumed loads to which it will be subjected.',
    },
    '8.3.12.2': {
      title: 'Fibre-reinforced composite poles',
      text: 'In the design of fibre-reinforced composite poles, the \"minimum load factor\" of Table 31 shall be interpreted such that the completed structure will support the assumed loads to which it will be subjected. Fibre-reinforced composite poles may use steel factors if proven 5th percentile strength.',
    },
    'A.7.4.2': {
      title: 'Rationale for load factors',
      text: 'The load factors take into account the grade of construction and the type of material being used and the fact that weather loadings cannot be accurately determined. Minimum values to prevent failure.',
    },
  },
};

export const TABLE_31_LOAD_FACTORS = [
  {
    loadType: 'Vertical',
    loadKey: 'vertical',
    grades: [
      { grade: 1, cov_le_10: 1.30, cov_10_to_15: 1.60, cov_ge_15: 2.00 },
      { grade: 2, cov_le_10: 1.15, cov_10_to_15: 1.30, cov_ge_15: 1.50 },
      { grade: 3, cov_le_10: 1.00, cov_10_to_15: 1.10, cov_ge_15: 1.20 },
    ],
  },
  {
    loadType: 'Transverse',
    loadKey: 'transverse',
    grades: [
      { grade: 1, cov_le_10: 1.20, cov_10_to_15: 1.50, cov_ge_15: 1.90 },
      { grade: 2, cov_le_10: 1.10, cov_10_to_15: 1.20, cov_ge_15: 1.30 },
      { grade: 3, cov_le_10: 1.00, cov_10_to_15: 1.10, cov_ge_15: 1.10 },
    ],
  },
  {
    loadType: 'Longitudinal with terminations or tension changes',
    loadKey: 'longitudinal_with_terminations',
    grades: [
      { grade: 1, cov_le_10: 1.20, cov_10_to_15: 1.50, cov_ge_15: 1.90 },
      { grade: 2, cov_le_10: 1.10, cov_10_to_15: 1.20, cov_ge_15: 1.30 },
      { grade: 3, cov_le_10: 1.00, cov_10_to_15: 1.10, cov_ge_15: 1.10 },
    ],
  },
  {
    loadType: 'Longitudinal without terminations or tension changes',
    loadKey: 'longitudinal_without_terminations',
    grades: [
      { grade: 1, cov_le_10: 1.10, cov_10_to_15: 1.20, cov_ge_15: 1.20 },
      { grade: 2, cov_le_10: 1.00, cov_10_to_15: 1.00, cov_ge_15: 1.00 },
      { grade: 3, cov_le_10: 1.00, cov_10_to_15: 1.00, cov_ge_15: 1.00 },
    ],
  },
];
"""

with open(f'{OUT_DIR}/table31.js', 'w', encoding='utf-8') as f:
    f.write(t31_js)

# Also create informative README and documentation in each sandbox/csa c22 no 1/Table X folder
tables_info = {
  11: ("Table 11: Minimum separation of equipment and clearances of conductors from swimming pools", "Clauses 5.7.5, A.5.7.5, Figure 1"),
  12: ("Table 12: Minimum horizontal separations from supply equipment to buildings", "Clauses 5.7.6, A.5.7.6"),
  13: ("Table 13: Minimum design vertical clearances between wires crossing each other and supported by different supporting structures", "Clauses 5.8.1.1, 5.8.1.2, 5.8.1.3, A.5.8.1, A.5.8.1.3"),
  14: ("Table 14: Minimum vertical clearances for crossings over aerial tramways", "Clauses 5.8.1.1, 5.7.9"),
  15: ("Table 15: Clearances between conductors supported by different structures but not crossing each other — Clearance increments to be added to horizontal displacement", "Clauses 5.8.2, A.5.8.2"),
  16: ("Table 16: Minimum design clearances between conductors of one line and supporting structures of another line", "Clauses 5.8.3.1, 5.8.3.2, 5.8.3.3"),
  17: ("Table 17: Minimum horizontal separations of supply-line conductors attached to the same supporting structure", "Clauses 5.9.1.1, 5.9.1.2, 5.9.1.3"),
  18: ("Table 18: Minimum vertical separations between supply-line conductors attached to the same supporting structure, ac", "Clause 5.9.2.1"),
  19: ("Table 19: Vertical spacings between supply-line conductors of 0 to 750 V on vertical brackets", "Clause 5.9.2.2"),
  20: ("Table 20: Minimum in-span vertical clearances between supply conductors of the same circuit that are attached to the same supporting structure", "Clauses 5.9.2.3, A.5.9.2.3"),
  21: ("Table 21: Minimum in-span vertical clearances between supply conductors of different circuits that are attached to the same supporting structure", "Clauses 5.9.2.4, A.5.9.2.4"),
  22: ("Table 22: Minimum separations or clearances in any direction from supply conductors to other supply plant attached to the same supporting structure", "Clauses 5.9.5, A.5.9.5"),
  23: ("Table 23: Minimum vertical separations at a joint-use structure", "Clauses 5.10.1.1, 5.10.1.6, 5.10.1.7, 5.10.6.2, A.5.10.1, Figures A.6, A.7"),
  24: ("Table 24: Minimum in-span vertical clearances between supply and communication conductors", "Clauses 5.10.3.2, 5.10.3.3, A.5.10.3"),
  25: ("Table 25: Minimum clearances from guys to plant of another system", "Clauses 5.11.2.1, A.5.11.2, Figure A.8"),
  26: ("Table 26: Minimum clearance or separation between guys and other plant attached to the joint-use structure", "Clauses 5.11.2.2, A.5.11.2, Figure A.8"),
  27: ("Table 27: Minimum grades of construction for crossings", "Clauses 6.3.1, 6.3.2.1, 7.8.1.1, 7.8.2.1, 7.8.2.4, 7.9.1, A.7.8.2, A.8.1"),
  28: ("Table 28: Minimum grades of construction for proximities", "Clauses 6.3.1, 6.3.3, 7.8.1.1, 7.8.2.1, 7.8.2.4, 7.9.1, A.7.8.2, A.8.1"),
  29: ("Table 29: Minimum grades of construction for joint use", "Clauses 6.3.1, 6.3.4, 7.8.1.1, 7.8.2.1, 7.8.2.4, 7.9.1, A.7.8.2, A.8.1"),
  30: ("Table 30: Deterministic weather loads", "Clauses 7.2, 7.3.1, 7.3.5, 7.5.1, 7.6.2.1, A.7.3, Annex C"),
  31: ("Table 31: Minimum load factors for non-linear analysis of structures", "Clauses 7.4.2, 7.5.2, 7.6.4, 7.7.2, 7.8.1.2, 8.1.3, 8.3.10.1, 8.3.12.2, A.7.4.2"),
}

for t_num, (title, clauses_ref) in tables_info.items():
    folder = f'{SANDBOX_DIR}/Table {t_num}'
    os.makedirs(folder, exist_ok=True)
    readme_path = f'{folder}/README.md'
    content = f"# {title}\\n\\n- **Governing Standard**: CSA C22.3 No. 1-15 (Overhead Systems)\\n- **Associated Clauses & Annexes**: {clauses_ref}\\n- **Extracted Data Model**: `src/data/csa/c22_3_no1/table{t_num}.js`\\n"
    with open(readme_path, 'w', encoding='utf-8') as rf:
        rf.write(content)

print('All Tables 11 through 31 generated successfully!')
