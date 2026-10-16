"""
Generator for CSA O15-15: Wood utility poles and reinforcing stubs
Builds structured JavaScript data modules in src/data/csa/o15/
and markdown reference documentation in sandbox/csa o15/

Strict Ground Truth Implementation:
- All data strictly grounded in CAN/CSA-O15-15 standard text & verified tables.
- Zero fabrication: missing or non-existent standard values set to None / null.
- Collections sorted alphabetically per project rules.
"""

import os
import json

SRC_DIR = "src/data/csa/o15"
SANDBOX_DIR = "sandbox/csa o15"

os.makedirs(SRC_DIR, exist_ok=True)
os.makedirs(SANDBOX_DIR, exist_ok=True)

# -----------------------------------------------------------------------------
# 1. TABLE 3 & TABLE E.3: SPECIES MECHANICAL PROPERTIES
# -----------------------------------------------------------------------------
# Ground truth verified from CSA O15-15 pages 26-28 (Table 3), pages 70-72 (Table E.3),
# and Clause 6.5.3 (Species identification codes).
# All dash ("—") values in the standard are explicitly set to None (null in JS).
# No density values exist in Table 3 or Table E.3.
SPECIES_DATA = [
    {
        "id": "amabilis_fir",
        "commonName": "Amabilis fir",
        "botanicalName": "Abies amabilis",
        "speciesCode": "AF",
        "fibreStress_psi": 5400,
        "fibreStress_MPa": 37,
        "fibreStress_cov_percent": 18,
        "modulusOfElasticity_ksi": 1220,
        "modulusOfElasticity_MPa": 8810,
        "moe_cov_percent": 19,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 6",
        "dimensionTableMetric": "Table E.6",
        "stubTableImperial": "Table 16",
        "stubTableMetric": "Table E.16",
        "notes": "Grouped with 5400 psi (37 MPa) classification."
    },
    {
        "id": "coastal_douglas_fir",
        "commonName": "Coastal Douglas fir",
        "botanicalName": "Pseudotsuga menziesii",
        "speciesCode": "DF",
        "region": "Coastal",
        "fibreStress_psi": 8000,
        "fibreStress_MPa": 55,
        "fibreStress_cov_percent": 15,
        "modulusOfElasticity_ksi": 2030,
        "modulusOfElasticity_MPa": 14000,
        "moe_cov_percent": 11,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 13",
        "dimensionTableMetric": "Table E.13",
        "stubTableImperial": "Table 23",
        "stubTableMetric": "Table E.23",
        "notes": "Only Douglas fir poles taken from western slopes of Coast and Cascade Mountains shall be classified as coastal Douglas fir (Clause 4.1.1, Note 7 to Table 3)."
    },
    {
        "id": "eastern_white_cedar",
        "commonName": "Eastern white cedar",
        "botanicalName": "Thuja occidentalis",
        "speciesCode": "EC",
        "fibreStress_psi": 3700,
        "fibreStress_MPa": 26,
        "fibreStress_cov_percent": 18,
        "modulusOfElasticity_ksi": None,
        "modulusOfElasticity_MPa": None,
        "moe_cov_percent": None,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 4",
        "dimensionTableMetric": "Table E.4",
        "stubTableImperial": "Table 14",
        "stubTableMetric": "Table E.14",
        "notes": "Lowest fibre stress commercial pole species in Canada."
    },
    {
        "id": "eastern_white_pine",
        "commonName": "Eastern white pine",
        "botanicalName": "Pinus strobus",
        "speciesCode": "EP",
        "fibreStress_psi": 4900,
        "fibreStress_MPa": 34,
        "fibreStress_cov_percent": None,
        "modulusOfElasticity_ksi": None,
        "modulusOfElasticity_MPa": None,
        "moe_cov_percent": None,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 5",
        "dimensionTableMetric": "Table E.5",
        "stubTableImperial": "Table 15",
        "stubTableMetric": "Table E.15",
        "notes": "Grouped with spruce in Table 5 and Table E.5. Full pole test data not available; values approximate average strengths of small, clear bending specimens (Note 6 to Table 3)."
    },
    {
        "id": "interior_douglas_fir",
        "commonName": "Interior Douglas fir",
        "botanicalName": "Pseudotsuga menziesii",
        "speciesCode": "DF",
        "region": "Interior",
        "fibreStress_psi": 6800,
        "fibreStress_MPa": 47,
        "fibreStress_cov_percent": 15,
        "modulusOfElasticity_ksi": None,
        "modulusOfElasticity_MPa": None,
        "moe_cov_percent": None,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 11",
        "dimensionTableMetric": "Table E.11",
        "stubTableImperial": "Table 21",
        "stubTableMetric": "Table E.21",
        "notes": "All Douglas fir poles not meeting the coastal definition shall be classified as interior Douglas fir (Note 7 to Table 3). Grouped with western hemlock."
    },
    {
        "id": "jack_pine",
        "commonName": "Jack pine",
        "botanicalName": "Pinus banksiana",
        "speciesCode": "JP",
        "fibreStress_psi": 6400,
        "fibreStress_MPa": 44,
        "fibreStress_cov_percent": 20,
        "modulusOfElasticity_ksi": None,
        "modulusOfElasticity_MPa": None,
        "moe_cov_percent": None,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 9",
        "dimensionTableMetric": "Table E.9",
        "stubTableImperial": "Table 19",
        "stubTableMetric": "Table E.19",
        "notes": "Horizontal load capacity should be corrected by factor 0.95 (Note to Table B.1)."
    },
    {
        "id": "lodgepole_pine",
        "commonName": "Lodgepole pine",
        "botanicalName": "Pinus contorta",
        "speciesCode": "LP",
        "fibreStress_psi": 6600,
        "fibreStress_MPa": 46,
        "fibreStress_cov_percent": 13,
        "modulusOfElasticity_ksi": 1190,
        "modulusOfElasticity_MPa": 8200,
        "moe_cov_percent": 14,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 10",
        "dimensionTableMetric": "Table E.10",
        "stubTableImperial": "Table 20",
        "stubTableMetric": "Table E.20",
        "notes": "Grouped with yellow cedar in Table 10 and Table E.10."
    },
    {
        "id": "ponderosa_pine",
        "commonName": "Ponderosa pine",
        "botanicalName": "Pinus ponderosa",
        "speciesCode": "PP",
        "fibreStress_psi": 5600,
        "fibreStress_MPa": 39,
        "fibreStress_cov_percent": None,
        "modulusOfElasticity_ksi": None,
        "modulusOfElasticity_MPa": None,
        "moe_cov_percent": None,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 7",
        "dimensionTableMetric": "Table E.7",
        "stubTableImperial": "Table 17",
        "stubTableMetric": "Table E.17",
        "notes": "Grouped with western red cedar in Table 7 and Table E.7. Full pole test data not available (Note 6 to Table 3)."
    },
    {
        "id": "red_pine",
        "commonName": "Red pine",
        "botanicalName": "Pinus resinosa",
        "speciesCode": "RP",
        "fibreStress_psi": 6000,
        "fibreStress_MPa": 41,
        "fibreStress_cov_percent": 17,
        "modulusOfElasticity_ksi": 1290,
        "modulusOfElasticity_MPa": 8890,
        "moe_cov_percent": 14,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 8",
        "dimensionTableMetric": "Table E.8",
        "stubTableImperial": "Table 18",
        "stubTableMetric": "Table E.18",
        "notes": "Horizontal load capacity should be corrected by factor 0.95 (Note to Table B.1)."
    },
    {
        "id": "scots_pine",
        "commonName": "Scots pine",
        "botanicalName": "Pinus sylvestris",
        "speciesCode": "SCP",
        "fibreStress_psi": 7800,
        "fibreStress_MPa": 54,
        "fibreStress_cov_percent": 14,
        "modulusOfElasticity_ksi": 1520,
        "modulusOfElasticity_MPa": 10480,
        "moe_cov_percent": 18,
        "isNativeCanada": False,
        "dimensionTableImperial": "Table 12",
        "dimensionTableMetric": "Table E.12",
        "stubTableImperial": "Table 22",
        "stubTableMetric": "Table E.22",
        "notes": "Imported species from Finland (F), Norway (N), or Sweden (S) per Clause 6.5.3. Grouped with southern yellow pine in Table 12 and Table E.12."
    },
    {
        "id": "southern_yellow_pine",
        "commonName": "Southern yellow pine",
        "botanicalName": "Pinus palustris / elliottii / taeda / echinata",
        "speciesCode": "SP",
        "commercialGrouping": "Loblolly, longleaf, shortleaf, and slash pine",
        "fibreStress_psi": 7800,
        "fibreStress_MPa": 54,
        "fibreStress_cov_percent": 24,
        "modulusOfElasticity_ksi": 1595,
        "modulusOfElasticity_MPa": 11000,
        "moe_cov_percent": 29,
        "isNativeCanada": False,
        "dimensionTableImperial": "Table 12",
        "dimensionTableMetric": "Table E.12",
        "stubTableImperial": "Table 22",
        "stubTableMetric": "Table E.22",
        "notes": "Imported species grouping from the USA (Note 9 to Table 3). Grouped with Scots pine in Table 12 and Table E.12."
    },
    {
        "id": "spruce",
        "commonName": "Spruce",
        "botanicalName": "Picea glauca, mariana, engelmannii, rubens, sitchensis",
        "speciesCode": "WS",
        "speciesCodeVariants": ["WS", "ES", "SS"],
        "commercialGrouping": "White, black, Engelmann, red, and Sitka spruce",
        "fibreStress_psi": 4900,
        "fibreStress_MPa": 34,
        "fibreStress_cov_percent": 17,
        "modulusOfElasticity_ksi": 1030,
        "modulusOfElasticity_MPa": 7100,
        "moe_cov_percent": 17,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 5",
        "dimensionTableMetric": "Table E.5",
        "stubTableImperial": "Table 15",
        "stubTableMetric": "Table E.15",
        "notes": "Clause 6.5.3 code letters: WS = white, black, red; ES = Engelmann; SS = Sitka. Grouped with eastern white pine in Table 5 and Table E.5. Small clear tests indicate white spruce is weakest of the five (Note 10 to Table 3)."
    },
    {
        "id": "western_hemlock",
        "commonName": "Western hemlock",
        "botanicalName": "Tsuga heterophylla",
        "speciesCode": "WH",
        "fibreStress_psi": 6800,
        "fibreStress_MPa": 47,
        "fibreStress_cov_percent": 17,
        "modulusOfElasticity_ksi": 1390,
        "modulusOfElasticity_MPa": 9580,
        "moe_cov_percent": 15,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 11",
        "dimensionTableMetric": "Table E.11",
        "stubTableImperial": "Table 21",
        "stubTableMetric": "Table E.21",
        "notes": "Grouped with interior Douglas fir in Table 11 and Table E.11."
    },
    {
        "id": "western_larch",
        "commonName": "Western larch",
        "botanicalName": "Larix occidentalis",
        "speciesCode": "WL",
        "fibreStress_psi": 8000,
        "fibreStress_MPa": 55,
        "fibreStress_cov_percent": 17,
        "modulusOfElasticity_ksi": 1885,
        "modulusOfElasticity_MPa": 13000,
        "moe_cov_percent": 20,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 13",
        "dimensionTableMetric": "Table E.13",
        "stubTableImperial": "Table 23",
        "stubTableMetric": "Table E.23",
        "notes": "Grouped with coastal Douglas fir at 8000 psi (55 MPa) in Table 13 and Table E.13."
    },
    {
        "id": "western_red_cedar",
        "commonName": "Western red cedar",
        "botanicalName": "Thuja plicata",
        "speciesCode": "WC",
        "fibreStress_psi": 5600,
        "fibreStress_MPa": 39,
        "fibreStress_cov_percent": 19,
        "modulusOfElasticity_ksi": 1120,
        "modulusOfElasticity_MPa": 7720,
        "moe_cov_percent": 14,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 7",
        "dimensionTableMetric": "Table E.7",
        "stubTableImperial": "Table 17",
        "stubTableMetric": "Table E.17",
        "notes": "Most widely used transmission and distribution wood pole species in Western Canada. Horizontal load capacity corrected by factor 0.95 (Note to Table B.1). Grouped with ponderosa pine."
    },
    {
        "id": "yellow_cedar",
        "commonName": "Yellow cedar",
        "botanicalName": "Chamaecyparis nootkatensis",
        "speciesCode": "YC",
        "fibreStress_psi": 6600,
        "fibreStress_MPa": 46,
        "fibreStress_cov_percent": None,
        "modulusOfElasticity_ksi": None,
        "modulusOfElasticity_MPa": None,
        "moe_cov_percent": None,
        "isNativeCanada": True,
        "dimensionTableImperial": "Table 10",
        "dimensionTableMetric": "Table E.10",
        "stubTableImperial": "Table 20",
        "stubTableMetric": "Table E.20",
        "notes": "Grouped with lodgepole pine in Table 10 and Table E.10. Full pole test data not available (Note 6 to Table 3)."
    }
]

