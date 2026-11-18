/**
 * ASCE/SEI 10-15 — Table C.11-1
 * "Current and Historical ASTM & CSA Structural Steel Specifications Used in Latticed Transmission Towers"
 * (See Clauses 1.2, 3.2, 4.3.1, C3.1, C3.2, C.4, C.5, and C.11, Pages 1, 5, 15, 35, and 67–69.)
 */

export const TABLE_C_11_1_META = {
  id: 'asce_10_15/tableC_11_1',
  standard: 'ASCE 10-15',
  title: 'Current and Historical Structural Steel & Fastener Specifications in Transmission Towers (Sec. 3.2 & App. C.11)',
  unit: 'ksi (MPa)',
  evaluatedAt: 'Minimum guaranteed yield stress ($F_y$) and specified minimum tensile strength ($F_u$)',
  references: ['1.2', '3.2', '4.3.1', 'C3.1', 'C3.2', 'C.4', 'C.5', 'C.11'],
  notes: [
    'Commentary C3.1 notes that ASCE 10-15 is suitable for steels with yield points up to $F_y = 65\\text{ ksi}$ ($448\\text{ MPa}$).',
    'Commentary C3.2 suggests a ratio of $F_u / F_y \\ge 1.15$ for steel used for members.',
    'Per Appendix C.11, towers fabricated prior to 1960 in the U.S. likely used ASTM A7 steel; between 1960 and 1970 either A7 or A36; and after 1970 a minimum of A36 steel.'
  ]
};

export const ASCE_10_15_TABLE_C_11_1_ROWS = [
  {
    specification: 'ASTM A7 (A7-36 to A7-61T)',
    eraOrAdoption: '1901 / 1937 – 1967 (Historical)',
    materialType: 'Carbon Structural Steel for Bridges & Buildings',
    minYield_Fy_ksi: '33 ($0.5 F_u \\ge 33$)',
    tensileStrength_Fu_ksi: '60 – 72',
    applicationNotes: 'Combined A7-36 and A9-36 in 1937; last listed in AISC 6th Ed. (1961). Common in pre-1960 towers.'
  },
  {
    specification: 'ASTM A36 / A36M',
    eraOrAdoption: '1960 – Present (Sec. 3.2)',
    materialType: 'Carbon Structural Steel',
    minYield_Fy_ksi: '36 (248 MPa)',
    tensileStrength_Fu_ksi: '58 – 80 (400–550 MPa)',
    applicationNotes: 'First published as A36-60T in 1960; standard mild steel for tower angles and plates.'
  },
  {
    specification: 'ASTM A242 / A242M',
    eraOrAdoption: '1963 – Present (Sec. 3.2)',
    materialType: 'High-Strength Low-Alloy Structural Steel',
    minYield_Fy_ksi: '42 – 50',
    tensileStrength_Fu_ksi: '63 – 70',
    applicationNotes: 'Introduced in AISC 6th Ed. (1963) for low $L/r$ compression members; atmospheric corrosion resistance.'
  },
  {
    specification: 'ASTM A373-58T',
    eraOrAdoption: '1958 – 1970 (Historical)',
    materialType: 'Structural Steel for Welding',
    minYield_Fy_ksi: '32',
    tensileStrength_Fu_ksi: '58 – 75',
    applicationNotes: 'Referenced in AISC 6th Ed.; dropped in AISC 7th Ed. (1970).'
  },
  {
    specification: 'ASTM A440-63T / A441-63T',
    eraOrAdoption: '1963 – 1980 (Historical)',
    materialType: 'High-Strength / Mn-V Low-Alloy Structural Steel',
    minYield_Fy_ksi: '42 – 50',
    tensileStrength_Fu_ksi: '63 – 70',
    applicationNotes: 'Used in 1960s–1970s high-strength compression members before widespread A572 adoption.'
  },
  {
    specification: 'ASTM A529 / A529M',
    eraOrAdoption: 'Current (Sec. 3.2)',
    materialType: 'High-Strength Carbon-Manganese Steel',
    minYield_Fy_ksi: '42 – 50 (290–345 MPa)',
    tensileStrength_Fu_ksi: '60 – 100',
    applicationNotes: 'Listed in Section 3.2 with $42{,}000\\text{ psi}$ minimum yield point (also available in Grade 50/55).'
  },
  {
    specification: 'ASTM A572 / A572M (Gr. 50, 60, 65)',
    eraOrAdoption: '1966 – Present (Sec. 3.2)',
    materialType: 'HSLA Columbium-Vanadium Structural Steel',
    minYield_Fy_ksi: '50, 60, 65 (345–448 MPa)',
    tensileStrength_Fu_ksi: '65, 75, 80 (450–551 MPa)',
    applicationNotes: 'Most prevalent high-strength steel for US transmission tower legs and primary members.'
  },
  {
    specification: 'ASTM A588 / A588M',
    eraOrAdoption: '1968 – Present (Sec. 3.2)',
    materialType: 'HSLA Weathering Steel (up to 4 in. thick)',
    minYield_Fy_ksi: '50 (345 MPa)',
    tensileStrength_Fu_ksi: '70 (485 MPa)',
    applicationNotes: 'Atmospheric corrosion resistance; requires special detailing per Section 5.1.7.'
  },
  {
    specification: 'ASTM A606 / A606M',
    eraOrAdoption: 'Current (Sec. 3.2)',
    materialType: 'HSLA Hot/Cold-Rolled Sheet and Strip',
    minYield_Fy_ksi: '45 – 50',
    tensileStrength_Fu_ksi: '65 – 70',
    applicationNotes: 'Cold-formed and hot-rolled sheet/strip with improved atmospheric corrosion resistance.'
  },
  {
    specification: 'CSA G40.12 (1964) / CSA G40.21 44W (300W)',
    eraOrAdoption: '1964 – Present (App. C.11)',
    materialType: 'Canadian Structural Quality Steel',
    minYield_Fy_ksi: '44 ($40$ for $\\ge 3/4\\text{ in.}$) [300 MPa]',
    tensileStrength_Fu_ksi: '62 (G40.12) / 65–90 (G40.21)',
    applicationNotes: 'Standard structural steel used by Canadian tower suppliers in lieu of ASTM A36.'
  },
  {
    specification: 'ASTM A394 Type 0 & Type 1 / A325 Bolts',
    eraOrAdoption: 'Current (Sec. 4.3.1 & App. C.5)',
    materialType: 'Steel Transmission Tower Bolts (Zinc-Coated & Bare)',
    minYield_Fy_ksi: 'Proof load per ASTM A394',
    tensileStrength_Fu_ksi: '74 (Type 0) / 120 (Type 1 & A325 $\\le 1\\text{ in.}$)',
    applicationNotes: 'If connecting A572 Gr. 65 ($F_u = 80\\text{ ksi}$) with A394 Type 0 bolts ($F_u = 74\\text{ ksi}$), bolt $F_u$ governs bearing ($1.5 F_u$).'
  }
];
