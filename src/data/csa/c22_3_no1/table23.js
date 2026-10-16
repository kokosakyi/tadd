/**
 * CSA C22.3 No. 1 — Table 23
 * "Minimum vertical separations at a joint-use structure"
 * (See Clauses 5.10.1.1, 5.10.1.6, 5.10.1.7, 5.10.6.2, and A.5.10.1 and Figures A.6 and A.7.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 99 (PDF Page 104)
 *   - Clauses 5.10.1, 5.10.2, 5.10.6, Pages 48-51 (PDF Pages 53-56)
 *   - Clause A.5.10.1, Pages 129-131 (PDF Pages 134-136)
 *
 * All separations in METRES.
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_23_META = {
  id: 'csa-c22.3-no1/table23',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum vertical separations at a joint-use structure',
  unit: 'm',
  references: ['5.10.1.1', '5.10.1.6', '5.10.1.7', '5.10.6.2', 'A.5.10.1', 'Figure A.6', 'Figure A.7'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'For voltages greater than 50 kV, add 0.010 m/kV over 50 kV.',
    footnoteDagger: 'On lateral communication drop wire plant, this separation may be reduced to 0.6 m.',
    footnoteDblDagger: 'See Clause 5.2.6 for requirements for neutral conductors.',
    footnoteSection: 'Option A or Option B shall be selected in accordance with Clauses 5.10.1.6 and 5.10.1.7.',
  },
  clauses: {
    '5.10.1.1': {
      title: 'Normal level arrangement',
      text: 'Vertical separations between supply and communication attachments at a joint-use structure shall comply with Table 23. Greater separation might be necessary in order to meet the clearances in the span specified by Clause 5.10.3.',
    },
    '5.10.1.6': {
      title: 'Option A selection',
      text: 'Option A of Table 23 shall be used except where the conditions of Clause 5.10.1.7 are met.',
    },
    '5.10.1.7': {
      title: 'Option B selection',
      text:
        'Option B of Table 23 may be used, provided that\n' +
        'a) the supply and communication facilities are owned and operated by the same company, or there is an agreement between the companies involved;\n' +
        'b) communication workers are trained to work with not more than head and shoulders above the longitudinal communication plant; and\n' +
        'c) safety measures and precautions are agreed upon.',
    },
    'A.5.10.1': {
      title: 'Joint use workspace and safety space',
      text:
        'Table 23 provides a communication workspace (typically 0.75 m) and communication safety space based on voltage. Neutral conductors require same clearance unless complying with Clause 5.2.6 (0-750V).',
    },
  },
};

export const TABLE_23_VOLTAGE_COLUMNS = [
  { id: 'v_0_075', label: '0–750 V', vMin: 0, vMax: 0.75 },
  { id: 'v_075_22', label: '> 0.75 kV ≤ 22 kV', vMin: 0.75, vMax: 22 },
  { id: 'v_22_50', label: '> 22 kV ≤ 50 kV*', vMin: 22, vMax: 50, adderFormula: '+0.010 m/kV over 50 kV' },
];

export const TABLE_23_ROWS = [
  {
    id: 'live_supply_plant_to_communication',
    between: 'Live or current-carrying supply plant (including neutrals) and communication line plant',
    v_0_075_m: 1.0, // reducible to 0.6 m on lateral drops (†)
    v_075_22_m: 1.2,
    v_22_50_m: 1.5,
    reducibleDropM: 0.6,
  },
  {
    id: 'non_energized_supply_option_a_ungrounded',
    between: 'Non-energized supply plant (excluding luminaire span wire/brackets) and communication line plant — Option A: Ungrounded',
    option: 'A',
    grounding: 'ungrounded',
    v_0_075_m: 1.0,
    v_075_22_m: 1.0,
    v_22_50_m: 1.5,
  },
  {
    id: 'non_energized_supply_option_a_grounded',
    between: 'Non-energized supply plant (excluding luminaire span wire/brackets) and communication line plant — Option A: Effectively grounded',
    option: 'A',
    grounding: 'effectively_grounded',
    v_0_075_m: 0.75,
    v_075_22_m: 0.75,
    v_22_50_m: 1.0,
  },
  {
    id: 'non_energized_supply_option_b_ungrounded',
    between: 'Non-energized supply plant (excluding luminaire span wire/brackets) and communication line plant — Option B: Ungrounded',
    option: 'B',
    grounding: 'ungrounded',
    v_0_075_m: 0.75,
    v_075_22_m: 1.0,
    v_22_50_m: 1.5,
  },
  {
    id: 'non_energized_supply_option_b_grounded',
    between: 'Non-energized supply plant (excluding luminaire span wire/brackets) and communication line plant — Option B: Effectively grounded',
    option: 'B',
    grounding: 'effectively_grounded',
    v_0_075_m: 0.10,
    v_075_22_m: 0.30,
    v_22_50_m: 0.30,
  },
  {
    id: 'trolley_span_wires_to_communication',
    between: 'Trolley span wires or brackets and communication line plant',
    v_0_075_m: 0.30,
    v_075_22_m: null,
    v_22_50_m: null,
  },
  {
    id: 'luminaire_span_wires_ungrounded',
    between: 'Luminaire span wires or brackets and communication line plant — Ungrounded',
    grounding: 'ungrounded',
    v_0_075_m: 1.0,
    v_075_22_m: 1.0,
    v_22_50_m: null,
  },
  {
    id: 'luminaire_span_wires_grounded',
    between: 'Luminaire span wires or brackets and communication line plant — Effectively grounded',
    grounding: 'effectively_grounded',
    v_0_075_m: 0.10,
    v_075_22_m: 0.10,
    v_22_50_m: null,
  },
  {
    id: 'attachment_point_combined_service',
    between: 'Point of attachment of combined communication drop and supply service conductor and communication line plant',
    v_0_075_m: 1.0, // reducible to 0.6 m on drop
    v_075_22_m: null,
    v_22_50_m: null,
  },
  {
    id: 'housing_communication_power_supply',
    between: 'Housing containing communication power supply, compressor dehydrator, or other communication equipment (effectively grounded or insulated) and communication cable',
    v_0_075_m: 0,
    v_075_22_m: null,
    v_22_50_m: null,
  },
];
