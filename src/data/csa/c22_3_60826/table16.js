/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 16
 * "Damage and failure limits of conductors and ground wires"
 * (See Clauses 7.3.1 and 7.3.5.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 95 (PDF Page 207)
 */

export const TABLE_16_META = {
  id: 'csa-c22.3-60826/table16',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.3.1 Limit states for line components',
  title: 'Damage and failure limits of conductors and ground wires',
  references: ['7.3.1', '7.3.5', 'Table 13'],
  iecPage: 95,
  pdfPages: [207],
  clauses: {
    '7.3.1': {
      title: 'Limit states for line components',
      text:
        'Table 16 specifies damage and failure limits of conductors and ground wires. Damage limit is the lowest of vibration limit, infringement of critical clearances, or 75% of characteristic/rated tensile strength (typical range 70% to 80%).',
    },
  },
};

export const TABLE_16_ROWS = [
  {
    componentType: 'All types of conductors and ground wires',
    damageLimit:
      'Lowest of: (1) vibration limit, or (2) infringement of critical clearances defined by appropriate regulations, or (3) 75% of the characteristic strength or rated tensile strength (typical range is 70% to 80%)',
    damageLimitRtsRatioDefault: 0.75,
    damageLimitRtsRatioRange: { min: 0.70, max: 0.80 },
    failureLimit: 'Ultimate tensile stress (rupture)',
    failureLimitRtsRatio: 1.00,
  },
];

export const TABLE_16_CONDUCTOR_LIMIT_STATES = TABLE_16_ROWS;
