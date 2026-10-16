/**
 * CSA C22.3 No. 1 — Table 4
 * "Minimum vertical design clearances above ground or rails, dc"
 * (See Clauses 5.3.1.1, 5.7.4.1, and A.5.3.1 and Tables 9 and 11.)
 *
 * Transcribed from:
 *   - sandbox/csa c22 no 1/Table 4/Table 4.png
 *   - sandbox/csa c22 no 1/Table 4/Cl 5.3.1.1.png
 *   - sandbox/csa c22 no 1/Table 4/Cl 5.7.4.1.png
 *   - sandbox/csa c22 no 1/Table 4/Table 9.png
 *   - sandbox/csa c22 no 1/Table 4/Table 11.png
 *   - sandbox/csa c22 no 1/Table 4/A.5.3.png through A.5.3_4.png
 *
 * All clearances in METRES.
 * Voltages are line-to-ground (kV, dc) (Table 4 Note 1).
 *
 * This file is DATA ONLY. Clause-driven adjustments live in clearanceModifiers.js and
 * dcClearanceModifiers.js, and evaluation lives in src/utils/csaTable4Resolver.js.
 */

export const TABLE_4_META = {
  id: 'csa-c22.3-no1/table4',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum vertical design clearances above ground or rails, dc',
  unit: 'm',
  evaluatedAt: 'maxSag', // Clause 5.2
  references: ['5.3.1.1', '5.7.4.1', 'A.5.3.1', 'Table 9', 'Table 11'],
  notes: {
    1: 'Voltages are line-to-ground.',
    2: 'Seasonal conditions can warrant additional clearances (see Clause 5.3.1.1(e)).',
  },
  footnotes: {
    '*': 'For dc voltages below 0.75 kV, use Columns II and III of Table 2.',
    '†': 'See Clause 5.3.1.1(d).',
    '‡': 'Add 0.005 m/kV for each kV over 500 kV to clearances in Column IX.',
    '§': 'These areas are generally adjacent to fences and accessible to small vehicles but are not likely to be travelled by high road vehicles or high farm machinery.',
    '**': 'See Clause 5.3.1.1(c).',
  },
};

/**
 * Columns definition for Table 4 (Open supply-line conductors, dc, kV)
 * Columns:
 * - Col. I:   ≥ 0.75 ≤ 100*
 * - Col. II:  > 100 ≤ 150
 * - Col. III: > 150 ≤ 200
 * - Col. IV:  > 200 ≤ 250
 * - Col. V:   > 250 ≤ 300
 * - Col. VI:  > 300 ≤ 350
 * - Col. VII: > 350 ≤ 400
 * - Col. VIII:> 400 ≤ 450
 * - Col. IX:  > 450 ≤ 500 (with Footnote ‡: +0.005 m/kV for each kV over 500 kV)
 */
export const TABLE_4_COLUMNS = [
  {
    id: 'I',
    label: '≥ 0.75 ≤ 100',
    vLgKv: { minInclusive: 0.75, maxInclusive: 100 },
    footnote: '*',
  },
  {
    id: 'II',
    label: '> 100 ≤ 150',
    vLgKv: { minExclusive: 100, maxInclusive: 150 },
  },
  {
    id: 'III',
    label: '> 150 ≤ 200',
    vLgKv: { minExclusive: 150, maxInclusive: 200 },
  },
  {
    id: 'IV',
    label: '> 200 ≤ 250',
    vLgKv: { minExclusive: 200, maxInclusive: 250 },
  },
  {
    id: 'V',
    label: '> 250 ≤ 300',
    vLgKv: { minExclusive: 250, maxInclusive: 300 },
  },
  {
    id: 'VI',
    label: '> 300 ≤ 350',
    vLgKv: { minExclusive: 300, maxInclusive: 350 },
  },
  {
    id: 'VII',
    label: '> 350 ≤ 400',
    vLgKv: { minExclusive: 350, maxInclusive: 400 },
  },
  {
    id: 'VIII',
    label: '> 400 ≤ 450',
    vLgKv: { minExclusive: 400, maxInclusive: 450 },
  },
  {
    id: 'IX',
    label: '> 450 ≤ 500',
    vLgKv: { minExclusive: 450, maxInclusive: 500 },
    footnote: '‡',
    adderPerKvOver500: 0.005,
  },
];

const COLUMN_ORDER = TABLE_4_COLUMNS.map((c) => c.id);

/**
 * Footnote behaviors and metadata
 */
