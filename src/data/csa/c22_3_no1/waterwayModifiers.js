/**
 * Clause 5.3.3.2 modifiers to Table 3 clearances above waterways.
 * Transcribed from: sandbox/csa c22 no 1/Table 3/Cl 5_3_3_2.png and Table 3 notes/footnotes.
 *
 * Each modifier:
 *   id, clause, order     - identity / ordered evaluation
 *   appliesWhen(ctx)      - pure predicate; ctx = { row, column, circuit, site, project }
 *   compute(ctx, baseM)   - returns delta in metres
 *   describe(ctx, deltaM) - human-readable trace text
 */

export const WATERWAY_CLEARANCE_MODIFIERS = [
  {
    id: 'vessel_height_excess',
    clause: '5.3.3.2(a)',
    order: 10,
    text: 'For areas where vessel heights are known to exceed the reference vessel height at the time of design, the clearance specified in Table 3 shall be increased by the difference between the taller vessel and the reference vessel height specified in Table 3.',
    appliesWhen: ({ row, site }) =>
      row.referenceVesselHeightM !== null &&
      Number(site.vesselHeightM) > row.referenceVesselHeightM,
    compute: ({ row, site }) =>
      Number(site.vesselHeightM) - row.referenceVesselHeightM,
    describe: ({ row, site }, d) =>
      `+${d.toFixed(3)} m (actual vessel height ${site.vesselHeightM} m exceeds reference height ${row.referenceVesselHeightM} m)`,
  },
  {
    id: 'waterway_altitude',
    clause: '5.3.3.2(b)',
    order: 20,
    text: 'For elevations above 1000 m and where voltages exceed 50 kV, the clearances specified in Table 3 shall be increased by 1% for each 100 m or part thereof in excess of 1000 m above mean sea level.',
    appliesWhen: ({ site, circuit }) =>
      Number(site.elevationM) > 1000 && Number(circuit.vLgKv) > 50,
    // Clause states "for each 100 m or part thereof in excess of 1000 m" -> Math.ceil(excess / 100)
    compute: ({ site, project }, baseM) => {
      const excess = Number(site.elevationM) - 1000;
      const steps = project?.altitudeStepping === 'continuous'
        ? excess / 100
        : Math.ceil(excess / 100);
      return baseM * 0.01 * steps;
    },
    describe: (_c, d) => `+${d.toFixed(3)} m (1% per 100 m or part thereof above 1000 m, Cl. 5.3.3.2(b))`,
  },
  {
    id: 'peak_tide',
    clause: 'Table 3 Footnote §',
    order: 30,
    text: 'Where tide water has an effect on a body of water being crossed, the vertical design clearance shall be increased by an amount that takes into account peak tide.',
    appliesWhen: ({ site }) => site.tidal === true && Number(site.peakTideAllowanceM) > 0,
    compute: ({ site }) => Number(site.peakTideAllowanceM),
    describe: (_c, d) => `+${d.toFixed(3)} m (peak tide allowance)`,
  },
];
