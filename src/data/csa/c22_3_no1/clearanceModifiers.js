/**
 * Clause 5.3.1.1 modifiers to Table 2 (and Table 4) clearances.
 * Transcribed from: sandbox/csa c22 no 1/Cl 5.3.png
 *
 * Each modifier:
 *   id, clause, order     - identity / ordered evaluation
 *   appliesWhen(ctx)      - pure predicate; ctx = { row, column, circuit, site, project }
 *   compute(ctx, baseM)   - returns the delta in metres (positive = more clearance)
 *   describe(ctx, deltaM) - human-readable trace text
 *
 * All deltas are computed against the original Table 2 value (baseM) and summed,
 * except where noted. See `assumptions` for interpretive choices that should be reviewed.
 */

/** Combined vehicle + load height assumed by Table 2 (Cl. 5.3.1.1(a)). */
export const TABLE_2_BASIS_VEHICLE_HEIGHT_M = 4.15;

export const CLEARANCE_MODIFIERS = [
  {
    id: 'vehicle_height_excess',
    clause: '5.3.1.1(a)',
    order: 10,
    text: 'Clearances over roadways or other areas where vehicles are expected to be used are based on a combined vehicle and load height of 4.15 m. Where the jurisdiction permits more, increase by the excess.',
    appliesWhen: ({ row, site }) =>
      row.tags.includes('vehicular') && Number(site.maxVehicleHeightM) > TABLE_2_BASIS_VEHICLE_HEIGHT_M,
    compute: ({ site }) => Number(site.maxVehicleHeightM) - TABLE_2_BASIS_VEHICLE_HEIGHT_M,
    describe: (_c, d) => `+${d.toFixed(3)} m (allowable vehicle+load height exceeds 4.15 m)`,
  },
  {
    id: 'altitude',
    clause: '5.3.1.1(b)',
    order: 20,
    text: 'For altitudes exceeding 1000 m and voltages exceeding 50 kV, Table 2 clearances shall be increased by 1% for each 100 m in excess of 1000 m above mean sea level.',
    appliesWhen: ({ site, circuit }) =>
      Number(site.elevationM) > 1000 && Number(circuit.vLgKv) > 50,
    // 1% of the Table 2 value per 100 m. Default is continuous (conservative vs. whole-step).
    compute: ({ site, project }, baseM) => {
      const excess = Number(site.elevationM) - 1000;
      const steps = project?.altitudeStepping === 'wholeSteps' ? Math.floor(excess / 100) : excess / 100;
      return baseM * 0.01 * steps;
    },
    describe: (_c, d) => `+${d.toFixed(3)} m (1% per 100 m above 1000 m)`,
  },
  {
    id: 'rail_ballast',
    clause: '5.3.1.1(c)',
    order: 30,
    text: 'Where ballast is used, when a line crossing a railway is constructed or altered, provide an additional 0.3 m above rails, unless a lesser amount is mutually agreed upon.',
    appliesWhen: ({ row, site, project }) =>
      row.tags.includes('rail') && site.ballasted !== false && project?.constructedOrAltered === true,
    compute: ({ project }) =>
      Number.isFinite(Number(project?.agreedBallastAllowanceM)) ? Number(project.agreedBallastAllowanceM) : 0.3,
    describe: (_c, d) => `+${d.toFixed(3)} m (rail ballast adjustment allowance)`,
  },
  {
    id: 'road_resurfacing',
    clause: '5.3.1.1(d)',
    order: 40,
    text: 'When a line that crosses or will cross any public thoroughfare likely to be travelled by road vehicles is constructed or altered, provide an additional 0.225 m to permit the road surface to be raised.',
    appliesWhen: ({ row, project }) =>
      row.tags.includes('publicThoroughfare') && project?.constructedOrAltered === true,
    compute: () => 0.225,
    describe: (_c, d) => `+${d.toFixed(3)} m (future road resurfacing allowance)`,
  },
  {
    id: 'snow_depth',
    clause: '5.3.1.1(e)',
    order: 50,
    text: 'Where snow is not cleared away, additional clearance equal to the mean annual maximum snow depth shall be provided (see Table D.1), making due allowance for maximum conductor sag at prevailing temperatures and compression of snow due to vehicle travel.',
    appliesWhen: ({ site }) => site.snowCleared === false && Number(site.meanAnnualMaxSnowDepthM) > 0,
    compute: ({ site }) => Number(site.meanAnnualMaxSnowDepthM),
    describe: (_c, d) => `+${d.toFixed(3)} m (mean annual maximum snow depth, Table D.1)`,
  },
];

/** Interpretive choices that should be reviewed against the full standard text. */
export const MODIFIER_ASSUMPTIONS = [
  'Altitude (b): 1% applied to the Table 2 value, continuous per metre above 1000 m. Set project.altitudeStepping = "wholeSteps" for floor(excess/100).',
  'Altitude (b): voltage test uses rms line-to-ground kV > 50 (Table 2 Note 1). Confirm against the clause for phase-to-phase interpretation.',
  'Vehicle height (a): applied to rows tagged "vehicular"; underground pipeline ROW and lowVehicleLikelihood rows are NOT tagged. Confirm.',
  'Modifiers (a)-(e) are summed independently against the Table value (no compounding).',
  'Modifier (a) is also applied to electrostatic-basis (†) cells; the resolver flags these because electrostatic values may already govern.',
];
