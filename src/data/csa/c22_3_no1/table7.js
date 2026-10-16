/**
 * CSA C22.3 No. 1 — Table 7
 * "Minimum horizontal separations from supporting structures to railway tracks"
 * (See Clauses 5.5.2, 5.5.3, 5.5.4, and 5.5.5.)
 *
 * Transcribed from:
 *   - sandbox/csa c22 no 1/Table 7/Table 7.png
 *   - sandbox/csa c22 no 1/Table 7/Cl 5.5.2_5.5.3.png
 *   - sandbox/csa c22 no 1/Table 7/Cl. 5.5.4_Cl_5.5.5.png
 *
 * All separations in METRES.
 *
 * This file is DATA ONLY. Evaluation and calculation logic live in src/utils/csaTable7Resolver.js.
 */

export const TABLE_7_META = {
  id: 'csa-c22.3-no1/table7',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum horizontal separations from supporting structures to railway tracks',
  unit: 'm',
  references: ['5.5.2', '5.5.3', '5.4.3', '5.5.4', '5.5.5'],
  clauses: {
    '5.5.2':
      'Where there is no curvature of the railway tracks, the minimum horizontal separation between the tracks and supporting structures shall be as specified in Table 7, but shall be increased, where applicable, to comply with Clauses 5.5.4 and 5.5.5.',
    '5.5.3':
      'At a point of curvature of the railway tracks, the minimum horizontal separation shall be that specified in Table 7, plus the increment required by Clause 5.4.3. This minimum horizontal separation shall be increased, where applicable, to comply with Clauses 5.5.4 and 5.5.5.',
    '5.4.3':
      'At a point of curvature of a railway track, the horizontal clearances shall be as specified in Table 6, with an increment of 25 mm added for each degree of curvature. In addition, where the wire is closer to the low side of tracks that are at different elevations, a further increment of 2.5 mm shall be added for each millimetre of superelevation. (The total of these two increments shall not exceed 0.75 m, and the value of 0.75 m may be used in place of calculations.)',
    '5.5.4':
      'At loading sidings, sufficient space shall be left for a driveway, in accordance with the stated needs of the railway.',
    '5.5.5':
      'In all cases, horizontal separations shall be great enough to permit an unobstructed view of signals, signs, and similar equipment.',
  },
};

/**
 * Table 7 Track rows and base horizontal separation distances (m)
 * for straight, level runs.
 */
export const TABLE_7_ROWS = [
  {
    id: 'main_tracks',
    name: 'Main tracks (straight, level runs)',
    trackType: 'Main tracks',
    description: 'Main railway tracks (straight, level runs)',
    minHorizontalSeparation: 2.5, // metres
  },
  {
    id: 'sidings',
    name: 'Sidings (straight, level runs)',
    trackType: 'Sidings',
    description: 'Railway siding tracks (straight, level runs)',
    minHorizontalSeparation: 1.9, // metres
  },
];
