/**
 * ASCE/SEI 10-15 — Table 3.4-1
 * "Slenderness Limits and Effective Length (KL/r) Equations for Compression & Tension Members (Curves 1–6)"
 * (See Clauses 3.4, 3.6, 3.7.4, 3.7.4.1, 3.7.4.2, 3.7.4.3, 3.7.4.4, C3.4, and C3.7.4, Pages 5–7 and 35–37.)
 */

export const TABLE_3_4_1_META = {
  id: 'asce_10_15/table3_4_1',
  standard: 'ASCE 10-15',
  title: 'Slenderness Ratios and Effective Length (KL/r) Formulas for Angle Members (Curves 1–6)',
  unit: 'Dimensionless (L/r, KL/r)',
  evaluatedAt: 'Transition point $L/r = 120$ separates connection eccentricity governance ($L/r \\le 120$) from end rotational restraint governance ($L/r > 120$)',
  references: ['3.4', '3.6', '3.7.4', '3.7.4.1', '3.7.4.2', '3.7.4.3', '3.7.4.4', 'C3.4', 'C3.7.4'],
  notes: [
    'Curve numbers (Curves 1 through 6) correspond to Fig. C3-2 and ASCE Manual of Practice No. 52 (1988).',
    'A single-bolt connection at either the end of a member or a point of intermediate support provides no restraint against rotation (Section 3.7.4.5).',
    'A multiple-bolt connection made only on a gusset plate without also being framed to the restraining member provides no rotational restraint (Section 3.7.4.5).',
    'To justify partial rotational restraint (Curves 5 and 6), the restrained member should have $\\ge 2$ bolts and the restraining member stiffness factor $I/L$ in the stress plane should equal or exceed $\\sum(I/L)$ of the restrained members connected to it (Section C3.7.4).'
  ]
};

