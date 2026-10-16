/**
 * CSA C22.3 No. 1 — Table 3
 * "Minimum vertical design clearances above waterways*, ac and dc†"
 * (See Clause 5.3.3.2.)
 *
 * Transcribed from: sandbox/csa c22 no 1/Table 3/Table 3_1.png, Table 3_2.png, Cl 5_3_3_2.png
 * All clearances in METRES above OHWM (Ordinary High Water Mark).
 * Voltages are rms line-to-ground (kV) (Table 3 Note 1).
 *
 * This file is DATA ONLY. Clause-driven adjustments (Clause 5.3.3.2) live in waterwayClearanceModifiers.js
 * and evaluation lives in src/utils/csaTable3Resolver.js.
 */

export const TABLE_3_META = {
  id: 'csa-c22.3-no1/table3',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum vertical design clearances above waterways*, ac and dc†',
  referenceClause: '5.3.3.2',
  datum: 'OHWM', // Ordinary High Water Mark
  unit: 'm',
  notes: {
    1: 'Voltages are rms line-to-ground.',
    2: 'The formula used to calculate minimum clearances is as follows: ' +
      'Minimum vertical clearance = reference vessel height + 1.0 m buffer + safe electrical clearance ' +
      'where 1.0 m buffer = allowance for variation in boat height above water (due to different loading conditions) and for wave action; ' +
      'safe electrical clearance = safety margin + air gap flashover distance based on switching surge = 0.78 m + (0.01 m/kV × max. kV in each column)',
    3: 'Vertical design clearance is based on the clearance needed for the vessel height that a waterway can support. ' +
      'If a waterway cannot support the referenced vessel height, the vertical clearance requirement may be reduced in accordance with the appropriate requirement.',
  },
  footnotes: {
    '*': 'The clearance over a canal, river, or stream normally used to provide access for sailboats to a larger body of water shall be the same as that required for the larger body of water.',
    '†': 'Clearances are applicable to both ac and dc circuits. For dc circuits, the clearance requirements shall be the same as those for ac circuits having the same crest voltage-to-ground.',
    '‡': 'Reference vessel height refers to the overall height of the vessel, including the heights of antennas or other attachments.',
    '§': 'In Canada, clearances are specified by the Transport Canada office responsible for the coastal regions, Great Lakes system, Red River–Lake Winnipeg system, Mackenzie River, and interior lakes of British Columbia. Where tide water has an effect on a body of water being crossed, the vertical design clearance shall be increased by an amount that takes into account peak tide.',
  },
};

/**
 * Columns definition for Table 3.
 * Columns:
 * - I: Guys, messengers, communication, span & lightning protection wires, comm cables
 * - II: 0–22 kV open supply & service conductors
 * - III: > 22 ≤ 50 kV
 * - IV: > 50 ≤ 90 kV
 * - V: > 90 ≤ 150 kV
 * - VI: > 150 kV (Formula-based: base + 0.01 m/kV over 150 kV)
 */
export const TABLE_3_COLUMNS = [
  {
    id: 'I',
    kind: 'grounded',
    label: 'Guys; messengers; communication, span, and lightning protection wires; communication cables',
  },
  {
    id: 'II',
    kind: 'supply',
    label: '0–22 kV',
    vLgKv: { minInclusive: 0, maxInclusive: 22 },
  },
  {
    id: 'III',
    kind: 'supply',
    label: '> 22 ≤ 50 kV',
    vLgKv: { minExclusive: 22, maxInclusive: 50 },
  },
  {
    id: 'IV',
    kind: 'supply',
    label: '> 50 ≤ 90 kV',
    vLgKv: { minExclusive: 50, maxInclusive: 90 },
  },
  {
    id: 'V',
    kind: 'supply',
    label: '> 90 ≤ 150 kV',
    vLgKv: { minExclusive: 90, maxInclusive: 150 },
  },
  {
    id: 'VI',
    kind: 'supply',
    label: '> 150 kV',
    vLgKv: { minExclusive: 150 },
    ratePerKvOver150: 0.01,
  },
];

export const COLUMN_ORDER = TABLE_3_COLUMNS.map((c) => c.id);

/**
 * Table 3 rows for Crossing Classes 0 through 7.
 * Each row includes:
 * - class: number
 * - title / description: description of waterways crossed
 * - criteria: physical dimensions (water area A, depth D, width W, reference vessel height H)
 * - referenceVesselHeightM: H value (null for class 0 and class 7)
 * - cells: map of column ID to clearance object or special rule (e.g. jurisdiction §)
 */
