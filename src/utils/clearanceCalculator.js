/**
 * Clearance Calculation Engine according to CSA C22.3 No. 1
 * Supports side-by-side evaluation of Maximum Thermal Operating Sag vs CSA Ice/Wind Weather Sag.
 */

export const M_TO_FT = 3.28084;
export const FT_TO_M = 0.3048;

export function convertMetersToUnit(meters, unit = 'metric') {
  if (unit === 'imperial') {
    return (meters * M_TO_FT).toFixed(2) + ' ft';
  }
  return meters.toFixed(2) + ' m';
}

export function formatValue(val, unit = 'metric', decimals = 2) {
  const num = Number(val);
  if (isNaN(num)) return '0.00';
  if (unit === 'imperial') {
    return (num * M_TO_FT).toFixed(decimals);
  }
  return num.toFixed(decimals);
}

/**
 * Calculates clearance details for a given configuration
 */
export function calculateClearance({
  voltageClassId,
  operatingVoltageKv,
  categoryObj,
  customBaseClearance = null,
  utilityPreset = 'csa_std',
  adderPerKv = 0.010,
  baseThresholdKv = 50,
  elevationMeters = 0,
  thermalSagBufferMeters = 0.3,
  iceWindSagBufferMeters = 0.5,
  csaLoadingZone = 'heavy', // 'heavy', 'medium', 'light'
  utilitySafetyMarginMeters = 0.3,
  attachmentHeightMeters = 12.0,
  midspanSagMeters = 2.5,
  obstacleHeightMeters = 0,
  unit = 'metric'
}) {
  // 1. Determine Base Clearance
  let baseClearanceM = 0;
  if (customBaseClearance !== null && !isNaN(parseFloat(customBaseClearance))) {
    baseClearanceM = parseFloat(customBaseClearance);
  } else if (categoryObj && categoryObj.baseClearances) {
    baseClearanceM = categoryObj.baseClearances[voltageClassId] ?? 5.5;
  } else {
    baseClearanceM = 5.5;
  }

  const vKv = parseFloat(operatingVoltageKv) || 12.47;

  // 2. Voltage Adder Calculation (CSA C22.3 Rule 4.1.4)
  let voltageAdderM = 0;
  if (vKv > baseThresholdKv) {
    voltageAdderM = (vKv - baseThresholdKv) * adderPerKv;
  }

  // 3. Altitude Correction Factor
  let altitudeFactor = 1.0;
  let altitudeAdderM = 0;
  const elev = parseFloat(elevationMeters) || 0;
  if (elev > 1000) {
    const extraElev = elev - 1000;
    altitudeFactor = 1.0 + (0.03 * (extraElev / 300));
    altitudeAdderM = (baseClearanceM + voltageAdderM) * (altitudeFactor - 1.0);
  }

  // 4. Subtotal Required Clearance before sag/safety additions
  const rawRequiredClearanceM = (baseClearanceM + voltageAdderM) * altitudeFactor;

  // 5. Side-by-Side Sag Condition Analysis
  const thermalSag = parseFloat(thermalSagBufferMeters) || 0;
  const iceSag = parseFloat(iceWindSagBufferMeters) || 0;
  const safetyMargin = parseFloat(utilitySafetyMarginMeters) || 0;

  // Total required clearances for each condition
  const thermalTotalReqM = rawRequiredClearanceM + thermalSag + safetyMargin;
  const iceTotalReqM = rawRequiredClearanceM + iceSag + safetyMargin;

  // Governing condition is whichever requires greater clearance (larger sag buffer)
  const isIceGoverning = iceSag > thermalSag;
  const totalRequiredClearanceM = Math.max(thermalTotalReqM, iceTotalReqM);
  const governingCondition = isIceGoverning ? 'CSA Ice & Wind Weather Load' : 'Max Thermal Operating Sag';

  // 6. Actual Field Conductor Clearance Calculations
  const hAtt = parseFloat(attachmentHeightMeters) || 12.0;
  const sag = parseFloat(midspanSagMeters) || 2.5;
  const hObstacle = parseFloat(obstacleHeightMeters) || 0;

  // Conductor Lowest Point under base sag
  const baseConductorLowestPointM = hAtt - sag;

  // Thermal condition actual clearance
  const thermalLowestPointM = baseConductorLowestPointM - thermalSag;
  const thermalActualClearanceM = thermalLowestPointM - hObstacle;
  const thermalMarginM = thermalActualClearanceM - rawRequiredClearanceM - safetyMargin;

  // Ice condition actual clearance
  const iceLowestPointM = baseConductorLowestPointM - iceSag;
  const iceActualClearanceM = iceLowestPointM - hObstacle;
  const iceMarginM = iceActualClearanceM - rawRequiredClearanceM - safetyMargin;

  // Governing clearance margin
  const actualClearanceM = Math.min(thermalActualClearanceM, iceActualClearanceM);
  const clearanceMarginM = actualClearanceM - rawRequiredClearanceM - safetyMargin;
  const conductorLowestPointM = hAtt - sag - Math.max(thermalSag, iceSag);

  // 7. Compliance Status
  let status = 'PASS';
  if (clearanceMarginM < 0 && clearanceMarginM >= -0.3) {
    status = 'WARNING';
  } else if (clearanceMarginM < -0.3) {
    status = 'FAIL';
  }

  return {
    baseClearanceM,
    operatingVoltageKv: vKv,
    voltageAdderM,
    baseThresholdKv,
    adderPerKv,
    elevationMeters: elev,
    altitudeFactor,
    altitudeAdderM,
    rawRequiredClearanceM,
    thermalSagBufferMeters: thermalSag,
    iceWindSagBufferMeters: iceSag,
    csaLoadingZone,
    utilitySafetyMarginMeters: safetyMargin,
    thermalTotalReqM,
    iceTotalReqM,
    totalRequiredClearanceM,
    governingCondition,
    isIceGoverning,
    attachmentHeightMeters: hAtt,
    midspanSagMeters: sag,
    obstacleHeightMeters: hObstacle,
    conductorLowestPointM,
    thermalActualClearanceM,
    thermalMarginM,
    iceActualClearanceM,
    iceMarginM,
    actualClearanceM,
    clearanceMarginM,
    status,
    unit
  };
}
