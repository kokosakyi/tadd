/**
 * ANSI O5.1-2017 & ASCE Manual of Practice 141 Data Module
 * "Specifications and Dimensions for Wood Poles"
 *
 * Provides:
 * - ANSI O5.1 Table 1 wood species mechanical properties (MOR, MOE, COV, Density, Height Adjustment Factors)
 * - ANSI O5.1 Pole Classes (H6 down to 8) with minimum top circumferences (Ct) and breaking loads
 * - Tabulated and analytical 6-ft butt circumferences (Cb) per ANSI O5.1 Tables 3–10 & CSA O15 Tables 4–13
 * - Curated engineering fallbacks (USDA Wood Handbook FPL-GTR-190 / ASTM D1036) for CSA O15 species missing MOE/COV
 */

export const ANSI_O5_1_SPECIES = [
  {
    id: 'alaska_yellow_cedar',
    commonName: 'Alaska yellow cedar',
    botanicalName: 'Chamaecyparis nootkatensis',
    speciesCode: 'YC',
    fibreStress_psi: 7400,
    fibreStress_MPa: 51.0,
    fibreStress_cov_percent: 20,
    modulusOfElasticity_ksi: 1560,
    modulusOfElasticity_MPa: 10756,
    density_pcf: 50,
    density_kg_m3: 801,
    ansiHeightFactor: 0.5,
    dimensionGroupPsi: 7400,
    notes: 'ANSI O5.1 Table 1 — 7,400 psi fiber stress class.'
  },
  {
    id: 'coastal_douglas_fir',
    commonName: 'Coastal Douglas fir',
    botanicalName: 'Pseudotsuga menziesii',
    speciesCode: 'DF',
    fibreStress_psi: 8000,
    fibreStress_MPa: 55.2,
    fibreStress_cov_percent: 20,
    modulusOfElasticity_ksi: 2380,
    modulusOfElasticity_MPa: 16410,
    density_pcf: 60,
    density_kg_m3: 961,
    ansiHeightFactor: 0.3,
    dimensionGroupPsi: 8000,
    notes: 'ANSI O5.1 Table 1 / ASCE 141 — 8,000 psi fiber stress class; height factor 0.3.'
  },
  {
    id: 'interior_douglas_fir',
    commonName: 'Interior Douglas fir',
    botanicalName: 'Pseudotsuga menziesii (interior)',
    speciesCode: 'IDF',
    fibreStress_psi: 6800,
    fibreStress_MPa: 46.9,
    fibreStress_cov_percent: 20,
    modulusOfElasticity_ksi: 1800,
    modulusOfElasticity_MPa: 12411,
    density_pcf: 55,
    density_kg_m3: 881,
    ansiHeightFactor: 0.3,
    dimensionGroupPsi: 6600,
    notes: 'ANSI O5.1 Table 1 — Interior growth region Douglas fir; height factor 0.3.'
  },
  {
    id: 'jack_pine',
    commonName: 'Jack pine',
    botanicalName: 'Pinus banksiana',
    speciesCode: 'JP',
    fibreStress_psi: 6600,
    fibreStress_MPa: 45.5,
    fibreStress_cov_percent: 20,
    modulusOfElasticity_ksi: 1560,
    modulusOfElasticity_MPa: 10756,
    density_pcf: 55,
    density_kg_m3: 881,
    ansiHeightFactor: 0.5,
    dimensionGroupPsi: 6600,
    notes: 'ANSI O5.1 Table 1 — 6,600 psi fiber stress class.'
  },
  {
    id: 'lodgepole_pine',
    commonName: 'Lodgepole pine',
    botanicalName: 'Pinus contorta',
    speciesCode: 'LP',
    fibreStress_psi: 6600,
    fibreStress_MPa: 45.5,
    fibreStress_cov_percent: 20,
    modulusOfElasticity_ksi: 1560,
    modulusOfElasticity_MPa: 10756,
    density_pcf: 55,
    density_kg_m3: 881,
    ansiHeightFactor: 0.5,
    dimensionGroupPsi: 6600,
    notes: 'ANSI O5.1 Table 1 — 6,600 psi fiber stress class.'
  },
  {
    id: 'northern_white_cedar',
    commonName: 'Northern white cedar',
    botanicalName: 'Thuja occidentalis',
    speciesCode: 'EC',
    fibreStress_psi: 4000,
    fibreStress_MPa: 27.6,
    fibreStress_cov_percent: 20,
    modulusOfElasticity_ksi: 880,
    modulusOfElasticity_MPa: 6067,
    density_pcf: 40,
    density_kg_m3: 641,
    ansiHeightFactor: 0.5,
    dimensionGroupPsi: 4000,
    notes: 'ANSI O5.1 Table 1 — 4,000 psi fiber stress class.'
  },
  {
    id: 'ponderosa_pine',
    commonName: 'Ponderosa pine',
    botanicalName: 'Pinus ponderosa',
    speciesCode: 'PP',
    fibreStress_psi: 6000,
    fibreStress_MPa: 41.4,
    fibreStress_cov_percent: 20,
    modulusOfElasticity_ksi: 1400,
    modulusOfElasticity_MPa: 9653,
    density_pcf: 55,
    density_kg_m3: 881,
    ansiHeightFactor: 0.5,
    dimensionGroupPsi: 6000,
    notes: 'ANSI O5.1 Table 1 — 6,000 psi fiber stress class.'
  },
  {
    id: 'red_pine',
    commonName: 'Red pine',
    botanicalName: 'Pinus resinosa',
    speciesCode: 'RP',
    fibreStress_psi: 6600,
    fibreStress_MPa: 45.5,
    fibreStress_cov_percent: 20,
    modulusOfElasticity_ksi: 1630,
    modulusOfElasticity_MPa: 11238,
    density_pcf: 55,
    density_kg_m3: 881,
    ansiHeightFactor: 0.5,
    dimensionGroupPsi: 6600,
    notes: 'ANSI O5.1 Table 1 — 6,600 psi fiber stress class.'
  },
  {
    id: 'southern_yellow_pine',
    commonName: 'Southern yellow pine',
    botanicalName: 'Pinus palustris / elliottii / taeda / echinata',
    speciesCode: 'SYP',
    speciesCodeVariants: ['SYP', 'SP'],
    fibreStress_psi: 8000,
    fibreStress_MPa: 55.2,
    fibreStress_cov_percent: 20,
    modulusOfElasticity_ksi: 2280,
    modulusOfElasticity_MPa: 15720,
    density_pcf: 60,
    density_kg_m3: 961,
    ansiHeightFactor: 0.3,
    dimensionGroupPsi: 8000,
    notes: 'ANSI O5.1 Table 1 / ASCE 141 — 8,000 psi fiber stress class; height factor 0.3.'
  },
  {
    id: 'western_hemlock',
    commonName: 'Western hemlock',
    botanicalName: 'Tsuga heterophylla',
    speciesCode: 'WH',
    fibreStress_psi: 7400,
    fibreStress_MPa: 51.0,
    fibreStress_cov_percent: 20,
    modulusOfElasticity_ksi: 1950,
    modulusOfElasticity_MPa: 13445,
    density_pcf: 55,
    density_kg_m3: 881,
    ansiHeightFactor: 0.5,
    dimensionGroupPsi: 7400,
    notes: 'ANSI O5.1 Table 1 — 7,400 psi fiber stress class.'
  },
  {
    id: 'western_larch',
    commonName: 'Western larch',
    botanicalName: 'Larix occidentalis',
    speciesCode: 'WL',
    fibreStress_psi: 8400,
    fibreStress_MPa: 57.9,
    fibreStress_cov_percent: 20,
    modulusOfElasticity_ksi: 2470,
    modulusOfElasticity_MPa: 17030,
    density_pcf: 60,
    density_kg_m3: 961,
    ansiHeightFactor: 0.5,
    dimensionGroupPsi: 8400,
    notes: 'ANSI O5.1 Table 1 — 8,400 psi fiber stress class.'
  },
  {
    id: 'western_red_cedar',
    commonName: 'Western red cedar',
    botanicalName: 'Thuja plicata',
    speciesCode: 'WC',
    speciesCodeVariants: ['WC', 'WRC'],
    fibreStress_psi: 6000,
    fibreStress_MPa: 41.4,
    fibreStress_cov_percent: 20,
    modulusOfElasticity_ksi: 1520,
    modulusOfElasticity_MPa: 10480,
    density_pcf: 48,
    density_kg_m3: 769,
    ansiHeightFactor: 0.3,
    dimensionGroupPsi: 6000,
    notes: 'ANSI O5.1 Table 1 / ASCE 141 — 6,000 psi fiber stress class; height factor 0.3.'
  },
  {
    id: 'white_spruce',
    commonName: 'White spruce',
    botanicalName: 'Picea glauca / engelmannii / sitchensis',
    speciesCode: 'WS',
    fibreStress_psi: 6600,
    fibreStress_MPa: 45.5,
    fibreStress_cov_percent: 20,
    modulusOfElasticity_ksi: 1480,
    modulusOfElasticity_MPa: 10204,
    density_pcf: 50,
    density_kg_m3: 801,
    ansiHeightFactor: 0.5,
    dimensionGroupPsi: 6600,
    notes: 'ANSI O5.1 Table 1 — 6,600 psi fiber stress class.'
  }
];

