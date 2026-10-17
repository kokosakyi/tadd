/**
 * Core Domain & Calculation Trace Verification Script
 * Validates pure mathematical engines and audit trace record schemas.
 */

import { calculateVerticalClearance, UTILITY_OVERLAYS } from '../src/core/clearance/clearanceEngine.ts';
import { calculateClimaticCriteria, exportLoadCaseMatrixCsv } from '../src/core/weather/weatherEngine.ts';
import { calculateWoodPoleStructural } from '../src/core/woodPole/woodPoleEngine.ts';
import { searchCodeRegistry, CORE_CLAUSES, REGISTERED_TABLES } from '../src/core/code/codeLibraryRegistry.ts';


console.log('--- 1. Testing Code Library Registry ---');
const searchResult = searchCodeRegistry('Table 2');
console.log(`Found ${searchResult.clauses.length} clauses and ${searchResult.tables.length} tables matching 'Table 2'.`);
if (searchResult.tables.length === 0) throw new Error('Code registry search failed');

console.log('\n--- 2. Testing Clearance Engine & Trace ---');
const clearanceTest = calculateVerticalClearance({
  rowId: 'road_vehicular',
  operatingVoltageKv: 138,
  ownerOverlayId: 'hydro_one',
  attachmentHeightM: 14.0,
  midspanSagM: 3.0
});
console.log('Clearance Result Summary:');
console.log(`  Base Table 2: ${clearanceTest.result.baseTableClearanceM} m`);
console.log(`  CSA Required: ${clearanceTest.result.csaRequiredM} m`);
console.log(`  Owner Buffer: ${clearanceTest.result.ownerBufferM} m`);
console.log(`  Design Required: ${clearanceTest.result.designRequiredClearanceM} m`);
console.log(`  Actual Clearance: ${clearanceTest.result.actualClearanceM} m`);
console.log(`  Margin: ${clearanceTest.result.clearanceMarginM} m (${clearanceTest.result.status})`);
console.log(`  Trace Calc ID: ${clearanceTest.trace.calcId}`);
console.log(`  Trace Citations: ${clearanceTest.trace.citations.join('; ')}`);
if (!clearanceTest.trace.steps || clearanceTest.trace.steps.length === 0) throw new Error('Trace steps missing in clearance');

console.log('\n--- 3. Testing Weather Engine & Load Matrix ---');
const weatherTest = calculateClimaticCriteria({
  province: 'Ontario',
  location: 'Ottawa (City Hall)',
  returnPeriod: 150,
  district: 'Heavy'
});
console.log('Weather Criteria Result:');
console.log(`  Station: ${weatherTest.stationData.location} (50-yr Wind: ${weatherTest.stationData.wind_50yr} km/h, 50-yr Ice: ${weatherTest.stationData.ice_50yr} mm)`);
console.log(`  150-yr Scaled Wind: ${weatherTest.scalingResult.w_T} km/h, Scaled Ice: ${weatherTest.scalingResult.t_T} mm`);
console.log(`  Governed Ice: ${weatherTest.guardrailResult.governed_t_design} mm`);
console.log(`  Matrix Cases: ${weatherTest.loadCaseMatrix.length} cases generated`);
const csv = exportLoadCaseMatrixCsv(weatherTest.loadCaseMatrix);
console.log(`  CSV Export: ${csv.split('\r\n').length} rows generated.`);
if (weatherTest.loadCaseMatrix.length === 0) throw new Error('Matrix generation failed');

console.log('\n--- 4. Testing Wood Pole Loading Engine ---');
const poleTest = calculateWoodPoleStructural({
  speciesCode: 'WC',
  poleLengthM: 13.7,
  poleClass: '3',
  grade: 2
});
console.log('Wood Pole Result:');
console.log(`  Factored Moment: ${poleTest.moments.totalFactoredMomentKNm} kN*m`);
console.log(`  Resisting Moment: ${poleTest.moments.resistingMomentKNm} kN*m`);
console.log(`  Utilization: ${poleTest.utilization.percent}% (${poleTest.utilization.isPassing ? 'PASS' : 'OVERLOAD'})`);
console.log(`  Recommended Class: Class ${poleTest.classification.recommendedClass}`);
console.log(`  Trace Calc ID: ${poleTest.trace.calcId}`);
if (!poleTest.trace.calcId) throw new Error('Wood pole trace calcId missing');

console.log('\n>>> ALL CORE DOMAIN & TRACE ENGINE TESTS PASSED! <<<');
