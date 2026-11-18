import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Activity,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Anchor,
  Wrench,
  Compass,
  Calculator
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import {
  calculateAsce10Design,
  computeCompressiveStressFaKsi,
  findAsceAngleSection,
  getAllAsceSteelGrades,
  getAllAsceAngleSections,
  getAllAsceBoltSpecs,
  getAllAsceBracingCurves
} from '../../core/asce10/asce10Engine';
import TraceViewer from '../common/TraceViewer';
import Latex from '../common/Latex';
import CalculatorWorkspaceShell from '../common/CalculatorWorkspaceShell';

const MEMBER_CATEGORIES = [
  { id: 'leg', label: 'Leg Member (Primary Compression, L/r <= 150)' },
  { id: 'other_compression', label: 'Other Compression Member (Bracing / Strut, KL/r <= 200)' },
  { id: 'redundant', label: 'Redundant Member (Unstressed Bracing, KL/r <= 250)' },
  { id: 'tension_only', label: 'Tension-Only Hanger Member (300 < L/r <= 500)' }
].sort((a, b) => a.label.localeCompare(b.label));

const CONNECTION_TYPES = [
  { id: 'both_legs', label: 'Concentric / Both Legs Connected (Ft = Fy)' },
  { id: 'one_leg', label: 'Single Leg Connected by Bolts or Welds (Ft = 0.90 Fy)' },
  { id: 'short_leg_unequal', label: 'Short Leg of Unequal Angle Connected (Ft = 0.90 Fy, Reduced Area)' }
].sort((a, b) => a.label.localeCompare(b.label));

const HOLE_FABRICATION_OPTIONS = [
  { id: 'drilled', label: 'Drilled / Reamed Holes (Actual Hole Diameter)' },
  { id: 'punched', label: 'Punched Holes (+1/16 in. Damage Allowance, Sec. 3.10.1)' }
].sort((a, b) => a.label.localeCompare(b.label));

const EDGE_TYPE_OPTIONS = [
  { id: 'rolled', label: 'Rolled Steel Edge (f_min = 0.85 e_min, Eq. 4.5-6)' },
  { id: 'sheared_or_flame_cut', label: 'Sheared or Flame-Cut Edge (f_min = 0.85 e_min + 1/16 in., Eq. 4.5-7)' }
].sort((a, b) => a.label.localeCompare(b.label));

const CONTACT_CONDITIONS = [
  { id: 'flush_070', label: 'Base Flush on Concrete or Grout (mu = 0.70)' },
  { id: 'grouted_055', label: 'Base on Leveling Nuts with Grout / Shims (mu = 0.55)' },
  { id: 'recessed_090', label: 'Base Recessed / Partially Embedded in Concrete (mu = 0.90)' }
].sort((a, b) => a.label.localeCompare(b.label));

const ANGLE_TYPE_FILTER_OPTIONS = [
  { id: 'ALL', label: 'All Angle Types (427 Excel Sections)' },
  { id: 'DAE', label: 'DAE — Double Angle Equal (DoubleLBB)' },
  { id: 'DAL', label: 'DAL — Double Angle Unequal (DoubleLBB)' },
  { id: 'DAS', label: 'DAS — Double Angle Unequal (DoubleSBB)' },
  { id: 'SAE', label: 'SAE — Single Angle Equal' },
  { id: 'SAU', label: 'SAU — Single Angle Unequal' },
  { id: 'SAW', label: 'SAW — Single Angle Welded Equal' }
].sort((a, b) => a.label.localeCompare(b.label));

const SUB_TABS = [
  { id: 'compression', label: 'Compression & Buckling (Sec. 3.6–3.9)' },
  { id: 'tension', label: 'Tension & Block Shear (Sec. 3.10)' },
  { id: 'combined', label: 'Combined & Bending (Sec. 3.12–3.15)' },
  { id: 'connections', label: 'Bolts & Spacing (Ch. 4)' },
  { id: 'foundations', label: 'Foundations & Anchors (Ch. 7)' }
];

const VALID_ASCE_TABS = SUB_TABS.map((t) => t.id);

