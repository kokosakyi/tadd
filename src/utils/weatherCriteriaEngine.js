import geoData from '../data/csaGeoDatabase.json' with { type: 'json' };

// Return Period Scaling Multipliers (CSA 60826-10 Table CA.2)
export const RETURN_PERIOD_FACTORS = {
  25:  { Tw: 0.93, Ti: 0.85, name: 'Lighter / Temporary (25-Yr)' },
  50:  { Tw: 1.00, Ti: 1.00, name: 'Baseline / Standard (50-Yr)' },
  100: { Tw: 1.05, Ti: 1.12, name: 'High Reliability (100-Yr)' },
  150: { Tw: 1.10, Ti: 1.20, name: 'Very High Reliability (150-Yr)' },
  500: { Tw: 1.22, Ti: 1.42, name: 'Critical Infrastructure (500-Yr)' }
};

// Deterministic Baseline Legal Minimums (CSA C22.3 No. 1-15 Table 30)
export const DETERMINISTIC_MINIMUMS = {
  'Severe':   { minIceMm: 19.0, minWindPa: 400.0, tempC: -20 },
  'Heavy':    { minIceMm: 12.5, minWindPa: 400.0, tempC: -20 },
  'Medium A': { minIceMm: 6.5,  minWindPa: 400.0, tempC: -20 },
  'Medium B': { minIceMm: 12.5, minWindPa: 300.0, tempC: -20 }
};

/**
 * MODULE 1: Query Geoclimatic Location Database
 */
export function queryModule1GeoDB(province, cityName) {
  if (!province || !geoData.provinces[province]) {
    return null;
  }
  const cityList = geoData.provinces[province];
  const cityObj = cityList.find(c => c.location.toLowerCase() === cityName.toLowerCase());
  
  if (!cityObj) return null;

  // Ground snow depth check (CSA C22.3 No. 1 Clause 5.3.1.1)
  const snowDepth = cityObj.ground_snow_depth ?? 0.6; // Default to 0.6m if unlisted
  const isHeavySnowArea = snowDepth > 0.5;

  // Default district mapping heuristics
  let defaultDistrict = cityObj.loading_district || 'Heavy';
  if (['Alberta', 'Saskatchewan', 'Manitoba'].includes(province) && !cityObj.loading_district) {
    defaultDistrict = 'Medium B';
  }

  return {
    ...cityObj,
    province,
    snowDepth,
    isHeavySnowArea,
    loadingDistrict: defaultDistrict
  };
}

/**
 * MODULE 2: Return Period Weather Scaling
 * Applies scaling factors from CSA 60826-10 Table CA.2
 * Uses linear interpolation for non-standard return periods.
 */
export function calculateModule2RPScaling(w50, t50, returnPeriod = 50) {
  let Tw, Ti;

  if (RETURN_PERIOD_FACTORS[returnPeriod]) {
    Tw = RETURN_PERIOD_FACTORS[returnPeriod].Tw;
    Ti = RETURN_PERIOD_FACTORS[returnPeriod].Ti;
  } else {
    // Perform linear interpolation
    const periods = Object.keys(RETURN_PERIOD_FACTORS).map(Number).sort((a, b) => a - b);
    
    // Bounds check
    if (returnPeriod < periods[0]) {
      Tw = RETURN_PERIOD_FACTORS[periods[0]].Tw;
      Ti = RETURN_PERIOD_FACTORS[periods[0]].Ti;
    } else if (returnPeriod > periods[periods.length - 1]) {
      Tw = RETURN_PERIOD_FACTORS[periods[periods.length - 1]].Tw;
      Ti = RETURN_PERIOD_FACTORS[periods[periods.length - 1]].Ti;
    } else {
      // Find interpolation bounds
      for (let i = 0; i < periods.length - 1; i++) {
        const k1 = periods[i];
        const k2 = periods[i + 1];
        if (returnPeriod > k1 && returnPeriod < k2) {
          const v1 = RETURN_PERIOD_FACTORS[k1];
          const v2 = RETURN_PERIOD_FACTORS[k2];
          const fraction = (returnPeriod - k1) / (k2 - k1);
          Tw = v1.Tw + fraction * (v2.Tw - v1.Tw);
          Ti = v1.Ti + fraction * (v2.Ti - v1.Ti);
          break;
        }
      }
    }
  }

  const w_T = w50 * Tw;
  const t_T = t50 * Ti;
  
  return {
    w_T,
    t_T,
    Tw,
    Ti,
    returnPeriod
  };
}

