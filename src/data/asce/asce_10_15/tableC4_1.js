/**
 * ASCE/SEI 10-15 — Table C4-1
 * "A394 Type 0 Bolt Connecting A36 Steel (1 in. = 25.4 mm; 1 ksi = 6.89 MPa; 1 kip = 4,450 N)"
 * Values for end, rolled edge, and center-to-center distances for an A394, Type 0, 3/4-in.-diameter
 * bolt used in single shear through the threads to connect A36 steel stressed members. Bearing stress = 1.5 Fu.
 * (See Clauses 4.4, 4.5.1, 4.5.2, 4.5.3, C4.5.1, C4.5.2, and C4.5.3, Page 43.)
 */

export const TABLE_C4_1_META = {
  id: 'asce_10_15/tableC4_1',
  standard: 'ASCE 10-15',
  title: 'A394 Type 0 Bolt Connecting A36 Steel — End, Rolled Edge, and Center-to-Center Distances',
  unit: 'in., ksi, kip',
  evaluatedAt: 'Bolt diameter $d = 0.75\\text{ in.}$, Single shear through threads ($16.65\\text{ kip}$), Nut point-to-point $c = 1.3\\text{ in.}$, A36 $F_u = 58.0\\text{ ksi}$, Bearing stress $= 1.5 F_u = 87.0\\text{ ksi}$',
  references: ['4.4', '4.5.1', '4.5.2', '4.5.3', 'C4.4', 'C4.5.1', 'C4.5.2', 'C4.5.3'],
  notes: [
    'Eq. (4.5-1): $e = \\frac{1.2 P}{F_u t}$ — governs for member thicknesses up through $5/16\\text{ in.}$ ($6.9\\text{ mm}$).',
    'Eq. (4.5-2): $e = 1.3 d$ — governs for member thicknesses from $3/8\\text{ in.}$ ($9.5\\text{ mm}$) through $9/16\\text{ in.}$ ($14.3\\text{ mm}$), and for drilled holes at $7/8\\text{ in.}$ and above.',
    'Eq. (4.5-3): $e = t + \\frac{d}{2}$ — governs punched holes for thicknesses from $5/8\\text{ in.}$ ($15.9\\text{ mm}$) through $13/16\\text{ in.}$ ($20.6\\text{ mm}$). Does not apply if holes are drilled.',
    'Eq. (4.5-5): $s_{\\min} = \\frac{1.2 P}{F_u t} + 0.6 d$ — center-to-center hole spacing along line of transmitted force.',
    'Suggested erection spacing $= c + 3/8\\text{ in.} = 1.3 + 0.375 = 1.67\\text{ in.}$',
    'Eq. (4.5-6): $f_{\\min} = 0.85 e_{\\min}$ for a rolled edge (add $1/16\\text{ in.}$ [$1.6\\text{ mm}$] per Eq. (4.5-7) for a sheared or mechanically guided flame-cut edge).'
  ],
  footnotes: {
    'a': '$P$ limited by single shear strength (through threads) of bolt ($16.65\\text{ kip}$).',
    'b': '$t = 13/16\\text{ in.}$ is the suggested maximum punching thickness ($13/16\\text{-in.}$ diameter hole in A36 steel). Distance shown for $7/8\\text{ in.}$, $15/16\\text{ in.}$, and $1\\text{ in.}$ is for drilled holes.'
  }
};

