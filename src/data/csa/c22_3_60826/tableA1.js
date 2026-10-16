/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.1
 * "Yearly reliability corresponding to various assumptions of load and strength"
 * (See Annex A, Clause A.1.2.1.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 117 (PDF Page 229)
 */

export const TABLE_A1_META = {
  id: 'csa-c22.3-60826/tableA1',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.1.2.1 Yearly reliability',
  title: 'Yearly reliability corresponding to various assumptions of load and strength',
  references: ['5.1.1.2', 'A.1.2.1', 'Table A.2'],
  iecPage: 117,
  pdfPages: [229],
  notes: {
    exclusionLimit: 'The yearly reliabilities given in Table A.1 apply for design with an exclusion limit of 10% (ue = 1.28 for normal distribution).',
  },
  clauses: {
    'A.1.2.1': {
      title: 'Yearly reliability',
      text:
        'Case 1: Load Q and strength R are constant and R > Q => Ps = 1.0 (100%).\n' +
        'Case 2: Load Q is constant and equal to design strength Re% => Ps = 1 - FR(ue) = 0.90 for 10% exclusion limit.\n' +
        'Case 3: Strength R is constant and equal to load QT => Ps = 1 - 1/T.\n' +
        'Case 4: Both load Q and strength R are statistically distributed and matched by R_mean(1 - ue vR) = QT => Ps ≈ 1 - 1/(2T) for vR = 0.10.',
    },
  },
};

export const TABLE_A1_ROWS = [
  {
    caseNumber: 1,
    loadMean: 'Q',
    loadCov: 0,
    designLoad: 'Q',
    strengthMean: 'R',
    strengthCov: 0,
    designStrength: 'R > Q',
    yearlyReliabilityFormula: '1.0',
    description: 'Deterministic constant load Q and constant strength R with R > Q (100% reliability)',
  },
  {
    caseNumber: 2,
    loadMean: 'Q',
    loadCov: 0,
    designLoad: 'Q',
    strengthMean: 'R_mean',
    strengthCov: 'vR',
    designStrength: 'R_mean (1 - ue vR)',
    yearlyReliabilityFormula: '1 - FR(ue) = 0.90 (for ue = 1.28)',
    description: 'Constant load Q matched to 10% exclusion strength Rc',
  },
  {
    caseNumber: 3,
    loadMean: 'Q_mean',
    loadCov: 'vQ',
    designLoad: 'QT',
    strengthMean: 'R',
    strengthCov: 0,
    designStrength: 'R = QT',
    yearlyReliabilityFormula: '1 - 1/T',
    description: 'Stochastic load QT (return period T) matched to constant strength R',
  },
  {
    caseNumber: 4,
    loadMean: 'Q_mean',
    loadCov: 'vQ',
    designLoad: 'QT',
    strengthMean: 'R_mean',
    strengthCov: 'vR',
    designStrength: 'R_mean (1 - ue vR) = QT',
    yearlyReliabilityFormula: '1 - 1/(2T)',
    description: 'Stochastic load QT matched to 10% exclusion strength Rc (for load COV 0.20–0.50 and strength COV ~0.10)',
  },
];

export const TABLE_A1_YEARLY_RELIABILITY_CASES = TABLE_A1_ROWS;
