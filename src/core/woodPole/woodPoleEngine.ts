/**
 * Wood Pole Loading & Stress Engine
 * Conforms to CSA C22.3 No. 1 Clause 7.4 / Table 31 & CSA O15 Table 3 and §6.4 / §9.4 of App Plan.
 */

import {
  calculatePoleLoading,
  calculateEmbedmentDepth,
  calculateSectionModulus,
  calculateResistingMoment
} from '../../utils/woodPoleLoadingEngine.js';
import { getAllO15Species, getAllO15PoleClasses } from '../../data/csa/o15/index.js';
import { createTraceRecord } from '../trace/calcTrace';
import type { WoodPoleInput } from '../../types/woodPole';
import type { CalcStep } from '../../types/trace';

export { getAllO15Species, getAllO15PoleClasses };

/**
 * Execute full wood pole loading analysis with calculation audit trace
 */
export function calculateWoodPoleStructural({
  speciesCode = 'WC',
  poleLengthM = 13.7, // 45 ft
  poleClass = '3',
  grade = 2,
  windPressurePa = 400,
  iceThicknessMm = 12.5,
  windSpanM = 60,
  lineAngleDeg = 0,
  attachments = [
    { name: 'Primary 3-Phase Conductor', heightM: 11.5, count: 3, diameterMm: 15.0, tensionN: 7000 },
    { name: 'Neutral / Secondary', heightM: 9.8, count: 1, diameterMm: 12.0, tensionN: 4500 },
    { name: 'Telecom Bundle (Joint Use)', heightM: 7.5, count: 1, diameterMm: 25.0, tensionN: 3500 }
  ]
}: WoodPoleInput = {}) {
  const poleCalc = calculatePoleLoading({
    speciesCode,
    poleLengthM: Number(poleLengthM),
    poleClass: String(poleClass),
    grade: Number(grade),
    windPressurePa: Number(windPressurePa),
    iceThicknessMm: Number(iceThicknessMm),
    windSpanM: Number(windSpanM),
    lineAngleDeg: Number(lineAngleDeg),
    attachments
  });

  const embedmentM = poleCalc.geometry?.embedmentM ?? (poleCalc as any).embedmentM ?? 0;


  // Build Audit Trace Record
  const steps: CalcStep[] = [
    {
      op: 'formula',
      ref: 'CSA C22.3 No. 1 Embedment',
      description: 'Standard pole embedment: 10% of length + 0.6 m',
      value: embedmentM,
      unit: 'm'
    },
    {
      op: 'formula',
      ref: 'CSA O15 Section Modulus (S)',
      description: 'S = C^3 / (32 * pi^2) at groundline',
      value: Number(((poleCalc.geometry?.sectionModulusM3 || 0) * 1e3).toFixed(4)),
      unit: 'dm^3'
    },
    {
      op: 'lookup',
      ref: 'CSA O15 Table 3 & Table B.1',
      description: `Designated fiber stress fb for ${poleCalc.species?.commonName || speciesCode}`,
      value: poleCalc.species?.fiberStressMPa,
      unit: 'MPa'
    },
    {
      op: 'multiplier',
      ref: `CSA C22.3 No. 1 Table 31 (Grade ${grade})`,
      description: `Overload Capacity Factors: Transverse Wind=${poleCalc.factors?.ocfWind}x, Wire Tension=${poleCalc.factors?.ocfAngle}x`,
      value: `ocfWind=${poleCalc.factors?.ocfWind}, ocfAngle=${poleCalc.factors?.ocfAngle}`,
      unit: 'factor'
    },
    {
      op: 'calc',
      ref: 'Groundline Utilization Check',
      description: `Factored Moment Mf (${poleCalc.moments?.totalFactoredMomentKNm} kN*m) / Resisting Capacity Mr (${poleCalc.moments?.resistingMomentKNm} kN*m)`,
      value: poleCalc.utilization?.percent,
      unit: '%'
    }
  ];

  const trace = createTraceRecord({
    calculatorId: 'wood_pole.loading',
    snapshotVersion: 'C22.3-1:2020',
    inputs: {
      speciesCode,
      poleLengthM,
      poleClass,
      grade,
      windPressurePa,
      iceThicknessMm,
      windSpanM,
      lineAngleDeg,
      attachmentsCount: attachments.length
    },
    steps,
    result: {
      totalFactoredMomentKNm: poleCalc.moments?.totalFactoredMomentKNm,
      resistingMomentKNm: poleCalc.moments?.resistingMomentKNm,
      utilizationPercent: poleCalc.utilization?.percent,
      isPass: poleCalc.utilization?.isPassing,
      recommendedClass: poleCalc.classification?.recommendedClass,
      ocfWind: poleCalc.factors?.ocfWind,
      ocfAngle: poleCalc.factors?.ocfAngle
    },
    citations: [
      'CSA C22.3 No. 1:20 Clauses 7.4 & 8.1',
      'CSA C22.3 No. 1:20 Table 31 (Load Factors for Non-Linear Analysis)',
      'CSA O15-15 Tables 3 & B.1'
    ],
    notes: [
      `Analysis performed for Grade ${grade} construction on ${poleCalc.species?.commonName || speciesCode} pole.`
    ]
  });

  return {
    ...poleCalc,
    trace
  };
}