# Ensure species are sorted alphabetically by common name per project rules!
SPECIES_DATA.sort(key=lambda s: s["commonName"])

# -----------------------------------------------------------------------------
# 2. TABLE B.1: HORIZONTAL LOADS FOR STANDARD CLASSES OF WOOD UTILITY POLES
# -----------------------------------------------------------------------------
# Ground truth verified from CSA O15-15 Annex B Table B.1 (page 64).
# 14 standard classes: H6 down to 8. Applied 0.61 m (2 ft) from the top of the pole.
# Table B.1 in standard contains only Class and Load.
POLE_CLASSES = [
    { "class": "H6", "load_N": 50700, "load_kN": 50.7, "load_lbf": 11400, "description": "Heavy transmission class H6" },
    { "class": "H5", "load_N": 44500, "load_kN": 44.5, "load_lbf": 10000, "description": "Heavy transmission class H5" },
    { "class": "H4", "load_N": 38700, "load_kN": 38.7, "load_lbf": 8700,  "description": "Heavy transmission class H4" },
    { "class": "H3", "load_N": 33400, "load_kN": 33.4, "load_lbf": 7500,  "description": "Heavy transmission class H3" },
    { "class": "H2", "load_N": 28500, "load_kN": 28.5, "load_lbf": 6400,  "description": "Heavy transmission class H2" },
    { "class": "H1", "load_N": 24000, "load_kN": 24.0, "load_lbf": 5400,  "description": "Heavy transmission class H1" },
    { "class": "1",  "load_N": 20000, "load_kN": 20.0, "load_lbf": 4500,  "description": "Standard class 1" },
    { "class": "2",  "load_N": 16500, "load_kN": 16.5, "load_lbf": 3700,  "description": "Standard class 2" },
    { "class": "3",  "load_N": 13300, "load_kN": 13.3, "load_lbf": 3000,  "description": "Standard class 3" },
    { "class": "4",  "load_N": 10700, "load_kN": 10.7, "load_lbf": 2400,  "description": "Standard class 4" },
    { "class": "5",  "load_N": 8500,  "load_kN": 8.5,  "load_lbf": 1900,  "description": "Standard class 5" },
    { "class": "6",  "load_N": 6700,  "load_kN": 6.7,  "load_lbf": 1500,  "description": "Standard class 6" },
    { "class": "7",  "load_N": 5300,  "load_kN": 5.3,  "load_lbf": 1200,  "description": "Standard class 7" },
    { "class": "8",  "load_N": 4300,  "load_kN": 4.3,  "load_lbf": 960,   "description": "Standard class 8" },
]

