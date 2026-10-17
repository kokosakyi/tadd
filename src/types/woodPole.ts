import type { CalcTraceRecord } from './trace';

export interface PoleAttachment {
  name: string;
  heightM: number;
  count: number;
  diameterMm: number;
  tensionN: number;
}

export interface WoodPoleInput {
  speciesCode?: string;
  poleLengthM?: number;
  poleClass?: string | number;
  grade?: 1 | 2 | 3;
  windPressurePa?: number;
  iceThicknessMm?: number;
  windSpanM?: number;
  lineAngleDeg?: number;
  attachments?: PoleAttachment[];
}

export interface WoodPoleCalculationResult {
  speciesCode: string;
  poleLengthM: number;
  poleClass: string;
  grade: number;
  embedmentM: number;
  heightAboveGroundM: number;
  geometry: {
    groundlineCircumferenceM: number;
    groundlineDiameterM: number;
    sectionModulusM3: number;
  };
  species: {
    code: string;
    commonName: string;
    fiberStressMPa: number;
  };
  factors: {
    grade: number;
    ocfWind: number;
    ocfAngle: number;
    phiStrength: number;
  };
  loads: {
    poleWindLoadN: number;
    attachmentsWindLoadN: number;
    attachmentsAngleLoadN: number;
  };
  moments: {
    poleWindMomentKNm: number;
    attachmentsWindMomentKNm: number;
    attachmentsAngleMomentKNm: number;
    totalFactoredMomentKNm: number;
    resistingMomentKNm: number;
  };
  utilization: {
    percent: number;
    status: 'PASS' | 'FAIL';
  };
  trace: CalcTraceRecord;
}
