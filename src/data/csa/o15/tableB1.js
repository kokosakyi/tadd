/**
 * CSA O15-15 — Table B.1
 * "Horizontal loads for standard classes of wood utility poles"
 * (See Clause B.1.1 and Tables 7 to 9 / Tables E.7 to E.9.)
 *
 * Ground truth verified against CSA O15-15 Annex B Table B.1:
 * - 14 standard classes: H6 down to 8.
 * - Load application point is 0.61 m (2 ft) from the top of the pole.
 * - Correction factor 0.95 applies to western red cedar, red pine, and jack pine.
 */

export const TABLE_B1_META = {
  id: 'csa-o15/tableB1',
  standard: 'CSA O15-15',
  annex: 'Annex B (informative)',
  title: 'Horizontal loads for standard classes of wood utility poles',
  references: ['B.1.1', 'Tables 7-9', 'Tables E.7-E.9'],
  loadApplicationPoint: '0.61 m (2 ft) from the top of the pole',
  notes: {
    reductionFactorWesternRedCedar: 0.95,
    reductionFactorRedPine: 0.95,
    reductionFactorJackPine: 0.95,
    footnote: 'The loads specified in this Table should be corrected by a factor of 0.95 for western red cedar, red pine, and jack pine.'
  }
};

export const CSA_O15_POLE_CLASSES = [
  {
    "class": "H6",
    "load_N": 50700,
    "load_kN": 50.7,
    "load_lbf": 11400,
    "description": "Heavy transmission class H6"
  },
  {
    "class": "H5",
    "load_N": 44500,
    "load_kN": 44.5,
    "load_lbf": 10000,
    "description": "Heavy transmission class H5"
  },
  {
    "class": "H4",
    "load_N": 38700,
    "load_kN": 38.7,
    "load_lbf": 8700,
    "description": "Heavy transmission class H4"
  },
  {
    "class": "H3",
    "load_N": 33400,
    "load_kN": 33.4,
    "load_lbf": 7500,
    "description": "Heavy transmission class H3"
  },
  {
    "class": "H2",
    "load_N": 28500,
    "load_kN": 28.5,
    "load_lbf": 6400,
    "description": "Heavy transmission class H2"
  },
  {
    "class": "H1",
    "load_N": 24000,
    "load_kN": 24.0,
    "load_lbf": 5400,
    "description": "Heavy transmission class H1"
  },
  {
    "class": "1",
    "load_N": 20000,
    "load_kN": 20.0,
    "load_lbf": 4500,
    "description": "Standard class 1"
  },
  {
    "class": "2",
    "load_N": 16500,
    "load_kN": 16.5,
    "load_lbf": 3700,
    "description": "Standard class 2"
  },
  {
    "class": "3",
    "load_N": 13300,
    "load_kN": 13.3,
    "load_lbf": 3000,
    "description": "Standard class 3"
  },
  {
    "class": "4",
    "load_N": 10700,
    "load_kN": 10.7,
    "load_lbf": 2400,
    "description": "Standard class 4"
  },
  {
    "class": "5",
    "load_N": 8500,
    "load_kN": 8.5,
    "load_lbf": 1900,
    "description": "Standard class 5"
  },
  {
    "class": "6",
    "load_N": 6700,
    "load_kN": 6.7,
    "load_lbf": 1500,
    "description": "Standard class 6"
  },
  {
    "class": "7",
    "load_N": 5300,
    "load_kN": 5.3,
    "load_lbf": 1200,
    "description": "Standard class 7"
  },
  {
    "class": "8",
    "load_N": 4300,
    "load_kN": 4.3,
    "load_lbf": 960,
    "description": "Standard class 8"
  }
];