/**
 * MODULE 3: Reliability Physics Engine
 */
export function calculateModule3Physics(w_T, t_T, condDiameterMm = 28.14, isTransmission = true) {
  // 1. Dynamic Wind-Only Pressure (q0) - tau = 1.04
  const q0_extreme = 0.5 * (1.225 * 1.04) * Math.pow(w_T / 3.6, 2);

  // 2. Spatial and Height Adjusted Design Ice (t_design)
  const sa = 1.3;
  const kh = isTransmission ? 1.15 : 1.0;
  const combinedMultiplier = sa * kh;
  const t_design = t_T * combinedMultiplier;

  // 3. Radial Ice Weight (g_R) in N/m (density = 900 kg/m³)
  const g_R = 0.0277 * t_design * (t_design + condDiameterMm);
  const d_C1 = condDiameterMm + 2 * t_design;

  // 4. Coincident Wind-on-Ice Cases (tau = 1.10 for glaze ice)
  // Case C1: Heavy Ice + 40% Wind
  const wind_C1 = 0.4 * w_T;
  const q0_C1 = 0.5 * (1.225 * 1.10) * Math.pow(wind_C1 / 3.6, 2);
  const ice_C1 = t_design;
  const weight_C1 = g_R;

  // Case C2: 50% Ice Weight + 60% Wind
  const wind_C2 = 0.6 * w_T;
  const q0_C2 = 0.5 * (1.225 * 1.10) * Math.pow(wind_C2 / 3.6, 2);
  const weight_C2 = 0.5 * g_R;
  
  // Back-calculate reduced ice thickness for C2:
  // 0.0277 * t_H^2 + 0.0277 * d * t_H - weight_C2 = 0
  const ice_C2 = 0.5 * (Math.sqrt(Math.pow(condDiameterMm, 2) + (4 * weight_C2 / 0.0277)) - condDiameterMm);
  const d_C2 = condDiameterMm + 2 * ice_C2;

  return {
    w_T,
    t_T,
    condDiameterMm,
    isTransmission,
    sa,
    kh,
    combinedMultiplier,
    q0_extreme,
    t_design,
    g_R,
    wind_C1,
    q0_C1,
    ice_C1,
    weight_C1,
    d_C1,
    wind_C2,
    q0_C2,
    ice_C2,
    weight_C2,
    d_C2
  };
}

/**
 * MODULE 4: Deterministic Legal Minimum Guardrail
 */
export function applyModule4Guardrail(physicsResults, district = 'Heavy') {
  const mins = DETERMINISTIC_MINIMUMS[district] || DETERMINISTIC_MINIMUMS['Heavy'];
  
  const governed_q0 = Math.max(physicsResults.q0_extreme, mins.minWindPa);
  const governed_t_design = Math.max(physicsResults.t_design, mins.minIceMm);

  const windGovernedByLegal = mins.minWindPa > physicsResults.q0_extreme;
  const iceGovernedByLegal = mins.minIceMm > physicsResults.t_design;

  return {
    ...physicsResults,
    district,
    governed_q0,
    governed_t_design,
    windGovernedByLegal,
    iceGovernedByLegal,
    minWindPa: mins.minWindPa,
    minIceMm: mins.minIceMm,
    tempC: mins.tempC || -20
  };
}

/**
 * MODULE 5: Aeolian Vibration & Catenary Limits (CSA C22.3 No. 1-15 Clauses 8.7.3 & Table 33/34)
 */
