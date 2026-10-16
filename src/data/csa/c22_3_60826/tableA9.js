/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.9
 * "Values of reference wind speed VR"
 * (See Annex A, Clause A.4.5.2 and Table B.1.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 157 (PDF Page 269)
 */

export const TABLE_A9_META = {
  id: 'csa-c22.3-60826/tableA9',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.4.5.2 Reference wind speed for design',
  title: 'Values of reference wind speed VR (ratio VR / mV)',
  references: ['A.4.5.2', 'B.2', 'Table B.1'],
  iecPage: 157,
  pdfPages: [269],
  notes: {
    note1:
      'In Table A.9 the ratio VR / mV (where mV is the mean of yearly maximum wind velocities) is given for typical coefficients of variation vv when the number of years of observations is very large (n -> ∞). In other cases, refer to Clause B.2 / Table B.1.',
  },
  clauses: {
    'A.4.5.2': {
      title: 'Reference wind speed for design',
      text:
        'The reference wind speed VR is determined from the mean speed mV of the yearly maximum velocities Vm and the standard deviation σVm of the statistical distribution of these velocities as well as from the return period T.',
    },
  },
};

export const TABLE_A9_ROWS = [
  {
    returnPeriod_yr: 50,
    ratio_vv_0_12: 1.31,
    ratio_vv_0_16: 1.41,
    ratio_vv_0_20: 1.52,
  },
  {
    returnPeriod_yr: 150,
    ratio_vv_0_12: 1.41,
    ratio_vv_0_16: 1.55,
    ratio_vv_0_20: 1.69,
  },
  {
    returnPeriod_yr: 500,
    ratio_vv_0_12: 1.53,
    ratio_vv_0_16: 1.70,
    ratio_vv_0_20: 1.88,
  },
];

export const TABLE_A9_REFERENCE_WIND_SPEED_RATIOS = TABLE_A9_ROWS;