# -----------------------------------------------------------------------------
# 3. TABLE C.1: STANDARD CLASSES OF REINFORCING STUBS
# -----------------------------------------------------------------------------
# Ground truth verified from CSA O15-15 Annex C Clauses C.1 - C.4 & Table C.1 (page 65).
STUB_CLASSES = [
    { "class": "Z", "associatedPoleClasses": ["1", "2"], "lengths_ft": [10.0, 11.0, 13.0, 15.5, 19.5], "lengths_m": [3.0, 3.4, 4.0, 4.7, 5.9], "designBasis": "Develops expected remaining strength of longest pole of Class 1" },
    { "class": "Y", "associatedPoleClasses": ["3", "4"], "lengths_ft": [10.0, 11.0, 13.0, 15.5, 19.5], "lengths_m": [3.0, 3.4, 4.0, 4.7, 5.9], "designBasis": "Develops expected remaining strength of longest pole of Class 3" },
    { "class": "X", "associatedPoleClasses": ["5", "6"], "lengths_ft": [10.0, 11.0, 13.0, 15.5, 19.5], "lengths_m": [3.0, 3.4, 4.0, 4.7, 5.9], "designBasis": "Develops expected remaining strength of longest pole of Class 5" },
    { "class": "W", "associatedPoleClasses": ["7", "8"], "lengths_ft": [10.0, 11.0, 13.0, 15.5, 19.5], "lengths_m": [3.0, 3.4, 4.0, 4.7, 5.9], "designBasis": "Develops expected remaining strength of longest pole of Class 7" },
]

