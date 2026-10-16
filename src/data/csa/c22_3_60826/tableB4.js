/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table B.4
 * "Statistical parameters U_mean and σu of weight span variation"
 * (See Annex B, Clause B.4.1 and Table B.3.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex B, Page 205 (PDF Page 317)
 */

export const TABLE_B4_META = {
  id: 'csa-c22.3-60826/tableB4',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex B — B.4.1 Span variation and use factor U',
  title: 'Statistical parameters U_mean and σu of weight span variation',
  references: ['5.2.3', 'B.4.1', 'Table B.3', 'Table B.5', 'Table B.6'],
  iecPage: 205,
  pdfPages: [317],
  notes: {
    bounds: 'In Tables B.3 and B.4 the lower bound of the use factor is assumed to be 0.4 and the upper bound is 1.0.',
    terrainCodes: 'a = flat; b = rolling, hilly; c = mountainous.',
    constraintCodes: '1 = no special constraints; 2 = constraints on support locations.',
  },
  clauses: {
    'B.4.1': {
      title: 'Span variation and use factor',
      text:
        'U_weight = Average weight span / Design weight span = Average span / Design weight span.',
    },
  },
};

export const TABLE_B4_ROWS = [
  {
    numSuspensionSupportTypes: 1,
    a1_flatUnconstrained: { U_mean: 0.85, sigma_u: 0.05 },
    b1_a2_rollingUnconstrainedOrFlatConstrained: { U_mean: 0.75, sigma_u: 0.10 },
    b2_c1_rollingConstrainedOrMountainousUnconstrained: { U_mean: 0.65, sigma_u: 0.15 },
    c2_mountainousConstrained: { U_mean: 0.50, sigma_u: 0.20 },
  },
  {
    numSuspensionSupportTypes: 2,
    a1_flatUnconstrained: { U_mean: 0.95, sigma_u: 0.03 },
    b1_a2_rollingUnconstrainedOrFlatConstrained: { U_mean: 0.85, sigma_u: 0.05 },
    b2_c1_rollingConstrainedOrMountainousUnconstrained: { U_mean: 0.75, sigma_u: 0.10 },
    c2_mountainousConstrained: { U_mean: 0.60, sigma_u: 0.15 },
  },
  {
    numSuspensionSupportTypes: 3,
    a1_flatUnconstrained: { U_mean: 1.00, sigma_u: 0.00, approximate: true },
    b1_a2_rollingUnconstrainedOrFlatConstrained: { U_mean: 1.00, sigma_u: 0.00, approximate: true },
    b2_c1_rollingConstrainedOrMountainousUnconstrained: { U_mean: 0.85, sigma_u: 0.05 },
    c2_mountainousConstrained: { U_mean: 0.70, sigma_u: 0.10 },
  },
];

export const TABLE_B4_WEIGHT_SPAN_VARIATION = TABLE_B4_ROWS;
