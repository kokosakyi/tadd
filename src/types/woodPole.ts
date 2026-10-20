import type { CalcTraceRecord } from './trace';

export type PoleStandard = 'CSA' | 'ANSI';
export type LoadInputMode = 'line_physics' | 'direct_loads';

export interface PoleAttachment {
  id?: number | string;
  name: string;
  heightM: number;
  count: number;
  diameterMm: number;
  tensionN: number;
  /** Optional unit conductor weight in N/m for vertical load derivation */
  unitWeightNPerM?: number;
  /** Optional transverse eccentricity offset from pole centerline in m */
  eccentricityM?: number;
  /** Optional direct 3D forces (used when loadInputMode === 'direct_loads') */
  distFromTipFt?: number;
  transverseForceLbs?: number;
  verticalForceLbs?: number;
  longitudinalForceLbs?: number;
  eccentricityFt?: number;
}

export interface PoleSegmentResult {
  index: number;
  distFromTipM: number;
  distFromTipFt: number;
  heightAboveGlM: number;
  heightAboveGlFt: number;
  diameterM: number;
  diameterIn: number;
  circumferenceM: number;
  circumferenceIn: number;
  areaM2: number;
  areaIn2: number;
  sectionModulusM3: number;
  sectionModulusIn3: number;
  momentOfInertiaM4: number;
  momentOfInertiaIn4: number;
  poleSelfWeightN: number;
  poleSelfWeightLbs: number;
  accumAxialLoadN: number;
  accumAxialLoadLbs: number;
  primaryMomentKNm: number;
  primaryMomentFtLbs: number;
  amplifiedMomentKNm: number;
  amplifiedMomentFtLbs: number;
  axialStressMPa: number;
  axialStressPsi: number;
  bendingStressMPa: number;
  bendingStressPsi: number;
  combinedStressMPa: number;
  combinedStressPsi: number;
  heightAdjFactor: number;
  allowableStressMPa: number;
  allowableStressPsi: number;
  resistingMomentKNm: number;
  resistingMomentFtLbs: number;
  usagePercent: number;
}

export interface GereCarterBucklingResult {
  enabled: boolean;
  effectiveDiameterIn: number;
  effectiveDiameterM: number;
  effectiveInertiaIn4: number;
  effectiveInertiaM4: number;
  eulerCriticalLoadPrimeLbs: number;
  eulerCriticalLoadPrimeN: number;
  taperFactorPStar: number;
  criticalBucklingLoadLbs: number;
  criticalBucklingLoadKN: number;
  totalGroundlineAxialLoadLbs: number;
  totalGroundlineAxialLoadKN: number;
  amplificationFactor: number;
  isBucklingUnstable: boolean;
}

export interface WoodPoleInput {
  standard?: PoleStandard;
  loadInputMode?: LoadInputMode;
  speciesCode?: string;
  poleLengthM?: number;
  poleLengthFt?: number;
  embedmentM?: number;
  embedmentFt?: number;
  poleClass?: string | number;
  tipCircumferenceIn?: number;
  buttCircumference6ftIn?: number;
  grade?: 1 | 2 | 3;
  strengthFactorPhi?: number;
  enablePDelta?: boolean;
  enableHeightAdjustment?: boolean;
  numSegments?: number;
  windPressurePa?: number;
  windPressurePsf?: number;
  iceThicknessMm?: number;
  windSpanM?: number;
  weightSpanM?: number;
  lineAngleDeg?: number;
  attachments?: PoleAttachment[];
}

export interface WoodPoleCalculationResult {
  standard: PoleStandard;
  loadInputMode: LoadInputMode;
  species: {
    commonName: string;
    code: string;
    fiberStressMPa: number;
    fiberStressPsi: number;
    mor5PctMPa: number;
    mor5PctPsi: number;
    covPercent: number;
    moeMPa: number;
    moePsi: number;
    densityKgM3: number;
    densityPcf: number;
    ansiHeightFactor: number;
  };
  geometry: {
    poleLengthM: number;
    poleLengthFt: number;
    embedmentM: number;
    embedmentFt: number;
    heightAboveGroundM: number;
    heightAboveGroundFt: number;
    tipCircumferenceM: number;
    tipCircumferenceIn: number;
    tipDiameterIn: number;
    buttCircumference6ftM: number;
    buttCircumference6ftIn: number;
    buttDiameter6ftIn: number;
    groundlineCircumferenceM: number;
    groundlineCircumferenceIn: number;
    groundlineDiameterIn: number;
    taperInPerFt: number;
    sectionModulusM3: number;
    sectionModulusIn3: number;
  };
  factors: {
    standard: PoleStandard;
    grade: number;
    ocfWind: number;
    ocfAngle: number;
    ocfVertical: number;
    phiStrength: number;
    speciesReductionFactor: number;
    enablePDelta: boolean;
    enableHeightAdjustment: boolean;
  };
  buckling: GereCarterBucklingResult;
  moments: {
    unfactoredPoleWindKNm: number;
    unfactoredWireWindKNm: number;
    unfactoredWireAngleKNm: number;
    unfactoredEccentricKNm: number;
    factoredPoleWindKNm: number;
    factoredWireWindKNm: number;
    factoredWireAngleKNm: number;
    factoredEccentricKNm: number;
    primaryGroundlineMomentKNm: number;
    primaryGroundlineMomentFtLbs: number;
    totalFactoredMomentKNm: number;
    totalFactoredMomentFtLbs: number;
    resistingMomentKNm: number;
    resistingMomentFtLbs: number;
  };
  utilization: {
    ratio: number;
    percent: number;
    groundlinePercent: number;
    criticalPercent: number;
    criticalHeightAboveGlM: number;
    criticalHeightAboveGlFt: number;
    criticalDistFromTipFt: number;
    isCriticalAboveGroundline: boolean;
    isPassing: boolean;
    marginKNm: number;
  };
  criticalSection: PoleSegmentResult;
  groundlineSection: PoleSegmentResult;
  elevationProfile: PoleSegmentResult[];
  classification: {
    currentClass: string | number;
    requiredTopLoadKN: number;
    recommendedClass: string;
  };
  attachments: any[];
  trace: CalcTraceRecord;
}