# -----------------------------------------------------------------------------
# 4. TABLE 1 & TABLE E.1: MAXIMUM KNOT SIZES
# -----------------------------------------------------------------------------
# Ground truth verified from Table 1 (page 25) & Table E.1 (page 68).
KNOT_DATA = {
    "imperial": [
        {
            "poleLengthRange": "45 ft and shorter",
            "maxSingleKnot_H6_to_3_in": 4.0,
            "maxSingleKnot_4_to_7_in": 3.0,
            "maxSumKnotsIn1ft_in": "One-third of average circumference of 1 ft section or 8 in, whichever is greater, not to exceed 12 in"
        },
        {
            "poleLengthRange": "50 ft and longer",
            "maxSingleKnot_H6_to_3_in": 5.0,
            "maxSingleKnot_4_to_7_in": 5.0,
            "maxSumKnotsIn1ft_in": "One-third of average circumference of 1 ft section or 10 in, whichever is greater, not to exceed 14 in"
        }
    ],
    "metric": [
        {
            "poleLengthRange": "13.7 m and shorter",
            "maxSingleKnot_H6_to_3_mm": 102,
            "maxSingleKnot_4_to_7_mm": 76,
            "maxSumKnotsIn0_3m_mm": "One-third of average circumference of 0.3 m section or 203 mm, whichever is greater, not to exceed 31 cm"
        },
        {
            "poleLengthRange": "15.2 m and longer",
            "maxSingleKnot_H6_to_3_mm": 127,
            "maxSingleKnot_4_to_7_mm": 127,
            "maxSumKnotsIn0_3m_mm": "One-third of average circumference of 0.3 m section or 254 mm, whichever is greater, not to exceed 36 cm"
        }
    ]
}

# -----------------------------------------------------------------------------
# 5. TABLE 2 & TABLE E.2: MAXIMUM SPIRAL GRAIN
# -----------------------------------------------------------------------------
# Ground truth verified from Table 2 (page 25) & Table E.2 (page 69).
SPIRAL_GRAIN_DATA = {
    "imperial": [
        { "poleLengthRange": "30 ft and shorter", "maxTwistPermitted": "1 complete twist in any 10 ft length" },
        { "poleLengthRange": "31-49 ft", "maxTwistPermitted": "1 complete twist in any 16 ft length" },
        { "poleLengthRange": "50 ft and longer", "maxTwistPermitted": "1 complete twist in any 20 ft length" }
    ],
    "metric": [
        { "poleLengthRange": "9.1 m and shorter", "maxTwistPermitted": "1 complete twist in any 3 m length" },
        { "poleLengthRange": "10.7-13.7 m", "maxTwistPermitted": "1 complete twist in any 4.9 m length" },
        { "poleLengthRange": "15.2 m and longer", "maxTwistPermitted": "1 complete twist in any 6.1 m length" }
    ]
}

# -----------------------------------------------------------------------------
# CODE WRITERS
# -----------------------------------------------------------------------------