export const TABLE_4_FOOTNOTES = {
  '*': {
    text: 'For dc voltages below 0.75 kV, use Columns II and III of Table 2.',
    effect: { type: 'redirect', table: 'Table 2', columns: ['II', 'III'] },
    ref: ['Table 2'],
  },
  '†': {
    text: 'See Clause 5.3.1.1(d).',
    effect: { type: 'xref' },
    ref: ['5.3.1.1(d)'],
  },
  '‡': {
    text: 'Add 0.005 m/kV for each kV over 500 kV to clearances in Column IX.',
    effect: { type: 'adder', ratePerKv: 0.005, overKv: 500 },
    ref: ['Table 4 Col. IX', 'A.5.3.1'],
  },
  '§': {
    text: 'These areas are generally adjacent to fences and accessible to small vehicles but are not likely to be travelled by high road vehicles or high farm machinery.',
    effect: { type: 'xref' },
  },
  '**': {
    text: 'See Clause 5.3.1.1(c).',
    effect: { type: 'xref' },
    ref: ['5.3.1.1(c)'],
  },
};

/**
 * Helper to construct a Table 4 row.
 */
function row({ id, label, tags, rowFootnotes = [], values, cellFootnotes = {}, source }) {
  if (values.length !== COLUMN_ORDER.length) {
    throw new Error(`Table 4 row "${id}" has ${values.length} values; expected ${COLUMN_ORDER.length}`);
  }
  const cells = {};
  COLUMN_ORDER.forEach((colId, i) => {
    const v = values[i];
    const fn = [...(cellFootnotes[colId] ? [].concat(cellFootnotes[colId]) : [])];
    if (colId === 'IX' && !fn.includes('‡')) {
      fn.push('‡');
    }
    cells[colId] = v === null
      ? { na: true }
      : { m: v, footnotes: fn };
  });
  return { id, label, tags, footnotes: rowFootnotes, cells, source };
}

/**
 * Table 4 Rows (8 locations of conductors)
 */
export const TABLE_4_ROWS = [
  row({
    id: 'road_vehicular',
    label: 'Over land likely to be travelled by road vehicles (including highways, streets, lanes, alleys, and driveways other than to residences or residence garages)',
    tags: ['vehicular', 'road', 'publicThoroughfare'],
    rowFootnotes: ['†'],
    values: [5.8, 6.0, 6.3, 6.5, 6.7, 6.9, 7.2, 7.4, 7.7],
    source: 'Table 4.png',
  }),
  row({
    id: 'underground_pipeline_row',
    label: 'Over the right-of-way of underground pipelines',
    tags: ['pipelineRow'],
    values: [5.8, 6.0, 6.3, 6.5, 6.7, 6.9, 7.2, 7.4, 7.7],
    source: 'Table 4.png',
  }),
  row({
    id: 'alongside_vehicular_land',
    label: 'Alongside land likely to be travelled by road vehicles or within the limits (with no overhang) of streets and highways',
    tags: ['vehicular', 'road'],
    values: [5.8, 6.0, 6.3, 6.5, 6.7, 6.9, 7.2, 7.4, 7.7],
    source: 'Table 4.png',
  }),
  row({
    id: 'farmland_vehicular',
    label: 'Over or alongside farmland likely to be travelled by vehicles',
    tags: ['vehicular', 'farmland'],
    values: [5.8, 6.0, 6.3, 6.5, 6.7, 6.9, 7.2, 7.4, 7.7],
    source: 'Table 4.png',
  }),
  row({
    id: 'driveway_residence',
    label: 'Over driveways to residences or residence garages',
    tags: ['vehicular', 'driveway'],
    values: [5.6, 5.9, 6.1, 6.3, 6.6, 6.8, 7.0, 7.2, 7.5],
    source: 'Table 4.png',
  }),
  row({
    id: 'alongside_road_unlikely_vehicles',
    label: 'Alongside roads and highways in areas unlikely to be travelled by road vehicles (with no overhang) and within 1.5 m of the limit of the road right-of-way',
    tags: ['road', 'lowVehicleLikelihood'],
    rowFootnotes: ['§'],
    values: [5.5, 5.7, 6.0, 6.2, 6.4, 6.6, 6.9, 7.1, 7.4],
    source: 'Table 4.png',
  }),
  row({
    id: 'pedestrian_only',
    label: 'Over walkways or ground normally accessible only to pedestrians, snowmobiles, and personal-use all-terrain vehicles',
    tags: ['pedestrian'],
    values: [4.6, 4.8, 5.0, 5.3, 5.5, 5.7, 6.0, 6.2, 6.5],
    source: 'Table 4.png',
  }),
  row({
    id: 'railway_top_of_rail',
    label: 'Above top of rail at railway crossing',
    tags: ['rail'],
    rowFootnotes: ['**'],
    values: [8.8, 9.1, 9.3, 9.5, 9.8, 10.0, 10.2, 10.4, 10.7],
    source: 'Table 4.png',
  }),
];

/**
 * Sorted (localeCompare) selector options for UI dropdowns per project rule.
 */
export const TABLE_4_ROW_OPTIONS = TABLE_4_ROWS
  .map((r) => ({ id: r.id, label: r.label }))
  .sort((a, b) => a.label.localeCompare(b.label));