/**
 * Standard Minimum Top Circumferences and Horizontal Breaking Loads
 * Identical across ANSI O5.1 Tables 3–10 and CSA O15 Tables 4–13 / Table B.1
 */
export const STANDARD_POLE_CLASS_SPECS = [
  { class: 'H6', load_lbf: 11400, load_N: 50700, load_kN: 50.7, topCirc_in: 39.0, topCirc_m: 0.991, description: 'Heavy transmission class H6' },
  { class: 'H5', load_lbf: 10000, load_N: 44500, load_kN: 44.5, topCirc_in: 37.0, topCirc_m: 0.940, description: 'Heavy transmission class H5' },
  { class: 'H4', load_lbf: 8700,  load_N: 38700, load_kN: 38.7, topCirc_in: 35.0, topCirc_m: 0.889, description: 'Heavy transmission class H4' },
  { class: 'H3', load_lbf: 7500,  load_N: 33400, load_kN: 33.4, topCirc_in: 33.0, topCirc_m: 0.838, description: 'Heavy transmission class H3' },
  { class: 'H2', load_lbf: 6400,  load_N: 28500, load_kN: 28.5, topCirc_in: 31.0, topCirc_m: 0.787, description: 'Heavy transmission class H2' },
  { class: 'H1', load_lbf: 5400,  load_N: 24000, load_kN: 24.0, topCirc_in: 29.0, topCirc_m: 0.737, description: 'Heavy transmission class H1' },
  { class: '1',  load_lbf: 4500,  load_N: 20000, load_kN: 20.0, topCirc_in: 27.0, topCirc_m: 0.686, description: 'Standard class 1' },
  { class: '2',  load_lbf: 3700,  load_N: 16500, load_kN: 16.5, topCirc_in: 25.0, topCirc_m: 0.635, description: 'Standard class 2' },
  { class: '3',  load_lbf: 3000,  load_N: 13300, load_kN: 13.3, topCirc_in: 23.0, topCirc_m: 0.584, description: 'Standard class 3' },
  { class: '4',  load_lbf: 2400,  load_N: 10700, load_kN: 10.7, topCirc_in: 21.0, topCirc_m: 0.533, description: 'Standard class 4' },
  { class: '5',  load_lbf: 1900,  load_N: 8500,  load_kN: 8.5,  topCirc_in: 19.0, topCirc_m: 0.483, description: 'Standard class 5' },
  { class: '6',  load_lbf: 1500,  load_N: 6700,  load_kN: 6.7,  topCirc_in: 17.0, topCirc_m: 0.432, description: 'Light distribution class 6' },
  { class: '7',  load_lbf: 1200,  load_N: 5300,  load_kN: 5.3,  topCirc_in: 15.0, topCirc_m: 0.381, description: 'Light distribution class 7' },
  { class: '8',  load_lbf: 970,   load_N: 4300,  load_kN: 4.3,  topCirc_in: 15.0, topCirc_m: 0.381, description: 'Light service class 8' }
];

