# Generator for CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 Tables
# Extracts all 47 tables:
#   - Canadian Annex Tables: Table CA.1, Table CA.2, Table CB.1, Table CB.2, Table CB.3
#   - Normative Tables: Tables 1 to 20
#   - Informative Annex Tables: Tables A.1 to A.14, Tables B.1 to B.6, Tables C.1 to C.2

import os
import json
import re
import pypdf

OUT_DIR = 'src/data/csa/c22_3_60826'
SANDBOX_DIR = 'sandbox/csa c22 60826'

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(SANDBOX_DIR, exist_ok=True)

# ---------------------------------------------------------------------------
# First: Update src/data/csaGeoDatabase.json with wet_snow_50yr from Table CA.1
# and build tableCA1.js
# ---------------------------------------------------------------------------
reader = pypdf.PdfReader('sandbox/csa c22 no 1/CSA C22.3 NO 60826-10 (R2015) Overhead Transmission Lines 2015.pdf')
wet_snow_map = {}
for p in range(22, 38):
    txt = reader.pages[p].extract_text()
    for line in txt.split('\n'):
        m = re.match(r'^(.+?)\s+(-?\d+)\s+(\d+\.\d+)\s+[–-](\d+\.\d+)\s+[–-](\d+)\s+(\d+)\s+(\d+)\s+(\d+|—)$', line.strip())
        if m and m.group(8) != '—':
            wet_snow_map[m.group(1).strip()] = int(m.group(8))

with open('src/data/csaGeoDatabase.json', 'r', encoding='utf-8') as f:
    geo_db = json.load(f)

geo_db['metadata']['units']['wet_snow_thickness'] = 'millimeters (mm) on a 40 mm conductor (50-year return period, 350 kg/m³ density at -5 °C)'

for prov, stations in geo_db['provinces'].items():
    # Sort stations alphabetically by location per project rules
    stations.sort(key=lambda s: s['location'])
    for st in stations:
        loc = st['location']
        st['wet_snow_50yr'] = wet_snow_map.get(loc, None)

with open('src/data/csaGeoDatabase.json', 'w', encoding='utf-8') as f:
    json.dump(geo_db, f, indent=2, ensure_ascii=False)

print(f"Updated src/data/csaGeoDatabase.json with wet_snow_50yr ({len(wet_snow_map)} stations with wet snow values).")

# Build flat list of stations as well
flat_stations = []
for prov in sorted(geo_db['provinces'].keys()):
    for st in geo_db['provinces'][prov]:
        flat_stations.append({
            'province': prov,
            **st
        })

t_ca1_js = f"""/**
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

import geoDatabase from '../../csaGeoDatabase.json';

export const TABLE_CA1_META = {{
  id: 'csa-c22.3-60826/tableCA1',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  section: 'Annex CA (Informative)',
  title: 'Weather data',
  references: ['6.2.4', '6.3.4.1', 'CA.1', 'CA.2', 'CA.3', 'CA.4', 'Table CA.2'],
  pdfPages: [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
  units: {{
    elevation: 'm',
    latitude: 'degrees North',
    longitude: 'degrees West (negative)',
    min_temp: '°C (1% January hourly exclusion level)',
    wind_50yr: 'km/h (10-min average, 50-year return period, 10 m height, terrain B)',
    ice_50yr: 'mm (50-year point radial glaze ice thickness, density 900 kg/m³)',
    wet_snow_50yr: 'mm (50-year radial wet snow thickness on 40 mm conductor, density 350 kg/m³ at -5 °C)',
  }},
  notes: {{
    footnoteStar:
      'The following are lowest January hourly temperatures to a 1% exclusion level. (One per cent of January hourly temperatures are at or lower than these values.)',
    footnoteDagger: '10 minute average speed, 50-year return period.',
    footnoteDblDagger: 'Ice thickness from freezing precipitation, 50-year return period.',
    footnoteSection:
      'Wet snow thickness on a 40 mm conductor, 50-year return period is provided for regions where data were available at the time this Standard was prepared. The recommended coincident temperature is –5 °C. The corresponding density of the accreted snow is 350 kg/m³.',
  }},
  clauses: {{
    '6.2.4 (Canadian Deviation)': {{
      title: 'Combination of wind speed and temperatures',
      text:
        'All lines with short spans, typically less than 200 m, shall be verified for the combination of absolute minimum temperatures and 60% of the design wind speed, the conductors being in their initial condition, i.e., the conductor has not been subjected to any permanent elongation due to either creep or load. The minimum temperatures for Canada are given in Table CA.1. In the case of concurrent extreme wind speeds and low temperatures, the coefficient of 60% shall be increased to 80%.',
    }},
    '6.3.4.1 (Canadian Deviation)': {{
      title: 'Reference limit ice load — Based on statistical data',
      text:
        'Since there is no national ice accretion observation network, values of ice accretion have been obtained by Environment Canada using the Chaîné model, which provides estimates of ice accretion due to freezing rain or drizzle at locations where standard hourly meteorological observations are available. The modelled values represent equivalent radial ice thickness of density 900 kg/m³ on a 25 mm diameter conductor 10 m above ground.\\n' +
        'Since transmission lines cover large areas, the maximum 50-year icing accretion in this area shall be considered for design purposes. This value shall be obtained by multiplying the values from Figures CA.10 and CA.11 (or Table CA.1) by a spatial factor equal to 1.3 and a height factor of 1.15 (combined Sa = 1.5 for ~30 m height; 1.3 for ~10 m distribution lines).\\n' +
        'The wet snow thickness values given for Alberta in Table CA.1 provide 50-year return values of wet snow load for design purposes. The values given are considered to represent loadings for transmission lines and shall be used for line design without any additional spatial or height factors being applied.',
    }},
    'CA.4': {{
      title: 'Temperatures',
      text:
        'Values of the lowest January hourly temperatures to a 1% exclusion limit are provided in Table CA.1.',
    }},
  }},
}};

export const TABLE_CA1_PROVINCES = geoDatabase.provinces;

export const TABLE_CA1_ROWS = Object.entries(geoDatabase.provinces)
  .sort(([a], [b]) => a.localeCompare(b))
  .flatMap(([province, stations]) =>
    [...stations]
      .sort((a, b) => a.location.localeCompare(b.location))
      .map((station) => ({{
        province,
        ...station,
      }}))
  );

export const TABLE_CA1_STATIONS = TABLE_CA1_ROWS;
"""

with open(f'{OUT_DIR}/tableCA1.js', 'w', encoding='utf-8') as f:
    f.write(t_ca1_js)