export default function AsceTowerDesignView({ onOpenCitation, initialTab, onTabChange }) {
  const { activeProject } = useProject();
  const storageKey = `linedesk_ca_module_state_v1:${activeProject?.id || 'default'}:asce_tower`;

  const savedSnapshot = useMemo(() => {
    try {
      const raw = typeof window !== 'undefined' && window.localStorage?.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [storageKey]);

  // Alphabetically sorted selector lists per project rules
  const steelGrades = useMemo(
    () => getAllAsceSteelGrades().sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const angleSections = useMemo(
    () => getAllAsceAngleSections().sort((a, b) => a.designation.localeCompare(b.designation)),
    []
  );
  const boltSpecs = useMemo(
    () => getAllAsceBoltSpecs().sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const bracingCurves = useMemo(
    () => getAllAsceBracingCurves().sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  const [activeTab, setActiveTabState] = useState(() =>
    initialTab && VALID_ASCE_TABS.includes(initialTab)
      ? initialTab
      : savedSnapshot?.activeTab && VALID_ASCE_TABS.includes(savedSnapshot.activeTab)
        ? savedSnapshot.activeTab
        : 'compression'
  );
  const setActiveTab = (nextTab) => {
    setActiveTabState(nextTab);
    onTabChange?.(nextTab);
  };

  useEffect(() => {
    if (initialTab && VALID_ASCE_TABS.includes(initialTab)) {
      setActiveTabState(initialTab);
    }
  }, [initialTab]);

  const [activePresetId, setActivePresetId] = useState(() => savedSnapshot?.activePresetId || 'ex1_leg');

  // Material & Section State
  const [steelGradeId, setSteelGradeId] = useState(() => savedSnapshot?.steelGradeId || 'A572_50');
  const [angleTypeFilter, setAngleTypeFilter] = useState('ALL');
  const [sectionSearchQuery, setSectionSearchQuery] = useState('');
  const [sectionId, setSectionId] = useState(() => savedSnapshot?.sectionId || 'SAE_8X8X0.5625');
  const [sectionType, setSectionType] = useState('equal_angle');
  const [crossSectionType, setCrossSectionType] = useState('Single');
  const [isDoubleAngle, setIsDoubleAngle] = useState(false);
  const [unitWeightPlf, setUnitWeightPlf] = useState(29.599);
  const [legWidthIn, setLegWidthIn] = useState(8.0);
  const [shortLegWidthIn, setShortLegWidthIn] = useState(8.0);
  const [thicknessIn, setThicknessIn] = useState(0.5625);
  const [filletRadiusIn, setFilletRadiusIn] = useState(0.625);
  const [grossAreaIn2, setGrossAreaIn2] = useState(8.68);
  const [rzIn, setRzIn] = useState(1.59);
  const [rxIn, setRxIn] = useState(2.5);
  const [ryIn, setRyIn] = useState(2.5);
  const [ruIn, setRuIn] = useState(3.153);
  const [isColdFormed, setIsColdFormed] = useState(false);
  const [bendRadiusMultiplier, setBendRadiusMultiplier] = useState(2.0);
  const [warpingConstantCwIn6, setWarpingConstantCwIn6] = useState(0.441);
  const [torsionConstantJIn4, setTorsionConstantJIn4] = useState(0.00623);
  const [polarInertiaIpsIn4, setPolarInertiaIpsIn4] = useState(5.18);
  const [shearCenterDistUoIn, setShearCenterDistUoIn] = useState(1.64);

  // Compression & Slenderness State
  const [memberCategory, setMemberCategory] = useState(() => savedSnapshot?.memberCategory || 'leg');
  const [bracingCurve, setBracingCurve] = useState(() => savedSnapshot?.bracingCurve || 'curve_1_leg');
  const [unbracedLengthIn, setUnbracedLengthIn] = useState(() => savedSnapshot?.unbracedLengthIn ?? 121);
  const [appliedCompressionKip, setAppliedCompressionKip] = useState(() => savedSnapshot?.appliedCompressionKip ?? 180);
  const [enableSubpanelVaryingForce, setEnableSubpanelVaryingForce] = useState(false);
  const [subpanelForceP1Kip, setSubpanelForceP1Kip] = useState(180);
  const [subpanelForceP2Kip, setSubpanelForceP2Kip] = useState(120);

  // Tension & Block Shear State
  const [appliedTensionKip, setAppliedTensionKip] = useState(110);
  const [tensionConnType, setTensionConnType] = useState('both_legs');
  const [holeMethod, setHoleMethod] = useState('punched');
  const [boltDiameterIn, setBoltDiameterIn] = useState(0.875);
  const [threadsPerInch, setThreadsPerInch] = useState(9);
  const [numHolesAcrossChain, setNumHolesAcrossChain] = useState(2);
  const [staggerPitchSIn, setStaggerPitchSIn] = useState(1.75);
  const [staggerGaugeGIn, setStaggerGaugeGIn] = useState(2.5);
  const [numStaggerSpaces, setNumStaggerSpaces] = useState(0);
  const [endDistAIn, setEndDistAIn] = useState(1.75);
  const [spacingBIn, setSpacingBIn] = useState(2.5);
  const [numBoltsInLine, setNumBoltsInLine] = useState(3);
  const [toeDistCIn, setToeDistCIn] = useState(1.5);
  const [guyBreakingStrengthKip, setGuyBreakingStrengthKip] = useState(50);
  const [appliedGuyTensionKip, setAppliedGuyTensionKip] = useState(25);

  // Combined Axial + Bending & Shear State
  const [appliedMomentMxInKip, setAppliedMomentMxInKip] = useState(15);
  const [appliedMomentMyInKip, setAppliedMomentMyInKip] = useState(5);
  const [cmFactor, setCmFactor] = useState(0.85);
  const [loadAngleThetaDeg, setLoadAngleThetaDeg] = useState(45);
  const [beamEffectiveK, setBeamEffectiveK] = useState(1.0);
  const [webDepthHIn, setWebDepthHIn] = useState(8.0);
  const [appliedShearVKip, setAppliedShearVKip] = useState(12);

  // Bolted Connections State
  const [boltSpecId, setBoltSpecId] = useState('A394_T1');
  const [threadsInShearPlane, setThreadsInShearPlane] = useState(true);
  const [numConnectionBolts, setNumConnectionBolts] = useState(6);
  const [numShearPlanes, setNumShearPlanes] = useState(1);
  const [appliedConnectionShearKip, setAppliedConnectionShearKip] = useState(45);
  const [appliedConnectionTensionKip, setAppliedConnectionTensionKip] = useState(10);
  const [edgeType, setEdgeType] = useState('rolled');
  const [actualEndDistIn, setActualEndDistIn] = useState(1.75);
  const [actualSpacingIn, setActualSpacingIn] = useState(2.5);
  const [actualEdgeDistIn, setActualEdgeDistIn] = useState(1.5);
  const [attachmentEdgeDistLIn, setAttachmentEdgeDistLIn] = useState(2.0);

  // Foundation & Anchorage State
  const [foundationContactCondition, setFoundationContactCondition] = useState('recessed_090');
  const [numAnchorBolts, setNumAnchorBolts] = useState(4);
  const [anchorBoltDiamIn, setAnchorBoltDiamIn] = useState(1.5);
  const [anchorBoltThreadsPerIn, setAnchorBoltThreadsPerIn] = useState(6);
  const [anchorBoltFyKsi, setAnchorBoltFyKsi] = useState(50);
  const [anchorBoltFuKsi, setAnchorBoltFuKsi] = useState(75);
  const [foundationUpliftTKip, setFoundationUpliftTKip] = useState(120);
  const [foundationDownthrustDKip, setFoundationDownthrustDKip] = useState(150);
  const [foundationShearVKip, setFoundationShearVKip] = useState(35);
  const [concreteFcKsi, setConcreteFcKsi] = useState(4.0);
  const [concreteEcKsi, setConcreteEcKsi] = useState(3605);
  const [studDiamIn, setStudDiamIn] = useState(0.75);

  const activeSteelGrade = useMemo(
    () => steelGrades.find((g) => g.id === steelGradeId) || steelGrades[0],
    [steelGrades, steelGradeId]
  );

  const activeBoltSpec = useMemo(
    () => boltSpecs.find((b) => b.id === boltSpecId) || boltSpecs[0],
    [boltSpecs, boltSpecId]
  );

  const filteredAngleSections = useMemo(() => {
    const q = sectionSearchQuery.trim().toLowerCase();
    const matches = angleSections.filter((sec) => {
      if (angleTypeFilter !== 'ALL' && sec.angleType !== angleTypeFilter) return false;
      if (q && !sec.designation.toLowerCase().includes(q) && !sec.angleSize?.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
    const active = angleSections.find((s) => s.id === sectionId);
    if (active && !matches.some((s) => s.id === active.id)) {
      return [active, ...matches].sort((a, b) => a.designation.localeCompare(b.designation));
    }
    return matches;
  }, [angleSections, angleTypeFilter, sectionSearchQuery, sectionId]);

  const handleSelectSection = (nextSecId) => {
    const sec = findAsceAngleSection(nextSecId) || angleSections.find((s) => s.id === nextSecId);
    setSectionId(sec ? sec.id : nextSecId);
    if (sec) {
      setLegWidthIn(sec.legLongIn);
      setShortLegWidthIn(sec.legShortIn);
      setThicknessIn(sec.thicknessIn);
      setFilletRadiusIn(sec.filletRadiusIn);
      setGrossAreaIn2(sec.areaIn2);
      setRzIn(sec.rzIn);
      setRxIn(sec.rxIn);
      setRyIn(sec.ryIn);
      setRuIn(sec.ruIn);
      setCrossSectionType(sec.crossSectionType || 'Single');
      setIsDoubleAngle(Boolean(sec.isDoubleAngle));
      setUnitWeightPlf(sec.unitWeightPlf ?? sec.areaIn2 * 3.4028);
      setWebDepthHIn(sec.legLongIn);
      setSectionType(sec.legLongIn === sec.legShortIn ? 'equal_angle' : 'unequal_angle');
    }
  };

  // One-Click Benchmark Presets from ASCE 10-15 Appendix B & Table C4-1
  const applyPreset = (presetId) => {
    setActivePresetId(presetId);
    setAngleTypeFilter('ALL');
    setSectionSearchQuery('');
    if (presetId === 'ex1_leg') {
      setSteelGradeId('A572_50');
      handleSelectSection('L8x8x9/16');
      setIsColdFormed(false);
      setMemberCategory('leg');
      setBracingCurve('curve_1_leg');
      setUnbracedLengthIn(121);
      setAppliedCompressionKip(180);
      setAppliedTensionKip(210);
      setTensionConnType('both_legs');
      setBoltDiameterIn(0.875);
      setThreadsPerInch(9);
      setActiveTab('compression');
    } else if (presetId === 'ex2_strut') {
      setSteelGradeId('A36');
      handleSelectSection('L1.75x1.25x3/16');
      setIsColdFormed(false);
      setMemberCategory('other_compression');
      setBracingCurve('curve_3_both_eccentric');
      setUnbracedLengthIn(42);
      setAppliedCompressionKip(5.5);
      setAppliedTensionKip(9.0);
      setTensionConnType('one_leg');
      setBoltDiameterIn(0.625);
      setThreadsPerInch(11);
      setNumHolesAcrossChain(1);
      setActiveTab('compression');
    } else if (presetId === 'ex10_local_buckling') {
      setSteelGradeId('A572_50');
      setSectionType('equal_angle');
      setLegWidthIn(3.0825);
      setShortLegWidthIn(3.0825);
      setThicknessIn(0.135);
      setIsColdFormed(true);
      setBendRadiusMultiplier(2.0);
      setGrossAreaIn2(0.777);
      setRzIn(0.586);
      setRxIn(0.92);
      setRyIn(0.92);
      setRuIn(1.16);
      setMemberCategory('other_compression');
      setBracingCurve('curve_3_both_eccentric');
      setUnbracedLengthIn(58.5);
      setAppliedCompressionKip(12.5);
      setActiveTab('compression');
    } else if (presetId === 'ex11_lipped') {
      setSteelGradeId('A572_50');
      setSectionType('lipped_angle');
      setLegWidthIn(3.0);
      setShortLegWidthIn(3.0);
      setThicknessIn(0.135);
      setIsColdFormed(true);
      setBendRadiusMultiplier(2.0);
      setGrossAreaIn2(1.03);
      setRzIn(0.773);
      setRuIn(1.32);
      setWarpingConstantCwIn6(0.441);
      setTorsionConstantJIn4(0.00623);
      setPolarInertiaIpsIn4(5.18);
      setShearCenterDistUoIn(1.64);
      setMemberCategory('other_compression');
      setBracingCurve('curve_6_both_restrained');
      setUnbracedLengthIn(90);
      setAppliedCompressionKip(15);
      setActiveTab('compression');
    } else if (presetId === 'table_c4_1_bolts') {
      setSteelGradeId('A36');
      handleSelectSection('L3x3x1/4');
      setBoltSpecId('A394_T0');
      setBoltDiameterIn(0.75);
      setThreadsPerInch(10);
      setNumConnectionBolts(1);
      setNumShearPlanes(1);
      setThreadsInShearPlane(true);
      setHoleMethod('punched');
      setEdgeType('rolled');
      setAppliedConnectionShearKip(9.86);
      setActualEndDistIn(1.25);
      setActualSpacingIn(1.875);
      setActualEdgeDistIn(1.125);
      setActiveTab('connections');
    }
  };

  // Run deterministic ASCE 10-15 calculation engine
  const result = useMemo(() => {
    return calculateAsce10Design({
      steelGradeId,
      sectionId,
      sectionType,
      crossSectionType,
      isDoubleAngle,
      unitWeightPlf,
      legWidthIn,
      shortLegWidthIn,
      thicknessIn,
      filletRadiusIn,
      grossAreaIn2,
      rzIn,
      rxIn,
      ryIn,
      ruIn,
      isColdFormed,
      bendRadiusMultiplier,
      warpingConstantCwIn6,
      torsionConstantJIn4,
      polarInertiaIpsIn4,
      shearCenterDistUoIn,
      memberCategory,
      bracingCurve,
      unbracedLengthIn,
      appliedCompressionKip,
      enableSubpanelVaryingForce,
      subpanelForceP1Kip,
      subpanelForceP2Kip,
      appliedTensionKip,
      tensionConnType,
      holeMethod,
      boltDiameterIn,
      threadsPerInch,
      numHolesAcrossChain,
      staggerPitchSIn,
      staggerGaugeGIn,
      numStaggerSpaces,
      endDistAIn,
      spacingBIn,
      numBoltsInLine,
      toeDistCIn,
      guyBreakingStrengthKip,
      appliedGuyTensionKip,
      appliedMomentMxInKip,
      appliedMomentMyInKip,
      cmFactor,
      loadAngleThetaDeg,
      beamEffectiveK,
      webDepthHIn,
      appliedShearVKip,
      boltSpecId,
      threadsInShearPlane,
      numConnectionBolts,
      numShearPlanes,
      appliedConnectionShearKip,
      appliedConnectionTensionKip,
      edgeType,
      actualEndDistIn,
      actualSpacingIn,
      actualEdgeDistIn,
      attachmentEdgeDistLIn,
      foundationContactCondition,
      numAnchorBolts,
      anchorBoltDiamIn,
      anchorBoltThreadsPerIn,
      anchorBoltFyKsi,
      anchorBoltFuKsi,
      foundationUpliftTKip,
      foundationDownthrustDKip,
      foundationShearVKip,
      concreteFcKsi,
      concreteEcKsi,
      studDiamIn
    });
  }, [
    steelGradeId,
    sectionId,
    sectionType,
    crossSectionType,
    isDoubleAngle,
    unitWeightPlf,
    legWidthIn,
    shortLegWidthIn,
    thicknessIn,
    filletRadiusIn,
    grossAreaIn2,
    rzIn,
    rxIn,
    ryIn,
    ruIn,
    isColdFormed,
    bendRadiusMultiplier,
    warpingConstantCwIn6,
    torsionConstantJIn4,
    polarInertiaIpsIn4,
    shearCenterDistUoIn,
    memberCategory,
    bracingCurve,
    unbracedLengthIn,
    appliedCompressionKip,
    enableSubpanelVaryingForce,
    subpanelForceP1Kip,
    subpanelForceP2Kip,
    appliedTensionKip,
    tensionConnType,
    holeMethod,
    boltDiameterIn,
    threadsPerInch,
    numHolesAcrossChain,
    staggerPitchSIn,
    staggerGaugeGIn,
    numStaggerSpaces,
    endDistAIn,
    spacingBIn,
    numBoltsInLine,
    toeDistCIn,
    guyBreakingStrengthKip,
    appliedGuyTensionKip,
    appliedMomentMxInKip,
    appliedMomentMyInKip,
    cmFactor,
    loadAngleThetaDeg,
    beamEffectiveK,
    webDepthHIn,
    appliedShearVKip,
    boltSpecId,
    threadsInShearPlane,
    numConnectionBolts,
    numShearPlanes,
    appliedConnectionShearKip,
    appliedConnectionTensionKip,
    edgeType,
    actualEndDistIn,
    actualSpacingIn,
    actualEdgeDistIn,
    attachmentEdgeDistLIn,
    foundationContactCondition,
    numAnchorBolts,
    anchorBoltDiamIn,
    anchorBoltThreadsPerIn,
    anchorBoltFyKsi,
    anchorBoltFuKsi,
    foundationUpliftTKip,
    foundationDownthrustDKip,
    foundationShearVKip,
    concreteFcKsi,
    concreteEcKsi,
    studDiamIn
  ]);

  // Generate SVG Column Buckling Curve points (Fa vs KL/r from 0 to 250)
  const bucklingCurvePoints = useMemo(() => {
    const pts = [];
    const maxKLr = 250;
    const maxStress = Math.max(65, result.compression.fcrKsi * 1.1);
    const width = 520;
    const height = 210;
    const padL = 48;
    const padR = 20;
    const padT = 18;
    const padB = 34;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    for (let klr = 0; klr <= maxKLr; klr += 5) {
      const { faKsi } = computeCompressiveStressFaKsi(klr, result.compression.fcrKsi);
      const x = padL + (klr / maxKLr) * plotW;
      const y = padT + plotH - (faKsi / maxStress) * plotH;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    const opX =
      padL + (Math.min(maxKLr, result.compression.effectiveKLOverR) / maxKLr) * plotW;
    const opY = padT + plotH - (result.compression.faKsi / maxStress) * plotH;
    const ccX = padL + (Math.min(maxKLr, result.compression.cc) / maxKLr) * plotW;

    return {
      polyline: pts.join(' '),
      opX,
      opY,
      ccX,
      maxStress,
      width,
      height,
      padL,
      padR,
      padT,
      padB,
      plotW,
      plotH
    };
  }, [result.compression]);

  // Persist core ASCE parameters per project across view switches
  const didHydrateSectionRef = useRef(false);
  useEffect(() => {
    if (!didHydrateSectionRef.current && savedSnapshot?.sectionId && savedSnapshot.sectionId !== 'SAE_8X8X0.5625') {
      didHydrateSectionRef.current = true;
      handleSelectSection(savedSnapshot.sectionId);
    } else {
      didHydrateSectionRef.current = true;
    }
  }, [savedSnapshot]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({
            activeTab,
            activePresetId,
            steelGradeId,
            sectionId,
            memberCategory,
            bracingCurve,
            unbracedLengthIn,
            appliedCompressionKip
          })
        );
      }
    } catch {
      /* ignore storage errors */
    }
  }, [
    storageKey,
    activeTab,
    activePresetId,
    steelGradeId,
    sectionId,
    memberCategory,
    bracingCurve,
    unbracedLengthIn,
    appliedCompressionKip
  ]);

  const fmtKips = (val) => `${Number(val).toFixed(2)} kips (${(Number(val) * 4.44822).toFixed(1)} kN)`;
  const fmtKsi = (val) => `${Number(val).toFixed(2)} ksi (${(Number(val) * 6.89476).toFixed(1)} MPa)`;

  const headerNode = (
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <Compass size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              ASCE/SEI 10-15 Latticed Steel Tower Design Engine
            </h2>
            <span className="citation-badge">ASCE 10-15 Ch. 3, 4 &amp; 7</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Full structural capacity checks and step-by-step equations for axial compression &amp; local buckling, net section tension &amp; block shear, beam-column interaction, bolted connections, and foundation anchorages.
          </p>
        </div>

        {/* One-Click ASCE 10-15 Benchmark Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={13} color="var(--accent-primary)" /> Benchmarks:
          </span>
          {[
            { id: 'ex1_leg', label: 'Ex. 1: L8×8×9/16 Leg' },
            { id: 'ex2_strut', label: 'Ex. 2: L1-3/4×1-1/4×3/16 Strut' },
            { id: 'ex10_local_buckling', label: 'Ex. 10: Local Buckling' },
            { id: 'ex11_lipped', label: 'Ex. 11: Lipped Angle' },
            { id: 'table_c4_1_bolts', label: 'Table C4-1: 3/4" A394 Bolt' }
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`btn ${activePresetId === preset.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '12px' }}
              onClick={() => applyPreset(preset.id)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
  );

  const summaryRailNode = (
    <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Overall ASCE 10-15 Status
        </span>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: 800,
            color:
              result.overallStatus === 'PASS'
                ? 'var(--accent-success)'
                : result.overallStatus === 'MARGINAL'
                ? 'var(--accent-warning)'
                : 'var(--accent-danger)'
          }}
        >
          {result.overallStatus === 'PASS' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {result.overallStatus}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
        <div className="glass-inset" style={{ padding: '11px 13px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Compression (<Latex math="P_a = F_a A_e" />)
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '3px' }}>
            {result.compression.capacityPaKip.toFixed(2)} kips
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '3px' }}>
            <Latex math={`F_a = ${result.compression.faKsi.toFixed(2)}\\text{ ksi}`} /> •{' '}
            <strong style={{ color: result.compression.utilizationPercent > 100 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
              {result.compression.utilizationPercent.toFixed(1)}%
            </strong>
          </div>
        </div>

        <div className="glass-inset" style={{ padding: '11px 13px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Tension (<Latex math="\min(P_t, P_{bs})" />)
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '3px' }}>
            {result.tension.governingTensionCapacityKip.toFixed(2)} kips
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '3px' }}>
            <Latex math={`A_n = ${result.tension.netAreaAnIn2.toFixed(3)}\\text{ in.}^2`} /> •{' '}
            <strong style={{ color: result.tension.utilizationPercent > 100 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
              {result.tension.utilizationPercent.toFixed(1)}%
            </strong>
          </div>
        </div>

        <div className="glass-inset" style={{ padding: '11px 13px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Combined (Sec. 3.12)
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '3px' }}>
            {result.combinedAndBeams.interactionPercent.toFixed(1)}%
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '3px' }}>
            <Latex math={`M_b = ${result.combinedAndBeams.lateralBucklingMomentMbInKip.toFixed(1)}`} /> •{' '}
            <strong style={{ color: result.combinedAndBeams.isPassing ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
              {result.combinedAndBeams.isPassing ? 'PASS' : 'OVERSTRESSED'}
            </strong>
          </div>
        </div>

        <div className="glass-inset" style={{ padding: '11px 13px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Bolted Conn. (<Latex math={`n = ${numConnectionBolts}`} />)
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '3px' }}>
            {result.connections.governingConnectionCapacityKip.toFixed(2)} kips
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '3px' }}>
            <Latex math={`e_{\\min} = ${result.connections.eMinGoverningIn.toFixed(2)}\\text{ in.}`} /> •{' '}
            <strong style={{ color: result.connections.areDistancesCompliant ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
              {result.connections.areDistancesCompliant ? 'Spacing OK' : 'Check'}
            </strong>
          </div>
        </div>
      </div>

      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
        <span>Anchor Util: <strong className="mono">{result.foundations.anchorBoltUtilizationPercent.toFixed(1)}%</strong></span>
        <span className="mono" style={{ color: 'var(--accent-cyan)' }}>{result.sectionProperties.designation}</span>
      </div>
    </div>
  );

  return (
    <CalculatorWorkspaceShell
      header={headerNode}
      summaryRail={summaryRailNode}
      belowSplit={<TraceViewer trace={result.trace} onOpenCitation={onOpenCitation} />}
      maxWidth="1440px"
    >

      {/* Shared Member & Material Bar + Sub-Module Tabs */}
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '18px'
          }}
        >
          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label">
              Steel Specification (<Latex math="F_y, F_u" /> — Sec. 3.2)
            </label>
            <select
              aria-label="Steel Specification"
              className="select-field"
              value={steelGradeId}
              onChange={(e) => setSteelGradeId(e.target.value)}
            >
              {steelGrades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label">
              Angle Type Filter (Excel Catalog)
            </label>
            <select
              aria-label="Angle Type Filter"
              className="select-field"
              value={angleTypeFilter}
              onChange={(e) => {
                const nextType = e.target.value;
                setAngleTypeFilter(nextType);
                if (nextType !== 'ALL') {
                  const firstMatch = angleSections.find((s) => s.angleType === nextType);
                  if (firstMatch) handleSelectSection(firstMatch.id);
                }
              }}
            >
              {ANGLE_TYPE_FILTER_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label">
              Search Section Size (e.g. 6X6, 8X8, 1.75)
            </label>
            <input
              type="text"
              aria-label="Search Angle Section"
              placeholder="Filter size (e.g. 6X6X0.5)..."
              className="input-field"
              value={sectionSearchQuery}
              onChange={(e) => setSectionSearchQuery(e.target.value)}
            />
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label">
              Angle Section Designation ({filteredAngleSections.length} matches — <Latex math="A_g, r_z" />)
            </label>
            <select
              aria-label="Angle Section Designation"
              className="select-field"
              value={sectionId}
              onChange={(e) => handleSelectSection(e.target.value)}
            >
              {filteredAngleSections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.designation} — A={sec.areaIn2} in², rz={sec.rzIn} in., {sec.unitWeightPlf} lb/ft
                </option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label">
              Applied Axial Compression <Latex math="P" /> (kips)
            </label>
            <input
              type="number"
              step="1"
              className="input-field"
              value={appliedCompressionKip}
              onChange={(e) => setAppliedCompressionKip(Number(e.target.value))}
            />
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label">
              Applied Axial Tension <Latex math="T" /> (kips)
            </label>
            <input
              type="number"
              step="1"
              className="input-field"
              value={appliedTensionKip}
              onChange={(e) => setAppliedTensionKip(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Dynamic Angle Section Geometry & Computed Properties Summary */}
        <div className="glass-inset" style={{ padding: '14px 16px', marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Selected Section Properties: <span style={{ color: 'var(--accent-primary)' }}>{result.sectionProperties.designation}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '11px', fontWeight: 600 }}>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)'
                }}
              >
                Config: {result.sectionProperties.crossSectionType}
              </span>
              {result.sectionProperties.isDoubleAngle && result.sectionProperties.maxStitchSpacingIn !== null && (
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-warning)'
                  }}
                >
                  Cl. 3.11 Max Stitch: {result.sectionProperties.maxStitchSpacingIn} in.
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
              gap: '10px',
              fontSize: '12px'
            }}
          >
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                Dimensions (<Latex math="b_L \times b_S \times t" />)
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.sectionProperties.legLongIn}&Prime; &times; {result.sectionProperties.legShortIn}&Prime; &times; {result.sectionProperties.thicknessIn}&Prime;
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                {result.sectionProperties.legLongCm} &times; {result.sectionProperties.legShortCm} &times; {result.sectionProperties.thicknessCm} cm
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                Gross Area (<Latex math="A_g" />)
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.sectionProperties.grossAreaIn2} in.&sup2;
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                {result.sectionProperties.grossAreaCm2} cm&sup2; | <Latex math="w/t" />={result.sectionProperties.wOverT}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Unit &amp; Member Weight</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.sectionProperties.unitWeightPlf} lb/ft
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                {result.sectionProperties.unitWeightNm} N/m ({result.sectionProperties.memberWeightLb} lb @ {unbracedLengthIn}&Prime;)
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                Radii (<Latex math="r_x, r_y, r_z, r_u" />)
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.sectionProperties.rxIn} / {result.sectionProperties.ryIn} / {result.sectionProperties.rzIn} in.
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                <Latex math="r_u" />={result.sectionProperties.ruIn}&Prime;, fillet={result.sectionProperties.filletRadiusIn}&Prime;
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                Moments of Inertia (<Latex math="I_x, I_y, I_z" />)
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.sectionProperties.ixIn4} / {result.sectionProperties.iyIn4} / {result.sectionProperties.izIn4} in.&#8308;
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                <Latex math="I_u" />={result.sectionProperties.iuIn4} in.&#8308;
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                Moduli &amp; Wind (<Latex math="S_x, S_y" />)
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.sectionProperties.sxIn3} / {result.sectionProperties.syIn3} in.&sup3;
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                Wind={result.sectionProperties.windWidthIn}&Prime;, Edge={result.sectionProperties.shortEdgeDistIn}&Prime;
              </div>
            </div>
          </div>
        </div>

        {/* Touch-friendly Sub-Module Tab Scroller */}
        <div className="book-content-tabs" role="tablist" aria-label="ASCE 10-15 Design Sub-Modules">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`book-content-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-MODULE 1: COMPRESSION & BUCKLING */}
      {activeTab === 'compression' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '20px',
              alignItems: 'start'
            }}
          >
            {/* Left Column: Compression & Slenderness Inputs */}
            <div className="glass-panel" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} color="var(--accent-primary)" />
                Compression &amp; Effective Slenderness Parameters
              </h3>

              <div className="input-group">
                <label className="input-label">
                  Member Slenderness Category (<Latex math="L/r" /> Limit — Sec. 3.4)
                </label>
                <select
                  aria-label="Member Slenderness Category"
                  className="select-field"
                  value={memberCategory}
                  onChange={(e) => setMemberCategory(e.target.value)}
                >
                  {MEMBER_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">
                  End Restraint &amp; Framing Eccentricity Curve (<Latex math="KL/r" /> — Table 3.4-1)
                </label>
                <select
                  aria-label="End Restraint Curve"
                  className="select-field"
                  value={bracingCurve}
                  onChange={(e) => setBracingCurve(e.target.value)}
                >
                  {bracingCurves.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} — {c.description}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 145px), 1fr))', gap: '10px' }}>
                <div className="input-group">
                  <label className="input-label">
                    Unbraced Length <Latex math="L" /> (in.)
                  </label>
                  <input
                    type="number"
                    step="1"
                    className="input-field"
                    value={unbracedLengthIn}
                    onChange={(e) => setUnbracedLengthIn(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Leg Width <Latex math="b" /> (in.)
                  </label>
                  <input
                    type="number"
                    step="0.125"
                    className="input-field"
                    value={legWidthIn}
                    onChange={(e) => setLegWidthIn(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Thickness <Latex math="t" /> (in.)
                  </label>
                  <input
                    type="number"
                    step="0.0625"
                    className="input-field"
                    value={thicknessIn}
                    onChange={(e) => setThicknessIn(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Subpanel Varying Axial Force Factor K' (Sec. 3.7.4.4) */}
              <div className="glass-inset" style={{ padding: '14px', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={enableSubpanelVaryingForce}
                    onChange={(e) => setEnableSubpanelVaryingForce(e.target.checked)}
                  />
                  Apply Two-Subpanel Varying Axial Force Factor <Latex math="K'" /> (Sec. 3.7.4.4)
                </label>
                {enableSubpanelVaryingForce && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 165px), 1fr))', gap: '10px', marginTop: '10px' }}>
                    <div className="input-group" style={{ margin: 0 }}>
                      <label className="input-label">
                        Subpanel Force <Latex math="P_1" /> (kips, +Comp)
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={subpanelForceP1Kip}
                        onChange={(e) => setSubpanelForceP1Kip(Number(e.target.value))}
                      />
                    </div>
                    <div className="input-group" style={{ margin: 0 }}>
                      <label className="input-label">
                        Subpanel Force <Latex math="P_2" /> (kips, +Comp/-Tens)
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={subpanelForceP2Kip}
                        onChange={(e) => setSubpanelForceP2Kip(Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Symmetrical Lipped Cold-Formed Angle Toggle (Sec. 3.8) */}
              <div className="glass-inset" style={{ padding: '14px', marginTop: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={sectionType === 'lipped_angle'}
                    onChange={(e) =>
                      setSectionType(e.target.checked ? 'lipped_angle' : 'equal_angle')
                    }
                  />
                  Symmetrical Lipped Cold-Formed Angle Torsional-Flexural Check (<Latex math="r_{tf}" /> — Sec. 3.8)
                </label>
                {sectionType === 'lipped_angle' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 145px), 1fr))', gap: '10px', marginTop: '10px' }}>
                    <div className="input-group" style={{ margin: 0 }}>
                      <label className="input-label">
                        <Latex math="J\text{ (in.}^4\text{)}" />
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        className="input-field"
                        value={torsionConstantJIn4}
                        onChange={(e) => setTorsionConstantJIn4(Number(e.target.value))}
                      />
                    </div>
                    <div className="input-group" style={{ margin: 0 }}>
                      <label className="input-label">
                        <Latex math="C_w\text{ (in.}^6\text{)}" />
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        value={warpingConstantCwIn6}
                        onChange={(e) => setWarpingConstantCwIn6(Number(e.target.value))}
                      />
                    </div>
                    <div className="input-group" style={{ margin: 0 }}>
                      <label className="input-label">
                        <Latex math="u_o\text{ (in.)}" />
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        className="input-field"
                        value={shearCenterDistUoIn}
                        onChange={(e) => setShearCenterDistUoIn(Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Compression Results & Interactive SVG Buckling Curve */}
            <div className="glass-panel" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="var(--accent-primary)" />
                ASCE 10-15 Column Buckling &amp; Local Buckling Results
              </h3>

              {/* Interactive SVG Column Buckling Curve */}
              <div className="glass-inset" style={{ padding: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    Design Compressive Stress <Latex math="F_a" /> vs. Effective Slenderness <Latex math="KL/r" /> (Sec. 3.6)
                  </span>
                  <span style={{ color: 'var(--accent-primary)' }}>
                    Regime: <strong>{result.compression.bucklingRegime.toUpperCase()}</strong>
                  </span>
                </div>
                <svg
                  viewBox={`0 0 ${bucklingCurvePoints.width} ${bucklingCurvePoints.height}`}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  role="img"
                  aria-label="ASCE 10-15 Column Buckling Curve"
                >
                  {[0, 50, 100, 150, 200, 250].map((klr) => {
                    const x =
                      bucklingCurvePoints.padL + (klr / 250) * bucklingCurvePoints.plotW;
                    return (
                      <g key={klr}>
                        <line
                          x1={x}
                          y1={bucklingCurvePoints.padT}
                          x2={x}
                          y2={bucklingCurvePoints.padT + bucklingCurvePoints.plotH}
                          stroke="var(--border-subtle)"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={x}
                          y={bucklingCurvePoints.height - 10}
                          textAnchor="middle"
                          fontSize="10"
                          fill="var(--text-muted)"
                        >
                          {klr}
                        </text>
                      </g>
                    );
                  })}
                  {/* Cc Divider Line */}
                  <line
                    x1={bucklingCurvePoints.ccX}
                    y1={bucklingCurvePoints.padT}
                    x2={bucklingCurvePoints.ccX}
                    y2={bucklingCurvePoints.padT + bucklingCurvePoints.plotH}
                    stroke="var(--accent-warning)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={bucklingCurvePoints.ccX + 4}
                    y={bucklingCurvePoints.padT + 12}
                    fontSize="10"
                    fill="var(--accent-warning)"
                  >
                    Cc = {result.compression.cc.toFixed(1)}
                  </text>

                  {/* Buckling Curve Polyline */}
                  <polyline
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="2.5"
                    points={bucklingCurvePoints.polyline}
                  />

                  {/* Current Member Operating Point */}
                  <circle
                    cx={bucklingCurvePoints.opX}
                    cy={bucklingCurvePoints.opY}
                    r="5.5"
                    fill="var(--accent-success)"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={Math.min(bucklingCurvePoints.width - 95, bucklingCurvePoints.opX + 8)}
                    y={Math.max(24, bucklingCurvePoints.opY - 8)}
                    fontSize="11"
                    fontWeight="700"
                    fill="var(--text-primary)"
                  >
                    ({result.compression.effectiveKLOverR.toFixed(1)}, {result.compression.faKsi.toFixed(1)} ksi)
                  </text>
                </svg>
              </div>

              {/* Key Equations & Results Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 165px), 1fr))', gap: '10px', fontSize: '13px' }}>
                <div className="glass-inset" style={{ padding: '12px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Flat-Width Ratio <Latex math="w/t" /> (Sec. 3.7.2)
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginTop: '2px' }}>
                    {result.compression.wOverT.toFixed(2)}{' '}
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      (Limit <Latex math="(w/t)_{\lim} = " /> {result.compression.wOverTLim.toFixed(2)})
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <Latex math={`F_{cr} = ${result.compression.fcrKsi.toFixed(2)}\\text{ ksi}`} />
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '12px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Effective Slenderness <Latex math="KL/r" /> (Sec. 3.7.4)
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginTop: '2px' }}>
                    {result.compression.effectiveKLOverR.toFixed(1)}{' '}
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      (Max <Latex math="\le " /> {result.compression.maxAllowedSlenderness})
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <Latex math={`C_c = \\pi\\sqrt{2E/F_{cr}} = ${result.compression.cc.toFixed(1)}`} />
                    {result.compression.rtfIn !== null && (
                      <>
                        {' • '}
                        <Latex math={`r_{tf} = ${result.compression.rtfIn.toFixed(3)}\\text{ in.}`} />
                      </>
                    )}
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '12px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Design Compressive Stress <Latex math="F_a" /> (Eq. 3.6-1)
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginTop: '2px' }}>
                    {fmtKsi(result.compression.faKsi)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Capacity <Latex math={`P_a = ${fmtKips(result.compression.capacityPaKip)}`} />
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '12px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Redundant Support Force <Latex math="P_r" /> (Sec. 3.16)
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginTop: '2px' }}>
                    {fmtKips(result.compression.redundantForcePrKip)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <Latex math="0.015 P \le P_r \le 0.025 P" /> (Eq. 3.16-1)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Mathematical Derivation for Compression & Buckling */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={16} color="var(--accent-primary)" />
              Step-by-Step Compression &amp; Buckling Equations (ASCE 10-15 Sec. 3.5–3.9 &amp; 3.16)
            </h3>

            <div className="calc-step">
              <div className="calc-label">Step 1: Flat-Width Ratio &amp; Local Buckling Stress (Sec. 3.5 &amp; 3.7.3)</div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="w/t \text{ \& } (w/t)_{\lim}" />
                  </span>
                  <span className="calc-eq-purpose-label">Flat-width ratio and compact local buckling limit — Eq. (3.7-1)</span>
                </div>
                <Latex block>
                  {`w = ${result.compression.flatWidthWIn}\\text{ in.}, \\quad \\frac{w}{t} = \\frac{${result.compression.flatWidthWIn}}{${thicknessIn}} = ${result.compression.wOverT}, \\quad \\left(\\frac{w}{t}\\right)_{\\lim} = \\frac{80 \\Psi}{\\sqrt{F_y}} = \\frac{80}{\\sqrt{${activeSteelGrade.fyKsi}}} = ${result.compression.wOverTLim}`}
                </Latex>
              </div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="F_{cr}" />
                  </span>
                  <span className="calc-eq-purpose-label">Critical local buckling stress — Eqs. (3.7-2) &amp; (3.7-3)</span>
                </div>
                <Latex block>
                  {result.compression.wOverT <= result.compression.wOverTLim
                    ? `\\frac{w}{t} = ${result.compression.wOverT} \\le \\left(\\frac{w}{t}\\right)_{\\lim} = ${result.compression.wOverTLim} \\implies F_{cr} = F_y = ${result.compression.fcrKsi}\\text{ ksi} \\;(${result.compression.fcrMPa}\\text{ MPa})`
                    : result.compression.wOverT <= result.compression.wOverTElasticLimit
                    ? `F_{cr} = \\left[1.677 - 0.677 \\frac{w/t}{(w/t)_{\\lim}}\\right] F_y = \\left[1.677 - 0.677 \\left(\\frac{${result.compression.wOverT}}{${result.compression.wOverTLim}}\\right)\\right] (${activeSteelGrade.fyKsi}) = ${result.compression.fcrKsi}\\text{ ksi}`
                    : `F_{cr} = \\frac{0.0332 \\pi^2 E}{(w/t)^2} = \\frac{0.0332 \\pi^2 (29{,}000)}{(${result.compression.wOverT})^2} = ${result.compression.fcrKsi}\\text{ ksi}`}
                </Latex>
              </div>
            </div>

            {sectionType === 'lipped_angle' && result.compression.rtIn !== null && result.compression.rtfIn !== null && (
              <div className="calc-step">
                <div className="calc-label">Step 1b: Symmetrical Lipped Angle Torsional-Flexural Radius (Sec. 3.8)</div>
                <div className="calc-eq-item">
                  <div className="calc-eq-meta">
                    <span className="calc-eq-var-badge">
                      <Latex math="r_t, r_{tf}, d_{\min}" />
                    </span>
                    <span className="calc-eq-purpose-label">Torsional-flexural buckling radius &amp; minimum lip depth — Eqs. (3.8-1)–(3.8-3)</span>
                  </div>
                  <Latex block>
                    {`r_t = \\sqrt{\\frac{C_w + 0.04 J (K_t L)^2}{I_{ps}}} = ${result.compression.rtIn}\\text{ in.}, \\quad \\frac{2}{r_{tf}^2} = \\frac{1}{r_t^2} + \\frac{1}{r_u^2} + \\sqrt{\\left(\\frac{1}{r_t^2} - \\frac{1}{r_u^2}\\right)^2 + 4\\left(\\frac{u_o}{r_u r_t r_{ps}}\\right)^2} \\implies r_{tf} = ${result.compression.rtfIn}\\text{ in.}, \\quad d_{\\min} = ${result.compression.minLipDepthIn}\\text{ in.}`}
                  </Latex>
                </div>
              </div>
            )}

            <div className="calc-step">
              <div className="calc-label">Step 2: Effective Slenderness &amp; Column Buckling Capacity (Sec. 3.6 &amp; 3.7.4)</div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="\frac{KL}{r} \text{ \& } C_c" />
                  </span>
                  <span className="calc-eq-purpose-label">Effective slenderness ratio (Table 3.4-1) &amp; elastic/inelastic column threshold — Eq. (3.6-2)</span>
                </div>
                <Latex block>
                  {`\\frac{L}{r} = \\frac{${unbracedLengthIn}}{${result.compression.governingRadiusRIn}} \\times K'(${result.compression.subpanelFactorKPrime}) = ${result.compression.lOverR} \\implies \\frac{KL}{r} = ${result.compression.effectiveKLOverR}, \\quad C_c = \\pi\\sqrt{\\frac{2E}{F_{cr}}} = \\pi\\sqrt{\\frac{2(29{,}000)}{${result.compression.fcrKsi}}} = ${result.compression.cc}`}
                </Latex>
              </div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="F_a \text{ \& } P_a" />
                  </span>
                  <span className="calc-eq-purpose-label">Design compressive stress and member compression capacity — Eqs. (3.6-1) &amp; (3.6-3)</span>
                </div>
                <Latex block>
                  {result.compression.effectiveKLOverR <= result.compression.cc
                    ? `F_a = \\left[1 - \\frac{1}{2}\\left(\\frac{KL/r}{C_c}\\right)^2\\right] F_{cr} = \\left[1 - \\frac{1}{2}\\left(\\frac{${result.compression.effectiveKLOverR}}{${result.compression.cc}}\\right)^2\\right] (${result.compression.fcrKsi}) = ${result.compression.faKsi}\\text{ ksi} \\implies P_a = F_a A_e = ${result.compression.faKsi} \\times ${result.compression.effectiveAreaIn2} = ${result.compression.capacityPaKip}\\text{ kips}`
                    : `F_a = \\frac{\\pi^2 E}{(KL/r)^2} = \\frac{\\pi^2 (29{,}000)}{(${result.compression.effectiveKLOverR})^2} = ${result.compression.faKsi}\\text{ ksi} \\implies P_a = F_a A_e = ${result.compression.faKsi} \\times ${result.compression.effectiveAreaIn2} = ${result.compression.capacityPaKip}\\text{ kips}`}
                </Latex>
              </div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="P_r" />
                  </span>
                  <span className="calc-eq-purpose-label">Required redundant bracing support force — Sec. 3.16 Eq. (3.16-1)</span>
                </div>
                <Latex block>
                  {`P_r = \\text{clamp}_{[0.015,\\,0.025]}\\left[0.015 + \\frac{1}{6000}\\left(\\frac{L}{r} - 60\\right)\\right] P = ${result.compression.redundantForcePrKip}\\text{ kips} \\;(${result.compression.redundantForcePrKN}\\text{ kN})`}
                </Latex>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODULE 2: TENSION & BLOCK SHEAR */}
      {activeTab === 'tension' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '20px',
              alignItems: 'start'
            }}
          >
            <div className="glass-panel" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} color="var(--accent-primary)" />
                Tension, Staggered Net Section &amp; Block Shear Inputs
              </h3>

              <div className="input-group">
                <label className="input-label">
                  Angle End Connection Concentricity (<Latex math="F_t" /> — Sec. 3.10.2)
                </label>
                <select
                  aria-label="Angle End Connection Concentricity"
                  className="select-field"
                  value={tensionConnType}
                  onChange={(e) => setTensionConnType(e.target.value)}
                >
                  {CONNECTION_TYPES.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">
                  Hole Fabrication Method (<Latex math="d_h" /> — Sec. 3.10.1)
                </label>
                <select
                  aria-label="Hole Fabrication Method"
                  className="select-field"
                  value={holeMethod}
                  onChange={(e) => setHoleMethod(e.target.value)}
                >
                  {HOLE_FABRICATION_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 165px), 1fr))', gap: '10px' }}>
                <div className="input-group">
                  <label className="input-label">
                    Bolts Across Chain (<Latex math="n_h" />)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="input-field"
                    value={numHolesAcrossChain}
                    onChange={(e) => setNumHolesAcrossChain(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Zigzag Stagger Spaces (<Latex math="n_s" />)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="input-field"
                    value={numStaggerSpaces}
                    onChange={(e) => setNumStaggerSpaces(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Stagger Pitch <Latex math="s" /> (in.)
                  </label>
                  <input
                    type="number"
                    step="0.125"
                    className="input-field"
                    value={staggerPitchSIn}
                    onChange={(e) => setStaggerPitchSIn(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Transverse Gage <Latex math="g" /> (in.)
                  </label>
                  <input
                    type="number"
                    step="0.125"
                    className="input-field"
                    value={staggerGaugeGIn}
                    onChange={(e) => setStaggerGaugeGIn(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="glass-inset" style={{ padding: '14px', marginTop: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-secondary)' }}>
                  Block Shear Rupture Path Geometry (Sec. 3.10.2, Eq. 3.10-1 &amp; Fig. 3-5)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 165px), 1fr))', gap: '10px' }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">
                      End Distance <Latex math="a" /> (in.)
                    </label>
                    <input
                      type="number"
                      step="0.125"
                      className="input-field"
                      value={endDistAIn}
                      onChange={(e) => setEndDistAIn(Number(e.target.value))}
                    />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">
                      Bolt Spacing <Latex math="b" /> (in.)
                    </label>
                    <input
                      type="number"
                      step="0.125"
                      className="input-field"
                      value={spacingBIn}
                      onChange={(e) => setSpacingBIn(Number(e.target.value))}
                    />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">
                      Bolts in Line (<Latex math="k" />)
                    </label>
                    <input
                      type="number"
                      step="1"
                      className="input-field"
                      value={numBoltsInLine}
                      onChange={(e) => setNumBoltsInLine(Number(e.target.value))}
                    />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">
                      Toe Distance <Latex math="c" /> (in.)
                    </label>
                    <input
                      type="number"
                      step="0.125"
                      className="input-field"
                      value={toeDistCIn}
                      onChange={(e) => setToeDistCIn(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>
                ASCE 10-15 Section 3.10 Tension &amp; Block Shear Capacities
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 165px), 1fr))', gap: '12px', fontSize: '13px' }}>
                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Net Section Area <Latex math="A_n" /> (Sec. 3.10.1)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                    {result.tension.netAreaAnIn2.toFixed(3)} in.²
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Hole Dia <Latex math={`d_h = ${result.tension.effectiveHoleDiamIn.toFixed(4)}\\text{ in.}`} /> •{' '}
                    <Latex math={`s^2/(4g) = ${result.tension.staggerAdditionIn.toFixed(3)}\\text{ in.}`} />
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Net Section Tension <Latex math="P_t = A_n F_t" /> (Sec. 3.10.1)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                    {fmtKips(result.tension.netTensionCapacityKip)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Allowable Stress <Latex math={`F_t = ${result.tension.designStressFtKsi.toFixed(2)}\\text{ ksi}`} />
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Block Shear Rupture <Latex math="P_{bs}" /> (Eq. 3.10-1)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                    {fmtKips(result.tension.blockShearCapacityKip)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <Latex math={`0.60 A_v F_u + A_t F_y`} /> (<Latex math={`A_v=${result.tension.netShearAreaAvIn2.toFixed(2)}, A_t=${result.tension.netTensionAreaAtIn2.toFixed(2)}\\text{ in.}^2`} />)
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Threaded Rod &amp; Guy Capacities (Sec. 3.10.4–3.10.5)
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>
                    Rod <Latex math="P_{\text{rod}}" />: {result.tension.threadedRodCapacityKip.toFixed(2)} kips
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Guy <Latex math="0.65 B_{\text{guy}}" />: {result.tension.guyDesignCapacityKip.toFixed(2)} kips
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Mathematical Derivation for Tension & Block Shear */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={16} color="var(--accent-primary)" />
              Step-by-Step Tension, Net Section &amp; Block Shear Equations (ASCE 10-15 Sec. 3.10)
            </h3>

            <div className="calc-step">
              <div className="calc-label">Step 1: Effective Hole Width, Staggered Net Area &amp; Tensile Yield (Sec. 3.10.1–3.10.2)</div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="d_h \text{ \& } A_n" />
                  </span>
                  <span className="calc-eq-purpose-label">Effective hole diameter and staggered net cross-sectional area</span>
                </div>
                <Latex block>
                  {`d_h = ${result.tension.effectiveHoleDiamIn}\\text{ in.}, \\quad A_n = A_g - \\left(n_h d_h - \\sum \\frac{s^2}{4g}\\right) t = ${grossAreaIn2} - \\left(${numHolesAcrossChain} \\times ${result.tension.effectiveHoleDiamIn} - ${result.tension.staggerAdditionIn}\\right)(${thicknessIn}) = ${result.tension.netAreaAnIn2}\\text{ in.}^2`}
                </Latex>
              </div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="F_t \text{ \& } P_t" />
                  </span>
                  <span className="calc-eq-purpose-label">Design tensile stress and net section tension capacity</span>
                </div>
                <Latex block>
                  {`F_t = ${result.tension.stressFactor} F_y = ${result.tension.stressFactor} \\times ${activeSteelGrade.fyKsi} = ${result.tension.designStressFtKsi}\\text{ ksi} \\implies P_t = A_n F_t = ${result.tension.netAreaAnIn2} \\times ${result.tension.designStressFtKsi} = ${result.tension.netTensionCapacityKip}\\text{ kips} \\;(${result.tension.netTensionCapacityKN}\\text{ kN})`}
                </Latex>
              </div>
            </div>

            <div className="calc-step">
              <div className="calc-label">Step 2: Block Shear Rupture, Threaded Rods &amp; Guy Strands (Sec. 3.10.2–3.10.5)</div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="A_v, A_t \text{ \& } P_{bs}" />
                  </span>
                  <span className="calc-eq-purpose-label">Block shear rupture capacity — Eq. (3.10-1)</span>
                </div>
                <Latex block>
                  {`A_v = ${result.tension.netShearAreaAvIn2}\\text{ in.}^2, \\quad A_t = ${result.tension.netTensionAreaAtIn2}\\text{ in.}^2 \\implies P_{bs} = 0.60 A_v F_u + A_t F_y = 0.60(${result.tension.netShearAreaAvIn2})(${activeSteelGrade.fuKsi}) + (${result.tension.netTensionAreaAtIn2})(${activeSteelGrade.fyKsi}) = ${result.tension.blockShearCapacityKip}\\text{ kips}`}
                </Latex>
              </div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="A_s, P_{\text{rod}} \text{ \& } P_{\text{guy}}" />
                  </span>
                  <span className="calc-eq-purpose-label">Threaded rod stress area Eq. (3.10-2) and guy strand design strength Sec. 3.10.5</span>
                </div>
                <Latex block>
                  {`A_s = \\frac{\\pi}{4}\\left(d - \\frac{0.974}{n}\\right)^2 = ${result.tension.threadedRodStressAreaIn2}\\text{ in.}^2 \\implies P_{\\text{rod}} = A_s F_y = ${result.tension.threadedRodCapacityKip}\\text{ kips}, \\quad P_{\\text{guy}} = 0.65 B_{\\text{guy}} = 0.65(${guyBreakingStrengthKip}) = ${result.tension.guyDesignCapacityKip}\\text{ kips}`}
                </Latex>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODULE 3: COMBINED AXIAL + BENDING & BEAM SHEAR */}
      {activeTab === 'combined' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '20px',
              alignItems: 'start'
            }}
          >
            <div className="glass-panel" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>
                Combined Axial + Bending &amp; Equal-Leg Angle LTB Inputs
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 165px), 1fr))', gap: '10px' }}>
                <div className="input-group">
                  <label className="input-label">
                    Applied Moment <Latex math="M_x" /> (kip-in.)
                  </label>
                  <input
                    type="number"
                    step="5"
                    className="input-field"
                    value={appliedMomentMxInKip}
                    onChange={(e) => setAppliedMomentMxInKip(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Applied Moment <Latex math="M_y" /> (kip-in.)
                  </label>
                  <input
                    type="number"
                    step="5"
                    className="input-field"
                    value={appliedMomentMyInKip}
                    onChange={(e) => setAppliedMomentMyInKip(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Coefficient <Latex math="C_m" /> (Sec. 3.12)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    className="input-field"
                    value={cmFactor}
                    onChange={(e) => setCmFactor(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Load Angle <Latex math="\theta" /> (deg, Sec. 3.14.3)
                  </label>
                  <input
                    type="number"
                    step="5"
                    className="input-field"
                    value={loadAngleThetaDeg}
                    onChange={(e) => setLoadAngleThetaDeg(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Beam Web Depth <Latex math="h" /> (in.)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    className="input-field"
                    value={webDepthHIn}
                    onChange={(e) => setWebDepthHIn(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Applied Shear Force <Latex math="V" /> (kips)
                  </label>
                  <input
                    type="number"
                    step="2"
                    className="input-field"
                    value={appliedShearVKip}
                    onChange={(e) => setAppliedShearVKip(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>
                Interaction Ratios &amp; Lateral-Torsional Buckling (Sec. 3.12–3.15)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 165px), 1fr))', gap: '12px', fontSize: '13px' }}>
                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Compression + Bending Stability (Eq. 3.12-1)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                    {(result.combinedAndBeams.compressionStabilityRatio * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Yield Check (Eq. 3.12-2): {(result.combinedAndBeams.compressionYieldRatio * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Tension + Bending Interaction (Eq. 3.13-1)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                    {(result.combinedAndBeams.tensionBendingRatio * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <Latex math="P/P_t + M_x/M_{bx} + M_y/M_{by} \le 1.0" />
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Angle Lateral Buckling Moment <Latex math="M_b" /> (Sec. 3.14.3)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                    {result.combinedAndBeams.lateralBucklingMomentMbInKip.toFixed(1)} kip-in.
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <Latex math={`M_e = ${result.combinedAndBeams.elasticCriticalMomentMeInKip.toFixed(1)},\\; M_y = ${result.combinedAndBeams.yieldMomentMyInKip.toFixed(1)}\\text{ kip}\\cdot\\text{in.}`} />
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Beam Web Shear Capacity <Latex math="V_n" /> (Sec. 3.15)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                    {fmtKips(result.combinedAndBeams.shearCapacityVkip)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <Latex math={`F_v = ${result.combinedAndBeams.allowableShearStressFvKsi.toFixed(2)}\\text{ ksi}`} /> • Util: {result.combinedAndBeams.shearUtilizationPercent.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Mathematical Derivation for Combined Axial + Bending & Shear */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={16} color="var(--accent-primary)" />
              Step-by-Step Combined Axial + Bending, LTB &amp; Shear Equations (ASCE 10-15 Sec. 3.12–3.15)
            </h3>

            <div className="calc-step">
              <div className="calc-label">Step 1: Equal-Leg Angle Yield &amp; Lateral-Torsional Buckling Moments (Sec. 3.14.3)</div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="M_y, M_e \text{ \& } M_b" />
                  </span>
                  <span className="calc-eq-purpose-label">Equal-leg angle yield moment and lateral-torsional buckling moment — Eqs. (3.14-5)–(3.14-11)</span>
                </div>
                <Latex block>
                  {`M_y = ${result.combinedAndBeams.yieldMomentMyInKip}\\text{ kip}\\cdot\\text{in.}, \\quad M_e = ${result.combinedAndBeams.elasticCriticalMomentMeInKip}\\text{ kip}\\cdot\\text{in.} \\implies M_b = ${
                    result.combinedAndBeams.elasticCriticalMomentMeInKip <= 0.5 * result.combinedAndBeams.yieldMomentMyInKip
                      ? `M_e = ${result.combinedAndBeams.lateralBucklingMomentMbInKip}\\text{ kip}\\cdot\\text{in.}`
                      : `M_y\\left(1 - \\frac{M_y}{4 M_e}\\right) = ${result.combinedAndBeams.lateralBucklingMomentMbInKip}\\text{ kip}\\cdot\\text{in.}`
                  }`}
                </Latex>
              </div>
            </div>

            <div className="calc-step">
              <div className="calc-label">Step 2: Combined Axial + Bending Interaction &amp; Web Shear (Sec. 3.12, 3.13 &amp; 3.15)</div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="\text{Eq. (3.12-1) \& (3.12-2)}" />
                  </span>
                  <span className="calc-eq-purpose-label">Beam-column stability and cross-section yield interaction</span>
                </div>
                <Latex block>
                  {`\\frac{P}{P_a} + \\frac{C_m M_x}{M_{ax}(1 - P/P_{ex})} + \\frac{C_m M_y}{M_{ay}(1 - P/P_{ey})} = \\frac{${appliedCompressionKip}}{${result.compression.capacityPaKip}} + \\frac{${cmFactor}(${appliedMomentMxInKip})}{${result.combinedAndBeams.governingAllowableMomentInKip}(1 - ${appliedCompressionKip}/${result.combinedAndBeams.eulerBucklingPexKip})} + \\frac{${cmFactor}(${appliedMomentMyInKip})}{${result.combinedAndBeams.governingAllowableMomentInKip}(1 - ${appliedCompressionKip}/${result.combinedAndBeams.eulerBucklingPeyKip})} = ${result.combinedAndBeams.compressionStabilityRatio} \\le 1.0`}
                </Latex>
              </div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="F_v \text{ \& } V_n" />
                  </span>
                  <span className="calc-eq-purpose-label">Beam web shear stress and shear capacity — Eqs. (3.15-1)–(3.15-3)</span>
                </div>
                <Latex block>
                  {`\\frac{h}{t} = \\frac{${webDepthHIn}}{${thicknessIn}} = ${result.combinedAndBeams.webHOverT} \\implies F_v = ${result.combinedAndBeams.allowableShearStressFvKsi}\\text{ ksi}, \\quad V_n = F_v h t = ${result.combinedAndBeams.allowableShearStressFvKsi} \\times ${webDepthHIn} \\times ${thicknessIn} = ${result.combinedAndBeams.shearCapacityVkip}\\text{ kips}`}
                </Latex>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODULE 4: BOLTED CONNECTIONS & SPACING */}
      {activeTab === 'connections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '20px',
              alignItems: 'start'
            }}
          >
            <div className="glass-panel" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={16} color="var(--accent-primary)" />
                Fastener Specification &amp; Connection Geometry (Ch. 4)
              </h3>

              <div className="input-group">
                <label className="input-label">
                  Bolt Specification (<Latex math="F_{u,\text{bolt}}" /> — Sec. 4.3)
                </label>
                <select
                  aria-label="Bolt Specification"
                  className="select-field"
                  value={boltSpecId}
                  onChange={(e) => setBoltSpecId(e.target.value)}
                >
                  {boltSpecs.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Fu = {b.fuKsi} ksi)
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">
                  Edge Condition (<Latex math="f_{\min}" /> — Sec. 4.5.3)
                </label>
                <select
                  aria-label="Edge Condition"
                  className="select-field"
                  value={edgeType}
                  onChange={(e) => setEdgeType(e.target.value)}
                >
                  {EDGE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 145px), 1fr))', gap: '10px' }}>
                <div className="input-group">
                  <label className="input-label">
                    Bolt Diameter <Latex math="d" /> (in.)
                  </label>
                  <input
                    type="number"
                    step="0.125"
                    className="input-field"
                    value={boltDiameterIn}
                    onChange={(e) => setBoltDiameterIn(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Number of Bolts <Latex math="n" />
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="input-field"
                    value={numConnectionBolts}
                    onChange={(e) => setNumConnectionBolts(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Threads / Inch (<Latex math="N" />)
                  </label>
                  <input
                    type="number"
                    step="1"
                    className="input-field"
                    value={threadsPerInch}
                    onChange={(e) => setThreadsPerInch(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 145px), 1fr))', gap: '10px' }}>
                <div className="input-group">
                  <label className="input-label">
                    Actual End <Latex math="e" /> (in.)
                  </label>
                  <input
                    type="number"
                    step="0.0625"
                    className="input-field"
                    value={actualEndDistIn}
                    onChange={(e) => setActualEndDistIn(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Actual Spacing <Latex math="s" /> (in.)
                  </label>
                  <input
                    type="number"
                    step="0.0625"
                    className="input-field"
                    value={actualSpacingIn}
                    onChange={(e) => setActualSpacingIn(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Actual Edge <Latex math="f" /> (in.)
                  </label>
                  <input
                    type="number"
                    step="0.0625"
                    className="input-field"
                    value={actualEdgeDistIn}
                    onChange={(e) => setActualEdgeDistIn(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={threadsInShearPlane}
                    onChange={(e) => setThreadsInShearPlane(e.target.checked)}
                  />
                  Threads in Shear Plane
                </label>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>
                ASCE 10-15 Chapter 4 Bolt &amp; Spacing Verification
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 165px), 1fr))', gap: '12px', fontSize: '13px' }}>
                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Bolt Shear Capacity (Sec. 4.3.2)
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 800, marginTop: '4px' }}>
                    {result.connections.totalBoltShearCapacityKip.toFixed(2)} kips ({result.connections.singleBoltShearCapacityKip.toFixed(2)} kips/bolt)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Bearing <Latex math="1.5 n d t F_u" />: {result.connections.totalBearingCapacityKip.toFixed(2)} kips
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Combined Shear + Tension <Latex math="F_{t(v)}" /> (Eq. 4.3-2)
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 800, marginTop: '4px' }}>
                    {fmtKsi(result.connections.combinedAllowableTensionStressFtVKsi)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Pure Bolt Tension: {result.connections.totalBoltTensionCapacityKip.toFixed(2)} kips
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Minimum Distances (Sec. 4.5.1–4.5.3)
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '4px', lineHeight: 1.6 }}>
                    <div>
                      End <Latex math="e_{\min}" />: <strong>{result.connections.eMinGoverningIn.toFixed(2)} in.</strong>
                    </div>
                    <div>
                      Spacing <Latex math="s_{\min}" />: <strong>{result.connections.sMinGoverningIn.toFixed(2)} in.</strong>
                    </div>
                    <div>
                      Edge <Latex math="f_{\min}" />: <strong>{result.connections.fMinGoverningIn.toFixed(2)} in.</strong>
                    </div>
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Guy / Insulator Attachment Hole (Sec. 4.6)
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 800, marginTop: '4px' }}>
                    {fmtKips(result.connections.attachmentHoleGoverningKip)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Everyday Wear Limit: {result.connections.attachmentHoleEverydayWearLimitKip.toFixed(2)} kips
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Mathematical Derivation for Bolted Connections */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={16} color="var(--accent-primary)" />
              Step-by-Step Bolted Connection &amp; Minimum Distance Equations (ASCE 10-15 Ch. 4 &amp; Table C4-1)
            </h3>

            <div className="calc-step">
              <div className="calc-label">Step 1: Bolt Shear, Tension, Combined Interaction &amp; Bearing (Sec. 4.3–4.4)</div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="A_s, V_{\text{bolt}} \text{ \& } T_{\text{bolt}}" />
                  </span>
                  <span className="calc-eq-purpose-label">Tensile stress area Eq. (4.3-1), bolt shear Sec. 4.3.2 &amp; bolt tension Sec. 4.3.3</span>
                </div>
                <Latex block>
                  {`A_s = \\frac{\\pi}{4}\\left(${boltDiameterIn} - \\frac{0.974}{${threadsPerInch}}\\right)^2 = ${result.connections.boltStressAreaAsIn2}\\text{ in.}^2 \\implies V_{\\text{bolt}} = n v_1 = ${numConnectionBolts} \\times ${result.connections.singleBoltShearCapacityKip} = ${result.connections.totalBoltShearCapacityKip}\\text{ kips}, \\quad T_{\\text{bolt}} = 0.60 n A_s F_{u,\\text{bolt}} = ${result.connections.totalBoltTensionCapacityKip}\\text{ kips}`}
                </Latex>
              </div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="F_{t(v)} \text{ \& } P_{\text{brg}}" />
                  </span>
                  <span className="calc-eq-purpose-label">Combined shear + tension elliptical interaction Eq. (4.3-2) &amp; bearing capacity Sec. 4.4</span>
                </div>
                <Latex block>
                  {`F_{t(v)} = F_t \\sqrt{1 - \\left(\\frac{f_v}{F_v}\\right)^2} = ${result.connections.combinedAllowableTensionStressFtVKsi}\\text{ ksi}, \\quad P_{\\text{brg}} = 1.5 n d t F_u = 1.5(${numConnectionBolts})(${boltDiameterIn})(${thicknessIn})(${Math.min(activeSteelGrade.fuKsi, activeBoltSpec.fuKsi)}) = ${result.connections.totalBearingCapacityKip}\\text{ kips}`}
                </Latex>
              </div>
            </div>

            <div className="calc-step">
              <div className="calc-label">Step 2: Minimum End, Spacing &amp; Edge Distances &amp; Attachment Holes (Sec. 4.5–4.6)</div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="e_{\min}, s_{\min} \text{ \& } f_{\min}" />
                  </span>
                  <span className="calc-eq-purpose-label">Minimum end distance Eqs. (4.5-1)–(4.5-3), center spacing Eq. (4.5-5) &amp; edge distance Eqs. (4.5-6)–(4.5-7)</span>
                </div>
                <Latex block>
                  {`e_{\\min} = \\max\\left(\\frac{1.2 P}{F_u t}= ${result.connections.eEq451In},\\; ${result.connections.eEq452In},\\; t + \\frac{d}{2}= ${result.connections.eEq453In}\\right) = ${result.connections.eMinGoverningIn}\\text{ in.}, \\quad s_{\\min} = \\max\\left(\\frac{1.2 P}{F_u t} + 0.6d = ${result.connections.sMinStrengthEq455In},\\; ${result.connections.sMinErectionIn}\\right) = ${result.connections.sMinGoverningIn}\\text{ in.}, \\quad f_{\\min} = ${result.connections.fMinGoverningIn}\\text{ in.}`}
                </Latex>
              </div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="P_{\text{hole}} \text{ \& } P_{\text{wear}}" />
                  </span>
                  <span className="calc-eq-purpose-label">Guy/insulator attachment hole capacity Eqs. (4.6-1)–(4.6-2) &amp; everyday wear limit</span>
                </div>
                <Latex block>
                  {`P_{\\text{hole}} = \\min\\left[0.75\\left(L - 0.5 d_h\\right) t F_u = ${result.connections.attachmentHoleCapacityEq461Kip},\\; 1.35 d t F_u = ${result.connections.attachmentHoleCapacityEq462Kip}\\right] = ${result.connections.attachmentHoleGoverningKip}\\text{ kips}, \\quad P_{\\text{wear}} = 0.50 d t F_u = ${result.connections.attachmentHoleEverydayWearLimitKip}\\text{ kips}`}
                </Latex>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODULE 5: FOUNDATIONS, STUB ANGLES & ANCHORS */}
      {activeTab === 'foundations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '20px',
              alignItems: 'start'
            }}
          >
            <div className="glass-panel" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Anchor size={16} color="var(--accent-primary)" />
                Foundation Anchorage &amp; Shear Connector Inputs (Ch. 7)
              </h3>

              <div className="input-group">
                <label className="input-label">
                  Tower Base Contact Condition (<Latex math="\mu" /> — Table 7.2-1)
                </label>
                <select
                  aria-label="Tower Base Contact Condition"
                  className="select-field"
                  value={foundationContactCondition}
                  onChange={(e) => setFoundationContactCondition(e.target.value)}
                >
                  {CONTACT_CONDITIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 165px), 1fr))', gap: '10px' }}>
                <div className="input-group">
                  <label className="input-label">
                    Concrete Strength <Latex math="f'_c" /> (ksi)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    className="input-field"
                    value={concreteFcKsi}
                    onChange={(e) => setConcreteFcKsi(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Anchor Bolt Count (<Latex math="n_a" />)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="input-field"
                    value={numAnchorBolts}
                    onChange={(e) => setNumAnchorBolts(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Anchor Bolt Dia <Latex math="d_a" /> (in.)
                  </label>
                  <input
                    type="number"
                    step="0.125"
                    className="input-field"
                    value={anchorBoltDiamIn}
                    onChange={(e) => setAnchorBoltDiamIn(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Anchor Bolt <Latex math="F_y" /> (ksi)
                  </label>
                  <input
                    type="number"
                    step="5"
                    className="input-field"
                    value={anchorBoltFyKsi}
                    onChange={(e) => setAnchorBoltFyKsi(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Foundation Uplift <Latex math="T" /> (kips)
                  </label>
                  <input
                    type="number"
                    step="5"
                    className="input-field"
                    value={foundationUpliftTKip}
                    onChange={(e) => setFoundationUpliftTKip(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Horizontal Base Shear <Latex math="V" /> (kips)
                  </label>
                  <input
                    type="number"
                    step="2"
                    className="input-field"
                    value={foundationShearVKip}
                    onChange={(e) => setFoundationShearVKip(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>
                ASCE 10-15 Chapter 7 Anchorage &amp; Shear Connector Capacities
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 165px), 1fr))', gap: '12px', fontSize: '13px' }}>
                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Stub Angle Utilization (Eq. 7.4-1)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                    {result.foundations.stubAngleUtilizationPercent.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Req Area <Latex math={`A_a = ${result.foundations.stubAngleRequiredAreaIn2.toFixed(2)}\\text{ in.}^2`} />
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Anchor Bolt Interaction (Eqs. 7.4-2–7.4-4)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                    {result.foundations.anchorBoltUtilizationPercent.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Friction <Latex math={`\\mu = ${result.foundations.frictionCoeffMu.toFixed(2)}`} /> • Req <Latex math={`A_s = ${result.foundations.anchorBoltGoverningRequiredAreaIn2.toFixed(2)}\\text{ in.}^2`} />
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Concrete Pull-Out &amp; Embedment (Sec. 7.5.2)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                    Min <Latex math={`L_{\\min} = ${result.foundations.minAnchorEmbedmentDepthIn.toFixed(1)}\\text{ in.}`} />
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    ACI Side Cover <Latex math={`m_t = ${result.foundations.aciSideCoverTensionMtIn.toFixed(1)}\\text{ in.},\\; m_s = ${result.foundations.aciSideCoverShearMsIn.toFixed(1)}\\text{ in.}`} />
                  </div>
                </div>

                <div className="glass-inset" style={{ padding: '14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                    Shear Connectors (Eqs. 7.6-1–7.6-3)
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>
                    Stud <Latex math="Q_n" />: {result.foundations.studConnectorCapacityQnKip.toFixed(2)} kips
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Angle <Latex math="P_n" />: {result.foundations.angleConnectorCapacityPKip.toFixed(2)} kips (<Latex math={`x=${result.foundations.angleConnectorEffectiveXIn.toFixed(2)}\\text{ in.}`} />)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Mathematical Derivation for Foundations & Anchor Bolts */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={16} color="var(--accent-primary)" />
              Step-by-Step Foundation Anchorage &amp; Shear Connector Equations (ASCE 10-15 Ch. 7 &amp; Table 7.2-1)
            </h3>

            <div className="calc-step">
              <div className="calc-label">Step 1: Stub Angle &amp; Anchor Bolt Shear-Friction Interaction (Sec. 7.4.1–7.4.2)</div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="A_a \text{ \& } A_{s,\text{req}}" />
                  </span>
                  <span className="calc-eq-purpose-label">Stub angle area Eq. (7.4-1) and anchor bolt shear-friction area Eqs. (7.4-2)–(7.4-4)</span>
                </div>
                <Latex block>
                  {`A_a = \\frac{P}{F_y} + \\frac{V}{0.75 F_y} = ${result.foundations.stubAngleRequiredAreaIn2}\\text{ in.}^2, \\quad A_{s,\\text{uplift}} = \\frac{T}{F_y} + \\frac{V}{0.85 \\mu F_y} = \\frac{${foundationUpliftTKip}}{${anchorBoltFyKsi}} + \\frac{${foundationShearVKip}}{0.85(${result.foundations.frictionCoeffMu})(${anchorBoltFyKsi})} = ${result.foundations.anchorBoltRequiredAreaUpliftIn2}\\text{ in.}^2 \\le A_{s,\\text{prov}} = ${result.foundations.anchorBoltTotalProvidedAreaIn2}\\text{ in.}^2`}
                </Latex>
              </div>
            </div>

            <div className="calc-step">
              <div className="calc-label">Step 2: Concrete Embedment, ACI 349 Side Cover &amp; Shear Connectors (Sec. 7.5–7.6)</div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="L_{\min}, m_t, m_s" />
                  </span>
                  <span className="calc-eq-purpose-label">Minimum anchor embedment Sec. 7.5.2.1 &amp; ACI 349 side cover Eqs. (C7.5-1)–(C7.5-2)</span>
                </div>
                <Latex block>
                  {`L_{\\min} = 12 d \\sqrt{\\frac{F_u}{58}} = ${result.foundations.minAnchorEmbedmentDepthIn}\\text{ in.}, \\quad m_t = 0.66 d \\sqrt{\\frac{F_y}{\\sqrt{f'_c}}} = ${result.foundations.aciSideCoverTensionMtIn}\\text{ in.}, \\quad m_s = 1.8 d \\sqrt{\\frac{F_y}{\\sqrt{f'_c}}} = ${result.foundations.aciSideCoverShearMsIn}\\text{ in.}`}
                </Latex>
              </div>

              <div className="calc-eq-item">
                <div className="calc-eq-meta">
                  <span className="calc-eq-var-badge">
                    <Latex math="Q_n \text{ \& } P_{\text{angle}}" />
                  </span>
                  <span className="calc-eq-purpose-label">Headed stud connector Eq. (7.6-1) and angle shear connector Eqs. (7.6-2)–(7.6-3)</span>
                </div>
                <Latex block>
                  {`Q_n = 0.5 \\phi A_{sc} \\sqrt{f'_c E_c} = ${result.foundations.studConnectorCapacityQnKip}\\text{ kips}, \\quad P_{\\text{angle}} = 1.19 f'_c B \\left(t + R + \\frac{x}{2}\\right) = ${result.foundations.angleConnectorCapacityPKip}\\text{ kips} \\quad (x = ${result.foundations.angleConnectorEffectiveXIn}\\text{ in.})`}
                </Latex>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close CalculatorWorkspaceShell (TraceViewer rendered in belowSplit) */}
    </CalculatorWorkspaceShell>
  );
}
