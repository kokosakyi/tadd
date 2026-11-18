import React, { useState, useMemo } from 'react';
import {
  Activity,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Anchor,
  Wrench,
  Compass
} from 'lucide-react';
import {
  calculateAsce10Design,
  computeCompressiveStressFaKsi,
  getAllAsceSteelGrades,
  getAllAsceAngleSections,
  getAllAsceBoltSpecs,
  getAllAsceBracingCurves
} from '../../core/asce10/asce10Engine';
import TraceViewer from '../common/TraceViewer';
import Latex from '../common/Latex';

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

const SUB_TABS = [
  { id: 'compression', label: 'Compression & Buckling (Sec. 3.6–3.9)' },
  { id: 'tension', label: 'Tension & Block Shear (Sec. 3.10)' },
  { id: 'combined', label: 'Combined & Bending (Sec. 3.12–3.15)' },
  { id: 'connections', label: 'Bolts & Spacing (Ch. 4)' },
  { id: 'foundations', label: 'Foundations & Anchors (Ch. 7)' }
];

export default function AsceTowerDesignView({ onOpenCitation }) {
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

  const [activeTab, setActiveTab] = useState('compression');
  const [activePresetId, setActivePresetId] = useState('ex1_leg');

  // Material & Section State
  const [steelGradeId, setSteelGradeId] = useState('A572_50');
  const [sectionId, setSectionId] = useState('L8x8x9/16');
  const [sectionType, setSectionType] = useState('equal_angle');
  const [legWidthIn, setLegWidthIn] = useState(8.0);
  const [shortLegWidthIn, setShortLegWidthIn] = useState(8.0);
  const [thicknessIn, setThicknessIn] = useState(0.5625);
  const [filletRadiusIn, setFilletRadiusIn] = useState(0.625);
  const [grossAreaIn2, setGrossAreaIn2] = useState(8.68);
  const [rzIn, setRzIn] = useState(1.59);
  const [rxIn, setRxIn] = useState(2.49);
  const [ryIn, setRyIn] = useState(2.49);
  const [ruIn, setRuIn] = useState(3.15);
  const [isColdFormed, setIsColdFormed] = useState(false);
  const [bendRadiusMultiplier, setBendRadiusMultiplier] = useState(2.0);
  const [warpingConstantCwIn6, setWarpingConstantCwIn6] = useState(0.441);
  const [torsionConstantJIn4, setTorsionConstantJIn4] = useState(0.00623);
  const [polarInertiaIpsIn4, setPolarInertiaIpsIn4] = useState(5.18);
  const [shearCenterDistUoIn, setShearCenterDistUoIn] = useState(1.64);

  // Compression & Slenderness State
  const [memberCategory, setMemberCategory] = useState('leg');
  const [bracingCurve, setBracingCurve] = useState('curve_1_leg');
  const [unbracedLengthIn, setUnbracedLengthIn] = useState(121);
  const [appliedCompressionKip, setAppliedCompressionKip] = useState(180);
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

  const handleSelectSection = (nextSecId) => {
    setSectionId(nextSecId);
    const sec = angleSections.find((s) => s.id === nextSecId);
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
      setSectionType(sec.legLongIn === sec.legShortIn ? 'equal_angle' : 'unequal_angle');
    }
  };

  // One-Click Benchmark Presets from ASCE 10-15 Appendix B & Table C4-1
  const applyPreset = (presetId) => {
    setActivePresetId(presetId);
    if (presetId === 'ex1_leg') {
      // Appendix B Ex. 1: L8x8x9/16 Leg Member (A572 Gr. 50, L = 121 in., Curve 1)
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
      // Appendix B Ex. 2: L1-3/4x1-1/4x3/16 Bracing Member (A36, Curve 3)
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
      // Appendix B Ex. 10: Cold-Formed Angle Local Buckling (t = 0.135 in., w = 2.6775 in., w/t = 19.83, Fy = 50 ksi, L = 58.5 in.)
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
      // Appendix B Ex. 11: 3x3x0.135 Symmetrical Lipped Cold-Formed Angle Torsional-Flexural Buckling (L = 90 in.)
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
      // Table C4-1 Benchmark: 3/4 in. A394 Type 0 Bolt in 1/4 in. A36 Angle
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
      sectionType,
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
    sectionType,
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

  const fmtKips = (val) => `${Number(val).toFixed(2)} kips (${(Number(val) * 4.44822).toFixed(1)} kN)`;
  const fmtKsi = (val) => `${Number(val).toFixed(2)} ksi (${(Number(val) * 6.89476).toFixed(1)} MPa)`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Module Header Banner */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Compass size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              ASCE/SEI 10-15 Latticed Steel Tower Design Engine
            </h2>
            <span className="citation-badge">ASCE 10-15 Ch. 3, 4 &amp; 7</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Full structural capacity checks for axial compression &amp; local buckling, net section tension &amp; block shear, beam-column interaction, bolted connections, and foundation anchorages.
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
            { id: 'ex11_lipped', label: 'Ex. 11: Lipped Angle r_tf' },
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

      {/* Top Executive Capacity KPI Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px'
        }}
      >
        <div className="glass-panel" style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Compression Capacity (<Latex math="P_a" />)
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {result.compression.capacityPaKip.toFixed(2)} kips
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <Latex math={`F_a = ${result.compression.faKsi.toFixed(2)}\\text{ ksi}`} /> • Util:{' '}
            <strong
              style={{
                color: result.compression.utilizationPercent > 100 ? 'var(--accent-danger)' : 'var(--accent-success)'
              }}
            >
              {result.compression.utilizationPercent.toFixed(1)}%
            </strong>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Tension &amp; Block Shear (<Latex math="\min(P_t, P_{bs})" />)
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {result.tension.governingTensionCapacityKip.toFixed(2)} kips
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <Latex math={`A_n = ${result.tension.netAreaAnIn2.toFixed(3)}\\text{ in.}^2`} /> • Util:{' '}
            <strong
              style={{
                color: result.tension.utilizationPercent > 100 ? 'var(--accent-danger)' : 'var(--accent-success)'
              }}
            >
              {result.tension.utilizationPercent.toFixed(1)}%
            </strong>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Combined Axial + Bending (Sec. 3.12)
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {result.combinedAndBeams.interactionPercent.toFixed(1)}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <Latex math={`M_b = ${result.combinedAndBeams.lateralBucklingMomentMbInKip.toFixed(1)}\\text{ kip-in.}`} /> •{' '}
            <strong
              style={{
                color: result.combinedAndBeams.isPassing ? 'var(--accent-success)' : 'var(--accent-danger)'
              }}
            >
              {result.combinedAndBeams.isPassing ? 'PASS' : 'OVERSTRESSED'}
            </strong>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Bolted Connection (<Latex math="n = " /> {numConnectionBolts} Bolts)
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {result.connections.governingConnectionCapacityKip.toFixed(2)} kips
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <Latex math={`e_{\\min} = ${result.connections.eMinGoverningIn.toFixed(2)}"`} /> •{' '}
            <strong
              style={{
                color: result.connections.areDistancesCompliant
                  ? 'var(--accent-success)'
                  : 'var(--accent-warning)'
              }}
            >
              {result.connections.areDistancesCompliant ? 'Spacing OK' : 'Check Spacing'}
            </strong>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Overall ASCE 10-15 Status
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '6px',
              fontSize: '18px',
              fontWeight: 800,
              color:
                result.overallStatus === 'PASS'
                  ? 'var(--accent-success)'
                  : result.overallStatus === 'MARGINAL'
                  ? 'var(--accent-warning)'
                  : 'var(--accent-danger)'
            }}
          >
            {result.overallStatus === 'PASS' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            {result.overallStatus}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Anchor Util: {result.foundations.anchorBoltUtilizationPercent.toFixed(1)}%
          </div>
        </div>
      </div>

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
            <label className="input-label">Steel Specification (Sec. 3.2)</label>
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
            <label className="input-label">Angle Section Designation</label>
            <select
              aria-label="Angle Section Designation"
              className="select-field"
              value={sectionId}
              onChange={(e) => handleSelectSection(e.target.value)}
            >
              {angleSections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.designation} (A={sec.areaIn2} in², r_z={sec.rzIn} in.)
                </option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label">Applied Axial Compression P (kips)</label>
            <input
              type="number"
              step="1"
              className="input-field"
              value={appliedCompressionKip}
              onChange={(e) => setAppliedCompressionKip(Number(e.target.value))}
            />
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label">Applied Axial Tension T (kips)</label>
            <input
              type="number"
              step="1"
              className="input-field"
              value={appliedTensionKip}
              onChange={(e) => setAppliedTensionKip(Number(e.target.value))}
            />
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
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
              <label className="input-label">Member Slenderness Category (Sec. 3.4)</label>
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
              <label className="input-label">End Restraint &amp; Framing Eccentricity Curve (Table 3.4-1)</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div className="input-group">
                <label className="input-label">Unbraced Length L (in.)</label>
                <input
                  type="number"
                  step="1"
                  className="input-field"
                  value={unbracedLengthIn}
                  onChange={(e) => setUnbracedLengthIn(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Leg Width b (in.)</label>
                <input
                  type="number"
                  step="0.125"
                  className="input-field"
                  value={legWidthIn}
                  onChange={(e) => setLegWidthIn(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Thickness t (in.)</label>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">Subpanel Force P₁ (kips, +Comp)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={subpanelForceP1Kip}
                      onChange={(e) => setSubpanelForceP1Kip(Number(e.target.value))}
                    />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">Subpanel Force P₂ (kips, +Comp/-Tens)</label>
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
                Symmetrical Lipped Cold-Formed Angle Torsional-Flexural Check (Sec. 3.8)
              </label>
              {sectionType === 'lipped_angle' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">J (in.⁴)</label>
                    <input
                      type="number"
                      step="0.001"
                      className="input-field"
                      value={torsionConstantJIn4}
                      onChange={(e) => setTorsionConstantJIn4(Number(e.target.value))}
                    />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">C_w (in.⁶)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="input-field"
                      value={warpingConstantCwIn6}
                      onChange={(e) => setWarpingConstantCwIn6(Number(e.target.value))}
                    />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="input-label">u_o (in.)</label>
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
                  C_c = {result.compression.cc.toFixed(1)}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
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
                  <Latex math={`F_{cr} = ${result.compression.fcrKsi.toFixed(2)}\\text{ ksi}`} /> ({result.compression.localBucklingRegime})
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
                  {result.compression.rtfIn !== null && ` • r_tf = ${result.compression.rtfIn.toFixed(3)} in.`}
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
                  1.5% to 2.5% of Main Member Force (Eq. 3.16-1)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODULE 2: TENSION & BLOCK SHEAR */}
      {activeTab === 'tension' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
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
              <label className="input-label">Angle End Connection Concentricity (Sec. 3.10.2)</label>
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
              <label className="input-label">Hole Fabrication Method (Sec. 3.10.1)</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div className="input-group">
                <label className="input-label">Bolts Across Section Width</label>
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
                <label className="input-label">Number of Zigzag Stagger Spaces</label>
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
                <label className="input-label">Stagger Pitch s (in.)</label>
                <input
                  type="number"
                  step="0.125"
                  className="input-field"
                  value={staggerPitchSIn}
                  onChange={(e) => setStaggerPitchSIn(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Transverse Gage g (in.)</label>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">End Distance a (in.)</label>
                  <input
                    type="number"
                    step="0.125"
                    className="input-field"
                    value={endDistAIn}
                    onChange={(e) => setEndDistAIn(Number(e.target.value))}
                  />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Bolt Spacing b (in.)</label>
                  <input
                    type="number"
                    step="0.125"
                    className="input-field"
                    value={spacingBIn}
                    onChange={(e) => setSpacingBIn(Number(e.target.value))}
                  />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Bolts in Line</label>
                  <input
                    type="number"
                    step="1"
                    className="input-field"
                    value={numBoltsInLine}
                    onChange={(e) => setNumBoltsInLine(Number(e.target.value))}
                  />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Toe Distance c (in.)</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div className="glass-inset" style={{ padding: '14px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                  Net Section Area <Latex math="A_n" /> (Sec. 3.10.1)
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                  {result.tension.netAreaAnIn2.toFixed(3)} in.²
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Hole Dia <Latex math={`d_h = ${result.tension.effectiveHoleDiamIn.toFixed(4)}"`} /> •{' '}
                  <Latex math={`s^2/(4g) = ${result.tension.staggerAdditionIn.toFixed(3)}"`} />
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
      )}

      {/* SUB-MODULE 3: COMBINED AXIAL + BENDING & BEAM SHEAR */}
      {activeTab === 'combined' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px',
            alignItems: 'start'
          }}
        >
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>
              Combined Axial + Bending &amp; Equal-Leg Angle LTB Inputs
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div className="input-group">
                <label className="input-label">Applied Moment M_x (kip-in.)</label>
                <input
                  type="number"
                  step="5"
                  className="input-field"
                  value={appliedMomentMxInKip}
                  onChange={(e) => setAppliedMomentMxInKip(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Applied Moment M_y (kip-in.)</label>
                <input
                  type="number"
                  step="5"
                  className="input-field"
                  value={appliedMomentMyInKip}
                  onChange={(e) => setAppliedMomentMyInKip(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Coefficient C_m (Sec. 3.12)</label>
                <input
                  type="number"
                  step="0.05"
                  className="input-field"
                  value={cmFactor}
                  onChange={(e) => setCmFactor(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Load Angle theta (deg, Sec. 3.14.3)</label>
                <input
                  type="number"
                  step="5"
                  className="input-field"
                  value={loadAngleThetaDeg}
                  onChange={(e) => setLoadAngleThetaDeg(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Beam Web Depth h (in.)</label>
                <input
                  type="number"
                  step="0.5"
                  className="input-field"
                  value={webDepthHIn}
                  onChange={(e) => setWebDepthHIn(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Applied Shear Force V (kips)</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
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
                  <Latex math={`M_e = ${result.combinedAndBeams.elasticCriticalMomentMeInKip.toFixed(1)}, M_y = ${result.combinedAndBeams.yieldMomentMyInKip.toFixed(1)}\\text{ kip-in.}`} />
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
      )}

      {/* SUB-MODULE 4: BOLTED CONNECTIONS & SPACING */}
      {activeTab === 'connections' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
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
              <label className="input-label">Bolt Specification (Sec. 4.3)</label>
              <select
                aria-label="Bolt Specification"
                className="select-field"
                value={boltSpecId}
                onChange={(e) => setBoltSpecId(e.target.value)}
              >
                {boltSpecs.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (F_u = {b.fuKsi} ksi)
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Edge Condition (Sec. 4.5.3)</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div className="input-group">
                <label className="input-label">Bolt Diameter d (in.)</label>
                <input
                  type="number"
                  step="0.125"
                  className="input-field"
                  value={boltDiameterIn}
                  onChange={(e) => setBoltDiameterIn(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Number of Bolts n</label>
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
                <label className="input-label">Threads / Inch</label>
                <input
                  type="number"
                  step="1"
                  className="input-field"
                  value={threadsPerInch}
                  onChange={(e) => setThreadsPerInch(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div className="input-group">
                <label className="input-label">Actual End e (in.)</label>
                <input
                  type="number"
                  step="0.0625"
                  className="input-field"
                  value={actualEndDistIn}
                  onChange={(e) => setActualEndDistIn(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Actual Spacing s (in.)</label>
                <input
                  type="number"
                  step="0.0625"
                  className="input-field"
                  value={actualSpacingIn}
                  onChange={(e) => setActualSpacingIn(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Actual Edge f (in.)</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div className="glass-inset" style={{ padding: '14px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600 }}>
                  Bolt Shear Capacity (Sec. 4.3.2)
                </div>
                <div style={{ fontSize: '17px', fontWeight: 800, marginTop: '4px' }}>
                  {result.connections.totalBoltShearCapacityKip.toFixed(2)} kips ({result.connections.singleBoltShearCapacityKip.toFixed(2)} kips/bolt)
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Bearing <Latex math="1.5 d t F_u" />: {result.connections.totalBearingCapacityKip.toFixed(2)} kips
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
      )}

      {/* SUB-MODULE 5: FOUNDATIONS, STUB ANGLES & ANCHORS */}
      {activeTab === 'foundations' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
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
              <label className="input-label">Tower Base Contact Condition (Table 7.2-1)</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div className="input-group">
                <label className="input-label">Concrete Strength f&apos;_c (ksi)</label>
                <input
                  type="number"
                  step="0.5"
                  className="input-field"
                  value={concreteFcKsi}
                  onChange={(e) => setConcreteFcKsi(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Anchor Bolt Count</label>
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
                <label className="input-label">Anchor Bolt Dia d (in.)</label>
                <input
                  type="number"
                  step="0.125"
                  className="input-field"
                  value={anchorBoltDiamIn}
                  onChange={(e) => setAnchorBoltDiamIn(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Anchor Bolt F_y (ksi)</label>
                <input
                  type="number"
                  step="5"
                  className="input-field"
                  value={anchorBoltFyKsi}
                  onChange={(e) => setAnchorBoltFyKsi(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Foundation Uplift T (kips)</label>
                <input
                  type="number"
                  step="5"
                  className="input-field"
                  value={foundationUpliftTKip}
                  onChange={(e) => setFoundationUpliftTKip(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Horizontal Base Shear V (kips)</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
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
                  Min <Latex math={`L_{\\min} = ${result.foundations.minAnchorEmbedmentDepthIn.toFixed(1)}"`} />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  ACI Side Cover <Latex math={`m_t = ${result.foundations.aciSideCoverTensionMtIn.toFixed(1)}", m_s = ${result.foundations.aciSideCoverShearMsIn.toFixed(1)}"`} />
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
                  Angle <Latex math="P_n" />: {result.foundations.angleConnectorCapacityPKip.toFixed(2)} kips (<Latex math={`x=${result.foundations.angleConnectorEffectiveXIn.toFixed(2)}"`} />)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calculation Audit Trace Viewer */}
      <TraceViewer trace={result.trace} onOpenCitation={onOpenCitation} />
    </div>
  );
}