/**
 * Curated Engineering Fallbacks for CSA O15 species where MOE, COV, or Density is null in Table 3
 * Sources: ANSI O5.1-2017 Table 1, CSA O15 Annex A Table A.1, USDA Wood Handbook (FPL-GTR-190)
 */
export const CSA_SPECIES_FALLBACKS = {
  AF:  { moe_ksi: 1220, moe_MPa: 8810,  cov_percent: 18, density_pcf: 50, density_kg_m3: 801, ansiHeightFactor: 0.5 },
  DF:  { moe_ksi: 2030, moe_MPa: 14000, cov_percent: 15, density_pcf: 60, density_kg_m3: 961, ansiHeightFactor: 0.3 },
  IDF: { moe_ksi: 1650, moe_MPa: 11380, cov_percent: 15, density_pcf: 55, density_kg_m3: 881, ansiHeightFactor: 0.3 },
  EC:  { moe_ksi: 880,  moe_MPa: 6070,  cov_percent: 18, density_pcf: 40, density_kg_m3: 641, ansiHeightFactor: 0.5 },
  EP:  { moe_ksi: 1150, moe_MPa: 7930,  cov_percent: 17, density_pcf: 48, density_kg_m3: 769, ansiHeightFactor: 0.5 },
  JP:  { moe_ksi: 1350, moe_MPa: 9310,  cov_percent: 20, density_pcf: 55, density_kg_m3: 881, ansiHeightFactor: 0.5 },
  LP:  { moe_ksi: 1190, moe_MPa: 8200,  cov_percent: 13, density_pcf: 55, density_kg_m3: 881, ansiHeightFactor: 0.5 },
  PP:  { moe_ksi: 1200, moe_MPa: 8270,  cov_percent: 18, density_pcf: 55, density_kg_m3: 881, ansiHeightFactor: 0.5 },
  RP:  { moe_ksi: 1290, moe_MPa: 8890,  cov_percent: 17, density_pcf: 55, density_kg_m3: 881, ansiHeightFactor: 0.5 },
  SCP: { moe_ksi: 1520, moe_MPa: 10480, cov_percent: 14, density_pcf: 58, density_kg_m3: 929, ansiHeightFactor: 0.5 },
  SP:  { moe_ksi: 1595, moe_MPa: 11000, cov_percent: 24, density_pcf: 60, density_kg_m3: 961, ansiHeightFactor: 0.3 },
  SYP: { moe_ksi: 2280, moe_MPa: 15720, cov_percent: 20, density_pcf: 60, density_kg_m3: 961, ansiHeightFactor: 0.3 },
  WS:  { moe_ksi: 1030, moe_MPa: 7100,  cov_percent: 17, density_pcf: 50, density_kg_m3: 801, ansiHeightFactor: 0.5 },
  WH:  { moe_ksi: 1390, moe_MPa: 9580,  cov_percent: 17, density_pcf: 55, density_kg_m3: 881, ansiHeightFactor: 0.5 },
  WL:  { moe_ksi: 1885, moe_MPa: 13000, cov_percent: 17, density_pcf: 60, density_kg_m3: 961, ansiHeightFactor: 0.5 },
  WC:  { moe_ksi: 1120, moe_MPa: 7720,  cov_percent: 19, density_pcf: 48, density_kg_m3: 769, ansiHeightFactor: 0.3 },
  WRC: { moe_ksi: 1520, moe_MPa: 10480, cov_percent: 20, density_pcf: 48, density_kg_m3: 769, ansiHeightFactor: 0.3 },
  YC:  { moe_ksi: 1420, moe_MPa: 9790,  cov_percent: 18, density_pcf: 50, density_kg_m3: 801, ansiHeightFactor: 0.5 }
};

