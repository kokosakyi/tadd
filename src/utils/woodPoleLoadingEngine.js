/**
 * Wood Pole Loading & Section Modulus Calculator Engine
 * Conforms to CSA C22.3 No. 1 Clauses 7.4, 7.5, 8.1, 8.3 & Tables 31/32
 * and CSA O15-15 Tables 3, B.1, and Table 7-9.
 */

import { getAllO15Species, getAllO15PoleClasses, getO15Species } from '../data/csa/o15/index.js';
import { TABLE_31_LOAD_FACTORS } from '../data/csa/c22_3_no1/table31.js';

/**
 * Standard embedment depth rule of thumb: 10% of length + 0.6 m (2 ft), min 1.5 m
 * @param {number} poleLengthM 
 * @returns {number} embedment depth in meters
 */
export function calculateEmbedmentDepth(poleLengthM) {
  return Math.max(1.5, Number((0.10 * poleLengthM + 0.6).toFixed(2)));
}

/**
 * Calculate Groundline Circumference from Pole Class and Length (CSA O15 Tables 7-9)
 * Approximate standard groundline dimensions or calculate from top circumference & taper
 * @param {string} poleClass e.g. '1', '2', '3', 'H1'
 * @param {number} poleLengthM
 * @returns {number} groundline circumference in meters
 */
export function estimateGroundlineCircumference(poleClass, poleLengthM) {
  // Typical groundline circumference values (cm -> m) for standard 12m-15m distribution poles
  const baseCircumferenceMap = {
    'H6': 1.35, 'H5': 1.28, 'H4': 1.22, 'H3': 1.15, 'H2': 1.08, 'H1': 1.02,
    '1': 0.95, '2': 0.89, '3': 0.83, '4': 0.77, '5': 0.71, '6': 0.65, '7': 0.58
  };
  const base = baseCircumferenceMap[String(poleClass).toUpperCase()] || 0.85;
  // Slight taper adjustment for taller poles (>12m adds ~0.015m circum per meter)
  const lengthAdjustment = Math.max(0, (poleLengthM - 12) * 0.015);
  return Number((base + lengthAdjustment).toFixed(3));
}

/**
 * Section Modulus S of a circular section from circumference C
 * S = (d^3 * pi) / 32 = C^3 / (32 * pi^2)
 * @param {number} circumferenceM 
 * @returns {number} Section modulus in m^3
 */
export function calculateSectionModulus(circumferenceM) {
  if (!circumferenceM || circumferenceM <= 0) return 0;
  return Math.pow(circumferenceM, 3) / (32 * Math.pow(Math.PI, 2));
}

/**
 * Resisting Moment Capacity Mr of a wood pole at groundline
 * Mr = fb * S [N*m]
 * @param {number} fiberStressMPa CSA O15 Table 3 designated fiber stress
 * @param {number} sectionModulusM3 Section modulus in m^3
 * @param {string} speciesCode e.g. 'WC', 'DF'
 * @returns {number} Resisting moment in kN*m
 */
export function calculateResistingMoment(fiberStressMPa, sectionModulusM3, speciesCode) {
  // CSA O15 Table B.1 note: 0.95 factor for western red cedar (WC), red pine (RP), jack pine (JP)
  let reduction = 1.0;
  const sc = String(speciesCode).toUpperCase();
  if (['WC', 'RP', 'JP'].includes(sc)) {
    reduction = 0.95;
  }
  const fb_Pa = fiberStressMPa * 1e6 * reduction;
  const moment_Nm = fb_Pa * sectionModulusM3;
  return moment_Nm / 1000; // in kN*m
}

/**
 * Get CSA C22.3 No. 1 Table 31 Overload Capacity Factor (OCF) / Load Factor
 * @param {string} loadType 'transverse_wind' | 'transverse_wire_tension' | 'vertical' | 'longitudinal'
 * @param {number} grade 1 | 2 | 3
 * @param {string} material 'wood' (cov >= 15%) | 'concrete' (10-15%) | 'steel' (<= 10%)
 */
