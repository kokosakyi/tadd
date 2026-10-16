/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.7
 * "Definition of terrain category"
 * (See Annex A, Clause A.4.1 and Table 4.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 151 (PDF Page 263)
 */

export const TABLE_A7_META = {
  id: 'csa-c22.3-60826/tableA7',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.4.1 Terrain roughness',
  title: 'Definition of terrain category',
  references: ['6.2.2', 'A.4.1', 'Table 4', 'Table A.8'],
  iecPage: 151,
  pdfPages: [263],
  notes: {
    topographyGuidance:
      'For a line that follows the ridge of a hill, a terrain roughness which is smoother by one category than the one chosen for the area should be selected in order to be conservative. For a line running along a valley, the C roughness should be chosen for all cases, whatever the terrain characteristics may be.',
  },
  clauses: {
    'A.4.1': {
      title: 'Terrain roughness',
      text: 'Four categories of terrain, of increasing roughness, are considered as indicated in Table A.7.',
    },
  },
};

export const TABLE_A7_ROWS = [
  {
    category: 'A',
    characteristic: 'Large stretch of water up-wind, flat coastal area, flat desert',
  },
  {
    category: 'B',
    characteristic: 'Open country with very few obstacles, for instance moorlands or cultivated field with a few trees or buildings',
  },
  {
    category: 'C',
    characteristic: 'Terrain with numerous small obstacles of low height (hedges, trees and buildings)',
  },
  {
    category: 'D',
    characteristic: 'Suburban areas or terrain with many tall trees',
  },
];

export const TABLE_A7_TERRAIN_DEFINITIONS = TABLE_A7_ROWS;
