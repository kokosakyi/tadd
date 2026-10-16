import { describe, it, expect } from 'vitest';
import { calculateVerticalClearance } from '../src/core/clearance/clearanceEngine.js';
import { calculateClimaticCriteria, exportLoadCaseMatrixCsv } from '../src/core/weather/weatherEngine.js';
import { calculateWoodPoleStructural } from '../src/core/woodPole/woodPoleEngine.js';
import { searchCodeRegistry } from '../src/core/code/codeLibraryRegistry.js';

describe('Core Verification Test Suite', () => {
  it('searches Code Library Registry properly', () => {
    const searchResult = searchCodeRegistry('Table 2');
    expect(searchResult.clauses.length).toBeGreaterThan(0);
    expect(searchResult.tables.length).toBeGreaterThan(0);
  });

  it('calculates vertical clearance and generates calculation audit trace', () => {
    const clearanceTest = calculateVerticalClearance({
      rowId: 'road_vehicular',
      operatingVoltageKv: 138,
      ownerOverlayId: 'hydro_one',
      attachmentHeightM: 14.0,
      midspanSagM: 3.0
    });

    expect(clearanceTest.result.baseTableClearanceM).toBeGreaterThan(0);
    expect(clearanceTest.result.csaRequiredM).toBeGreaterThan(0);
    expect(clearanceTest.result.actualClearanceM).toBe(10.5);
    expect(clearanceTest.result.status).toBeDefined();
    expect(clearanceTest.trace.calcId).toBeDefined();
    expect(clearanceTest.trace.steps.length).toBeGreaterThan(0);
  });

  it('calculates climatic criteria and exports valid load case matrix', () => {
    const weatherTest = calculateClimaticCriteria({
      province: 'Ontario',
      location: 'Ottawa (City Hall)',
      returnPeriod: 150,
      district: 'Heavy'
    });

    expect(weatherTest.stationData.location).toBe('Ottawa (City Hall)');
    expect(weatherTest.scalingResult.w_T).toBeGreaterThan(0);
    expect(weatherTest.scalingResult.t_T).toBeGreaterThan(0);
    expect(weatherTest.guardrailResult.governed_t_design).toBeGreaterThan(0);
    expect(weatherTest.loadCaseMatrix.length).toBeGreaterThan(0);

    const csv = exportLoadCaseMatrixCsv(weatherTest.loadCaseMatrix);
    expect(csv.split('\r\n').length).toBeGreaterThan(1);
  });

  it('calculates wood pole loading and verifies structural margins', () => {
    const poleTest = calculateWoodPoleStructural({
      speciesCode: 'WC',
      poleLengthM: 13.7,
      poleClass: '3',
      grade: 2
    });

    expect(poleTest.moments.totalFactoredMomentKNm).toBeGreaterThan(0);
    expect(poleTest.moments.resistingMomentKNm).toBeGreaterThan(0);
    expect(poleTest.utilization.percent).toBeGreaterThan(0);
    expect(poleTest.classification.recommendedClass).toBeDefined();
    expect(poleTest.trace.calcId).toBeDefined();
  });
});
