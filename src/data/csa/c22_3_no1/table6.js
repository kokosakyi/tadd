/**
 * CSA C22.3 No. 1 — Table 6
 * "Minimum horizontal design clearances between wires and railway tracks"
 * (See Clauses 5.4.2 and 5.4.3.)
 *
 * Transcribed from:
 *   - sandbox/csa c22 no 1/Table 6/Table 6.png
 *   - sandbox/csa c22 no 1/Table 6/Cl 5.4.2_5.4.3.png
 *
 * All clearances in METRES.
 * Note: Voltages are line-to-ground (rms for ac, line-to-ground for dc).
 *
 * This file is DATA ONLY. Evaluation and resolution logic live in src/utils/csaTable6Resolver.js.
 */

export const TABLE_6_META = {
  id: 'csa-c22.3-no1/table6',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum horizontal design clearances between wires and railway tracks',
  unit: 'm',
  references: ['5.4.2', '5.4.3'],
  notes: {
    1: 'Voltages are line-to-ground.',
  },
  clauses: {
    '5.4.2': 'Where there is no curvature of railway tracks, the horizontal clearances shall be as specified in Table 6.',
    '5.4.3': 'At a point of curvature of a railway track, the horizontal clearances shall be as specified in Table 6, with an increment of 25 mm added for each degree of curvature. In addition, where the wire is closer to the low side of tracks that are at different elevations, a further increment of 2.5 mm shall be added for each millimetre of superelevation. (The total of these two increments shall not exceed 0.75 m, and the value of 0.75 m may be used in place of calculations.)',
  },
};

/**
 * Track classifications specified in Table 6
 */
export const TABLE_6_TRACK_TYPES = [
  {
    id: 'main_tracks',
    name: 'Main tracks',
    description: 'Main railway tracks / through tracks',
  },
  {
    id: 'siding',
    name: 'Siding',
    description: 'Railway siding tracks',
  },
];

/**
 * Wire categories / classifications in Table 6
 */
