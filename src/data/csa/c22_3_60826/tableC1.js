/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table C.1
 * "Parameters C1 and C2 of Gumbel distribution"
 * (See Annex C, Clause C.4 and Table B.1.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex C, Page 227 (PDF Page 339)
 */

export const TABLE_C1_META = {
  id: 'csa-c22.3-60826/tableC1',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex C — C.4 Gumbel distribution',
  title: 'Parameters C1 and C2 of Gumbel distribution',
  references: ['B.2.1', 'C.4', 'Table B.1', 'Figure C.3'],
  iecPage: 227,
  pdfPages: [339],
  notes: {
    asymptoticValues: 'For n = ∞, C1 = π / sqrt(6) ≈ 1.28255 and C2 = γ_Euler ≈ 0.57722.',
  },
  clauses: {
    'C.4': {
      title: 'Gumbel distribution',
      text:
        'Table C.1 provides the finite-sample Gumbel parameters C1 and C2 (and their ratio C2/C1) as a function of the number of years of observation n.',
    },
  },
};

export const TABLE_C1_ROWS = [
  { n: 10, C1: 0.94963, C2: 0.49521, C2_over_C1: 0.52148 },
  { n: 15, C1: 1.02057, C2: 0.51284, C2_over_C1: 0.50250 },
  { n: 20, C1: 1.06282, C2: 0.52355, C2_over_C1: 0.49260 },
  { n: 25, C1: 1.09145, C2: 0.53086, C2_over_C1: 0.48639 },
  { n: 30, C1: 1.11237, C2: 0.53622, C2_over_C1: 0.48205 },
  { n: 35, C1: 1.12847, C2: 0.54034, C2_over_C1: 0.47882 },
  { n: 40, C1: 1.14131, C2: 0.54362, C2_over_C1: 0.47631 },
  { n: 45, C1: 1.15184, C2: 0.54630, C2_over_C1: 0.47428 },
  { n: 50, C1: 1.16066, C2: 0.54854, C2_over_C1: 0.47261 },
  { n: Infinity, nDisplay: '∞', C1: 1.28255, C2: 0.57722, C2_over_C1: 0.45005 },
];

export const TABLE_C1_GUMBEL_C1_C2 = TABLE_C1_ROWS;
