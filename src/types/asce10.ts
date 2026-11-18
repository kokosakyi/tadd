import type { CalcTraceRecord } from './trace';

export type AsceMemberCategory = 'leg' | 'other_compression' | 'redundant' | 'tension_only';

export type AsceBracingCurveId =
  | 'curve_1_leg'
  | 'curve_1_concentric'
  | 'curve_2_one_eccentric'
  | 'curve_3_both_eccentric'
  | 'curve_4_unrestrained'
  | 'curve_5_one_restrained'
  | 'curve_6_both_restrained';

export type AsceSectionType = 'equal_angle' | 'unequal_angle' | 'lipped_angle' | 'wide_flange_or_other';

export interface AsceSteelGrade {
  id: string;
  name: string;
  spec: string;
  fyKsi: number;
  fuKsi: number;
  fyMPa: number;
  fuMPa: number;
}

export type AsceAngleType = 'SAE' | 'SAU' | 'SAW' | 'DAE' | 'DAL' | 'DAS';
export type AsceCrossSectionType = 'Single' | 'DoubleLBB' | 'DoubleSBB';

export interface AsceAngleSection {
  id: string;
  designation: string;
  rowNumber?: number;
  angleType?: AsceAngleType;
  angleSize?: string;
  crossSectionType?: AsceCrossSectionType;
  isDoubleAngle?: boolean;
  legLongIn: number;
  legShortIn: number;
  thicknessIn: number;
  filletRadiusIn: number;
  areaIn2: number;
  rzIn: number;
  rxIn: number;
  ryIn: number;
  ruIn: number;
  wOverTRatio?: number;
  unitWeightNm?: number;
  unitWeightPlf?: number;
  legLongCm?: number;
  legShortCm?: number;
  thicknessCm?: number;
  grossAreaCm2?: number;
  rxCm?: number;
  ryCm?: number;
  rzCm?: number;
  windWidthCm?: number;
  windWidthIn?: number;
  shortEdgeDistCm?: number;
  shortEdgeDistIn?: number;
  optimizeCostFactor?: number;
}

export interface AsceBoltSpec {
  id: string;
  name: string;
  fuKsi: number;
  fvThreadsKsi: number;
  fvShankKsi: number;
  ftProofKsi: number;
}

export interface AsceDesignInput {
  // 1. Material & Section Geometry
  steelGradeId?: string;
  sectionId?: string;
  fyKsi?: number;
  fuKsi?: number;
  modulusEKsi?: number;
  sectionType?: AsceSectionType;
  crossSectionType?: AsceCrossSectionType;
  isDoubleAngle?: boolean;
  unitWeightPlf?: number;
  legWidthIn?: number;
  shortLegWidthIn?: number;
  thicknessIn?: number;
  filletRadiusIn?: number;
  grossAreaIn2?: number;
  rzIn?: number;
  rxIn?: number;
  ryIn?: number;
  ruIn?: number;
  bendRadiusMultiplier?: number; // Inside bend radius for cold-formed (max 2t per Sec. 3.5)
  isColdFormed?: boolean;

  // Lipped angle torsional-flexural inputs (Sec. 3.8)
  lipDepthIn?: number;
  lipAngleDeg?: number;
  warpingConstantCwIn6?: number;
  torsionConstantJIn4?: number;
  polarInertiaIpsIn4?: number;
  shearCenterDistUoIn?: number;

  // 2. Compression & Slenderness Inputs (Sec. 3.4, 3.6, 3.7, 3.16)
  memberCategory?: AsceMemberCategory;
  bracingCurve?: AsceBracingCurveId;
  unbracedLengthIn?: number;
  appliedCompressionKip?: number;
  enableSubpanelVaryingForce?: boolean;
  subpanelForceP1Kip?: number; // Compression (+)
  subpanelForceP2Kip?: number; // Compression (+) or Tension (-)

  // 3. Tension & Block Shear Inputs (Sec. 3.10)
  appliedTensionKip?: number;
  tensionConnType?: 'both_legs' | 'one_leg' | 'short_leg_unequal';
  holeMethod?: 'punched' | 'drilled';
  boltDiameterIn?: number;
  threadsPerInch?: number;
  holeDiameterIn?: number;
  numHolesAcrossChain?: number;
  staggerPitchSIn?: number;
  staggerGaugeGIn?: number;
  numStaggerSpaces?: number;
  // Block shear geometry (Fig. 3-5, Eq. 3.10-1)
  endDistAIn?: number;
  spacingBIn?: number;
  numBoltsInLine?: number;
  toeDistCIn?: number;
  // Guy cable check (Sec. 3.10.5)
  guyBreakingStrengthKip?: number;
  appliedGuyTensionKip?: number;

