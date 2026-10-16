/**
 * CSA O15-15 — Table 1 / Table E.1
 * "Maximum knot sizes"
 * (See Clauses 3, 4.4.7, and E.1.)
 */

export const TABLE_1_META = {
  id: 'csa-o15/table1',
  standard: 'CSA O15-15',
  title: 'Maximum knot sizes',
  references: ['3', '4.4.7', 'E.1'],
  notes: {
    measurementMethod: 'The diameter of any single knot is measured at the widest point of the knot, perpendicular to the length of the pole, and includes the sapwood and heartwood of the knot, as shown in Figure 3.',
    disregardLimit: 'Knots 13 mm (1/2 in) or less in diameter shall be ignored in applying the limitations for the sum of diameters.'
  }
};

export const CSA_O15_KNOT_SIZES = {
  "imperial": [
    {
      "poleLengthRange": "45 ft and shorter",
      "maxSingleKnot_H6_to_3_in": 4.0,
      "maxSingleKnot_4_to_7_in": 3.0,
      "maxSumKnotsIn1ft_in": "One-third of average circumference of 1 ft section or 8 in, whichever is greater, not to exceed 12 in"
    },
    {
      "poleLengthRange": "50 ft and longer",
      "maxSingleKnot_H6_to_3_in": 5.0,
      "maxSingleKnot_4_to_7_in": 5.0,
      "maxSumKnotsIn1ft_in": "One-third of average circumference of 1 ft section or 10 in, whichever is greater, not to exceed 14 in"
    }
  ],
  "metric": [
    {
      "poleLengthRange": "13.7 m and shorter",
      "maxSingleKnot_H6_to_3_mm": 102,
      "maxSingleKnot_4_to_7_mm": 76,
      "maxSumKnotsIn0_3m_mm": "One-third of average circumference of 0.3 m section or 203 mm, whichever is greater, not to exceed 31 cm"
    },
    {
      "poleLengthRange": "15.2 m and longer",
      "maxSingleKnot_H6_to_3_mm": 127,
      "maxSingleKnot_4_to_7_mm": 127,
      "maxSumKnotsIn0_3m_mm": "One-third of average circumference of 0.3 m section or 254 mm, whichever is greater, not to exceed 36 cm"
    }
  ]
};