export const TABLE_6_WIRE_CATEGORIES = [
  {
    id: 'grounded_and_comm',
    group: 'General',
    label: 'Guys; messengers; communication, span, and lightning protection wires; communication cables',
    shortLabel: 'Guys, messengers, comm wires/cables, span & lightning protection',
    clearances: {
      main_tracks: 2.5,
      siding: 1.9,
    },
  },
  {
    id: 'supply_0_750v_or_metallic_sheathed',
    group: 'General',
    label: 'Open supply-line conductors and service conductors of 0–750 V and effectively grounded continuous metallic sheathed cables of all voltages',
    shortLabel: 'Open supply 0–750 V & effectively grounded continuous metallic sheathed cables (all voltages)',
    clearances: {
      main_tracks: 2.5,
      siding: 1.9,
    },
  },
  // AC Open supply-line conductors and cables other than those having an effectively grounded continuous metallic sheath
  {
    id: 'ac_0_75_to_22kv',
    group: 'AC',
    systemType: 'AC',
    label: 'AC open supply-line conductors and cables (> 0.75 ≤ 22 kV)',
    shortLabel: '> 0.75 ≤ 22 kV (AC)',
    vLgKv: { minExclusive: 0.75, maxInclusive: 22 },
    clearances: {
      main_tracks: 2.7,
      siding: 2.1,
    },
  },
  {
    id: 'ac_22_to_50kv',
    group: 'AC',
    systemType: 'AC',
    label: 'AC open supply-line conductors and cables (> 22 ≤ 50 kV)',
    shortLabel: '> 22 ≤ 50 kV (AC)',
    vLgKv: { minExclusive: 22, maxInclusive: 50 },
    clearances: {
      main_tracks: 3.2,
      siding: 2.6,
    },
  },
  {
    id: 'ac_50_to_90kv',
    group: 'AC',
    systemType: 'AC',
    label: 'AC open supply-line conductors and cables (> 50 ≤ 90 kV)',
    shortLabel: '> 50 ≤ 90 kV (AC)',
    vLgKv: { minExclusive: 50, maxInclusive: 90 },
    clearances: {
      main_tracks: 3.5,
      siding: 2.9,
    },
  },
  {
    id: 'ac_90_to_120kv',
    group: 'AC',
    systemType: 'AC',
    label: 'AC open supply-line conductors and cables (> 90 ≤ 120 kV)',
    shortLabel: '> 90 ≤ 120 kV (AC)',
    vLgKv: { minExclusive: 90, maxInclusive: 120 },
    clearances: {
      main_tracks: 3.8,
      siding: 3.2,
    },
  },
  {
    id: 'ac_120_to_150kv',
    group: 'AC',
    systemType: 'AC',
    label: 'AC open supply-line conductors and cables (> 120 ≤ 150 kV)',
    shortLabel: '> 120 ≤ 150 kV (AC)',
    vLgKv: { minExclusive: 120, maxInclusive: 150 },
    clearances: {
      main_tracks: 4.1,
      siding: 3.5,
    },
  },
  {
    id: 'ac_over_150kv',
    group: 'AC',
    systemType: 'AC',
    label: 'AC supply conductors > 150 kV',
    shortLabel: '> 150 kV (AC)',
    vLgKv: { minExclusive: 150 },
    baseClearances: {
      main_tracks: 4.1,
      siding: 3.5,
    },
    voltageIncrementPerKvOver150: 0.01, // 4.1 + 0.01 m/kV over 150 kV for main; 3.5 + 0.01 m/kV over 150 kV for siding
  },
  // DC Open supply conductors
  {
    id: 'dc_0_750v',
    group: 'DC',
    systemType: 'DC',
    label: 'DC open supply conductors 0–750 V',
    shortLabel: '0–750 V (DC)',
    vLgKv: { minInclusive: 0, maxInclusive: 0.75 },
    clearances: {
      main_tracks: 2.5,
      siding: 1.9,
    },
  },
  {
    id: 'dc_0_75_to_100kv',
    group: 'DC',
    systemType: 'DC',
    label: 'DC open supply conductors (> 0.75 ≤ 100 kV)',
    shortLabel: '> 0.75 ≤ 100 kV (DC)',
    vLgKv: { minExclusive: 0.75, maxInclusive: 100 },
    clearances: {
      main_tracks: 2.8,
      siding: 2.2,
    },
  },
  {
    id: 'dc_100_to_150kv',
    group: 'DC',
    systemType: 'DC',
    label: 'DC open supply conductors (> 100 ≤ 150 kV)',
    shortLabel: '> 100 ≤ 150 kV (DC)',
    vLgKv: { minExclusive: 100, maxInclusive: 150 },
    clearances: {
      main_tracks: 3.0,
      siding: 2.5,
    },
  },
  {
    id: 'dc_150_to_200kv',
    group: 'DC',
    systemType: 'DC',
    label: 'DC open supply conductors (> 150 ≤ 200 kV)',
    shortLabel: '> 150 ≤ 200 kV (DC)',
    vLgKv: { minExclusive: 150, maxInclusive: 200 },
    clearances: {
      main_tracks: 3.3,
      siding: 2.7,
    },
  },
  {
    id: 'dc_200_to_250kv',
    group: 'DC',
    systemType: 'DC',
    label: 'DC open supply conductors (> 200 ≤ 250 kV)',
    shortLabel: '> 200 ≤ 250 kV (DC)',
    vLgKv: { minExclusive: 200, maxInclusive: 250 },
    clearances: {
      main_tracks: 3.5,
      siding: 2.9,
    },
  },
  {
    id: 'dc_250_to_300kv',
    group: 'DC',
    systemType: 'DC',
    label: 'DC open supply conductors (> 250 ≤ 300 kV)',
    shortLabel: '> 250 ≤ 300 kV (DC)',
    vLgKv: { minExclusive: 250, maxInclusive: 300 },
    clearances: {
      main_tracks: 3.7,
      siding: 3.1,
    },
  },
  {
    id: 'dc_300_to_350kv',
    group: 'DC',
    systemType: 'DC',
    label: 'DC open supply conductors (> 300 ≤ 350 kV)',
    shortLabel: '> 300 ≤ 350 kV (DC)',
    vLgKv: { minExclusive: 300, maxInclusive: 350 },
    clearances: {
      main_tracks: 4.0,
      siding: 3.4,
    },
  },
  {
    id: 'dc_350_to_400kv',
    group: 'DC',
    systemType: 'DC',
    label: 'DC open supply conductors (> 350 ≤ 400 kV)',
    shortLabel: '> 350 ≤ 400 kV (DC)',
    vLgKv: { minExclusive: 350, maxInclusive: 400 },
    clearances: {
      main_tracks: 4.2,
      siding: 3.6,
    },
  },
  {
    id: 'dc_400_to_450kv',
    group: 'DC',
    systemType: 'DC',
    label: 'DC open supply conductors (> 400 ≤ 450 kV)',
    shortLabel: '> 400 ≤ 450 kV (DC)',
    vLgKv: { minExclusive: 400, maxInclusive: 450 },
    clearances: {
      main_tracks: 4.4,
      siding: 3.8,
    },
  },
  {
    id: 'dc_over_450kv',
    group: 'DC',
    systemType: 'DC',
    label: 'DC open supply conductors > 450 kV',
    shortLabel: '> 450 kV (DC)',
    vLgKv: { minExclusive: 450 },
    baseClearances: {
      main_tracks: 4.4,
      siding: 3.8,
    },
    voltageIncrementPerKvOver450: 0.005, // 4.4 + 0.005 m/kV over 450 kV for main; 3.8 + 0.005 m/kV over 450 kV for siding
  },
];
