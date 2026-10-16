/**
 * CSA C22.3 No. 60826-10 (R2015) — Table CB.1
 * "Default values for distribution lines and structures"
 * (See Annex CB, Clause CB.2.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 60826-10, Annex CB, Page CSA/50 (PDF Page 52)
 */

export const TABLE_CB1_META = {
  id: 'csa-c22.3-60826/tableCB1',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  section: 'Annex CB (Informative)',
  title: 'Default values for distribution lines and structures',
  references: ['CB.1', 'CB.2', 'Table CA.2'],
  pdfPages: [52],
  notes: {
    footnoteStar:
      'The adjustment factor of 1.5 mentioned in this Standard includes a height factor of 1.15 for typical transmission conductors. Since distribution conductors are at a height of about 10 m, the factor of 1.15 should not be used; therefore, the applicable spatial factor for icing thickness on distribution lines should be: 1.5/1.15 = 1.3.',
    footnoteDagger: 'Refer to IEC Figure 3 (referenced as Table 3 in footnote) for a conductor height of 10 m and terrain type B.',
    footnoteDblDagger: 'Refer to IEC Figure 4 (referenced as Table 4 in footnote) for spans less than 200 m.',
    footnoteSection: 'Wind is always considered perpendicular to spans.',
    footnoteDoubleStar: 'Typical of Canadian conditions during persistence of ice on conductors, particularly after icing storms.',
    footnoteDoubleDagger:
      'Reflects increase in air density for colder temperatures since high winds in Canada occur during colder seasons. In this Standard, the air density correction factor for wind only is 1.04 and 1.1 for wind and ice combinations. For the purpose of simplifying calculations for distribution lines, a single default air density correction factor of 1.1 may be used for all wind-related loads.',
    footnoteTripleDagger: 'Considered the same as for conductors.',
    footnoteDoubleSection:
      'This value could be reduced to 25 years. In that case, the wind speed and ice thickness in the weather maps would be adjusted by the factors specified in Table CA.2.',
  },
  clauses: {
    'CB.2': {
      title: 'Simplification assumptions for distribution lines',
      text: 'Table CB.1 provides the default values that are typical of distribution lines and structures.',
    },
  },
};

export const TABLE_CB1_ROWS = [
  {
    id: 'structure_height',
    parameter: 'Height of structure and poles',
    symbol: 'h',
    value: 10,
    unit: 'm',
    displayValue: '10 m',
  },
  {
    id: 'conductor_height',
    parameter: 'Height of conductors',
    symbol: 'z',
    value: 10,
    unit: 'm',
    displayValue: '10 m',
  },
  {
    id: 'ice_spatial_factor',
    parameter: 'Ice correction from point to space values',
    symbol: 'Sa',
    value: 1.3,
    unit: 'unitless',
    displayValue: '1.3',
    footnote: 'footnoteStar',
  },
  {
    id: 'wood_pole_drag_coeff',
    parameter: 'Wood poles drag coefficient',
    symbol: 'Ct',
    value: 1.0,
    unit: 'unitless',
    displayValue: '1.0',
  },
  {
    id: 'conductor_drag_coeff',
    parameter: 'Conductor drag coefficient',
    symbol: 'Cd',
    value: { le_15mm: 1.2, gt_15mm: 1.0 },
    unit: 'unitless',
    displayValue: '1.2 for conductor diameters ≤ 15 mm; 1.0 for conductor diameters > 15 mm',
  },
  {
    id: 'conductor_gust_response_factor',
    parameter: 'Wind gust response factor for conductor',
    symbol: 'Gc',
    value: 1.85,
    unit: 'unitless',
    displayValue: '1.85',
    footnote: 'footnoteDagger',
  },
  {
    id: 'typical_span_range',
    parameter: 'Typical span range',
    symbol: 'L',
    value: { min: 60, max: 120 },
    unit: 'm',
    displayValue: '60–120 m',
  },
  {
    id: 'span_factor',
    parameter: 'Span factor',
    symbol: 'GL',
    value: 1.0,
    unit: 'unitless',
    displayValue: '1.0',
    footnote: 'footnoteDblDagger',
  },
  {
    id: 'wind_angle',
    parameter: 'Wind angle with line direction',
    symbol: 'θ',
    value: 90,
    unit: 'deg',
    displayValue: '90°',
    footnote: 'footnoteSection',
  },
  {
    id: 'temp_wind_only',
    parameter: 'Temperature associated with wind only',
    symbol: 'T_wind',
    value: 0,
    unit: '°C',
    displayValue: '0 °C',
  },
  {
    id: 'temp_wind_ice',
    parameter: 'Temperature associated with wind + ice',
    symbol: 'T_ice',
    value: -10,
    unit: '°C',
    displayValue: '–10 °C or lower',
    footnote: 'footnoteDoubleStar',
  },
  {
    id: 'air_density_factor_wind_only',
    parameter: 'Air density correction factor for wind only',
    symbol: 'τ_wind',
    value: 1.04,
    unit: 'unitless',
    displayValue: '1.04',
    footnote: 'footnoteDoubleDagger',
  },
  {
    id: 'air_density_factor_ice_wind',
    parameter: 'Air density correction factor for ice + wind conditions',
    symbol: 'τ_ice',
    value: 1.1,
    unit: 'unitless',
    displayValue: '1.1',
    footnote: 'footnoteDoubleDagger',
  },
  {
    id: 'pole_insulator_gust_factor',
    parameter: 'Gust response factor for poles and insulators',
    symbol: 'Gt',
    value: 1.85,
    unit: 'unitless',
    displayValue: '1.85',
    footnote: 'footnoteTripleDagger',
  },
  {
    id: 'terrain_category',
    parameter: 'Terrain category',
    symbol: 'Category',
    value: 'B',
    unit: 'category',
    displayValue: 'B',
  },
  {
    id: 'return_period',
    parameter: 'Return period of weather variables',
    symbol: 'T',
    value: 50,
    unit: 'years',
    displayValue: '50 years',
    footnote: 'footnoteDoubleSection',
  },
  {
    id: 'high_prob_wind_ratio',
    parameter: 'High probability wind (low value) to be combined with high icing (C1)',
    symbol: 'BiH',
    value: 0.40,
    unit: 'ratio',
    displayValue: '40% × design wind speed',
  },
  {
    id: 'low_prob_wind_ratio',
    parameter: 'Low probability wind (high value) to be combined with average icing (C2)',
    symbol: 'BiL',
    value: 0.60,
    unit: 'ratio',
    displayValue: '60% × design wind speed',
  },
  {
    id: 'low_ice_weight_ratio',
    parameter: 'Low (average) ice during high winds (C2)',
    symbol: 'gH / gR',
    value: 0.50,
    unit: 'ratio',
    displayValue: '50% of design ice weight',
  },
];

export const TABLE_CB1_DEFAULT_VALUES = TABLE_CB1_ROWS;