export const ASCE_10_15_TABLE_C4_1_ROWS = [
  {
    memberThickness_in: '1/8',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '8.16',
    e_eq4_5_1_in: '1.35',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '0.50',
    emin_governing_in: '1.35',
    smin_eq4_5_5_in: '1.80',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.80',
    fmin_rolledEdge_in: '1.15'
  },
  {
    memberThickness_in: '3/16',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '12.23',
    e_eq4_5_1_in: '1.35',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '0.56',
    emin_governing_in: '1.35',
    smin_eq4_5_5_in: '1.80',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.80',
    fmin_rolledEdge_in: '1.15'
  },
  {
    memberThickness_in: '1/4',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '16.31',
    e_eq4_5_1_in: '1.35',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '0.63',
    emin_governing_in: '1.35',
    smin_eq4_5_5_in: '1.80',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.80',
    fmin_rolledEdge_in: '1.15'
  },
  {
    memberThickness_in: '5/16',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '16.65 [a]',
    e_eq4_5_1_in: '1.10',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '0.69',
    emin_governing_in: '1.10',
    smin_eq4_5_5_in: '< Col. 9',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.67',
    fmin_rolledEdge_in: '0.94'
  },
  {
    memberThickness_in: '3/8',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '16.65 [a]',
    e_eq4_5_1_in: '< Col. 5',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '0.75',
    emin_governing_in: '0.98',
    smin_eq4_5_5_in: '< Col. 9',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.67',
    fmin_rolledEdge_in: '0.83'
  },
  {
    memberThickness_in: '7/16',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '16.65 [a]',
    e_eq4_5_1_in: '< Col. 5',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '0.81',
    emin_governing_in: '0.98',
    smin_eq4_5_5_in: '< Col. 9',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.67',
    fmin_rolledEdge_in: '0.83'
  },
  {
    memberThickness_in: '1/2',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '16.65 [a]',
    e_eq4_5_1_in: '< Col. 5',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '0.88',
    emin_governing_in: '0.98',
    smin_eq4_5_5_in: '< Col. 9',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.67',
    fmin_rolledEdge_in: '0.83'
  },
  {
    memberThickness_in: '9/16',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '16.65 [a]',
    e_eq4_5_1_in: '< Col. 5',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '0.94',
    emin_governing_in: '0.98',
    smin_eq4_5_5_in: '< Col. 9',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.67',
    fmin_rolledEdge_in: '0.83'
  },
  {
    memberThickness_in: '5/8',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '16.65 [a]',
    e_eq4_5_1_in: '< Col. 5',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '1.00',
    emin_governing_in: '1.00',
    smin_eq4_5_5_in: '< Col. 9',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.67',
    fmin_rolledEdge_in: '0.85'
  },
  {
    memberThickness_in: '11/16',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '16.65 [a]',
    e_eq4_5_1_in: '< Col. 5',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '1.06',
    emin_governing_in: '1.06',
    smin_eq4_5_5_in: '< Col. 9',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.67',
    fmin_rolledEdge_in: '0.90'
  },
  {
    memberThickness_in: '3/4',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '16.65 [a]',
    e_eq4_5_1_in: '< Col. 5',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '1.13',
    emin_governing_in: '1.13',
    smin_eq4_5_5_in: '< Col. 9',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.67',
    fmin_rolledEdge_in: '0.96'
  },
  {
    memberThickness_in: '13/16',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '16.65 [a]',
    e_eq4_5_1_in: '< Col. 5',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '1.19',
    emin_governing_in: '1.19',
    smin_eq4_5_5_in: '< Col. 9',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.67',
    fmin_rolledEdge_in: '1.01'
  },
  {
    memberThickness_in: '7/8',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '16.65 [a]',
    e_eq4_5_1_in: '< Col. 5',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '0.98 [b]',
    emin_governing_in: '0.98 [b]',
    smin_eq4_5_5_in: '< Col. 9',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.67',
    fmin_rolledEdge_in: '0.83 [b]'
  },
  {
    memberThickness_in: '15/16',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '16.65 [a]',
    e_eq4_5_1_in: '< Col. 5',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '0.98 [b]',
    emin_governing_in: '0.98 [b]',
    smin_eq4_5_5_in: '< Col. 9',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.67',
    fmin_rolledEdge_in: '0.83 [b]'
  },
  {
    memberThickness_in: '1',
    bearingStress_ksi: 87.0,
    boltForce_P_kip: '16.65 [a]',
    e_eq4_5_1_in: '< Col. 5',
    e_eq4_5_2_in: '0.98',
    e_eq4_5_3_in: '0.98 [b]',
    emin_governing_in: '0.98 [b]',
    smin_eq4_5_5_in: '< Col. 9',
    erectionSpacing_in: '1.67',
    smin_governing_in: '1.67',
    fmin_rolledEdge_in: '0.83 [b]'
  }
];
