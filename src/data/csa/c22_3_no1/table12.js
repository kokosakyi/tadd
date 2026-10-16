/**
 * CSA C22.3 No. 1 — Table 12
 * "Minimum horizontal separations from supply equipment to buildings"
 * (See Clauses 5.7.6 and A.5.7.6.)
 *
 * Transcribed from:
 *   - CSA C22.3 No. 1-15, Page 88 (PDF Page 93)
 *   - Clause 5.7.6, Page 43 (PDF Page 48)
 *   - Clause A.5.7.6, Page 122 (PDF Page 127)
 *
 * All separations in METRES.
 * Note: Voltages are rms line-to-ground.
 */

export const TABLE_12_META = {
  id: 'csa-c22.3-no1/table12',
  standard: 'CSA C22.3 No. 1',
  title: 'Minimum horizontal separations from supply equipment to buildings',
  unit: 'm',
  references: ['5.7.6', 'A.5.7.6'],
  notes: {
    note1: 'Voltages are rms line-to-ground.',
    footnoteStar: 'Exposed live parts include any parts not effectively grounded.',
    footnoteDagger: 'This equipment shall not be attached in any readily accessible location.',
  },
  clauses: {
    '5.7.6': {
      title: 'Horizontal separations from supply equipment to buildings',
      text:
        'The minimum horizontal separations from supply equipment to buildings shall be as specified in Table 12. The supply equipment shall not inhibit the normal use of balconies, doors, windows, fire escapes, permanent ladders, catwalks, and other such structures.',
    },
    'A.5.7.6': {
      title: 'Horizontal separations from supply equipment to buildings and Table 12',
      text:
        'Horizontal separations for equipment attached to normally inaccessible surfaces of buildings provide a safe flashover distance. The separation for a readily accessible surface, where equipment is not attached to the surface, provides approximately 1 m for the possible reach of a person, plus a voltage increment.',
    },
  },
};

export const TABLE_12_ROWS = [
  {
    voltageClass: '0–750 V',
    equipmentType: 'Effectively grounded equipment',
    equipmentKey: 'effectively_grounded',
    attachedNormallyInaccessible_m: 0,
    attachedReadilyAccessible_m: 0,
    unattachedNormallyInaccessible_m: 0.15,
    unattachedReadilyAccessible_m: 1.0,
  },
  {
    voltageClass: '0–750 V',
    equipmentType: 'Exposed live parts*',
    equipmentKey: 'exposed_live_parts',
    attachedNormallyInaccessible_m: 1.0,
    attachedReadilyAccessible_m: null, // Prohibited (†)
    attachedReadilyAccessibleProhibited: true,
    unattachedNormallyInaccessible_m: 1.0,
    unattachedReadilyAccessible_m: 1.0,
  },
  {
    voltageClass: '> 0.75 kV ≤ 22 kV',
    equipmentType: 'Effectively grounded equipment',
    equipmentKey: 'effectively_grounded',
    attachedNormallyInaccessible_m: 0,
    attachedReadilyAccessible_m: null, // Prohibited (†)
    attachedReadilyAccessibleProhibited: true,
    unattachedNormallyInaccessible_m: 0.15,
    unattachedReadilyAccessible_m: 1.0,
  },
  {
    voltageClass: '> 0.75 kV ≤ 22 kV',
    equipmentType: 'Exposed live parts*',
    equipmentKey: 'exposed_live_parts',
    attachedNormallyInaccessible_m: 1.5,
    attachedReadilyAccessible_m: null, // Prohibited (†)
    attachedReadilyAccessibleProhibited: true,
    unattachedNormallyInaccessible_m: 1.5,
    unattachedReadilyAccessible_m: 2.0,
  },
];