# Write table3.js
t3_js = f"""/**
 * CSA O15-15 — Table 3 / Table E.3
 * "Strength and stiffness properties by species"
 * (See Clauses 4.1.1, 4.1.2, 6.5.3, B.1.1, and E.1 and Tables 4 to 13 / Tables E.4 to E.13.)
 *
 * All collections sorted alphabetically per project rules.
 * Ground truth verified against CSA O15-15:
 * - Missing/untested properties are strictly null (zero fabrication).
 * - Species identification codes conform to Clause 6.5.3.
 */

export const TABLE_3_META = {{
  id: 'csa-o15/table3',
  standard: 'CSA O15-15',
  title: 'Strength and stiffness properties by species',
  edition: '2015',
  references: ['4.1.1', '4.1.2', '6.5.3', 'B.1.1', 'E.1', 'Tables 4-13', 'Tables E.4-E.13', 'Table 23', 'Table E.23'],
  notes: [
    'The fibre stresses are stresses for the purposes of classification and are close approximations to the average bending strengths (MOR) specified in Table A.1 for poles 20 to 35 ft (6.1 to 10.7 m) in length.',
    'Bending strengths are derived from specimens whose moisture contents at the groundline were above the fibre saturation point at the time of testing to failure.',
    'The strength of poles longer than 50 ft (15.2 m) can be less, as indicated in Annex A.',
    'Fibre stress for several species was based on limited test information or results from one test site.',
    'Classification criteria: Taper = (circumference at theoretical groundline - minimum top circumference) / length between them; loading point 0.61 m (2 ft) from pole top; classification point 1.83 m (6 ft) from butt.',
    'Pole test data for yellow cedar, eastern white pine, and ponderosa pine were not available; values approximate average strengths of small, clear bending specimens.',
    'Only Douglas fir poles taken from the western slopes of Coast and Cascade Mountains shall be classified as coastal Douglas fir. All other Douglas fir poles shall be classified as interior Douglas fir.',
    'Natural variability within a sample of poles and between pole samples taken from various areas of growth region exists.',
    'Scots and southern yellow pines are not native to Canada. Southern yellow pine includes loblolly, longleaf, shortleaf, and slash pine.',
    'Spruce species include black, Engelmann, red, Sitka, and white spruce. Separation after harvesting is impractical. Small clear tests indicate white spruce is weakest of the five.'
  ]
}};

export const CSA_O15_SPECIES = {json.dumps(SPECIES_DATA, indent=2)};
"""

with open(os.path.join(SRC_DIR, "table3.js"), "w", encoding="utf-8") as f:
    f.write(t3_js)

# Write tableB1.js
tb1_js = f"""/**
 * CSA O15-15 — Table B.1
 * "Horizontal loads for standard classes of wood utility poles"
 * (See Clause B.1.1 and Tables 7 to 9 / Tables E.7 to E.9.)
 *
 * Ground truth verified against CSA O15-15 Annex B Table B.1:
 * - 14 standard classes: H6 down to 8.
 * - Load application point is 0.61 m (2 ft) from the top of the pole.
 * - Correction factor 0.95 applies to western red cedar, red pine, and jack pine.
 */

export const TABLE_B1_META = {{
  id: 'csa-o15/tableB1',
  standard: 'CSA O15-15',
  annex: 'Annex B (informative)',
  title: 'Horizontal loads for standard classes of wood utility poles',
  references: ['B.1.1', 'Tables 7-9', 'Tables E.7-E.9'],
  loadApplicationPoint: '0.61 m (2 ft) from the top of the pole',
  notes: {{
    reductionFactorWesternRedCedar: 0.95,
    reductionFactorRedPine: 0.95,
    reductionFactorJackPine: 0.95,
    footnote: 'The loads specified in this Table should be corrected by a factor of 0.95 for western red cedar, red pine, and jack pine.'
  }}
}};

export const CSA_O15_POLE_CLASSES = {json.dumps(POLE_CLASSES, indent=2)};
"""

with open(os.path.join(SRC_DIR, "tableB1.js"), "w", encoding="utf-8") as f:
    f.write(tb1_js)

# Write tableC1.js
tc1_js = f"""/**
 * CSA O15-15 — Table C.1
 * "Standard classes of reinforcing stubs"
 * (See Clauses C.1 to C.4 and Tables 14 to 23 / Tables E.14 to E.23.)
 */

export const TABLE_C1_META = {{
  id: 'csa-o15/tableC1',
  standard: 'CSA O15-15',
  annex: 'Annex C (informative)',
  title: 'Standard classes of reinforcing stubs',
  references: ['C.1', 'C.2', 'C.3', 'C.4', 'Tables 14-23', 'Tables E.14-E.23'],
  notes: {{
    basis: 'A stub should have a life at least equal to the remaining life of the pole. The circumference at 1.83 m (6 ft) from the butt of the stub is approximately 51 mm (2 in) less than that of a new replacement pole adequate to support the load.'
  }}
}};

export const CSA_O15_STUB_CLASSES = {json.dumps(STUB_CLASSES, indent=2)};
"""

with open(os.path.join(SRC_DIR, "tableC1.js"), "w", encoding="utf-8") as f:
    f.write(tc1_js)

