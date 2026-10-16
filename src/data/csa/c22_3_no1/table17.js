/**
 * CSA C22.3 No. 1 — Table 17
 * "Minimum horizontal separations of supply-line conductors attached to the same supporting structure"
 * (See Clauses 5.9.1.1, 5.9.1.2, and 5.9.1.3.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 94 (PDF Page 99)
 *   - Clause 5.9.1, Page 46 (PDF Page 51)
 *
 * All separations in MILLIMETRES (mm).
 * Note: Voltages are line-to-ground unless specified as phase-to-phase / circuit sum.
 */

export const TABLE_17_META = {
  id: 'csa-c22.3-no1/table17',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum horizontal separations of supply-line conductors attached to the same supporting structure',
  unit: 'mm',
  references: ['5.9.1.1', '5.9.1.2', '5.9.1.3'],
  notes: {
    footnoteStar:
      'For spans longer than 450 m, the separation shall be based on best engineering practices, but shall be not less than the separations specified for spans of 450 m.',
    footnoteDagger:
      'Phase-to-phase voltages for the same circuit or the sum of phase-to-ground voltages for different circuits.',
    footnoteDblDagger:
      'There is no minimum separation for conductors of the same polarity in the same circuit.',
  },
  clauses: {
    '5.9.1.1': {
      title: 'General',
      text: 'The minimum separations between supply-line conductors of the same circuit or different circuits that are at the same level or within 45° of the horizontal on the same supporting structure shall be as specified in Table 17.',
    },
    '5.9.1.2': {
      title: 'Voltages applicable to Table 17',
      text:
        'When applying the separations specified in Table 17, voltages shall be\n' +
        'a) for dc, the voltage differences between the conductors involved;\n' +
        'b) for ac conductors in the same circuit, normal operating phase-to-phase voltages; and\n' +
        'c) for ac conductors in two different circuits, the sum of the normal operating phase-to-ground voltages of both circuits.',
    },
    '5.9.1.3': {
      title: 'Suspension insulators',
      text: 'Where suspension insulators are used and are not restrained from swinging transversely, the sags specified in Table 17 shall include the length of the insulator string.',
    },
  },
};

export const TABLE_17_LONG_SPAN_INCREMENTS_DESCRIPTION =
  '300 mm base + the following three increments:\n' +
  '(a) 3 × the distance (in m) by which the span length exceeds 50 m;\n' +
  '(b) 83 × the final unloaded sag (in m) at 15 °C conductor temperature for conductor(s) having the greatest sag; and\n' +
  '(c) 10 mm/kV over 5 kV.';

export const TABLE_17_ROWS = [
  {
    voltageClass: '0–5 kV ac',
    systemType: 'ac',
    vMinKv: 0,
    vMaxKv: 5,
    spansUpTo50m: [
      { spanMinM: 0, spanMaxM: 6, separation_mm: 225 },
      { spanMinM: 6, spanMaxM: 50, separation_mm: 300 },
    ],
    spansOver50mFormula: '300 + 3 * (spanM - 50) + 83 * sag15cM + 10 * Math.max(0, vKv - 5)',
  },
  {
    voltageClass: '> 5 kV ac',
    systemType: 'ac',
    vMinKv: 5,
    vMaxKv: null,
    spansUpTo50mFormula: '300 + 10 mm/kV over 1 kV',
    spansOver50mFormula: '300 + 3 * (spanM - 50) + 83 * sag15cM + 10 * Math.max(0, vKv - 5)',
  },
  {
    voltageClass: '0–750 V dc, same polarity, different circuits',
    systemType: 'dc',
    polarity: 'same',
    spansUpTo50m: [{ spanMinM: 0, spanMaxM: 50, separation_mm: 150 }],
    spansOver50mFormula: '150 + 3 * (spanM - 50) + 83 * sag15cM',
  },
  {
    voltageClass: '0–750 V dc, opposite polarity',
    systemType: 'dc',
    polarity: 'opposite',
    spansUpTo50m: [{ spanMinM: 0, spanMaxM: 50, separation_mm: 300 }],
    spansOver50mFormula: '300 + 3 * (spanM - 50) + 83 * sag15cM',
  },
  {
    voltageClass: '> 0.75 kV and ≤ 22 kV dc, same polarity, different circuits',
    systemType: 'dc',
    polarity: 'same',
    spansUpTo50m: [
      { spanMinM: 0, spanMaxM: 6, separation_mm: 225 },
      { spanMinM: 6, spanMaxM: 50, separation_mm: 300 },
    ],
    spansOver50mFormula: '300 + 3 * (spanM - 50) + 83 * sag15cM',
  },
  {
    voltageClass: '> 0.75 kV and ≤ 22 kV dc, opposite polarity',
    systemType: 'dc',
    polarity: 'opposite',
    spansUpTo50m: [{ spanMinM: 0, spanMaxM: 50, separation_mm: 375 }],
    spansOver50mFormula: '375 + 3 * (spanM - 50) + 83 * sag15cM',
  },
  {
    voltageClass: '> 22 kV dc',
    systemType: 'dc',
    vMinKv: 22,
    spansUpTo50mFormula: '375 + 5 mm/kV over 22 kV',
    spansOver50mFormula: '375 + 5 * (vKv - 22) + 3 * (spanM - 50) + 83 * sag15cM',
  },
];
