/**
 * Weather & Load Criteria Engine
 * Conforms to CSA C22.3 No. 60826 & C22.3 No. 1 and §6.1 / §9.4 of App Plan.
 */

import {
  queryModule1GeoDB,
  calculateModule2RPScaling,
  calculateModule3Physics,
  applyModule4Guardrail,
  calculateModule5TensionLimits,
  generateModule6CriText,
  RETURN_PERIOD_FACTORS,
  DETERMINISTIC_MINIMUMS
} from '../../utils/weatherCriteriaEngine.js';
import { generateUnifiedLoadCaseMatrix } from '../../utils/loadCaseMatrixEngine.js';
import { createTraceRecord } from '../trace/calcTrace.js';

export { RETURN_PERIOD_FACTORS, DETERMINISTIC_MINIMUMS };

/**
 * Execute full climatic analysis pipeline with calculation audit trace
 */
export function calculateClimaticCriteria({
  province = 'Ontario',
  location = 'Ottawa (City Hall)',
  returnPeriod = 150,
  district = 'Heavy',
  isTransmission = true,
  conductorDiameterMm = 28.14,
  rtsKn = 140.0,
  conductorWeightNm = 15.9,
  isBundled = false,
  rulingSpanM = 250,
  hasDampers = true
}) {
  // 1. Station Data
  const stationData = queryModule1GeoDB(province, location) || {
    location,
    elevation: 0,
    min_temp: -20,
    wind_50yr: 90,
    ice_50yr: 30,
    wet_snow_50yr: null
  };

  const w50 = stationData.wind_50yr || 90;
  const t50 = stationData.ice_50yr || 30;

  // 2. Return-Period Scaling
  const scalingResult = calculateModule2RPScaling(w50, t50, returnPeriod);

  // 3. Physics & Dynamic Wind Pressure
  const physicsResult = calculateModule3Physics(
    scalingResult.w_T,
    scalingResult.t_T,
    conductorDiameterMm,
    isTransmission
  );

  // 4. Deterministic Guardrail Check
  const guardrailResult = applyModule4Guardrail(physicsResult, district);

  // 5. Tension Limits
  const tensionResult = calculateModule5TensionLimits(
    rulingSpanM,
    hasDampers,
    isBundled,
    rtsKn,
    conductorWeightNm
  );

  // 6. Unified Load Case Matrix
  const loadCaseMatrix = generateUnifiedLoadCaseMatrix({
    district,
    deterministicWindPa: guardrailResult.minWindPa,
    deterministicIceMm: guardrailResult.minIceMm,
    minJanTempC: stationData.min_temp,
    maxConductorTempC: 100,
    r_T_wind_kmh: scalingResult.w_T,
    r_T_ice_mm: scalingResult.t_T,
    returnPeriod,
    grade: 2
  });

  // 7. PLS-CADD .cri string
  const criText = generateModule6CriText(
    {
      cityData: stationData,
      returnPeriod,
      conductor: { diameter: conductorDiameterMm, rulingSpan: rulingSpanM }
    },
    {
      scaling: scalingResult,
      governed: guardrailResult,
      tension: tensionResult
    }
  );

  // 8. Build Audit Trace
  const steps = [
    {
      op: 'lookup',
      ref: 'CSA C22.3 No. 60826 Table CA.1',
      description: `Station 50-yr wind (${w50} km/h) & ice (${t50} mm) for ${stationData.location}`,
      value: { w50, t50 },
      unit: 'km/h, mm'
    },
    {
      op: 'multiplier',
      ref: `Return Period Scaling (${returnPeriod}-yr)`,
      description: `Wind factor Tw=${scalingResult.Tw?.toFixed(2) || '1.00'}, Ice factor Ti=${scalingResult.Ti?.toFixed(2) || '1.00'}`,
      value: { w_T: scalingResult.w_T, t_T: scalingResult.t_T },
      unit: 'km/h, mm'
    },
    {
      op: 'formula',
      ref: 'CSA C22.3 No. 60826 Cl. 6.2 (q0)',
      description: `Dynamic reference wind pressure: q0 = 0.5 * tau * mu * (K_R * V_R)^2`,
      value: physicsResult.q0_extreme,
      unit: 'Pa'
    },
    {
      op: 'calc',
      ref: `Deterministic Guardrail (${district} District)`,
      description: `Governing ice: ${guardrailResult.governed_t_design} mm (Deterministic min: ${guardrailResult.minIceMm} mm)`,
      value: guardrailResult.governed_t_design,
      unit: 'mm'
    }
  ];

  const trace = createTraceRecord({
    calculatorId: 'weather.criteria',
    snapshotVersion: 'C22.3-60826:2010',
    inputs: {
      province,
      location: stationData.location,
      returnPeriod,
      district,
      conductorDiameterMm,
      rtsKn,
      conductorWeightNm,
      rulingSpanM
    },
    steps,
    result: {
      w50,
      t50,
      w_T: scalingResult.w_T,
      t_T: scalingResult.t_T,
      q0_wind_Pa: physicsResult.q0_extreme,
      governed_ice_mm: guardrailResult.governed_t_design,
      governed_wind_Pa: guardrailResult.governed_q0,
      initialTensionLimitKn: tensionResult.initial_unloaded_tension_limit_kN,
      finalTensionLimitKn: tensionResult.final_unloaded_tension_limit_kN
    },
    citations: [
      'CAN/CSA-C22.3 No. 60826-10 Table CA.1',
      'CAN/CSA-C22.3 No. 60826-10 Clauses 6.2–6.4',
      'CSA C22.3 No. 1 Clauses 7.4 & 8.1'
    ],
    notes: [
      `Deterministic district minimums applied: ${district} district (${guardrailResult.minIceMm} mm ice, ${guardrailResult.minWindPa} Pa wind).`
    ]
  });

  return {
    stationData,
    scalingResult,
    physicsResult,
    guardrailResult,
    tensionResult,
    loadCaseMatrix,
    criText,
    trace
  };
}

/**
 * Export load case matrix to CSV string
 */
export function exportLoadCaseMatrixCsv(matrix = []) {
  const headers = ['Case ID', 'Standard Code', 'Case Name', 'Description', 'Type', 'Radial Ice (mm)', 'Wind Pressure (Pa)', 'Temperature (°C)', 'Load Factors / OCF', 'Governing Use'];
  const rows = matrix.map((m) => [
    `"${m.id}"`,
    `"${m.code}"`,
    `"${m.name}"`,
    `"${m.description}"`,
    `"${m.type}"`,
    m.iceMm,
    m.windPa,
    m.tempC,
    `"${m.ocf}"`,
    `"${m.governingUse}"`
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}
