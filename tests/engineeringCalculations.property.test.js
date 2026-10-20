import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { calculateModule2RPScaling, calculateModule3Physics } from '../src/utils/weatherCriteriaEngine.js';
import { calculateVerticalClearance } from '../src/core/clearance/clearanceEngine';
import { calculateWoodPoleStructural } from '../src/core/woodPole/woodPoleEngine';


describe('Engineering Calculation Harness - Property-Based & Fuzz Invariants', () => {
  it('scaling wind and ice returns finite positive numbers across valid return periods', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 10, max: 250, noNaN: true }),
        fc.float({ min: 1, max: 100, noNaN: true }),
        fc.constantFrom(25, 50, 100, 150, 200, 250, 500),
        (w50, t50, T) => {
          const res = calculateModule2RPScaling(w50, t50, T);
          expect(Number.isFinite(res.w_T)).toBe(true);
          expect(Number.isFinite(res.t_T)).toBe(true);
          expect(res.w_T).toBeGreaterThan(0);
          expect(res.t_T).toBeGreaterThan(0);
        }
      )
    );
  });

  it('physics calculations never produce NaN or infinite values', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 200, noNaN: true }), // wind km/h
        fc.float({ min: 0, max: 100, noNaN: true }), // ice mm
        fc.float({ min: 5, max: 60, noNaN: true }),  // conductor mm
        fc.boolean(),
        (w_T, t_T, dMm, isTransmission) => {
          const res = calculateModule3Physics(w_T, t_T, dMm, isTransmission);
          expect(Number.isFinite(res.q0_extreme)).toBe(true);
          expect(Number.isFinite(res.t_design)).toBe(true);
          expect(Number.isFinite(res.g_R)).toBe(true);
          expect(Number.isFinite(res.q0_C1)).toBe(true);
          expect(Number.isFinite(res.q0_C2)).toBe(true);
          expect(Number.isFinite(res.ice_C2)).toBe(true);
        }
      )
    );
  });

  it('vertical clearance calculation maintains monotonic margin invariant', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 10, max: 30, noNaN: true }), // attachment height
        fc.float({ min: 0.5, max: 5, noNaN: true }),  // sag
        (hAtt, sag) => {
          const res = calculateVerticalClearance({
            rowId: 'road_vehicular',
            operatingVoltageKv: 25,
            attachmentHeightM: hAtt,
            midspanSagM: sag
          });
          expect(Number.isFinite(res.result.actualClearanceM)).toBe(true);
          expect(Number.isFinite(res.result.clearanceMarginM)).toBe(true);
          expect(['PASS', 'MARGINAL', 'VIOLATION']).toContain(res.result.status);
        }
      )
    );
  });

  it('wood pole calculation computes finite utilization and recommended class', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('WC', 'DF', 'JP', 'LP', 'SP'),
        fc.float({ min: 9.0, max: 25.0, noNaN: true }),
        fc.constantFrom('1', '2', '3', '4', '5'),
        fc.constantFrom(1, 2, 3),
        (speciesCode, poleLengthM, poleClass, grade) => {
          const res = calculateWoodPoleStructural({
            speciesCode,
            poleLengthM,
            poleClass,
            grade
          });
          expect(Number.isFinite(res.moments.totalFactoredMomentKNm)).toBe(true);
          expect(Number.isFinite(res.moments.resistingMomentKNm)).toBe(true);
          expect(Number.isFinite(res.utilization.percent)).toBe(true);
          expect(typeof res.utilization.isPassing).toBe('boolean');
          expect(res.classification.recommendedClass).toBeDefined();
        }
      )
    );
  });

  it('dual-standard (CSA & ANSI) multi-segment wood pole engine preserves monotonic taper and finite buckling invariants', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('CSA', 'ANSI'),
        fc.constantFrom('WC', 'DF', 'JP', 'LP', 'SYP'),
        fc.float({ min: 10.0, max: 28.0, noNaN: true }),
        fc.constantFrom('H2', 'H1', '1', '2', '3', '4', '5'),
        fc.boolean(),
        fc.boolean(),
        (standard, speciesCode, poleLengthM, poleClass, enablePDelta, enableHeightAdjustment) => {
          const res = calculateWoodPoleStructural({
            standard,
            speciesCode,
            poleLengthM,
            poleClass,
            enablePDelta,
            enableHeightAdjustment
          });

          expect(res.elevationProfile.length).toBeGreaterThan(5);
          expect(Number.isFinite(res.buckling.criticalBucklingLoadLbs)).toBe(true);
          expect(res.buckling.criticalBucklingLoadLbs).toBeGreaterThan(0);
          expect(Number.isFinite(res.buckling.amplificationFactor)).toBe(true);
          expect(res.buckling.amplificationFactor).toBeGreaterThanOrEqual(1.0);

          for (let i = 1; i < res.elevationProfile.length; i++) {
            const prev = res.elevationProfile[i - 1];
            const curr = res.elevationProfile[i];
            expect(curr.diameterIn).toBeGreaterThanOrEqual(prev.diameterIn);
            expect(curr.sectionModulusIn3).toBeGreaterThanOrEqual(prev.sectionModulusIn3);
            expect(Number.isFinite(curr.usagePercent)).toBe(true);
          }
        }
      )
    );
  });
});
