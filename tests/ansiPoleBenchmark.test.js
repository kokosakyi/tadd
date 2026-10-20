import { describe, it, expect } from 'vitest';
import {
  calculateWoodPoleStructural,
  getAllAnsiSpecies,
  getAllO15Species
} from '../src/core/woodPole/woodPoleEngine';

describe('Dual-Standard Wood Pole Engine — ANSI O5.1 / ASCE 141 & CSA Verification', () => {
  const asceAppendixBInput = {
    standard: 'ANSI',
    loadInputMode: 'direct_loads',
    speciesCode: 'DF',
    poleClass: 'H1',
    poleLengthFt: 75.0,
    embedmentFt: 9.5,
    tipCircumferenceIn: 29.0,
    buttCircumference6ftIn: 55.5,
    strengthFactorPhi: 0.671,
    enablePDelta: true,
    enableHeightAdjustment: true,
    windPressurePsf: 19.97,
    numSegments: 25,
    attachments: [
      { name: 'Load 1', heightM: 19.66, count: 1, diameterMm: 10, tensionN: 0, distFromTipFt: 1.0, transverseForceLbs: 265, verticalForceLbs: 137, eccentricityFt: 0.5 },
      { name: 'Load 2', heightM: 18.14, count: 1, diameterMm: 20, tensionN: 0, distFromTipFt: 6.0, transverseForceLbs: 792, verticalForceLbs: 546, eccentricityFt: 5.5 },
      { name: 'Load 3', heightM: 16.61, count: 1, diameterMm: 20, tensionN: 0, distFromTipFt: 11.0, transverseForceLbs: 792, verticalForceLbs: 546, eccentricityFt: -5.5 },
      { name: 'Load 4', heightM: 15.09, count: 1, diameterMm: 20, tensionN: 0, distFromTipFt: 16.0, transverseForceLbs: 792, verticalForceLbs: 546, eccentricityFt: 5.5 }
    ]
  };

  it('reproduces ASCE Manual of Practice 141 / ANSI O5.1 Appendix B 75ft H1 Douglas Fir benchmark', () => {
    const res = calculateWoodPoleStructural(asceAppendixBInput);

    // 1. Tapered Geometry Checks
    expect(res.geometry.heightAboveGroundFt).toBeCloseTo(65.5, 2);
    expect(res.geometry.tipDiameterIn).toBeCloseTo(9.231, 2);
    expect(res.geometry.buttDiameter6ftIn).toBeCloseTo(17.666, 2);
    expect(res.geometry.taperInPerFt).toBeCloseTo(0.12225, 4);
    expect(res.geometry.groundlineDiameterIn).toBeCloseTo(17.239, 2);

    // 2. Material 5% Lower Exclusion Limit Check
    expect(res.species.fiberStressPsi).toBe(8000);
    expect(res.species.mor5PctPsi).toBeCloseTo(5368, 0);

    // 3. Gere-Carter Column Buckling & P-Delta Amplification Checks
    expect(res.buckling.effectiveDiameterIn).toBeCloseTo(12.614, 2);
    expect(res.buckling.effectiveInertiaIn4).toBeCloseTo(1243, 0);
    expect(res.buckling.taperFactorPStar).toBeCloseTo(5.404, 2);
    expect(res.buckling.criticalBucklingLoadLbs).toBeGreaterThan(63700);
    expect(res.buckling.criticalBucklingLoadLbs).toBeLessThan(63900);
    expect(res.buckling.amplificationFactor).toBeCloseTo(1.101, 3);

    // 4. Critical Section Identification (z = 45 ft, H = 20.5 ft above groundline)
    expect(res.criticalSection.distFromTipFt).toBe(45.0);
    expect(res.criticalSection.heightAboveGlFt).toBe(20.5);
    expect(res.utilization.isCriticalAboveGroundline).toBe(true);
    expect(res.utilization.criticalPercent).toBeCloseTo(99.09, 1);

    // 5. Groundline Section Check (z = 65.5 ft, H = 0.0 ft)
    expect(res.groundlineSection.distFromTipFt).toBe(65.5);
    expect(res.utilization.groundlinePercent).toBeCloseTo(94.39, 1);
    expect(res.utilization.isPassing).toBe(true);
    expect(res.trace.calcId).toBeDefined();
  });

  it('toggles linear (AF_PDelta = 1.0) vs non-linear P-Delta analysis accurately', () => {
    const linearRes = calculateWoodPoleStructural({
      ...asceAppendixBInput,
      enablePDelta: false
    });

    expect(linearRes.buckling.enabled).toBe(false);
    expect(linearRes.buckling.amplificationFactor).toBe(1.0);
    expect(linearRes.criticalSection.amplifiedMomentFtLbs).toBe(linearRes.criticalSection.primaryMomentFtLbs);
    expect(linearRes.utilization.criticalPercent).toBeLessThan(91.0);
  });

  it('detects Gere-Carter buckling instability when vertical load exceeds P_cr', () => {
    const unstableRes = calculateWoodPoleStructural({
      ...asceAppendixBInput,
      attachments: [
        { name: 'Extreme Transformer / Guy Vertical Load', heightM: 18, count: 1, diameterMm: 20, tensionN: 0, distFromTipFt: 5.0, transverseForceLbs: 500, verticalForceLbs: 70000, eccentricityFt: 1.0 }
      ]
    });

    expect(unstableRes.buckling.isBucklingUnstable).toBe(true);
    expect(unstableRes.utilization.isPassing).toBe(false);
  });

  it('maintains alphabetical sorting across both CSA O15 and ANSI O5.1 species catalogs', () => {
    const ansiSpecies = getAllAnsiSpecies();
    const csaSpecies = getAllO15Species();

    for (let i = 1; i < ansiSpecies.length; i++) {
      expect(ansiSpecies[i - 1].commonName.localeCompare(ansiSpecies[i].commonName)).toBeLessThanOrEqual(0);
    }
    for (let i = 1; i < csaSpecies.length; i++) {
      expect(csaSpecies[i - 1].commonName.localeCompare(csaSpecies[i].commonName)).toBeLessThanOrEqual(0);
    }
  });
});