# Write table1.js (Knot sizes)
t1_js = f"""/**
 * CSA O15-15 — Table 1 / Table E.1
 * "Maximum knot sizes"
 * (See Clauses 3, 4.4.7, and E.1.)
 */

export const TABLE_1_META = {{
  id: 'csa-o15/table1',
  standard: 'CSA O15-15',
  title: 'Maximum knot sizes',
  references: ['3', '4.4.7', 'E.1'],
  notes: {{
    measurementMethod: 'The diameter of any single knot is measured at the widest point of the knot, perpendicular to the length of the pole, and includes the sapwood and heartwood of the knot, as shown in Figure 3.',
    disregardLimit: 'Knots 13 mm (1/2 in) or less in diameter shall be ignored in applying the limitations for the sum of diameters.'
  }}
}};

export const CSA_O15_KNOT_SIZES = {json.dumps(KNOT_DATA, indent=2)};
"""

with open(os.path.join(SRC_DIR, "table1.js"), "w", encoding="utf-8") as f:
    f.write(t1_js)

# Write table2.js (Spiral grain)
t2_js = f"""/**
 * CSA O15-15 — Table 2 / Table E.2
 * "Maximum spiral grain"
 * (See Clauses 4.4.11 and E.1.)
 */

export const TABLE_2_META = {{
  id: 'csa-o15/table2',
  standard: 'CSA O15-15',
  title: 'Maximum spiral grain',
  references: ['4.4.11', 'E.1'],
  notes: {{
    definition: 'Spiral grain (twisted grain) is a type of growth in which the fibres take a spiral course around the trunk.'
  }}
}};

export const CSA_O15_SPIRAL_GRAIN = {json.dumps(SPIRAL_GRAIN_DATA, indent=2)};
"""

with open(os.path.join(SRC_DIR, "table2.js"), "w", encoding="utf-8") as f:
    f.write(t2_js)

# Write index.js (WITHOUT fabricated settingDepths.js)
index_js = """/**
 * CSA O15-15 (Wood Utility Poles and Reinforcing Stubs) Data Module Index
 *
 * Provides structured access to:
 * - Table 1 / Table E.1: Maximum knot sizes
 * - Table 2 / Table E.2: Maximum spiral grain
 * - Table 3 / Table E.3: Wood species mechanical properties (fibre stress, MOE, COV)
 * - Table B.1: Standard pole classes & horizontal breaking loads (H6 down to 8)
 * - Table C.1: Standard reinforcing stub classes & design loads (Z, Y, X, W)
 *
 * All lookups ensure alphabetical sorting per project rules.
 */

export * from './table1.js';
export * from './table2.js';
export * from './table3.js';
export * from './tableB1.js';
export * from './tableC1.js';

import { CSA_O15_SPECIES } from './table3.js';
import { CSA_O15_POLE_CLASSES } from './tableB1.js';
import { CSA_O15_STUB_CLASSES } from './tableC1.js';
import { CSA_O15_KNOT_SIZES } from './table1.js';
import { CSA_O15_SPIRAL_GRAIN } from './table2.js';

/**
 * Get wood species by code or ID (case-insensitive)
 * @param {string} codeOrId e.g. 'WC', 'western_red_cedar', 'DF'
 */
export function getO15Species(codeOrId) {
  if (!codeOrId) return null;
  const q = codeOrId.trim().toLowerCase();
  return (
    CSA_O15_SPECIES.find(
      s =>
        s.id.toLowerCase() === q ||
        s.speciesCode.toLowerCase() === q ||
        (s.speciesCodeVariants && s.speciesCodeVariants.some(v => v.toLowerCase() === q)) ||
        s.commonName.toLowerCase() === q
    ) || null
  );
}

/**
 * Get all commercial species sorted alphabetically by common name
 */
export function getAllO15Species() {
  return [...CSA_O15_SPECIES].sort((a, b) => a.commonName.localeCompare(b.commonName));
}

/**
 * Get pole class details by class name (e.g. 'H3', '1', '4')
 */
export function getO15PoleClass(className) {
  if (!className) return null;
  const q = String(className).trim().toUpperCase();
  return CSA_O15_POLE_CLASSES.find(c => c.class === q) || null;
}

/**
 * Get all pole classes sorted from strongest (H6) to lightest (8)
 */
export function getAllO15PoleClasses() {
  return [...CSA_O15_POLE_CLASSES];
}

/**
 * Get stub class details by class name ('Z', 'Y', 'X', 'W')
 */
export function getO15StubClass(className) {
  if (!className) return null;
  const q = String(className).trim().toUpperCase();
  return CSA_O15_STUB_CLASSES.find(c => c.class === q) || null;
}
"""

with open(os.path.join(SRC_DIR, "index.js"), "w", encoding="utf-8") as f:
    f.write(index_js)

print("Generated src/data/csa/o15/ modules:")
print(" - table1.js, table2.js, table3.js, tableB1.js, tableC1.js, index.js")

