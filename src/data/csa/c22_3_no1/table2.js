/**
 * CSA C22.3 No. 1 — Table 2
 * "Minimum vertical design clearances above ground or rails, ac"
 * (See Clauses 5.3.1.1, 5.7.4.1, A.5.3.1 and Tables 4, 9 and 11.)
 *
 * Transcribed from: sandbox/csa c22 no 1/table 2_1.png, table 2_2.png, table 2_3.png
 * All clearances in METRES. Voltages are rms line-to-ground (kV) unless noted (Table 2 Note 1).
 *
 * This file is DATA ONLY. Clause-driven adjustments live in clearanceModifiers.js and
 * evaluation lives in src/utils/csaTable2Resolver.js.
 */

export const TABLE_2_META = {
  id: 'csa-c22.3-no1/table2',
  standard: 'CSA C22.3 No. 1',
  edition: 'TODO: confirm edition/year from source PDF',
  title: 'Minimum vertical design clearances above ground or rails, ac',
  unit: 'm',
  /** Clearances apply at maximum conductor sag (Cl. 5.2) */
  evaluatedAt: 'maxSag',
  references: ['5.3.1.1', '5.7.4.1', 'A.5.3.1', 'Table 4', 'Table 9', 'Table 11'],
  notes: {
    1: 'Voltages are rms line-to-ground. Voltages in parentheses are phase-to-phase.',
    2: 'For elevations exceeding 1000 m, see Clause 5.3.1.1(b).',
    3: 'Seasonal conditions can warrant additional clearances (see Clause 5.3.1.1(e)).',
    4: 'Electrostatic-governed clearances above 200 kV assume the horizontal configurations in ELECTROSTATIC_BASIS_CONFIGS.',
  },
  columnFootnote: {
    '*': 'For dc voltages below 750 V, use Columns II and III.',
  },
};

/**
 * Columns, in table order.
 * kind:
 *   'grounded'  - Col I: guys, messengers, communication, span & lightning-protection wires, comm. cables
 *   'trolley'   - Col II: trolley contact conductors / span wires / feeders 0–750 V (paralleled by trolley contact conductors)
 *   'supply'    - Cols III–XII: open supply & service conductors, ac
 * vLgKv: { minExclusive, maxInclusive } or { exact } for the fixed >200 kV classes.
 * Col III lower bound is inclusive (0–0.75).
 */
export const TABLE_2_COLUMNS = [
  { id: 'I', kind: 'grounded', label: 'Guys; messengers; communication, span, and lightning protection wires; communication cables' },
  { id: 'II', kind: 'trolley', label: 'Trolley contact conductors and associated span wires; trolley feeders 0–750 V when paralleled by trolley contact conductors' },
  { id: 'III', kind: 'supply', label: '0–0.75 kV', vLgKv: { minInclusive: 0, maxInclusive: 0.75 } },
  { id: 'IV', kind: 'supply', label: '> 0.75 ≤ 22 kV', vLgKv: { minExclusive: 0.75, maxInclusive: 22 } },
  { id: 'V', kind: 'supply', label: '> 22 ≤ 50 kV', vLgKv: { minExclusive: 22, maxInclusive: 50 } },
  { id: 'VI', kind: 'supply', label: '> 50 ≤ 90 kV', vLgKv: { minExclusive: 50, maxInclusive: 90 } },
  { id: 'VII', kind: 'supply', label: '> 90 ≤ 120 kV', vLgKv: { minExclusive: 90, maxInclusive: 120 } },
  { id: 'VIII', kind: 'supply', label: '> 120 ≤ 150 kV', vLgKv: { minExclusive: 120, maxInclusive: 150 } },
  { id: 'IX', kind: 'supply', label: '> 150 ≤ 200 kV', vLgKv: { minExclusive: 150, maxInclusive: 200 } },
  { id: 'X', kind: 'supply', label: '208 (360) kV', vLgKv: { exact: 208 }, vLlKv: 360 },
  { id: 'XI', kind: 'supply', label: '289 (500) kV', vLgKv: { exact: 289 }, vLlKv: 500 },
  { id: 'XII', kind: 'supply', label: '424 (735) kV', vLgKv: { exact: 424 }, vLlKv: 735 },
];

const COLUMN_ORDER = TABLE_2_COLUMNS.map((c) => c.id);

/**
 * Footnote symbols. `effect` types are interpreted by csaTable2Resolver.js:
 *  - flag            : adds a code to result.flags (no numeric change)
 *  - override        : replaces the table value when appliesWhen(ctx) is true
 *  - add             : adds `value` (m) when appliesWhen(ctx) is true
 *  - horizontalZone  : informational — describes the horizontal zone where the vertical value applies
 *  - xref            : informational cross reference
 */
