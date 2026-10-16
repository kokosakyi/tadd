/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.11
 * "Meteorological parameters controlling ice accretion"
 * (See Annex A, Clause A.5.5 and Figure A.9.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 173 (PDF Page 285)
 */

export const TABLE_A11_META = {
  id: 'csa-c22.3-60826/tableA11',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.5.5 Meteorological parameters controlling ice accretion',
  title: 'Meteorological parameters controlling ice accretion',
  references: ['A.5.4', 'A.5.5', 'Figure A.9', 'Table A.10'],
  iecPage: 173,
  pdfPages: [285],
  clauses: {
    'A.5.5': {
      title: 'Meteorological parameters controlling ice accretion',
      text:
        'Table A.11 gives typical values of parameters that control the ice accretion. The transition between soft rime, hard rime and glaze for in-cloud icing is mainly a function of air temperature and wind speed as shown in Figure A.9.',
    },
  },
};

export const TABLE_A11_ROWS = [
  {
    id: 'glaze_ice',
    iceType: 'Glaze ice',
    airTemperature_C: { min: -10, max: 0, display: '–10 < t < 0' },
    meanWindSpeed_ms: 'Any',
    dropletSize: 'Large',
    liquidWaterContent: 'Medium',
    typicalStormDuration: 'Hours',
  },
  {
    id: 'wet_snow',
    iceType: 'Wet snow',
    airTemperature_C: { min: 0, max: 3, display: '0 < t < 3' },
    meanWindSpeed_ms: 'Any',
    dropletSize: 'Flakes',
    liquidWaterContent: 'Very high',
    typicalStormDuration: 'Hours',
  },
  {
    id: 'hard_rime',
    iceType: 'Hard rime',
    airTemperature_C: { min: -10, max: -1, display: '–10 < t < –1' },
    meanWindSpeed_ms: '10 < V',
    dropletSize: 'Medium',
    liquidWaterContent: 'Medium to high',
    typicalStormDuration: 'Days',
  },
  {
    id: 'soft_rime',
    iceType: 'Soft rime',
    airTemperature_C: { min: -20, max: -1, display: '–20 < t < –1' },
    meanWindSpeed_ms: 'V < 10',
    dropletSize: 'Small',
    liquidWaterContent: 'Low',
    typicalStormDuration: 'Days',
  },
];

export const TABLE_A11_ICING_METEOROLOGICAL_PARAMS = TABLE_A11_ROWS;