# -----------------------------------------------------------------------------
# 7. GENERATE MARKDOWN DOCUMENTATION IN sandbox/csa o15/
# -----------------------------------------------------------------------------
# Table 3 README
t3_md = f"""# CSA O15-15 — Table 3 / Table E.3: Strength and Stiffness Properties by Species

(See Clauses 4.1.1, 4.1.2, 6.5.3, B.1.1, E.1, and Tables 4 to 13 / Tables E.4 to E.13)

| Common Name | Botanical Name | Code | Fibre Stress (psi) | Fibre Stress (MPa) | COV (%) | MOE (ksi) | MOE (MPa) | MOE COV (%) | Native to Canada |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
"""
for s in SPECIES_DATA:
    cov_str = f"{s['fibreStress_cov_percent']}%" if s['fibreStress_cov_percent'] is not None else "—"
    moe_ksi_str = f"{s['modulusOfElasticity_ksi']:,}" if s['modulusOfElasticity_ksi'] is not None else "—"
    moe_mpa_str = f"{s['modulusOfElasticity_MPa']:,}" if s['modulusOfElasticity_MPa'] is not None else "—"
    moe_cov_str = f"{s['moe_cov_percent']}%" if s['moe_cov_percent'] is not None else "—"
    t3_md += f"| {s['commonName']} | *{s['botanicalName']}* | `{s['speciesCode']}` | {s['fibreStress_psi']:,} | {s['fibreStress_MPa']} | {cov_str} | {moe_ksi_str} | {moe_mpa_str} | {moe_cov_str} | {'Yes' if s['isNativeCanada'] else 'No (Imported)'} |\n"

t3_md += """
## Standard Notes (CSA O15-15)
1. The fibre stresses are stresses for the purposes of classification and are close approximations to the average bending strengths (MOR) specified in Table A.1 for poles 20 to 35 ft (6.1 to 10.7 m) in length.
2. Bending strengths are derived from specimens whose moisture contents at the groundline were above the fibre saturation point at the time of testing to failure.
3. The strength of poles longer than 50 ft (15.2 m) can be less, as indicated in Annex A.
4. Only Douglas fir poles taken from the western slopes of Coast and Cascade Mountains shall be classified as coastal Douglas fir. All other Douglas fir poles shall be classified as interior Douglas fir.
5. Scots pine and southern yellow pine are imported into Canada. Southern yellow pine comprises loblolly, longleaf, shortleaf, and slash pine.
6. Horizontal load capacity should be corrected by a factor of 0.95 for western red cedar, red pine, and jack pine (Note to Table B.1).
7. Where values are indicated with a dash ("—"), no test data were available in the standard.
"""

t3_dir = os.path.join(SANDBOX_DIR, "Table 3")
os.makedirs(t3_dir, exist_ok=True)
with open(os.path.join(t3_dir, "README.md"), "w", encoding="utf-8") as f:
    f.write(t3_md)

# Table B.1 README
tb1_md = """# CSA O15-15 — Table B.1: Horizontal Loads for Standard Classes of Wood Utility Poles

(See Clause B.1.1 and Tables 7 to 9 / Tables E.7 to E.9)

Load is applied as a transverse horizontal concentrated load 0.61 m (2 ft) from the top of the pole.

| Class | Horizontal Load (N) | Horizontal Load (kN) | Horizontal Load (lbf) | Description |
| :---: | :---: | :---: | :---: | :--- |
"""
for c in POLE_CLASSES:
    tb1_md += f"| **{c['class']}** | {c['load_N']:,} | {c['load_kN']} | {c['load_lbf']:,} | {c['description']} |\n"

tb1_md += """
> [!NOTE]
> Per Note to Table B.1, the loads specified in this Table should be corrected by a factor of **0.95** for Western Red Cedar, Red Pine, and Jack Pine.
"""

tb1_dir = os.path.join(SANDBOX_DIR, "Table B1")
os.makedirs(tb1_dir, exist_ok=True)
with open(os.path.join(tb1_dir, "README.md"), "w", encoding="utf-8") as f:
    f.write(tb1_md)

# Table 1 README
t1_md = """# CSA O15-15 — Table 1 / Table E.1: Maximum Knot Sizes

(See Clauses 3, 4.4.7, and E.1)

### Imperial Units (Table 1)
| Pole Length | Classes H6 to 3 (Single Knot) | Classes 4 to 7 (Single Knot) | Sum of Diameters in Any 1 ft Section (All Classes) |
| :--- | :---: | :---: | :--- |
| **45 ft and shorter** | 4.0 in | 3.0 in | 1/3 average circumference or 8 in, whichever is greater (max 12 in) |
| **50 ft and longer** | 5.0 in | 5.0 in | 1/3 average circumference or 10 in, whichever is greater (max 14 in) |

### SI Metric Units (Table E.1)
| Pole Length | Classes H6 to 3 (Single Knot) | Classes 4 to 7 (Single Knot) | Sum of Diameters in Any 0.3 m Section (All Classes) |
| :--- | :---: | :---: | :--- |
| **13.7 m and shorter** | 102 mm | 76 mm | 1/3 average circumference or 203 mm, whichever is greater (max 31 cm) |
| **15.2 m and longer** | 127 mm | 127 mm | 1/3 average circumference or 254 mm, whichever is greater (max 36 cm) |

*Note: Knots 13 mm (1/2 in) or less in diameter shall be ignored in applying the limitations for the sum of diameters.*
"""

t1_dir = os.path.join(SANDBOX_DIR, "Table 1")
os.makedirs(t1_dir, exist_ok=True)
with open(os.path.join(t1_dir, "README.md"), "w", encoding="utf-8") as f:
    f.write(t1_md)

