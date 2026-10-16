/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.2
 * "Relationship between reliability levels and return periods of limit loads"
 * (See Annex A, Clause A.1.2.4 and Table 1.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 125 (PDF Page 237)
 */

export const TABLE_A2_META = {
  id: 'csa-c22.3-60826/tableA2',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.1.2.4 Reliability during life cycle',
  title: 'Relationship between reliability levels and return periods of limit loads',
  references: ['5.1.1', 'A.1.2.4', 'A.1.2.5', 'Table 1'],
  iecPage: 125,
  pdfPages: [237],
  notes: {
    lifeCycleFormula: 'PsN = (Ps1)^N = (1 - Pf1)^N and PfN = 1 - PsN for a life cycle of N = 50 years.',
  },
  clauses: {
    'A.1.2.4': {
      title: 'Reliability during life cycle',
      text:
        'Table A.2 gives values of probabilities of survival and failure corresponding to a 50 year life cycle for a line.',
    },
  },
};

export const TABLE_A2_ROWS = [
  {
    reliabilityLevel: 1,
    returnPeriod_yr: 50,
    yearlyMinReliability_Ps1: { min: 0.98, max: 0.99, display: '0.98 to 0.99' },
    yearlyFailureProbability_Pf1: { min: 0.01, max: 0.02, display: '0.02 to 0.01' },
    lifeCycle50yrReliability_Ps50: { min: 0.36, max: 0.61, display: '0.36 to 0.61' },
    lifeCycle50yrFailureProbability_Pf50: { min: 0.39, max: 0.64, display: '0.64 to 0.39' },
  },
  {
    reliabilityLevel: 2,
    returnPeriod_yr: 150,
    yearlyMinReliability_Ps1: { min: 0.993, max: 0.997, display: '0.993 to 0.997' },
    yearlyFailureProbability_Pf1: { min: 0.0033, max: 0.0067, display: '0.0067 to 0.0033' },
    lifeCycle50yrReliability_Ps50: { min: 0.71, max: 0.86, display: '0.71 to 0.86' },
    lifeCycle50yrFailureProbability_Pf50: { min: 0.14, max: 0.29, display: '0.29 to 0.14' },
  },
  {
    reliabilityLevel: 3,
    returnPeriod_yr: 500,
    yearlyMinReliability_Ps1: { min: 0.998, max: 0.999, display: '0.998 to 0.999' },
    yearlyFailureProbability_Pf1: { min: 0.001, max: 0.002, display: '0.002 to 0.001' },
    lifeCycle50yrReliability_Ps50: { min: 0.90, max: 0.95, display: '0.90 to 0.95' },
    lifeCycle50yrFailureProbability_Pf50: { min: 0.05, max: 0.10, display: '0.10 to 0.05' },
  },
];

export const TABLE_A2_RELIABILITY_RETURN_PERIODS = TABLE_A2_ROWS;
