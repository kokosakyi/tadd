/**
 * CSA C22.3 No. 1 — Table 22
 * "Minimum separations or clearances in any direction from supply conductors to other supply plant attached to the same supporting structure"
 * (See Clauses 5.9.5 and A.5.9.5.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 98 (PDF Page 103)
 *   - Clause 5.9.5, Page 48 (PDF Page 53)
 *   - Clause A.5.9.5, Page 129 (PDF Page 134)
 *
 * All separations in MILLIMETRES (mm).
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_22_META = {
  id: 'csa-c22.3-no1/table22',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum separations or clearances in any direction from supply conductors to other supply plant attached to the same supporting structure',
  unit: 'mm',
  references: ['5.9.5', 'A.5.9.5', '5.2.7', '5.9.1'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'Clearances from connecting wires to switches or arresters may be less than that from line wires to switches or arresters.',
    footnoteDagger: 'For voltages exceeding 50 kV, clearances shall be based on best engineering practices, but shall be not less than the separations specified for 50 kV.',
    footnoteDblDagger: 'Add 10 mm/kV over 22 kV.',
    footnoteSection: 'Add 5 mm/kV over 22 kV.',
    footnoteDblStar: 'This clearance may be reduced to 0 mm for conductors and cables 0–750 V, provided that the conductors are attached to the surface of the structure and grounded or covered by material of adequate insulating and mechanical properties.',
    footnoteDaggerDagger: 'Where this clearance cannot be achieved, adequate insulation shall be applied to the supply conductor.',
    footnoteDoubleDblDagger: 'This clearance shall be increased to 300 mm for voltages 0.75–8 kV for a span wire or span guy wire running parallel to the supply conductor.',
    footnoteDoubleSection: 'The clearance shall be not less than the separations specified in Clause 5.9.1.',
  },
  clauses: {
    '5.9.5': {
      title: 'Separations or clearances in any direction from supply conductors to other supply plant',
      text:
        'The minimum separations or clearances in any direction between supply conductors and other supply plant (e.g., vertical or lateral conductors, guys, and lightning protection wires) shall be as specified in Table 22.\n' +
        'a) The voltage specified in Table 22 for ac conductors shall be taken as\n' +
        '  i) the normal operating phase-to-phase voltage of the circuit for conductors of the same circuit; or\n' +
        '  ii) the sum of the normal operating phase-to-ground voltages of both circuits for conductors of different circuits.\n' +
        'b) Horizontal clearances shall apply when a conductor or wire is in the position of swing as determined in accordance with Clause 5.2.7.',
    },
    'A.5.9.5': {
      title: 'Table 22 voltage scope',
      text:
        'The highest voltage level in Table 22 is 50 kV, because it is recognized that at higher voltage levels there can be significant differences in switching surge levels, depending on system design. The inclusion of conservative increments above 50 kV could result in clearances that would require structural dimensions greater than those necessary for safe operation.',
    },
  },
};

export const TABLE_22_COLUMNS = [
  { id: 'ac_0_075', label: '0–750 V ac', system: 'ac', vMin: 0, vMax: 0.75 },
  { id: 'ac_075_5', label: '> 0.75 kV ≤ 5 kV ac', system: 'ac', vMin: 0.75, vMax: 5 },
  { id: 'ac_5_22', label: '> 5 kV ≤ 22 kV ac', system: 'ac', vMin: 5, vMax: 22 },
  { id: 'ac_22_50', label: '> 22 kV ≤ 50 kV ac†', system: 'ac', vMin: 22, vMax: 50, adderFormula: '+10 mm/kV over 22 kV' },
  { id: 'dc_0_075', label: '0–750 V dc', system: 'dc', vMin: 0, vMax: 0.75 },
  { id: 'dc_075_22', label: '> 0.75 kV ≤ 22 kV dc', system: 'dc', vMin: 0.75, vMax: 22 },
  { id: 'dc_22_50', label: '> 22 kV ≤ 50 kV dc†', system: 'dc', vMin: 22, vMax: 50, adderFormula: '+5 mm/kV over 22 kV' },
];

export const TABLE_22_ROWS = [
  {
    id: 'lateral_vertical_to_lateral_vertical',
    item: 'Supply lateral, vertical, or line conductors and supply lateral or vertical conductors of the same or different circuits but not connected together',
    clearances_mm: {
      ac_0_075: 75,
      ac_075_5: 100,
      ac_5_22: 300,
      ac_22_50: '300 + 10 mm/kV over 22 kV',
      dc_0_075: 75,
      dc_075_22: 120,
      dc_22_50: '120 + 5 mm/kV over 22 kV',
    },
  },
  {
    id: 'conductors_to_structure_surface_crossarms',
    item: 'Supply lateral, vertical, or line conductors and surface of structure, crossarms, and other non-energized supply plant, including grounding conductors',
    clearances_mm: {
      ac_0_075: 75, // reducible to 0 mm per footnote **
      ac_075_5: 100,
      ac_5_22: 150,
      ac_22_50: '150 + 10 mm/kV over 22 kV',
      dc_0_075: 75,
      dc_075_22: 120,
      dc_22_50: '120 + 5 mm/kV over 22 kV',
    },
    notes: 'For 0-750V, reducible to 0 mm if attached to surface and grounded or insulated.',
  },
  {
    id: 'conductors_to_span_or_guy_wire',
    item: 'Supply lateral, vertical, or line conductors and span or guy wire, except where conductors are supported by the span wire',
    clearances_mm: {
      ac_0_075: 100,
      ac_075_5: 170, // 300 mm if parallel span/guy wire (footnote ‡‡)
      ac_5_22: 380,
      ac_22_50: '380 + 10 mm/kV over 22 kV',
      dc_0_075: 75,
      dc_075_22: 200,
      dc_22_50: '200 + 5 mm/kV over 22 kV',
    },
  },
  {
    id: 'conductor_to_parallel_lightning_wire',
    item: 'Supply-line conductor and lightning protection wire parallel to the line',
    clearances_mm: {
      ac_0_075: 'Clause 5.9.1',
      ac_075_5: 'Clause 5.9.1',
      ac_5_22: 'Clause 5.9.1',
      ac_22_50: 'Clause 5.9.1',
      dc_0_075: 'Clause 5.9.1',
      dc_075_22: 'Clause 5.9.1',
      dc_22_50: 'Clause 5.9.1',
    },
    notes: 'The clearance shall be not less than the separations specified in Clause 5.9.1 / Table 17.',
  },
];
