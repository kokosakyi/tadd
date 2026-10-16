/**
 * Load Case Matrix Generator
 * Generates unified deterministic (CSA C22.3 No. 1) and reliability-based (CSA C22.3 No. 60826) load cases.
 */

export function generateUnifiedLoadCaseMatrix({
  district = 'Heavy',
  deterministicWindPa = 400,
  deterministicIceMm = 12.5,
  minJanTempC = -20,
  maxConductorTempC = 100,
  r_T_wind_kmh = 105,
  r_T_ice_mm = 32,
  returnPeriod = 150,
  grade = 2
}) {
  // OCFs
  const ocfWind = grade === 1 ? 2.20 : grade === 2 ? 1.65 : 1.30;
  const ocfWire = grade === 1 ? 1.65 : grade === 2 ? 1.30 : 1.10;
  const ocfVert = grade === 1 ? 2.00 : grade === 2 ? 1.50 : 1.20;

  return [
    {
      id: 'LC-DET-01',
      code: 'CSA C22.3 No. 1 Cl. 7.4',
      name: `${district} Loading District (Wind + Ice)`,
      description: 'Prescribed regional loading with Overload Capacity Factors',
      type: 'Deterministic Strength',
      iceMm: deterministicIceMm,
      windPa: deterministicWindPa,
      tempC: -20,
      ocf: `Transverse: ${ocfWind}x / Vert: ${ocfVert}x`,
      governingUse: 'Structure & hardware ultimate strength'
    },
    {
      id: 'LC-DET-02',
      code: 'CSA C22.3 No. 1 Table 3',
      name: 'Maximum Conductor Operating Temperature',
      description: 'Thermal maximum sag without wind or ice',
      type: 'Deterministic Clearance',
      iceMm: 0,
      windPa: 0,
      tempC: maxConductorTempC,
      ocf: '1.0x (Serviceability)',
      governingUse: 'Vertical ground & highway clearance'
    },
    {
      id: 'LC-DET-03',
      code: 'CSA C22.3 No. 1 Cl. 5.3',
      name: 'Maximum Radial Ice Sag',
      description: 'Full regional ice sag at 0 °C without wind',
      type: 'Deterministic Clearance',
      iceMm: deterministicIceMm,
      windPa: 0,
      tempC: 0,
      ocf: '1.0x (Serviceability)',
      governingUse: 'Vertical clearance under ice loading'
    },
    {
      id: 'LC-DET-04',
      code: 'CSA C22.3 No. 1 Cl. 5.4',
      name: 'Extreme Wind Blowout / Displacement',
      description: 'Bare conductor blown out under wind pressure',
      type: 'Deterministic Clearance',
      iceMm: 0,
      windPa: deterministicWindPa,
      tempC: 15,
      ocf: '1.0x (Serviceability)',
      governingUse: 'Horizontal clearance to buildings & signs'
    },
    {
      id: 'LC-RBD-01',
      code: 'CSA C22.3 No. 60826 Cl. 6.2',
      name: `Extreme Wind (${returnPeriod}-yr Return Period)`,
      description: 'Statistical reference wind speed without ice',
      type: 'Reliability-Based Strength',
      iceMm: 0,
      windPa: Math.round(0.049 * Math.pow(r_T_wind_kmh, 2)),
      tempC: minJanTempC,
      ocf: 'γ_w = 1.0, Φ_R per component',
      governingUse: 'Extreme wind structural bending & insulator swing'
    },
    {
      id: 'LC-RBD-02',
      code: 'CSA C22.3 No. 60826 Cl. 6.3',
      name: `High-Probability Ice (${returnPeriod}-yr Return Period)`,
      description: 'Scaled radial ice accretion with low-speed coincident wind',
      type: 'Reliability-Based Strength',
      iceMm: r_T_ice_mm,
      windPa: Math.round(0.049 * Math.pow(0.4 * r_T_wind_kmh, 2)),
      tempC: -5,
      ocf: 'γ_i = 1.0, Φ_R per component',
      governingUse: 'Heavy ice vertical load & longitudinal imbalance'
    },
    {
      id: 'LC-RBD-03',
      code: 'CSA C22.3 No. 60826 Cl. 6.4',
      name: 'Reduced Ice + High Coincident Wind (Combined)',
      description: '50% glaze ice mass with 60% design wind speed',
      type: 'Reliability-Based Strength',
      iceMm: Math.round(r_T_ice_mm * 0.7),
      windPa: Math.round(0.049 * Math.pow(0.6 * r_T_wind_kmh, 2)),
      tempC: -5,
      ocf: 'γ_comb = 1.0, Φ_R per component',
      governingUse: 'Combined transverse and vertical combined load'
    },
    {
      id: 'LC-RBD-04',
      code: 'CSA C22.3 No. 60826 Cl. 6.2.4',
      name: 'Extreme Cold & Coincident Wind (Short Spans)',
      description: 'Absolute minimum January temperature (1% exclusion) + 60% design wind',
      type: 'Reliability-Based Tension',
      iceMm: 0,
      windPa: Math.round(0.049 * Math.pow(0.6 * r_T_wind_kmh, 2)),
      tempC: minJanTempC,
      ocf: '1.0x (Initial stringing tension check)',
      governingUse: 'Maximum conductor tension & uplift'
    }
  ];
}

/**
 * Export load case matrix as CSV format
 */
export function exportLoadCasesToCsv(loadCases) {
  const headers = ['Case ID', 'Standard Code', 'Case Name', 'Type', 'Radial Ice (mm)', 'Wind Pressure (Pa)', 'Temperature (°C)', 'Load Factors / OCF', 'Governing Application'];
  const rows = loadCases.map((c) => [
    `"${c.id}"`,
    `"${c.code}"`,
    `"${c.name}"`,
    `"${c.type}"`,
    c.iceMm,
    c.windPa,
    c.tempC,
    `"${c.ocf}"`,
    `"${c.governingUse}"`
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
