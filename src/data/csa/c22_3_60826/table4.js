/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 4
 * "Classification of terrain categories"
 * (See Clauses 6.2.2, 6.2.3, A.4, Table A.7, and Table A.8.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 45 (PDF Page 157)
 *   - Canadian Deviation Clause 6.2.2 (PDF Page 14)
 */

export const TABLE_4_META = {
  id: 'csa-c22.3-60826/table4',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '6.2.2 Terrain roughness',
  title: 'Classification of terrain categories',
  references: ['6.2.2', '6.2.3', 'A.4', 'Table A.7', 'Table A.8'],
  iecPage: 45,
  pdfPages: [157],
  notes: {
    usage:
      'In Table 4, the roughness factor KR represents a multiplier of the reference wind speed for conversion from one terrain category to another (VR = KR × VRB).',
    canadianDeviation:
      'Per Clause 6.2.2 (Canadian Deviation): Terrain type B is representative of the majority of lines and should lead to acceptable results in all areas except in flat coastal areas, where a terrain type A should be used.',
  },
  clauses: {
    '6.2.2': {
      title: 'Terrain roughness',
      text:
        'The roughness of the terrain crossed by the line affects the wind speed and turbulence intensity. Four categories of terrain are defined in Table 4.',
    },
    '6.2.2 (Canadian Deviation)': {
      title: 'Terrain roughness (Canadian Deviation)',
      text:
        'Terrain type B is representative of the majority of lines and should lead to acceptable results in all areas except in flat coastal areas, where a terrain type A should be used.',
    },
    '6.2.3': {
      title: 'Reference wind speed VR',
      text:
        'VR is defined as the reference wind speed (m/s) corresponding to a return period T at 10 m above ground with an averaging period of 10 min. If the reference wind speed for terrain category B (VRB) is known, VR can be determined with VR = KR × VRB, where KR is the roughness factor.',
    },
  },
};

export const TABLE_4_ROWS = [
  {
    category: 'A',
    roughnessCharacteristics: 'Large stretch of water upwind, flat coastal areas',
    KR: 1.08,
  },
  {
    category: 'B',
    roughnessCharacteristics:
      'Open country with very few obstacles, for example airports or cultivated fields with few trees or buildings',
    KR: 1.00,
  },
  {
    category: 'C',
    roughnessCharacteristics: 'Terrain with numerous small obstacles of low height (hedges, trees and buildings)',
    KR: 0.85,
  },
  {
    category: 'D',
    roughnessCharacteristics: 'Suburban areas or terrain with many tall trees',
    KR: 0.67,
  },
];

export const TABLE_4_TERRAIN_CATEGORIES = TABLE_4_ROWS;