# Table 2 README
t2_md = """# CSA O15-15 — Table 2 / Table E.2: Maximum Spiral Grain

(See Clauses 4.4.11 and E.1)

| Pole Length Range (Imperial) | Pole Length Range (Metric) | Maximum Twist of Grain Permitted |
| :--- | :--- | :--- |
| **30 ft and shorter** | 9.1 m and shorter | 1 complete twist in any 10 ft (3.0 m) length |
| **31-49 ft** | 10.7-13.7 m | 1 complete twist in any 16 ft (4.9 m) length |
| **50 ft and longer** | 15.2 m and longer | 1 complete twist in any 20 ft (6.1 m) length |
"""

t2_dir = os.path.join(SANDBOX_DIR, "Table 2")
os.makedirs(t2_dir, exist_ok=True)
with open(os.path.join(t2_dir, "README.md"), "w", encoding="utf-8") as f:
    f.write(t2_md)

# Table C.1 README
tc1_md = """# CSA O15-15 — Table C.1: Standard Classes of Reinforcing Stubs

(See Clauses C.1 to C.4 and Tables 14 to 23 / Tables E.14 to E.23)

| Class of Stub | Associated Pole Classes | Available Lengths (ft) | Available Lengths (m) | Design Basis |
| :---: | :---: | :--- | :--- | :--- |
| **Z** | 1 and 2 | 10.0, 11.0, 13.0, 15.5, 19.5 | 3.0, 3.4, 4.0, 4.7, 5.9 | Develops expected remaining strength of longest pole of Class 1 |
| **Y** | 3 and 4 | 10.0, 11.0, 13.0, 15.5, 19.5 | 3.0, 3.4, 4.0, 4.7, 5.9 | Develops expected remaining strength of longest pole of Class 3 |
| **X** | 5 and 6 | 10.0, 11.0, 13.0, 15.5, 19.5 | 3.0, 3.4, 4.0, 4.7, 5.9 | Develops expected remaining strength of longest pole of Class 5 |
| **W** | 7 and 8 | 10.0, 11.0, 13.0, 15.5, 19.5 | 3.0, 3.4, 4.0, 4.7, 5.9 | Develops expected remaining strength of longest pole of Class 7 |
"""

tc1_dir = os.path.join(SANDBOX_DIR, "Table C1")
os.makedirs(tc1_dir, exist_ok=True)
with open(os.path.join(tc1_dir, "README.md"), "w", encoding="utf-8") as f:
    f.write(tc1_md)

# Master README for sandbox/csa o15/
master_md = """# CSA O15-15: Wood Utility Poles and Reinforcing Stubs — Extracted Data & Criteria Tables

This directory contains the extracted tables, clauses, and engineering parameters from **CAN/CSA-O15-15 (Wood utility poles and reinforcing stubs)**.

## Standards Coverage
- **Standard**: CAN/CSA-O15-15 (Approved February 2016, Update No. 1 June 2016)
- **Supersedes**: CSA O15-05, O15-90, O15-83
- **Primary Source File**: `sandbox/csa c22 no 1/CSA-015-15-Wood-Utility-Poles.pdf`
- **Machine-Readable Clauses**: `sandbox/csa_o15_clauses.json`
- **Application JS Data Modules**: `src/data/csa/o15/`

---

## Key Extracted Tables

1. **[Table 3 / Table E.3 — Species Mechanical Properties](./Table%203/README.md)**
   - Fibre stresses (psi and MPa)
   - Moduli of Elasticity MOE (ksi and MPa)
   - Coefficients of Variation (COV %)
   - Species identification codes (Clause 6.5.3) and botanical classifications (alphabetically sorted per project rules)
2. **[Table B.1 — Standard Pole Classes & Breaking Loads](./Table%20B1/README.md)**
   - Transverse horizontal breaking loads (Classes H6 down to 8: 50.7 kN down to 4.3 kN)
   - 0.95 species load factor for western red cedar, red pine, and jack pine
3. **[Table C.1 — Reinforcing Stub Classes](./Table%20C1/README.md)**
   - Classes Z, Y, X, W and associated pole classes (1 to 8)
4. **[Table 1 / Table E.1 — Maximum Knot Sizes](./Table%201/README.md)**
   - Single knot and sum of knots limits across pole lengths
5. **[Table 2 / Table E.2 — Maximum Spiral Grain](./Table%202/README.md)**
   - Grain twist limits per unit length

---

## Easily Retrievable JSON & CLI Tool
- All 86 clauses and 50 tables are retrievable via `sandbox/clause_retriever.py`:
  ```bash
  # Retrieve a specific clause
  python sandbox/clause_retriever.py o15 4.3
  python sandbox/clause_retriever.py o15 4.4.7
  python sandbox/clause_retriever.py o15 6.5.3
  python sandbox/clause_retriever.py o15 B.1.1

  # Retrieve a table
  python sandbox/clause_retriever.py o15 "Table 3"
  python sandbox/clause_retriever.py o15 "Table B.1"

  # Search across CSA C22.3 No 1, CSA C22.3 No 60826, and CSA O15
  python sandbox/clause_retriever.py search "knot diameter"
  python sandbox/clause_retriever.py search "fibre stress"
  ```
"""

with open(os.path.join(SANDBOX_DIR, "README.md"), "w", encoding="utf-8") as f:
    f.write(master_md)

print("Generated markdown reference files in sandbox/csa o15/ folder.")
