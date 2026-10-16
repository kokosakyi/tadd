/**
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
      'The grade of construction may be Grade 2 where one of the following conditions exists:\n' +
      'a) the supply and communication lines have coordinated electrical protection (see Clause 4.4);\n' +
      'b) where coordinated electrical protection is not practical, the supply conductors have a rated tensile strength of 12.4 kN or greater; or\n' +
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