  // 4. Combined Axial + Bending & Shear Inputs (Sec. 3.12–3.15)
  appliedMomentMxInKip?: number;
  appliedMomentMyInKip?: number;
  allowableMomentMaxInKip?: number;
  allowableMomentMayInKip?: number;
  cmFactor?: number;
  loadAngleThetaDeg?: number;
  beamEffectiveK?: number;
  webDepthHIn?: number;
  appliedShearVKip?: number;

  // 5. Bolted Connections & Minimum Distances (Ch. 4 & Table C4-1)
  boltSpecId?: string;
  boltFuKsi?: number;
  threadsInShearPlane?: boolean;
  numConnectionBolts?: number;
  numShearPlanes?: number;
  appliedConnectionShearKip?: number;
  appliedConnectionTensionKip?: number;
  edgeType?: 'rolled' | 'sheared_or_flame_cut';
  nutWidthAcrossPointsIn?: number;
  actualEndDistIn?: number;
  actualSpacingIn?: number;
  actualEdgeDistIn?: number;
  attachmentHoleDiamIn?: number;
  attachmentEdgeDistLIn?: number;

  // 6. Foundation Anchorage & Shear Connectors (Ch. 7 & Table 7.2-1)
  foundationContactCondition?: 'recessed_090' | 'flush_070' | 'grouted_055';
  numAnchorBolts?: number;
  anchorBoltDiamIn?: number;
  anchorBoltThreadsPerIn?: number;
  anchorBoltFyKsi?: number;
  anchorBoltFuKsi?: number;
  foundationUpliftTKip?: number;
  foundationDownthrustDKip?: number;
  foundationShearVKip?: number;
  concreteFcKsi?: number;
  concreteEcKsi?: number;
  studDiamIn?: number;
  connectorAngleLengthBIn?: number;
  connectorAngleWidthWIn?: number;
  connectorAngleThickTIn?: number;
  connectorFilletRIn?: number;
}

export interface AsceSectionPropertiesSummary {
  sectionId: string;
  designation: string;
  angleType: AsceAngleType | 'CUSTOM';
  crossSectionType: AsceCrossSectionType;
  isDoubleAngle: boolean;
  legLongIn: number;
  legShortIn: number;
  thicknessIn: number;
  filletRadiusIn: number;
  legLongCm: number;
  legShortCm: number;
  thicknessCm: number;
  grossAreaIn2: number;
  grossAreaCm2: number;
  rxIn: number;
  ryIn: number;
  rzIn: number;
  ruIn: number;
  ixIn4: number;
  iyIn4: number;
  izIn4: number;
  iuIn4: number;
  sxIn3: number;
  syIn3: number;
  wOverT: number;
  unitWeightPlf: number;
  unitWeightNm: number;
  memberWeightLb: number;
  windWidthIn: number;
  shortEdgeDistIn: number;
  maxStitchSpacingIn: number | null;
}

