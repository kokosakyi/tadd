/**
 * CSA C22.3 No. 60826-10 (R2015) / IEC 60826:2003 — Table 14
 * "Damage and failure limits of supports"
 * (See Clause 7.3.1.)
 *
 * Transcribed from:
 *   - IEC 60826:2003, Page 93 (PDF Page 205)
 */

export const TABLE_14_META = {
  id: 'csa-c22.3-60826/table14',
  standard: 'CSA C22.3 No. 60826-10 (R2015)',
  iecReference: 'IEC 60826:2003',
  section: '7.3.1 Limit states for line components',
  title: 'Damage and failure limits of supports',
  references: ['7.3.1', 'Table 3', 'Table 15', 'Table 16', 'Table 17'],
  iecPage: 93,
  pdfPages: [205],
  notes: {
    note1:
      'The deformation of compression elements is the maximum deflection from the line joining end points. For elements subjected to moments, it is the displacement of the free end from the vertical.',
    note2: 'l is the free length of the element.',
    note3: 'The width of crack for concrete poles to be agreed upon.',
  },
  clauses: {
    '7.3.1': {
      title: 'Limit states for line components',
      text:
        'Tables 14 to 17 specify damage limits and failure limits for line components with regard to the system. In the absence of relevant data, these values constitute acceptable design limits.',
    },
  },
};

export const TABLE_14_ROWS = [
  {
    supportType: 'Lattice towers, self-supporting or guyed',
    materialOrElements: 'All elements, except guys',
    loadingMode: 'Tension',
    damageLimit: 'Yield (elastic) stress',
    failureLimit: 'Ultimate (breaking) tensile stress',
  },
  {
    supportType: 'Lattice towers, self-supporting or guyed',
    materialOrElements: 'All elements, except guys',
    loadingMode: 'Shear',
    damageLimit: '90% (elastic) shear stress',
    failureLimit: 'Shear (breaking) stress',
  },
  {
    supportType: 'Lattice towers, self-supporting or guyed',
    materialOrElements: 'All elements, except guys',
    loadingMode: 'Compression (buckling)',
    damageLimit: 'Non-elastic deformation from l/500 to l/100',
    failureLimit: 'Collapse by instability',
  },
  {
    supportType: 'Lattice towers, self-supporting or guyed',
    materialOrElements: 'Steel guys',
    loadingMode: 'Tension',
    damageLimit:
      'Lowest value of: yield stress (70% to 75% UTS); deformation corresponding to 5% reduction in tower strength; or need to readjust tension',
    failureLimit: 'Ultimate tensile stress',
  },
  {
    supportType: 'Poles',
    materialOrElements: 'Steel',
    loadingMode: 'Moments',
    damageLimit: '1% non-elastic deformation at the top, or elastic deformation that impairs clearances',
    failureLimit: 'Local buckling in compression or ultimate tensile stress in tension',
  },
  {
    supportType: 'Poles',
    materialOrElements: 'Steel',
    loadingMode: 'Compression (buckling)',
    damageLimit: 'Non-elastic deformation from l/500 to l/100',
    failureLimit: 'Collapse by instability',
  },
  {
    supportType: 'Poles',
    materialOrElements: 'Wood',
    loadingMode: 'Moments',
    damageLimit: '3% non-elastic displacement at the top',
    failureLimit: 'Ultimate tensile stress',
  },
  {
    supportType: 'Poles',
    materialOrElements: 'Wood',
    loadingMode: 'Compression (buckling)',
    damageLimit: 'Non-elastic deformation from l/500 to l/100',
    failureLimit: 'Collapse by instability',
  },
  {
    supportType: 'Poles',
    materialOrElements: 'Concrete',
    loadingMode: 'Permanent or non-permanent loads',
    damageLimit: 'Crack opening after release of loads, or 0.5% non-elastic deformation',
    failureLimit: 'Collapse of the pole',
  },
];

export const TABLE_14_SUPPORT_LIMIT_STATES = TABLE_14_ROWS;
