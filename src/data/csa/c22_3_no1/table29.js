/**
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
      'The grade of construction may be Grade 2 where one of the following conditions exists:\n' +
      'a) the supply and communications lines have coordinated electrical protection (see Clause 4.4);\n' +
      'b) where coordinated electrical protection is not practical, the supply conductors have a rated tensile strength of 12.4 kN or greater; or\n' +
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
