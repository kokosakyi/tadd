/**
 * CSA C22.3 No. 1 — Table 26
 * "Minimum clearance or separation between guys and other plant attached to the joint-use structure"
 * (See Clauses 5.11.2.2 and A.5.11.2 and Figure A.8.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 101 (PDF Page 106)
 *   - Clause 5.11.2.2, Page 51 (PDF Page 56)
 *   - Clause A.5.11.2, Page 131 (PDF Page 136)
 *
 * All clearances in MILLIMETRES (mm).
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_26_META = {
  id: 'csa-c22.3-no1/table26',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum clearance or separation between guys and other plant attached to the joint-use structure',
  unit: 'mm',
  references: ['5.11.2.2', 'A.5.11.2', '5.11.1', 'Figure A.8'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'This clearance may be reduced to 75 mm where adequate insulation is provided.',
  },
  clauses: {
    '5.11.2.2': {
      title: 'Clearances or separations between guys and other plant attached to a joint-use structure',
      text:
        'At any point, with the exception of attachments, the clearance or separation between a guy and other plant attached to a joint-use structure shall be as specified in Table 26. For vertical separations between attachments at joint-use structures, see Clause 5.11.1.',
    },
    'A.5.11.2': {
      title: 'Guys on joint-use structures',
      text: 'Clearances between this guy and circuits on the same structure are specified in Table 26. (See Figure A.8.)',
    },
  },
};

export const TABLE_26_ROWS = [
  {
    plantType: 'Communication line plant',
    notParallel_mm: 150, // reducible to 75 mm with insulation (*)
    parallel_mm: 75,
    insulatedNotParallelReduction_mm: 75,
  },
  {
    plantType: 'Current-carrying supply plant: 0–750 V',
    vMinKv: 0,
    vMaxKv: 0.75,
    notParallel_mm: 150,
    parallel_mm: 150, // reducible to 75 mm with insulation (*)
    insulatedParallelReduction_mm: 75,
  },
  {
    plantType: 'Current-carrying supply plant: > 0.75 kV and ≤ 5 kV',
    vMinKv: 0.75,
    vMaxKv: 5,
    notParallel_mm: 150,
    parallel_mm: 230,
  },
  {
    plantType: 'Current-carrying supply plant: > 5 kV and ≤ 15 kV',
    vMinKv: 5,
    vMaxKv: 15,
    notParallel_mm: 230,
    parallel_mm: 300,
  },
  {
    plantType: 'Current-carrying supply plant: > 15 kV and ≤ 22 kV',
    vMinKv: 15,
    vMaxKv: 22,
    notParallel_mm: 300,
    parallel_mm: 380,
  },
  {
    plantType: 'Current-carrying supply plant: > 22 kV',
    vMinKv: 22,
    notParallelBase_mm: 300,
    notParallelAdderPerKv: 10,
    notParallelFormula: '300 + 10 mm/kV over 22 kV',
    parallelBase_mm: 380,
    parallelAdderPerKv: 10,
    parallelFormula: '380 + 10 mm/kV over 22 kV',
  },
];
