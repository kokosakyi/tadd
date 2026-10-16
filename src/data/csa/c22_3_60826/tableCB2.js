/**
 * CSA C22.3 No. 60826-10 (R2015) — Table CB.2
 * "Conductor loads per pole (N)"
 * (See Annex CB, Clause CB.3.7.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 60826-10, Annex CB, Page CSA/54 (PDF Page 56)
 *   - Sample calculation for 3-phase distribution line in Ottawa (T = 50 yr, d = 22 mm,
 *     L = 80 m, w = 11 N/m, V50 = 90 km/h, t50 = 30 mm).
 */

export const TABLE_CB2_META = {
  id: 'csa-c22.3-60826/tableCB2',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  section: 'Annex CB (Informative)',
  title: 'Conductor loads per pole (N)',
  unit: 'N',
  references: ['CB.3.1', 'CB.3.2', 'CB.3.3', 'CB.3.4', 'CB.3.5', 'CB.3.7', 'Table CB.3'],
  pdfPages: [56],
  notes: {
    sampleInputs:
      '3-phase circuit in Ottawa, 50-year return period, conductor diameter 22 mm, span 80 m, conductor unit weight 11 N/m, V50 = 90 km/h, point radial ice t50 = 30 mm (design ice = 39 mm). Values in Table CB.2 are total for 3 conductors per pole.',
  },
  clauses: {
    'CB.3.7': {
      title: 'Pole fibre stresses (non-linear analysis)',
      text: 'The calculated loads on the conductors (for 3 phases per pole) are shown in Table CB.2.',
    },
  },
};

export const TABLE_CB2_ROWS = [
  {
    id: 'wind_only',
    loadCase: 'Wind',
    verticalLoad_N: 2640, // 3 phases × 11 N/m × 80 m
    transverseLoad_N: 4113, // 3 phases × 1371 N
    singlePhaseVertical_N: 880,
    singlePhaseTransverse_N: 1371,
  },
  {
    id: 'ice_wind_c1',
    loadCase: 'Ice + wind C1',
    verticalLoad_N: 18456, // 3 phases × 6152 N
    transverseLoad_N: 2991, // 3 phases × 997 N
    singlePhaseVertical_N: 6152,
    singlePhaseTransverse_N: 997.5,
  },
  {
    id: 'ice_wind_c2',
    loadCase: 'Ice + wind C2',
    verticalLoad_N: 10548, // 3 phases × 3516 N
    transverseLoad_N: 4878, // 3 phases × 1626 N
    singlePhaseVertical_N: 3516,
    singlePhaseTransverse_N: 1625.5,
  },
];

export const TABLE_CB2_CONDUCTOR_LOADS = TABLE_CB2_ROWS;
