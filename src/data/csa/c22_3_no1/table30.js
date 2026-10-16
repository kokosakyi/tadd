/**
 * CSA C22.3 No. 1 — Table 30
 * "Deterministic weather loads"
 * (See Clauses 7.2, 7.3.1, 7.3.5, 7.5.1, 7.6.2.1, and A.7.3.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 104 (PDF Page 109)
 *   - Clauses 7.2, 7.3, Pages 53-55 (PDF Pages 58-60)
 *   - Clause A.7.3, Page 132 (PDF Page 137)
 */

export const TABLE_30_META = {
  id: 'csa-c22.3-no1/table30',
  standard: 'CSA C22.3 No. 1',
  title: 'Deterministic weather loads',
  references: ['7.2', '7.3.1', '7.3.5', '7.5.1', '7.6.2.1', 'A.7.3', 'Annex C'],
  notes: {
    footnoteStar: 'When large conductors are used in locations where high winds are prevalent, the loading on bare conductors should be assessed, as high winds can produce a transverse loading in excess of the wind and ice combinations.',
    footnoteDagger: 'On small conductors, the ice effect is more significant than on large conductors, as it constitutes a greater percentage of the total mass.',
    footnoteDblDagger: 'See Clause 7.2 and Annex C for geographic loading area boundaries across Canada.',
    windVelocityEquivalents: '400 N/m² corresponds to ~25 m/s (~90 km/h) hourly steady-state wind; 300 N/m² corresponds to ~21 m/s (~76 km/h).',
    iceDensity: 'Ice density is assumed to be 900 kg/m³ per Clause 7.3.1(a).',
  },
  clauses: {
    '7.2': {
      title: 'Weather loads',
      text:
        'This Standard recognizes the following four deterministic weather load conditions (see Table 30):\n' +
        'a) severe loading area;\n' +
        'b) heavy loading area;\n' +
        'c) medium loading area A; and\n' +
        'd) medium loading area B.\n' +
        'The territorial and provincial boundaries of each loading area are shown on the loading map in Annex C. Loading boundaries are approximate and utilities may adopt higher loadings where local experience indicates.',
    },
    '7.3.1': {
      title: 'Assumed loads for wire and cable attachments',
      text:
        'The assumed loads on line conductors, cables, and messengers shall be determined using\n' +
        'a) the radial thickness of ice specified in Table 30 and assuming the density of ice to be 900 kg/m³; and\n' +
        'b) the wind pressure (as specified in Table 30) acting horizontally on ice-covered wires and cable attachments.',
    },
    '7.5.1': {
      title: 'Assumed vertical load on supports',
      text: 'The assumed vertical load on a structure shall be its own weight plus the vertical load from attachments. The radial thickness of ice, as specified in Table 30, shall be applied only to wire and cable attachments. Structures and attachments not supporting wires need not be assumed ice-covered under deterministic loads.',
    },
    '7.6.2.1': {
      title: 'Assumed transverse load on a structure',
      text: 'The assumed transverse load on a structure shall be the wire load specified in Clause 7.6.1 plus the load created by wind pressure (as specified in Table 30) on the surfaces of the structure without an ice covering.',
    },
  },
};

export const TABLE_30_LOADING_AREAS = [
  {
    id: 'severe',
    name: 'Severe',
    radialIceThickness_mm: 19.0,
    horizontalWindPressure_Pa: 400, // N/m²
    temperature_C: -20,
    approxWindVelocity_ms: 25,
    description: 'Severe loading area (coastal / extreme icing regions)',
  },
  {
    id: 'heavy',
    name: 'Heavy',
    radialIceThickness_mm: 12.5,
    horizontalWindPressure_Pa: 400, // N/m²
    temperature_C: -20,
    approxWindVelocity_ms: 25,
    description: 'Heavy loading area (standard across most of Eastern/Central Canada)',
  },
  {
    id: 'medium_a',
    name: 'Medium A',
    radialIceThickness_mm: 6.5,
    horizontalWindPressure_Pa: 400, // N/m²
    temperature_C: -20,
    approxWindVelocity_ms: 25,
    description: 'Medium loading area A (prairie & interior regions with lower ice, 400 Pa wind)',
  },
  {
    id: 'medium_b',
    name: 'Medium B',
    radialIceThickness_mm: 12.5,
    horizontalWindPressure_Pa: 300, // N/m²
    temperature_C: -20,
    approxWindVelocity_ms: 21,
    description: 'Medium loading area B (interior valleys with higher ice, 300 Pa wind)',
  },
];
