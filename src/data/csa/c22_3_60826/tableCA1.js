/**
 * CSA C22.3 No. 60826-10 (R2015) — Table CA.1
 * "Weather data"
 * (See Clauses 6.2.4, 6.3.4.1, and CA.4.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 60826-10, Annex CA, Pages CSA/21–CSA/36 (PDF Pages 23–38)
 *   - Clauses 6.2.4, 6.3.4.1 (Canadian Deviations, PDF Pages 14–16)
 *   - Clause CA.4 (Annex CA, PDF Page 20)
 *
 * Notes from Standard:
 *   * The following are lowest January hourly temperatures to a 1% exclusion level.
 *     (One per cent of January hourly temperatures are at or lower than these values.)
 *   † 10 minute average speed, 50-year return period (km/h) at 10 m height in terrain category B.
 *   ‡ Ice thickness from freezing precipitation, 50-year return period (mm), radial glaze ice
 *     of density 900 kg/m³ on a 25 mm conductor 10 m above ground (Chaîné model).
 *   § Wet snow thickness on a 40 mm conductor, 50-year return period (mm) is provided for regions
 *     where data were available at the time this Standard was prepared (Alberta). The recommended
 *     coincident temperature is –5 °C. The corresponding density of the accreted snow is 350 kg/m³.
 */

import geoDatabase from '../../csaGeoDatabase.json' with { type: 'json' };

export const TABLE_CA1_META = {
  id: 'csa-c22.3-60826/tableCA1',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  section: 'Annex CA (Informative)',
  title: 'Weather data',
  references: ['6.2.4', '6.3.4.1', 'CA.1', 'CA.2', 'CA.3', 'CA.4', 'Table CA.2'],
  pdfPages: [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
  units: {
    elevation: 'm',
    latitude: 'degrees North',
    longitude: 'degrees West (negative)',
    min_temp: '°C (1% January hourly exclusion level)',
    wind_50yr: 'km/h (10-min average, 50-year return period, 10 m height, terrain B)',
    ice_50yr: 'mm (50-year point radial glaze ice thickness, density 900 kg/m³)',
    wet_snow_50yr: 'mm (50-year radial wet snow thickness on 40 mm conductor, density 350 kg/m³ at -5 °C)',
  },
  notes: {
    footnoteStar:
      'The following are lowest January hourly temperatures to a 1% exclusion level. (One per cent of January hourly temperatures are at or lower than these values.)',
    footnoteDagger: '10 minute average speed, 50-year return period.',
    footnoteDblDagger: 'Ice thickness from freezing precipitation, 50-year return period.',
    footnoteSection:
      'Wet snow thickness on a 40 mm conductor, 50-year return period is provided for regions where data were available at the time this Standard was prepared. The recommended coincident temperature is –5 °C. The corresponding density of the accreted snow is 350 kg/m³.',
  },
  clauses: {
    '6.2.4 (Canadian Deviation)': {
      title: 'Combination of wind speed and temperatures',
      text:
        'All lines with short spans, typically less than 200 m, shall be verified for the combination of absolute minimum temperatures and 60% of the design wind speed, the conductors being in their initial condition, i.e., the conductor has not been subjected to any permanent elongation due to either creep or load. The minimum temperatures for Canada are given in Table CA.1. In the case of concurrent extreme wind speeds and low temperatures, the coefficient of 60% shall be increased to 80%.',
    },
    '6.3.4.1 (Canadian Deviation)': {
      title: 'Reference limit ice load — Based on statistical data',
      text:
        'Since there is no national ice accretion observation network, values of ice accretion have been obtained by Environment Canada using the Chaîné model, which provides estimates of ice accretion due to freezing rain or drizzle at locations where standard hourly meteorological observations are available. The modelled values represent equivalent radial ice thickness of density 900 kg/m³ on a 25 mm diameter conductor 10 m above ground.\n' +
        'Since transmission lines cover large areas, the maximum 50-year icing accretion in this area shall be considered for design purposes. This value shall be obtained by multiplying the values from Figures CA.10 and CA.11 (or Table CA.1) by a spatial factor equal to 1.3 and a height factor of 1.15 (combined Sa = 1.5 for ~30 m height; 1.3 for ~10 m distribution lines).\n' +
        'The wet snow thickness values given for Alberta in Table CA.1 provide 50-year return values of wet snow load for design purposes. The values given are considered to represent loadings for transmission lines and shall be used for line design without any additional spatial or height factors being applied.',
    },
    'CA.4': {
      title: 'Temperatures',
      text:
        'Values of the lowest January hourly temperatures to a 1% exclusion limit are provided in Table CA.1.',
    },
  },
};

export const TABLE_CA1_PROVINCES = geoDatabase.provinces;

export const TABLE_CA1_ROWS = Object.entries(geoDatabase.provinces)
  .sort(([a], [b]) => a.localeCompare(b))
  .flatMap(([province, stations]) =>
    [...stations]
      .sort((a, b) => a.location.localeCompare(b.location))
      .map((station) => ({
        province,
        ...station,
      }))
  );

export const TABLE_CA1_STATIONS = TABLE_CA1_ROWS;