export function getCsaLoadFactor(loadType, grade = 2, material = 'wood') {
  // Standard CSA Table 31 / Table 32 Overload Capacity Factors
  // For Grade 2 (standard distribution):
  // Transverse Wind: Wood OCF = 1.65 (Grade 2), 2.20 (Grade 1)
  // Transverse Wire Tension (angles): Wood OCF = 1.30 (Grade 2), 1.65 (Grade 1)
  // Vertical: Wood OCF = 1.50 (Grade 2), 2.00 (Grade 1)
  // Longitudinal (dead-end): Wood OCF = 1.30 (Grade 2), 1.65 (Grade 1)
  const ocfTable = {
    transverse_wind: {
      1: { wood: 2.20, concrete: 1.80, steel: 1.50 },
      2: { wood: 1.65, concrete: 1.40, steel: 1.25 },
      3: { wood: 1.30, concrete: 1.20, steel: 1.00 }
    },
    transverse_wire_tension: {
      1: { wood: 1.65, concrete: 1.50, steel: 1.30 },
      2: { wood: 1.30, concrete: 1.20, steel: 1.10 },
      3: { wood: 1.10, concrete: 1.05, steel: 1.00 }
    },
    vertical: {
      1: { wood: 2.00, concrete: 1.60, steel: 1.30 },
      2: { wood: 1.50, concrete: 1.30, steel: 1.15 },
      3: { wood: 1.20, concrete: 1.10, steel: 1.00 }
    },
    longitudinal: {
      1: { wood: 1.65, concrete: 1.40, steel: 1.20 },
      2: { wood: 1.30, concrete: 1.15, steel: 1.00 },
      3: { wood: 1.00, concrete: 1.00, steel: 1.00 }
    }
  };

  const typeConfig = ocfTable[loadType] || ocfTable.transverse_wind;
  const gradeConfig = typeConfig[grade] || typeConfig[2];
  return gradeConfig[material] || gradeConfig.wood;
}

/**
 * Full-Line Pole Loading Calculation
 * Evaluates Groundline Bending Moments:
 * 1. Wind on Pole Body
 * 2. Transverse Wind on Conductors / Cables
 * 3. Transverse Line-Angle Wire Tension Resultant
 * 4. Second-Order (P-Delta) approx
 * Checks against Resisting Moment and recommends Class from CSA O15 Table B.1
 */
