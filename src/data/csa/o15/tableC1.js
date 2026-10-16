/**
 * CSA O15-15 — Table C.1
 * "Standard classes of reinforcing stubs"
 * (See Clauses C.1 to C.4 and Tables 14 to 23 / Tables E.14 to E.23.)
 */

export const TABLE_C1_META = {
  id: 'csa-o15/tableC1',
  standard: 'CSA O15-15',
  annex: 'Annex C (informative)',
  title: 'Standard classes of reinforcing stubs',
  references: ['C.1', 'C.2', 'C.3', 'C.4', 'Tables 14-23', 'Tables E.14-E.23'],
  notes: {
    basis: 'A stub should have a life at least equal to the remaining life of the pole. The circumference at 1.83 m (6 ft) from the butt of the stub is approximately 51 mm (2 in) less than that of a new replacement pole adequate to support the load.'
  }
};

export const CSA_O15_STUB_CLASSES = [
  {
    "class": "Z",
    "associatedPoleClasses": [
      "1",
      "2"
    ],
    "lengths_ft": [
      10.0,
      11.0,
      13.0,
      15.5,
      19.5
    ],
    "lengths_m": [
      3.0,
      3.4,
      4.0,
      4.7,
      5.9
    ],
    "designBasis": "Develops expected remaining strength of longest pole of Class 1"
  },
  {
    "class": "Y",
    "associatedPoleClasses": [
      "3",
      "4"
    ],
    "lengths_ft": [
      10.0,
      11.0,
      13.0,
      15.5,
      19.5
    ],
    "lengths_m": [
      3.0,
      3.4,
      4.0,
      4.7,
      5.9
    ],
    "designBasis": "Develops expected remaining strength of longest pole of Class 3"
  },
  {
    "class": "X",
    "associatedPoleClasses": [
      "5",
      "6"
    ],
    "lengths_ft": [
      10.0,
      11.0,
      13.0,
      15.5,
      19.5
    ],
    "lengths_m": [
      3.0,
      3.4,
      4.0,
      4.7,
      5.9
    ],
    "designBasis": "Develops expected remaining strength of longest pole of Class 5"
  },
  {
    "class": "W",
    "associatedPoleClasses": [
      "7",
      "8"
    ],
    "lengths_ft": [
      10.0,
      11.0,
      13.0,
      15.5,
      19.5
    ],
    "lengths_m": [
      3.0,
      3.4,
      4.0,
      4.7,
      5.9
    ],
    "designBasis": "Develops expected remaining strength of longest pole of Class 7"
  }
];