export function calculateModule5TensionLimits(
  rulingSpanM = 250,
  hasDampers = true,
  isBundled = false,
  rtsKn = 140.0,
  conductorWeightNm = 15.9
) {
  // 1. Base Catenary Parameter Limit (Clause 8.7.3)
  let baseCatenary = 1200;
  if (hasDampers) {
    baseCatenary = isBundled ? 2200 : 2000;
  }

  // 2. Short-Span Reduction Table 33 (CSA C22.3 No. 1-15)
  let maxCatenary = baseCatenary;
  let spanReductionApplied = false;

  if (hasDampers) {
    if (rulingSpanM > 400) maxCatenary = baseCatenary;
    else if (rulingSpanM > 350) maxCatenary = Math.min(baseCatenary, 1900);
    else if (rulingSpanM > 300) maxCatenary = Math.min(baseCatenary, 1800);
    else if (rulingSpanM > 250) maxCatenary = Math.min(baseCatenary, 1700);
    else if (rulingSpanM > 200) maxCatenary = Math.min(baseCatenary, 1600);
    else if (rulingSpanM > 150) maxCatenary = Math.min(baseCatenary, 1500);
    else if (rulingSpanM > 100) maxCatenary = Math.min(baseCatenary, 1400);
    else maxCatenary = Math.min(baseCatenary, 1300);

    if (maxCatenary < baseCatenary) {
      spanReductionApplied = true;
    }
  }

  // 3. Tension Limit Calculations (kN & % RTS)
  const aeolianTensionLimitKn = (maxCatenary * conductorWeightNm) / 1000.0;
  
  const maxLoadedRtsPercent = 60.0;
  const maxLoadedTensionKn = (maxLoadedRtsPercent / 100.0) * rtsKn;

  const maxInitialUnloadedRtsPercent = 20.0;
  const maxInitialUnloadedTensionKn = (maxInitialUnloadedRtsPercent / 100.0) * rtsKn;

  const maxFinalUnloadedRtsPercent = 15.0;
  const maxFinalUnloadedTensionKn = (maxFinalUnloadedRtsPercent / 100.0) * rtsKn;

  const maxCreepRtsPercent = 75.0;
  const maxCreepTensionKn = (maxCreepRtsPercent / 100.0) * rtsKn;

  return {
    rulingSpanM,
    hasDampers,
    isBundled,
    rtsKn,
    conductorWeightNm,
    baseCatenary,
    maxCatenary,
    spanReductionApplied,
    aeolianTensionLimitKn,
    maxLoadedRtsPercent,
    maxLoadedTensionKn,
    maxInitialUnloadedRtsPercent,
    maxInitialUnloadedTensionKn,
    maxFinalUnloadedRtsPercent,
    maxFinalUnloadedTensionKn,
    maxCreepRtsPercent,
    maxCreepTensionKn
  };
}

/**
 * Helper to dynamically format ASCII tables for PLS-CADD criteria files with clean vertical alignment
 */
function formatCriTable(headers, rows) {
  const colWidths = headers.map((header, colIdx) => {
    const headerTitle = colIdx === 0 ? '; ' + header : header;
    let maxLen = headerTitle.length;
    for (const row of rows) {
      const valStr = row[colIdx] !== undefined && row[colIdx] !== null ? String(row[colIdx]) : '';
      if (valStr.length > maxLen) {
        maxLen = valStr.length;
      }
    }
    return maxLen + 3; // 3 spaces minimum padding between columns
  });

  const headerLine = headers.map((header, colIdx) => {
    const title = colIdx === 0 ? '; ' + header : header;
    if (colIdx === headers.length - 1) return title;
    return title.padEnd(colWidths[colIdx], ' ');
  }).join('');

  const dataLines = rows.map(row => {
    return row.map((val, colIdx) => {
      const str = val !== undefined && val !== null ? String(val) : '';
      if (colIdx === headers.length - 1) return str;
      return str.padEnd(colWidths[colIdx], ' ');
    }).join('');
  });

  return [headerLine, ...dataLines].join('\n');
}

/**
 * MODULE 6: Generate Formatted PLS-CADD .cri Text Block
 */
