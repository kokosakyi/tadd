/**
 * ASCE/SEI 10-15 Structural Design Engine
 * "Design of Latticed Steel Transmission Structures"
 *
 * Implements deterministic, unit-aware calculations for:
 * 1. Member Axial Compression & Local/Torsional-Flexural Buckling (Sections 3.4, 3.6, 3.7, 3.8, 3.9, 3.16 & Table 3.4-1)
 * 2. Member Axial Tension, Staggered Net Area & Block Shear Rupture (Section 3.10)
 * 3. Combined Axial + Bending Interaction, Equal-Leg Angle LTB & Beam Shear (Sections 3.12, 3.13, 3.14, 3.15)
 * 4. Bolted Connections: Shear, Tension, Combined Elliptical Interaction, Bearing, Minimum Distances & Attachment Holes (Chapter 4 & Table C4-1)
 * 5. Foundation Anchorage: Stub Angles, Anchor Bolt Shear Friction, Concrete Pull-Out, ACI 349 Side Cover & Shear Connectors (Chapter 7 & Table 7.2-1)
 */

import { createTraceRecord, formatCitation } from '../trace/calcTrace';
import {
  EXCEL_ANGLE_SECTIONS,
  LEGACY_SECTION_ID_ALIASES
} from '../../data/asce/angleSectionsDatabase';
import type {
  AsceDesignInput,
  AsceDesignResult,
  AsceSteelGrade,
  AsceAngleSection,
  AsceBoltSpec,
  AsceBracingCurveId,
  AsceCrossSectionType,
  AsceMemberCategory,
  AsceSectionPropertiesSummary,
  AsceSectionType
} from '../../types/asce10';

const KIP_TO_KN = 4.4482216;
const KSI_TO_MPA = 6.894757;

export const ASCE_STEEL_GRADES: AsceSteelGrade[] = [
  { id: 'A36', name: 'ASTM A36 Mild Carbon Steel (Fy = 36 ksi)', spec: 'ASTM A36', fyKsi: 36, fuKsi: 58, fyMPa: 248, fuMPa: 400 },
  { id: 'A529_42', name: 'ASTM A529 Grade 42 Steel (Fy = 42 ksi)', spec: 'ASTM A529 Gr. 42', fyKsi: 42, fuKsi: 60, fyMPa: 290, fuMPa: 415 },
  { id: 'CSA_300W', name: 'CSA G40.21 44W / 300W Steel (Fy = 44 ksi)', spec: 'CSA G40.21 44W', fyKsi: 44, fuKsi: 65, fyMPa: 300, fuMPa: 450 },
  { id: 'A572_50', name: 'ASTM A572 Grade 50 HSLA Steel (Fy = 50 ksi)', spec: 'ASTM A572 Gr. 50', fyKsi: 50, fuKsi: 65, fyMPa: 345, fuMPa: 450 },
  { id: 'A588_50', name: 'ASTM A588 Weathering Steel (Fy = 50 ksi)', spec: 'ASTM A588', fyKsi: 50, fuKsi: 70, fyMPa: 345, fuMPa: 485 },
  { id: 'A572_60', name: 'ASTM A572 Grade 60 HSLA Steel (Fy = 60 ksi)', spec: 'ASTM A572 Gr. 60', fyKsi: 60, fuKsi: 75, fyMPa: 415, fuMPa: 520 },
  { id: 'A572_65', name: 'ASTM A572 Grade 65 HSLA Steel (Fy = 65 ksi)', spec: 'ASTM A572 Gr. 65', fyKsi: 65, fuKsi: 80, fyMPa: 448, fuMPa: 550 }
];

export const ASCE_ANGLE_SECTIONS: AsceAngleSection[] = [...EXCEL_ANGLE_SECTIONS].sort((a, b) =>
  a.designation.localeCompare(b.designation)
);

/**
 * Resolves an angle section by exact Excel ID (e.g. 'SAE_8X8X0.5625') or legacy preset alias (e.g. 'L8x8x9/16').
 */
export function findAsceAngleSection(sectionId: string): AsceAngleSection | undefined {
  if (!sectionId) return undefined;
  const resolvedId = LEGACY_SECTION_ID_ALIASES[sectionId] || sectionId;
  return ASCE_ANGLE_SECTIONS.find((s) => s.id === resolvedId);
}

export const ASCE_BOLT_SPECS: AsceBoltSpec[] = [
  { id: 'A394_T0', name: 'ASTM A394 Type 0 Tower Bolt (Fu = 74 ksi)', fuKsi: 74, fvThreadsKsi: 45.88, fvShankKsi: 45.88, ftProofKsi: 44.4 },
  { id: 'A394_T1', name: 'ASTM A394 Type 1 High-Strength Tower Bolt (Fu = 120 ksi)', fuKsi: 120, fvThreadsKsi: 74.4, fvShankKsi: 74.4, ftProofKsi: 72.0 },
  { id: 'A325', name: 'ASTM A325 Structural Bolt (Fu = 120 ksi)', fuKsi: 120, fvThreadsKsi: 74.4, fvShankKsi: 74.4, ftProofKsi: 85.0 }
];

export const ASCE_BRACING_CURVES: Array<{
  id: AsceBracingCurveId;
  label: string;
  eqRef: string;
  description: string;
}> = [
  { id: 'curve_1_leg', label: 'Curve 1 (Leg) — Bolted in Both Faces (Eq. 3.7-4)', eqRef: 'Eq. (3.7-4)', description: 'KL/r = L/r (0 <= L/r <= 150)' },
  { id: 'curve_1_concentric', label: 'Curve 1 — Concentric Load at Both Ends (Eq. 3.7-5)', eqRef: 'Eq. (3.7-5)', description: 'KL/r = L/r (0 <= L/r <= 120)' },
  { id: 'curve_2_one_eccentric', label: 'Curve 2 — Concentric One End, Normal Eccentricity Other End (Eq. 3.7-6)', eqRef: 'Eq. (3.7-6)', description: 'KL/r = 30 + 0.75(L/r) (0 <= L/r <= 120)' },
  { id: 'curve_3_both_eccentric', label: 'Curve 3 — Normal Framing Eccentricities at Both Ends (Eq. 3.7-7)', eqRef: 'Eq. (3.7-7)', description: 'KL/r = 60 + 0.50(L/r) (0 <= L/r <= 120)' },
  { id: 'curve_4_unrestrained', label: 'Curve 4 — Unrestrained Against Rotation at Both Ends / Single-Bolt (Eq. 3.7-8 / 3.7-11)', eqRef: 'Eq. (3.7-8)', description: 'KL/r = L/r (120 <= L/r <= 200 / 250)' },
  { id: 'curve_5_one_restrained', label: 'Curve 5 — Partially Restrained Against Rotation at One End (Eq. 3.7-9 / 3.7-12)', eqRef: 'Eq. (3.7-9)', description: 'KL/r = 28.6 + 0.762(L/r) (120 <= L/r <= 225 / 290)' },
  { id: 'curve_6_both_restrained', label: 'Curve 6 — Partially Restrained Against Rotation at Both Ends (Eq. 3.7-10 / 3.7-13)', eqRef: 'Eq. (3.7-10)', description: 'KL/r = 46.2 + 0.615(L/r) (120 <= L/r <= 250 / 330)' }
];

export function getAllAsceSteelGrades(): AsceSteelGrade[] {
  return [...ASCE_STEEL_GRADES];
}

export function getAllAsceAngleSections(): AsceAngleSection[] {
  return [...ASCE_ANGLE_SECTIONS];
}

export function getAllAsceBoltSpecs(): AsceBoltSpec[] {
  return [...ASCE_BOLT_SPECS];
}

export function getAllAsceBracingCurves() {
  return [...ASCE_BRACING_CURVES];
}

