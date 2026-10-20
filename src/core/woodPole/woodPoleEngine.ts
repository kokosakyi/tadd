/**
 * Unified Wood Pole Loading, Non-Linear Buckling & Stress Engine
 * Supports:
 * - CSA C22.3 No. 1 Clause 7.4 / Table 31 & CSA O15 Table 3 / Table B.1
 * - ANSI O5.1-2017 & ASCE Manual of Practice 141 (LRFD, 5% LEL, Gere-Carter P-Delta)
 */

import {
  calculatePoleLoading,
  calculateEmbedmentDepth,
  calculateSectionModulus,
  calculateResistingMoment,
  getAllAnsiSpecies,
  getAnsiSpecies,
  getStandardPoleClassSpec
} from '../../utils/woodPoleLoadingEngine.js';
import { getAllO15Species, getAllO15PoleClasses } from '../../data/csa/o15/index.js';
import { createTraceRecord } from '../trace/calcTrace';
import type { WoodPoleInput, PoleSegmentResult } from '../../types/woodPole';
import type { CalcStep } from '../../types/trace';

export {
  getAllO15Species,
  getAllO15PoleClasses,
  getAllAnsiSpecies,
  getAnsiSpecies,
  getStandardPoleClassSpec,
  calculateEmbedmentDepth,
  calculateSectionModulus,
  calculateResistingMoment
};

/**
 * Export Multi-Segment Elevation Profile to CSV format
 */