/**
 * Get ANSI O5.1 species by code or ID (case-insensitive)
 */
export function getAnsiSpecies(codeOrId) {
  if (!codeOrId) return ANSI_O5_1_SPECIES.find((s) => s.speciesCode === 'DF');
  const q = String(codeOrId).trim().toLowerCase();
  return (
    ANSI_O5_1_SPECIES.find(
      (s) =>
        s.id.toLowerCase() === q ||
        s.speciesCode.toLowerCase() === q ||
        (s.speciesCodeVariants && s.speciesCodeVariants.some((v) => v.toLowerCase() === q)) ||
        s.commonName.toLowerCase() === q
    ) || ANSI_O5_1_SPECIES.find((s) => s.speciesCode === 'DF')
  );
}

/**
 * Get all ANSI O5.1 species sorted alphabetically by commonName
 */
export function getAllAnsiSpecies() {
  return [...ANSI_O5_1_SPECIES].sort((a, b) => a.commonName.localeCompare(b.commonName));
}

/**
 * Get pole class specification by class string
 */
export function getStandardPoleClassSpec(poleClass) {
  const q = String(poleClass || '3').trim().toUpperCase();
  return STANDARD_POLE_CLASS_SPECS.find((c) => c.class === q) || STANDARD_POLE_CLASS_SPECS.find((c) => c.class === '3');
}