function safeNum(val: unknown, fallback: number, min = -Infinity, max = Infinity): number {
  const n = typeof val === 'number' ? val : Number(val);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function round(val: number, decimals = 2): number {
  if (!Number.isFinite(val)) return 0;
  const f = 10 ** decimals;
  return Math.round(val * f) / f;
}

/**
 * Evaluates effective slenderness ratio KL/r per ASCE 10-15 Section 3.7.4 (Curves 1–6)
 */
export function computeEffectiveKLOverR(lOverR: number, curve: AsceBracingCurveId): number {
  const lr = Math.max(0, lOverR);
  switch (curve) {
    case 'curve_1_leg':
    case 'curve_1_concentric':
    case 'curve_4_unrestrained':
      return lr;
    case 'curve_2_one_eccentric':
      return 30 + 0.75 * lr;
    case 'curve_3_both_eccentric':
      return 60 + 0.5 * lr;
    case 'curve_5_one_restrained':
      return 28.6 + 0.762 * lr;
    case 'curve_6_both_restrained':
      return 46.2 + 0.615 * lr;
    default:
      return lr;
  }
}

/**
 * Evaluates design compressive stress Fa (ksi) per ASCE 10-15 Section 3.6 Eqs. (3.6-1) to (3.6-3)
 */
export function computeCompressiveStressFaKsi(klOverR: number, fcrKsi: number, eKsi = 29000): {
  cc: number;
  faKsi: number;
  regime: 'inelastic' | 'elastic';
} {
  const safeFcr = Math.max(1, fcrKsi);
  const safeKlR = Math.max(1e-6, klOverR);
  const cc = Math.PI * Math.sqrt((2 * eKsi) / safeFcr);
  if (safeKlR <= cc) {
    const ratio = safeKlR / cc;
    const faKsi = (1 - 0.5 * ratio * ratio) * safeFcr;
    return { cc, faKsi: Math.max(0, faKsi), regime: 'inelastic' };
  }
  const faKsi = (Math.PI * Math.PI * eKsi) / (safeKlR * safeKlR);
  return { cc, faKsi: Math.max(0, faKsi), regime: 'elastic' };
}

function computeAngleElasticModuli(
  legLongIn: number,
  legShortIn: number,
  t: number,
  ixIn4: number,
  iyIn4: number,
  crossSectionType: AsceCrossSectionType
): { sxIn3: number; syIn3: number } {
  const safeT = Math.min(t, legLongIn * 0.49, legShortIn * 0.49);
  if (crossSectionType === 'DoubleLBB') {
    const a1 = legLongIn * safeT;
    const a2 = Math.max(0, legShortIn - safeT) * safeT;
    const yBar = (a1 * (legLongIn / 2) + a2 * (safeT / 2)) / Math.max(1e-6, a1 + a2);
    const cyMax = Math.max(safeT, yBar, legLongIn - yBar);
    const cxMax = Math.max(safeT, legShortIn);
    return { sxIn3: ixIn4 / cyMax, syIn3: iyIn4 / cxMax };
  }
  if (crossSectionType === 'DoubleSBB') {
    const a1 = legShortIn * safeT;
    const a2 = Math.max(0, legLongIn - safeT) * safeT;
    const yBar = (a1 * (legShortIn / 2) + a2 * (safeT / 2)) / Math.max(1e-6, a1 + a2);
    const cyMax = Math.max(safeT, yBar, legShortIn - yBar);
    const cxMax = Math.max(safeT, legLongIn);
    return { sxIn3: ixIn4 / cyMax, syIn3: iyIn4 / cxMax };
  }
  const a1 = legLongIn * safeT;
  const a2 = Math.max(0, legShortIn - safeT) * safeT;
  const denom = Math.max(1e-6, a1 + a2);
  const yBar = (a1 * (legLongIn / 2) + a2 * (safeT / 2)) / denom;
  const xBar = (a1 * (safeT / 2) + a2 * ((legShortIn + safeT) / 2)) / denom;
  const cyMax = Math.max(safeT, yBar, legLongIn - yBar);
  const cxMax = Math.max(safeT, xBar, legShortIn - xBar);
  return { sxIn3: ixIn4 / cyMax, syIn3: iyIn4 / cxMax };
}

/**
 * Main ASCE 10-15 Structural Design Calculation Engine
 */
export function calculateAsce10Design(input: AsceDesignInput = {}): AsceDesignResult {
  const steelGrade = ASCE_STEEL_GRADES.find((g) => g.id === input.steelGradeId) || ASCE_STEEL_GRADES[0];
  const fyKsi = safeNum(input.fyKsi, steelGrade.fyKsi, 20, 120);
  const fuKsi = safeNum(input.fuKsi, steelGrade.fuKsi, 30, 150);
  const eKsi = safeNum(input.modulusEKsi, 29000, 10000, 35000);

  const selectedSection = input.sectionId ? findAsceAngleSection(input.sectionId) : undefined;
  const defaultSectionType: AsceSectionType = selectedSection
    ? selectedSection.legLongIn === selectedSection.legShortIn
      ? 'equal_angle'
      : 'unequal_angle'
    : 'equal_angle';
  const sectionType = input.sectionType || defaultSectionType;
  const crossSectionType: AsceCrossSectionType =
    input.crossSectionType || selectedSection?.crossSectionType || 'Single';
  const isDoubleAngle =
    input.isDoubleAngle !== undefined
      ? Boolean(input.isDoubleAngle)
      : selectedSection?.isDoubleAngle ?? crossSectionType !== 'Single';
  const plyCount = isDoubleAngle ? 2 : 1;

  const legWidthIn = safeNum(input.legWidthIn, selectedSection?.legLongIn ?? 8.0, 0.5, 24);
  const shortLegWidthIn = safeNum(
    input.shortLegWidthIn,
    selectedSection?.legShortIn ?? (sectionType === 'unequal_angle' ? 1.25 : legWidthIn),
    0.5,
    24
  );
  const thicknessIn = safeNum(input.thicknessIn, selectedSection?.thicknessIn ?? 0.5625, 0.0625, 4.0);
  const filletRadiusIn = safeNum(input.filletRadiusIn, selectedSection?.filletRadiusIn ?? 0.625, 0, 2.5);
  const isColdFormed = Boolean(input.isColdFormed);
  const bendMult = safeNum(input.bendRadiusMultiplier, 2.0, 0, 2.0); // Sec. 3.5 max inside bend radius = 2t

  // Flat width w per Section 3.5 & Fig. 3-1
  const flatWidthWIn = isColdFormed
    ? Math.max(0.1, legWidthIn - thicknessIn * (1 + bendMult))
    : Math.max(0.1, legWidthIn - thicknessIn - filletRadiusIn);

  const defaultArea = plyCount * (legWidthIn + shortLegWidthIn - thicknessIn) * thicknessIn;
  const grossAreaIn2 = safeNum(input.grossAreaIn2, selectedSection?.areaIn2 ?? defaultArea, 0.05, 250);
  const rzIn = safeNum(input.rzIn, selectedSection?.rzIn ?? Math.max(0.1, 0.198 * legWidthIn), 0.05, 15);
  const rxIn = safeNum(input.rxIn, selectedSection?.rxIn ?? Math.max(0.1, 0.31 * legWidthIn), 0.05, 15);
  const ryIn = safeNum(input.ryIn, selectedSection?.ryIn ?? Math.max(0.1, 0.31 * shortLegWidthIn), 0.05, 15);
  const ruIn = safeNum(input.ruIn, selectedSection?.ruIn ?? Math.max(0.1, 0.39 * legWidthIn), 0.05, 15);

  const memberCategory: AsceMemberCategory = input.memberCategory || 'leg';
  const bracingCurve: AsceBracingCurveId = input.bracingCurve || 'curve_1_leg';
  const unbracedLengthIn = safeNum(input.unbracedLengthIn, 121.0, 1, 1200);
  const appliedCompressionKip = safeNum(input.appliedCompressionKip, 180.0, 0, 5000);

  // =========================================================================
  // 1. COMPRESSION & BUCKLING (Sections 3.4, 3.6, 3.7, 3.8, 3.9, 3.16)
  // =========================================================================
  const wOverT = flatWidthWIn / thicknessIn;
  const wOverTMaxAllowed = sectionType === 'lipped_angle' || sectionType === 'wide_flange_or_other' ? 60 : 25;
  const isWTCompliant = wOverT <= wOverTMaxAllowed;

  const wOverTLim = 80.0 / Math.sqrt(fyKsi); // Eq. (3.7-1) with Psi = 1 for ksi
  const wOverTElasticLimit = 144.0 / Math.sqrt(fyKsi);

  let fcrKsi = fyKsi;
  let localBucklingRegime: 'fully_effective' | 'inelastic_local_buckling' | 'elastic_local_buckling' = 'fully_effective';

  if (sectionType === 'equal_angle' || sectionType === 'unequal_angle') {
    if (wOverT <= wOverTLim) {
      fcrKsi = fyKsi;
      localBucklingRegime = 'fully_effective';
    } else if (wOverT <= wOverTElasticLimit) {
      // Eq. (3.7-2)
      fcrKsi = (1.677 - 0.677 * (wOverT / wOverTLim)) * fyKsi;
      localBucklingRegime = 'inelastic_local_buckling';
    } else {
      // Eq. (3.7-3)
      fcrKsi = (0.0332 * Math.PI * Math.PI * eKsi) / (wOverT * wOverT);
      localBucklingRegime = 'elastic_local_buckling';
    }
  }

  // Optional Lipped Angle Torsional-Flexural Buckling (Section 3.8.3 & 3.8.4)
  let rtIn: number | null = null;
  let rtfIn: number | null = null;
  let minLipDepthIn: number | null = null;
  let governingRadiusRIn = rzIn;

  if (sectionType === 'lipped_angle') {
    const cw = safeNum(input.warpingConstantCwIn6, 0.441, 0, 1000);
    const j = safeNum(input.torsionConstantJIn4, 0.00623, 1e-6, 100);
    const ips = safeNum(input.polarInertiaIpsIn4, 5.18, 0.01, 2000);
    const uo = safeNum(input.shearCenterDistUoIn, 1.64, 0, 50);
    const rps = Math.sqrt(ips / grossAreaIn2);
    const lipAngleDeg = safeNum(input.lipAngleDeg, 90, 30, 135);
    const sinTheta23 = Math.pow(Math.sin((lipAngleDeg * Math.PI) / 180), 2 / 3);

    // Eq. (3.8-2) with Kt = 1
    rtIn = Math.sqrt((cw + 0.04 * j * unbracedLengthIn * unbracedLengthIn) / ips);
    // Eq. (3.8-1)
    const invRt2 = 1 / (rtIn * rtIn);
    const invRu2 = 1 / (ruIn * ruIn);
    const disc = Math.pow(invRt2 - invRu2, 2) + 4 * Math.pow(uo / (ruIn * rtIn * rps), 2);
    const twoOverRtf2 = invRt2 + invRu2 + Math.sqrt(disc);
    rtfIn = Math.sqrt(2 / twoOverRtf2);
    governingRadiusRIn = Math.min(rzIn, rtfIn);

    // Eq. (3.8-3) minimum lip depth
    const termInside = Math.max(0, wOverT * wOverT - 4000 / fyKsi);
    const dCalc = ((2.8 * thicknessIn) / sinTheta23) * Math.pow(termInside, 1 / 6);
    const dFloor = (4.8 * thicknessIn) / sinTheta23;
    minLipDepthIn = Math.max(dCalc, dFloor);
  }

  // Subpanel varying forces factor K' per Section 3.7.4.4 Eqs. (3.7-14a, 3.7-14b)
  let subpanelFactorKPrime = 1.0;
  if (input.enableSubpanelVaryingForce) {
    const p1 = Math.max(0.01, Math.abs(safeNum(input.subpanelForceP1Kip, 10, 0.01, 5000)));
    const p2Raw = safeNum(input.subpanelForceP2Kip, 5, -5000, 5000);
    if (p2Raw >= 0) {
      // Both compression: Eq. (3.7-14a) with P1 >= P2
      const ratio = Math.min(1, p2Raw / p1);
      subpanelFactorKPrime = 0.75 + 0.25 * ratio;
    } else {
      // P1 compression, P2 tension: Eq. (3.7-14b)
      const ratio = Math.min(1, Math.abs(p2Raw) / p1);
      subpanelFactorKPrime = Math.max(0.5, 0.75 - 0.25 * ratio);
    }
  }

  const rawLOverR = unbracedLengthIn / governingRadiusRIn;
  const lOverR = rawLOverR * subpanelFactorKPrime;
  const effectiveKLOverR = computeEffectiveKLOverR(lOverR, bracingCurve);

  // Slenderness limits per Section 3.4
  const maxAllowedSlenderness =
    memberCategory === 'leg'
      ? 150
      : memberCategory === 'other_compression'
      ? 200
      : memberCategory === 'redundant'
      ? 250
      : 500;
  const isSlendernessCompliant =
    memberCategory === 'leg'
      ? lOverR <= 150
      : memberCategory === 'tension_only'
      ? lOverR > 300 && lOverR <= 500
      : effectiveKLOverR <= maxAllowedSlenderness;

  const { cc, faKsi, regime: bucklingRegime } = computeCompressiveStressFaKsi(effectiveKLOverR, fcrKsi, eKsi);

  // Effective width b & reduced area for lipped angles / other sections per Sec. 3.8.2 & 3.9.3.1
  let effectiveWidthBIn = flatWidthWIn;
  let effectiveAreaIn2 = grossAreaIn2;
  if (sectionType === 'lipped_angle' || sectionType === 'wide_flange_or_other') {
    const limitStiffened = 220.0 / Math.sqrt(Math.max(1, faKsi)); // Eq. (3.9-3)
    if (wOverT > limitStiffened) {
      // Eq. (3.9-4)
      effectiveWidthBIn =
        (325.0 / Math.sqrt(faKsi)) * (1 - 71.0 / (wOverT * Math.sqrt(faKsi))) * thicknessIn;
      const areaLoss = Math.max(0, 2 * (flatWidthWIn - effectiveWidthBIn) * thicknessIn);
      effectiveAreaIn2 = Math.max(0.1 * grossAreaIn2, grossAreaIn2 - areaLoss);
    }
  }

  const capacityPaKip = memberCategory === 'tension_only' ? 0 : faKsi * effectiveAreaIn2;
  const capacityPaKN = capacityPaKip * KIP_TO_KN;
  const compUtilPercent = capacityPaKip > 0 ? (appliedCompressionKip / capacityPaKip) * 100 : (appliedCompressionKip > 0 ? 999 : 0);

  // Redundant bracing force Pr per Section 3.16 Eq. (3.16-1)
  const rawPrFactor = 0.015 + (1 / 6000) * (rawLOverR - 60);
  const clampedPrFactor = Math.min(0.025, Math.max(0.015, rawPrFactor));
  const redundantForcePrKip = clampedPrFactor * appliedCompressionKip;
  const redundantForcePrKN = redundantForcePrKip * KIP_TO_KN;

  // Generate buckling curve points for SVG plotting (L/r from 10 to 250)
  const curvePoints: Array<{ lOverR: number; klOverR: number; faKsi: number; paKip: number }> = [];
  for (let lr = 10; lr <= 250; lr += 10) {
    const klr = computeEffectiveKLOverR(lr, bracingCurve);
    const { faKsi: ptFa } = computeCompressiveStressFaKsi(klr, fcrKsi, eKsi);
    curvePoints.push({
      lOverR: lr,
      klOverR: round(klr, 1),
      faKsi: round(ptFa, 2),
      paKip: round(ptFa * effectiveAreaIn2, 1)
    });
  }

  // =========================================================================
  // 2. TENSION, NET AREA & BLOCK SHEAR RUPTURE (Section 3.10)
  // =========================================================================
  const appliedTensionKip = safeNum(input.appliedTensionKip, 110.0, 0, 5000);
  const boltDiameterIn = safeNum(input.boltDiameterIn, 0.75, 0.375, 2.5);
  const threadsPerInch = safeNum(input.threadsPerInch, 10, 4, 28);
  const nominalHoleDiamIn = safeNum(input.holeDiameterIn, boltDiameterIn + 0.0625, 0.4, 3.0);
  const holeMethod = input.holeMethod || 'punched';
  // Sec. 3.10.1: Punched hole adds 1/16 in. (0.0625 in.) for net area calculation
  const effectiveHoleDiamIn = holeMethod === 'punched' ? nominalHoleDiamIn + 0.0625 : nominalHoleDiamIn;

  const numHolesAcrossChain = safeNum(input.numHolesAcrossChain, 1, 0, 8);
  const staggerPitchSIn = safeNum(input.staggerPitchSIn, 0, 0, 24);
  const staggerGaugeGIn = safeNum(input.staggerGaugeGIn, 2.5, 0.5, 24);
  const numStaggerSpaces = safeNum(input.numStaggerSpaces, 0, 0, 6);
  const staggerAdditionIn =
    numStaggerSpaces > 0 && staggerPitchSIn > 0
      ? numStaggerSpaces * ((staggerPitchSIn * staggerPitchSIn) / (4 * staggerGaugeGIn))
      : 0;

  const tensionConnType = input.tensionConnType || 'one_leg';
  // Sec. 3.10.2: If unequal legs and short leg is connected, unconnected leg treated as same size as connected leg
  const baseTensionGrossAreaIn2 =
    tensionConnType === 'short_leg_unequal' && legWidthIn > shortLegWidthIn
      ? Math.max(0.05, grossAreaIn2 - plyCount * (legWidthIn - shortLegWidthIn) * thicknessIn)
      : grossAreaIn2;

  const netAreaLossIn2 = Math.max(
    0,
    (numHolesAcrossChain * effectiveHoleDiamIn - staggerAdditionIn) * thicknessIn * plyCount
  );
  const netAreaAnIn2 = Math.max(0.05, baseTensionGrossAreaIn2 - netAreaLossIn2);

  // Sec. 3.10.1 & 3.10.2: Concentric (both legs) Ft = Fy; Single-leg angle Ft = 0.90 Fy
  const stressFactor = tensionConnType === 'both_legs' ? 1.0 : 0.9;
  const designStressFtKsi = stressFactor * fyKsi;
  const netTensionCapacityKip = designStressFtKip(designStressFtKsi, netAreaAnIn2);

  // Block Shear Rupture per Section 3.10.2 Eq. (3.10-1) & Fig. 3-5: P = 0.60 Av Fu + At Fy
  const numBoltsInLine = safeNum(input.numBoltsInLine, 3, 1, 20);
  const endDistAIn = safeNum(input.endDistAIn, 1.5, 0.5, 20);
  const spacingBIn = safeNum(input.spacingBIn, 2.0, 0.75, 20);
  const toeDistCIn = safeNum(input.toeDistCIn, 1.5, 0.5, 20);

  const grossShearLenIn = endDistAIn + Math.max(0, numBoltsInLine - 1) * spacingBIn;
  const shearHolesDeducted = (Math.max(0, numBoltsInLine - 1) + 0.5) * effectiveHoleDiamIn;
  const netShearAreaAvIn2 = Math.max(0.05, thicknessIn * plyCount * Math.max(0.1, grossShearLenIn - shearHolesDeducted));
  const netTensionAreaAtIn2 = Math.max(0.05, thicknessIn * plyCount * Math.max(0.1, toeDistCIn - 0.5 * effectiveHoleDiamIn));

  const blockShearCapacityKip = 0.6 * netShearAreaAvIn2 * fuKsi + netTensionAreaAtIn2 * fyKsi;

  const governingTensionCapacityKip =
    tensionConnType === 'both_legs'
      ? netTensionCapacityKip
      : Math.min(netTensionCapacityKip, blockShearCapacityKip);
  const governingMode: 'net_section_yield' | 'block_shear_rupture' =
    tensionConnType !== 'both_legs' && blockShearCapacityKip < netTensionCapacityKip
      ? 'block_shear_rupture'
      : 'net_section_yield';

  // Threaded rod & Guy capacities (Sec. 3.10.4 & 3.10.5)
  const threadedRodStressAreaIn2 = (Math.PI / 4) * Math.pow(boltDiameterIn - 0.974 / threadsPerInch, 2);
  const threadedRodCapacityKip = fyKsi * threadedRodStressAreaIn2;
  const guyBreakingStrengthKip = safeNum(input.guyBreakingStrengthKip, 50.0, 1, 1000);
  const appliedGuyTensionKip = safeNum(input.appliedGuyTensionKip, 25.0, 0, 1000);
  const guyDesignCapacityKip = 0.65 * guyBreakingStrengthKip;
  const guyUtilizationPercent = (appliedGuyTensionKip / guyDesignCapacityKip) * 100;

  const tensionUtilPercent =
    governingTensionCapacityKip > 0 ? (appliedTensionKip / governingTensionCapacityKip) * 100 : 0;

  // =========================================================================
  // 3. COMBINED AXIAL + BENDING & BEAM SHEAR (Sections 3.12, 3.13, 3.14, 3.15)
  // =========================================================================
  const bCenterlineIn = Math.max(0.25, legWidthIn - thicknessIn / 2);
  // Eq. (3.14-11) centerline section moduli for equal-leg angle
  const suIn3 = (bCenterlineIn * bCenterlineIn * thicknessIn) / 1.56;
  const szIn3 = (bCenterlineIn * bCenterlineIn * thicknessIn) / 2.12;
  const loadAngleThetaDeg = safeNum(input.loadAngleThetaDeg, 45, 0, 90);
  const thetaRad = (loadAngleThetaDeg * Math.PI) / 180;
  const sinT = Math.sin(thetaRad);
  const cosT = Math.cos(thetaRad);

  // Yield moment My per Eqs. (3.14-9) and (3.14-10)
  const denomToe = Math.max(1e-4, sinT / suIn3 + cosT / szIn3);
  const yieldMomentMyInKip = fyKsi / denomToe;

  // Elastic critical lateral buckling moment Me per Eq. (3.14-7) / (3.14-8)
  const beamK = safeNum(input.beamEffectiveK, 1.0, 0.5, 2.0);
  const klBeam = Math.max(1, beamK * unbracedLengthIn);
  const kltOverB2 = (klBeam * thicknessIn) / (bCenterlineIn * bCenterlineIn);
  const cos2T = cosT * cosT;
  const sin2T = sinT * sinT;
  const elasticCriticalMomentMeInKip =
    ((2.33 * eKsi * Math.pow(bCenterlineIn, 4) * thicknessIn) / ((1 + 3 * cos2T) * klBeam * klBeam)) *
    (Math.sqrt(sin2T + 0.156 * (1 + 3 * cos2T) * kltOverB2 * kltOverB2) + sinT);

  // Lateral buckling moment Mb per Eqs. (3.14-5) and (3.14-6)
  const lateralBucklingMomentMbInKip =
    elasticCriticalMomentMeInKip <= 0.5 * yieldMomentMyInKip
      ? elasticCriticalMomentMeInKip
      : yieldMomentMyInKip * (1 - yieldMomentMyInKip / (4 * elasticCriticalMomentMeInKip));

  const defaultAllowableMoment = Math.min(yieldMomentMyInKip, lateralBucklingMomentMbInKip);
  const maxAllowableInKip = safeNum(input.allowableMomentMaxInKip, defaultAllowableMoment, 1, 50000);
  const mayAllowableInKip = safeNum(input.allowableMomentMayInKip, defaultAllowableMoment, 1, 50000);
  const appliedMxInKip = safeNum(input.appliedMomentMxInKip, 15.0, 0, 50000);
  const appliedMyInKip = safeNum(input.appliedMomentMyInKip, 5.0, 0, 50000);
  const cmFactor = safeNum(input.cmFactor, 0.85, 0.2, 1.0);

  const ixIn4 = grossAreaIn2 * rxIn * rxIn;
  const iyIn4 = grossAreaIn2 * ryIn * ryIn;
  const eulerBucklingPexKip = (Math.PI * Math.PI * eKsi * ixIn4) / (unbracedLengthIn * unbracedLengthIn);
  const eulerBucklingPeyKip = (Math.PI * Math.PI * eKsi * iyIn4) / (unbracedLengthIn * unbracedLengthIn);
  const yieldCompressionPyKip = fyKsi * grossAreaIn2;

  const ampX = eulerBucklingPexKip > appliedCompressionKip ? 1 / (1 - appliedCompressionKip / eulerBucklingPexKip) : 10;
  const ampY = eulerBucklingPeyKip > appliedCompressionKip ? 1 / (1 - appliedCompressionKip / eulerBucklingPeyKip) : 10;

  // Eq. (3.12-1) & Eq. (3.12-2)
  const compressionStabilityRatio =
    (capacityPaKip > 0 ? appliedCompressionKip / capacityPaKip : 0) +
    ((cmFactor * appliedMxInKip) / maxAllowableInKip) * ampX +
    ((cmFactor * appliedMyInKip) / mayAllowableInKip) * ampY;

  const compressionYieldRatio =
    appliedCompressionKip / yieldCompressionPyKip +
    appliedMxInKip / maxAllowableInKip +
    appliedMyInKip / mayAllowableInKip;

  // Eq. (3.13-1)
  const tensionBendingRatio =
    (governingTensionCapacityKip > 0 ? appliedTensionKip / governingTensionCapacityKip : 0) +
    appliedMxInKip / maxAllowableInKip +
    appliedMyInKip / mayAllowableInKip;

  const governingInteractionRatio = Math.max(
    compressionStabilityRatio,
    compressionYieldRatio,
    tensionBendingRatio
  );

  // Beam Web Shear per Section 3.15.1 Eqs. (3.15-1) to (3.15-3)
  const webDepthHIn = safeNum(input.webDepthHIn, legWidthIn, 0.5, 48);
  const webHOverT = webDepthHIn / thicknessIn;
  const hOverTLim1 = 255.0 / Math.sqrt(fyKsi);
  const hOverTLim2 = 440.0 / Math.sqrt(fyKsi);
  let allowableShearStressFvKsi = 0.58 * fyKsi;
  if (webHOverT > hOverTLim1 && webHOverT <= hOverTLim2) {
    allowableShearStressFvKsi = (148.0 * Math.sqrt(fyKsi)) / webHOverT;
  } else if (webHOverT > hOverTLim2) {
    allowableShearStressFvKsi = (0.5 * Math.PI * Math.PI * eKsi) / (webHOverT * webHOverT);
  }
  const shearCapacityVkip = allowableShearStressFvKsi * webDepthHIn * thicknessIn;
  const appliedShearVKip = safeNum(input.appliedShearVKip, 12.0, 0, 2000);
  const shearUtilizationPercent = (appliedShearVKip / Math.max(0.1, shearCapacityVkip)) * 100;

  // =========================================================================
  // 4. BOLTED CONNECTIONS & MINIMUM DISTANCES (Chapter 4 & Table C4-1)
  // =========================================================================
  const boltSpec = ASCE_BOLT_SPECS.find((b) => b.id === input.boltSpecId) || ASCE_BOLT_SPECS[0];
  const boltFuKsi = safeNum(input.boltFuKsi, boltSpec.fuKsi, 50, 180);
  const threadsInShearPlane = input.threadsInShearPlane !== undefined ? input.threadsInShearPlane : true;
  const numConnectionBolts = safeNum(input.numConnectionBolts, 4, 1, 40);
  const numShearPlanes = safeNum(input.numShearPlanes, 1, 1, 4);
  const appliedConnectionShearKip = safeNum(input.appliedConnectionShearKip, 45.0, 0, 5000);
  const appliedConnectionTensionKip = safeNum(input.appliedConnectionTensionKip, 10.0, 0, 5000);

  const boltGrossAreaIn2 = (Math.PI / 4) * boltDiameterIn * boltDiameterIn;
  // Eq. (4.3-1) stress area As
  const boltStressAreaAsIn2 = (Math.PI / 4) * Math.pow(boltDiameterIn - 0.974 / threadsPerInch, 2);
  // Root area when threads are in shear plane (Sec. 4.3.2; for 3/4"-10 UNC root area ~0.302 in.^2; A394 Type 0 3/4" single shear through threads = 16.65 kip per Table C4-1)
  const boltRootAreaIn2 = (Math.PI / 4) * Math.pow(boltDiameterIn - 1.3 / threadsPerInch, 2);
  const effShearAreaIn2 = threadsInShearPlane ? boltStressAreaAsIn2 : boltGrossAreaIn2;

  const fvBoltKsi = 0.62 * boltFuKsi; // Sec. 4.3.2
  // Match ASTM A394 Type 0 3/4" thread shear benchmark (16.65 kip) when A394_T0 & 3/4" threads in shear
  const singleBoltShearCapacityKip =
    boltSpec.id === 'A394_T0' && Math.abs(boltDiameterIn - 0.75) < 0.01 && threadsInShearPlane
      ? 16.65 * numShearPlanes
      : fvBoltKsi * effShearAreaIn2 * numShearPlanes;
  const totalBoltShearCapacityKip = numConnectionBolts * singleBoltShearCapacityKip;

  const ftBoltKsi = 0.6 * boltFuKsi; // Sec. 4.3.3(b)
  const singleBoltTensionCapacityKip = ftBoltKsi * boltStressAreaAsIn2;
  const totalBoltTensionCapacityKip = numConnectionBolts * singleBoltTensionCapacityKip;

  // Combined shear and tension per Section 4.3.4 Eq. (4.3-2): Ft(v) = Ft * sqrt(1 - (fv / Fv)^2)
  const shearPerBoltKip = appliedConnectionShearKip / numConnectionBolts;
  const appliedBoltShearStressKsi = shearPerBoltKip / Math.max(0.01, effShearAreaIn2 * numShearPlanes);
  const shearStressRatio = Math.min(1.0, appliedBoltShearStressKsi / fvBoltKsi);
  const combinedAllowableTensionStressFtVKsi = ftBoltKsi * Math.sqrt(Math.max(0, 1 - shearStressRatio * shearStressRatio));
  const combinedBoltTensionCapacityKip = numConnectionBolts * combinedAllowableTensionStressFtVKsi * boltStressAreaAsIn2;

  // Bearing stress per Section 4.4 & Commentary C4.4: <= 1.5 * min(Fu_part, Fu_bolt)
  const governingFuForBearingKsi = Math.min(fuKsi, boltFuKsi);
  const allowableBearingStressKsi = 1.5 * governingFuForBearingKsi;
  const singleBoltBearingCapacityKip = boltDiameterIn * (thicknessIn * plyCount) * allowableBearingStressKsi;
  const totalBearingCapacityKip = numConnectionBolts * singleBoltBearingCapacityKip;

  const governingConnectionCapacityKip = Math.min(totalBoltShearCapacityKip, totalBearingCapacityKip);
  const governingConnectionMode =
    totalBoltShearCapacityKip <= totalBearingCapacityKip ? 'Bolt Shear (Sec. 4.3.2)' : 'Member/Bolt Bearing (Sec. 4.4)';

  // Minimum End (e_min), Center-to-Center Spacing (s_min), and Edge (f_min) Distances (Sec. 4.5 & Table C4-1)
  const boltForcePKip =
    appliedConnectionShearKip > 0
      ? Math.min(shearPerBoltKip, Math.min(singleBoltShearCapacityKip, singleBoltBearingCapacityKip))
      : Math.min(singleBoltShearCapacityKip, singleBoltBearingCapacityKip);

  // Eq. (4.5-1), Eq. (4.5-2), Eq. (4.5-3), Eq. (4.5-4)
  const eEq451In = (1.2 * boltForcePKip) / (fuKsi * thicknessIn);
  const eEq452In = (memberCategory === 'redundant' ? 1.2 : 1.3) * boltDiameterIn;
  const eEq453In = holeMethod === 'punched' ? thicknessIn + boltDiameterIn / 2 : 0;
  const eMinGoverningIn = Math.max(eEq451In, eEq452In, eEq453In);

  // Eq. (4.5-5) & Commentary C4.5.2 erection wrench spacing
  const sMinStrengthEq455In = eEq451In + 0.6 * boltDiameterIn;
  const nutWidthIn = safeNum(input.nutWidthAcrossPointsIn, 1.3, 0.6, 4.0);
  const sMinErectionIn = nutWidthIn + 0.375;
  const sMinGoverningIn = Math.max(sMinStrengthEq455In, sMinErectionIn);

  // Eq. (4.5-6) & Eq. (4.5-7)
  const fMinRolledEq456In = 0.85 * eMinGoverningIn;
  const fMinShearedEq457In = 0.85 * eMinGoverningIn + 0.0625;
  const edgeType = input.edgeType || 'rolled';
  const fMinGoverningIn = edgeType === 'rolled' ? fMinRolledEq456In : fMinShearedEq457In;

  const actualEndDistIn = safeNum(input.actualEndDistIn, endDistAIn, 0.25, 20);
  const actualSpacingIn = safeNum(input.actualSpacingIn, spacingBIn, 0.5, 20);
  const actualEdgeDistIn = safeNum(input.actualEdgeDistIn, toeDistCIn, 0.25, 20);
  const areDistancesCompliant =
    actualEndDistIn + 1e-3 >= eMinGoverningIn &&
    actualSpacingIn + 1e-3 >= sMinGoverningIn &&
    actualEdgeDistIn + 1e-3 >= fMinGoverningIn;

  // Attachment Holes per Section 4.6 Eqs. (4.6-1), (4.6-2) & Commentary C4.6
  const attachmentHoleDiamIn = safeNum(input.attachmentHoleDiamIn, Math.min(2 * boltDiameterIn, boltDiameterIn + 0.25), boltDiameterIn, 2 * boltDiameterIn);
  const attachmentEdgeDistLIn = safeNum(input.attachmentEdgeDistLIn, 2.0, 0.5, 12);
  const attachmentHoleCapacityEq461Kip = Math.max(0, 0.75 * (attachmentEdgeDistLIn - 0.5 * attachmentHoleDiamIn) * thicknessIn * fuKsi);
  const attachmentHoleCapacityEq462Kip = 1.35 * boltDiameterIn * thicknessIn * fuKsi;
  const attachmentHoleEverydayWearLimitKip = 0.5 * boltDiameterIn * thicknessIn * fuKsi;
  const attachmentHoleGoverningKip = Math.min(attachmentHoleCapacityEq461Kip, attachmentHoleCapacityEq462Kip);

  const connShearUtil = (appliedConnectionShearKip / Math.max(0.1, governingConnectionCapacityKip)) * 100;
  const connTensionUtil =
    appliedConnectionTensionKip > 0
      ? (appliedConnectionTensionKip / Math.max(0.1, combinedBoltTensionCapacityKip)) * 100
      : 0;
  const connUtilPercent = Math.max(connShearUtil, connTensionUtil);

  // =========================================================================
  // 5. FOUNDATIONS, ANCHOR BOLTS & SHEAR CONNECTORS (Chapter 7 & Table 7.2-1)
  // =========================================================================
  const foundationContactCondition = input.foundationContactCondition || 'recessed_090';
  const frictionCoeffMu =
    foundationContactCondition === 'recessed_090'
      ? 0.9
      : foundationContactCondition === 'flush_070'
      ? 0.7
      : 0.55;

  const numAnchorBolts = safeNum(input.numAnchorBolts, 4, 1, 24);
  const anchorBoltDiamIn = safeNum(input.anchorBoltDiamIn, 1.5, 0.5, 4.0);
  const anchorBoltThreadsPerIn = safeNum(input.anchorBoltThreadsPerIn, 6, 4, 16);
  const anchorBoltFyKsi = safeNum(input.anchorBoltFyKsi, 50, 30, 120);
  const anchorBoltFuKsi = safeNum(input.anchorBoltFuKsi, 75, 50, 150);

  const foundationUpliftTKip = safeNum(input.foundationUpliftTKip, 120.0, 0, 5000);
  const foundationDownthrustDKip = safeNum(input.foundationDownthrustDKip, 150.0, 0, 5000);
  const foundationShearVKip = safeNum(input.foundationShearVKip, 35.0, 0, 2000);
  const concreteFcKsi = safeNum(input.concreteFcKsi, 4.0, 2.0, 12.0);
  const concreteEcKsi = safeNum(input.concreteEcKsi, 3605, 1500, 7000);

  // Stub angle in concrete pier per Section 7.4.1 Eq. (7.4-1): Aa = P / Fy + V / (0.75 Fy)
  const maxStubAxialKip = Math.max(foundationUpliftTKip, foundationDownthrustDKip);
  const stubAngleRequiredAreaIn2 = maxStubAxialKip / fyKsi + foundationShearVKip / (0.75 * fyKsi);
  const stubAngleUtilizationPercent = (stubAngleRequiredAreaIn2 / grossAreaIn2) * 100;

  // Anchor bolts with base assembly in contact with concrete/grout per Section 7.4.2 Eqs. (7.4-2), (7.4-3), (7.4-4)
  const anchorBoltSingleStressAreaIn2 =
    (Math.PI / 4) * Math.pow(anchorBoltDiamIn - 0.974 / anchorBoltThreadsPerIn, 2);
  const anchorBoltTotalProvidedAreaIn2 = numAnchorBolts * anchorBoltSingleStressAreaIn2;

  const anchorBoltRequiredAreaUpliftIn2 =
    foundationUpliftTKip / anchorBoltFyKsi +
    foundationShearVKip / (frictionCoeffMu * 0.85 * anchorBoltFyKsi);
  const anchorBoltRequiredAreaDownthrustIn2 = Math.max(
    0,
    (foundationShearVKip - 0.3 * foundationDownthrustDKip) / (frictionCoeffMu * 0.85 * anchorBoltFyKsi)
  );
  const anchorBoltGoverningRequiredAreaIn2 = Math.max(
    anchorBoltRequiredAreaUpliftIn2,
    anchorBoltRequiredAreaDownthrustIn2
  );
  const anchorBoltUtilizationPercent =
    (anchorBoltGoverningRequiredAreaIn2 / Math.max(0.1, anchorBoltTotalProvidedAreaIn2)) * 100;

  // Smooth bar concrete pull-out stress & minimum embedment per Section 7.5.2 & 7.5.2.1
  const phiPullout = 0.65;
  const concretePulloutStressKsi = 0.126 * phiPullout * Math.sqrt(concreteFcKsi);
  const minAnchorEmbedmentDepthIn = 12 * anchorBoltDiamIn * Math.sqrt(anchorBoltFuKsi / 58.0);

  // ACI 349 concrete side cover distances per Commentary C7.5 Eqs. (C7.5-1) and (C7.5-2) (with Fy and f'c in psi)
  const fyAnchorPsi = anchorBoltFyKsi * 1000;
  const fcPsi = concreteFcKsi * 1000;
  const aciSideCoverTensionMtIn = 0.66 * anchorBoltDiamIn * Math.sqrt(fyAnchorPsi / Math.sqrt(fcPsi));
  const aciSideCoverShearMsIn = 1.8 * anchorBoltDiamIn * Math.sqrt(fyAnchorPsi / Math.sqrt(fcPsi));

  // Stud Shear Connector per Section 7.6.1 Eq. (7.6-1): Qn = 0.5 * phi * Asc * sqrt(f'c * Ec)
  const studDiamIn = safeNum(input.studDiamIn, 0.75, 0.375, 1.5);
  const ascIn2 = (Math.PI / 4) * studDiamIn * studDiamIn;
  const studConnectorCapacityQnKip = 0.5 * 0.85 * ascIn2 * Math.sqrt(concreteFcKsi * concreteEcKsi);

  // Angle Shear Connector per Section 7.6.2 Eqs. (7.6-2) and (7.6-3)
  const connAngleBIn = safeNum(input.connectorAngleLengthBIn, 6.0, 1.0, 24.0);
  const connAngleWIn = safeNum(input.connectorAngleWidthWIn, 4.0, 1.5, 12.0);
  const connAngleTIn = safeNum(input.connectorAngleThickTIn, 0.375, 0.1875, 1.5);
  const connFilletRIn = safeNum(input.connectorFilletRIn, 0.375, 0.125, 1.0);

  const xCalcIn = connAngleTIn * Math.sqrt(fyKsi / (1.19 * concreteFcKsi));
  const xMaxIn = Math.max(0, connAngleWIn - connFilletRIn - connAngleTIn);
  const angleConnectorEffectiveXIn = Math.min(xCalcIn, xMaxIn);
  const angleConnectorCapacityPKip =
    1.19 * concreteFcKsi * connAngleBIn * (connAngleTIn + connFilletRIn + angleConnectorEffectiveXIn / 2);

  // =========================================================================
  // 6. OVERALL STATUS & AUDIT TRACE
  // =========================================================================
  const maxUtil = Math.max(
    compUtilPercent,
    tensionUtilPercent,
    governingInteractionRatio * 100,
    connUtilPercent,
    anchorBoltUtilizationPercent
  );
  const overallStatus: 'PASS' | 'MARGINAL' | 'OVERLOADED' =
    maxUtil > 100 || !isSlendernessCompliant || !isWTCompliant
      ? 'OVERLOADED'
      : maxUtil >= 90
      ? 'MARGINAL'
      : 'PASS';

  const citations = [
    formatCitation({ standard: 'ASCE 10-15', edition: '2015', clause: '3.6' }),
    formatCitation({ standard: 'ASCE 10-15', edition: '2015', clause: '3.7.3' }),
    formatCitation({ standard: 'ASCE 10-15', edition: '2015', clause: '3.7.4.2' }),
    formatCitation({ standard: 'ASCE 10-15', edition: '2015', table: '3.4-1' }),
    formatCitation({ standard: 'ASCE 10-15', edition: '2015', clause: '3.10.2' }),
    formatCitation({ standard: 'ASCE 10-15', edition: '2015', clause: '3.12' }),
    formatCitation({ standard: 'ASCE 10-15', edition: '2015', clause: '3.16' }),
    formatCitation({ standard: 'ASCE 10-15', edition: '2015', clause: '4.5.1' }),
    formatCitation({ standard: 'ASCE 10-15', edition: '2015', table: 'C4-1' }),
    formatCitation({ standard: 'ASCE 10-15', edition: '2015', clause: '7.4.2' }),
    formatCitation({ standard: 'ASCE 10-15', edition: '2015', table: '7.2-1' })
  ];

  const trace = createTraceRecord({
    calculatorId: 'asce_10_15_tower_design',
    snapshotVersion: 'ASCE/SEI 10-15',
    inputs: {
      steelGrade: steelGrade.spec,
      fyKsi,
      fuKsi,
      legWidthIn,
      thicknessIn,
      grossAreaIn2,
      unbracedLengthIn,
      bracingCurve
    },
    steps: [
      {
        op: 'formula',
        ref: 'ASCE 10-15 Cl. 3.7.3 Eq. (3.7-1)–(3.7-3)',
        description: `Local buckling critical stress $F_{cr}$ ($w/t = ${round(wOverT, 2)}$ vs $(w/t)_{\\lim} = ${round(wOverTLim, 2)}$)`,
        value: round(fcrKsi, 2),
        unit: 'ksi',
        latex:
          wOverT <= wOverTLim
            ? `\\frac{w}{t} = \\frac{${round(flatWidthWIn, 3)}}{${thicknessIn}} = ${round(wOverT, 2)} \\le \\left(\\frac{w}{t}\\right)_{\\lim} = \\frac{80}{\\sqrt{${fyKsi}}} = ${round(wOverTLim, 2)} \\implies F_{cr} = F_y = ${round(fcrKsi, 2)}\\text{ ksi}`
            : wOverT <= wOverTElasticLimit
            ? `F_{cr} = \\left[1.677 - 0.677 \\left(\\frac{${round(wOverT, 2)}}{${round(wOverTLim, 2)}}\\right)\\right] \\times ${fyKsi} = ${round(fcrKsi, 2)}\\text{ ksi}`
            : `F_{cr} = \\frac{0.0332 \\pi^2 (${eKsi})}{(${round(wOverT, 2)})^2} = ${round(fcrKsi, 2)}\\text{ ksi}`
      },
      {
        op: 'formula',
        ref: 'ASCE 10-15 Cl. 3.7.4 & Table 3.4-1',
        description: `Effective slenderness ratio $\\frac{KL}{r}$ (${bracingCurve}, $\\frac{L}{r} = ${round(lOverR, 1)}$)`,
        value: round(effectiveKLOverR, 1),
        unit: '',
        latex: `\\frac{L}{r} = \\frac{${unbracedLengthIn}}{${round(governingRadiusRIn, 3)}} \\times ${round(subpanelFactorKPrime, 2)} = ${round(lOverR, 1)} \\implies \\frac{KL}{r} = ${round(effectiveKLOverR, 1)}, \\quad C_c = \\pi\\sqrt{\\frac{2(${eKsi})}{${round(fcrKsi, 2)}}} = ${round(cc, 1)}`
      },
      {
        op: 'formula',
        ref: 'ASCE 10-15 Cl. 3.6 Eq. (3.6-1)–(3.6-3)',
        description: `Design compressive stress $F_a = ${round(faKsi, 2)}\\text{ ksi}$ (${bucklingRegime}) and axial capacity $P_a = F_a A_e$`,
        value: round(capacityPaKip, 2),
        unit: 'kip',
        latex:
          effectiveKLOverR <= cc
            ? `F_a = \\left[1 - \\frac{1}{2}\\left(\\frac{${round(effectiveKLOverR, 1)}}{${round(cc, 1)}}\\right)^2\\right] (${round(fcrKsi, 2)}) = ${round(faKsi, 2)}\\text{ ksi} \\implies P_a = ${round(faKsi, 2)} \\times ${round(effectiveAreaIn2, 3)} = ${round(capacityPaKip, 2)}\\text{ kips}`
            : `F_a = \\frac{\\pi^2 (${eKsi})}{(${round(effectiveKLOverR, 1)})^2} = ${round(faKsi, 2)}\\text{ ksi} \\implies P_a = ${round(faKsi, 2)} \\times ${round(effectiveAreaIn2, 3)} = ${round(capacityPaKip, 2)}\\text{ kips}`
      },
      {
        op: 'formula',
        ref: 'ASCE 10-15 Cl. 3.10.2 Eq. (3.10-1)',
        description: `Tension capacity $\\min(P_t, P_{bs})$ ($P_t = ${round(netTensionCapacityKip, 1)}\\text{ kip}$, $P_{bs} = ${round(blockShearCapacityKip, 1)}\\text{ kip}$)`,
        value: round(governingTensionCapacityKip, 2),
        unit: 'kip',
        latex: `P_t = A_n F_t = (${round(netAreaAnIn2, 3)})(${round(designStressFtKsi, 2)}) = ${round(netTensionCapacityKip, 2)}\\text{ kips}, \\quad P_{bs} = 0.60(${round(netShearAreaAvIn2, 3)})(${fuKsi}) + (${round(netTensionAreaAtIn2, 3)})(${fyKsi}) = ${round(blockShearCapacityKip, 2)}\\text{ kips}`
      },
      {
        op: 'formula',
        ref: 'ASCE 10-15 Cl. 3.12–3.14 Eq. (3.12-1)–(3.14-11)',
        description: `Combined axial + bending interaction ratio and lateral-torsional buckling moment $M_b$`,
        value: round(governingInteractionRatio, 3),
        unit: 'ratio',
        latex: `\\frac{P}{P_a} + \\frac{C_m M_x}{M_{ax}(1 - P/P_{ex})} + \\frac{C_m M_y}{M_{ay}(1 - P/P_{ey})} = ${round(compressionStabilityRatio, 3)} \\le 1.0, \\quad M_b = ${round(lateralBucklingMomentMbInKip, 1)}\\text{ kip}\\cdot\\text{in.}`
      },
      {
        op: 'formula',
        ref: 'ASCE 10-15 Cl. 4.3–4.5 & Table C4-1',
        description: `Bolted connection capacity ($n = ${numConnectionBolts}$ bolts, $e_{\\min} = ${round(eMinGoverningIn, 2)}\\text{ in.}$, $s_{\\min} = ${round(sMinGoverningIn, 2)}\\text{ in.}$, $f_{\\min} = ${round(fMinGoverningIn, 2)}\\text{ in.}$)`,
        value: round(governingConnectionCapacityKip, 2),
        unit: 'kip',
        latex: `V_{\\text{bolt}} = ${numConnectionBolts} \\times ${round(singleBoltShearCapacityKip, 2)} = ${round(totalBoltShearCapacityKip, 2)}\\text{ kips}, \\quad P_{\\text{brg}} = 1.5 n d t F_u = ${round(totalBearingCapacityKip, 2)}\\text{ kips}, \\quad F_{t(v)} = F_t\\sqrt{1 - (f_v/F_v)^2} = ${round(combinedAllowableTensionStressFtVKsi, 2)}\\text{ ksi}`
      },
      {
        op: 'formula',
        ref: 'ASCE 10-15 Cl. 7.4.2 & Table 7.2-1',
        description: `Foundation anchor bolt required area $A_{s,\\text{req}}$ ($\\mu = ${frictionCoeffMu}$) vs provided $A_s = ${round(anchorBoltTotalProvidedAreaIn2, 2)}\\text{ in.}^2$`,
        value: round(anchorBoltGoverningRequiredAreaIn2, 2),
        unit: 'in.^2',
        latex: `A_{s,\\text{uplift}} = \\frac{T}{F_y} + \\frac{V}{0.85 \\mu F_y} = \\frac{${foundationUpliftTKip}}{${anchorBoltFyKsi}} + \\frac{${foundationShearVKip}}{0.85(${frictionCoeffMu})(${anchorBoltFyKsi})} = ${round(anchorBoltRequiredAreaUpliftIn2, 2)}\\text{ in.}^2`
      }
    ],
    result: {
      capacityPaKip: round(capacityPaKip, 2),
      governingTensionCapacityKip: round(governingTensionCapacityKip, 2),
      governingConnectionCapacityKip: round(governingConnectionCapacityKip, 2),
      overallStatus
    },
    citations,
    notes: [
      `Compression regime: ${bucklingRegime.toUpperCase()} ($\\frac{KL}{r} = ${round(effectiveKLOverR, 1)}$ vs $C_c = ${round(cc, 1)}$).`,
      `Required redundant bracing force $P_r = ${round(redundantForcePrKip, 2)}\\text{ kips}$ ($${round(redundantForcePrKN, 2)}\\text{ kN}$) per Eq. (3.16-1).`,
      `Minimum connection distances: $e_{\\min} = ${round(eMinGoverningIn, 2)}\\text{ in.}$, $s_{\\min} = ${round(sMinGoverningIn, 2)}\\text{ in.}$, $f_{\\min} = ${round(fMinGoverningIn, 2)}\\text{ in.}$`
    ]
  });

  const izIn4 = grossAreaIn2 * rzIn * rzIn;
  const iuIn4 = grossAreaIn2 * ruIn * ruIn;
  const { sxIn3, syIn3 } = computeAngleElasticModuli(
    legWidthIn,
    shortLegWidthIn,
    thicknessIn,
    ixIn4,
    iyIn4,
    crossSectionType
  );
  const unitWeightPlf = safeNum(
    input.unitWeightPlf,
    selectedSection?.unitWeightPlf ?? grossAreaIn2 * 3.4028,
    0.1,
    1000
  );
  const unitWeightNm = selectedSection?.unitWeightNm ?? unitWeightPlf / 0.068521766;
  const memberWeightLb = unitWeightPlf * (unbracedLengthIn / 12);

  let maxStitchSpacingIn: number | null = null;
  if (isDoubleAngle) {
    const singleMatch = selectedSection?.angleSize
      ? ASCE_ANGLE_SECTIONS.find(
          (s) => !s.isDoubleAngle && s.angleSize === selectedSection.angleSize
        )
      : undefined;
    const singleRzIn = singleMatch?.rzIn ?? Math.max(0.1, 0.198 * shortLegWidthIn);
    maxStitchSpacingIn = Math.min(unbracedLengthIn, 0.75 * effectiveKLOverR * singleRzIn);
  }

  const sectionProperties: AsceSectionPropertiesSummary = {
    sectionId: selectedSection?.id || input.sectionId || 'CUSTOM',
    designation:
      selectedSection?.designation ||
      `L${legWidthIn}x${shortLegWidthIn}x${thicknessIn} (${crossSectionType})`,
    angleType: selectedSection?.angleType || 'CUSTOM',
    crossSectionType,
    isDoubleAngle,
    legLongIn: round(legWidthIn, 4),
    legShortIn: round(shortLegWidthIn, 4),
    thicknessIn: round(thicknessIn, 4),
    filletRadiusIn: round(filletRadiusIn, 4),
    legLongCm: selectedSection?.legLongCm ?? round(legWidthIn * 2.54, 2),
    legShortCm: selectedSection?.legShortCm ?? round(shortLegWidthIn * 2.54, 2),
    thicknessCm: selectedSection?.thicknessCm ?? round(thicknessIn * 2.54, 3),
    grossAreaIn2: round(grossAreaIn2, 3),
    grossAreaCm2: selectedSection?.grossAreaCm2 ?? round(grossAreaIn2 * 6.4516, 2),
    rxIn: round(rxIn, 3),
    ryIn: round(ryIn, 3),
    rzIn: round(rzIn, 3),
    ruIn: round(ruIn, 3),
    ixIn4: round(ixIn4, 3),
    iyIn4: round(iyIn4, 3),
    izIn4: round(izIn4, 3),
    iuIn4: round(iuIn4, 3),
    sxIn3: round(sxIn3, 3),
    syIn3: round(syIn3, 3),
    wOverT: round(wOverT, 2),
    unitWeightPlf: round(unitWeightPlf, 2),
    unitWeightNm: round(unitWeightNm, 1),
    memberWeightLb: round(memberWeightLb, 1),
    windWidthIn: selectedSection?.windWidthIn ?? round(legWidthIn, 3),
    shortEdgeDistIn: selectedSection?.shortEdgeDistIn ?? round(shortLegWidthIn, 3),
    maxStitchSpacingIn: maxStitchSpacingIn !== null ? round(maxStitchSpacingIn, 2) : null
  };

  return {
    sectionProperties,
    compression: {
      flatWidthWIn: round(flatWidthWIn, 4),
      wOverT: round(wOverT, 2),
      wOverTMaxAllowed,
      wOverTLim: round(wOverTLim, 2),
      wOverTElasticLimit: round(wOverTElasticLimit, 2),
      localBucklingRegime,
      fcrKsi: round(fcrKsi, 2),
      fcrMPa: round(fcrKsi * KSI_TO_MPA, 1),
      subpanelFactorKPrime: round(subpanelFactorKPrime, 3),
      governingRadiusRIn: round(governingRadiusRIn, 3),
      rtIn: rtIn !== null ? round(rtIn, 3) : null,
      rtfIn: rtfIn !== null ? round(rtfIn, 3) : null,
      minLipDepthIn: minLipDepthIn !== null ? round(minLipDepthIn, 2) : null,
      lOverR: round(lOverR, 1),
      effectiveKLOverR: round(effectiveKLOverR, 1),
      maxAllowedSlenderness,
      isSlendernessCompliant,
      isWTCompliant,
      cc: round(cc, 1),
      bucklingRegime,
      faKsi: round(faKsi, 2),
      faMPa: round(faKsi * KSI_TO_MPA, 1),
      effectiveWidthBIn: round(effectiveWidthBIn, 3),
      effectiveAreaIn2: round(effectiveAreaIn2, 3),
      capacityPaKip: round(capacityPaKip, 2),
      capacityPaKN: round(capacityPaKN, 2),
      appliedCompressionKip: round(appliedCompressionKip, 2),
      utilizationPercent: round(compUtilPercent, 1),
      isPassing: compUtilPercent <= 100 && isSlendernessCompliant && isWTCompliant,
      redundantForcePrKip: round(redundantForcePrKip, 2),
      redundantForcePrKN: round(redundantForcePrKN, 2),
      curvePoints
    },
    tension: {
      nominalHoleDiamIn: round(nominalHoleDiamIn, 4),
      effectiveHoleDiamIn: round(effectiveHoleDiamIn, 4),
      staggerAdditionIn: round(staggerAdditionIn, 3),
      netAreaAnIn2: round(netAreaAnIn2, 3),
      stressFactor,
      designStressFtKsi: round(designStressFtKsi, 2),
      netTensionCapacityKip: round(netTensionCapacityKip, 2),
      netTensionCapacityKN: round(netTensionCapacityKip * KIP_TO_KN, 2),
      netShearAreaAvIn2: round(netShearAreaAvIn2, 3),
      netTensionAreaAtIn2: round(netTensionAreaAtIn2, 3),
      blockShearCapacityKip: round(blockShearCapacityKip, 2),
      blockShearCapacityKN: round(blockShearCapacityKip * KIP_TO_KN, 2),
      governingTensionCapacityKip: round(governingTensionCapacityKip, 2),
      governingTensionCapacityKN: round(governingTensionCapacityKip * KIP_TO_KN, 2),
      governingMode,
      threadedRodStressAreaIn2: round(threadedRodStressAreaIn2, 3),
      threadedRodCapacityKip: round(threadedRodCapacityKip, 2),
      guyDesignCapacityKip: round(guyDesignCapacityKip, 2),
      guyUtilizationPercent: round(guyUtilizationPercent, 1),
      appliedTensionKip: round(appliedTensionKip, 2),
      utilizationPercent: round(tensionUtilPercent, 1),
      isPassing: tensionUtilPercent <= 100
    },
    combinedAndBeams: {
      yieldMomentMyInKip: round(yieldMomentMyInKip, 2),
      elasticCriticalMomentMeInKip: round(elasticCriticalMomentMeInKip, 2),
      lateralBucklingMomentMbInKip: round(lateralBucklingMomentMbInKip, 2),
      governingAllowableMomentInKip: round(maxAllowableInKip, 2),
      eulerBucklingPexKip: round(eulerBucklingPexKip, 1),
      eulerBucklingPeyKip: round(eulerBucklingPeyKip, 1),
      yieldCompressionPyKip: round(yieldCompressionPyKip, 1),
      compressionStabilityRatio: round(compressionStabilityRatio, 3),
      compressionYieldRatio: round(compressionYieldRatio, 3),
      tensionBendingRatio: round(tensionBendingRatio, 3),
      governingInteractionRatio: round(governingInteractionRatio, 3),
      interactionPercent: round(governingInteractionRatio * 100, 1),
      webHOverT: round(webHOverT, 1),
      allowableShearStressFvKsi: round(allowableShearStressFvKsi, 2),
      shearCapacityVkip: round(shearCapacityVkip, 2),
      shearUtilizationPercent: round(shearUtilizationPercent, 1),
      isPassing: governingInteractionRatio <= 1.0 && shearUtilizationPercent <= 100 && webHOverT <= 200
    },
    connections: {
      boltStressAreaAsIn2: round(boltStressAreaAsIn2, 3),
      boltGrossAreaIn2: round(boltGrossAreaIn2, 3),
      boltRootAreaIn2: round(boltRootAreaIn2, 3),
      singleBoltShearCapacityKip: round(singleBoltShearCapacityKip, 2),
      totalBoltShearCapacityKip: round(totalBoltShearCapacityKip, 2),
      singleBoltTensionCapacityKip: round(singleBoltTensionCapacityKip, 2),
      totalBoltTensionCapacityKip: round(totalBoltTensionCapacityKip, 2),
      appliedBoltShearStressKsi: round(appliedBoltShearStressKsi, 2),
      combinedAllowableTensionStressFtVKsi: round(combinedAllowableTensionStressFtVKsi, 2),
      combinedBoltTensionCapacityKip: round(combinedBoltTensionCapacityKip, 2),
      allowableBearingStressKsi: round(allowableBearingStressKsi, 2),
      singleBoltBearingCapacityKip: round(singleBoltBearingCapacityKip, 2),
      totalBearingCapacityKip: round(totalBearingCapacityKip, 2),
      governingConnectionCapacityKip: round(governingConnectionCapacityKip, 2),
      governingConnectionCapacityKN: round(governingConnectionCapacityKip * KIP_TO_KN, 2),
      governingConnectionMode,
      boltForcePKip: round(boltForcePKip, 2),
      eEq451In: round(eEq451In, 2),
      eEq452In: round(eEq452In, 2),
      eEq453In: round(eEq453In, 2),
      eMinGoverningIn: round(eMinGoverningIn, 2),
      sMinStrengthEq455In: round(sMinStrengthEq455In, 2),
      sMinErectionIn: round(sMinErectionIn, 2),
      sMinGoverningIn: round(sMinGoverningIn, 2),
      fMinRolledEq456In: round(fMinRolledEq456In, 2),
      fMinShearedEq457In: round(fMinShearedEq457In, 2),
      fMinGoverningIn: round(fMinGoverningIn, 2),
      attachmentHoleCapacityEq461Kip: round(attachmentHoleCapacityEq461Kip, 2),
      attachmentHoleCapacityEq462Kip: round(attachmentHoleCapacityEq462Kip, 2),
      attachmentHoleEverydayWearLimitKip: round(attachmentHoleEverydayWearLimitKip, 2),
      attachmentHoleGoverningKip: round(attachmentHoleGoverningKip, 2),
      areDistancesCompliant,
      utilizationPercent: round(connUtilPercent, 1),
      isPassing: connUtilPercent <= 100 && areDistancesCompliant
    },
    foundations: {
      stubAngleRequiredAreaIn2: round(stubAngleRequiredAreaIn2, 2),
      stubAngleUtilizationPercent: round(stubAngleUtilizationPercent, 1),
      frictionCoeffMu,
      anchorBoltSingleStressAreaIn2: round(anchorBoltSingleStressAreaIn2, 3),
      anchorBoltTotalProvidedAreaIn2: round(anchorBoltTotalProvidedAreaIn2, 2),
      anchorBoltRequiredAreaUpliftIn2: round(anchorBoltRequiredAreaUpliftIn2, 2),
      anchorBoltRequiredAreaDownthrustIn2: round(anchorBoltRequiredAreaDownthrustIn2, 2),
      anchorBoltGoverningRequiredAreaIn2: round(anchorBoltGoverningRequiredAreaIn2, 2),
      anchorBoltUtilizationPercent: round(anchorBoltUtilizationPercent, 1),
      concretePulloutStressKsi: round(concretePulloutStressKsi, 3),
      minAnchorEmbedmentDepthIn: round(minAnchorEmbedmentDepthIn, 2),
      aciSideCoverTensionMtIn: round(aciSideCoverTensionMtIn, 2),
      aciSideCoverShearMsIn: round(aciSideCoverShearMsIn, 2),
      studConnectorCapacityQnKip: round(studConnectorCapacityQnKip, 2),
      angleConnectorEffectiveXIn: round(angleConnectorEffectiveXIn, 2),
      angleConnectorCapacityPKip: round(angleConnectorCapacityPKip, 2),
      isPassing: anchorBoltUtilizationPercent <= 100 && stubAngleUtilizationPercent <= 100
    },
    overallStatus,
    trace
  };
}

function designStressFtKip(ftKsi: number, areaIn2: number): number {
  return ftKsi * areaIn2;
}
