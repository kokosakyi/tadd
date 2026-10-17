import type { CalcTraceRecord } from './trace';

export interface WeatherStationData {
  location: string;
  elevation: number;
  min_temp: number;
  wind_50yr: number;
  ice_50yr: number;
  wet_snow_50yr: number | null;
  latitude?: number;
  longitude?: number;
}

export interface WeatherCriteriaInput {
  province?: string;
  location?: string;
  returnPeriod?: number;
  district?: 'Light' | 'Medium' | 'Heavy';
  isTransmission?: boolean;
  conductorDiameterMm?: number;
  rtsKn?: number;
  conductorWeightNm?: number;
  isBundled?: boolean;
  rulingSpanM?: number;
  hasDampers?: boolean;
}

export interface RPScalingResult {
  factor_w: number;
  factor_t: number;
  w_T: number;
  t_T: number;
}

export interface PhysicsResult {
  q_0: number;
  q_h: number;
  d_total: number;
  a_total: number;
  F_w: number;
  W_i: number;
  W_c: number;
  V_total: number;
  T_total: number;
}

export interface GuardrailResult {
  governedWindPa: number;
  governedIceRadialMm: number;
  governedIceKgM: number;
  governedTransverseLoadNm: number;
  governedVerticalLoadNm: number;
  governedResultantLoadNm: number;
  minWindPa: number;
  minIceMm: number;
  governedBy: string;
}

export interface TensionLimitsResult {
  limits: Array<{
    condition: string;
    description: string;
    csaLimitPct: number;
    recommendedLimitPct: number;
    tensionKn: number;
    limitKn: number;
  }>;
}

export interface ClimaticCriteriaResult {
  stationData: WeatherStationData;
  scaling: RPScalingResult;
  physics: PhysicsResult;
  guardrail: GuardrailResult;
  tension: TensionLimitsResult;
  loadCaseMatrix: unknown;
  criText: string;
  trace: CalcTraceRecord;
}