export function exportPoleElevationProfileCsv(elevationProfile: PoleSegmentResult[] = []): string {
  const headers = [
    'Station_Index',
    'Dist_From_Tip_ft',
    'Dist_From_Tip_m',
    'Height_Above_GL_ft',
    'Height_Above_GL_m',
    'Diameter_in',
    'Section_Modulus_in3',
    'Accum_Axial_Load_lbs',
    'Primary_Moment_ftlbs',
    'Amplified_Moment_ftlbs',
    'Bending_Stress_psi',
    'Axial_Stress_psi',
    'Height_Adj_Factor',
    'Allowable_Stress_psi',
    'Usage_Percent'
  ];

  const rows = elevationProfile.map((seg) =>
    [
      seg.index,
      seg.distFromTipFt.toFixed(2),
      seg.distFromTipM.toFixed(2),
      seg.heightAboveGlFt.toFixed(2),
      seg.heightAboveGlM.toFixed(2),
      seg.diameterIn.toFixed(2),
      seg.sectionModulusIn3.toFixed(1),
      seg.accumAxialLoadLbs.toFixed(0),
      seg.primaryMomentFtLbs.toFixed(0),
      seg.amplifiedMomentFtLbs.toFixed(0),
      seg.bendingStressPsi.toFixed(0),
      seg.axialStressPsi.toFixed(1),
      seg.heightAdjFactor.toFixed(3),
      seg.allowableStressPsi.toFixed(0),
      seg.usagePercent.toFixed(2)
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Execute full wood pole structural analysis (CSA or ANSI) with immutable calculation audit trace
 */
export function calculateWoodPoleStructural(input: WoodPoleInput = {}) {
  const {
    standard = 'CSA',
    loadInputMode = 'line_physics',
    speciesCode = standard === 'ANSI' ? 'DF' : 'WC',
    poleLengthM = 13.7,
    poleLengthFt,
    embedmentM: inputEmbedmentM,
    embedmentFt: inputEmbedmentFt,
    poleClass = '3',
    tipCircumferenceIn,
    buttCircumference6ftIn,
    grade = 2,
    strengthFactorPhi = 0.671,
    enablePDelta,
    enableHeightAdjustment,
    numSegments = 20,
    windPressurePa = 400,
    windPressurePsf,
    iceThicknessMm = 12.5,
    windSpanM = 60,
    weightSpanM,
    lineAngleDeg = 0,
    attachments = [
      { name: 'Primary 3-Phase Conductor', heightM: 11.5, count: 3, diameterMm: 15.0, tensionN: 7000 },
      { name: 'Neutral / Secondary', heightM: 9.8, count: 1, diameterMm: 12.0, tensionN: 4500 },
      { name: 'Telecom Bundle (Joint Use)', heightM: 7.5, count: 1, diameterMm: 25.0, tensionN: 3500 }
    ]
  } = input;

  const poleCalc = calculatePoleLoading({
    standard,
    loadInputMode,
    speciesCode,
    poleLengthM: Number(poleLengthM),
    poleLengthFt,
    embedmentM: inputEmbedmentM,
    embedmentFt: inputEmbedmentFt,
    poleClass: String(poleClass),
    tipCircumferenceIn,
    buttCircumference6ftIn,
    grade: Number(grade) as 1 | 2 | 3,
    strengthFactorPhi: Number(strengthFactorPhi),
    enablePDelta,
    enableHeightAdjustment,
    numSegments: Number(numSegments),
    windPressurePa: Number(windPressurePa),
    windPressurePsf,
    iceThicknessMm: Number(iceThicknessMm),
    windSpanM: Number(windSpanM),
    weightSpanM,
    lineAngleDeg: Number(lineAngleDeg),
    attachments
  });

  const isAnsi = poleCalc.standard === 'ANSI';
  const embedmentM = poleCalc.geometry?.embedmentM ?? 0;

  // Build Detailed Audit Trace Steps
  const steps: CalcStep[] = [
    {
      op: 'formula',
      ref: isAnsi ? 'ANSI O5.1 Embedment & Taper' : 'CSA C22.3 No. 1 Embedment',
      description: `Embedment E = ${embedmentM} m (${poleCalc.geometry.embedmentFt} ft), Linear Taper = ${poleCalc.geometry.taperInPerFt} in/ft`,
      value: embedmentM,
      unit: 'm'
    },
    {
      op: 'formula',
      ref: isAnsi ? 'ANSI O5.1 Section Modulus (S)' : 'CSA O15 Section Modulus (S)',
      description: `S_GL = C^3 / (32 * pi^2) at groundline (D_GL = ${poleCalc.geometry.groundlineDiameterIn} in)`,
      value: Number(((poleCalc.geometry?.sectionModulusM3 || 0) * 1e3).toFixed(4)),
      unit: 'dm^3'
    },
    {
      op: 'lookup',
      ref: isAnsi ? 'ANSI O5.1 Table 1 & 5% LEL' : 'CSA O15 Table 3 & Table B.1',
      description: isAnsi
        ? `MOR_50% = ${poleCalc.species.fiberStressPsi} psi (COV=${poleCalc.species.covPercent}%) -> MOR_5% = ${poleCalc.species.mor5PctPsi} psi`
        : `Designated fiber stress fb for ${poleCalc.species?.commonName || speciesCode}`,
      value: isAnsi ? poleCalc.species.mor5PctPsi : poleCalc.species?.fiberStressMPa,
      unit: isAnsi ? 'psi' : 'MPa'
    },
    {
      op: 'multiplier',
      ref: isAnsi ? 'ASCE 141 LRFD & Gere-Carter P-Delta' : `CSA C22.3 No. 1 Table 31 (Grade ${grade})`,
      description: isAnsi
        ? `Resistance Factor phi=${poleCalc.factors.phiStrength}, Gere-Carter P_cr=${poleCalc.buckling.criticalBucklingLoadLbs} lbs, AF_PDelta=${poleCalc.buckling.amplificationFactor}`
        : `Overload Capacity Factors: Wind=${poleCalc.factors?.ocfWind}x, Tension=${poleCalc.factors?.ocfAngle}x, AF_PDelta=${poleCalc.buckling.amplificationFactor}`,
      value: isAnsi
        ? `phi=${poleCalc.factors.phiStrength}, AF_PDelta=${poleCalc.buckling.amplificationFactor}`
        : `ocfWind=${poleCalc.factors?.ocfWind}, ocfAngle=${poleCalc.factors?.ocfAngle}`,
      unit: 'factor'
    },
    {
      op: 'calc',
      ref: isAnsi ? 'Multi-Segment Critical Section Check' : 'Groundline & Profile Utilization Check',
      description: `Critical section at H=${poleCalc.utilization.criticalHeightAboveGlFt} ft above GL (${poleCalc.utilization.criticalPercent}% usage); Groundline usage=${poleCalc.utilization.groundlinePercent}%`,
      value: poleCalc.utilization?.percent,
      unit: '%'
    }
  ];

  const trace = createTraceRecord({
    calculatorId: isAnsi ? 'wood_pole.ansi_asce141' : 'wood_pole.loading',
    snapshotVersion: isAnsi ? 'ANSI-O5.1:2017 / ASCE-141' : 'C22.3-1:2020',
    inputs: {
      standard: poleCalc.standard,
      loadInputMode: poleCalc.loadInputMode,
      speciesCode,
      poleLengthM: poleCalc.geometry.poleLengthM,
      poleClass,
      grade,
      enablePDelta: poleCalc.factors.enablePDelta,
      enableHeightAdjustment: poleCalc.factors.enableHeightAdjustment,
      windPressurePa: Number(windPressurePa),
      iceThicknessMm: Number(iceThicknessMm),
      windSpanM: Number(windSpanM),
      lineAngleDeg: Number(lineAngleDeg),
      attachmentsCount: attachments.length
    },
    steps,
    result: {
      standard: poleCalc.standard,
      totalFactoredMomentKNm: poleCalc.moments?.totalFactoredMomentKNm,
      resistingMomentKNm: poleCalc.moments?.resistingMomentKNm,
      utilizationPercent: poleCalc.utilization?.percent,
      groundlinePercent: poleCalc.utilization?.groundlinePercent,
      criticalPercent: poleCalc.utilization?.criticalPercent,
      criticalHeightAboveGlFt: poleCalc.utilization?.criticalHeightAboveGlFt,
      afPdelta: poleCalc.buckling?.amplificationFactor,
      isPass: poleCalc.utilization?.isPassing,
      recommendedClass: poleCalc.classification?.recommendedClass,
      ocfWind: poleCalc.factors?.ocfWind,
      ocfAngle: poleCalc.factors?.ocfAngle
    },
    citations: isAnsi
      ? [
          'ANSI O5.1-2017 Table 1 & Annex A/B (Wood Pole Dimensions & Fiber Stress)',
          'ASCE Manual of Practice 141 (Wood Pole Structures for Electrical Transmission Lines)',
          'Gere & Carter (1962) Critical Buckling Load for Tapered Columns'
        ]
      : [
          'CSA C22.3 No. 1:20 Clauses 7.4 & 8.1',
          'CSA C22.3 No. 1:20 Table 31 (Load Factors for Non-Linear Analysis)',
          'CSA O15-15 Tables 3, B.1 & Clause B.1.3 (Critical Section Above Groundline)'
        ],
    notes: [
      isAnsi
        ? `ANSI O5.1 / ASCE 141 non-linear discretized check on ${poleCalc.species.commonName} (${poleCalc.elevationProfile.length} shaft stations).`
        : `CSA C22.3 No. 1 Grade ${grade} analysis on ${poleCalc.species?.commonName || speciesCode} pole (${poleCalc.elevationProfile.length} shaft stations).`
    ]
  });

  return {
    ...poleCalc,
    trace
  };
}