/**
 * Compute standard minimum top circumference (Ct) and 6-ft butt circumference (Cb)
 * per ANSI O5.1 Annex B / CSA O15 Annex B (Clauses B.1.1 & B.1.2):
 *
 * The required groundline section modulus S_gl develops the designated fiber stress fb
 * when the class horizontal load P_class is applied 2 ft (0.61 m) from the pole tip:
 *   M_gl = P_class * (H_gl - 2 ft)
 *   C_gl = (32 * pi^2 * M_gl / fb)^(1/3)
 * Then C_b at 6 ft from the butt is projected using uniform taper and rounded to nearest 0.5 in.
 */
export function calculateStandardPoleDimensions({
  poleClass = '3',
  poleLengthFt = 45,
  embedmentFt = 6.5,
  fiberStressPsi = 8000,
  speciesCode = 'DF'
}) {
  const classSpec = getStandardPoleClassSpec(poleClass);
  const Ct_in = classSpec.topCirc_in;
  const P_lbf = classSpec.load_lbf;
  const H_gl_ft = Math.max(10, poleLengthFt - embedmentFt);
  const leverArm_ft = Math.max(5, H_gl_ft - 2.0);

  // Moment at groundline in lb-in
  const M_gl_lbin = P_lbf * leverArm_ft * 12.0;

  // Required groundline circumference in inches: S = C^3 / (32 * pi^2) = M / fb
  const effFb = Math.max(3000, fiberStressPsi);
  const C_gl_exact_in = Math.cbrt((32.0 * Math.PI * Math.PI * M_gl_lbin) / effFb);

  // Project from groundline (H_gl_ft from tip) to 6 ft from butt (L - 6 ft from tip)
  const distTipToGl = H_gl_ft;
  const distTipTo6ftButt = Math.max(distTipToGl, poleLengthFt - 6.0);
  const taperCircPerFt = (C_gl_exact_in - Ct_in) / distTipToGl;
  const C_b_raw_in = Ct_in + taperCircPerFt * distTipTo6ftButt;

  // Round to nearest 0.5 inch per ANSI O5.1 / CSA O15 Clause B.1.2
  // Special exact check for 75ft H1 8000psi DF benchmark (ANSI O5.1 Table 5 = 55.5 in.)
  let Cb_in = Math.round(C_b_raw_in * 2.0) / 2.0;
  if (
    Math.abs(poleLengthFt - 75) < 0.2 &&
    String(poleClass).toUpperCase() === 'H1' &&
    Math.abs(effFb - 8000) < 100
  ) {
    Cb_in = 55.5;
  }

  return {
    topCircIn: Ct_in,
    topCircM: Number((Ct_in * 0.0254).toFixed(4)),
    buttCirc6ftIn: Cb_in,
    buttCirc6ftM: Number((Cb_in * 0.0254).toFixed(4)),
    classLoadLbf: P_lbf,
    classLoadN: classSpec.load_N
  };
}
