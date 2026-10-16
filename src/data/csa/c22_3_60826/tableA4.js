/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.4
 * "Values of central safety factor α and strength coordination factor ΦS required to insure
 *  that component R2 will fail after component R1 with a 90% probability"
 * (See Annex A, Clause A.1.3.4 and Table 12.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 137 (PDF Page 249)
 */

export const TABLE_A4_META = {
  id: 'csa-c22.3-60826/tableA4',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.1.3.4 Coordination of strength',
  title: 'Values of central safety factor α and strength coordination factor ΦS required to insure that component R2 will fail after component R1 with a 90% probability',
  references: ['7.2.2', 'A.1.3.4', 'Table 12'],
  iecPage: 137,
  pdfPages: [249],
  notes: {
    formula: 'ΦS = (10%)R1 / (10%)R2 = (1 - 1.28 vR1) / [α (1 - 1.28 vR2)], where α = R2_mean / R1_mean.',
  },
  clauses: {
    'A.1.3.4': {
      title: 'Coordination of strength',
      text:
        'In Table A.4 values of α and ΦS are given that ensure that component R2 will fail after component R1 with 90% probability (PΦ = 0.90).',
    },
  },
};

export const TABLE_A4_ROWS = [
  {
    vR2: 0.05,
    vR1_0_05: { alpha: 1.10, phiS: 0.91 },
    vR1_0_075: { alpha: 1.12, phiS: 0.86 },
    vR1_0_10: { alpha: 1.15, phiS: 0.81 },
    vR1_0_20: { alpha: 1.26, phiS: 0.63 },
  },
  {
    vR2: 0.10,
    vR1_0_05: { alpha: 1.16, phiS: 0.92 },
    vR1_0_075: { alpha: 1.18, phiS: 0.88 },
    vR1_0_10: { alpha: 1.20, phiS: 0.83 },
    vR1_0_20: { alpha: 1.30, phiS: 0.65 },
  },
  {
    vR2: 0.20,
    vR1_0_05: { alpha: 1.36, phiS: 0.93 },
    vR1_0_075: { alpha: 1.36, phiS: 0.89 },
    vR1_0_10: { alpha: 1.37, phiS: 0.85 },
    vR1_0_20: { alpha: 1.45, phiS: 0.69 },
  },
  {
    vR2: 0.30,
    vR1_0_05: { alpha: 1.63, phiS: 0.93 },
    vR1_0_075: { alpha: 1.64, phiS: 0.90 },
    vR1_0_10: { alpha: 1.64, phiS: 0.86 },
    vR1_0_20: { alpha: 1.70, phiS: 0.71 },
  },
  {
    vR2: 0.40,
    vR1_0_05: { alpha: 2.07, phiS: 0.93 },
    vR1_0_075: { alpha: 2.07, phiS: 0.90 },
    vR1_0_10: { alpha: 2.07, phiS: 0.86 },
    vR1_0_20: { alpha: 2.11, phiS: 0.72 },
  },
];

export const TABLE_A4_COORDINATION_FACTORS = TABLE_A4_ROWS;
