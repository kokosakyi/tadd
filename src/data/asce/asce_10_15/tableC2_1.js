/**
 * ASCE/SEI 10-15 — Table C2-1 (Figure C2-1)
 * "Potential Diaphragm and Horizontal Plan Bracing Locations"
 * (See Clauses 2.3, C2.3, 3.7.4.3, and 3.7.4.4, Page 30.)
 */

export const TABLE_C2_1_META = {
  id: 'asce_10_15/tableC2_1',
  standard: 'ASCE 10-15',
  title: 'Potential Horizontal Plan Bracing and Diaphragm Locations (Fig. C2-1)',
  unit: 'ft (m)',
  evaluatedAt: 'Self-Supporting Latticed Steel Transmission Towers (For towers $> 200\\text{ ft}$ [$61\\text{ m}$] or heavy dead-end towers, max diaphragm interval $= 75\\text{ ft}$ [$23\\text{ m}$])',
  references: ['2.3', 'C2.3', '3.7.4.3', '3.7.4.4'],
  notes: [
    'Horizontal bracing in the face of the tower, with an internal diaphragm, provides rigidity and distributes shear and torsional forces.',
    'Plan bracing without internal cross-diaphragm diagonals provides inadequate torsional rigidity unless triangulated.',
    'For structures taller than $200\\text{ ft}$ ($61\\text{ m}$) or heavy dead-end towers, horizontal bracing with a diaphragm is suggested at intervals $\\le 75\\text{ ft}$ ($23\\text{ m}$).'
  ]
};

export const ASCE_10_15_TABLE_C2_1_ROWS = [
  {
    locationId: '1',
    towerLevel: 'Top (Shield Wire / Peak Level)',
    diaphragmRequirement: 'Diaphragm optional',
    engineeringComments: 'Top of tower peak assembly; plan diaphragm is optional.'
  },
  {
    locationId: '2',
    towerLevel: 'Upper Crossarm / Bridge Level',
    diaphragmRequirement: 'Diaphragm recommended',
    engineeringComments: 'Distributes transverse, longitudinal, and torsional loads from upper conductor phases.'
  },
  {
    locationId: '3',
    towerLevel: 'Torsion Level (Conductor Crossarm Levels)',
    diaphragmRequirement: 'Diaphragm recommended',
    engineeringComments: 'Required at primary torsion application levels to resist unbalanced longitudinal wire loads and oblique wind.'
  },
  {
    locationId: '4',
    towerLevel: 'Crossarm Hanger / Bridge Chord Level',
    diaphragmRequirement: 'Optional, unless hanger is in compression',
    engineeringComments: 'Diaphragm is optional when hanger members are strictly in tension, but required if hanger carries compression.'
  },
  {
    locationId: '5',
    towerLevel: 'Change in Slope of Post Member (Waist / Bend Line)',
    diaphragmRequirement: 'Diaphragm recommended',
    engineeringComments: 'Required at levels where there is a change in the slope of the structure leg to resist radial kick-out forces.'
  },
  {
    locationId: '6',
    towerLevel: 'Intermediate Tower Body Level',
    diaphragmRequirement: 'Suggested at intervals $\\le 75\\text{ ft}$ ($23\\text{ m}$)',
    engineeringComments: 'When diaphragm is omitted and the horizontal member is continuous, the horizontal member can be treated as a redundant member per Section 3.7.4.3. Horizontal deflection should also be considered when tower face width is large.'
  },
  {
    locationId: '7, 8',
    towerLevel: 'Basic Tower and Body Extension Interface',
    diaphragmRequirement: 'Diaphragm optional (Sec. 3.7.4.4 applies if omitted)',
    engineeringComments: 'Diaphragm is optional; however, Section 3.7.4.4 (Unsupported Length with Varying Forces) is applicable when it is omitted.'
  },
  {
    locationId: '9',
    towerLevel: 'Top of Leg Extensions',
    diaphragmRequirement: 'Diaphragm (oblique face bracing) recommended',
    engineeringComments: 'Diaphragm (oblique face bracing) is recommended with due consideration given to oblique face stability.'
  }
];