export const TABLE_2_FOOTNOTES = {
  '†': {
    text: 'Specifies clearances based on induced electrostatic steady-state currents and chosen line configurations and overvoltage levels (see Note 4). Other values may be used based on other line configurations, voltages, or assumptions regarding vehicle length and orientation (see Clause A.5.3.1). Mitigative measures such as shielding can reduce these clearances.',
    effect: { type: 'flag', code: 'ELECTROSTATIC_BASIS' },
    ref: ['A.5.3.1', 'Note 4'],
  },
  '‡': {
    text: 'Where communication wires or communication cables run along alleys, this clearance may be reduced to 4 m.',
    effect: { type: 'override', value: 4.0, appliesWhen: 'communication circuit running along an alley' },
    requires: { circuitKind: 'communication', siteAlley: true },
  },
  '§': {
    text: 'Where a line runs parallel to land accessible to vehicles but is over land not requiring clearance for vehicles, the wire can swing out over the area accessible to vehicles or, at voltages over 200 kV, vehicles can be subjected to a hazard from induced voltages. These vertical clearances apply where the conductor (in the swing condition, where specified) is over, or within the stated horizontal distance from the edge of, land accessible to vehicles. Distances apply at the swing angle calculated per Clause 5.2.7. Where the distances are exceeded, minimum vertical clearances are determined relative to the ground over which the line passes.',
    effect: { type: 'horizontalZone' },
    ref: ['5.2.7'],
    /** Horizontal distance (m) from edge of vehicle-accessible land, by column. `perKvOver150` = 1.7 m + 0.01 m/kV over 150 kV. */
    horizontalZoneM: {
      I: 0, II: 0, III: 0, IV: 0, V: 0,
      VI: 1.0,
      VII: 1.4,
      VIII: 1.7,
      IX: { base: 1.7, perKvOver150: 0.01, condition: 'swing' },
      X: { base: 1.7, perKvOver150: 0.01, condition: 'swing' },
      XI: { fixed: 18, condition: 'atRest' },
      XII: { fixed: 18, condition: 'atRest' },
    },
  },
  '**': {
    text: 'On farmlands not likely to be travelled by high farm vehicles, these clearances may be reduced by 0.76 m. Examples include steep slopes, hillsides, and rocky ledges. This does not apply to swamps or other areas that can be crossed by vehicles in winter.',
    effect: { type: 'add', value: -0.76, appliesWhen: 'farmland not likely travelled by high farm vehicles (and not winter-crossable swamp)' },
    requires: { siteHighFarmVehiclesLikely: false, siteWinterCrossable: false },
  },
  '††': {
    text: 'These areas are generally adjacent to fences and accessible to small vehicles, but are not likely to be travelled by high road vehicles or high farm machinery.',
    effect: { type: 'xref' },
  },
  '‡‡': {
    text: 'See Clause 5.3.1.1(c).',
    effect: { type: 'xref' },
    ref: ['5.3.1.1(c)'],
  },
};

/** Table 2 Note 4: assumed configurations for electrostatic-governed (†) values. */
export const ELECTROSTATIC_BASIS_CONFIGS = [
  { nominalKv: 360, overvoltageLgKv: 220, phaseSpacingM: 8.5, bundleCount: 2, conductor: { diameterMm: 28.1, name: 'Drake' } },
  { nominalKv: 500, overvoltageLgKv: 318, phaseSpacingM: 10.7, bundleCount: 4, conductor: { diameterMm: 25.4, name: 'Mica' } },
  { nominalKv: 735, overvoltageLgKv: 442, phaseSpacingM: 12.8, bundleCount: 4, conductor: { diameterMm: 35.1, name: 'Bersimis' } },
];

/**
 * Builds a row. `values` is in column order I..XII (12 entries); null = N/A.
 * `cellFootnotes` maps columnId -> footnote symbol(s).
 * Columns X–XII values listed in `electrostaticCols` are marked basis 'electrostatic' (†).
 */
function row({ id, label, tags, rowFootnotes = [], values, cellFootnotes = {}, electrostaticCols = [], source }) {
  if (values.length !== COLUMN_ORDER.length) {
    throw new Error(`Table 2 row "${id}" has ${values.length} values; expected ${COLUMN_ORDER.length}`);
  }
  const cells = {};
  COLUMN_ORDER.forEach((colId, i) => {
    const v = values[i];
    const fn = [...(cellFootnotes[colId] ? [].concat(cellFootnotes[colId]) : [])];
    const electro = electrostaticCols.includes(colId);
    if (electro && !fn.includes('†')) fn.push('†');
    cells[colId] = v === null
      ? { na: true }
      : { m: v, basis: electro ? 'electrostatic' : 'flashover', footnotes: fn };
  });
  return { id, label, tags, footnotes: rowFootnotes, cells, source };
}