export function generateModule6CriText(inputs, calculations) {
  const { cityData, returnPeriod, conductor } = inputs;
  const { scaling, governed, tension } = calculations;

  const locationName = cityData ? cityData.location : 'Generic Location';
  const province = cityData ? cityData.province : 'Canada';
  const minTemp = cityData ? cityData.min_temp : -25;
  const iceC1Cm = (governed.governed_t_design / 10.0).toFixed(2);
  const iceC2Cm = (governed.ice_C2 / 10.0).toFixed(2);

  const weatherHeaders = [
    'Description',
    'Q Factor',
    'Wind Velocity (km/h)',
    'Radial Ice (cm)',
    'Ice Density (g/cm3)',
    'Wire Temp (C)',
    'GRF',
    'Wind Model'
  ];
  const weatherRows = [
    [`'${returnPeriod}Yr Extreme Wind'`, '0.049', scaling.w_T.toFixed(2), '0.00', '0.00', '-10.0', '1.0', "'CAN/CSA-C22.3 No. 60826-10'"],
    ["'C1: Heavy Ice + Wind'", '0.049', governed.wind_C1.toFixed(2), iceC1Cm, '0.90', '-10.0', '1.0', "'CAN/CSA-C22.3 No. 60826-10'"],
    ["'C2: Red. Ice + Wind'", '0.049', governed.wind_C2.toFixed(2), iceC2Cm, '0.90', '-10.0', '1.0', "'CAN/CSA-C22.3 No. 60826-10'"],
    ["'Everyday Cold (Jan)'", '0.049', '0.00', '0.00', '0.00', minTemp.toFixed(1), '1.0', "'None'"]
  ];

  const structureHeaders = [
    'Description',
    'Weather Case Name',
    'Cable Condition',
    'LFV',
    'LFW',
    'LFT',
    'LFS',
    'Steel Mult',
    'Wood Mult',
    'Wind Model'
  ];
  const structureRows = [
    ["'Extreme Wind Case'", `'${returnPeriod}Yr Extreme Wind'`, "'Initial FE'", '1.0', '1.0', '1.0', '1.0', '1.00', '0.75', "'CAN/CSA-C22.3 No. 60826-10'"],
    ["'Combined C1 Case'", "'C1: Heavy Ice + Wind'", "'Initial FE'", '1.0', '1.0', '1.0', '1.0', '1.00', '0.75', "'CAN/CSA-C22.3 No. 60826-10'"],
    ["'Combined C2 Case'", "'C2: Red. Ice + Wind'", "'Initial FE'", '1.0', '1.0', '1.0', '1.0', '1.00', '0.75', "'CAN/CSA-C22.3 No. 60826-10'"]
  ];

  const tensionHeaders = [
    'Weather Case',
    'Cable Condition',
    'Max Tension (% RTS)',
    'Max Catenary Constant (m)'
  ];
  const tensionRows = [
    ["'C1: Heavy Ice + Wind'", "'Initial FE'", tension.maxLoadedRtsPercent.toFixed(1), '0.0'],
    ["'C2: Red. Ice + Wind'", "'Initial FE'", tension.maxLoadedRtsPercent.toFixed(1), '0.0'],
    [`'${returnPeriod}Yr Extreme Wind'`, "'Initial FE'", tension.maxLoadedRtsPercent.toFixed(1), '0.0'],
    ["'Everyday Cold (Jan)'", "'Initial FE'", tension.maxInitialUnloadedRtsPercent.toFixed(1), tension.maxCatenary.toFixed(1)],
    ["'Everyday Cold (Jan)'", "'Creep FE'", tension.maxFinalUnloadedRtsPercent.toFixed(1), tension.maxCatenary.toFixed(1)]
  ];

  return `; =====================================================================
; PLS-CADD CRITERIA FILE (.CRI)
; GENERATED BY T&D CSA WEATHER CRITERIA ENGINE
; PROVENANCE: Location=${locationName} (${province}), Elev=${cityData?.elevation || 0}m, Lat=${cityData?.latitude || 0}, Long=${cityData?.longitude || 0}
; CODE BASIS: CAN/CSA-C22.3 No. 60826-10 & CSA C22.3 No. 1-15
; TARGET RELIABILITY: ${returnPeriod}-Year Return Period (Tw=${scaling.Tw}, Ti=${scaling.Ti})
; GOVERNING DISTRICT: ${governed.district || 'Heavy'} District (Min Ice=${governed.minIceMm}mm, Min Wind=${governed.minWindPa}Pa)
; =====================================================================

WEATHER_CASES
${formatCriTable(weatherHeaders, weatherRows)}

STRUCTURE_LOADS
${formatCriTable(structureHeaders, structureRows)}

CABLE_TENSION_LIMITS
${formatCriTable(tensionHeaders, tensionRows)}
`;
}
