/**
 * CSA C22.3 No. 1 — Table 24
 * "Minimum in-span vertical clearances between supply and communication conductors"
 * (See Clauses 5.10.3.2 and A.5.10.3.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 100 (PDF Page 105)
 *   - Clause 5.10.3.2, 5.10.3.3, Page 49-50 (PDF Page 54-55)
 *   - Clause A.5.10.3, Page 131 (PDF Page 136)
 *
 * All clearances in MILLIMETRES (mm).
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_24_META = {
  id: 'csa-c22.3-no1/table24',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum in-span vertical clearances between supply and communication conductors',
  unit: 'mm',
  references: ['5.10.3.2', '5.10.3.3', 'A.5.10.3'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'For effectively grounded neutral, see Clause 5.10.3.3.',
    footnoteDagger:
      'While the use of the design limit of 75 mm can yield a minimum actual clearance of approximately 300 mm under the worst expected conditions, most situations will result in clearances in excess of 600 mm.',
  },
  clauses: {
    '5.10.3.2': {
      title: 'In-span vertical clearances',
      text: 'The minimum in-span vertical clearances between supply conductors and communication wire or cable under the condition of maximum sag in the supply conductors shall be as specified in Table 24.',
    },
    '5.10.3.3': {
      title: 'Multi-grounded neutral requirements',
      text:
        'For effectively grounded neutral conductors of multi-grounded neutral distribution circuits that do not exceed 26 kV and are located 300 mm or more below phase conductors:\n' +
        'a) on spans ≤ 75 m, minimum separations at the structure shall be adjusted such that the neutral does not fall below the line of sight of the highest communication conductor; and\n' +
        'b) on spans > 75 m, the common grounded neutral may sag below the line of sight of the communication attachments, provided that it is a minimum of 300 mm above the in-span communication conductors under maximum sag (thermal or winter load) and communication sag at 45 °C.',
    },
    'A.5.10.3': {
      title: 'Table 24 rationale',
      text: 'Table 24 specifies a minimum 75 mm clearance under conditions of maximum sag in the upper conductor with little or no sag in the lower wire. The lower wire can be galloping, so that the highest point in the span is level with the points of support.',
    },
  },
};

export const TABLE_24_ROWS = [
  {
    voltageClass: '0–750 V with thermoplastic weatherproof covering',
    vMinKv: 0,
    vMaxKv: 0.75,
    covering: 'thermoplastic_weatherproof',
    minClearanceAboveLineOfSight_mm: 2,
  },
  {
    voltageClass: '0–750 V with other covering or bare',
    vMinKv: 0,
    vMaxKv: 0.75,
    covering: 'bare_or_other',
    minClearanceAboveLineOfSight_mm: 75,
  },
  {
    voltageClass: '> 0.75 kV and ≤ 15 kV',
    vMinKv: 0.75,
    vMaxKv: 15,
    minClearanceAboveLineOfSight_mm: 300,
  },
  {
    voltageClass: '> 15 kV and ≤ 22 kV',
    vMinKv: 15,
    vMaxKv: 22,
    minClearanceAboveLineOfSight_mm: 380,
  },
  {
    voltageClass: '> 22 kV and ≤ 250 kV',
    vMinKv: 22,
    vMaxKv: 250,
    baseClearance_mm: 380,
    adderPerKv: 10,
    thresholdKv: 22,
    formula: '380 + 10 mm/kV over 22 kV',
  },
];