/**
 * Rows. `tags` drive modifier applicability (see clearanceModifiers.js):
 *  vehicular          - Cl. 5.3.1.1(a) vehicle+load height applies ("roadways or other areas where vehicles are expected to be used")
 *  road               - over/along a road
 *  publicThoroughfare - Cl. 5.3.1.1(d) resurfacing allowance applies (line crosses a public thoroughfare likely travelled by road vehicles)
 *  rail               - Cl. 5.3.1.1(c) ballast allowance applies
 *  pedestrian         - pedestrian-only ground
 */
export const TABLE_2_ROWS = [
  row({
    id: 'road_vehicular',
    label: 'Over land likely to be travelled by road vehicles (including highways, streets, lanes, alleys, and driveways other than those leading to residences or residence garages)',
    tags: ['vehicular', 'road', 'publicThoroughfare'],
    values: [4.42, 4.42, 4.42, 4.75, 5.2, 5.5, 5.8, 6.1, 6.6, 10.2, 15.4, 20.4],
    electrostaticCols: ['X', 'XI', 'XII'],
    source: 'table 2_1.png',
  }),
  row({
    id: 'underground_pipeline_row',
    label: 'Over the right-of-way of underground pipelines',
    tags: ['pipelineRow'],
    values: [4.42, 4.42, 4.42, 4.75, 5.2, 5.5, 5.8, 6.1, 6.6, 6.8, 9.9, 13.2],
    electrostaticCols: ['XI', 'XII'],
    source: 'table 2_1.png',
  }),
  row({
    id: 'alongside_vehicular_land',
    label: 'Alongside land likely to be travelled by road vehicles or within the limits (with no overhang) of streets and highways',
    tags: ['vehicular', 'road'],
    rowFootnotes: ['§'],
    values: [4.42, 4.42, 4.42, 4.75, 5.2, 5.5, 5.8, 6.1, 6.6, 10.2, 15.4, 20.4],
    cellFootnotes: { I: '‡' },
    electrostaticCols: ['X', 'XI', 'XII'],
    source: 'table 2_1.png',
  }),
  row({
    id: 'farmland_vehicular',
    label: 'Over or alongside farmland likely to be travelled by vehicles',
    tags: ['vehicular', 'farmland'],
    rowFootnotes: ['§'],
    values: [4.42, null, 4.42, 4.75, 5.2, 5.5, 5.8, 6.1, 6.6, 6.8, 9.9, 13.2],
    cellFootnotes: { I: '**' },
    electrostaticCols: ['XI', 'XII'],
    source: 'table 2_1.png',
  }),
  row({
    id: 'driveway_residence',
    label: 'Over driveways to residences and residence garages',
    tags: ['vehicular', 'driveway'],
    values: [3.7, null, 3.7, 4.75, 5.2, 5.5, 5.8, 6.1, 6.6, 10.2, 15.4, 20.4],
    electrostaticCols: ['X', 'XI', 'XII'],
    source: 'table 2_2.png',
  }),
  row({
    id: 'alongside_road_unlikely_vehicles',
    label: 'Alongside roads and highways in areas unlikely to be travelled by road vehicles (with no overhang) and within 1.5 m of the limit of the road right-of-way',
    tags: ['road', 'lowVehicleLikelihood'],
    rowFootnotes: ['††'],
    values: [3.0, null, 3.4, 4.15, 4.6, 4.9, 5.2, 5.5, 6.0, 6.2, 7.2, 8.4],
    source: 'table 2_2.png',
  }),
  row({
    id: 'pedestrian_only',
    label: 'Over walkways or ground normally accessible only to pedestrians, snowmobiles, and personal-use all-terrain vehicles',
    tags: ['pedestrian'],
    values: [2.5, null, 3.1, 3.4, 3.7, 4.0, 4.3, 4.6, 5.1, 5.3, 6.3, 7.5],
    source: 'table 2_2.png',
  }),
  row({
    id: 'railway_top_of_rail',
    label: 'Above top of rail at railway crossings',
    tags: ['rail'],
    rowFootnotes: ['‡‡'],
    values: [7.3, 6.7, 7.3, 7.6, 8.1, 8.4, 8.7, 9.0, 9.5, 9.7, 10.7, 11.9],
    source: 'table 2_2.png',
  }),
];

/** Sorted (localeCompare) selector options for UI dropdowns. */
export const TABLE_2_ROW_OPTIONS = TABLE_2_ROWS
  .map((r) => ({ id: r.id, label: r.label }))
  .sort((a, b) => a.label.localeCompare(b.label));
