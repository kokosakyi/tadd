/**
 * CSA O15-15 — Table 2 / Table E.2
 * "Maximum spiral grain"
 * (See Clauses 4.4.11 and E.1.)
 */

export const TABLE_2_META = {
  id: 'csa-o15/table2',
  standard: 'CSA O15-15',
  title: 'Maximum spiral grain',
  references: ['4.4.11', 'E.1'],
  notes: {
    definition: 'Spiral grain (twisted grain) is a type of growth in which the fibres take a spiral course around the trunk.'
  }
};

export const CSA_O15_SPIRAL_GRAIN = {
  "imperial": [
    {
      "poleLengthRange": "30 ft and shorter",
      "maxTwistPermitted": "1 complete twist in any 10 ft length"
    },
    {
      "poleLengthRange": "31-49 ft",
      "maxTwistPermitted": "1 complete twist in any 16 ft length"
    },
    {
      "poleLengthRange": "50 ft and longer",
      "maxTwistPermitted": "1 complete twist in any 20 ft length"
    }
  ],
  "metric": [
    {
      "poleLengthRange": "9.1 m and shorter",
      "maxTwistPermitted": "1 complete twist in any 3 m length"
    },
    {
      "poleLengthRange": "10.7-13.7 m",
      "maxTwistPermitted": "1 complete twist in any 4.9 m length"
    },
    {
      "poleLengthRange": "15.2 m and longer",
      "maxTwistPermitted": "1 complete twist in any 6.1 m length"
    }
  ]
};