# ---------------------------------------------------------------------------
# TABLE CA.2
# ---------------------------------------------------------------------------
t_ca2_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) — Table CA.2
 * "Factors γT to modify the 50-year return period weather variable to any other return period T"
 * (See Clauses 5.2.1 and 6.3.4.1 and Table CB.1.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 60826-10, Annex CA, Page CSA/37 (PDF Page 39)
 *   - Clauses 5.2.1 and 6.3.4.1 (Canadian Deviations, PDF Pages 13, 16)
 */

export const TABLE_CA2_META = {
  id: 'csa-c22.3-60826/tableCA2',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  section: 'Annex CA (Informative)',
  title: 'Factors γT to modify the 50-year return period weather variable to any other return period T',
  references: ['5.2.1', '6.3.4.1', 'Table CB.1', 'Table 2'],
  pdfPages: [39],
  notes: {
    note1: 'γTw applies to wind speed and γTi applies to ice thickness.',
    interpolationRule:
      'Per Clause 5.2.1 (Canadian Deviation): If return periods other than those given in Table CA.2 are used, the corresponding weather variables may be deduced by direct interpolation between the values specified in Table CA.2.',
  },
  clauses: {
    '5.2.1 (Canadian Deviation)': {
      title: 'Limit load',
      text:
        'Factors γT specified in Table CA.2 are default values that can be used to adjust climatic load in relation to the return period, if different from 50 years.\\n' +
        'Note: γTi applies to ice thickness and γTw applies to wind speed.\\n' +
        'If return periods other than those given in Table CA.2 are used, the corresponding weather variables may be deduced by direct interpolation between the values specified in Table CA.2.',
    },
  },
};

export const TABLE_CA2_ROWS = [
  { returnPeriod_yr: 25, gammaTw: 0.95, gammaTi: 0.87 },
  { returnPeriod_yr: 50, gammaTw: 1.00, gammaTi: 1.00 },
  { returnPeriod_yr: 100, gammaTw: 1.07, gammaTi: 1.13 },
  { returnPeriod_yr: 150, gammaTw: 1.10, gammaTi: 1.20 },
  { returnPeriod_yr: 200, gammaTw: 1.14, gammaTi: 1.26 },
  { returnPeriod_yr: 400, gammaTw: 1.18, gammaTi: 1.38 },
  { returnPeriod_yr: 500, gammaTw: 1.20, gammaTi: 1.42 },
];

export const TABLE_CA2_GAMMA_FACTORS = TABLE_CA2_ROWS;
"""

with open(f'{OUT_DIR}/tableCA2.js', 'w', encoding='utf-8') as f:
    f.write(t_ca2_js)

# ---------------------------------------------------------------------------
# TABLE CB.1
# ---------------------------------------------------------------------------
t_cb1_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) — Table CB.1
 * "Default values for distribution lines and structures"
 * (See Annex CB, Clause CB.2.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 60826-10, Annex CB, Page CSA/50 (PDF Page 52)
 */

export const TABLE_CB1_META = {
  id: 'csa-c22.3-60826/tableCB1',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  section: 'Annex CB (Informative)',
  title: 'Default values for distribution lines and structures',
  references: ['CB.1', 'CB.2', 'Table CA.2'],
  pdfPages: [52],
  notes: {
    footnoteStar:
      'The adjustment factor of 1.5 mentioned in this Standard includes a height factor of 1.15 for typical transmission conductors. Since distribution conductors are at a height of about 10 m, the factor of 1.15 should not be used; therefore, the applicable spatial factor for icing thickness on distribution lines should be: 1.5/1.15 = 1.3.',
    footnoteDagger: 'Refer to IEC Figure 3 (referenced as Table 3 in footnote) for a conductor height of 10 m and terrain type B.',
    footnoteDblDagger: 'Refer to IEC Figure 4 (referenced as Table 4 in footnote) for spans less than 200 m.',
    footnoteSection: 'Wind is always considered perpendicular to spans.',
    footnoteDoubleStar: 'Typical of Canadian conditions during persistence of ice on conductors, particularly after icing storms.',
    footnoteDoubleDagger:
      'Reflects increase in air density for colder temperatures since high winds in Canada occur during colder seasons. In this Standard, the air density correction factor for wind only is 1.04 and 1.1 for wind and ice combinations. For the purpose of simplifying calculations for distribution lines, a single default air density correction factor of 1.1 may be used for all wind-related loads.',
    footnoteTripleDagger: 'Considered the same as for conductors.',
    footnoteDoubleSection:
      'This value could be reduced to 25 years. In that case, the wind speed and ice thickness in the weather maps would be adjusted by the factors specified in Table CA.2.',
  },
  clauses: {
    'CB.2': {
      title: 'Simplification assumptions for distribution lines',
      text: 'Table CB.1 provides the default values that are typical of distribution lines and structures.',
    },
  },
};

export const TABLE_CB1_ROWS = [
  {
    id: 'structure_height',
    parameter: 'Height of structure and poles',
    symbol: 'h',
    value: 10,
    unit: 'm',
    displayValue: '10 m',
  },
  {
    id: 'conductor_height',
    parameter: 'Height of conductors',
    symbol: 'z',
    value: 10,
    unit: 'm',
    displayValue: '10 m',
  },
  {
    id: 'ice_spatial_factor',
    parameter: 'Ice correction from point to space values',
    symbol: 'Sa',
    value: 1.3,
    unit: 'unitless',
    displayValue: '1.3',
    footnote: 'footnoteStar',
  },
  {
    id: 'wood_pole_drag_coeff',
    parameter: 'Wood poles drag coefficient',
    symbol: 'Ct',
    value: 1.0,
    unit: 'unitless',
    displayValue: '1.0',
  },
  {
    id: 'conductor_drag_coeff',
    parameter: 'Conductor drag coefficient',
    symbol: 'Cd',
    value: { le_15mm: 1.2, gt_15mm: 1.0 },
    unit: 'unitless',
    displayValue: '1.2 for conductor diameters ≤ 15 mm; 1.0 for conductor diameters > 15 mm',
  },
  {
    id: 'conductor_gust_response_factor',
    parameter: 'Wind gust response factor for conductor',
    symbol: 'Gc',
    value: 1.85,
    unit: 'unitless',
    displayValue: '1.85',
    footnote: 'footnoteDagger',
  },
  {
    id: 'typical_span_range',
    parameter: 'Typical span range',
    symbol: 'L',
    value: { min: 60, max: 120 },
    unit: 'm',
    displayValue: '60–120 m',
  },
  {
    id: 'span_factor',
    parameter: 'Span factor',
    symbol: 'GL',
    value: 1.0,
    unit: 'unitless',
    displayValue: '1.0',
    footnote: 'footnoteDblDagger',
  },
  {
    id: 'wind_angle',
    parameter: 'Wind angle with line direction',
    symbol: 'θ',
    value: 90,
    unit: 'deg',
    displayValue: '90°',
    footnote: 'footnoteSection',
  },
  {
    id: 'temp_wind_only',
    parameter: 'Temperature associated with wind only',
    symbol: 'T_wind',
    value: 0,
    unit: '°C',
    displayValue: '0 °C',
  },
  {
    id: 'temp_wind_ice',
    parameter: 'Temperature associated with wind + ice',
    symbol: 'T_ice',
    value: -10,
    unit: '°C',
    displayValue: '–10 °C or lower',
    footnote: 'footnoteDoubleStar',
  },
  {
    id: 'air_density_factor_wind_only',
    parameter: 'Air density correction factor for wind only',
    symbol: 'τ_wind',
    value: 1.04,
    unit: 'unitless',
    displayValue: '1.04',
    footnote: 'footnoteDoubleDagger',
  },
  {
    id: 'air_density_factor_ice_wind',
    parameter: 'Air density correction factor for ice + wind conditions',
    symbol: 'τ_ice',
    value: 1.1,
    unit: 'unitless',
    displayValue: '1.1',
    footnote: 'footnoteDoubleDagger',
  },
  {
    id: 'pole_insulator_gust_factor',
    parameter: 'Gust response factor for poles and insulators',
    symbol: 'Gt',
    value: 1.85,
    unit: 'unitless',
    displayValue: '1.85',
    footnote: 'footnoteTripleDagger',
  },
  {
    id: 'terrain_category',
    parameter: 'Terrain category',
    symbol: 'Category',
    value: 'B',
    unit: 'category',
    displayValue: 'B',
  },
  {
    id: 'return_period',
    parameter: 'Return period of weather variables',
    symbol: 'T',
    value: 50,
    unit: 'years',
    displayValue: '50 years',
    footnote: 'footnoteDoubleSection',
  },
  {
    id: 'high_prob_wind_ratio',
    parameter: 'High probability wind (low value) to be combined with high icing (C1)',
    symbol: 'BiH',
    value: 0.40,
    unit: 'ratio',
    displayValue: '40% × design wind speed',
  },
  {
    id: 'low_prob_wind_ratio',
    parameter: 'Low probability wind (high value) to be combined with average icing (C2)',
    symbol: 'BiL',
    value: 0.60,
    unit: 'ratio',
    displayValue: '60% × design wind speed',
  },
  {
    id: 'low_ice_weight_ratio',
    parameter: 'Low (average) ice during high winds (C2)',
    symbol: 'gH / gR',
    value: 0.50,
    unit: 'ratio',
    displayValue: '50% of design ice weight',
  },
];

export const TABLE_CB1_DEFAULT_VALUES = TABLE_CB1_ROWS;
"""

with open(f'{OUT_DIR}/tableCB1.js', 'w', encoding='utf-8') as f:
    f.write(t_cb1_js)

# ---------------------------------------------------------------------------
# TABLE CB.2
# ---------------------------------------------------------------------------
t_cb2_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) — Table CB.2
 * "Conductor loads per pole (N)"
 * (See Annex CB, Clause CB.3.7.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 60826-10, Annex CB, Page CSA/54 (PDF Page 56)
 *   - Sample calculation for 3-phase distribution line in Ottawa (T = 50 yr, d = 22 mm,
 *     L = 80 m, w = 11 N/m, V50 = 90 km/h, t50 = 30 mm).
 */

export const TABLE_CB2_META = {
  id: 'csa-c22.3-60826/tableCB2',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  section: 'Annex CB (Informative)',
  title: 'Conductor loads per pole (N)',
  unit: 'N',
  references: ['CB.3.1', 'CB.3.2', 'CB.3.3', 'CB.3.4', 'CB.3.5', 'CB.3.7', 'Table CB.3'],
  pdfPages: [56],
  notes: {
    sampleInputs:
      '3-phase circuit in Ottawa, 50-year return period, conductor diameter 22 mm, span 80 m, conductor unit weight 11 N/m, V50 = 90 km/h, point radial ice t50 = 30 mm (design ice = 39 mm). Values in Table CB.2 are total for 3 conductors per pole.',
  },
  clauses: {
    'CB.3.7': {
      title: 'Pole fibre stresses (non-linear analysis)',
      text: 'The calculated loads on the conductors (for 3 phases per pole) are shown in Table CB.2.',
    },
  },
};

export const TABLE_CB2_ROWS = [
  {
    id: 'wind_only',
    loadCase: 'Wind',
    verticalLoad_N: 2640, // 3 phases × 11 N/m × 80 m
    transverseLoad_N: 4113, // 3 phases × 1371 N
    singlePhaseVertical_N: 880,
    singlePhaseTransverse_N: 1371,
  },
  {
    id: 'ice_wind_c1',
    loadCase: 'Ice + wind C1',
    verticalLoad_N: 18456, // 3 phases × 6152 N
    transverseLoad_N: 2991, // 3 phases × 997 N
    singlePhaseVertical_N: 6152,
    singlePhaseTransverse_N: 997.5,
  },
  {
    id: 'ice_wind_c2',
    loadCase: 'Ice + wind C2',
    verticalLoad_N: 10548, // 3 phases × 3516 N
    transverseLoad_N: 4878, // 3 phases × 1626 N
    singlePhaseVertical_N: 3516,
    singlePhaseTransverse_N: 1625.5,
  },
];

export const TABLE_CB2_CONDUCTOR_LOADS = TABLE_CB2_ROWS;
"""

with open(f'{OUT_DIR}/tableCB2.js', 'w', encoding='utf-8') as f:
    f.write(t_cb2_js)

# ---------------------------------------------------------------------------
# TABLE CB.3
# ---------------------------------------------------------------------------
t_cb3_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) — Table CB.3
 * "Fibre stress calculation for pole selection"
 * (See Annex CB, Clause CB.3.7.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 60826-10, Annex CB, Page CSA/55 (PDF Page 57)
 */

export const TABLE_CB3_META = {
  id: 'csa-c22.3-60826/tableCB3',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  section: 'Annex CB (Informative)',
  title: 'Fibre stress calculation for pole selection',
  references: ['CB.3.6', 'CB.3.7', 'Table CB.2'],
  pdfPages: [57],
  notes: {
    commentary:
      'Table CB.3 indicates that the maximum ground line stress for Pole DF-5-40 is 43.7 MPa, slightly less than the value of 44.4 MPa derived in Clause CB.3.6. However, additional verification using commercially available software confirmed that the pole section about 2 m above ground has a fibre stress of 46.04 MPa, which exceeds the design value of 44.4 MPa; thus class 5 pole is not suitable for this project. In the case of class 4 pole, the calculated fibre stress is 32.2 MPa < 44.4 MPa; thus it constitutes a suitable solution for this project.',
  },
  clauses: {
    'CB.3.6': {
      title: 'Maximum stresses in the pole',
      text:
        'In RBD design, the stress due to the above load cases should not exceed 10% exclusion limit of strength: (10%)R = average strength – 1.28 × standard deviation. For Douglas Fir (coastal), average MOR = 55 MPa, COV = 15% (8.25 MPa), so (10%)R = 55 – 1.28 × 8.25 = 44.4 MPa.',
    },
  },
};

export const TABLE_CB3_ROWS = [
  {
    poleClass: 'DF-1-40',
    tipCircumference_in: 27,
    tipCircumference_cm: 68.6,
    tipDiameter_cm: 21.83,
    groundLineCircumference_in: 41,
    groundLineCircumference_cm: 104.14,
    groundLineDiameter_cm: 33.15,
    groundLineSectionModulus_cm3: 3576,
    poleWindArea_m2: 2.74,
    resistingGroundLineMoment_kNm: 158.9,
    designStress_MPa: 44.4,
    poleWeight_N: 7458,
    conductorHeight_m: 9.96,
    groundLineCrossSection_m2: 0.086,
    transverseDeflection_cm: {
      wind: 31.4,
      iceWindC1: 23.23,
      iceWindC2: 35.62,
    },
    maxLinearMoment_kNm: 52.4,
    maxNonLinearMomentPDelta_kNm: 56.8,
    maxBendingStressGround_MPa: 15.9,
    maxCompressionStressGround_MPa: 0.21,
    totalFibreStress_MPa: 16.09,
  },
  {
    poleClass: 'DF-2-40',
    tipCircumference_in: 25,
    tipCircumference_cm: 63.5,
    tipDiameter_cm: 20.21,
    groundLineCircumference_in: 38.5,
    groundLineCircumference_cm: 97.79,
    groundLineDiameter_cm: 31.13,
    groundLineSectionModulus_cm3: 2961,
    poleWindArea_m2: 2.56,
    resistingGroundLineMoment_kNm: 131.6,
    designStress_MPa: 44.4,
    poleWeight_N: 6525.8,
    conductorHeight_m: 9.96,
    groundLineCrossSection_m2: 0.076,
    transverseDeflection_cm: {
      wind: 43.57,
      iceWindC1: 34.26,
      iceWindC2: 51.0,
    },
    maxLinearMoment_kNm: 52.2,
    maxNonLinearMomentPDelta_kNm: 57.8,
    maxBendingStressGround_MPa: 19.5,
    maxCompressionStressGround_MPa: 0.22,
    totalFibreStress_MPa: 19.76,
  },
  {
    poleClass: 'DF-3-40',
    tipCircumference_in: 23,
    tipCircumference_cm: 58.4,
    tipDiameter_cm: 18.60,
    groundLineCircumference_in: 36,
    groundLineCircumference_cm: 91.44,
    groundLineDiameter_cm: 29.11,
    groundLineSectionModulus_cm3: 2421,
    poleWindArea_m2: 2.38,
    resistingGroundLineMoment_kNm: 107.6,
    designStress_MPa: 44.4,
    poleWeight_N: 5656,
    conductorHeight_m: 9.96,
    groundLineCrossSection_m2: 0.0665,
    transverseDeflection_cm: {
      wind: 57.8,
      iceWindC1: 49.57,
      iceWindC2: 70.47,
    },
    maxLinearMoment_kNm: 51.9,
    maxNonLinearMomentPDelta_kNm: 59.5,
    maxBendingStressGround_MPa: 24.6,
    maxCompressionStressGround_MPa: 0.24,
    totalFibreStress_MPa: 24.83,
  },
  {
    poleClass: 'DF-4-40',
    tipCircumference_in: 21,
    tipCircumference_cm: 53.3,
    tipDiameter_cm: 16.98,
    groundLineCircumference_in: 33.5,
    groundLineCircumference_cm: 85.09,
    groundLineDiameter_cm: 27.09,
    groundLineSectionModulus_cm3: 1951,
    poleWindArea_m2: 2.20,
    resistingGroundLineMoment_kNm: 86.7,
    designStress_MPa: 44.4,
    poleWeight_N: 4849,
    conductorHeight_m: 9.96,
    groundLineCrossSection_m2: 0.0576,
    transverseDeflection_cm: {
      wind: 78.62,
      iceWindC1: 77.37,
      iceWindC2: 101.59,
    },
    maxLinearMoment_kNm: 51.7,
    maxNonLinearMomentPDelta_kNm: 62.3,
    maxBendingStressGround_MPa: 31.9,
    maxCompressionStressGround_MPa: 0.27,
    totalFibreStress_MPa: 32.22,
  },
  {
    poleClass: 'DF-5-40',
    tipCircumference_in: 19,
    tipCircumference_cm: 48.3,
    tipDiameter_cm: 15.36,
    groundLineCircumference_in: 31,
    groundLineCircumference_cm: 78.74,
    groundLineDiameter_cm: 25.06,
    groundLineSectionModulus_cm3: 1546,
    poleWindArea_m2: 2.01,
    resistingGroundLineMoment_kNm: 68.7,
    designStress_MPa: 44.4,
    poleWeight_N: 4104,
    conductorHeight_m: 9.96,
    groundLineCrossSection_m2: 0.0493,
    transverseDeflection_cm: {
      wind: 110.17,
      iceWindC1: 138.51,
      iceWindC2: 155.98,
    },
    maxLinearMoment_kNm: 51.4,
    maxNonLinearMomentPDelta_kNm: 67.1,
    maxBendingStressGround_MPa: 43.4,
    maxCompressionStressGround_MPa: 0.30,
    totalFibreStress_MPa: 43.72,
  },
  {
    poleClass: 'DF-6-40',
    tipCircumference_in: 17,
    tipCircumference_cm: 43.2,
    tipDiameter_cm: 13.74,
    groundLineCircumference_in: 28.5,
    groundLineCircumference_cm: 72.39,
    groundLineDiameter_cm: 23.04,
    groundLineSectionModulus_cm3: 1201,
    poleWindArea_m2: 1.83,
    resistingGroundLineMoment_kNm: 53.4,
    designStress_MPa: 44.4,
    poleWeight_N: 3422,
    conductorHeight_m: 9.96,
    groundLineCrossSection_m2: 0.0417,
    transverseDeflection_cm: {
      wind: 159.7,
      iceWindC1: 312.3,
      iceWindC2: 255.9,
    },
    maxLinearMoment_kNm: 51.2,
    maxNonLinearMomentPDelta_kNm: 67.1,
    maxBendingStressGround_MPa: 55.9,
    maxCompressionStressGround_MPa: 0.34,
    totalFibreStress_MPa: 56.22,
  },
];

export const TABLE_CB3_POLE_FIBRE_STRESS = TABLE_CB3_ROWS;
"""

with open(f'{OUT_DIR}/tableCB3.js', 'w', encoding='utf-8') as f:
    f.write(t_cb3_js)

# ---------------------------------------------------------------------------
# NORMATIVE TABLES 1 TO 20
# ---------------------------------------------------------------------------

# TABLE 1
t1_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 1
 * "Reliability levels for transmission lines"
 * (See Clause 5.1.1.1 and A.1.2.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 35 (PDF Page 147)
 */

export const TABLE_1_META = {
  id: 'csa-c22.3-60826/table1',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '5.1.1.1 Reliability levels',
  title: 'Reliability levels for transmission lines',
  references: ['5.1.1.1', '5.1.1.2', 'A.1.2', 'Table A.2'],
  iecPage: 35,
  pdfPages: [147],
  notes: {
    note1:
      'Some national regulations and/or codes of practice, sometimes impose, directly or indirectly, design requirements that may restrict the choice offered to designers.',
    note2:
      'Other values of T in the range of 50–500 years, such as 100, 200 and 400 years, can be used if justified by local conditions.',
    temporaryLines:
      'For temporary lines, some wooden poles or lines of limited importance, return periods of about 25 years may be appropriate.',
  },
  clauses: {
    '5.1.1.1': {
      title: 'Reliability levels',
      text:
        'Lines can be designed for higher reliability levels by increasing the return period T of climatic events. A higher reliability can be justified for example by the importance of the line in the network. Three reliability levels are proposed in this standard and are assumed to cover the range of values to be considered for most transmission lines. These levels are expressed in terms of return periods of climatic limit loads as shown in Table 1.',
    },
  },
};

export const TABLE_1_ROWS = [
  {
    reliabilityLevel: 1,
    returnPeriod_yr: 50,
    theoreticalYearlyReliability: 0.99, // ~ 1 - 1/(2T)
    description: 'Standard reliability level (minimum requirement for all permanent lines; typical for ≤ 230 kV)',
  },
  {
    reliabilityLevel: 2,
    returnPeriod_yr: 150,
    theoreticalYearlyReliability: 0.9967,
    description: 'High reliability level (lines > 230 kV or important lines ≤ 230 kV that are the sole/principal source of supply)',
  },
  {
    reliabilityLevel: 3,
    returnPeriod_yr: 500,
    theoreticalYearlyReliability: 0.999,
    description: 'Very high reliability level (major EHV/UHV lines > 230 kV essential for system stability or sole supply to huge load centers)',
  },
];

export const TABLE_1_RELIABILITY_LEVELS = TABLE_1_ROWS;
"""
with open(f'{OUT_DIR}/table1.js', 'w', encoding='utf-8') as f:
    f.write(t1_js)

# TABLE 2
t2_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 2
 * "Default γT factors for adjustment of climatic loads in relation to return period T vs. 50 years"
 * (See Clause 5.2.1 and Canadian Deviation Table CA.2.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 39 (PDF Page 151)
 *   - Canadian Deviation Clause 5.2.1 (PDF Page 13) & Table CA.2 (PDF Page 39)
 */

export const TABLE_2_META = {
  id: 'csa-c22.3-60826/table2',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '5.2.1 Limit load',
  title: 'Default γT factors for adjustment of climatic loads in relation to return period T vs. 50 years',
  references: ['5.2.1', 'Table CA.2'],
  iecPage: 39,
  pdfPages: [151],
  notes: {
    note1:
      'The above γ values are sufficiently accurate for a COV of up to 0.16 for wind speed, 0.30 for ice thickness and 0.65 for unit ice weight and are derived from the Gumbel distribution function.',
    canadianDeviationNote:
      'In Canada, Clause 5.2.1 adds Table CA.2 (which provides γTw and γTi for T = 25, 50, 100, 150, 200, 400, and 500 years). See tableCA2.js.',
  },
  clauses: {
    '5.2.1': {
      title: 'Limit load',
      text:
        'QT can be obtained from the statistical analysis of climatic data in accordance with techniques detailed in Annexes A to C. In some national standards, a reference (usually a 50 year return period value) climatic variable is specified. In such case, the climatic variable for any return period T (years) can be estimated by multiplying the 50 year reference value of the climatic variable by the load factor γT, given in Table 2.',
    },
    '5.2.1 (Canadian Deviation)': {
      title: 'Limit load (Canadian Deviation)',
      text:
        'Factors γT specified in Table CA.2 are default values that can be used to adjust climatic load in relation to the return period, if different from 50 years. If return periods other than those given in Table CA.2 are used, the corresponding weather variables may be deduced by direct interpolation between the values specified in Table CA.2.',
    },
  },
};

export const TABLE_2_ROWS = [
  {
    returnPeriod_yr: 50,
    gammaWT_windSpeed: 1.00,
    gammaItT_iceThickness: 1.00,
    gammaIwT_iceWeight: 1.00,
  },
  {
    returnPeriod_yr: 150,
    gammaWT_windSpeed: 1.10,
    gammaItT_iceThickness: 1.15,
    gammaIwT_iceWeight: 1.20,
  },
  {
    returnPeriod_yr: 500,
    gammaWT_windSpeed: 1.20,
    gammaItT_iceThickness: 1.30,
    gammaIwT_iceWeight: 1.45,
  },
];

export const TABLE_2_GAMMA_FACTORS = TABLE_2_ROWS;
"""
with open(f'{OUT_DIR}/table2.js', 'w', encoding='utf-8') as f:
    f.write(t2_js)

# TABLE 3
t3_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 3
 * "Design requirements for the system"
 * (See Clause 5.2.2.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 39 (PDF Page 151)
 */

export const TABLE_3_META = {
  id: 'csa-c22.3-60826/table3',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '5.2.2 Design requirements for the system',
  title: 'Design requirements for the system',
  references: ['5.2.2', '6.2', '6.3', '6.4', '6.5', '6.6', '7.1', '7.2'],
  iecPage: 39,
  pdfPages: [151],
  clauses: {
    '5.2.2': {
      title: 'Design requirements for the system',
      text:
        'Three types of design conditions shall be checked: reliability, security and safety. Table 3 summarizes the context of loads, the required performance and the limit states associated with each condition.',
    },
  },
};

export const TABLE_3_ROWS = [
  {
    id: 'reliability',
    condition: 'Reliability',
    typeOfLoad: 'Climatic loads due to wind, ice, ice plus wind, with a return period T',
    requiredPerformance: 'To ensure reliable and safe power transmission capability',
    correspondingLimitState: 'Damage limit',
  },
  {
    id: 'security',
    condition: 'Security',
    typeOfLoad: 'Torsional, vertical, and longitudinal loads',
    requiredPerformance: 'To reduce the probability of uncontrollable propagation of failures (failure containment)',
    correspondingLimitState: 'Failure limit',
  },
  {
    id: 'safety',
    condition: 'Safety',
    typeOfLoad: 'Construction and maintenance loads',
    requiredPerformance: 'To ensure safe construction and maintenance conditions',
    correspondingLimitState: 'Damage limit',
  },
];

export const TABLE_3_DESIGN_REQUIREMENTS = TABLE_3_ROWS;
"""
with open(f'{OUT_DIR}/table3.js', 'w', encoding='utf-8') as f:
    f.write(t3_js)

# TABLE 4
t4_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 4
 * "Classification of terrain categories"
 * (See Clauses 6.2.2, 6.2.3, A.4, Table A.7, and Table A.8.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 45 (PDF Page 157)
 *   - Canadian Deviation Clause 6.2.2 (PDF Page 14)
 */

export const TABLE_4_META = {
  id: 'csa-c22.3-60826/table4',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '6.2.2 Terrain roughness',
  title: 'Classification of terrain categories',
  references: ['6.2.2', '6.2.3', 'A.4', 'Table A.7', 'Table A.8'],
  iecPage: 45,
  pdfPages: [157],
  notes: {
    usage:
      'In Table 4, the roughness factor KR represents a multiplier of the reference wind speed for conversion from one terrain category to another (VR = KR × VRB).',
    canadianDeviation:
      'Per Clause 6.2.2 (Canadian Deviation): Terrain type B is representative of the majority of lines and should lead to acceptable results in all areas except in flat coastal areas, where a terrain type A should be used.',
  },
  clauses: {
    '6.2.2': {
      title: 'Terrain roughness',
      text:
        'The roughness of the terrain crossed by the line affects the wind speed and turbulence intensity. Four categories of terrain are defined in Table 4.',
    },
    '6.2.2 (Canadian Deviation)': {
      title: 'Terrain roughness (Canadian Deviation)',
      text:
        'Terrain type B is representative of the majority of lines and should lead to acceptable results in all areas except in flat coastal areas, where a terrain type A should be used.',
    },
    '6.2.3': {
      title: 'Reference wind speed VR',
      text:
        'VR is defined as the reference wind speed (m/s) corresponding to a return period T at 10 m above ground with an averaging period of 10 min. If the reference wind speed for terrain category B (VRB) is known, VR can be determined with VR = KR × VRB, where KR is the roughness factor.',
    },
  },
};

export const TABLE_4_ROWS = [
  {
    category: 'A',
    roughnessCharacteristics: 'Large stretch of water upwind, flat coastal areas',
    KR: 1.08,
  },
  {
    category: 'B',
    roughnessCharacteristics:
      'Open country with very few obstacles, for example airports or cultivated fields with few trees or buildings',
    KR: 1.00,
  },
  {
    category: 'C',
    roughnessCharacteristics: 'Terrain with numerous small obstacles of low height (hedges, trees and buildings)',
    KR: 0.85,
  },
  {
    category: 'D',
    roughnessCharacteristics: 'Suburban areas or terrain with many tall trees',
    KR: 0.67,
  },
];

export const TABLE_4_TERRAIN_CATEGORIES = TABLE_4_ROWS;
"""
with open(f'{OUT_DIR}/table4.js', 'w', encoding='utf-8') as f:
    f.write(t4_js)

# TABLE 5
t5_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 5
 * "Correction factor τ of dynamic reference wind pressure q0 due to altitude and temperatures"
 * (See Clause 6.2.5.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 47 (PDF Page 159)
 *   - Canadian Deviation Clause 6.2.5 (PDF Page 14)
 */

export const TABLE_5_META = {
  id: 'csa-c22.3-60826/table5',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '6.2.5 Unit action of the wind speed on any line component or element',
  title: 'Correction factor τ of dynamic reference wind pressure q0 due to altitude and temperatures',
  references: ['6.2.5', '6.4.6.1', 'Table CB.1'],
  iecPage: 47,
  pdfPages: [159],
  notes: {
    note1: 'The reference value (τ = 1.00) corresponds to 0 m altitude and a temperature of 15 °C (air density μ = 1.225 kg/m³ at 101.3 kPa).',
    canadianDeviation:
      'Per Clause 6.2.5 (Canadian Deviation): The air density correction factor shall be 1.04 for wind conditions without ice and 1.1 for combined ice and wind. These factors may also be used for mountainous regions because the reduced temperature compensates for the altitude.',
  },
  clauses: {
    '6.2.5': {
      title: 'Unit action of the wind speed on any line component or element',
      text:
        'q0 = (1/2) μ τ (KR VRB)² where μ = 1.225 kg/m³ at 15 °C and 101.3 kPa at sea level, and τ is the air density correction factor given in Table 5.',
    },
    '6.2.5 (Canadian Deviation)': {
      title: 'Unit action of the wind speed (Canadian Deviation)',
      text:
        'The air density correction factor shall be 1.04 for wind conditions without ice and 1.1 for combined ice and wind. These factors may also be used for mountainous regions because the reduced temperature compensates for the altitude.',
    },
  },
};

export const TABLE_5_ROWS = [
  { temperature_C: 30, altitude_0m: 0.95, altitude_1000m: 0.84, altitude_2000m: 0.75, altitude_3000m: 0.66 },
  { temperature_C: 15, altitude_0m: 1.00, altitude_1000m: 0.89, altitude_2000m: 0.79, altitude_3000m: 0.69 },
  { temperature_C: 0, altitude_0m: 1.04, altitude_1000m: 0.94, altitude_2000m: 0.83, altitude_3000m: 0.73 },
  { temperature_C: -15, altitude_0m: 1.12, altitude_1000m: 0.99, altitude_2000m: 0.88, altitude_3000m: 0.77 },
  { temperature_C: -30, altitude_0m: 1.19, altitude_1000m: 1.05, altitude_2000m: 0.93, altitude_3000m: 0.82 },
];

export const TABLE_5_TAU_CORRECTION_FACTORS = TABLE_5_ROWS;
"""
with open(f'{OUT_DIR}/table5.js', 'w', encoding='utf-8') as f:
    f.write(t5_js)

# TABLE 6
t6_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 6
 * "Non-uniform ice loading conditions"
 * (See Clause 6.3.6.3 and Figure 12.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 71 (PDF Page 183)
 *   - Canadian Deviation Clauses 6.3.6.3.1A and 6.3.6.3.1B (PDF Pages 16–17)
 */

export const TABLE_6_META = {
  id: 'csa-c22.3-60826/table6',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '6.3.6.3 Non-uniform ice formation on phase conductors and ground wires',
  title: 'Non-uniform ice loading conditions',
  references: ['6.3.6.3', '6.3.6.3.1A', '6.3.6.3.1B', 'Figure 12'],
  iecPage: 71,
  pdfPages: [183],
  notes: {
    note1:
      'In this table, the uppercase letters A, B, C, D, E, F (phase conductors) and X, Y (ground wires) represent conductors and spans loaded with 0.7 gR, while the lowercase letters a, b, c, d, e, f, x, y represent conductors and spans loaded with 0.4 × 0.7 gR (= 0.28 gR). Factors 0.7 and 0.4 are suggested and other values can be used as substantiated by experience.',
    canadianDeviation:
      'Per Clauses 6.3.6.3.1A and 6.3.6.3.1B (Canadian Deviation): Non-uniform ice loading examples where the structure is subjected to 70% of the design ice weight on the left or right spans while the other spans are loaded with 28% (40% of 70%) of the same design ice weight are illustrated in Figure 12 and Table 6. The unbalanced ice loading cases shall be calculated under: (a) temperature of –5 °C; (b) no wind; and (c) conductor in the final condition (after creep).',
  },
  clauses: {
    '6.3.6.3.1A (Canadian Deviation)': {
      title: 'Non-uniform ice loading examples',
      text:
        'Non-uniform ice loading examples where the structure is subjected to 70% of the design ice weight on the left or right spans while the other spans are loaded with 28% (40% of 70%) of the same design ice weight are illustrated in Figure 12 and Table 6.',
    },
    '6.3.6.3.1B (Canadian Deviation)': {
      title: 'Unbalanced ice loading calculation conditions',
      text:
        'The unbalanced ice loading cases shall be calculated under the following conditions:\\n(a) temperature of –5 °C;\\n(b) no wind; and\\n(c) conductor in the final condition (after creep).\\nThe flexibility of the structures may be considered in order to reduce the unbalanced ice loading.',
    },
  },
};

export const TABLE_6_ROWS = [
  {
    id: 'single_circuit',
    supportType: 'Single circuit',
    longitudinalBending: {
      leftSpan: 'xyabc',
      rightSpan: 'XYABC',
      leftSpanRatioOfgR: 0.28,
      rightSpanRatioOfgR: 0.70,
    },
    transverseBending: {
      leftSpan: 'XYabC',
      rightSpan: 'xYabC',
    },
    torsional: {
      leftSpan: 'XYabC',
      rightSpan: 'XYABC',
    },
  },
  {
    id: 'double_circuit',
    supportType: 'Double circuit',
    longitudinalBending: {
      leftSpan: 'xabcdef',
      rightSpan: 'XABCDEF',
      leftSpanRatioOfgR: 0.28,
      rightSpanRatioOfgR: 0.70,
    },
    transverseBending: {
      leftSpan: 'XabcDEF',
      rightSpan: 'XabcDEF',
    },
    torsional: {
      leftSpan: 'XabcDEF',
      rightSpan: 'XABCDEF',
    },
  },
];

export const TABLE_6_NON_UNIFORM_ICE_CONDITIONS = TABLE_6_ROWS;
"""
with open(f'{OUT_DIR}/table6.js', 'w', encoding='utf-8') as f:
    f.write(t6_js)

# TABLE 7
t7_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 7
 * "Return period of combined ice and wind load"
 * (See Clause 6.4.1 and Table A.13.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 73 (PDF Page 185)
 */

export const TABLE_7_META = {
  id: 'csa-c22.3-60826/table7',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '6.4.1 Combined probabilities – Principle proposed',
  title: 'Return period of combined ice and wind load',
  references: ['6.4.1', '6.4.2', '6.4.3', '6.4.4', 'Table A.13'],
  iecPage: 73,
  pdfPages: [185],
  notes: {
    principle:
      'A low probability (index L, return period T) value of one variable is combined with high probability (index H, average of yearly maximum values) of the remaining variables.',
    combinations:
      'Two loading combinations are considered: Condition 1 (Low ice probability gL with average yearly wind during icing VIH) and Condition 2 (Low probability wind during icing VIL with average yearly maximum icing gH).',
  },
  clauses: {
    '6.4.1': {
      title: 'Combined probabilities – Principle proposed',
      text:
        'Assuming that maximum loads are most likely to be related to combinations involving at least one maximum value of a variable (either of wind speed, ice weight or ice shape), a simplified method is proposed: a low probability (index L) value of a variable is combined with high probability (index H) values of the other two variables, as is shown in Table 7.',
    },
  },
};

export const TABLE_7_ROWS = [
  {
    reliabilityLevel: 1,
    returnPeriod_yr: 50,
    lowProbabilityVariableReturnPeriod_yr: 50,
    remainingVariablesReturnPeriod: 'Average of yearly maximum values',
  },
  {
    reliabilityLevel: 2,
    returnPeriod_yr: 150,
    lowProbabilityVariableReturnPeriod_yr: 150,
    remainingVariablesReturnPeriod: 'Average of yearly maximum values',
  },
  {
    reliabilityLevel: 3,
    returnPeriod_yr: 500,
    lowProbabilityVariableReturnPeriod_yr: 500,
    remainingVariablesReturnPeriod: 'Average of yearly maximum values',
  },
];

export const TABLE_7_COMBINED_ICE_WIND_RETURN_PERIODS = TABLE_7_ROWS;
"""
with open(f'{OUT_DIR}/table7.js', 'w', encoding='utf-8') as f:
    f.write(t7_js)

# TABLE 8
t8_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 8
 * "Drag coefficients of ice-covered conductors"
 * (See Clause 6.4.5 and Table A.14.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 77 (PDF Page 189)
 */

export const TABLE_8_META = {
  id: 'csa-c22.3-60826/table8',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '6.4.5 Drag coefficients of ice-covered conductors',
  title: 'Drag coefficients of ice-covered conductors',
  references: ['6.4.5', '6.4.6.1', 'Figure 13', 'Table A.14'],
  iecPage: 77,
  pdfPages: [189],
  notes: {
    note1:
      'The uniform thickness of ice around the conductor corresponds to the minimum overall diameter, i.e. the most compact projected area.',
    note2:
      'It is assumed that the value of Ci is the same for the ice coverings related to T = 50, 150, 500 years.',
  },
  clauses: {
    '6.4.5': {
      title: 'Drag coefficients of ice-covered conductors',
      text:
        'The effective drag coefficient is a multiplying factor on the assumed cylindrical shape for the specified ice volume (see Figure 13).',
    },
  },
};

export const TABLE_8_ROWS = [
  {
    id: 'wet_snow',
    icingCategory: 'Precipitation',
    iceType: 'Wet snow',
    effectiveDragCoefficient_CiH: 1.0,
    associatedIceDensity_kg_m3: 600,
  },
  {
    id: 'soft_rime',
    icingCategory: 'In-cloud',
    iceType: 'Soft rime',
    effectiveDragCoefficient_CiH: 1.2,
    associatedIceDensity_kg_m3: 600,
  },
  {
    id: 'hard_rime',
    icingCategory: 'In-cloud',
    iceType: 'Hard rime',
    effectiveDragCoefficient_CiH: 1.1,
    associatedIceDensity_kg_m3: 900,
  },
  {
    id: 'glaze_ice',
    icingCategory: 'Precipitation',
    iceType: 'Glaze ice',
    effectiveDragCoefficient_CiH: 1.0,
    associatedIceDensity_kg_m3: 900,
  },
];

export const TABLE_8_ICE_DRAG_COEFFICIENTS = TABLE_8_ROWS;
"""
with open(f'{OUT_DIR}/table8.js', 'w', encoding='utf-8') as f:
    f.write(t8_js)

# TABLE 9
t9_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 9
 * "Additional security measures"
 * (See Clauses 6.6.2 and 6.6.3.3.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 87 (PDF Page 199)
 *   - Canadian Deviation Clauses 6.6.2 and 6.6.3.1 (PDF Page 17)
 */

export const TABLE_9_META = {
  id: 'csa-c22.3-60826/table9',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '6.6.3.3 Additional security measures',
  title: 'Additional security measures',
  references: ['6.6.2', '6.6.3.1', '6.6.3.3'],
  iecPage: 87,
  pdfPages: [199],
  clauses: {
    '6.6.3.3': {
      title: 'Additional security measures',
      text: 'The designer can increase the security by adopting some of the requirements listed in Table 9.',
    },
    '6.6.2 (Canadian Deviation)': {
      title: 'Security requirements (Canadian Deviation)',
      text:
        'If the requirements stated in Clause 6.6 are impractical for wood pole structures, these requirements may be replaced by either of the following:\\n' +
        '(a) Structures capable of resisting all static broken bare conductor tensions at 0 °C shall be located at intervals not exceeding every 25 structures.\\n' +
        '(b) A study shall demonstrate that anti-cascading capabilities are inherent in the wood pole structures and will limit cascading damage to a distance equivalent to that of Item (a).',
    },
  },
};

export const TABLE_9_ROWS = [
  {
    id: 'increase_rsl_factor',
    measure: 'Increase the RSL by a factor of 1.5 at any one point',
    comment: 'Lines where higher security is justified',
  },
  {
    id: 'increase_torsional_load_points',
    measure:
      'Increase the number of torsional/flexural load points to either two phases or two ground wires where the residual static load (RSL) is applied',
    comment: 'Advisable for double or multi-circuit lines',
  },
  {
    id: 'rsl_3yr_climatic_load',
    measure:
      'Calculate the RSL for tensions higher than the every day load by using wind or ice load corresponding to a 3 year return period in conjunction with this loading case',
    comment: 'Advisable for angle structures or lines subjected to severe climatic conditions',
  },
  {
    id: 'anti_cascading_towers',
    measure:
      'Insertion of anti-cascading towers at intervals, typically every tenth tower. These towers shall be designed for all broken conductors with limit loads',
    comment: 'To be considered for important lines in heavy icing areas',
  },
];

export const TABLE_9_SECURITY_MEASURES = TABLE_9_ROWS;
"""
with open(f'{OUT_DIR}/table9.js', 'w', encoding='utf-8') as f:
    f.write(t9_js)

# TABLE 10
t10_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 10
 * "Number of supports subjected to maximum load intensity during any single occurrence of a climatic event"
 * (See Clause 7.2.1 and Table 11.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 89 (PDF Page 201)
 */

export const TABLE_10_META = {
  id: 'csa-c22.3-60826/table10',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.2.1 Values of strength factor ΦN',
  title: 'Number of supports subjected to maximum load intensity during any single occurrence of a climatic event',
  references: ['7.2.1', 'Table 11', 'Table A.5'],
  iecPage: 89,
  pdfPages: [201],
  notes: {
    note1: 'Values in brackets represent the typical range of supports based on a span of 400 m.',
    usage: 'The number of components other than supports can be directly derived from the number of supports thus selected.',
  },
  clauses: {
    '7.2.1': {
      title: 'Values of strength factor ΦN',
      text:
        'Whenever a number N of components are expected to be subjected to the same critical load QT during a single occurrence of a climatic event, the characteristic strength of individual components shall be de-rated (multiplied) by a strength factor ΦN. In the absence of specific experience, the number N of supports subjected to the maximum load intensity during a single occurrence of climatic events can be derived from Table 10.',
    },
  },
};

export const TABLE_10_ROWS = [
  {
    id: 'max_gust_wind',
    loading: 'Maximum gust wind',
    flatToRollingTerrain: { defaultN: 1, rangeMin: 1, rangeMax: 5, display: '1 (1 to 5)' },
    mountains: { defaultN: 1, rangeMin: 1, rangeMax: 2, display: '1 (1 to 2)' },
  },
  {
    id: 'max_ice',
    loading: 'Maximum ice',
    flatToRollingTerrain: { defaultN: 20, rangeMin: 10, rangeMax: 50, display: '20 (10 to 50)' },
    mountains: { defaultN: 2, rangeMin: 1, rangeMax: 10, display: '2 (1 to 10)' },
  },
  {
    id: 'max_ice_and_wind',
    loading: 'Maximum ice and wind',
    flatToRollingTerrain: { defaultN: 1, rangeMin: 1, rangeMax: 5, display: '1 (1 to 5)' },
    mountains: { defaultN: 1, rangeMin: 1, rangeMax: 5, display: '1 (1 to 5)' },
  },
];

export const TABLE_10_SUPPORTS_SUBJECTED_TO_MAX_LOAD = TABLE_10_ROWS;
"""
with open(f'{OUT_DIR}/table10.js', 'w', encoding='utf-8') as f:
    f.write(t10_js)

# TABLE 11
t11_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 11
 * "Strength factor ΦN related to the number N of components or elements subjected to the critical load intensity"
 * (See Clause 7.2.1 and Table A.5.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 91 (PDF Page 203)
 */

export const TABLE_11_META = {
  id: 'csa-c22.3-60826/table11',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.2.1 Values of strength factor ΦN',
  title: 'Strength factor ΦN related to the number N of components or elements subjected to the critical load intensity',
  references: ['7.2.1', 'Table 10', 'Table A.5'],
  iecPage: 91,
  pdfPages: [203],
  notes: {
    note1:
      'Values of ΦN are based on a normal distribution function. Values within brackets (lognormal) are based on the log-normal distribution function.',
    note2:
      'In the case of high values of vR and N (shaded cells where both normal and log-normal values are given), the value of ΦN is very sensitive to the choice of the distribution function.',
  },
  clauses: {
    '7.2.1': {
      title: 'Values of strength factor ΦN',
      text:
        'Values of ΦN are given in Table 11 and are based on a normal distribution function. In the same table, the values within brackets are based on the log-normal distribution function.',
    },
  },
};

export const TABLE_11_ROWS = [
  {
    N: 1,
    cov_0_05: { normal: 1.00, logNormal: null },
    cov_0_075: { normal: 1.00, logNormal: null },
    cov_0_10: { normal: 1.00, logNormal: null },
    cov_0_15: { normal: 1.00, logNormal: null },
    cov_0_20: { normal: 1.00, logNormal: null },
    cov_0_25: { normal: 1.00, logNormal: null },
    cov_0_30: { normal: 1.00, logNormal: null },
  },
  {
    N: 2,
    cov_0_05: { normal: 0.98, logNormal: null },
    cov_0_075: { normal: 0.98, logNormal: null },
    cov_0_10: { normal: 0.97, logNormal: null },
    cov_0_15: { normal: 0.94, logNormal: null },
    cov_0_20: { normal: 0.91, logNormal: null },
    cov_0_25: { normal: 0.87, logNormal: null },
    cov_0_30: { normal: 0.84, logNormal: null },
  },
  {
    N: 5,
    cov_0_05: { normal: 0.96, logNormal: null },
    cov_0_075: { normal: 0.94, logNormal: null },
    cov_0_10: { normal: 0.92, logNormal: null },
    cov_0_15: { normal: 0.85, logNormal: null },
    cov_0_20: { normal: 0.80, logNormal: null },
    cov_0_25: { normal: 0.72, logNormal: 0.83 },
    cov_0_30: { normal: 0.64, logNormal: 0.80 },
  },
  {
    N: 10,
    cov_0_05: { normal: 0.94, logNormal: null },
    cov_0_075: { normal: 0.92, logNormal: null },
    cov_0_10: { normal: 0.89, logNormal: null },
    cov_0_15: { normal: 0.81, logNormal: null },
    cov_0_20: { normal: 0.72, logNormal: 0.82 },
    cov_0_25: { normal: 0.62, logNormal: 0.77 },
    cov_0_30: { normal: 0.51, logNormal: 0.73 },
  },
  {
    N: 20,
    cov_0_05: { normal: 0.93, logNormal: null },
    cov_0_075: { normal: 0.90, logNormal: null },
    cov_0_10: { normal: 0.85, logNormal: null },
    cov_0_15: { normal: 0.77, logNormal: 0.83 },
    cov_0_20: { normal: 0.66, logNormal: 0.77 },
    cov_0_25: { normal: 0.53, logNormal: 0.73 },
    cov_0_30: { normal: 0.38, logNormal: 0.68 },
  },
  {
    N: 40,
    cov_0_05: { normal: 0.92, logNormal: null },
    cov_0_075: { normal: 0.87, logNormal: null },
    cov_0_10: { normal: 0.83, logNormal: null },
    cov_0_15: { normal: 0.72, logNormal: 0.80 },
    cov_0_20: { normal: 0.59, logNormal: 0.74 },
    cov_0_25: { normal: 0.44, logNormal: 0.69 },
    cov_0_30: { normal: 0.26, logNormal: 0.64 },
  },
  {
    N: 80,
    cov_0_05: { normal: 0.91, logNormal: null },
    cov_0_075: { normal: 0.86, logNormal: null },
    cov_0_10: { normal: 0.79, logNormal: 0.84 },
    cov_0_15: { normal: 0.68, logNormal: 0.77 },
    cov_0_20: { normal: 0.53, logNormal: 0.71 },
    cov_0_25: { normal: 0.36, logNormal: 0.65 },
    cov_0_30: { normal: 0.16, logNormal: 0.60 },
  },
  {
    N: 160,
    cov_0_05: { normal: 0.90, logNormal: null },
    cov_0_075: { normal: 0.85, logNormal: null },
    cov_0_10: { normal: 0.79, logNormal: 0.83 },
    cov_0_15: { normal: 0.67, logNormal: 0.76 },
    cov_0_20: { normal: 0.52, logNormal: 0.69 },
    cov_0_25: { normal: 0.34, logNormal: 0.62 },
    cov_0_30: { normal: 0.13, logNormal: 0.57 },
  },
];

export const TABLE_11_STRENGTH_FACTOR_PHI_N = TABLE_11_ROWS;
"""
with open(f'{OUT_DIR}/table11.js', 'w', encoding='utf-8') as f:
    f.write(t11_js)

# TABLE 12
t12_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 12
 * "Values of ΦS2"
 * (See Clause 7.2.2 and Table A.4.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 91 (PDF Page 203)
 */

export const TABLE_12_META = {
  id: 'csa-c22.3-60826/table12',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.2.2 Strength factor ΦS related to the coordination of strength',
  title: 'Values of ΦS2',
  references: ['7.2.2', 'Table 13', 'Table A.4'],
  iecPage: 91,
  pdfPages: [203],
  notes: {
    note1:
      'In the above table, R2 is the component designed more reliable than R1 (with 90% confidence that R2 will not fail before R1). A factor ΦS1 = 1.0 is applied to the first component to fail (R1).',
  },
  clauses: {
    '7.2.2': {
      title: 'Strength factor ΦS related to the coordination of strength',
      text:
        'In order to achieve such strength coordination, a strength reduction factor ΦS2 is applied to the strength of components R2 chosen to be more reliable while a factor ΦS1 = 1.0 is applied to the first component to fail. Factor ΦS2 depends on the coefficient of variation of both components and is given in Table 12. It is based on a confidence of 90% that the second component R2 will not fail before the first R1.',
    },
  },
};

export const TABLE_12_ROWS = [
  {
    covR2Range: '0.05–0.10',
    covR2Min: 0.05,
    covR2Max: 0.10,
    phiS2ByCovR1: {
      covR1_0_05: 0.92,
      covR1_0_075: 0.87,
      covR1_0_10: 0.82,
      covR1_0_20: 0.63,
    },
  },
  {
    covR2Range: '0.10–0.40',
    covR2Min: 0.10,
    covR2Max: 0.40,
    phiS2ByCovR1: {
      covR1_0_05: 0.94,
      covR1_0_075: 0.89,
      covR1_0_10: 0.86,
      covR1_0_20: 0.66,
    },
  },
];

export const TABLE_12_STRENGTH_COORDINATION_PHI_S2 = TABLE_12_ROWS;
"""
with open(f'{OUT_DIR}/table12.js', 'w', encoding='utf-8') as f:
    f.write(t12_js)

# TABLE 13
t13_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 13
 * "Typical strength coordination of line components"
 * (See Clause 7.2.2 and Table A.3.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 93 (PDF Page 205)
 *   - Canadian Deviation Clause 7.2.2 (PDF Page 17)
 */

export const TABLE_13_META = {
  id: 'csa-c22.3-60826/table13',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.2.2 Strength factor ΦS related to the coordination of strength',
  title: 'Typical strength coordination of line components',
  references: ['7.2.2', 'Table 12', 'Table 16', 'Table A.3'],
  iecPage: 93,
  pdfPages: [205],
  notes: {
    footnoteStar: 'Within each major component, the underlined component is the least reliable with 90% confidence.',
    footnoteDoubleStar: 'With the strength limits specified in Table 16, conductors are usually the most reliable component of the line.',
    canadianDeviation:
      'Per Clause 7.2.2 (Canadian Deviation): Despite the prescription of a preferred sequence of failure, the line can fail in a different mode. For example, conductors can break due to overstressing caused by a collapsed tower rather than from overload. Dead-end insulators can also fail due to dynamic loads caused by adjacent tower failures.',
  },
  clauses: {
    '7.2.2 (Canadian Deviation)': {
      title: 'Strength factor ΦS related to the coordination of strength (Canadian Deviation)',
      text:
        'Despite the prescription of a preferred sequence of failure, the line can fail in a different mode. For example, conductors can break due to overstressing caused by a collapsed tower rather than from overload. Dead-end insulators can also fail due to dynamic loads caused by adjacent tower failures.',
    },
  },
};

export const TABLE_13_ROWS = [
  {
    reliabilityClass: 'Less reliable (first to fail)',
    majorComponent: 'Suspension tower',
    elementsWithinMajorComponent: ['Tower', 'Foundations', 'Interfaces'],
    leastReliableSubComponent: 'Tower',
  },
  {
    reliabilityClass: 'More reliable with 90% confidence',
    majorComponent: 'Tension tower',
    elementsWithinMajorComponent: ['Tower', 'Foundations', 'Interfaces'],
    leastReliableSubComponent: 'Tower',
  },
  {
    reliabilityClass: 'More reliable with 90% confidence',
    majorComponent: 'Dead-end tower',
    elementsWithinMajorComponent: ['Tower', 'Foundations', 'Interfaces'],
    leastReliableSubComponent: 'Tower',
  },
  {
    reliabilityClass: 'More reliable with 90% confidence (most reliable)',
    majorComponent: 'Conductors',
    elementsWithinMajorComponent: ['Conductors', 'Insulators', 'Interfaces'],
    leastReliableSubComponent: 'Conductors',
    footnote: 'footnoteDoubleStar',
  },
];

export const TABLE_13_STRENGTH_COORDINATION_HIERARCHY = TABLE_13_ROWS;
"""
with open(f'{OUT_DIR}/table13.js', 'w', encoding='utf-8') as f:
    f.write(t13_js)

# TABLE 14
t14_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 14
 * "Damage and failure limits of supports"
 * (See Clause 7.3.1.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 93 (PDF Page 205)
 */

export const TABLE_14_META = {
  id: 'csa-c22.3-60826/table14',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.3.1 Limit states for line components',
  title: 'Damage and failure limits of supports',
  references: ['7.3.1', 'Table 3', 'Table 15', 'Table 16', 'Table 17'],
  iecPage: 93,
  pdfPages: [205],
  notes: {
    note1:
      'The deformation of compression elements is the maximum deflection from the line joining end points. For elements subjected to moments, it is the displacement of the free end from the vertical.',
    note2: 'l is the free length of the element.',
    note3: 'The width of crack for concrete poles to be agreed upon.',
  },
  clauses: {
    '7.3.1': {
      title: 'Limit states for line components',
      text:
        'Tables 14 to 17 specify damage limits and failure limits for line components with regard to the system. In the absence of relevant data, these values constitute acceptable design limits.',
    },
  },
};

export const TABLE_14_ROWS = [
  {
    supportType: 'Lattice towers, self-supporting or guyed',
    materialOrElements: 'All elements, except guys',
    loadingMode: 'Tension',
    damageLimit: 'Yield (elastic) stress',
    failureLimit: 'Ultimate (breaking) tensile stress',
  },
  {
    supportType: 'Lattice towers, self-supporting or guyed',
    materialOrElements: 'All elements, except guys',
    loadingMode: 'Shear',
    damageLimit: '90% (elastic) shear stress',
    failureLimit: 'Shear (breaking) stress',
  },
  {
    supportType: 'Lattice towers, self-supporting or guyed',
    materialOrElements: 'All elements, except guys',
    loadingMode: 'Compression (buckling)',
    damageLimit: 'Non-elastic deformation from l/500 to l/100',
    failureLimit: 'Collapse by instability',
  },
  {
    supportType: 'Lattice towers, self-supporting or guyed',
    materialOrElements: 'Steel guys',
    loadingMode: 'Tension',
    damageLimit:
      'Lowest value of: yield stress (70% to 75% UTS); deformation corresponding to 5% reduction in tower strength; or need to readjust tension',
    failureLimit: 'Ultimate tensile stress',
  },
  {
    supportType: 'Poles',
    materialOrElements: 'Steel',
    loadingMode: 'Moments',
    damageLimit: '1% non-elastic deformation at the top, or elastic deformation that impairs clearances',
    failureLimit: 'Local buckling in compression or ultimate tensile stress in tension',
  },
  {
    supportType: 'Poles',
    materialOrElements: 'Steel',
    loadingMode: 'Compression (buckling)',
    damageLimit: 'Non-elastic deformation from l/500 to l/100',
    failureLimit: 'Collapse by instability',
  },
  {
    supportType: 'Poles',
    materialOrElements: 'Wood',
    loadingMode: 'Moments',
    damageLimit: '3% non-elastic displacement at the top',
    failureLimit: 'Ultimate tensile stress',
  },
  {
    supportType: 'Poles',
    materialOrElements: 'Wood',
    loadingMode: 'Compression (buckling)',
    damageLimit: 'Non-elastic deformation from l/500 to l/100',
    failureLimit: 'Collapse by instability',
  },
  {
    supportType: 'Poles',
    materialOrElements: 'Concrete',
    loadingMode: 'Permanent or non-permanent loads',
    damageLimit: 'Crack opening after release of loads, or 0.5% non-elastic deformation',
    failureLimit: 'Collapse of the pole',
  },
];

export const TABLE_14_SUPPORT_LIMIT_STATES = TABLE_14_ROWS;
"""
with open(f'{OUT_DIR}/table14.js', 'w', encoding='utf-8') as f:
    f.write(t14_js)

# TABLE 15
t15_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 15
 * "Damage and failure limits of foundations"
 * (See Clause 7.3.1 and 7.3.4.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 95 (PDF Page 207)
 */

export const TABLE_15_META = {
  id: 'csa-c22.3-60826/table15',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.3.1 Limit states for line components',
  title: 'Damage and failure limits of foundations',
  references: ['7.3.1', '7.3.4', 'Table 14'],
  iecPage: 95,
  pdfPages: [207],
  notes: {
    note1: 'Takes into account the interaction between the support and its foundation.',
    note2:
      'A determinate movement is one that does not induce internal efforts in the structure. For example the displacement of one foundation of a three-legged support is a determinate movement, while the displacement of a four-legged support is an indeterminate movement.',
    note3: 'Y is the horizontal distance between foundations.',
    note4: 'Some rigid foundations (e.g. pile) may require lower limits.',
  },
  clauses: {
    '7.3.4 (Canadian Deviation)': {
      title: 'Foundation design strength (Canadian Deviation)',
      text:
        'The following default (simplified) values may be used for foundation design strength and are acceptable in the majority of lines:\\n' +
        '(a) foundations of suspension towers: ΦR = 0.9 for intact loading cases and ΦR = 1.0 for failure loading cases; and\\n' +
        '(b) foundations of angle and dead-end towers: intact ΦR = 0.8 and failed system ΦR = 0.9, where ΦR = ΦN ΦS ΦQ ΦC.',
    },
  },
};

export const TABLE_15_ROWS = [
  {
    foundationLoadingType: 'Uplift',
    supportType: 'Guyed',
    staticallyDeterminateMovement: true,
    damageLimit: 'Need to readjust tension in guys',
    failureLimit: 'Excessive out-of-plane uplift movement (plane formed by the other three foundations) in the order of 5–10 cm',
  },
  {
    foundationLoadingType: 'Uplift',
    supportType: 'Guyed',
    staticallyDeterminateMovement: false,
    damageLimit: '5% reduction in support strength',
    failureLimit: 'Excessive out-of-plane uplift movement (plane formed by the other three foundations) in the order of 5–10 cm',
  },
  {
    foundationLoadingType: 'Uplift',
    supportType: 'Self-supporting',
    staticallyDeterminateMovement: true,
    damageLimit: '1° (degree) rotation of the support',
    failureLimit: 'Excessive out-of-plane uplift movement (plane formed by the other three foundations) in the order of 5–10 cm',
  },
  {
    foundationLoadingType: 'Uplift',
    supportType: 'Self-supporting',
    staticallyDeterminateMovement: false,
    damageLimit: 'Differential vertical displacement equal to Y/300 to Y/500 with a maximum of 2 cm',
    failureLimit: 'Excessive out-of-plane uplift movement (plane formed by the other three foundations) in the order of 5–10 cm',
  },
  {
    foundationLoadingType: 'Compression',
    supportType: 'All types',
    staticallyDeterminateMovement: true,
    damageLimit: 'Displacement corresponding to a 5% reduction in the support strength',
    failureLimit: 'Excessive out-of-plane settlement (plane formed by the other three foundations) in the order of 5–10 cm',
  },
  {
    foundationLoadingType: 'Compression',
    supportType: 'All types',
    staticallyDeterminateMovement: false,
    damageLimit: 'Differential vertical displacement equal to Y/300 to Y/500 with a maximum of 2 cm',
    failureLimit: 'Excessive out-of-plane settlement (plane formed by the other three foundations) in the order of 5–10 cm',
  },
  {
    foundationLoadingType: 'Moments (rotations)',
    supportType: 'Poles',
    staticallyDeterminateMovement: true,
    damageLimit: '2° (degree) rotation of the support',
    failureLimit: 'Excessive rotation in the order of 5° to 10°',
  },
  {
    foundationLoadingType: 'Moments (rotations)',
    supportType: 'Poles',
    staticallyDeterminateMovement: false,
    damageLimit: 'Rotation corresponding to a 10% increase in the total moment due to eccentricity',
    failureLimit: 'Excessive rotation in the order of 5° to 10°',
  },
];

export const TABLE_15_FOUNDATION_LIMIT_STATES = TABLE_15_ROWS;
"""
with open(f'{OUT_DIR}/table15.js', 'w', encoding='utf-8') as f:
    f.write(t15_js)

# TABLE 16
t16_js = """/**
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
"""
with open(f'{OUT_DIR}/table16.js', 'w', encoding='utf-8') as f:
    f.write(t16_js)

# TABLE 17
t17_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 17
 * "Damage and failure limit of interface components"
 * (See Clauses 7.3.1 and 7.3.6.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 97 (PDF Page 209)
 *   - Canadian Deviation Clause 7.3.6 (PDF Page 18)
 */

export const TABLE_17_META = {
  id: 'csa-c22.3-60826/table17',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.3.1 Limit states for line components',
  title: 'Damage and failure limit of interface components',
  references: ['7.3.1', '7.3.6'],
  iecPage: 97,
  pdfPages: [209],
  notes: {
    note1:
      'Normally, fittings are designed in a manner to reduce or eliminate wear. Should wear be expected because of point-to-point contact, it should be considered in the design. In such case, the damage limit becomes "exceeding the expected wear".',
    note2:
      'The critical permanent deformation is defined as the state where the fittings cannot be easily taken apart.',
  },
  clauses: {
    '7.3.6 (Canadian Deviation)': {
      title: 'Insulator string design criteria (Canadian Deviation)',
      text:
        'When required, tests for fittings shall comply with the latest edition of CSA C83 or IEC 61284. CSA C83 shall take precedence, with IEC 61284 being used in the absence of requirements in CSA C83.',
    },
  },
};

export const TABLE_17_ROWS = [
  {
    id: 'cable_joints',
    interfaceComponentType: 'Cable joints (dead-end and junction fittings, suspension fittings)',
    damageLimit: 'Unacceptable permanent deformation (including slippage)',
    failureLimit: 'Rupture',
  },
  {
    id: 'insulators',
    interfaceComponentType: 'Insulators (porcelain and glass)',
    damageLimit: '70% strength rating or broken shed (glass only)',
    damageLimitRatingRatio: 0.70,
    failureLimit: 'Rupture of pin, cap, cement or shed',
  },
  {
    id: 'fittings',
    interfaceComponentType: 'Fittings',
    damageLimit: 'Critical permanent deformation',
    failureLimit: 'Rupture of fittings or shear of bolts',
  },
];

export const TABLE_17_INTERFACE_LIMIT_STATES = TABLE_17_ROWS;
"""
with open(f'{OUT_DIR}/table17.js', 'w', encoding='utf-8') as f:
    f.write(t17_js)

# TABLE 18
t18_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 18
 * "Default values for strength coefficients of variation (COV)"
 * (See Clause 7.3.2.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 97 (PDF Page 209)
 */

export const TABLE_18_META = {
  id: 'csa-c22.3-60826/table18',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.3.2 Strength data of line components',
  title: 'Default values for strength coefficients of variation (COV)',
  references: ['7.3.2', 'Table 11', 'Table 12', 'Table 19'],
  iecPage: 97,
  pdfPages: [209],
  clauses: {
    '7.3.2': {
      title: 'Strength data of line components',
      text:
        'If no specific tests are available, the characteristic strength Rc will be found in ruling standards; Rc may be assumed to correspond to e = 10%. Table 18 gives typical strength coefficient of variation vR to be used as default value in the absence of relevant data.',
    },
  },
};

export const TABLE_18_ROWS = [
  { id: 'conductors_ground_wires', component: 'Conductors and ground wires (strength usually limited by joints)', cov: 0.03 },
  { id: 'fittings', component: 'Fittings', cov: 0.05 },
  { id: 'insulators', component: 'Insulators', cov: 0.05 },
  { id: 'steel_poles', component: 'Steel poles', cov: 0.05 },
  { id: 'concrete_poles', component: 'Concrete poles', cov: 0.15 },
  { id: 'wood_poles', component: 'Wood poles', cov: 0.20 },
  { id: 'lattice_towers', component: 'Lattice towers', cov: 0.10 },
  { id: 'grouted_rock_anchors', component: 'Grouted rock anchors', cov: 0.10 },
  { id: 'pile_foundation', component: 'Pile foundation', cov: 0.25 },
  { id: 'foundation_undercut_compacted', component: 'Foundation with undercut or machine-compacted backfill', cov: 0.20 },
  { id: 'foundation_uncompacted', component: 'Foundation with uncompacted backfill', cov: 0.30 },
];

export const TABLE_18_DEFAULT_STRENGTH_COV = TABLE_18_ROWS;
"""
with open(f'{OUT_DIR}/table18.js', 'w', encoding='utf-8') as f:
    f.write(t18_js)

# TABLE 19
t19_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 19
 * "u factors for log-normal distribution function for e = 10%"
 * (See Clause 7.3.2.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 99 (PDF Page 211)
 */

export const TABLE_19_META = {
  id: 'csa-c22.3-60826/table19',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.3.2 Strength data of line components',
  title: 'u factors for log-normal distribution function for e = 10%',
  references: ['7.3.2', 'Table 18'],
  iecPage: 99,
  pdfPages: [211],
  notes: {
    formula: 'Rc = (10%)R = (1 – u × vR) × R_mean; if R is assumed normally distributed, u = 1.28, or given in Table 19 for log-normal distribution function.',
  },
  clauses: {
    '7.3.2': {
      title: 'Strength data of line components',
      text:
        'If tests are available, Rc = (10%)R = (1 – u × vR) R_mean; if R is assumed normally distributed, u = 1.28, or given in Table 19 for log-normal distribution function.',
    },
  },
};

export const TABLE_19_ROWS = [
  { cov: 0.05, u: 1.26 },
  { cov: 0.10, u: 1.24 },
  { cov: 0.20, u: 1.19 },
  { cov: 0.30, u: 1.14 },
  { cov: 0.40, u: 1.08 },
];

export const TABLE_19_LOGNORMAL_U_FACTORS = TABLE_19_ROWS;
"""
with open(f'{OUT_DIR}/table19.js', 'w', encoding='utf-8') as f:
    f.write(t19_js)

# TABLE 20
t20_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 20
 * "Value of quality factor ΦQ for lattice towers"
 * (See Clause 7.3.3.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 99 (PDF Page 211)
 *   - Canadian Deviation Clause 7.3.3 (PDF Page 17)
 */

export const TABLE_20_META = {
  id: 'csa-c22.3-60826/table20',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.3.3 Support design strength',
  title: 'Value of quality factor ΦQ for lattice towers',
  references: ['7.3.3', 'IEC 60652'],
  iecPage: 99,
  pdfPages: [211],
  notes: {
    canadianSimplifiedPhiR:
      'Per Clause 7.3.3 (Canadian Deviation): The following default (simplified) values may be used for lattice steel towers in the majority of lines: (a) suspension towers: ΦR = 0.9 for intact loading cases and ΦR = 1.0 for failure loading cases; and (b) angle and dead-end towers: intact ΦR = 0.8 and failed system ΦR = 0.9, where ΦR = ΦN ΦS ΦQ ΦC.',
  },
  clauses: {
    '7.3.3': {
      title: 'Support design strength',
      text:
        'Supports shall be designed for a characteristic strength Rc ≥ Support design loads / (ΦN ΦS ΦQ ΦC). For lattice towers, Table 20 gives recommended values for ΦQ, to take into account the quality in calculation method, fabrication and erection.',
    },
    '7.3.3 (Canadian Deviation)': {
      title: 'Support design strength (Canadian Deviation)',
      text:
        'The following default (simplified) values may be used for lattice steel towers in the majority of lines:\\n(a) suspension towers: ΦR = 0.9 for intact loading cases and ΦR = 1.0 for failure loading cases; and\\n(b) angle and dead-end towers: intact ΦR = 0.8 and failed system ΦR = 0.9\\nwhere ΦR = ΦN ΦS ΦQ ΦC.',
    },
  },
};

export const TABLE_20_ROWS = [
  {
    id: 'very_good',
    qualityControl: 'Very good quality control such as involving third party inspection',
    phiQ: 1.00,
  },
  {
    id: 'good',
    qualityControl: 'Good quality control',
    phiQ: 0.95,
  },
  {
    id: 'average',
    qualityControl: 'Average quality control',
    phiQ: 0.90,
  },
];

export const TABLE_20_QUALITY_FACTOR_PHI_Q = TABLE_20_ROWS;
"""
with open(f'{OUT_DIR}/table20.js', 'w', encoding='utf-8') as f:
    f.write(t20_js)

# ---------------------------------------------------------------------------
# INFORMATIVE ANNEX A TABLES (A.1 to A.14)
# ---------------------------------------------------------------------------

# TABLE A.1
t_a1_js = """/**
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
        'Case 1: Load Q and strength R are constant and R > Q => Ps = 1.0 (100%).\\n' +
        'Case 2: Load Q is constant and equal to design strength Re% => Ps = 1 - FR(ue) = 0.90 for 10% exclusion limit.\\n' +
        'Case 3: Strength R is constant and equal to load QT => Ps = 1 - 1/T.\\n' +
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
"""
with open(f'{OUT_DIR}/tableA1.js', 'w', encoding='utf-8') as f:
    f.write(t_a1_js)

# TABLE A.2
t_a2_js = """/**
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
"""
with open(f'{OUT_DIR}/tableA2.js', 'w', encoding='utf-8') as f:
    f.write(t_a2_js)

# TABLE A.3
t_a3_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.3
 * "Typical strength coordination"
 * (See Annex A, Clause A.1.3.1 and Table 13.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 129 (PDF Page 241)
 */

export const TABLE_A3_META = {
  id: 'csa-c22.3-60826/tableA3',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.1.3.1 Criteria for strength coordination',
  title: 'Typical strength coordination',
  references: ['7.2.2', 'A.1.3.1', 'A.1.3.2', 'Table 13'],
  iecPage: 129,
  pdfPages: [241],
  notes: {
    footnoteStar: 'Within each major component the underlined component is the weakest with 90% confidence.',
  },
  clauses: {
    'A.1.3.1': {
      title: 'Criteria for strength coordination',
      text:
        'The logical consequence of the considerations above is that the suspension supports should constitute the component with the lowest strength. When a line designed according to this rule is subjected to climatic loads exceeding design values the suspension supports would fail first.',
    },
  },
};

export const TABLE_A3_ROWS = [
  {
    strengthCategory: 'Lowest strength',
    majorComponent: 'Suspension tower',
    coordinationWithinMajorComponents: ['Tower', 'Foundations', 'Fittings'],
    weakestSubComponent: 'Tower',
  },
  {
    strengthCategory: 'Not having lowest strength with 90% confidence',
    majorComponent: 'Tension tower',
    coordinationWithinMajorComponents: ['Tower', 'Foundations', 'Fittings'],
    weakestSubComponent: 'Tower',
  },
  {
    strengthCategory: 'Not having lowest strength with 90% confidence',
    majorComponent: 'Dead end tower',
    coordinationWithinMajorComponents: ['Tower', 'Foundations', 'Fittings'],
    weakestSubComponent: 'Tower',
  },
  {
    strengthCategory: 'Not having lowest strength with 90% confidence',
    majorComponent: 'Conductors',
    coordinationWithinMajorComponents: ['Conductors', 'Insulators', 'Fittings'],
    weakestSubComponent: 'Conductors',
  },
];

export const TABLE_A3_TYPICAL_STRENGTH_COORDINATION = TABLE_A3_ROWS;
"""
with open(f'{OUT_DIR}/tableA3.js', 'w', encoding='utf-8') as f:
    f.write(t_a3_js)

# TABLE A.4
t_a4_js = """/**
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
"""
with open(f'{OUT_DIR}/tableA4.js', 'w', encoding='utf-8') as f:
    f.write(t_a4_js)

# TABLE A.5
t_a5_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.5
 * "Strength factor ΦN related to N components in series subjected to the critical load"
 * (See Annex A, Clause A.1.3.5 and Table 11.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 143 (PDF Page 255)
 */

export const TABLE_A5_META = {
  id: 'csa-c22.3-60826/tableA5',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.1.3.5 Number of components subjected to maximum load intensity',
  title: 'Strength factor ΦN related to N components in series subjected to the critical load',
  references: ['7.2.1', 'A.1.3.5', 'Table 10', 'Table 11'],
  iecPage: 143,
  pdfPages: [255],
  notes: {
    note1: 'Values in parentheses refer to log-normal distribution; primary values refer to normal (Gaussian) distribution.',
    note2: 'The range of values where the difference in ΦN between normal and log-normal is more than 10% is shown in italic characters in the standard.',
  },
  clauses: {
    'A.1.3.5': {
      title: 'Number of components subjected to maximum load intensity',
      text:
        'Table A.5 depicts strength factors ΦN depending on the number of components N in series or in parallel subjected simultaneously to the critical load obtained under the assumption of a normal and a log-normal distribution of their strength.',
    },
  },
};

export const TABLE_A5_ROWS = [
  {
    N: 1,
    cov_0_05: { normal: 1.00, logNormal: 1.00 },
    cov_0_075: { normal: 1.00, logNormal: 1.00 },
    cov_0_10: { normal: 1.00, logNormal: 1.00 },
    cov_0_15: { normal: 1.00, logNormal: 1.00 },
    cov_0_20: { normal: 1.00, logNormal: 1.00 },
    cov_0_25: { normal: 1.00, logNormal: 1.00 },
    cov_0_30: { normal: 1.00, logNormal: 1.00 },
  },
  {
    N: 2,
    cov_0_05: { normal: 0.98, logNormal: 0.98 },
    cov_0_075: { normal: 0.98, logNormal: 0.97 },
    cov_0_10: { normal: 0.97, logNormal: 0.97 },
    cov_0_15: { normal: 0.94, logNormal: 0.95 },
    cov_0_20: { normal: 0.91, logNormal: 0.93 },
    cov_0_25: { normal: 0.87, logNormal: 0.92 },
    cov_0_30: { normal: 0.84, logNormal: 0.90 },
  },
  {
    N: 5,
    cov_0_05: { normal: 0.96, logNormal: 0.96 },
    cov_0_075: { normal: 0.94, logNormal: 0.94 },
    cov_0_10: { normal: 0.92, logNormal: 0.93 },
    cov_0_15: { normal: 0.85, logNormal: 0.89 },
    cov_0_20: { normal: 0.80, logNormal: 0.86 },
    cov_0_25: { normal: 0.72, logNormal: 0.83 },
    cov_0_30: { normal: 0.64, logNormal: 0.80 },
  },
  {
    N: 10,
    cov_0_05: { normal: 0.94, logNormal: 0.95 },
    cov_0_075: { normal: 0.92, logNormal: 0.93 },
    cov_0_10: { normal: 0.89, logNormal: 0.90 },
    cov_0_15: { normal: 0.81, logNormal: 0.86 },
    cov_0_20: { normal: 0.72, logNormal: 0.82 },
    cov_0_25: { normal: 0.62, logNormal: 0.77 },
    cov_0_30: { normal: 0.51, logNormal: 0.73 },
  },
  {
    N: 20,
    cov_0_05: { normal: 0.93, logNormal: 0.94 },
    cov_0_075: { normal: 0.90, logNormal: 0.91 },
    cov_0_10: { normal: 0.85, logNormal: 0.88 },
    cov_0_15: { normal: 0.77, logNormal: 0.83 },
    cov_0_20: { normal: 0.66, logNormal: 0.77 },
    cov_0_25: { normal: 0.53, logNormal: 0.73 },
    cov_0_30: { normal: 0.38, logNormal: 0.68 },
  },
  {
    N: 40,
    cov_0_05: { normal: 0.92, logNormal: 0.93 },
    cov_0_075: { normal: 0.87, logNormal: 0.89 },
    cov_0_10: { normal: 0.83, logNormal: 0.86 },
    cov_0_15: { normal: 0.72, logNormal: 0.80 },
    cov_0_20: { normal: 0.59, logNormal: 0.74 },
    cov_0_25: { normal: 0.44, logNormal: 0.69 },
    cov_0_30: { normal: 0.26, logNormal: 0.64 },
  },
  {
    N: 60,
    cov_0_05: { normal: 0.91, logNormal: 0.92 },
    cov_0_075: { normal: 0.86, logNormal: 0.88 },
    cov_0_10: { normal: 0.81, logNormal: 0.85 },
    cov_0_15: { normal: 0.70, logNormal: 0.78 },
    cov_0_20: { normal: 0.56, logNormal: 0.72 },
    cov_0_25: { normal: 0.40, logNormal: 0.67 },
    cov_0_30: { normal: 0.20, logNormal: 0.62 },
  },
  {
    N: 80,
    cov_0_05: { normal: 0.91, logNormal: 0.92 },
    cov_0_075: { normal: 0.86, logNormal: 0.88 },
    cov_0_10: { normal: 0.80, logNormal: 0.84 },
    cov_0_15: { normal: 0.68, logNormal: 0.77 },
    cov_0_20: { normal: 0.53, logNormal: 0.71 },
    cov_0_25: { normal: 0.36, logNormal: 0.65 },
    cov_0_30: { normal: 0.16, logNormal: 0.60 },
  },
  {
    N: 160,
    cov_0_05: { normal: 0.90, logNormal: 0.91 },
    cov_0_075: { normal: 0.85, logNormal: 0.87 },
    cov_0_10: { normal: 0.79, logNormal: 0.83 },
    cov_0_15: { normal: 0.67, logNormal: 0.76 },
    cov_0_20: { normal: 0.52, logNormal: 0.69 },
    cov_0_25: { normal: 0.34, logNormal: 0.62 },
    cov_0_30: { normal: 0.13, logNormal: 0.57 },
  },
];

export const TABLE_A5_SERIES_STRENGTH_FACTOR_PHI_N = TABLE_A5_ROWS;
"""
with open(f'{OUT_DIR}/tableA5.js', 'w', encoding='utf-8') as f:
    f.write(t_a5_js)

# TABLE A.6
t_a6_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.6
 * "Values of ue associated to exclusion limits"
 * (See Annex A, Clause A.2.1.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 145 (PDF Page 257)
 */

export const TABLE_A6_META = {
  id: 'csa-c22.3-60826/tableA6',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.2.1 Calculation of characteristic strength',
  title: 'Values of ue associated to exclusion limits',
  references: ['7.3.2', '7.3.3', 'A.2.1'],
  iecPage: 145,
  pdfPages: [257],
  notes: {
    formula: 'Φc = (1 - 1.28 vR) / (1 - ue vR), where (10%)R = Φc × Rc and Rc = R_mean (1 - ue vR).',
  },
  clauses: {
    'A.2.1': {
      title: 'Calculation of characteristic strength',
      text:
        'If the value of ue is not known, it can be estimated according to Table A.6 which is based on the frequency of rejects calculated from the normal distribution.',
    },
  },
};

export const TABLE_A6_ROWS = [
  {
    id: 'frequent',
    estimatedFrequencyOfRejects: 'Frequent',
    exclusionLimit_e: 'About 10%',
    exclusionLimitFraction: 0.10,
    ue: 1.28,
  },
  {
    id: 'some',
    estimatedFrequencyOfRejects: 'Some',
    exclusionLimit_e: '2% to 5%',
    exclusionLimitFraction: 0.05,
    ue: 1.6,
  },
  {
    id: 'rare',
    estimatedFrequencyOfRejects: 'Rare',
    exclusionLimit_e: '< 2%',
    exclusionLimitFraction: 0.02,
    ue: 2.1,
  },
];

export const TABLE_A6_EXCLUSION_LIMIT_UE = TABLE_A6_ROWS;
"""
with open(f'{OUT_DIR}/tableA6.js', 'w', encoding='utf-8') as f:
    f.write(t_a6_js)

# TABLE A.7
t_a7_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.7
 * "Definition of terrain category"
 * (See Annex A, Clause A.4.1 and Table 4.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 151 (PDF Page 263)
 */

export const TABLE_A7_META = {
  id: 'csa-c22.3-60826/tableA7',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.4.1 Terrain roughness',
  title: 'Definition of terrain category',
  references: ['6.2.2', 'A.4.1', 'Table 4', 'Table A.8'],
  iecPage: 151,
  pdfPages: [263],
  notes: {
    topographyGuidance:
      'For a line that follows the ridge of a hill, a terrain roughness which is smoother by one category than the one chosen for the area should be selected in order to be conservative. For a line running along a valley, the C roughness should be chosen for all cases, whatever the terrain characteristics may be.',
  },
  clauses: {
    'A.4.1': {
      title: 'Terrain roughness',
      text: 'Four categories of terrain, of increasing roughness, are considered as indicated in Table A.7.',
    },
  },
};

export const TABLE_A7_ROWS = [
  {
    category: 'A',
    characteristic: 'Large stretch of water up-wind, flat coastal area, flat desert',
  },
  {
    category: 'B',
    characteristic: 'Open country with very few obstacles, for instance moorlands or cultivated field with a few trees or buildings',
  },
  {
    category: 'C',
    characteristic: 'Terrain with numerous small obstacles of low height (hedges, trees and buildings)',
  },
  {
    category: 'D',
    characteristic: 'Suburban areas or terrain with many tall trees',
  },
];

export const TABLE_A7_TERRAIN_DEFINITIONS = TABLE_A7_ROWS;
"""
with open(f'{OUT_DIR}/tableA7.js', 'w', encoding='utf-8') as f:
    f.write(t_a7_js)

# TABLE A.8
t_a8_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.8
 * "Factors describing wind action depending on terrain category"
 * (See Annex A, Clause A.4.2 and Table 4.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 153 (PDF Page 265)
 */

export const TABLE_A8_META = {
  id: 'csa-c22.3-60826/tableA8',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.4.2 Assessment of meteorological measurements',
  title: 'Factors describing wind action depending on terrain category',
  references: ['6.2.2', '6.2.3', 'A.4.2', 'Table 4', 'Table A.7'],
  iecPage: 153,
  pdfPages: [265],
  notes: {
    powerLawFormula: 'Vz = VR × (z / 10)^α, where z is height above ground (m) and α is the power law exponent in Table A.8.',
  },
  clauses: {
    'A.4.2': {
      title: 'Assessment of meteorological measurements',
      text:
        'If height z (m) differs from 10 m, the variation of wind speed with height z can be derived from the power law Vz = VR (z/10)^α, where α and roughness factor KR are given in Table A.8.',
    },
  },
};

export const TABLE_A8_ROWS = [
  {
    category: 'A',
    roughnessLength_Z0_m: 0.01,
    powerLawExponent_alpha: { min: 0.10, max: 0.12, default: 0.11, display: '0.10 to 0.12' },
    KR: 1.08,
  },
  {
    category: 'B',
    roughnessLength_Z0_m: 0.05,
    powerLawExponent_alpha: { min: 0.16, max: 0.16, default: 0.16, display: '0.16' },
    KR: 1.00,
  },
  {
    category: 'C',
    roughnessLength_Z0_m: 0.30,
    powerLawExponent_alpha: { min: 0.22, max: 0.22, default: 0.22, display: '0.22' },
    KR: 0.85,
  },
  {
    category: 'D',
    roughnessLength_Z0_m: 1.00,
    powerLawExponent_alpha: { min: 0.28, max: 0.28, default: 0.28, display: '0.28' },
    KR: 0.67,
  },
];

export const TABLE_A8_WIND_ACTION_FACTORS = TABLE_A8_ROWS;
"""
with open(f'{OUT_DIR}/tableA8.js', 'w', encoding='utf-8') as f:
    f.write(t_a8_js)

# TABLE A.9
t_a9_js = """/**
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
"""
with open(f'{OUT_DIR}/tableA9.js', 'w', encoding='utf-8') as f:
    f.write(t_a9_js)

# TABLE A.10
t_a10_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.10
 * "Physical properties of ice"
 * (See Annex A, Clause A.5.4.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 171 (PDF Page 283)
 */

export const TABLE_A10_META = {
  id: 'csa-c22.3-60826/tableA10',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.5.4 Physical properties of ice',
  title: 'Physical properties of ice',
  references: ['6.3', '6.4.5', 'A.5.4', 'Table 8', 'Table A.11', 'Table A.14'],
  iecPage: 171,
  pdfPages: [283],
  clauses: {
    'A.5.4': {
      title: 'Physical properties of ice',
      text: 'The physical properties of atmospheric ice may vary within rather wide limits. Typical properties are listed in Table A.10.',
    },
  },
};

export const TABLE_A10_ROWS = [
  {
    id: 'glaze_ice',
    iceType: 'Glaze ice',
    densityRange_kg_m3: { min: 700, max: 900, display: '700 – 900' },
    adhesion: 'Strong',
    cohesion: 'Strong',
    appearance: {
      colour: 'Transparent',
      shape: 'Cylindrical icicles',
    },
  },
  {
    id: 'wet_snow',
    iceType: 'Wet snow',
    densityRange_kg_m3: { min: 400, max: 700, display: '400 – 700' },
    adhesion: 'Medium',
    cohesion: 'Medium to strong',
    appearance: {
      colour: 'White',
      shape: 'Cylindrical',
    },
  },
  {
    id: 'hard_rime',
    iceType: 'Hard rime',
    densityRange_kg_m3: { min: 700, max: 900, display: '700 – 900' },
    adhesion: 'Strong',
    cohesion: 'Very strong',
    appearance: {
      colour: 'Opaque to transparent',
      shape: 'Eccentric pennants into wind',
    },
  },
  {
    id: 'soft_rime',
    iceType: 'Soft rime',
    densityRange_kg_m3: { min: 200, max: 600, display: '200 – 600' },
    adhesion: 'Medium',
    cohesion: 'Low to medium',
    appearance: {
      colour: 'White',
      shape: 'Eccentric pennants into wind',
    },
  },
];

export const TABLE_A10_ICE_PHYSICAL_PROPERTIES = TABLE_A10_ROWS;
"""
with open(f'{OUT_DIR}/tableA10.js', 'w', encoding='utf-8') as f:
    f.write(t_a10_js)

# TABLE A.11
t_a11_js = """/**
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
"""
with open(f'{OUT_DIR}/tableA11.js', 'w', encoding='utf-8') as f:
    f.write(t_a11_js)

# TABLE A.12
t_a12_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.12
 * "Statistical parameters of ice loads"
 * (See Annex A, Clause A.5.8.1.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 179 (PDF Page 291)
 */

export const TABLE_A12_META = {
  id: 'csa-c22.3-60826/tableA12',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.5.8.1 Evaluation of information on ice loads',
  title: 'Statistical parameters of ice loads',
  references: ['6.3.4', 'A.5.8.1'],
  iecPage: 179,
  pdfPages: [291],
  notes: {
    noStatisticalDataFallback:
      'If only the maximum value gmax of ice load during a certain number of years is available (no statistical data), the mean value g_mean should be taken as 0.45 gmax and standard deviation σg as 0.5 g_mean.',
  },
  clauses: {
    'A.5.8.1': {
      title: 'Evaluation of information on ice loads',
      text:
        'If records of yearly maximum ice loads during a period of at least 10 years are available, the mean value g_mean is derived from the records of the yearly maximum ice load; the standard deviation σg is calculated or estimated according to Table A.12.',
    },
  },
};

export const TABLE_A12_ROWS = [
  {
    id: 'n_10_to_20',
    yearsOfObservationRange: '10 ≤ n ≤ 20',
    nMin: 10,
    nMax: 20,
    meanValue: 'g_mean',
    standardDeviationRule: '0.5 g_mean ≤ σg ≤ 0.7 g_mean',
    covRange: { min: 0.50, max: 0.70 },
  },
  {
    id: 'n_ge_20',
    yearsOfObservationRange: 'n ≥ 20',
    nMin: 20,
    nMax: null,
    meanValue: 'g_mean',
    standardDeviationRule: 'σg < 0.7 g_mean',
    covRange: { min: null, max: 0.70 },
  },
];

export const TABLE_A12_ICE_STATISTICAL_PARAMS = TABLE_A12_ROWS;
"""
with open(f'{OUT_DIR}/tableA12.js', 'w', encoding='utf-8') as f:
    f.write(t_a12_js)

# TABLE A.13
t_a13_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.13
 * "Combined wind and ice loading conditions"
 * (See Annex A, Clause A.6.1 and Table 7.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 183 (PDF Page 295)
 */

export const TABLE_A13_META = {
  id: 'csa-c22.3-60826/tableA13',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.6.1 Combined probabilities',
  title: 'Combined wind and ice loading conditions',
  references: ['6.4.1', 'A.6.1', 'Table 7', 'Table A.14'],
  iecPage: 183,
  pdfPages: [295],
  notes: {
    indexDefinitions:
      'The high probability (index H) is considered to be the average of extreme yearly values, while the low probability (index L) of the variable is the one corresponding to a return period T.',
  },
  clauses: {
    'A.6.1': {
      title: 'Combined probabilities',
      text:
        'Three combined wind and ice loading conditions can be formulated by combining one low probability variable (return period T) with high probability (average of extreme yearly values) for the remaining variables.',
    },
  },
};

export const TABLE_A13_ROWS = [
  {
    id: 'condition_1',
    loadingCondition: 'Condition 1',
    iceWeight: 'gL (low probability / extreme ice of return period T)',
    windSpeed: 'VIH (high probability / average yearly max wind during icing)',
    effectiveDragCoefficient: 'CIH',
    density: 'δ1',
  },
  {
    id: 'condition_2',
    loadingCondition: 'Condition 2',
    iceWeight: 'gH (high probability / average yearly max ice)',
    windSpeed: 'VIL (low probability / extreme wind during icing of return period T)',
    effectiveDragCoefficient: 'CIH',
    density: 'δ1',
  },
  {
    id: 'condition_3',
    loadingCondition: 'Condition 3',
    iceWeight: 'gH (high probability / average yearly max ice)',
    windSpeed: 'VIH (high probability / average yearly max wind during icing)',
    effectiveDragCoefficient: 'CIL (low probability / extreme drag coefficient)',
    density: 'δ2',
  },
];

export const TABLE_A13_COMBINED_LOADING_CONDITIONS = TABLE_A13_ROWS;
"""
with open(f'{OUT_DIR}/tableA13.js', 'w', encoding='utf-8') as f:
    f.write(t_a13_js)

# TABLE A.14
t_a14_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table A.14
 * "Drag coefficients and density of ice-covered conductors"
 * (See Annex A, Clause A.6.2 and Table 8.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex A, Page 183 (PDF Page 295)
 */

export const TABLE_A14_META = {
  id: 'csa-c22.3-60826/tableA14',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex A — A.6.2 Drag coefficients of ice-covered conductors',
  title: 'Drag coefficients and density of ice-covered conductors',
  references: ['6.4.5', 'A.6.2', 'Table 8', 'Table A.13'],
  iecPage: 183,
  pdfPages: [295],
  clauses: {
    'A.6.2': {
      title: 'Drag coefficients of ice-covered conductors',
      text:
        'As long as statistical data on the effective drag coefficients and densities are not available, it is suggested, in the absence of other experimental values, that the values given in Table A.14 should be used.',
    },
  },
};

export const TABLE_A14_ROWS = [
  {
    id: 'wet_snow',
    iceType: 'Wet snow',
    effectiveDragCoefficient_CIH: 1.0,
    density_delta1_kg_m3: 600,
    effectiveDragCoefficient_CIL: 1.4,
    density_delta2_kg_m3: 400,
  },
  {
    id: 'soft_rime',
    iceType: 'Soft rime',
    effectiveDragCoefficient_CIH: 1.2,
    density_delta1_kg_m3: 600,
    effectiveDragCoefficient_CIL: 1.7,
    density_delta2_kg_m3: 400,
  },
  {
    id: 'hard_rime',
    iceType: 'Hard rime',
    effectiveDragCoefficient_CIH: 1.1,
    density_delta1_kg_m3: 900,
    effectiveDragCoefficient_CIL: 1.5,
    density_delta2_kg_m3: 700,
  },
  {
    id: 'glaze_ice',
    iceType: 'Glaze ice',
    effectiveDragCoefficient_CIH: 1.0,
    density_delta1_kg_m3: 900,
    effectiveDragCoefficient_CIL: 1.4,
    density_delta2_kg_m3: 900,
  },
];

export const TABLE_A14_ICE_DRAG_AND_DENSITY = TABLE_A14_ROWS;
"""
with open(f'{OUT_DIR}/tableA14.js', 'w', encoding='utf-8') as f:
    f.write(t_a14_js)

# ---------------------------------------------------------------------------
# INFORMATIVE ANNEX B TABLES (B.1 to B.6)
# ---------------------------------------------------------------------------

# TABLE B.1
t_b1_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table B.1
 * "Ratios of x / x_mean for a Gumbel distribution function, T return period in years
 *  of loading event, n number of years with observations, vx coefficient of variation"
 * (See Annex B, Clause B.2.1 and Table C.1.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex B, Page 193 (PDF Page 305)
 */

export const TABLE_B1_META = {
  id: 'csa-c22.3-60826/tableB1',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex B — B.2.1 Wind data (Gumbel distribution)',
  title: 'Ratios of x / x_mean for a Gumbel distribution function, T return period in years of loading event, n number of years with observations, vx coefficient of variation',
  references: ['5.2.1', 'A.4.5.2', 'B.2.1', 'Table 2', 'Table A.9', 'Table C.1'],
  iecPage: 193,
  pdfPages: [305],
  notes: {
    formula: 'x(T) / x_mean = 1 + [(-ln(-ln(1 - 1/T)) - C2) / C1] × vx, where C1 and C2 are Gumbel sample size parameters from Table C.1.',
  },
  clauses: {
    'B.2.1': {
      title: 'Wind data (Gumbel distribution)',
      text:
        'The yearly maximum wind speeds are generally fitted with a Gumbel (Extreme Value Type I) distribution. Table B.1 gives the ratio x / x_mean as a function of COV (vx), sample size n (years of observations), and return period T (50, 150, and 500 years).',
    },
  },
};

export const TABLE_B1_ROWS = [
  {
    vx: 0.05,
    T_50: { n_10: 1.18, n_15: 1.17, n_20: 1.16, n_25: 1.15, n_50: 1.14, n_inf: 1.13 },
    T_150: { n_10: 1.24, n_15: 1.22, n_20: 1.21, n_25: 1.21, n_50: 1.19, n_inf: 1.17 },
    T_500: { n_10: 1.30, n_15: 1.28, n_20: 1.27, n_25: 1.26, n_50: 1.24, n_inf: 1.22 },
  },
  {
    vx: 0.075,
    T_50: { n_10: 1.27, n_15: 1.25, n_20: 1.24, n_25: 1.23, n_50: 1.22, n_inf: 1.19 },
    T_150: { n_10: 1.36, n_15: 1.33, n_20: 1.32, n_25: 1.31, n_50: 1.29, n_inf: 1.26 },
    T_500: { n_10: 1.45, n_15: 1.42, n_20: 1.40, n_25: 1.39, n_50: 1.37, n_inf: 1.33 },
  },
  {
    vx: 0.10,
    T_50: { n_10: 1.36, n_15: 1.33, n_20: 1.32, n_25: 1.31, n_50: 1.29, n_inf: 1.26 },
    T_150: { n_10: 1.48, n_15: 1.44, n_20: 1.42, n_25: 1.41, n_50: 1.38, n_inf: 1.36 },
    T_500: { n_10: 1.60, n_15: 1.56, n_20: 1.54, n_25: 1.52, n_50: 1.49, n_inf: 1.44 },
  },
  {
    vx: 0.12,
    T_50: { n_10: 1.43, n_15: 1.40, n_20: 1.38, n_25: 1.37, n_50: 1.35, n_inf: 1.31 },
    T_150: { n_10: 1.57, n_15: 1.53, n_20: 1.51, n_25: 1.49, n_50: 1.46, n_inf: 1.41 },
    T_500: { n_10: 1.72, n_15: 1.67, n_20: 1.64, n_25: 1.62, n_50: 1.59, n_inf: 1.53 },
  },
  {
    vx: 0.15,
    T_50: { n_10: 1.54, n_15: 1.50, n_20: 1.48, n_25: 1.46, n_50: 1.43, n_inf: 1.39 },
    T_150: { n_10: 1.71, n_15: 1.66, n_20: 1.63, n_25: 1.62, n_50: 1.58, n_inf: 1.52 },
    T_500: { n_10: 1.90, n_15: 1.84, n_20: 1.80, n_25: 1.78, n_50: 1.73, n_inf: 1.66 },
  },
  {
    vx: 0.16,
    T_50: { n_10: 1.57, n_15: 1.53, n_20: 1.51, n_25: 1.49, n_50: 1.46, n_inf: 1.41 },
    T_150: { n_10: 1.76, n_15: 1.70, n_20: 1.68, n_25: 1.66, n_50: 1.61, n_inf: 1.55 },
    T_500: { n_10: 1.96, n_15: 1.89, n_20: 1.86, n_25: 1.83, n_50: 1.78, n_inf: 1.70 },
  },
  {
    vx: 0.20,
    T_50: { n_10: 1.72, n_15: 1.66, n_20: 1.64, n_25: 1.62, n_50: 1.58, n_inf: 1.52 },
    T_150: { n_10: 1.95, n_15: 1.88, n_20: 1.84, n_25: 1.82, n_50: 1.77, n_inf: 1.69 },
    T_500: { n_10: 2.20, n_15: 2.12, n_20: 2.07, n_25: 2.04, n_50: 1.98, n_inf: 1.88 },
  },
  {
    vx: 0.25,
    T_50: { n_10: 1.90, n_15: 1.83, n_20: 1.79, n_25: 1.77, n_50: 1.72, n_inf: 1.65 },
    T_150: { n_10: 2.19, n_15: 2.10, n_20: 2.05, n_25: 2.03, n_50: 1.96, n_inf: 1.86 },
    T_500: { n_10: 2.51, n_15: 2.40, n_20: 2.34, n_25: 2.30, n_50: 2.22, n_inf: 2.10 },
  },
  {
    vx: 0.30,
    T_50: { n_10: 2.08, n_15: 2.00, n_20: 1.95, n_25: 1.93, n_50: 1.87, n_inf: 1.78 },
    T_150: { n_10: 2.43, n_15: 2.32, n_20: 2.27, n_25: 2.23, n_50: 2.15, n_inf: 2.04 },
    T_500: { n_10: 2.81, n_15: 2.68, n_20: 2.61, n_25: 2.56, n_50: 2.46, n_inf: 2.32 },
  },
  {
    vx: 0.35,
    T_50: { n_10: 2.26, n_15: 2.16, n_20: 2.11, n_25: 2.06, n_50: 2.01, n_inf: 1.91 },
    T_150: { n_10: 2.66, n_15: 2.54, n_20: 2.48, n_25: 2.44, n_50: 2.34, n_inf: 2.21 },
    T_500: { n_10: 3.11, n_15: 2.96, n_20: 2.87, n_25: 2.82, n_50: 2.71, n_inf: 2.54 },
  },
  {
    vx: 0.40,
    T_50: { n_10: 2.43, n_15: 2.33, n_20: 2.27, n_25: 2.24, n_50: 2.16, n_inf: 2.04 },
    T_150: { n_10: 2.90, n_15: 2.76, n_20: 2.69, n_25: 2.64, n_50: 2.54, n_inf: 2.36 },
    T_500: { n_10: 3.41, n_15: 3.23, n_20: 3.14, n_25: 3.08, n_50: 2.95, n_inf: 2.76 },
  },
  {
    vx: 0.45,
    T_50: { n_10: 2.61, n_15: 2.49, n_20: 2.43, n_25: 2.39, n_50: 2.30, n_inf: 2.17 },
    T_150: { n_10: 3.14, n_15: 2.98, n_20: 2.90, n_25: 2.85, n_50: 2.73, n_inf: 2.55 },
    T_500: { n_10: 3.71, n_15: 3.51, n_20: 3.41, n_25: 3.34, n_50: 3.20, n_inf: 2.98 },
  },
  {
    vx: 0.50,
    T_50: { n_10: 2.79, n_15: 2.66, n_20: 2.59, n_25: 2.54, n_50: 2.44, n_inf: 2.30 },
    T_150: { n_10: 3.38, n_15: 3.20, n_20: 3.11, n_25: 3.05, n_50: 2.92, n_inf: 2.73 },
    T_500: { n_10: 4.01, n_15: 3.79, n_20: 3.68, n_25: 3.60, n_50: 3.44, n_inf: 3.20 },
  },
  {
    vx: 0.55,
    T_50: { n_10: 2.97, n_15: 2.83, n_20: 2.75, n_25: 2.70, n_50: 2.59, n_inf: 2.43 },
    T_150: { n_10: 3.61, n_15: 3.42, n_20: 3.32, n_25: 3.26, n_50: 3.11, n_inf: 2.90 },
    T_500: { n_10: 4.31, n_15: 4.07, n_20: 3.94, n_25: 3.86, n_50: 3.68, n_inf: 3.42 },
  },
  {
    vx: 0.60,
    T_50: { n_10: 3.15, n_15: 2.99, n_20: 2.91, n_25: 2.85, n_50: 2.73, n_inf: 2.56 },
    T_150: { n_10: 3.85, n_15: 3.64, n_20: 3.53, n_25: 3.46, n_50: 3.30, n_inf: 3.07 },
    T_500: { n_10: 4.61, n_15: 4.35, n_20: 4.21, n_25: 4.12, n_50: 3.93, n_inf: 3.64 },
  },
  {
    vx: 0.65,
    T_50: { n_10: 3.33, n_15: 3.16, n_20: 3.07, n_25: 3.01, n_50: 2.88, n_inf: 2.68 },
    T_150: { n_10: 4.09, n_15: 3.86, n_20: 3.74, n_25: 3.67, n_50: 3.50, n_inf: 3.25 },
    T_500: { n_10: 4.91, n_15: 4.63, n_20: 4.48, n_25: 4.38, n_50: 4.17, n_inf: 3.86 },
  },
];

export const TABLE_B1_GUMBEL_RATIOS = TABLE_B1_ROWS;
"""
with open(f'{OUT_DIR}/tableB1.js', 'w', encoding='utf-8') as f:
    f.write(t_b1_js)

# TABLE B.2
t_b2_js = """/**
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
"""
with open(f'{OUT_DIR}/tableB2.js', 'w', encoding='utf-8') as f:
    f.write(t_b2_js)

# TABLE B.3
t_b3_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table B.3
 * "Statistical parameters U_mean and σu of wind span variation"
 * (See Annex B, Clause B.4.1 and Table B.4.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex B, Page 203 (PDF Page 315)
 */

export const TABLE_B3_META = {
  id: 'csa-c22.3-60826/tableB3',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex B — B.4.1 Span variation and use factor U',
  title: 'Statistical parameters U_mean and σu of wind span variation',
  references: ['5.2.3', 'B.4.1', 'Table B.4', 'Table B.5', 'Table B.6'],
  iecPage: 203,
  pdfPages: [315],
  notes: {
    bounds: 'In Tables B.3 and B.4 the lower bound of the use factor is assumed to be 0.4 and the upper bound is 1.0.',
    terrainCodes: 'a = flat; b = rolling, hilly; c = mountainous.',
    constraintCodes: '1 = no special constraints; 2 = constraints on support locations.',
  },
  clauses: {
    'B.4.1': {
      title: 'Span variation and use factor',
      text:
        'U_wind = Average wind span / Design wind span = Average span / Design wind span. In the absence of specific data, the statistical parameters of U identified in Tables B.3 and B.4 can be considered typical for describing span variation of common transmission lines.',
    },
  },
};

export const TABLE_B3_ROWS = [
  {
    numSuspensionSupportTypes: 1,
    a1_flatUnconstrained: { U_mean: 0.95, sigma_u: 0.05 },
    b1_a2_rollingUnconstrainedOrFlatConstrained: { U_mean: 0.85, sigma_u: 0.10 },
    b2_c1_rollingConstrainedOrMountainousUnconstrained: { U_mean: 0.75, sigma_u: 0.15 },
    c2_mountainousConstrained: { U_mean: 0.55, sigma_u: 0.20 },
  },
  {
    numSuspensionSupportTypes: 2,
    a1_flatUnconstrained: { U_mean: 1.00, sigma_u: 0.00, approximate: true },
    b1_a2_rollingUnconstrainedOrFlatConstrained: { U_mean: 0.95, sigma_u: 0.05 },
    b2_c1_rollingConstrainedOrMountainousUnconstrained: { U_mean: 0.85, sigma_u: 0.10 },
    c2_mountainousConstrained: { U_mean: 0.65, sigma_u: 0.15 },
  },
  {
    numSuspensionSupportTypes: 3,
    a1_flatUnconstrained: { U_mean: 1.00, sigma_u: 0.00, approximate: true },
    b1_a2_rollingUnconstrainedOrFlatConstrained: { U_mean: 1.00, sigma_u: 0.00, approximate: true },
    b2_c1_rollingConstrainedOrMountainousUnconstrained: { U_mean: 0.95, sigma_u: 0.05 },
    c2_mountainousConstrained: { U_mean: 0.75, sigma_u: 0.10 },
  },
];

export const TABLE_B3_WIND_SPAN_VARIATION = TABLE_B3_ROWS;
"""
with open(f'{OUT_DIR}/tableB3.js', 'w', encoding='utf-8') as f:
    f.write(t_b3_js)

# TABLE B.4
t_b4_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table B.4
 * "Statistical parameters U_mean and σu of weight span variation"
 * (See Annex B, Clause B.4.1 and Table B.3.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex B, Page 205 (PDF Page 317)
 */

export const TABLE_B4_META = {
  id: 'csa-c22.3-60826/tableB4',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex B — B.4.1 Span variation and use factor U',
  title: 'Statistical parameters U_mean and σu of weight span variation',
  references: ['5.2.3', 'B.4.1', 'Table B.3', 'Table B.5', 'Table B.6'],
  iecPage: 205,
  pdfPages: [317],
  notes: {
    bounds: 'In Tables B.3 and B.4 the lower bound of the use factor is assumed to be 0.4 and the upper bound is 1.0.',
    terrainCodes: 'a = flat; b = rolling, hilly; c = mountainous.',
    constraintCodes: '1 = no special constraints; 2 = constraints on support locations.',
  },
  clauses: {
    'B.4.1': {
      title: 'Span variation and use factor',
      text:
        'U_weight = Average weight span / Design weight span = Average span / Design weight span.',
    },
  },
};

export const TABLE_B4_ROWS = [
  {
    numSuspensionSupportTypes: 1,
    a1_flatUnconstrained: { U_mean: 0.85, sigma_u: 0.05 },
    b1_a2_rollingUnconstrainedOrFlatConstrained: { U_mean: 0.75, sigma_u: 0.10 },
    b2_c1_rollingConstrainedOrMountainousUnconstrained: { U_mean: 0.65, sigma_u: 0.15 },
    c2_mountainousConstrained: { U_mean: 0.50, sigma_u: 0.20 },
  },
  {
    numSuspensionSupportTypes: 2,
    a1_flatUnconstrained: { U_mean: 0.95, sigma_u: 0.03 },
    b1_a2_rollingUnconstrainedOrFlatConstrained: { U_mean: 0.85, sigma_u: 0.05 },
    b2_c1_rollingConstrainedOrMountainousUnconstrained: { U_mean: 0.75, sigma_u: 0.10 },
    c2_mountainousConstrained: { U_mean: 0.60, sigma_u: 0.15 },
  },
  {
    numSuspensionSupportTypes: 3,
    a1_flatUnconstrained: { U_mean: 1.00, sigma_u: 0.00, approximate: true },
    b1_a2_rollingUnconstrainedOrFlatConstrained: { U_mean: 1.00, sigma_u: 0.00, approximate: true },
    b2_c1_rollingConstrainedOrMountainousUnconstrained: { U_mean: 0.85, sigma_u: 0.05 },
    c2_mountainousConstrained: { U_mean: 0.70, sigma_u: 0.10 },
  },
];

export const TABLE_B4_WEIGHT_SPAN_VARIATION = TABLE_B4_ROWS;
"""
with open(f'{OUT_DIR}/tableB4.js', 'w', encoding='utf-8') as f:
    f.write(t_b4_js)

# TABLE B.5
t_b5_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table B.5
 * "Values of use factor coefficient γu as a function of U_mean and N for vR = 0.10"
 * (See Annex B, Clause B.4.3 and Table B.6.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex B, Page 209 (PDF Page 321)
 */

export const TABLE_B5_META = {
  id: 'csa-c22.3-60826/tableB5',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex B — B.4.3 Joint effect of use factor and strength variation',
  title: 'Values of use factor coefficient γu as a function of U_mean and N for vR = 0.10',
  references: ['5.2.3', 'B.4.3', 'Table B.6'],
  iecPage: 209,
  pdfPages: [321],
  notes: {
    formula: 'γu = (10%)min_N(R) / (10%)min_N(R/U). Obtained by Monte-Carlo simulation for vR = 0.10.',
  },
  clauses: {
    'B.4.3': {
      title: 'Joint effect of use factor and strength variation',
      text:
        'From Table B.5 we notice that the use factor coefficient γu increases very slightly with increasing number of supports N and can be taken as nearly constant.',
    },
  },
};

export const TABLE_B5_ROWS = [
  {
    U_mean: 0.95,
    sigma_u: 0.05,
    gammaUByN: { N_1: 0.96, N_2: 0.96, N_5: 0.97, N_10: 0.97, N_20: 0.97, N_50: 0.97, N_100: 0.97 },
  },
  {
    U_mean: 0.85,
    sigma_u: 0.10,
    gammaUByN: { N_1: 0.90, N_2: 0.90, N_5: 0.91, N_10: 0.92, N_20: 0.94, N_50: 0.94, N_100: 0.94 },
  },
  {
    U_mean: 0.80,
    sigma_u: 0.15,
    gammaUByN: { N_1: 0.89, N_2: 0.90, N_5: 0.91, N_10: 0.91, N_20: 0.92, N_50: 0.93, N_100: 0.94 },
  },
];

export const TABLE_B5_USE_FACTOR_GAMMA_U = TABLE_B5_ROWS;
"""
with open(f'{OUT_DIR}/tableB5.js', 'w', encoding='utf-8') as f:
    f.write(t_b5_js)

# TABLE B.6
t_b6_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table B.6
 * "Use factor coefficient γu for different strength coefficients of variation"
 * (See Annex B, Clause B.4.4 and Table B.5.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex B, Page 211 (PDF Page 323)
 */

export const TABLE_B6_META = {
  id: 'csa-c22.3-60826/tableB6',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex B — B.4.4 Generalized results for use factor coefficients γu',
  title: 'Use factor coefficient γu for different strength coefficients of variation',
  references: ['5.2.3', 'B.4.4', 'Table B.3', 'Table B.4', 'Table B.5'],
  iecPage: 211,
  pdfPages: [323],
  clauses: {
    'B.4.4': {
      title: 'Generalized results for use factor coefficients γu',
      text:
        'Values of use factor coefficient γu similar to those given in Table B.5 were obtained for other vR values (0.05, 0.075, 0.10, 0.15, 0.20 and 0.25). These values were found almost constant, especially when the variation of the use factor coefficient is low. Table B.6 summarises results of γu.',
    },
  },
};

export const TABLE_B6_ROWS = [
  {
    U_mean: 0.95,
    sigma_u: 0.05,
    recommendedGammaU: 0.95,
    byN: [
      { N: 1, cov_0_05: 0.97, cov_0_10: 0.96, cov_0_15: 0.96, cov_0_20: 0.96 },
      { N: 10, cov_0_05: 0.97, cov_0_10: 0.97, cov_0_15: 0.96, cov_0_20: 0.97 },
      { N: 100, cov_0_05: 0.98, cov_0_10: 0.97, cov_0_15: 0.97, cov_0_20: 0.97 },
    ],
  },
  {
    U_mean: 0.85,
    sigma_u: 0.10,
    recommendedGammaU: 0.90,
    byN: [
      { N: 1, cov_0_05: 0.92, cov_0_10: 0.90, cov_0_15: 0.88, cov_0_20: 0.87 },
      { N: 10, cov_0_05: 0.94, cov_0_10: 0.92, cov_0_15: 0.89, cov_0_20: 0.88 },
      { N: 100, cov_0_05: 0.96, cov_0_10: 0.94, cov_0_15: 0.90, cov_0_20: 0.92 },
    ],
  },
  {
    U_mean: 0.80,
    sigma_u: 0.15,
    recommendedGammaU: 0.88,
    byN: [
      { N: 1, cov_0_05: 0.92, cov_0_10: 0.89, cov_0_15: 0.86, cov_0_20: 0.84 },
      { N: 10, cov_0_05: 0.94, cov_0_10: 0.91, cov_0_15: 0.88, cov_0_20: 0.87 },
      { N: 100, cov_0_05: 0.96, cov_0_10: 0.94, cov_0_15: 0.90, cov_0_20: 0.88 },
    ],
  },
  {
    U_mean: 0.75,
    sigma_u: 0.10,
    recommendedGammaU: 0.83,
    byN: [
      { N: 1, cov_0_05: 0.83, cov_0_10: 0.81, cov_0_15: 0.79, cov_0_20: 0.78 },
      { N: 10, cov_0_05: 0.87, cov_0_10: 0.83, cov_0_15: 0.80, cov_0_20: 0.78 },
      { N: 100, cov_0_05: 0.88, cov_0_10: 0.84, cov_0_15: 0.81, cov_0_20: 0.78 },
    ],
  },
];

export const TABLE_B6_GENERALIZED_USE_FACTOR_GAMMA_U = TABLE_B6_ROWS;
"""
with open(f'{OUT_DIR}/tableB6.js', 'w', encoding='utf-8') as f:
    f.write(t_b6_js)

# ---------------------------------------------------------------------------
# INFORMATIVE ANNEX C TABLES (C.1 and C.2)
# ---------------------------------------------------------------------------

# TABLE C.1
t_c1_js = """/**
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
"""
with open(f'{OUT_DIR}/tableC1.js', 'w', encoding='utf-8') as f:
    f.write(t_c1_js)

# TABLE C.2
t_c2_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table C.2
 * "Values of u1 for given values of function F(u1) = I(u1, p3 - 1)"
 * (See Annex C, Clause C.6 and Figure C.5.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Annex C, Page 235 (PDF Page 347)
 */

export const TABLE_C2_META = {
  id: 'csa-c22.3-60826/tableC2',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: 'Annex C — C.6 Gamma distribution',
  title: 'Values of u1 for given values of function F(u1) = I(u1, p3 - 1)',
  references: ['C.6', 'Figure C.5'],
  iecPage: 235,
  pdfPages: [347],
  notes: {
    structure:
      'Upper sub-table gives u1 for upper tail return periods T = 50 (FT = 0.98), 150 (FT = 0.993), and 500 (FT = 0.998) for shape parameter p3 in [0.05, 1.00]. Lower sub-table gives u1 for lower tail exclusion limits e = 2% (Fe = 0.02), 5% (Fe = 0.05), and 10% (Fe = 0.10) for shape parameter p3 in [1.0, 3.0].',
  },
  clauses: {
    'C.6': {
      title: 'Gamma distribution',
      text:
        'Table C.2 provides quantiles u1 of the standardized Gamma distribution F(u1) = I(u1, p3 - 1) for return periods T (load tail) and exclusion limits e (strength tail).',
    },
  },
};

export const TABLE_C2_UPPER_TAIL_RETURN_PERIODS = [
  { p3: 0.05, T_50_FT_0_98: 3.06, T_150_FT_0_993: 6.04, T_500_FT_0_998: 9.86 },
  { p3: 0.10, T_50_FT_0_98: 3.54, T_150_FT_0_993: 5.95, T_500_FT_0_998: 8.87 },
  { p3: 0.15, T_50_FT_0_98: 3.68, T_150_FT_0_993: 5.78, T_500_FT_0_998: 8.27 },
  { p3: 0.20, T_50_FT_0_98: 3.74, T_150_FT_0_993: 5.64, T_500_FT_0_998: 7.86 },
  { p3: 0.25, T_50_FT_0_98: 3.77, T_150_FT_0_993: 5.53, T_500_FT_0_998: 7.55 },
  { p3: 0.30, T_50_FT_0_98: 3.79, T_150_FT_0_993: 5.44, T_500_FT_0_998: 7.32 },
  { p3: 0.35, T_50_FT_0_98: 3.80, T_150_FT_0_993: 5.36, T_500_FT_0_998: 7.14 },
  { p3: 0.40, T_50_FT_0_98: 3.81, T_150_FT_0_993: 5.30, T_500_FT_0_998: 6.99 },
  { p3: 0.45, T_50_FT_0_98: 3.82, T_150_FT_0_993: 5.25, T_500_FT_0_998: 6.86 },
  { p3: 0.50, T_50_FT_0_98: 3.83, T_150_FT_0_993: 5.20, T_500_FT_0_998: 6.75 },
  { p3: 0.55, T_50_FT_0_98: 3.84, T_150_FT_0_993: 5.17, T_500_FT_0_998: 6.66 },
  { p3: 0.60, T_50_FT_0_98: 3.84, T_150_FT_0_993: 5.14, T_500_FT_0_998: 6.58 },
  { p3: 0.65, T_50_FT_0_98: 3.85, T_150_FT_0_993: 5.11, T_500_FT_0_998: 6.52 },
  { p3: 0.70, T_50_FT_0_98: 3.86, T_150_FT_0_993: 5.09, T_500_FT_0_998: 6.46 },
  { p3: 0.75, T_50_FT_0_98: 3.87, T_150_FT_0_993: 5.07, T_500_FT_0_998: 6.40 },
  { p3: 0.80, T_50_FT_0_98: 3.88, T_150_FT_0_993: 5.05, T_500_FT_0_998: 6.36 },
  { p3: 0.85, T_50_FT_0_98: 3.88, T_150_FT_0_993: 5.04, T_500_FT_0_998: 6.31 },
  { p3: 0.90, T_50_FT_0_98: 3.89, T_150_FT_0_993: 5.03, T_500_FT_0_998: 6.28 },
  { p3: 0.95, T_50_FT_0_98: 3.90, T_150_FT_0_993: 5.02, T_500_FT_0_998: 6.25 },
  { p3: 1.00, T_50_FT_0_98: 3.91, T_150_FT_0_993: 5.01, T_500_FT_0_998: 6.22 },
];

export const TABLE_C2_LOWER_TAIL_EXCLUSION_LIMITS = [
  { p3: 1.0, e_2pct_Fe_0_02: 0.021, e_5pct_Fe_0_05: 0.053, e_10pct_Fe_0_10: 0.106 },
  { p3: 1.1, e_2pct_Fe_0_02: 0.026, e_5pct_Fe_0_05: 0.066, e_10pct_Fe_0_10: 0.131 },
  { p3: 1.2, e_2pct_Fe_0_02: 0.033, e_5pct_Fe_0_05: 0.083, e_10pct_Fe_0_10: 0.157 },
  { p3: 1.3, e_2pct_Fe_0_02: 0.042, e_5pct_Fe_0_05: 0.104, e_10pct_Fe_0_10: 0.183 },
  { p3: 1.4, e_2pct_Fe_0_02: 0.053, e_5pct_Fe_0_05: 0.122, e_10pct_Fe_0_10: 0.211 },
  { p3: 1.5, e_2pct_Fe_0_02: 0.067, e_5pct_Fe_0_05: 0.141, e_10pct_Fe_0_10: 0.238 },
  { p3: 1.6, e_2pct_Fe_0_02: 0.084, e_5pct_Fe_0_05: 0.161, e_10pct_Fe_0_10: 0.265 },
  { p3: 1.7, e_2pct_Fe_0_02: 0.104, e_5pct_Fe_0_05: 0.184, e_10pct_Fe_0_10: 0.293 },
  { p3: 1.8, e_2pct_Fe_0_02: 0.116, e_5pct_Fe_0_05: 0.207, e_10pct_Fe_0_10: 0.320 },
  { p3: 1.9, e_2pct_Fe_0_02: 0.130, e_5pct_Fe_0_05: 0.227, e_10pct_Fe_0_10: 0.347 },
  { p3: 2.0, e_2pct_Fe_0_02: 0.145, e_5pct_Fe_0_05: 0.248, e_10pct_Fe_0_10: 0.375 },
  { p3: 2.1, e_2pct_Fe_0_02: 0.162, e_5pct_Fe_0_05: 0.271, e_10pct_Fe_0_10: 0.403 },
  { p3: 2.2, e_2pct_Fe_0_02: 0.181, e_5pct_Fe_0_05: 0.295, e_10pct_Fe_0_10: 0.429 },
  { p3: 2.3, e_2pct_Fe_0_02: 0.202, e_5pct_Fe_0_05: 0.316, e_10pct_Fe_0_10: 0.455 },
  { p3: 2.4, e_2pct_Fe_0_02: 0.217, e_5pct_Fe_0_05: 0.337, e_10pct_Fe_0_10: 0.482 },
  { p3: 2.5, e_2pct_Fe_0_02: 0.233, e_5pct_Fe_0_05: 0.359, e_10pct_Fe_0_10: 0.509 },
  { p3: 2.6, e_2pct_Fe_0_02: 0.250, e_5pct_Fe_0_05: 0.382, e_10pct_Fe_0_10: 0.534 },
  { p3: 2.7, e_2pct_Fe_0_02: 0.268, e_5pct_Fe_0_05: 0.406, e_10pct_Fe_0_10: 0.559 },
  { p3: 2.8, e_2pct_Fe_0_02: 0.289, e_5pct_Fe_0_05: 0.426, e_10pct_Fe_0_10: 0.585 },
  { p3: 2.9, e_2pct_Fe_0_02: 0.308, e_5pct_Fe_0_05: 0.447, e_10pct_Fe_0_10: 0.611 },
  { p3: 3.0, e_2pct_Fe_0_02: 0.324, e_5pct_Fe_0_05: 0.469, e_10pct_Fe_0_10: 0.635 },
];

export const TABLE_C2_ROWS = {
  upperTailReturnPeriods: TABLE_C2_UPPER_TAIL_RETURN_PERIODS,
  lowerTailExclusionLimits: TABLE_C2_LOWER_TAIL_EXCLUSION_LIMITS,
};

export const TABLE_C2_GAMMA_U1_VALUES = TABLE_C2_ROWS;
"""
with open(f'{OUT_DIR}/tableC2.js', 'w', encoding='utf-8') as f:
    f.write(t_c2_js)

# ---------------------------------------------------------------------------
# Barrel export file: src/data/csa/c22_3_60826/index.js
# ---------------------------------------------------------------------------
index_js = """/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Complete Table Data Index
 * Exports all 47 tables from CAN/CSA-C22.3 No. 60826-10:
 *   - Canadian National Annexes: Tables CA.1, CA.2, CB.1, CB.2, CB.3 (5 tables)
 *   - Normative Clauses (5–7): Tables 1 through 20 (20 tables)
 *   - Informative Annex A: Tables A.1 through A.14 (14 tables)
 *   - Informative Annex B: Tables B.1 through B.6 (6 tables)
 *   - Informative Annex C: Tables C.1 and C.2 (2 tables)
 */

export * from './tableCA1.js';
export * from './tableCA2.js';
export * from './tableCB1.js';
export * from './tableCB2.js';
export * from './tableCB3.js';

export * from './table1.js';
export * from './table2.js';
export * from './table3.js';
export * from './table4.js';
export * from './table5.js';
export * from './table6.js';
export * from './table7.js';
export * from './table8.js';
export * from './table9.js';
export * from './table10.js';
export * from './table11.js';
export * from './table12.js';
export * from './table13.js';
export * from './table14.js';
export * from './table15.js';
export * from './table16.js';
export * from './table17.js';
export * from './table18.js';
export * from './table19.js';
export * from './table20.js';

export * from './tableA1.js';
export * from './tableA2.js';
export * from './tableA3.js';
export * from './tableA4.js';
export * from './tableA5.js';
export * from './tableA6.js';
export * from './tableA7.js';
export * from './tableA8.js';
export * from './tableA9.js';
export * from './tableA10.js';
export * from './tableA11.js';
export * from './tableA12.js';
export * from './tableA13.js';
export * from './tableA14.js';

export * from './tableB1.js';
export * from './tableB2.js';
export * from './tableB3.js';
export * from './tableB4.js';
export * from './tableB5.js';
export * from './tableB6.js';

export * from './tableC1.js';
export * from './tableC2.js';

import { TABLE_CA1_META, TABLE_CA1_ROWS } from './tableCA1.js';
import { TABLE_CA2_META, TABLE_CA2_ROWS } from './tableCA2.js';
import { TABLE_CB1_META, TABLE_CB1_ROWS } from './tableCB1.js';
import { TABLE_CB2_META, TABLE_CB2_ROWS } from './tableCB2.js';
import { TABLE_CB3_META, TABLE_CB3_ROWS } from './tableCB3.js';

import { TABLE_1_META, TABLE_1_ROWS } from './table1.js';
import { TABLE_2_META, TABLE_2_ROWS } from './table2.js';
import { TABLE_3_META, TABLE_3_ROWS } from './table3.js';
import { TABLE_4_META, TABLE_4_ROWS } from './table4.js';
import { TABLE_5_META, TABLE_5_ROWS } from './table5.js';
import { TABLE_6_META, TABLE_6_ROWS } from './table6.js';
import { TABLE_7_META, TABLE_7_ROWS } from './table7.js';
import { TABLE_8_META, TABLE_8_ROWS } from './table8.js';
import { TABLE_9_META, TABLE_9_ROWS } from './table9.js';
import { TABLE_10_META, TABLE_10_ROWS } from './table10.js';
import { TABLE_11_META, TABLE_11_ROWS } from './table11.js';
import { TABLE_12_META, TABLE_12_ROWS } from './table12.js';
import { TABLE_13_META, TABLE_13_ROWS } from './table13.js';
import { TABLE_14_META, TABLE_14_ROWS } from './table14.js';
import { TABLE_15_META, TABLE_15_ROWS } from './table15.js';
import { TABLE_16_META, TABLE_16_ROWS } from './table16.js';
import { TABLE_17_META, TABLE_17_ROWS } from './table17.js';
import { TABLE_18_META, TABLE_18_ROWS } from './table18.js';
import { TABLE_19_META, TABLE_19_ROWS } from './table19.js';
import { TABLE_20_META, TABLE_20_ROWS } from './table20.js';

import { TABLE_A1_META, TABLE_A1_ROWS } from './tableA1.js';
import { TABLE_A2_META, TABLE_A2_ROWS } from './tableA2.js';
import { TABLE_A3_META, TABLE_A3_ROWS } from './tableA3.js';
import { TABLE_A4_META, TABLE_A4_ROWS } from './tableA4.js';
import { TABLE_A5_META, TABLE_A5_ROWS } from './tableA5.js';
import { TABLE_A6_META, TABLE_A6_ROWS } from './tableA6.js';
import { TABLE_A7_META, TABLE_A7_ROWS } from './tableA7.js';
import { TABLE_A8_META, TABLE_A8_ROWS } from './tableA8.js';
import { TABLE_A9_META, TABLE_A9_ROWS } from './tableA9.js';
import { TABLE_A10_META, TABLE_A10_ROWS } from './tableA10.js';
import { TABLE_A11_META, TABLE_A11_ROWS } from './tableA11.js';
import { TABLE_A12_META, TABLE_A12_ROWS } from './tableA12.js';
import { TABLE_A13_META, TABLE_A13_ROWS } from './tableA13.js';
import { TABLE_A14_META, TABLE_A14_ROWS } from './tableA14.js';

import { TABLE_B1_META, TABLE_B1_ROWS } from './tableB1.js';
import { TABLE_B2_META, TABLE_B2_ROWS } from './tableB2.js';
import { TABLE_B3_META, TABLE_B3_ROWS } from './tableB3.js';
import { TABLE_B4_META, TABLE_B4_ROWS } from './tableB4.js';
import { TABLE_B5_META, TABLE_B5_ROWS } from './tableB5.js';
import { TABLE_B6_META, TABLE_B6_ROWS } from './tableB6.js';

import { TABLE_C1_META, TABLE_C1_ROWS } from './tableC1.js';
import { TABLE_C2_META, TABLE_C2_ROWS } from './tableC2.js';

export const CSA_60826_TABLES = {
  'Table CA.1': { meta: TABLE_CA1_META, rows: TABLE_CA1_ROWS },
  'Table CA.2': { meta: TABLE_CA2_META, rows: TABLE_CA2_ROWS },
  'Table CB.1': { meta: TABLE_CB1_META, rows: TABLE_CB1_ROWS },
  'Table CB.2': { meta: TABLE_CB2_META, rows: TABLE_CB2_ROWS },
  'Table CB.3': { meta: TABLE_CB3_META, rows: TABLE_CB3_ROWS },
  'Table 1': { meta: TABLE_1_META, rows: TABLE_1_ROWS },
  'Table 2': { meta: TABLE_2_META, rows: TABLE_2_ROWS },
  'Table 3': { meta: TABLE_3_META, rows: TABLE_3_ROWS },
  'Table 4': { meta: TABLE_4_META, rows: TABLE_4_ROWS },
  'Table 5': { meta: TABLE_5_META, rows: TABLE_5_ROWS },
  'Table 6': { meta: TABLE_6_META, rows: TABLE_6_ROWS },
  'Table 7': { meta: TABLE_7_META, rows: TABLE_7_ROWS },
  'Table 8': { meta: TABLE_8_META, rows: TABLE_8_ROWS },
  'Table 9': { meta: TABLE_9_META, rows: TABLE_9_ROWS },
  'Table 10': { meta: TABLE_10_META, rows: TABLE_10_ROWS },
  'Table 11': { meta: TABLE_11_META, rows: TABLE_11_ROWS },
  'Table 12': { meta: TABLE_12_META, rows: TABLE_12_ROWS },
  'Table 13': { meta: TABLE_13_META, rows: TABLE_13_ROWS },
  'Table 14': { meta: TABLE_14_META, rows: TABLE_14_ROWS },
  'Table 15': { meta: TABLE_15_META, rows: TABLE_15_ROWS },
  'Table 16': { meta: TABLE_16_META, rows: TABLE_16_ROWS },
  'Table 17': { meta: TABLE_17_META, rows: TABLE_17_ROWS },
  'Table 18': { meta: TABLE_18_META, rows: TABLE_18_ROWS },
  'Table 19': { meta: TABLE_19_META, rows: TABLE_19_ROWS },
  'Table 20': { meta: TABLE_20_META, rows: TABLE_20_ROWS },
  'Table A.1': { meta: TABLE_A1_META, rows: TABLE_A1_ROWS },
  'Table A.2': { meta: TABLE_A2_META, rows: TABLE_A2_ROWS },
  'Table A.3': { meta: TABLE_A3_META, rows: TABLE_A3_ROWS },
  'Table A.4': { meta: TABLE_A4_META, rows: TABLE_A4_ROWS },
  'Table A.5': { meta: TABLE_A5_META, rows: TABLE_A5_ROWS },
  'Table A.6': { meta: TABLE_A6_META, rows: TABLE_A6_ROWS },
  'Table A.7': { meta: TABLE_A7_META, rows: TABLE_A7_ROWS },
  'Table A.8': { meta: TABLE_A8_META, rows: TABLE_A8_ROWS },
  'Table A.9': { meta: TABLE_A9_META, rows: TABLE_A9_ROWS },
  'Table A.10': { meta: TABLE_A10_META, rows: TABLE_A10_ROWS },
  'Table A.11': { meta: TABLE_A11_META, rows: TABLE_A11_ROWS },
  'Table A.12': { meta: TABLE_A12_META, rows: TABLE_A12_ROWS },
  'Table A.13': { meta: TABLE_A13_META, rows: TABLE_A13_ROWS },
  'Table A.14': { meta: TABLE_A14_META, rows: TABLE_A14_ROWS },
  'Table B.1': { meta: TABLE_B1_META, rows: TABLE_B1_ROWS },
  'Table B.2': { meta: TABLE_B2_META, rows: TABLE_B2_ROWS },
  'Table B.3': { meta: TABLE_B3_META, rows: TABLE_B3_ROWS },
  'Table B.4': { meta: TABLE_B4_META, rows: TABLE_B4_ROWS },
  'Table B.5': { meta: TABLE_B5_META, rows: TABLE_B5_ROWS },
  'Table B.6': { meta: TABLE_B6_META, rows: TABLE_B6_ROWS },
  'Table C.1': { meta: TABLE_C1_META, rows: TABLE_C1_ROWS },
  'Table C.2': { meta: TABLE_C2_META, rows: TABLE_C2_ROWS },
};
"""
with open(f'{OUT_DIR}/index.js', 'w', encoding='utf-8') as f:
    f.write(index_js)

# ---------------------------------------------------------------------------
# Generate sandbox documentation folders matching sandbox/csa c22 no 1/Table X
# ---------------------------------------------------------------------------
tables_info = {
    'CA.1': ('Table CA.1: Weather data (Canadian locations)', 'Clauses 6.2.4, 6.3.4.1, CA.4', 'tableCA1.js'),
    'CA.2': ('Table CA.2: Factors γT to modify the 50-year return period weather variable to any other return period T', 'Clauses 5.2.1, 6.3.4.1, Table CB.1', 'tableCA2.js'),
    'CB.1': ('Table CB.1: Default values for distribution lines and structures', 'Annex CB, Clause CB.2', 'tableCB1.js'),
    'CB.2': ('Table CB.2: Conductor loads per pole (N)', 'Annex CB, Clause CB.3.7', 'tableCB2.js'),
    'CB.3': ('Table CB.3: Fibre stress calculation for pole selection', 'Annex CB, Clauses CB.3.6, CB.3.7', 'tableCB3.js'),
    '1': ('Table 1: Reliability levels for transmission lines', 'Clauses 5.1.1.1, 5.1.1.2, A.1.2', 'table1.js'),
    '2': ('Table 2: Default γT factors for adjustment of climatic loads in relation to return period T vs. 50 years', 'Clause 5.2.1, Table CA.2', 'table2.js'),
    '3': ('Table 3: Design requirements for the system', 'Clause 5.2.2', 'table3.js'),
    '4': ('Table 4: Classification of terrain categories', 'Clauses 6.2.2, 6.2.3, A.4, Tables A.7, A.8', 'table4.js'),
    '5': ('Table 5: Correction factor τ of dynamic reference wind pressure q0 due to altitude and temperatures', 'Clause 6.2.5', 'table5.js'),
    '6': ('Table 6: Non-uniform ice loading conditions', 'Clauses 6.3.6.3, 6.3.6.3.1A, 6.3.6.3.1B, Figure 12', 'table6.js'),
    '7': ('Table 7: Return period of combined ice and wind load', 'Clause 6.4.1, Table A.13', 'table7.js'),
    '8': ('Table 8: Drag coefficients of ice-covered conductors', 'Clause 6.4.5, Figure 13, Table A.14', 'table8.js'),
    '9': ('Table 9: Additional security measures', 'Clauses 6.6.2, 6.6.3.3', 'table9.js'),
    '10': ('Table 10: Number of supports subjected to maximum load intensity during any single occurrence of a climatic event', 'Clause 7.2.1, Table 11', 'table10.js'),
    '11': ('Table 11: Strength factor ΦN related to the number N of components or elements subjected to the critical load intensity', 'Clause 7.2.1, Table A.5', 'table11.js'),
    '12': ('Table 12: Values of ΦS2', 'Clause 7.2.2, Table A.4', 'table12.js'),
    '13': ('Table 13: Typical strength coordination of line components', 'Clause 7.2.2, Table A.3', 'table13.js'),
    '14': ('Table 14: Damage and failure limits of supports', 'Clause 7.3.1', 'table14.js'),
    '15': ('Table 15: Damage and failure limits of foundations', 'Clauses 7.3.1, 7.3.4', 'table15.js'),
    '16': ('Table 16: Damage and failure limits of conductors and ground wires', 'Clauses 7.3.1, 7.3.5', 'table16.js'),
    '17': ('Table 17: Damage and failure limit of interface components', 'Clauses 7.3.1, 7.3.6', 'table17.js'),
    '18': ('Table 18: Default values for strength coefficients of variation (COV)', 'Clause 7.3.2', 'table18.js'),
    '19': ('Table 19: u factors for log-normal distribution function for e = 10%', 'Clause 7.3.2', 'table19.js'),
    '20': ('Table 20: Value of quality factor ΦQ for lattice towers', 'Clause 7.3.3', 'table20.js'),
    'A.1': ('Table A.1: Yearly reliability corresponding to various assumptions of load and strength', 'Annex A, Clause A.1.2.1', 'tableA1.js'),
    'A.2': ('Table A.2: Relationship between reliability levels and return periods of limit loads', 'Annex A, Clause A.1.2.4', 'tableA2.js'),
    'A.3': ('Table A.3: Typical strength coordination', 'Annex A, Clause A.1.3.1', 'tableA3.js'),
    'A.4': ('Table A.4: Values of central safety factor α and strength coordination factor ΦS (90% probability)', 'Annex A, Clause A.1.3.4', 'tableA4.js'),
    'A.5': ('Table A.5: Strength factor ΦN related to N components in series subjected to the critical load', 'Annex A, Clause A.1.3.5', 'tableA5.js'),
    'A.6': ('Table A.6: Values of ue associated to exclusion limits', 'Annex A, Clause A.2.1', 'tableA6.js'),
    'A.7': ('Table A.7: Definition of terrain category', 'Annex A, Clause A.4.1', 'tableA7.js'),
    'A.8': ('Table A.8: Factors describing wind action depending on terrain category', 'Annex A, Clause A.4.2', 'tableA8.js'),
    'A.9': ('Table A.9: Values of reference wind speed VR', 'Annex A, Clause A.4.5.2', 'tableA9.js'),
    'A.10': ('Table A.10: Physical properties of ice', 'Annex A, Clause A.5.4', 'tableA10.js'),
    'A.11': ('Table A.11: Meteorological parameters controlling ice accretion', 'Annex A, Clause A.5.5', 'tableA11.js'),
    'A.12': ('Table A.12: Statistical parameters of ice loads', 'Annex A, Clause A.5.8.1', 'tableA12.js'),
    'A.13': ('Table A.13: Combined wind and ice loading conditions', 'Annex A, Clause A.6.1', 'tableA13.js'),
    'A.14': ('Table A.14: Drag coefficients and density of ice-covered conductors', 'Annex A, Clause A.6.2', 'tableA14.js'),
    'B.1': ('Table B.1: Ratios of x / x_mean for a Gumbel distribution function', 'Annex B, Clause B.2.1', 'tableB1.js'),
    'B.2': ('Table B.2: Parameters of Weibull distribution', 'Annex B, Clause B.3', 'tableB2.js'),
    'B.3': ('Table B.3: Statistical parameters U_mean and σu of wind span variation', 'Annex B, Clause B.4.1', 'tableB3.js'),
    'B.4': ('Table B.4: Statistical parameters U_mean and σu of weight span variation', 'Annex B, Clause B.4.1', 'tableB4.js'),
    'B.5': ('Table B.5: Values of use factor coefficient γu as a function of U_mean and N for vR = 0.10', 'Annex B, Clause B.4.3', 'tableB5.js'),
    'B.6': ('Table B.6: Use factor coefficient γu for different strength coefficients of variation', 'Annex B, Clause B.4.4', 'tableB6.js'),
    'C.1': ('Table C.1: Parameters C1 and C2 of Gumbel distribution', 'Annex C, Clause C.4', 'tableC1.js'),
    'C.2': ('Table C.2: Values of u1 for given values of function F(u1) = I(u1, p3 - 1)', 'Annex C, Clause C.6', 'tableC2.js'),
}

for t_id, (title, clauses_ref, filename) in tables_info.items():
    folder = f'{SANDBOX_DIR}/Table {t_id}'
    os.makedirs(folder, exist_ok=True)
    readme_path = f'{folder}/README.md'
    content = (
        f"# {title}\n\n"
        f"- **Governing Standard**: CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 (Design criteria of overhead transmission lines)\n"
        f"- **Associated Clauses & Annexes**: {clauses_ref}\n"
        f"- **Extracted Data Model**: `src/data/csa/c22_3_60826/{filename}`\n"
    )
    with open(readme_path, 'w', encoding='utf-8') as rf:
        rf.write(content)

print(f"Successfully generated all {len(tables_info)} CSA C22.3 No. 60826-10 tables in {OUT_DIR}!")
