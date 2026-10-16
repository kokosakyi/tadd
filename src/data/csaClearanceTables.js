/**
 * CSA C22.3 No. 1 Overhead Systems Baseline Clearance Tables
 * All clearance values in METERS (m).
 */

export const CSA_VOLTAGE_CLASSES = [
  { id: 'lv', name: 'Low Voltage (< 750 V)', nominalKv: 0.6, isHv: false, defaultBaseKv: 0.6 },
  { id: 'dist_4k', name: 'Distribution 4.16 kV', nominalKv: 4.16, isHv: false, defaultBaseKv: 4.16 },
  { id: 'dist_12k', name: 'Distribution 12.47 kV / 13.8 kV', nominalKv: 12.47, isHv: false, defaultBaseKv: 12.47 },
  { id: 'dist_25k', name: 'Distribution 24.9 kV / 25 kV', nominalKv: 25, isHv: false, defaultBaseKv: 25 },
  { id: 'dist_34k', name: 'Distribution 34.5 kV / 44 kV', nominalKv: 44, isHv: false, defaultBaseKv: 44 },
  { id: 'trans_69k', name: 'Transmission 69 kV', nominalKv: 69, isHv: true, defaultBaseKv: 69 },
  { id: 'trans_115k', name: 'Transmission 115 kV / 138 kV', nominalKv: 138, isHv: true, defaultBaseKv: 138 },
  { id: 'trans_230k', name: 'Transmission 230 kV', nominalKv: 230, isHv: true, defaultBaseKv: 230 },
  { id: 'trans_500k', name: 'Transmission 500 kV', nominalKv: 500, isHv: true, defaultBaseKv: 500 },
  { id: 'custom', name: 'Custom Voltage (User Specified)', nominalKv: 115, isHv: true, defaultBaseKv: 115 }
];

export const CROSSING_CATEGORIES = [
  {
    id: 'road_truck',
    title: 'Highways, Roads, Streets & Truck Traffic Areas',
    description: 'Highways, major roads, streets, alleys, and commercial parking areas subject to truck traffic',
    type: 'ground',
    baseClearances: {
      lv: 5.2,
      dist_4k: 5.5,
      dist_12k: 5.5,
      dist_25k: 5.5,
      dist_34k: 5.8,
      trans_69k: 6.1,
      trans_115k: 6.5,
      trans_230k: 7.2,
      trans_500k: 9.0
    }
  },
  {
    id: 'driveway_car',
    title: 'Driveways, Entrances & Passenger Parking',
    description: 'Residential driveways, private entrances, and parking lots restricted to passenger cars',
    type: 'ground',
    baseClearances: {
      lv: 4.5,
      dist_4k: 5.0,
      dist_12k: 5.0,
      dist_25k: 5.0,
      dist_34k: 5.3,
      trans_69k: 5.7,
      trans_115k: 6.1,
      trans_230k: 6.8,
      trans_500k: 8.6
    }
  },
  {
    id: 'pedestrian',
    title: 'Pedestrian Spaces & Walkways Only',
    description: 'Spaces accessible to pedestrians only (no vehicular traffic)',
    type: 'ground',
    baseClearances: {
      lv: 3.5,
      dist_4k: 4.3,
      dist_12k: 4.3,
      dist_25k: 4.3,
      dist_34k: 4.6,
      trans_69k: 5.0,
      trans_115k: 5.4,
      trans_230k: 6.1,
      trans_500k: 7.9
    }
  },
  {
    id: 'railway',
    title: 'Railway Tracks (Top of Rail)',
    description: 'Mainline railway tracks, siding tracks, and rail corridors',
    type: 'ground',
    baseClearances: {
      lv: 7.0,
      dist_4k: 7.5,
      dist_12k: 7.5,
      dist_25k: 7.5,
      dist_34k: 7.8,
      trans_69k: 8.2,
      trans_115k: 8.6,
      trans_230k: 9.3,
      trans_500k: 11.1
    }
  },
  {
    id: 'waterway',
    title: 'Navigable Waterways & Water Bodies',
    description: 'Rivers, lakes, and coastal waters subject to boat traffic',
    type: 'ground',
    baseClearances: {
      lv: 6.0,
      dist_4k: 6.5,
      dist_12k: 6.5,
      dist_25k: 6.5,
      dist_34k: 6.8,
      trans_69k: 7.2,
      trans_115k: 7.6,
      trans_230k: 8.3,
      trans_500k: 10.1
    }
  },
  {
    id: 'building_roof',
    title: 'Buildings & Roofs (Accessible)',
    description: 'Vertical clearance over roofs accessible to pedestrians',
    type: 'structure',
    baseClearances: {
      lv: 3.0,
      dist_4k: 3.5,
      dist_12k: 3.5,
      dist_25k: 3.5,
      dist_34k: 4.0,
      trans_69k: 4.2,
      trans_115k: 4.8,
      trans_230k: 5.8,
      trans_500k: 7.6
    }
  },
  {
    id: 'building_wall',
    title: 'Building Walls, Windows & Balconies',
    description: 'Horizontal clearance to building walls, windows, fire escapes',
    type: 'structure',
    baseClearances: {
      lv: 1.5,
      dist_4k: 2.0,
      dist_12k: 2.0,
      dist_25k: 2.0,
      dist_34k: 2.5,
      trans_69k: 2.8,
      trans_115k: 3.4,
      trans_230k: 4.4,
      trans_500k: 6.2
    }
  },
  {
    id: 'line_crossing',
    title: 'Power Line to Power Line Crossing',
    description: 'Vertical clearance at wire crossing between supply lines',
    type: 'crossing',
    baseClearances: {
      lv: 1.2,
      dist_4k: 1.8,
      dist_12k: 1.8,
      dist_25k: 1.8,
      dist_34k: 2.0,
      trans_69k: 2.2,
      trans_115k: 2.6,
      trans_230k: 3.2,
      trans_500k: 4.8
    }
  },
  {
    id: 'joint_telecom',
    title: 'Supply Line to Communication Line (Joint Use)',
    description: 'Vertical separation between lowest power supply conductor & communication line on shared pole',
    type: 'joint_use',
    baseClearances: {
      lv: 1.0,
      dist_4k: 1.5,
      dist_12k: 1.5,
      dist_25k: 1.5,
      dist_34k: 1.8,
      trans_69k: 2.0,
      trans_115k: 2.4,
      trans_230k: 3.0,
      trans_500k: 4.5
    }
  }
];

export const UTILITY_PRESETS = [
  {
    id: 'csa_std',
    name: 'CSA C22.3 No. 1 Baseline (Standard)',
    description: 'Standard Canadian Standards Association C22.3 Overhead Systems values',
    adderPerKv: 0.010, // 10 mm per kV above 50 kV
    baseVoltageThresholdKv: 50
  },
  {
    id: 'hydro_one',
    name: 'Hydro One (Ontario Standard)',
    description: 'Hydro One Transmission & Distribution Standard clearance additions (+0.3m safety margin)',
    adderPerKv: 0.0105,
    baseVoltageThresholdKv: 50
  },
  {
    id: 'bc_hydro',
    name: 'BC Hydro Standard',
    description: 'BC Hydro Overhead Design Standard (includes mountainous terrain snow/sag margin)',
    adderPerKv: 0.011,
    baseVoltageThresholdKv: 50
  },
  {
    id: 'epcor_fortis',
    name: 'EPCOR / FortisAlberta Standard',
    description: 'Alberta Utility Overhead Distribution & Transmission Guidelines',
    adderPerKv: 0.010,
    baseVoltageThresholdKv: 50
  }
];
