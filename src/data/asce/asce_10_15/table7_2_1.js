/**
 * ASCE/SEI 10-15 — Table 7.2-1 (Figure 7-2 & Section 7.4.2)
 * "Anchor Bolt Base Friction Coefficients (mu) and Foundation Load Transfer Criteria"
 * (See Clauses 7.2.1–7.2.4, 7.4.1–7.4.3, 7.5.2, and C7.5, Pages 21–23 and 49.)
 */

export const TABLE_7_2_1_META = {
  id: 'asce_10_15/table7_2_1',
  standard: 'ASCE 10-15',
  title: 'Coefficient of Friction (μ) Values and Foundation Anchorage Design Criteria (Fig. 7-2)',
  unit: 'Dimensionless (μ), ksi (MPa)',
  evaluatedAt: 'Design-factored foundation uplift ($T$), downthrust ($D$), and horizontal shear ($V$) loads',
  references: ['7.2.1', '7.2.2', '7.2.3', '7.2.4', '7.4.1', '7.4.2', '7.4.3', '7.5.2', '7.6.1', '7.6.2', 'C7.5'],
  notes: [
    'When shear lugs are attached to the base assembly to transfer shear to the concrete, anchor bolt area need not be checked by Eqs. (7.4-2) and (7.4-4).',
    'A combination of shear lugs and shear friction is not allowed (Section 7.4.2).',
    'Steel exposed to corrosion at or below the ground level shall have a minimum thickness of $3/16\\text{ in.}$ ($4.8\\text{ mm}$) (Section 7.3).'
  ]
};

export const ASCE_10_15_TABLE_7_2_1_ROWS = [
  {
    conditionId: 'Fig. 7-2(a)',
    foundationElement: 'Anchor Bolt Base Assembly (Recessed)',
    contactCondition: 'Concrete or grout against as-rolled steel with contact plane a full plate thickness below concrete surface',
    frictionCoeff_mu: '$\\mu = 0.90$',
    governingEquation: '$A_s = \\frac{T}{F_y} + \\frac{V}{0.90 \\times 0.85 F_y}$ (Uplift) or $A_s = \\frac{V - 0.3D}{0.90 \\times 0.85 F_y}$ (Downthrust)'
  },
  {
    conditionId: 'Fig. 7-2(b)',
    foundationElement: 'Anchor Bolt Base Assembly (Flush)',
    contactCondition: 'Concrete or grout placed against as-rolled steel with contact plane coincidental with concrete surface',
    frictionCoeff_mu: '$\\mu = 0.70$',
    governingEquation: '$A_s = \\frac{T}{F_y} + \\frac{V}{0.70 \\times 0.85 F_y}$ (Uplift) or $A_s = \\frac{V - 0.3D}{0.70 \\times 0.85 F_y}$ (Downthrust)'
  },
  {
    conditionId: 'Fig. 7-2(c)',
    foundationElement: 'Anchor Bolt Base Assembly (Grouted Pad)',
    contactCondition: 'Grouted condition with contact plane between grout and as-rolled steel above concrete surface',
    frictionCoeff_mu: '$\\mu = 0.55$',
    governingEquation: '$A_s = \\frac{T}{F_y} + \\frac{V}{0.55 \\times 0.85 F_y}$ (Uplift) or $A_s = \\frac{V - 0.3D}{0.55 \\times 0.85 F_y}$ (Downthrust)'
  },
  {
    conditionId: 'Sec. 7.4.3',
    foundationElement: 'Anchor Bolts with Base Plates on Leveling Nuts',
    contactCondition: 'Base assembly permanently supported on leveling nuts (not in contact with concrete/grout)',
    frictionCoeff_mu: 'N/A (Side Bearing + Bending)',
    governingEquation: 'Check combined tension/compression + bending + shear per ASCE 48 (2011) Sec. 9.3.3'
  },
  {
    conditionId: 'Sec. 7.4.1',
    foundationElement: 'Stub Angle in Concrete Pier',
    contactCondition: 'Plane of intersection of stub angle with concrete pier surface',
    frictionCoeff_mu: 'N/A (Combined Axial + Shear)',
    governingEquation: '$A_a = \\frac{P}{F_y} + \\frac{V}{0.75 F_y}$ [Eq. (7.4-1)]'
  },
  {
    conditionId: 'Sec. 7.5.2',
    foundationElement: 'Smooth Bar Anchor Bolt Concrete Pull-Out Cone',
    contactCondition: '$45^\\circ$ stress cone radiating from bearing edge of anchor head ($\\phi = 0.65$)',
    frictionCoeff_mu: '$\\phi = 0.65$',
    governingEquation: '$f_t = 0.126 \\phi \\sqrt{f\'_c}\\text{ ksi}$ ($0.33 \\phi \\sqrt{f\'_c}\\text{ MPa}$); $L_{\\text{emb}} \\ge 12d\\sqrt{\\frac{F_u}{58\\Psi}}$'
  },
  {
    conditionId: 'Sec. 7.6.1',
    foundationElement: 'Stud Shear Connectors on Stub Angles',
    contactCondition: 'Headed studs welded to stub angle embedded in ASTM C33 aggregate concrete ($\\phi = 0.85$)',
    frictionCoeff_mu: '$\\phi = 0.85$',
    governingEquation: '$Q_n = 0.5 \\phi A_{sc} \\sqrt{f\'_c E_c} \\le \\text{Bolt Shear Capacity}$ [Eq. (7.6-1)]'
  },
  {
    conditionId: 'Sec. 7.6.2',
    foundationElement: 'Angle Shear Connectors on Stub Angles',
    contactCondition: 'Clip angles symmetrical about CG of stub leg, min spacing $\\ge 2w$',
    frictionCoeff_mu: 'N/A (Concrete Bearing)',
    governingEquation: '$P = 1.19 f\'_c b \\left(t + r + \\frac{x}{2}\\right)$, where $x = t\\sqrt{\\frac{F_y}{1.19 f\'_c}} \\le w - r - t$ [Eqs. (7.6-2), (7.6-3)]'
  }
];
