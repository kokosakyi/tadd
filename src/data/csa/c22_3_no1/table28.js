/**
 * CSA C22.3 No. 1 — Table 28
 * "Minimum grades of construction for proximities"
 * (See Clauses 6.3.1, 6.3.3, 7.8.1.1, 7.8.2.1, 7.8.2.4, 7.9.1, A.7.8.2, and A.8.1.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 103 (PDF Page 108)
 *   - Clause 6.3.3, Page 52 (PDF Page 57)
 */

export const TABLE_28_META = {
  id: 'csa-c22.3-no1/table28',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum grades of construction for proximities',
  references: ['6.3.1', '6.3.3', '7.8.1.1', '7.8.2.1', '7.8.2.4', '7.9.1', 'A.7.8.2', 'A.8.1'],
  notes: {
    footnoteStar: 'The line may be Grade 2 if the supply and communications lines have coordinated electrical protection (see Clause 4.4).',
    footnoteDagger: 'Grade 3 construction may be used where the supply conductors at the upper level, or the supply conductors creating the proximity, are in effectively grounded continuous metallic sheathed cable.',
  },
  clauses: {
    '6.3.3': {
      title: 'Proximities',
      text: 'Table 28 specifies the minimum grades of construction where structures or conductors of one line are in proximity to another line or facility.',
    },
  },
};

export const TABLE_28_ROWS = [
  {
    inProximityTo: 'Railway control facilities and tracks',
    communicationGrade: 1,
    supply0to750vOrMetallicGrade: 1,
    supplyOver750vGrade: 1,
  },
  {
    inProximityTo: 'Limited- or controlled-access highways',
    communicationGrade: 1,
    supply0to750vOrMetallicGrade: 1,
    supplyOver750vGrade: 1,
  },
  {
    inProximityTo: 'Roads and highways — General',
    communicationGrade: 3,
    supply0to750vOrMetallicGrade: 3,
    supplyOver750vGrade: 3,
  },
  {
    inProximityTo: 'Pipelines and waterways that do not require permits',
    communicationGrade: 3,
    supply0to750vOrMetallicGrade: 3,
    supplyOver750vGrade: 3,
  },
  {
    inProximityTo: 'Navigable waterways requiring permits',
    communicationGrade: 1,
    supply0to750vOrMetallicGrade: 1,
    supplyOver750vGrade: 1,
  },
  {
    inProximityTo: 'Aerial tramways',
    communicationGrade: 1,
    supply0to750vOrMetallicGrade: 1,
    supplyOver750vGrade: 1,
  },
  {
    inProximityTo: 'Other private or public property',
    communicationGrade: 3,
    supply0to750vOrMetallicGrade: 3,
    supplyOver750vGrade: 3,
  },
  {
    inProximityTo: 'Communications: Cable',
    communicationGrade: 3,
    supply0to750vOrMetallicGrade: 2,
    supplyOver750vGrade: '1*',
  },
  {
    inProximityTo: 'Communications: Open wire — General',
    communicationGrade: 3,
    supply0to750vOrMetallicGrade: 2,
    supplyOver750vGrade: '1*',
  },
  {
    inProximityTo: 'Communications: Drop wire',
    communicationGrade: 3,
    supply0to750vOrMetallicGrade: 3,
    supplyOver750vGrade: 3,
  },
  {
    inProximityTo: 'Supply: 0–750 V',
    communicationGrade: 2,
    supply0to750vOrMetallicGrade: 3,
    supplyOver750vGrade: '2†',
  },
  {
    inProximityTo: 'Supply: > 750 V',
    communicationGrade: 1,
    supply0to750vOrMetallicGrade: 2,
    supplyOver750vGrade: 2,
  },
];
