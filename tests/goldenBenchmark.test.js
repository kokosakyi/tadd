import { describe, it, expect } from 'vitest';
import benchmarks from './fixtures/goldenBenchmarks.json';
import { calculateClimaticCriteria } from '../src/core/weather/weatherEngine';
import { calculateVerticalClearance } from '../src/core/clearance/clearanceEngine';
import { calculateWoodPoleStructural } from '../src/core/woodPole/woodPoleEngine';


describe('Golden Benchmark Verification Suite', () => {
  it('matches reference benchmark for climatic criteria scaling and load cases', () => {
    const { input, expected } = benchmarks.weatherCriteriaBenchmark;
    const result = calculateClimaticCriteria(input);

    expect(result.stationData.wind_50yr).toBe(expected.stationWind50);
    expect(result.stationData.ice_50yr).toBe(expected.stationIce50);
    expect(result.scalingResult.w_T).toBeCloseTo(expected.scaledWindWT, 1);
    expect(result.scalingResult.t_T).toBeCloseTo(expected.scaledIceTT, 1);
    expect(result.guardrailResult.governed_t_design).toBeCloseTo(expected.governedDesignIceMm, 2);
    expect(result.loadCaseMatrix.length).toBeGreaterThanOrEqual(expected.minimumCasesCount);
  });

  it('matches reference benchmark for vertical clearance calculation', () => {
    const { input, expected } = benchmarks.verticalClearanceBenchmark;
    const result = calculateVerticalClearance(input);

    expect(result.result.baseTableClearanceM).toBe(expected.baseTableClearanceM);
    expect(result.result.modifiersM).toBe(expected.modifiersM);
    expect(result.result.csaRequiredM).toBe(expected.csaRequiredM);
    expect(result.result.ownerBufferM).toBe(expected.ownerBufferM);
    expect(result.result.designRequiredClearanceM).toBe(expected.designRequiredClearanceM);
    expect(result.result.actualClearanceM).toBe(expected.actualClearanceM);
    expect(result.result.clearanceMarginM).toBe(expected.clearanceMarginM);
    expect(result.result.status).toBe(expected.status);
  });

  it('matches reference benchmark for wood pole structural loading', () => {
    const { input, expected } = benchmarks.woodPoleBenchmark;
    const result = calculateWoodPoleStructural(input);

    expect(result.utilization.isPassing).toBe(expected.isPassing);
    expect(result.classification.recommendedClass).toBe(expected.recommendedClass);
  });
});