export interface AsceDesignResult {
  sectionProperties: AsceSectionPropertiesSummary;
  compression: {
    flatWidthWIn: number;
    wOverT: number;
    wOverTMaxAllowed: number;
    wOverTLim: number;
    wOverTElasticLimit: number;
    localBucklingRegime: 'fully_effective' | 'inelastic_local_buckling' | 'elastic_local_buckling';
    fcrKsi: number;
    fcrMPa: number;
    subpanelFactorKPrime: number;
    governingRadiusRIn: number;
    rtIn: number | null;
    rtfIn: number | null;
    minLipDepthIn: number | null;
    lOverR: number;
    effectiveKLOverR: number;
    maxAllowedSlenderness: number;
    isSlendernessCompliant: boolean;
    isWTCompliant: boolean;
    cc: number;
    bucklingRegime: 'inelastic' | 'elastic';
    faKsi: number;
    faMPa: number;
    effectiveWidthBIn: number;
    effectiveAreaIn2: number;
    capacityPaKip: number;
    capacityPaKN: number;
    appliedCompressionKip: number;
    utilizationPercent: number;
    isPassing: boolean;
    redundantForcePrKip: number;
    redundantForcePrKN: number;
    curvePoints: Array<{ lOverR: number; klOverR: number; faKsi: number; paKip: number }>;
  };
  tension: {
    nominalHoleDiamIn: number;
    effectiveHoleDiamIn: number;
    staggerAdditionIn: number;
    netAreaAnIn2: number;
    stressFactor: number;
    designStressFtKsi: number;
    netTensionCapacityKip: number;
    netTensionCapacityKN: number;
    netShearAreaAvIn2: number;
    netTensionAreaAtIn2: number;
    blockShearCapacityKip: number;
    blockShearCapacityKN: number;
    governingTensionCapacityKip: number;
    governingTensionCapacityKN: number;
    governingMode: 'net_section_yield' | 'block_shear_rupture';
    threadedRodStressAreaIn2: number;
    threadedRodCapacityKip: number;
    guyDesignCapacityKip: number;
    guyUtilizationPercent: number;
    appliedTensionKip: number;
    utilizationPercent: number;
    isPassing: boolean;
  };
  combinedAndBeams: {
    yieldMomentMyInKip: number;
    elasticCriticalMomentMeInKip: number;
    lateralBucklingMomentMbInKip: number;
    governingAllowableMomentInKip: number;
    eulerBucklingPexKip: number;
    eulerBucklingPeyKip: number;
    yieldCompressionPyKip: number;
    compressionStabilityRatio: number;
    compressionYieldRatio: number;
    tensionBendingRatio: number;
    governingInteractionRatio: number;
    interactionPercent: number;
    webHOverT: number;
    allowableShearStressFvKsi: number;
    shearCapacityVkip: number;
    shearUtilizationPercent: number;
    isPassing: boolean;
  };
  connections: {
    boltStressAreaAsIn2: number;
    boltGrossAreaIn2: number;
    boltRootAreaIn2: number;
    singleBoltShearCapacityKip: number;
    totalBoltShearCapacityKip: number;
    singleBoltTensionCapacityKip: number;
    totalBoltTensionCapacityKip: number;
    appliedBoltShearStressKsi: number;
    combinedAllowableTensionStressFtVKsi: number;
    combinedBoltTensionCapacityKip: number;
    allowableBearingStressKsi: number;
    singleBoltBearingCapacityKip: number;
    totalBearingCapacityKip: number;
    governingConnectionCapacityKip: number;
    governingConnectionCapacityKN: number;
    governingConnectionMode: string;
    boltForcePKip: number;
    eEq451In: number;
    eEq452In: number;
    eEq453In: number;
    eMinGoverningIn: number;
    sMinStrengthEq455In: number;
    sMinErectionIn: number;
    sMinGoverningIn: number;
    fMinRolledEq456In: number;
    fMinShearedEq457In: number;
    fMinGoverningIn: number;
    attachmentHoleCapacityEq461Kip: number;
    attachmentHoleCapacityEq462Kip: number;
    attachmentHoleEverydayWearLimitKip: number;
    attachmentHoleGoverningKip: number;
    areDistancesCompliant: boolean;
    utilizationPercent: number;
    isPassing: boolean;
  };
  foundations: {
    stubAngleRequiredAreaIn2: number;
    stubAngleUtilizationPercent: number;
    frictionCoeffMu: number;
    anchorBoltSingleStressAreaIn2: number;
    anchorBoltTotalProvidedAreaIn2: number;
    anchorBoltRequiredAreaUpliftIn2: number;
    anchorBoltRequiredAreaDownthrustIn2: number;
    anchorBoltGoverningRequiredAreaIn2: number;
    anchorBoltUtilizationPercent: number;
    concretePulloutStressKsi: number;
    minAnchorEmbedmentDepthIn: number;
    aciSideCoverTensionMtIn: number;
    aciSideCoverShearMsIn: number;
    studConnectorCapacityQnKip: number;
    angleConnectorEffectiveXIn: number;
    angleConnectorCapacityPKip: number;
    isPassing: boolean;
  };
  overallStatus: 'PASS' | 'MARGINAL' | 'OVERLOADED';
  trace: CalcTraceRecord;
}