export const ASCE_10_15_TABLE_3_4_1_ROWS = [
  {
    equationId: 'Eq. (3.7-4)',
    curveNumber: 'Curve 1 (Leg)',
    memberCategory: 'Leg Members',
    boundaryCondition: 'Bolted in both faces at connections',
    slendernessRange: '$0 \\le \\frac{L}{r} \\le 150$',
    effectiveSlendernessFormula: '$\\frac{KL}{r} = \\frac{L}{r}$',
    predominantFactor: 'Concentric loading ($K = 1.0$)'
  },
  {
    equationId: 'Eq. (3.7-5)',
    curveNumber: 'Curve 1',
    memberCategory: 'Other Compression & Redundant Members',
    boundaryCondition: 'Concentric load at both ends of unsupported panel',
    slendernessRange: '$0 \\le \\frac{L}{r} \\le 120$',
    effectiveSlendernessFormula: '$\\frac{KL}{r} = \\frac{L}{r}$',
    predominantFactor: 'Concentric loading (Basic SSRC curve)'
  },
  {
    equationId: 'Eq. (3.7-6)',
    curveNumber: 'Curve 2',
    memberCategory: 'Other Compression & Redundant Members',
    boundaryCondition: 'Concentric load at one end and normal framing eccentricity at other end',
    slendernessRange: '$0 \\le \\frac{L}{r} \\le 120$',
    effectiveSlendernessFormula: '$\\frac{KL}{r} = 30 + 0.75\\left(\\frac{L}{r}\\right)$',
    predominantFactor: 'One-end framing eccentricity'
  },
  {
    equationId: 'Eq. (3.7-7)',
    curveNumber: 'Curve 3',
    memberCategory: 'Other Compression & Redundant Members',
    boundaryCondition: 'Normal framing eccentricities at both ends of unsupported panel',
    slendernessRange: '$0 \\le \\frac{L}{r} \\le 120$',
    effectiveSlendernessFormula: '$\\frac{KL}{r} = 60 + 0.50\\left(\\frac{L}{r}\\right)$',
    predominantFactor: 'Two-end framing eccentricity'
  },
  {
    equationId: 'Eq. (3.7-8)',
    curveNumber: 'Curve 4',
    memberCategory: 'Other Compression Members',
    boundaryCondition: 'Unrestrained against rotation at both ends (e.g., single-bolt ends)',
    slendernessRange: '$120 \\le \\frac{L}{r} \\le 200$',
    effectiveSlendernessFormula: '$\\frac{KL}{r} = \\frac{L}{r}$',
    predominantFactor: 'Pin-ended elastic buckling (Euler)'
  },
  {
    equationId: 'Eq. (3.7-9)',
    curveNumber: 'Curve 5',
    memberCategory: 'Other Compression Members',
    boundaryCondition: 'Partially restrained against rotation at one end of unsupported panel',
    slendernessRange: '$120 \\le \\frac{L}{r} \\le 225 \\;\\left(\\frac{KL}{r} \\le 200\\right)$',
    effectiveSlendernessFormula: '$\\frac{KL}{r} = 28.6 + 0.762\\left(\\frac{L}{r}\\right)$',
    predominantFactor: 'One-end rotational restraint'
  },
  {
    equationId: 'Eq. (3.7-10)',
    curveNumber: 'Curve 6',
    memberCategory: 'Other Compression Members',
    boundaryCondition: 'Partially restrained against rotation at both ends of unsupported panel',
    slendernessRange: '$120 \\le \\frac{L}{r} \\le 250 \\;\\left(\\frac{KL}{r} \\le 200\\right)$',
    effectiveSlendernessFormula: '$\\frac{KL}{r} = 46.2 + 0.615\\left(\\frac{L}{r}\\right)$',
    predominantFactor: 'Two-end rotational restraint'
  },
  {
    equationId: 'Eq. (3.7-11)',
    curveNumber: 'Curve 4 (Redundant)',
    memberCategory: 'Redundant Members',
    boundaryCondition: 'Unrestrained against rotation at both ends of unsupported panel',
    slendernessRange: '$120 \\le \\frac{L}{r} \\le 250$',
    effectiveSlendernessFormula: '$\\frac{KL}{r} = \\frac{L}{r}$',
    predominantFactor: 'Redundant limit $\\frac{KL}{r} \\le 250$'
  },
  {
    equationId: 'Eq. (3.7-12)',
    curveNumber: 'Curve 5 (Redundant)',
    memberCategory: 'Redundant Members',
    boundaryCondition: 'Partially restrained against rotation at one end of unsupported panel',
    slendernessRange: '$120 \\le \\frac{L}{r} \\le 290 \\;\\left(\\frac{KL}{r} \\le 250\\right)$',
    effectiveSlendernessFormula: '$\\frac{KL}{r} = 28.6 + 0.762\\left(\\frac{L}{r}\\right)$',
    predominantFactor: 'One-end restraint (Redundant $\\frac{KL}{r} \\le 250$)'
  },
  {
    equationId: 'Eq. (3.7-13)',
    curveNumber: 'Curve 6 (Redundant)',
    memberCategory: 'Redundant Members',
    boundaryCondition: 'Partially restrained against rotation at both ends of unsupported panel',
    slendernessRange: '$120 \\le \\frac{L}{r} \\le 330 \\;\\left(\\frac{KL}{r} \\le 250\\right)$',
    effectiveSlendernessFormula: '$\\frac{KL}{r} = 46.2 + 0.615\\left(\\frac{L}{r}\\right)$',
    predominantFactor: 'Two-end restraint (Redundant $\\frac{KL}{r} \\le 250$)'
  },
  {
    equationId: 'Sec. 3.4 & 5.1.8',
    curveNumber: 'Tension-Only',
    memberCategory: 'Tension-Only Members (with Draw)',
    boundaryCondition: 'At least 2 bolts on one end; detailed short for draw',
    slendernessRange: '$300 < \\frac{L}{r} \\le 500$',
    effectiveSlendernessFormula: 'Unable to resist compression ($F_t = F_y$ or $0.9 F_y$ on $A_n$)',
    predominantFactor: 'Out-of-plane elastic bowing without permanent set'
  }
];
