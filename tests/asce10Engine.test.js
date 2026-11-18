import { describe, it, expect } from 'vitest';
import {
  calculateAsce10Design,
  computeEffectiveKLOverR,
  computeCompressiveStressFaKsi,
  findAsceAngleSection,
  getAllAsceSteelGrades,
  getAllAsceAngleSections,
  getAllAsceBoltSpecs,
  getAllAsceBracingCurves
} from '../src/core/asce10/asce10Engine';

describe('ASCE/SEI 10-15 Latticed Steel Transmission Structure Design Engine', () => {
  it('exposes populated catalogs of steel grades, angle sections, bolts, and bracing curves', () => {
    expect(getAllAsceSteelGrades().length).toBeGreaterThanOrEqual(5);
    expect(getAllAsceAngleSections().length).toBeGreaterThanOrEqual(10);
    expect(getAllAsceBoltSpecs().length).toBeGreaterThanOrEqual(3);
    expect(getAllAsceBracingCurves().length).toBe(7);
  });

  it('matches ASCE 10-15 Appendix B Example 1 (L8x8x9/16 Leg Member Compression & Tension)', () => {
    const result = calculateAsce10Design({
      steelGradeId: 'A572_50',
      legWidthIn: 8.0,
      shortLegWidthIn: 8.0,
      thicknessIn: 0.5625,
      filletRadiusIn: 0.625,
      grossAreaIn2: 8.68,
      rzIn: 1.59,
      rxIn: 2.49,
      ryIn: 2.49,
      ruIn: 3.15,
      memberCategory: 'leg',
      bracingCurve: 'curve_1_leg',
      unbracedLengthIn: 48,
      appliedCompressionKip: 350,
      tensionConnType: 'both_legs',
      holeMethod: 'punched',
      numHolesAcrossChain: 2,
      boltDiameterIn: 0.875,
      numStaggerSpaces: 0
    });

    // w/t = (8.0 - 0.5625 - 0.625) / 0.5625 = 12.11 > (w/t)_lim = 80/sqrt(50) = 11.31 -> Inelastic local buckling regime
    expect(result.compression.wOverT).toBeCloseTo(12.11, 2);
    expect(result.compression.wOverTLim).toBeCloseTo(11.31, 2);
    expect(result.compression.localBucklingRegime).toBe('inelastic_local_buckling');
    expect(result.compression.effectiveKLOverR).toBeCloseTo(30.2, 1);
    expect(result.compression.faKsi).toBeGreaterThan(42);
    expect(result.compression.capacityPaKip).toBeGreaterThan(360);
    expect(result.compression.isSlendernessCompliant).toBe(true);

    // Net section tension with 2 punched 7/8" bolts (dh = 0.875 + 0.0625 + 0.0625 = 1.0 in.)
    expect(result.tension.effectiveHoleDiamIn).toBeCloseTo(1.0, 4);
    expect(result.tension.netAreaAnIn2).toBeCloseTo(8.68 - 2 * 1.0 * 0.5625, 2);
    expect(result.tension.designStressFtKsi).toBe(50);

    // Immutable calculation audit trace verification
    expect(result.trace.calculatorId).toBe('asce_10_15_tower_design');
    expect(result.trace.calcId).toMatch(/^calc-/);
    expect(result.trace.steps.length).toBeGreaterThanOrEqual(6);
    expect(result.trace.citations.length).toBeGreaterThanOrEqual(8);
  });

  it('matches ASCE 10-15 Appendix B Example 2 (L1-3/4x1-1/4x3/16 Bracing Member Curve 3 & Connected Leg)', () => {
    const longConnected = calculateAsce10Design({
      steelGradeId: 'A36',
      sectionType: 'unequal_angle',
      legWidthIn: 1.75,
      shortLegWidthIn: 1.25,
      thicknessIn: 0.1875,
      filletRadiusIn: 0.1875,
      grossAreaIn2: 0.53,
      rzIn: 0.27,
      memberCategory: 'other_compression',
      bracingCurve: 'curve_3_both_eccentric',
      unbracedLengthIn: 27,
      tensionConnType: 'one_leg',
      holeMethod: 'punched',
      numHolesAcrossChain: 1,
      boltDiameterIn: 0.625,
      numStaggerSpaces: 0
    });

    // L/r = 27 / 0.27 = 100; Curve 3 -> KL/r = 60 + 0.5 * 100 = 110
    expect(longConnected.compression.lOverR).toBeCloseTo(100, 1);
    expect(longConnected.compression.effectiveKLOverR).toBeCloseTo(110, 1);
    expect(longConnected.tension.designStressFtKsi).toBeCloseTo(0.9 * 36, 2);

    // When connected by the short leg, unconnected leg is treated as short leg size (Sec. 3.10.2)
    const shortConnected = calculateAsce10Design({
      steelGradeId: 'A36',
      sectionType: 'unequal_angle',
      legWidthIn: 1.75,
      shortLegWidthIn: 1.25,
      thicknessIn: 0.1875,
      filletRadiusIn: 0.1875,
      grossAreaIn2: 0.53,
      rzIn: 0.27,
      tensionConnType: 'short_leg_unequal',
      holeMethod: 'punched',
      numHolesAcrossChain: 1,
      boltDiameterIn: 0.625,
      numStaggerSpaces: 0
    });

    expect(shortConnected.tension.netAreaAnIn2).toBeLessThan(longConnected.tension.netAreaAnIn2);
    expect(shortConnected.tension.netTensionCapacityKip).toBeLessThan(
      longConnected.tension.netTensionCapacityKip
    );
  });

  it('matches ASCE 10-15 Appendix B Example 10 (Cold-Formed Angle Local Buckling Fcr & Fa)', () => {
    // Ex. 10 (Clause B.10): Fy = 50 ksi, t = 0.135 in., w = 2.6775 in., w/t = 19.83, rz = 0.586 in., A = 0.777 in.^2
    // Fcr = 24.5 ksi, Cc = 152.9; at L = 58.5 in. (L/rz = 100), Curve 3 (KL/r = 110) -> Fa = 18.2 ksi, Pa = 14.1 kip
    const result = calculateAsce10Design({
      steelGradeId: 'A572_50',
      fyKsi: 50,
      fuKsi: 65,
      sectionType: 'equal_angle',
      legWidthIn: 3.0825,
      shortLegWidthIn: 3.0825,
      thicknessIn: 0.135,
      isColdFormed: true,
      bendRadiusMultiplier: 2.0,
      grossAreaIn2: 0.777,
      rzIn: 0.586,
      bracingCurve: 'curve_3_both_eccentric',
      unbracedLengthIn: 58.5
    });

    expect(result.compression.wOverT).toBeCloseTo(19.83, 1);
    expect(result.compression.localBucklingRegime).toBe('inelastic_local_buckling');
    expect(result.compression.fcrKsi).toBeCloseTo(24.5, 0);
    expect(result.compression.cc).toBeCloseTo(152.9, 0);
    expect(result.compression.faKsi).toBeCloseTo(18.2, 0);
    expect(result.compression.capacityPaKip).toBeCloseTo(14.1, 0);
  });

  it('matches ASCE 10-15 Appendix B Example 11 (Symmetrical Lipped Cold-Formed Angle r_t and r_tf)', () => {
    // Ex. 11 (Clause B.11): 3x3x0.135 lipped angle, Fy = 50 ksi, A = 1.03 in.^2, Cw = 0.441, J = 0.00623, Ips = 5.18,
    // ru = 1.32 in., rz = 0.773 in., uo = 1.64 in., L = 90 in. -> d_min = 0.93 in., rt = 0.689 in., rtf = 0.639 in., P = 16.7 kip
    const result = calculateAsce10Design({
      steelGradeId: 'A572_50',
      sectionType: 'lipped_angle',
      legWidthIn: 3.0,
      shortLegWidthIn: 3.0,
      thicknessIn: 0.135,
      isColdFormed: true,
      bendRadiusMultiplier: 2.0,
      grossAreaIn2: 1.03,
      rzIn: 0.773,
      ruIn: 1.32,
      warpingConstantCwIn6: 0.441,
      torsionConstantJIn4: 0.00623,
      polarInertiaIpsIn4: 5.18,
      shearCenterDistUoIn: 1.64,
      unbracedLengthIn: 90,
      bracingCurve: 'curve_6_both_restrained'
    });

    expect(result.compression.rtIn).toBeCloseTo(0.689, 2);
    expect(result.compression.rtfIn).toBeCloseTo(0.639, 2);
    expect(result.compression.minLipDepthIn).toBeCloseTo(0.93, 1);
    expect(result.compression.capacityPaKip).toBeCloseTo(16.7, 0);
  });

  it('matches ASCE 10-15 Table C4-1 Bolt Shear, Tension & Minimum End/Spacing/Edge Distances', () => {
    // Table C4-1: 3/4 in. A394 Type 0 Bolt in 1/4 in. A36 Steel (Fy = 36, Fu = 58 ksi)
    const result = calculateAsce10Design({
      steelGradeId: 'A36',
      legWidthIn: 3.0,
      shortLegWidthIn: 3.0,
      thicknessIn: 0.25,
      boltSpecId: 'A394_T0',
      boltDiameterIn: 0.75,
      threadsPerInch: 10,
      numConnectionBolts: 1,
      numShearPlanes: 1,
      threadsInShearPlane: true,
      holeMethod: 'punched',
      edgeType: 'rolled',
      appliedConnectionShearKip: 9.86
    });

    expect(result.connections.singleBoltShearCapacityKip).toBeCloseTo(16.65, 1);
    expect(result.connections.singleBoltTensionCapacityKip).toBeCloseTo(14.83, 1);
    expect(result.connections.singleBoltBearingCapacityKip).toBeCloseTo(16.31, 1);
    expect(result.connections.eMinGoverningIn).toBeCloseTo(0.98, 2);
    expect(result.connections.fMinGoverningIn).toBeCloseTo(0.83, 2);
  });

  it('evaluates Curves 1 through 6 effective slenderness formulas accurately', () => {
    expect(computeEffectiveKLOverR(80, 'curve_1_leg')).toBeCloseTo(80, 2);
    expect(computeEffectiveKLOverR(80, 'curve_2_one_eccentric')).toBeCloseTo(30 + 0.75 * 80, 2);
    expect(computeEffectiveKLOverR(80, 'curve_3_both_eccentric')).toBeCloseTo(60 + 0.5 * 80, 2);
    expect(computeEffectiveKLOverR(150, 'curve_4_unrestrained')).toBeCloseTo(150, 2);
    expect(computeEffectiveKLOverR(150, 'curve_5_one_restrained')).toBeCloseTo(28.6 + 0.762 * 150, 2);
    expect(computeEffectiveKLOverR(150, 'curve_6_both_restrained')).toBeCloseTo(46.2 + 0.615 * 150, 2);
  });

  it('maintains finite math invariants across all output fields and all 427 Excel angle sections', () => {
    const sections = getAllAsceAngleSections();
    expect(sections.length).toBe(427);
    // Verify deterministic alphabetical ordering
    for (let i = 1; i < sections.length; i += 1) {
      expect(sections[i - 1].designation.localeCompare(sections[i].designation)).toBeLessThanOrEqual(0);
    }
    expect(findAsceAngleSection('L8x8x9/16')?.id).toBe('SAE_8X8X0.5625');
    expect(findAsceAngleSection('DAL_6X4X0.5')?.crossSectionType).toBe('DoubleLBB');

    const checkFinite = (obj) => {
      for (const [key, val] of Object.entries(obj)) {
        if (key === 'trace') continue;
        if (typeof val === 'number') {
          expect(Number.isFinite(val)).toBe(true);
        } else if (val && typeof val === 'object') {
          checkFinite(val);
        }
      }
    };

    checkFinite(calculateAsce10Design({}));

    // Sweep every single Excel angle section and verify dynamic finite computation
    for (const sec of sections) {
      const res = calculateAsce10Design({ sectionId: sec.id, unbracedLengthIn: 72 });
      checkFinite(res);
      expect(res.sectionProperties.sectionId).toBe(sec.id);
      expect(res.sectionProperties.grossAreaIn2).toBeCloseTo(sec.areaIn2, 2);
      expect(res.sectionProperties.wOverT).toBeCloseTo(sec.wOverTRatio, 1);
      expect(res.sectionProperties.ixIn4).toBeGreaterThan(0);
      expect(res.sectionProperties.iyIn4).toBeGreaterThan(0);
      expect(res.sectionProperties.unitWeightPlf).toBeCloseTo(sec.unitWeightPlf, 1);
      if (sec.isDoubleAngle) {
        expect(res.sectionProperties.maxStitchSpacingIn).toBeGreaterThan(0);
      } else {
        expect(res.sectionProperties.maxStitchSpacingIn).toBeNull();
      }
    }

    // Compare Single vs Double-Angle capacity and tension ply accounting
    const singleLeg = calculateAsce10Design({ sectionId: 'SAE_8X8X0.5625', unbracedLengthIn: 96 });
    const doubleLeg = calculateAsce10Design({ sectionId: 'DAE_8X8X0.5625', unbracedLengthIn: 96 });
    expect(doubleLeg.sectionProperties.grossAreaIn2).toBeCloseTo(2 * singleLeg.sectionProperties.grossAreaIn2, 1);
    expect(doubleLeg.compression.capacityPaKip).toBeGreaterThan(singleLeg.compression.capacityPaKip * 2);
    expect(doubleLeg.tension.netTensionCapacityKip).toBeCloseTo(2 * singleLeg.tension.netTensionCapacityKip, 1);
  });
});
