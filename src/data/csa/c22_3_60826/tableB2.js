/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table B.2
 * "Parameters of Weibull distribution"
 * (See Annex B, Clause B.3 and Figure B.5.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex B, Page 199 (PDF Page 311)
 */

export const TABLE_B2_META = {
  id: 'csa-c22.3-60826/tableB2',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex B — B.3 Component strength (Weibull distribution)',
  title: 'Parameters of Weibull distribution',
  references: ['B.3', 'C.5', 'Figure B.5'],
  iecPage: 199,
  pdfPages: [311],
  notes: {
    footnoteA: 'Rsp is the specified strength which is equal to the threshold p1 (= 1).',
  },
  clauses: {
    'B.3': {
      title: 'Component strength',
      text:
        'As guidance, if no specific data are available, a Weibull distribution with the parameters given in Table B.2 can be used for lattice supports.',
    },
  },
};

export const TABLE_B2_ROWS = [
  {
    cov_v: 0.075,
    mean_m: 1.13,
    p1_threshold: 1.0,
    p2_scale: 0.145,
    p3_shape: 1.57,
    ratio_10pct_R_to_Rsp: 1.03,
    ratio_5pct_R_to_Rsp: 1.02,
    ratio_2pct_R_to_Rsp: 1.01,
  },
  {
    cov_v: 0.10,
    mean_m: 1.13,
    p1_threshold: 1.0,
    p2_scale: 0.137,
    p3_shape: 1.155,
    ratio_10pct_R_to_Rsp: 1.02,
    ratio_5pct_R_to_Rsp: 1.01,
    ratio_2pct_R_to_Rsp: 1.00,
  },
];

export const TABLE_B2_WEIBULL_PARAMETERS = TABLE_B2_ROWS;