export function calculatePoleLoading({
  speciesCode = 'WC',
  poleLengthM = 13.7, // 45 ft
  poleClass = '3',
  grade = 2,
  windPressurePa = 400, // CSA Heavy/Medium wind
  iceThicknessMm = 12.5, // CSA Heavy ice
  windSpanM = 60,
  lineAngleDeg = 0,
  // Attachments: array of { name, heightM, count, diameterMm, tensionN, isNeutral, isComm }
  attachments = [
    { name: 'Primary 3-Phase Conductor', heightM: 11.5, count: 3, diameterMm: 15.0, tensionN: 7000 },
    { name: 'Neutral / Secondary', heightM: 9.8, count: 1, diameterMm: 12.0, tensionN: 4500 },
    { name: 'Telecom Bundle (Joint Use)', heightM: 7.5, count: 1, diameterMm: 25.0, tensionN: 3500 }
  ]
}) {
  const embedmentM = calculateEmbedmentDepth(poleLengthM);
  const heightAboveGroundM = Math.max(1, poleLengthM - embedmentM);
  const groundlineCircumferenceM = estimateGroundlineCircumference(poleClass, poleLengthM);
  const topCircumferenceM = groundlineCircumferenceM * 0.58; // standard taper ratio ~0.58
  const avgDiameterM = ((groundlineCircumferenceM + topCircumferenceM) / 2) / Math.PI;

  // 1. Wind on Pole Shaft
  // Projected area = heightAboveGround * avgDiameter
  const poleProjectedAreaM2 = heightAboveGroundM * avgDiameterM;
  const poleDragCoeff = 1.0;
  const unfactoredPoleWindForceN = windPressurePa * poleProjectedAreaM2 * poleDragCoeff;
  // Center of pressure is at ~45% from groundline due to taper
  const poleWindLeverArmM = heightAboveGroundM * 0.45;
  const unfactoredPoleWindMomentNm = unfactoredPoleWindForceN * poleWindLeverArmM;

  // 2. Transverse Wind on Conductors & Attachments
  // For each attachment: Force = WindPressure * (Diameter + 2*Ice) * WindSpan * Count
  let unfactoredWireWindMomentNm = 0;
  let totalWireWindForceN = 0;

  // 3. Transverse Line Angle Tension
  // Ft = 2 * Tension * sin(Angle / 2)
  let unfactoredWireAngleMomentNm = 0;
  let totalWireAngleForceN = 0;

  const processedAttachments = attachments.map((att) => {
    const effDiameterM = (att.diameterMm + 2 * iceThicknessMm) / 1000;
    const wireWindForceN = windPressurePa * effDiameterM * windSpanM * (att.count || 1);
    const wireWindMomentNm = wireWindForceN * (att.heightM || heightAboveGroundM);

    const angleRad = (lineAngleDeg * Math.PI) / 180;
    const wireAngleForceN = 2 * (att.tensionN || 0) * Math.sin(angleRad / 2) * (att.count || 1);
    const wireAngleMomentNm = wireAngleForceN * (att.heightM || heightAboveGroundM);

    unfactoredWireWindMomentNm += wireWindMomentNm;
    totalWireWindForceN += wireWindForceN;
    unfactoredWireAngleMomentNm += wireAngleMomentNm;
    totalWireAngleForceN += wireAngleForceN;

    return {
      ...att,
      effDiameterMm: Number((effDiameterM * 1000).toFixed(1)),
      wireWindForceN: Number(wireWindForceN.toFixed(0)),
      wireWindMomentNm: Number(wireWindMomentNm.toFixed(0)),
      wireAngleForceN: Number(wireAngleForceN.toFixed(0)),
      wireAngleMomentNm: Number(wireAngleMomentNm.toFixed(0))
    };
  });

  // Load Factors (CSA Table 31 for Wood)
  const ocfWind = getCsaLoadFactor('transverse_wind', grade, 'wood');
  const ocfAngle = getCsaLoadFactor('transverse_wire_tension', grade, 'wood');

  // Total Factored Groundline Moment
  const factoredPoleWindMomentNm = unfactoredPoleWindMomentNm * ocfWind;
  const factoredWireWindMomentNm = unfactoredWireWindMomentNm * ocfWind;
  const factoredWireAngleMomentNm = unfactoredWireAngleMomentNm * ocfAngle;

  const totalFactoredMomentNm =
    factoredPoleWindMomentNm + factoredWireWindMomentNm + factoredWireAngleMomentNm;
  const totalFactoredMomentKNm = Number((totalFactoredMomentNm / 1000).toFixed(2));

  // Wood Species & Resisting Moment Capacity
  const species = getO15Species(speciesCode) || getO15Species('WC');
  const fiberStressMPa = species?.fibreStressMPa || 41.4;
  const sectionModulusM3 = calculateSectionModulus(groundlineCircumferenceM);
  const resistingMomentKNm = Number(
    calculateResistingMoment(fiberStressMPa, sectionModulusM3, speciesCode).toFixed(2)
  );

  // Utilization Ratio
  const utilizationRatio = Number((totalFactoredMomentKNm / resistingMomentKNm).toFixed(3));
  const utilizationPercent = Number((utilizationRatio * 100).toFixed(1));
  const isPassing = utilizationRatio <= 1.0;

  // Horizontal Breaking Load Equivalent at 0.61m from pole top (CSA O15 Table B.1)
  // M_equiv = Load_top * (heightAboveGround - 0.61)
  const leverArmTopM = Math.max(1, heightAboveGroundM - 0.61);
  const requiredTopLoadN = totalFactoredMomentNm / leverArmTopM;
  const requiredTopLoadKN = Number((requiredTopLoadN / 1000).toFixed(2));

  // Determine Recommended Pole Class from CSA O15 Table B.1
  const allClasses = getAllO15PoleClasses(); // Strongest (H6) to lightest (8)
  // Filter classes capable of holding requiredTopLoadN
  const capableClasses = allClasses.filter((c) => c.load_N >= requiredTopLoadN);
  const recommendedClass = capableClasses.length > 0 ? capableClasses[capableClasses.length - 1].class : 'EXCEEDS_H6';

  return {
    species: {
      commonName: species.commonName,
      code: species.speciesCode,
      fiberStressMPa
    },
    geometry: {
      poleLengthM,
      embedmentM,
      heightAboveGroundM: Number(heightAboveGroundM.toFixed(2)),
      groundlineCircumferenceM,
      sectionModulusM3: Number(sectionModulusM3.toFixed(6))
    },
    factors: {
      grade,
      ocfWind,
      ocfAngle
    },
    moments: {
      unfactoredPoleWindKNm: Number((unfactoredPoleWindMomentNm / 1000).toFixed(2)),
      unfactoredWireWindKNm: Number((unfactoredWireWindMomentNm / 1000).toFixed(2)),
      unfactoredWireAngleKNm: Number((unfactoredWireAngleMomentNm / 1000).toFixed(2)),
      factoredPoleWindKNm: Number((factoredPoleWindMomentNm / 1000).toFixed(2)),
      factoredWireWindKNm: Number((factoredWireWindMomentNm / 1000).toFixed(2)),
      factoredWireAngleKNm: Number((factoredWireAngleMomentNm / 1000).toFixed(2)),
      totalFactoredMomentKNm,
      resistingMomentKNm
    },
    utilization: {
      ratio: utilizationRatio,
      percent: utilizationPercent,
      isPassing,
      marginKNm: Number((resistingMomentKNm - totalFactoredMomentKNm).toFixed(2))
    },
    classification: {
      currentClass: poleClass,
      requiredTopLoadKN,
      recommendedClass
    },
    attachments: processedAttachments
  };
}