export const TABLE_3_ROWS = [
  {
    crossingClass: 0,
    title: 'Minor waterways',
    description: 'Minor waterways. Minor waterway crossings do not require approvals from Transport Canada if they meet the definition of Minor Works and Waters (Navigation Protection Act) Order.',
    criteria: {
      notes: 'Meets Minor Works and Waters Order definition',
    },
    referenceVesselHeightM: null,
    cells: {
      I: { m: 4.42 },
      II: { m: 4.75 },
      III: { m: 5.2 },
      IV: { m: 5.5 },
      V: { m: 6.1 },
      VI: { baseM: 6.1, ratePerKvOver150: 0.01, formula: '6.1 + 0.01 m/kV over 150 kV' },
    },
  },
  {
    crossingClass: 1,
    title: 'Shallow or fast-moving waterways (canoes & paddle boats)',
    description: 'Shallow or fast-moving waterways capable of being used by canoes and paddle boats in isolated areas where motor boats are not expected. Creeks and streams: W = 3–50 m and D < 1 m. Ponds: A < 8 ha and D < 1 m.',
    criteria: {
      creeksAndStreams: { widthMinM: 3, widthMaxM: 50, depthMaxM: 1 },
      ponds: { areaMaxHa: 8, depthMaxM: 1 },
    },
    referenceVesselHeightM: 4.0,
    cells: {
      I: { m: 5.0 },
      II: { m: 6.0 },
      III: { m: 6.3 },
      IV: { m: 6.7 },
      V: { m: 7.3 },
      VI: { baseM: 7.3, ratePerKvOver150: 0.01, formula: '7.3 + 0.01 m/kV over 150 kV' },
    },
  },
  {
    crossingClass: 2,
    title: 'Shallow or fast-moving waterways (motorboats with antennas)',
    description: 'Shallow or fast-moving waterways capable of being used by motorboats with antennas and unable to support masted vessels. Creeks and streams: W = 3–50 m and D < 1 m. Ponds: A < 8 ha and D < 1 m.',
    criteria: {
      creeksAndStreams: { widthMinM: 3, widthMaxM: 50, depthMaxM: 1 },
      ponds: { areaMaxHa: 8, depthMaxM: 1 },
    },
    referenceVesselHeightM: 6.0,
    cells: {
      I: { m: 7.0 },
      II: { m: 8.0 },
      III: { m: 8.3 },
      IV: { m: 8.7 },
      V: { m: 9.3 },
      VI: { baseM: 9.3, ratePerKvOver150: 0.01, formula: '9.3 + 0.01 m/kV over 150 kV' },
    },
  },
  {
    crossingClass: 3,
    title: 'Small lakes and rivers used by masted vessels',
    description: 'Small lakes and rivers used by masted vessels. Rivers: W = 3–50 m and D > 1 m. Ponds and lakes: A < 8 ha and D > 1 m.',
    criteria: {
      rivers: { widthMinM: 3, widthMaxM: 50, depthMinM: 1 },
      pondsAndLakes: { areaMaxHa: 8, depthMinM: 1 },
    },
    referenceVesselHeightM: 8.0,
    cells: {
      I: { m: 9.0 },
      II: { m: 10.0 },
      III: { m: 10.3 },
      IV: { m: 10.7 },
      V: { m: 11.3 },
      VI: { baseM: 11.3, ratePerKvOver150: 0.01, formula: '11.3 + 0.01 m/kV over 150 kV' },
    },
  },
  {
    crossingClass: 4,
    title: 'Small resort lakes, medium-sized rivers and reservoirs',
    description: 'Small resort lakes, medium-sized rivers and reservoirs, rivers connecting lakes, and crossings adjacent to bridges and roads. Rivers: W = 50–500 m. Lakes/reservoirs: 8 ha < A < 80 ha.',
    criteria: {
      rivers: { widthMinM: 50, widthMaxM: 500 },
      lakesAndReservoirs: { areaMinHa: 8, areaMaxHa: 80 },
    },
    referenceVesselHeightM: 10.0,
    cells: {
      I: { m: 11.0 },
      II: { m: 12.0 },
      III: { m: 12.3 },
      IV: { m: 12.7 },
      V: { m: 13.3 },
      VI: { baseM: 13.3, ratePerKvOver150: 0.01, formula: '13.3 + 0.01 m/kV over 150 kV' },
    },
  },
  {
    crossingClass: 5,
    title: 'Large lakes, reservoirs, and main rivers in resort areas',
    description: 'Large lakes, reservoirs, and main rivers in resort areas. Rivers: W > 500 m. Lakes/reservoirs: 80 ha < A < 800 ha.',
    criteria: {
      rivers: { widthMinM: 500 },
      lakesAndReservoirs: { areaMinHa: 80, areaMaxHa: 800 },
    },
    referenceVesselHeightM: 12.0,
    cells: {
      I: { m: 13.0 },
      II: { m: 14.0 },
      III: { m: 14.3 },
      IV: { m: 14.7 },
      V: { m: 15.3 },
      VI: { baseM: 15.3, ratePerKvOver150: 0.01, formula: '15.3 + 0.01 m/kV over 150 kV' },
    },
  },
  {
    crossingClass: 6,
    title: 'Main lakes on main navigation routes and marinas',
    description: 'Main lakes on main navigation routes and marinas. A > 800 ha.',
    criteria: {
      lakes: { areaMinHa: 800 },
    },
    referenceVesselHeightM: 14.0,
    cells: {
      I: { m: 15.0 },
      II: { m: 16.0 },
      III: { m: 16.3 },
      IV: { m: 16.7 },
      V: { m: 17.3 },
      VI: { baseM: 17.3, ratePerKvOver150: 0.01, formula: '17.3 + 0.01 m/kV over 150 kV' },
    },
  },
  {
    crossingClass: 7,
    title: 'Federally maintained commercial channels, rivers, harbours, or heritage canals',
    description: 'Federally maintained commercial channels, rivers, harbours, or heritage canals.',
    criteria: {
      jurisdiction: 'Transport Canada',
    },
    referenceVesselHeightM: null,
    jurisdictionNote: '§',
    cells: {
      I: { special: '§', transportCanadaApproval: true },
      II: { special: '§', transportCanadaApproval: true },
      III: { special: '§', transportCanadaApproval: true },
      IV: { special: '§', transportCanadaApproval: true },
      V: { special: '§', transportCanadaApproval: true },
      VI: { special: '§', transportCanadaApproval: true },
    },
  },
];
