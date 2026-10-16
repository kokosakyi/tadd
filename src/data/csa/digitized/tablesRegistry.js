export const CSA_ALL_TABLES = [
  {
    "id": "c22_3_no1_table1",
    "key": "table1",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 1",
    "title": "Wire and conductor swing for horizontal design clearance",
    "unit": "",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.2.7",
      "A.5.2.7",
      "A.5.8.2",
      "A.7.6.1"
    ],
    "notes": {
      "formula": "Horizontal deviation = factor × conductor sag",
      "diameterUnit": "mm (d = diameter of conductor)",
      "massUnit": "kg/m (w = mass per unit length)",
      "partiallyShelteredDefinition": "A partially sheltered span is one that is protected (from swinging transversely in the wind) by objects such as buildings whose height is greater than or equal to wire or conductor height and that are within an effective distance (e.g., 30 m) of the wire or conductor. Trees are not generally considered to provide shelter.",
      "fullyShelteredDefinition": "Per Clause 5.2.7(c): Where wires or conductors are fully sheltered from transverse wind loads (e.g., along narrow urban streets or lanes between buildings reaching at least conductor height on both sides), no allowance is required for horizontal deviation (factor = 0)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_2_5",
        "clauseNumber": "2.5",
        "title": "% July design temperature (as specified in the National Building Code of Canada) applicable to",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_2_7",
        "clauseNumber": "A.5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_8_2",
        "clauseNumber": "A.5.8.2",
        "title": "Clearances between conductors supported by different structures but not",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_7_6_1",
        "clauseNumber": "A.7.6.1",
        "title": "Assumed transverse load due to wind pressure on wire and cable",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table2",
    "key": "table2",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 2",
    "title": "Minimum vertical design clearances above ground or rails, ac",
    "unit": "m",
    "evaluatedAt": "maxSag",
    "explicitRefs": [
      "5.3.1.1",
      "5.7.4.1",
      "A.5.3.1",
      "Table 4",
      "Table 9",
      "Table 11"
    ],
    "notes": {
      "1": "Voltages are rms line-to-ground. Voltages in parentheses are phase-to-phase.",
      "2": "For elevations exceeding 1000 m, see Clause 5.3.1.1(b).",
      "3": "Seasonal conditions can warrant additional clearances (see Clause 5.3.1.1(e)).",
      "4": "Electrostatic-governed clearances above 200 kV assume the horizontal configurations in ELECTROSTATIC_BASIS_CONFIGS."
    },
    "footnotes": {
      "*": "For dc voltages below 750 V, use Columns II and III."
    },
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_3_1_1",
        "clauseNumber": "5.3.1.1",
        "title": "Basic clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_4_1",
        "clauseNumber": "5.7.4.1",
        "title": "General",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_3_1",
        "clauseNumber": "A.5.3.1",
        "title": "Vertical design clearances of wires and conductors above ground or rails and",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_7_10",
        "clauseNumber": "A.5.7.10",
        "title": "Clearance from irrigation systems",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table3",
    "key": "table3",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 3",
    "title": "Minimum vertical design clearances above waterways*, ac and dc†",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [],
    "notes": {
      "1": "Voltages are rms line-to-ground.",
      "2": "The formula used to calculate minimum clearances is as follows: Minimum vertical clearance = reference vessel height + 1.0 m buffer + safe electrical clearance where 1.0 m buffer = allowance for variation in boat height above water (due to different loading conditions) and for wave action; safe electrical clearance = safety margin + air gap flashover distance based on switching surge = 0.78 m + (0.01 m/kV × max. kV in each column)",
      "3": "Vertical design clearance is based on the clearance needed for the vessel height that a waterway can support. If a waterway cannot support the referenced vessel height, the vertical clearance requirement may be reduced in accordance with the appropriate requirement."
    },
    "footnotes": {
      "*": "The clearance over a canal, river, or stream normally used to provide access for sailboats to a larger body of water shall be the same as that required for the larger body of water.",
      "†": "Clearances are applicable to both ac and dc circuits. For dc circuits, the clearance requirements shall be the same as those for ac circuits having the same crest voltage-to-ground.",
      "‡": "Reference vessel height refers to the overall height of the vessel, including the heights of antennas or other attachments.",
      "§": "In Canada, clearances are specified by the Transport Canada office responsible for the coastal regions, Great Lakes system, Red River–Lake Winnipeg system, Mackenzie River, and interior lakes of British Columbia. Where tide water has an effect on a body of water being crossed, the vertical design clearance shall be increased by an amount that takes into account peak tide."
    },
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_3_3_2",
        "clauseNumber": "5.3.3.2",
        "title": "Basic vertical clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table4",
    "key": "table4",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 4",
    "title": "Minimum vertical design clearances above ground or rails, dc",
    "unit": "m",
    "evaluatedAt": "maxSag",
    "explicitRefs": [
      "5.3.1.1",
      "5.7.4.1",
      "A.5.3.1",
      "Table 9",
      "Table 11"
    ],
    "notes": {
      "1": "Voltages are line-to-ground.",
      "2": "Seasonal conditions can warrant additional clearances (see Clause 5.3.1.1(e))."
    },
    "footnotes": {
      "*": "For dc voltages below 0.75 kV, use Columns II and III of Table 2.",
      "†": "See Clause 5.3.1.1(d).",
      "‡": "Add 0.005 m/kV for each kV over 500 kV to clearances in Column IX.",
      "§": "These areas are generally adjacent to fences and accessible to small vehicles but are not likely to be travelled by high road vehicles or high farm machinery.",
      "**": "See Clause 5.3.1.1(c)."
    },
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_3_1_1",
        "clauseNumber": "5.3.1.1",
        "title": "Basic clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_4_1",
        "clauseNumber": "5.7.4.1",
        "title": "General",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_3_1",
        "clauseNumber": "A.5.3.1",
        "title": "Vertical design clearances of wires and conductors above ground or rails and",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table5",
    "key": "table5",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 5",
    "title": "Minimum separations (heights) of supply equipment from ground",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.3.2.1",
      "A.5.3.2",
      "Table 11"
    ],
    "notes": {
      "1": "Voltages are rms line-to-ground."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_3_2_1",
        "clauseNumber": "5.3.2.1",
        "title": "5 Clearances, separations, and spacings — Clause 5.3.2.1",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_3_2",
        "clauseNumber": "A.5.3.2",
        "title": "Vertical separations (heights) of supply equipment from ground",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table6",
    "key": "table6",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 6",
    "title": "Minimum horizontal design clearances between wires and railway tracks",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.4.2",
      "5.4.3"
    ],
    "notes": {
      "1": "Voltages are line-to-ground."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_4_2",
        "clauseNumber": "5.4.2",
        "title": "5 Clearances, separations, and spacings — Clause 5.4.2",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_4_3",
        "clauseNumber": "5.4.3",
        "title": "5 Clearances, separations, and spacings — Clause 5.4.3",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table7",
    "key": "table7",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 7",
    "title": "Minimum horizontal separations from supporting structures to railway tracks",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.5.2",
      "5.5.3",
      "5.4.3",
      "5.5.4",
      "5.5.5"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_4_3",
        "clauseNumber": "5.4.3",
        "title": "5 Clearances, separations, and spacings — Clause 5.4.3",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_5_2",
        "clauseNumber": "5.5.2",
        "title": "5 Clearances, separations, and spacings — Clause 5.5.2",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_5_3",
        "clauseNumber": "5.5.3",
        "title": "5 Clearances, separations, and spacings — Clause 5.5.3",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_5_4",
        "clauseNumber": "5.5.4",
        "title": "5 Clearances, separations, and spacings — Clause 5.5.4",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_5_5",
        "clauseNumber": "5.5.5",
        "title": "5 Clearances, separations, and spacings — Clause 5.5.5",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table8",
    "key": "table8",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 8",
    "title": "Minimum design clearances of supply conductors attached to buildings",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.7.2",
      "5.7.2.1",
      "5.7.2.2",
      "5.2.7"
    ],
    "notes": {
      "voltage": "Voltages are rms line-to-ground.",
      "generalFootnoteStar": "Clearances are applicable to non-metallic buildings or buildings whose metallic parts are effectively grounded. For other buildings, an assessment might be needed to determine additional clearances for electrostatic induction.",
      "footnoteDagger": "For inaccessible surfaces, this value may be reduced to 0.08 m. At the service attachment point, this value may be further reduced to 0.02 m.",
      "footnoteDoubleDagger": "This value may be reduced to 1.2 m where the building does not have fire escapes, balconies, and windows that can be opened adjacent to the conductor.",
      "footnoteSection": "This value may be reduced to 1.5 m where the building does not have fire escapes, balconies, and windows that can be opened adjacent to the conductor.",
      "footnoteDoubleStar": "Conductors of these voltage classes should not be carried over buildings where other suitable construction can be used.",
      "footnoteDoubleDaggerDagger": "Where it is necessary to carry conductors of these voltage classes over buildings, it should be determined whether additional measures, including increased clearances, are needed to ensure that the crossed-over buildings can be used safely and appropriately."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_2",
        "clauseNumber": "5.7.2",
        "title": "Clearances of supply conductors permanently attached to buildings",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_2_1",
        "clauseNumber": "5.7.2.1",
        "title": "5 Clearances, separations, and spacings — Clause 5.7.2.1",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_2_2",
        "clauseNumber": "5.7.2.2",
        "title": "5 Clearances, separations, and spacings — Clause 5.7.2.2",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table9",
    "key": "table9",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 9",
    "title": "Minimum design clearances from wires and conductors not attached to buildings, signs, and similar plant",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.7.3.1",
      "5.7.3.2",
      "5.7.3.3",
      "5.2.7",
      "Tables 2 & 4"
    ],
    "notes": {
      "voltage": "Voltages are rms line-to-ground.",
      "footnoteStar": "Clearances over or adjacent to portions of a building normally traversed by persons or vehicles are specified in Tables 2 and 4.",
      "footnoteDagger": "Clearances are applicable to non-metallic buildings or buildings whose metallic parts are effectively grounded. For other buildings, an assessment might be needed to determine additional clearances for electrostatic induction (see Clause 5.7.3.3).",
      "footnoteDoubleDagger": "Conductor swing shall be added to these values in accordance with Clause 5.7.3.1.",
      "footnoteSection": "This clearance may be reduced to 1 m for portions of the building considered normally inaccessible.",
      "footnoteDoubleStar": "Conductors of these voltage classes should not be carried over buildings where other suitable construction can be used.",
      "footnoteDoubleDaggerDagger": "Where it is necessary to carry conductors of these voltage classes over buildings, it should be determined whether additional measures, including increased clearances, are needed to ensure that the crossed-over buildings can be used safely and effectively.",
      "footnoteDoubleDoubleDagger": "This value may be reduced to 1.5 m where the building does not have fire escapes, balconies, and windows that can be opened adjacent to the conductor."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_3_1",
        "clauseNumber": "5.7.3.1",
        "title": "Basic clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_3_2",
        "clauseNumber": "5.7.3.2",
        "title": "Application of clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_3_3",
        "clauseNumber": "5.7.3.3",
        "title": "Conductors energized above 200 kV",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table10",
    "key": "table10",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 10",
    "title": "Minimum design clearances from supply conductors to bridges",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.7.4",
      "5.7.4.1",
      "5.7.4.2",
      "5.2.7",
      "Tables 2 & 4"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "note2": "Grounding conductors or conductors installed in effectively grounded conduit do not require clearance under a bridge.",
      "footnoteStar": "Readily accessible portions include portions of a bridge likely to be used by workers and portions readily accessible to the public. Bridge seats of steel bridges supported by masonry, brick, or concrete abutments that need periodic inspection should be considered readily accessible portions. Concrete, brick, or masonry portions that need to be passed by workers so that they can gain access to other areas shall be considered readily accessible portions.",
      "footnoteDagger": "This clearance may be reduced to 1 m where the portion of the bridge involved is readily accessible to workers but not to the public."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_4",
        "clauseNumber": "5.7.4",
        "title": "Clearances from supply wires and conductors to bridges",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_4_1",
        "clauseNumber": "5.7.4.1",
        "title": "General",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_4_2",
        "clauseNumber": "5.7.4.2",
        "title": "Basic clearances for supply conductors",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table11",
    "key": "table11",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 11",
    "title": "Minimum separation of equipment and clearances of conductors from swimming pools",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.7.5",
      "A.5.7.5",
      "5.3.1",
      "5.3.2",
      "Figure 1",
      "Table 2",
      "Table 4",
      "Table 5"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "note2": "See Figure 1 for an illustration of swimming pool clearance limits.",
      "footnoteStar": "Supply conductors greater than 150 kV shall not cross over swimming pools or be closer to the edge of a pool than 8.0 m + 0.01 m/kV above 150 kV."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_3_1",
        "clauseNumber": "5.3.1",
        "title": "Vertical design clearances of wires and conductors above ground or rails",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_3_2",
        "clauseNumber": "5.3.2",
        "title": "Vertical separations (heights) of supply equipment from ground",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_5",
        "clauseNumber": "5.7.5",
        "title": "Minimum separation of equipment and clearances of conductors over and",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_7_5",
        "clauseNumber": "A.5.7.5",
        "title": "Minimum separation of equipment and clearances of conductors over and",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_Figure_1",
        "clauseNumber": "Figure 1",
        "title": "Clause Figure 1",
        "section": "Normative Clause",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table12",
    "key": "table12",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 12",
    "title": "Minimum horizontal separations from supply equipment to buildings",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.7.6",
      "A.5.7.6"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "Exposed live parts include any parts not effectively grounded.",
      "footnoteDagger": "This equipment shall not be attached in any readily accessible location."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_7_6",
        "clauseNumber": "5.7.6",
        "title": "Horizontal separations from supply equipment to buildings",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_7_6",
        "clauseNumber": "A.5.7.6",
        "title": "Horizontal separations from supply equipment to buildings and Table 12",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table13",
    "key": "table13",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 13",
    "title": "Minimum design vertical clearances between wires crossing each other and supported by different supporting structures",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.8.1.1",
      "5.8.1.2",
      "5.8.1.3",
      "A.5.8.1",
      "A.5.8.1.3",
      "Table 14",
      "Table 15"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "note2": "Refer to Clause A.5.8.1 for explanation of the calculation method used to produce the clearance values shown in this Table.",
      "note3": "Refer to Table A.1 for typical nominal system voltages and overvoltage values.",
      "footnoteStar": "Where the trolley pole is not prevented from de-wiring, the clearance shall be increased so as to maintain the minimum specified clearance between the trolley pole in the de-wired position and the crossing conductor."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_8_1_1",
        "clauseNumber": "5.8.1.1",
        "title": "Basic clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_1_2",
        "clauseNumber": "5.8.1.2",
        "title": "Reduced clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_1_3",
        "clauseNumber": "5.8.1.3",
        "title": "In-span vertical clearances between supply and communication conductors",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_8_1",
        "clauseNumber": "A.5.8.1",
        "title": "Vertical clearances at crossings of line wires and conductors supported by",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_8_1_3",
        "clauseNumber": "A.5.8.1.3",
        "title": "In-span vertical clearances between supply and communication conductors",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table14",
    "key": "table14",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 14",
    "title": "Minimum vertical clearances for crossings over aerial tramways",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.8.1.1",
      "5.7.9"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_7_9",
        "clauseNumber": "5.7.9",
        "title": "Clearances for other wire facilities",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_1_1",
        "clauseNumber": "5.8.1.1",
        "title": "Basic clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table15",
    "key": "table15",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 15",
    "title": "Clearances between conductors supported by different structures but not crossing each other — Clearance increments to be added to horizontal displacement",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.8.2",
      "A.5.8.2",
      "5.2.7",
      "Table 1"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "Communication conductors are assumed to operate at less than 130 V dc at 0.25 A or less per pair (1500 pairs or fewer)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_2",
        "clauseNumber": "5.8.2",
        "title": "Clearances between conductors supported by different structures but not",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_8_2",
        "clauseNumber": "A.5.8.2",
        "title": "Clearances between conductors supported by different structures but not",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table16",
    "key": "table16",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 16",
    "title": "Minimum design clearances between conductors of one line and supporting structures of another line",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.8.3.1",
      "5.8.3.2",
      "5.8.3.3",
      "5.2.7"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "Communication conductors are assumed to operate at less than 130 V dc at 0.25 A or less per pair (1500 pairs or fewer)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_3_1",
        "clauseNumber": "5.8.3.1",
        "title": "Basic clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_3_2",
        "clauseNumber": "5.8.3.2",
        "title": "Climbing space and working space",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_3_3",
        "clauseNumber": "5.8.3.3",
        "title": "Joint-use common structure",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table17",
    "key": "table17",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 17",
    "title": "Minimum horizontal separations of supply-line conductors attached to the same supporting structure",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.9.1.1",
      "5.9.1.2",
      "5.9.1.3"
    ],
    "notes": {
      "footnoteStar": "For spans longer than 450 m, the separation shall be based on best engineering practices, but shall be not less than the separations specified for spans of 450 m.",
      "footnoteDagger": "Phase-to-phase voltages for the same circuit or the sum of phase-to-ground voltages for different circuits.",
      "footnoteDblDagger": "There is no minimum separation for conductors of the same polarity in the same circuit."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_9_1_1",
        "clauseNumber": "5.9.1.1",
        "title": "5 Clearances, separations, and spacings — Clause 5.9.1.1",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_9_1_2",
        "clauseNumber": "5.9.1.2",
        "title": "5 Clearances, separations, and spacings — Clause 5.9.1.2",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_9_1_3",
        "clauseNumber": "5.9.1.3",
        "title": "5 Clearances, separations, and spacings — Clause 5.9.1.3",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table18",
    "key": "table18",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 18",
    "title": "Minimum vertical separations between supply-line conductors attached to the same supporting structure, ac",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.9.2.1"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "This category also includes dc.",
      "footnoteDagger": "This value does not apply to conductors on adjacent supports of the same circuit or circuits."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_9_2_1",
        "clauseNumber": "5.9.2.1",
        "title": "Minimum vertical separations between supply-line conductors attached to",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table19",
    "key": "table19",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 19",
    "title": "Vertical spacings between supply-line conductors of 0 to 750 V on vertical brackets",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.9.2.2"
    ],
    "notes": {
      "topConductorToCrossarmAbove": "Minimum vertical spacing between the top conductors on the vertical bracket and the centre of the nearest crossarm above shall be 600 mm."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_9_2_2",
        "clauseNumber": "5.9.2.2",
        "title": "Vertical spacings between supply-line conductors of 0 to 750 V on vertical",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table20",
    "key": "table20",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 20",
    "title": "Minimum in-span vertical clearances between supply conductors of the same circuit that are attached to the same supporting structure",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.9.2.3",
      "A.5.9.2.3"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_9_2_3",
        "clauseNumber": "5.9.2.3",
        "title": "In-span vertical clearances between supply-line conductors of the same",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_9_2_3",
        "clauseNumber": "A.5.9.2.3",
        "title": "In-span vertical clearances between supply-line conductors of the same",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table21",
    "key": "table21",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 21",
    "title": "Minimum in-span vertical clearances between supply conductors of different circuits that are attached to the same supporting structure",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.9.2.4",
      "A.5.9.2.4"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_9_2_4",
        "clauseNumber": "5.9.2.4",
        "title": "In-span vertical clearances between supply-line conductors of different",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_9_2_4",
        "clauseNumber": "A.5.9.2.4",
        "title": "In-span vertical clearances between supply-line conductors of different",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table22",
    "key": "table22",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 22",
    "title": "Minimum separations or clearances in any direction from supply conductors to other supply plant attached to the same supporting structure",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.9.5",
      "A.5.9.5",
      "5.2.7",
      "5.9.1"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "Clearances from connecting wires to switches or arresters may be less than that from line wires to switches or arresters.",
      "footnoteDagger": "For voltages exceeding 50 kV, clearances shall be based on best engineering practices, but shall be not less than the separations specified for 50 kV.",
      "footnoteDblDagger": "Add 10 mm/kV over 22 kV.",
      "footnoteSection": "Add 5 mm/kV over 22 kV.",
      "footnoteDblStar": "This clearance may be reduced to 0 mm for conductors and cables 0–750 V, provided that the conductors are attached to the surface of the structure and grounded or covered by material of adequate insulating and mechanical properties.",
      "footnoteDaggerDagger": "Where this clearance cannot be achieved, adequate insulation shall be applied to the supply conductor.",
      "footnoteDoubleDblDagger": "This clearance shall be increased to 300 mm for voltages 0.75–8 kV for a span wire or span guy wire running parallel to the supply conductor.",
      "footnoteDoubleSection": "The clearance shall be not less than the separations specified in Clause 5.9.1."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_9_1",
        "clauseNumber": "5.9.1",
        "title": "Horizontal separations or separations within 45° of the horizontal of",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_9_5",
        "clauseNumber": "5.9.5",
        "title": "Separations or clearances in any direction from supply conductors to other",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_9_5",
        "clauseNumber": "A.5.9.5",
        "title": "Separations or clearances in any direction from supply conductors to other",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table23",
    "key": "table23",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 23",
    "title": "Minimum vertical separations at a joint-use structure",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.10.1.1",
      "5.10.1.6",
      "5.10.1.7",
      "5.10.6.2",
      "A.5.10.1",
      "Figure A.6",
      "Figure A.7"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "For voltages greater than 50 kV, add 0.010 m/kV over 50 kV.",
      "footnoteDagger": "On lateral communication drop wire plant, this separation may be reduced to 0.6 m.",
      "footnoteDblDagger": "See Clause 5.2.6 for requirements for neutral conductors.",
      "footnoteSection": "Option A or Option B shall be selected in accordance with Clauses 5.10.1.6 and 5.10.1.7."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_10_1_1",
        "clauseNumber": "5.10.1.1",
        "title": "5 Clearances, separations, and spacings — Clause 5.10.1.1",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_10_1_6",
        "clauseNumber": "5.10.1.6",
        "title": "Option A of Table 23 shall be used except where the conditions of Clause 5",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_10_1_7",
        "clauseNumber": "5.10.1.7",
        "title": "5 Clearances, separations, and spacings — Clause 5.10.1.7",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_10_6_2",
        "clauseNumber": "5.10.6.2",
        "title": "5 Clearances, separations, and spacings — Clause 5.10.6.2",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_10_1",
        "clauseNumber": "A.5.10.1",
        "title": "Vertical separations at the structure — Normal level arrangement and",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_9_1_2_2",
        "clauseNumber": "A.9.1.2.2",
        "title": "Earth return systems",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_Figure_A_6",
        "clauseNumber": "Figure A.6",
        "title": "Clause Figure A.6",
        "section": "Normative Clause",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_Figure_A_7",
        "clauseNumber": "Figure A.7",
        "title": "Clause Figure A.7",
        "section": "Normative Clause",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table24",
    "key": "table24",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 24",
    "title": "Minimum in-span vertical clearances between supply and communication conductors",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.10.3.2",
      "5.10.3.3",
      "A.5.10.3"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "For effectively grounded neutral, see Clause 5.10.3.3.",
      "footnoteDagger": "While the use of the design limit of 75 mm can yield a minimum actual clearance of approximately 300 mm under the worst expected conditions, most situations will result in clearances in excess of 600 mm."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_10_3_2",
        "clauseNumber": "5.10.3.2",
        "title": "5 Clearances, separations, and spacings — Clause 5.10.3.2",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_10_3_3",
        "clauseNumber": "5.10.3.3",
        "title": "5 Clearances, separations, and spacings — Clause 5.10.3.3",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_10_3",
        "clauseNumber": "A.5.10.3",
        "title": "In-span vertical clearances and Table 24",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table25",
    "key": "table25",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 25",
    "title": "Minimum clearances from guys to plant of another system",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.11.2.1",
      "A.5.11.2",
      "Figure A.8"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_11_2_1",
        "clauseNumber": "5.11.2.1",
        "title": "Clearances between guys and plant of another system",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_11_2",
        "clauseNumber": "A.5.11.2",
        "title": "Guys attached to joint-use structures and Tables 25 and 26",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_Figure_A_8",
        "clauseNumber": "Figure A.8",
        "title": "Clause Figure A.8",
        "section": "Normative Clause",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table26",
    "key": "table26",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 26",
    "title": "Minimum clearance or separation between guys and other plant attached to the joint-use structure",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.11.2.2",
      "A.5.11.2",
      "5.11.1",
      "Figure A.8"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "This clearance may be reduced to 75 mm where adequate insulation is provided."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_11_1",
        "clauseNumber": "5.11.1",
        "title": "Guy attachments — Joint-use structures",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_11_2_2",
        "clauseNumber": "5.11.2.2",
        "title": "Clearances or separations between guys and other plant attached to a joint-",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_11_2",
        "clauseNumber": "A.5.11.2",
        "title": "Guys attached to joint-use structures and Tables 25 and 26",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_Figure_A_8",
        "clauseNumber": "Figure A.8",
        "title": "Clause Figure A.8",
        "section": "Normative Clause",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table27",
    "key": "table27",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 27",
    "title": "Minimum grades of construction for crossings",
    "unit": "",
    "evaluatedAt": null,
    "explicitRefs": [
      "6.3.1",
      "6.3.2.1",
      "7.8.1.1",
      "7.8.2.1",
      "7.8.2.4",
      "7.9.1",
      "A.7.8.2",
      "A.8.1"
    ],
    "notes": {
      "footnoteStar": "The grade of construction may be Grade 2 where one of the following conditions exists:\na) the supply and communication lines have coordinated electrical protection (see Clause 4.4);\nb) where coordinated electrical protection is not practical, the supply conductors have a rated tensile strength of 12.4 kN or greater; or\nc) the supply conductors are enclosed in effectively grounded continuous metallic sheathed cable.",
      "footnoteDagger": "The communication line may be Grade 3 where the supply conductors are in effectively grounded continuous metallic sheathed cable.",
      "footnoteDblDagger": "Grade 3 construction may be used where the supply conductors at the upper level are in effectively grounded continuous metallic sheathed cable."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_6_3_1",
        "clauseNumber": "6.3.1",
        "title": "General",
        "section": "6 Minimum grades of construction",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_6_3_2_1",
        "clauseNumber": "6.3.2.1",
        "title": "6 Minimum grades of construction — Clause 6.3.2.1",
        "section": "6 Minimum grades of construction",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_1_1",
        "clauseNumber": "7.8.1.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_2_1",
        "clauseNumber": "7.8.2.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_2_4",
        "clauseNumber": "7.8.2.4",
        "title": "Assumed longitudinal load — Wire and cable attachments not involved in",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_9_1",
        "clauseNumber": "7.9.1",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.9.1",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_7_8_2",
        "clauseNumber": "A.7.8.2",
        "title": "Assumed longitudinal load — Without terminations or tension changes",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_8_1",
        "clauseNumber": "A.8.1",
        "title": "General",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table28",
    "key": "table28",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 28",
    "title": "Minimum grades of construction for proximities",
    "unit": "",
    "evaluatedAt": null,
    "explicitRefs": [
      "6.3.1",
      "6.3.3",
      "7.8.1.1",
      "7.8.2.1",
      "7.8.2.4",
      "7.9.1",
      "A.7.8.2",
      "A.8.1"
    ],
    "notes": {
      "footnoteStar": "The line may be Grade 2 if the supply and communications lines have coordinated electrical protection (see Clause 4.4).",
      "footnoteDagger": "Grade 3 construction may be used where the supply conductors at the upper level, or the supply conductors creating the proximity, are in effectively grounded continuous metallic sheathed cable."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_6_3_1",
        "clauseNumber": "6.3.1",
        "title": "General",
        "section": "6 Minimum grades of construction",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_6_3_3",
        "clauseNumber": "6.3.3",
        "title": "Proximities",
        "section": "6 Minimum grades of construction",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_1_1",
        "clauseNumber": "7.8.1.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_2_1",
        "clauseNumber": "7.8.2.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_2_4",
        "clauseNumber": "7.8.2.4",
        "title": "Assumed longitudinal load — Wire and cable attachments not involved in",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_9_1",
        "clauseNumber": "7.9.1",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.9.1",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_7_8_2",
        "clauseNumber": "A.7.8.2",
        "title": "Assumed longitudinal load — Without terminations or tension changes",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_8_1",
        "clauseNumber": "A.8.1",
        "title": "General",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table29",
    "key": "table29",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 29",
    "title": "Minimum grades of construction for joint use",
    "unit": "",
    "evaluatedAt": null,
    "explicitRefs": [
      "6.3.1",
      "6.3.4",
      "7.8.1.1",
      "7.8.2.1",
      "7.8.2.4",
      "7.9.1",
      "A.7.8.2",
      "A.8.1"
    ],
    "notes": {
      "footnoteStar": "The grade of construction may be Grade 2 where one of the following conditions exists:\na) the supply and communications lines have coordinated electrical protection (see Clause 4.4);\nb) where coordinated electrical protection is not practical, the supply conductors have a rated tensile strength of 12.4 kN or greater; or\nc) the supply conductors are enclosed in effectively grounded continuous metallic sheathed cable."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_6_3_1",
        "clauseNumber": "6.3.1",
        "title": "General",
        "section": "6 Minimum grades of construction",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_6_3_4",
        "clauseNumber": "6.3.4",
        "title": "Joint use",
        "section": "6 Minimum grades of construction",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_1_1",
        "clauseNumber": "7.8.1.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_2_1",
        "clauseNumber": "7.8.2.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_2_4",
        "clauseNumber": "7.8.2.4",
        "title": "Assumed longitudinal load — Wire and cable attachments not involved in",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_9_1",
        "clauseNumber": "7.9.1",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.9.1",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_7_8_2",
        "clauseNumber": "A.7.8.2",
        "title": "Assumed longitudinal load — Without terminations or tension changes",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_8_1",
        "clauseNumber": "A.8.1",
        "title": "General",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table30",
    "key": "table30",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 30",
    "title": "Deterministic weather loads",
    "unit": "",
    "evaluatedAt": null,
    "explicitRefs": [
      "7.2",
      "7.3.1",
      "7.3.5",
      "7.5.1",
      "7.6.2.1",
      "A.7.3",
      "Annex C"
    ],
    "notes": {
      "footnoteStar": "When large conductors are used in locations where high winds are prevalent, the loading on bare conductors should be assessed, as high winds can produce a transverse loading in excess of the wind and ice combinations.",
      "footnoteDagger": "On small conductors, the ice effect is more significant than on large conductors, as it constitutes a greater percentage of the total mass.",
      "footnoteDblDagger": "See Clause 7.2 and Annex C for geographic loading area boundaries across Canada.",
      "windVelocityEquivalents": "400 N/m² corresponds to ~25 m/s (~90 km/h) hourly steady-state wind; 300 N/m² corresponds to ~21 m/s (~76 km/h).",
      "iceDensity": "Ice density is assumed to be 900 kg/m³ per Clause 7.3.1(a)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_7_2",
        "clauseNumber": "7.2",
        "title": "Weather loads",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_3_1",
        "clauseNumber": "7.3.1",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.3.1",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_3_5",
        "clauseNumber": "7.3.5",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.3.5",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_5_1",
        "clauseNumber": "7.5.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_6_2_1",
        "clauseNumber": "7.6.2.1",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.6.2.1",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_7_3",
        "clauseNumber": "A.7.3",
        "title": "Assumed loads for wire and cable attachments",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_Annex_C",
        "clauseNumber": "Annex C",
        "title": "(informative)",
        "section": "Annex C (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_C_5",
        "clauseNumber": "C.5",
        "title": ")",
        "section": "Annex C (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_no1_table31",
    "key": "table31",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 31",
    "title": "Minimum load factors for non-linear analysis of structures",
    "unit": "",
    "evaluatedAt": null,
    "explicitRefs": [
      "7.4.2",
      "7.5.2",
      "7.6.4",
      "7.7.2",
      "7.8.1.2",
      "8.1.3",
      "8.3.10.1",
      "8.3.12.2",
      "A.7.4.2",
      "Table 32"
    ],
    "notes": {
      "note1": "Non-linear analysis, including stability (buckling) check, is the method of analysis of structures specified in this Standard.",
      "note2": "Default COV values for pole and structure materials are:\n  a) steel — ≤ 10%;\n  b) concrete — 10% < COV < 15%; and\n  c) wood — ≥ 15%.",
      "note3": "The selection of appropriate minimum load factors for steel, concrete, fibre-reinforced composite, laminated wood, and wood poles is based on the coefficient of variation (COV), for the given pole material as verified by the pole manufacturer. The lowest minimum load factors (steel pole default) may be used for concrete, laminated wood, and FRP composite structures if manufacturers verify COV ≤ 10%. The next lowest (concrete pole default) may be used if 10% < COV < 15%. The highest (wood default) shall be used if manufacturer is unable to verify COV < 15%."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_7_4_2",
        "clauseNumber": "7.4.2",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.4.2",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_5_2",
        "clauseNumber": "7.5.2",
        "title": "Assumed vertical load on wood, concrete, and fibre-reinforced composite",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_6_4",
        "clauseNumber": "7.6.4",
        "title": "Assumed transverse load on wood, concrete, and fibre-reinforced composite",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_7_2",
        "clauseNumber": "7.7.2",
        "title": "Assumed loads at angles on wood, concrete, and fibre-reinforced composite",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_1_2",
        "clauseNumber": "7.8.1.2",
        "title": "Assumed longitudinal load for terminations or tension changes on wood,",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_8_1_3",
        "clauseNumber": "8.1.3",
        "title": "8 Strength of supporting systems according to deterministic design — Clause 8.1.3",
        "section": "8 Strength of supporting systems according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_8_3_10_1",
        "clauseNumber": "8.3.10.1",
        "title": "8 Strength of supporting systems according to deterministic design — Clause 8.3.10.1",
        "section": "8 Strength of supporting systems according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_8_3_12_2",
        "clauseNumber": "8.3.12.2",
        "title": "8 Strength of supporting systems according to deterministic design — Clause 8.3.12.2",
        "section": "8 Strength of supporting systems according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_7_4_2",
        "clauseNumber": "A.7.4.2",
        "title": "Annex A (informative) — Clause A.7.4.2",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  {
    "id": "c22_3_60826_table1",
    "key": "table1",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 1",
    "title": "Reliability levels for transmission lines",
    "unit": "",
    "explicitRefs": [
      "5.1.1.1",
      "5.1.1.2",
      "A.1.2",
      "Table A.2"
    ],
    "notes": {
      "note1": "Some national regulations and/or codes of practice, sometimes impose, directly or indirectly, design requirements that may restrict the choice offered to designers.",
      "note2": "Other values of T in the range of 50–500 years, such as 100, 200 and 400 years, can be used if justified by local conditions.",
      "temporaryLines": "For temporary lines, some wooden poles or lines of limited importance, return periods of about 25 years may be appropriate."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_1_1_1",
        "clauseNumber": "5.1.1.1",
        "title": "Reliability levels (weather related loads)",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_5_1_1_2",
        "clauseNumber": "5.1.1.2",
        "title": "Approximate values for yearly reliability",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_2",
        "clauseNumber": "A.1.2",
        "title": "Calculation of reliability",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table10",
    "key": "table10",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 10",
    "title": "Number of supports subjected to maximum load intensity during any single occurrence of a climatic event",
    "unit": "",
    "explicitRefs": [
      "7.2.1",
      "Table 11",
      "Table A.5"
    ],
    "notes": {
      "note1": "Values in brackets represent the typical range of supports based on a span of 400 m.",
      "usage": "The number of components other than supports can be directly derived from the number of supports thus selected."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_1",
        "clauseNumber": "7.2.1",
        "title": "Values of strength factor ΦΦ ΦΦ N",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table11",
    "key": "table11",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 11",
    "title": "Strength factor ΦN related to the number N of components or elements subjected to the critical load intensity",
    "unit": "",
    "explicitRefs": [
      "7.2.1",
      "Table 10",
      "Table A.5"
    ],
    "notes": {
      "note1": "Values of ΦN are based on a normal distribution function. Values within brackets (lognormal) are based on the log-normal distribution function.",
      "note2": "In the case of high values of vR and N (shaded cells where both normal and log-normal values are given), the value of ΦN is very sensitive to the choice of the distribution function."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_1",
        "clauseNumber": "7.2.1",
        "title": "Values of strength factor ΦΦ ΦΦ N",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_4",
        "clauseNumber": "7.3.4",
        "title": "Foundation design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_6",
        "clauseNumber": "7.3.6",
        "title": "Insulator string design criteria",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table12",
    "key": "table12",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 12",
    "title": "Values of ΦS2",
    "unit": "",
    "explicitRefs": [
      "7.2.2",
      "Table 13",
      "Table A.4"
    ],
    "notes": {
      "note1": "In the above table, R2 is the component designed more reliable than R1 (with 90% confidence that R2 will not fail before R1). A factor ΦS1 = 1.0 is applied to the first component to fail (R1)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_2",
        "clauseNumber": "7.2.2",
        "title": "Strength factor ΦΦ ΦΦ S related to the coordination of strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_3",
        "clauseNumber": "7.3.3",
        "title": "Support design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_4",
        "clauseNumber": "7.3.4",
        "title": "Foundation design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table13",
    "key": "table13",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 13",
    "title": "Typical strength coordination of line components",
    "unit": "",
    "explicitRefs": [
      "7.2.2",
      "Table 12",
      "Table 16",
      "Table A.3"
    ],
    "notes": {
      "footnoteStar": "Within each major component, the underlined component is the least reliable with 90% confidence.",
      "footnoteDoubleStar": "With the strength limits specified in Table 16, conductors are usually the most reliable component of the line.",
      "canadianDeviation": "Per Clause 7.2.2 (Canadian Deviation): Despite the prescription of a preferred sequence of failure, the line can fail in a different mode. For example, conductors can break due to overstressing caused by a collapsed tower rather than from overload. Dead-end insulators can also fail due to dynamic loads caused by adjacent tower failures."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_2",
        "clauseNumber": "7.2.2",
        "title": "Strength factor ΦΦ ΦΦ S related to the coordination of strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table14",
    "key": "table14",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 14",
    "title": "Damage and failure limits of supports",
    "unit": "",
    "explicitRefs": [
      "7.3.1",
      "Table 3",
      "Table 15",
      "Table 16",
      "Table 17"
    ],
    "notes": {
      "note1": "The deformation of compression elements is the maximum deflection from the line joining end points. For elements subjected to moments, it is the displacement of the free end from the vertical.",
      "note2": "l is the free length of the element.",
      "note3": "The width of crack for concrete poles to be agreed upon."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_1",
        "clauseNumber": "7.3.1",
        "title": "Limit states for line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table15",
    "key": "table15",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 15",
    "title": "Damage and failure limits of foundations",
    "unit": "",
    "explicitRefs": [
      "7.3.1",
      "7.3.4",
      "Table 14"
    ],
    "notes": {
      "note1": "Takes into account the interaction between the support and its foundation.",
      "note2": "A determinate movement is one that does not induce internal efforts in the structure. For example the displacement of one foundation of a three-legged support is a determinate movement, while the displacement of a four-legged support is an indeterminate movement.",
      "note3": "Y is the horizontal distance between foundations.",
      "note4": "Some rigid foundations (e.g. pile) may require lower limits."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_1",
        "clauseNumber": "7.3.1",
        "title": "Limit states for line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_4",
        "clauseNumber": "7.3.4",
        "title": "Foundation design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table16",
    "key": "table16",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 16",
    "title": "Damage and failure limits of conductors and ground wires",
    "unit": "",
    "explicitRefs": [
      "7.3.1",
      "7.3.5",
      "Table 13"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_2",
        "clauseNumber": "7.2.2",
        "title": "Strength factor ΦΦ ΦΦ S related to the coordination of strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_1",
        "clauseNumber": "7.3.1",
        "title": "Limit states for line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_5",
        "clauseNumber": "7.3.5",
        "title": "Conductor and ground wire design criteria",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table17",
    "key": "table17",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 17",
    "title": "Damage and failure limit of interface components",
    "unit": "",
    "explicitRefs": [
      "7.3.1",
      "7.3.6"
    ],
    "notes": {
      "note1": "Normally, fittings are designed in a manner to reduce or eliminate wear. Should wear be expected because of point-to-point contact, it should be considered in the design. In such case, the damage limit becomes \"exceeding the expected wear\".",
      "note2": "The critical permanent deformation is defined as the state where the fittings cannot be easily taken apart."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_1",
        "clauseNumber": "7.3.1",
        "title": "Limit states for line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_6",
        "clauseNumber": "7.3.6",
        "title": "Insulator string design criteria",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table18",
    "key": "table18",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 18",
    "title": "Default values for strength coefficients of variation (COV)",
    "unit": "",
    "explicitRefs": [
      "7.3.2",
      "Table 11",
      "Table 12",
      "Table 19"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_2",
        "clauseNumber": "7.3.2",
        "title": "Strength data of line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_4",
        "clauseNumber": "7.3.4",
        "title": "Foundation design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table19",
    "key": "table19",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 19",
    "title": "u factors for log-normal distribution function for e = 10%",
    "unit": "",
    "explicitRefs": [
      "7.3.2",
      "Table 18"
    ],
    "notes": {
      "formula": "Rc = (10%)R = (1 – u × vR) × R_mean; if R is assumed normally distributed, u = 1.28, or given in Table 19 for log-normal distribution function."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_2",
        "clauseNumber": "7.3.2",
        "title": "Strength data of line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table2",
    "key": "table2",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 2",
    "title": "Default γT factors for adjustment of climatic loads in relation to return period T vs. 50 years",
    "unit": "",
    "explicitRefs": [
      "5.2.1",
      "Table CA.2"
    ],
    "notes": {
      "note1": "The above γ values are sufficiently accurate for a COV of up to 0.16 for wind speed, 0.30 for ice thickness and 0.65 for unit ice weight and are derived from the Gumbel distribution function.",
      "canadianDeviationNote": "In Canada, Clause 5.2.1 adds Table CA.2 (which provides γTw and γTi for T = 25, 50, 100, 150, 200, 400, and 500 years). See tableCA2.js."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_1",
        "clauseNumber": "5.2.1",
        "title": "Limit load",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table20",
    "key": "table20",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 20",
    "title": "Value of quality factor ΦQ for lattice towers",
    "unit": "",
    "explicitRefs": [
      "7.3.3",
      "IEC 60652"
    ],
    "notes": {
      "canadianSimplifiedPhiR": "Per Clause 7.3.3 (Canadian Deviation): The following default (simplified) values may be used for lattice steel towers in the majority of lines: (a) suspension towers: ΦR = 0.9 for intact loading cases and ΦR = 1.0 for failure loading cases; and (b) angle and dead-end towers: intact ΦR = 0.8 and failed system ΦR = 0.9, where ΦR = ΦN ΦS ΦQ ΦC."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_3",
        "clauseNumber": "7.3.3",
        "title": "Support design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_IEC_60652",
        "clauseNumber": "IEC 60652",
        "title": "Clause IEC 60652",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table3",
    "key": "table3",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 3",
    "title": "Design requirements for the system",
    "unit": "",
    "explicitRefs": [
      "5.2.2",
      "6.2",
      "6.3",
      "6.4",
      "6.5",
      "6.6",
      "7.1",
      "7.2"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_2",
        "clauseNumber": "5.2.2",
        "title": "Design requirements for the system",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_2",
        "clauseNumber": "6.2",
        "title": "Climatic loads, wind and associated temperatures",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_3",
        "clauseNumber": "6.3",
        "title": "Climatic loads, ice without wind",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4",
        "clauseNumber": "6.4",
        "title": "Climatic loads, combined wind and ice loadings",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_5",
        "clauseNumber": "6.5",
        "title": "Loads for construction and maintenance (safety loads)",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_6",
        "clauseNumber": "6.6",
        "title": "Loads for failure containment (security requirements)",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_1",
        "clauseNumber": "7.1",
        "title": "Generalities",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_2",
        "clauseNumber": "7.2",
        "title": "General equations for the strength of components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table4",
    "key": "table4",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 4",
    "title": "Classification of terrain categories",
    "unit": "",
    "explicitRefs": [
      "6.2.2",
      "6.2.3",
      "A.4",
      "Table A.7",
      "Table A.8"
    ],
    "notes": {
      "usage": "In Table 4, the roughness factor KR represents a multiplier of the reference wind speed for conversion from one terrain category to another (VR = KR × VRB).",
      "canadianDeviation": "Per Clause 6.2.2 (Canadian Deviation): Terrain type B is representative of the majority of lines and should lead to acceptable results in all areas except in flat coastal areas, where a terrain type A should be used."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_2_2",
        "clauseNumber": "6.2.2",
        "title": "Terrain roughness",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_2_3",
        "clauseNumber": "6.2.3",
        "title": "Reference wind speed RV",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_2_5",
        "clauseNumber": "6.2.5",
        "title": "Unit action of the wind speed on any line component or element",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4",
        "clauseNumber": "A.4",
        "title": "Determination of the meteorological reference wind speed",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table5",
    "key": "table5",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 5",
    "title": "Correction factor τ of dynamic reference wind pressure q0 due to altitude and temperatures",
    "unit": "",
    "explicitRefs": [
      "6.2.5",
      "6.4.6.1",
      "Table CB.1"
    ],
    "notes": {
      "note1": "The reference value (τ = 1.00) corresponds to 0 m altitude and a temperature of 15 °C (air density μ = 1.225 kg/m³ at 101.3 kPa).",
      "canadianDeviation": "Per Clause 6.2.5 (Canadian Deviation): The air density correction factor shall be 1.04 for wind conditions without ice and 1.1 for combined ice and wind. These factors may also be used for mountainous regions because the reduced temperature compensates for the altitude."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_2_5",
        "clauseNumber": "6.2.5",
        "title": "Unit action of the wind speed on any line component or element",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4_6_1",
        "clauseNumber": "6.4.6.1",
        "title": "Unit action of the wind on the ice-covered conductors",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4_5_3",
        "clauseNumber": "A.4.5.3",
        "title": "Unit-action of the wind on any element of the line and dynamic reference",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table6",
    "key": "table6",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 6",
    "title": "Non-uniform ice loading conditions",
    "unit": "",
    "explicitRefs": [
      "6.3.6.3",
      "6.3.6.3.1A",
      "6.3.6.3.1B",
      "Figure 12"
    ],
    "notes": {
      "note1": "In this table, the uppercase letters A, B, C, D, E, F (phase conductors) and X, Y (ground wires) represent conductors and spans loaded with 0.7 gR, while the lowercase letters a, b, c, d, e, f, x, y represent conductors and spans loaded with 0.4 × 0.7 gR (= 0.28 gR). Factors 0.7 and 0.4 are suggested and other values can be used as substantiated by experience.",
      "canadianDeviation": "Per Clauses 6.3.6.3.1A and 6.3.6.3.1B (Canadian Deviation): Non-uniform ice loading examples where the structure is subjected to 70% of the design ice weight on the left or right spans while the other spans are loaded with 28% (40% of 70%) of the same design ice weight are illustrated in Figure 12 and Table 6. The unbalanced ice loading cases shall be calculated under: (a) temperature of –5 °C; (b) no wind; and (c) conductor in the final condition (after creep)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_3_6_3",
        "clauseNumber": "6.3.6.3",
        "title": "Non-uniform ice formation on phase conductors and ground wires",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_3_6_3_1A",
        "clauseNumber": "6.3.6.3.1A",
        "title": "Clause 6.3.6.3.1A",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_3_6_3_1B",
        "clauseNumber": "6.3.6.3.1B",
        "title": "Clause 6.3.6.3.1B",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_Figure_12",
        "clauseNumber": "Figure 12",
        "title": "Clause Figure 12",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table7",
    "key": "table7",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 7",
    "title": "Return period of combined ice and wind load",
    "unit": "",
    "explicitRefs": [
      "6.4.1",
      "6.4.2",
      "6.4.3",
      "6.4.4",
      "Table A.13"
    ],
    "notes": {
      "principle": "A low probability (index L, return period T) value of one variable is combined with high probability (index H, average of yearly maximum values) of the remaining variables.",
      "combinations": "Two loading combinations are considered: Condition 1 (Low ice probability gL with average yearly wind during icing VIH) and Condition 2 (Low probability wind during icing VIL with average yearly maximum icing gH)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_4_1",
        "clauseNumber": "6.4.1",
        "title": "Combined probabilities – Principle proposed",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4_2",
        "clauseNumber": "6.4.2",
        "title": "Determination of ice load",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4_3",
        "clauseNumber": "6.4.3",
        "title": "Determination of coincident temperature",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4_4",
        "clauseNumber": "6.4.4",
        "title": "Determination of wind speed associated with icing conditions",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table8",
    "key": "table8",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 8",
    "title": "Drag coefficients of ice-covered conductors",
    "unit": "",
    "explicitRefs": [
      "6.4.5",
      "6.4.6.1",
      "Figure 13",
      "Table A.14"
    ],
    "notes": {
      "note1": "The uniform thickness of ice around the conductor corresponds to the minimum overall diameter, i.e. the most compact projected area.",
      "note2": "It is assumed that the value of Ci is the same for the ice coverings related to T = 50, 150, 500 years."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_4_5",
        "clauseNumber": "6.4.5",
        "title": "Drag coefficients of ice-covered conductors",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4_6_1",
        "clauseNumber": "6.4.6.1",
        "title": "Unit action of the wind on the ice-covered conductors",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_Figure_13",
        "clauseNumber": "Figure 13",
        "title": "Clause Figure 13",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_table9",
    "key": "table9",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 9",
    "title": "Additional security measures",
    "unit": "",
    "explicitRefs": [
      "6.6.2",
      "6.6.3.1",
      "6.6.3.3"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_6_2",
        "clauseNumber": "6.6.2",
        "title": "Security requirements",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_6_3_1",
        "clauseNumber": "6.6.3.1",
        "title": "Torsional load",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_6_3_3",
        "clauseNumber": "6.6.3.3",
        "title": "Additional security measures",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA1",
    "key": "tableA1",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.1",
    "title": "Yearly reliability corresponding to various assumptions of load and strength",
    "unit": "",
    "explicitRefs": [
      "5.1.1.2",
      "A.1.2.1",
      "Table A.2"
    ],
    "notes": {
      "exclusionLimit": "The yearly reliabilities given in Table A.1 apply for design with an exclusion limit of 10% (ue = 1.28 for normal distribution)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_1_1_2",
        "clauseNumber": "5.1.1.2",
        "title": "Approximate values for yearly reliability",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_2_1",
        "clauseNumber": "A.1.2.1",
        "title": "General",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_2",
        "clauseNumber": "A.2",
        "title": "c).",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA10",
    "key": "tableA10",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.10",
    "title": "Physical properties of ice",
    "unit": "",
    "explicitRefs": [
      "6.3",
      "6.4.5",
      "A.5.4",
      "Table 8",
      "Table A.11",
      "Table A.14"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_3",
        "clauseNumber": "6.3",
        "title": "Climatic loads, ice without wind",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_3_2",
        "clauseNumber": "6.3.2",
        "title": "Ice data",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4_5",
        "clauseNumber": "6.4.5",
        "title": "Drag coefficients of ice-covered conductors",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_5_4",
        "clauseNumber": "A.5.4",
        "title": "Physical properties of ice",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA11",
    "key": "tableA11",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.11",
    "title": "Meteorological parameters controlling ice accretion",
    "unit": "",
    "explicitRefs": [
      "A.5.4",
      "A.5.5",
      "Figure A.9",
      "Table A.10"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_A_5_4",
        "clauseNumber": "A.5.4",
        "title": "Physical properties of ice",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_5_5",
        "clauseNumber": "A.5.5",
        "title": "Meteorological parameters controlling ice accretion",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_Figure_A_9",
        "clauseNumber": "Figure A.9",
        "title": "Clause Figure A.9",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA12",
    "key": "tableA12",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.12",
    "title": "Statistical parameters of ice loads",
    "unit": "",
    "explicitRefs": [
      "6.3.4",
      "A.5.8.1"
    ],
    "notes": {
      "noStatisticalDataFallback": "If only the maximum value gmax of ice load during a certain number of years is available (no statistical data), the mean value g_mean should be taken as 0.45 gmax and standard deviation σg as 0.5 g_mean."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_3_4",
        "clauseNumber": "6.3.4",
        "title": "Reference limit ice load",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_5_8_1",
        "clauseNumber": "A.5.8.1",
        "title": "Evaluation of information on ice loads",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA13",
    "key": "tableA13",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.13",
    "title": "Combined wind and ice loading conditions",
    "unit": "",
    "explicitRefs": [
      "6.4.1",
      "A.6.1",
      "Table 7",
      "Table A.14"
    ],
    "notes": {
      "indexDefinitions": "The high probability (index H) is considered to be the average of extreme yearly values, while the low probability (index L) of the variable is the one corresponding to a return period T."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_4_1",
        "clauseNumber": "6.4.1",
        "title": "Combined probabilities – Principle proposed",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_6_1",
        "clauseNumber": "A.6.1",
        "title": "Combined probabilities",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA14",
    "key": "tableA14",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.14",
    "title": "Drag coefficients and density of ice-covered conductors",
    "unit": "",
    "explicitRefs": [
      "6.4.5",
      "A.6.2",
      "Table 8",
      "Table A.13"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_4_5",
        "clauseNumber": "6.4.5",
        "title": "Drag coefficients of ice-covered conductors",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_6_2",
        "clauseNumber": "A.6.2",
        "title": "Drag coefficients of ice-covered conductors",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA2",
    "key": "tableA2",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.2",
    "title": "Relationship between reliability levels and return periods of limit loads",
    "unit": "",
    "explicitRefs": [
      "5.1.1",
      "A.1.2.4",
      "A.1.2.5",
      "Table 1"
    ],
    "notes": {
      "lifeCycleFormula": "PsN = (Ps1)^N = (1 - Pf1)^N and PfN = 1 - PsN for a life cycle of N = 50 years."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_1_1",
        "clauseNumber": "5.1.1",
        "title": "Reliability requirements",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_2_4",
        "clauseNumber": "A.1.2.4",
        "title": "Reliability levels and associated failure probabilities",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_2_5",
        "clauseNumber": "A.1.2.5",
        "title": "Selection of reliability levels",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA3",
    "key": "tableA3",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.3",
    "title": "Typical strength coordination",
    "unit": "",
    "explicitRefs": [
      "7.2.2",
      "A.1.3.1",
      "A.1.3.2",
      "Table 13"
    ],
    "notes": {
      "footnoteStar": "Within each major component the underlined component is the weakest with 90% confidence."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_2",
        "clauseNumber": "7.2.2",
        "title": "Strength factor ΦΦ ΦΦ S related to the coordination of strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_3_1",
        "clauseNumber": "A.1.3.1",
        "title": "General basis for strength coordination",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_3_2",
        "clauseNumber": "A.1.3.2",
        "title": "Methods for calculating strength coordination factors ΦΦ ΦΦ S",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA4",
    "key": "tableA4",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.4",
    "title": "Values of central safety factor α and strength coordination factor ΦS required to insure that component R2 will fail after component R1 with a 90% probability",
    "unit": "",
    "explicitRefs": [
      "7.2.2",
      "A.1.3.4",
      "Table 12"
    ],
    "notes": {
      "formula": "ΦS = (10%)R1 / (10%)R2 = (1 - 1.28 vR1) / [α (1 - 1.28 vR2)], where α = R2_mean / R1_mean."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_2",
        "clauseNumber": "7.2.2",
        "title": "Strength factor ΦΦ ΦΦ S related to the coordination of strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_3_4",
        "clauseNumber": "A.1.3.4",
        "title": "Design for a target confidence level in the strength coordination",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA5",
    "key": "tableA5",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.5",
    "title": "Strength factor ΦN related to N components in series subjected to the critical load",
    "unit": "",
    "explicitRefs": [
      "7.2.1",
      "A.1.3.5",
      "Table 10",
      "Table 11"
    ],
    "notes": {
      "note1": "Values in parentheses refer to log-normal distribution; primary values refer to normal (Gaussian) distribution.",
      "note2": "The range of values where the difference in ΦN between normal and log-normal is more than 10% is shown in italic characters in the standard."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_1",
        "clauseNumber": "7.2.1",
        "title": "Values of strength factor ΦΦ ΦΦ N",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_3_5",
        "clauseNumber": "A.1.3.5",
        "title": "Number of components subjected to maximum load intensity",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA6",
    "key": "tableA6",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.6",
    "title": "Values of ue associated to exclusion limits",
    "unit": "",
    "explicitRefs": [
      "7.3.2",
      "7.3.3",
      "A.2.1"
    ],
    "notes": {
      "formula": "Φc = (1 - 1.28 vR) / (1 - ue vR), where (10%)R = Φc × Rc and Rc = R_mean (1 - ue vR)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_2",
        "clauseNumber": "7.3.2",
        "title": "Strength data of line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_3",
        "clauseNumber": "7.3.3",
        "title": "Support design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_2_1",
        "clauseNumber": "A.2.1",
        "title": "Calculation of characteristic strength",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA7",
    "key": "tableA7",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.7",
    "title": "Definition of terrain category",
    "unit": "",
    "explicitRefs": [
      "6.2.2",
      "A.4.1",
      "Table 4",
      "Table A.8"
    ],
    "notes": {
      "topographyGuidance": "For a line that follows the ridge of a hill, a terrain roughness which is smoother by one category than the one chosen for the area should be selected in order to be conservative. For a line running along a valley, the C roughness should be chosen for all cases, whatever the terrain characteristics may be."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_2_2",
        "clauseNumber": "6.2.2",
        "title": "Terrain roughness",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4_1",
        "clauseNumber": "A.4.1",
        "title": "Roughness of terrain",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4_2",
        "clauseNumber": "A.4.2",
        "title": "Assessment of meteorological measurements",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA8",
    "key": "tableA8",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.8",
    "title": "Factors describing wind action depending on terrain category",
    "unit": "",
    "explicitRefs": [
      "6.2.2",
      "6.2.3",
      "A.4.2",
      "Table 4",
      "Table A.7"
    ],
    "notes": {
      "powerLawFormula": "Vz = VR × (z / 10)^α, where z is height above ground (m) and α is the power law exponent in Table A.8."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_2_2",
        "clauseNumber": "6.2.2",
        "title": "Terrain roughness",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_2_3",
        "clauseNumber": "6.2.3",
        "title": ".",
        "section": "2 years (seasons) are in most cases sufficient.",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4_2",
        "clauseNumber": "A.4.2",
        "title": "Assessment of meteorological measurements",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4_5_2",
        "clauseNumber": "A.4.5.2",
        "title": "Reference wind speed for design",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableA9",
    "key": "tableA9",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.9",
    "title": "Values of reference wind speed VR (ratio VR / mV)",
    "unit": "",
    "explicitRefs": [
      "A.4.5.2",
      "B.2",
      "Table B.1"
    ],
    "notes": {
      "note1": "In Table A.9 the ratio VR / mV (where mV is the mean of yearly maximum wind velocities) is given for typical coefficients of variation vv when the number of years of observations is very large (n -> ∞). In other cases, refer to Clause B.2 / Table B.1."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_A_4_5_2",
        "clauseNumber": "A.4.5.2",
        "title": "Reference wind speed for design",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_2",
        "clauseNumber": "B.2",
        "title": "Climatic loads",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableB1",
    "key": "tableB1",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table B.1",
    "title": "Ratios of x / x_mean for a Gumbel distribution function, T return period in years of loading event, n number of years with observations, vx coefficient of variation",
    "unit": "",
    "explicitRefs": [
      "5.2.1",
      "A.4.5.2",
      "B.2.1",
      "Table 2",
      "Table A.9",
      "Table C.1"
    ],
    "notes": {
      "formula": "x(T) / x_mean = 1 + [(-ln(-ln(1 - 1/T)) - C2) / C1] × vx, where C1 and C2 are Gumbel sample size parameters from Table C.1."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_1",
        "clauseNumber": "5.2.1",
        "title": "Limit load",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_3_3",
        "clauseNumber": "A.1.3.3",
        "title": "Use of different exclusion limits",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4_5_2",
        "clauseNumber": "A.4.5.2",
        "title": "Reference wind speed for design",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_2_1",
        "clauseNumber": "B.2.1",
        "title": "Wind velocities and wind loads",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_4_2_1",
        "clauseNumber": "B.4.2.1",
        "title": "Calculation of use factor coefficient by statistics and simulation",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableB2",
    "key": "tableB2",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table B.2",
    "title": "Parameters of Weibull distribution",
    "unit": "",
    "explicitRefs": [
      "B.3",
      "C.5",
      "Figure B.5"
    ],
    "notes": {
      "footnoteA": "Rsp is the specified strength which is equal to the threshold p1 (= 1)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_B_3",
        "clauseNumber": "B.3",
        "title": "Strength of components",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_3_1",
        "clauseNumber": "B.3.1",
        "title": "Lattice supports",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_C_5",
        "clauseNumber": "C.5",
        "title": "Weibull distribution",
        "section": "Annex C (Conductor Properties)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_Figure_B_5",
        "clauseNumber": "Figure B.5",
        "title": "Clause Figure B.5",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableB3",
    "key": "tableB3",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table B.3",
    "title": "Statistical parameters U_mean and σu of wind span variation",
    "unit": "",
    "explicitRefs": [
      "5.2.3",
      "B.4.1",
      "Table B.4",
      "Table B.5",
      "Table B.6"
    ],
    "notes": {
      "bounds": "In Tables B.3 and B.4 the lower bound of the use factor is assumed to be 0.4 and the upper bound is 1.0.",
      "terrainCodes": "a = flat; b = rolling, hilly; c = mountainous.",
      "constraintCodes": "1 = no special constraints; 2 = constraints on support locations."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_3",
        "clauseNumber": "5.2.3",
        "title": "Design equation for each component",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_4_1",
        "clauseNumber": "B.4.1",
        "title": "General",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableB4",
    "key": "tableB4",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table B.4",
    "title": "Statistical parameters U_mean and σu of weight span variation",
    "unit": "",
    "explicitRefs": [
      "5.2.3",
      "B.4.1",
      "Table B.3",
      "Table B.5",
      "Table B.6"
    ],
    "notes": {
      "bounds": "In Tables B.3 and B.4 the lower bound of the use factor is assumed to be 0.4 and the upper bound is 1.0.",
      "terrainCodes": "a = flat; b = rolling, hilly; c = mountainous.",
      "constraintCodes": "1 = no special constraints; 2 = constraints on support locations."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_3",
        "clauseNumber": "5.2.3",
        "title": "Design equation for each component",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_4_1",
        "clauseNumber": "B.4.1",
        "title": "General",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableB5",
    "key": "tableB5",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table B.5",
    "title": "Values of use factor coefficient γu as a function of U_mean and N for vR = 0.10",
    "unit": "",
    "explicitRefs": [
      "5.2.3",
      "B.4.3",
      "Table B.6"
    ],
    "notes": {
      "formula": "γu = (10%)min_N(R) / (10%)min_N(R/U). Obtained by Monte-Carlo simulation for vR = 0.10."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_3",
        "clauseNumber": "5.2.3",
        "title": "Design equation for each component",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_3_3",
        "clauseNumber": "A.1.3.3",
        "title": "Use of different exclusion limits",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_4_3",
        "clauseNumber": "B.4.3",
        "title": "Effect of number of supports on use factor coefficients",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_4_4",
        "clauseNumber": "B.4.4",
        "title": "Generalized results for use factor coefficients γγ γγu",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableB6",
    "key": "tableB6",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table B.6",
    "title": "Use factor coefficient γu for different strength coefficients of variation",
    "unit": "",
    "explicitRefs": [
      "5.2.3",
      "B.4.4",
      "Table B.3",
      "Table B.4",
      "Table B.5"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_3",
        "clauseNumber": "5.2.3",
        "title": "Design equation for each component",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_4_4",
        "clauseNumber": "B.4.4",
        "title": "Generalized results for use factor coefficients γγ γγu",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableC1",
    "key": "tableC1",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table C.1",
    "title": "Parameters C1 and C2 of Gumbel distribution",
    "unit": "",
    "explicitRefs": [
      "B.2.1",
      "C.4",
      "Table B.1",
      "Figure C.3"
    ],
    "notes": {
      "asymptoticValues": "For n = ∞, C1 = π / sqrt(6) ≈ 1.28255 and C2 = γ_Euler ≈ 0.57722."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_B_2_1",
        "clauseNumber": "B.2.1",
        "title": "Wind velocities and wind loads",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_C_4",
        "clauseNumber": "C.4",
        "title": "Gumbel distribution",
        "section": "Annex C (Conductor Properties)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_C_4_2",
        "clauseNumber": "C.4.2",
        "title": "Standardized format",
        "section": "Annex C (Conductor Properties)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_Figure_C_3",
        "clauseNumber": "Figure C.3",
        "title": "Clause Figure C.3",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableC2",
    "key": "tableC2",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table C.2",
    "title": "Values of u1 for given values of function F(u1) = I(u1, p3 - 1)",
    "unit": "",
    "explicitRefs": [
      "C.6",
      "Figure C.5"
    ],
    "notes": {
      "structure": "Upper sub-table gives u1 for upper tail return periods T = 50 (FT = 0.98), 150 (FT = 0.993), and 500 (FT = 0.998) for shape parameter p3 in [0.05, 1.00]. Lower sub-table gives u1 for lower tail exclusion limits e = 2% (Fe = 0.02), 5% (Fe = 0.05), and 10% (Fe = 0.10) for shape parameter p3 in [1.0, 3.0]."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_C_6",
        "clauseNumber": "C.6",
        "title": "Gamma distribution",
        "section": "Annex C (Conductor Properties)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_C_6_2",
        "clauseNumber": "C.6.2",
        "title": "Standardized format",
        "section": "Annex C (Conductor Properties)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_C_8",
        "clauseNumber": "C.8",
        "title": "Gamma function and its relationships",
        "section": "Annex C (Conductor Properties)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_Figure_C_5",
        "clauseNumber": "Figure C.5",
        "title": "Clause Figure C.5",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableCA1",
    "key": "tableCA1",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table CA.1",
    "title": "Weather data",
    "unit": "",
    "explicitRefs": [
      "6.2.4",
      "6.3.4.1",
      "CA.1",
      "CA.2",
      "CA.3",
      "CA.4",
      "Table CA.2"
    ],
    "notes": {
      "footnoteStar": "The following are lowest January hourly temperatures to a 1% exclusion level. (One per cent of January hourly temperatures are at or lower than these values.)",
      "footnoteDagger": "10 minute average speed, 50-year return period.",
      "footnoteDblDagger": "Ice thickness from freezing precipitation, 50-year return period.",
      "footnoteSection": "Wet snow thickness on a 40 mm conductor, 50-year return period is provided for regions where data were available at the time this Standard was prepared. The recommended coincident temperature is –5 °C. The corresponding density of the accreted snow is 350 kg/m³."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_2_4",
        "clauseNumber": "6.2.4",
        "title": "Combination of wind speed and temperatures",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_3_4_1",
        "clauseNumber": "6.3.4.1",
        "title": "Based on statistical data",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CA_1",
        "clauseNumber": "CA.1",
        "title": "Clause CA.1",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CA_2",
        "clauseNumber": "CA.2",
        "title": "Clause CA.2",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CA_3",
        "clauseNumber": "CA.3",
        "title": "Clause CA.3",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CA_4",
        "clauseNumber": "CA.4",
        "title": "Clause CA.4",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableCA2",
    "key": "tableCA2",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table CA.2",
    "title": "Factors γT to modify the 50-year return period weather variable to any other return period T",
    "unit": "",
    "explicitRefs": [
      "5.2.1",
      "6.3.4.1",
      "Table CB.1",
      "Table 2"
    ],
    "notes": {
      "note1": "γTw applies to wind speed and γTi applies to ice thickness.",
      "interpolationRule": "Per Clause 5.2.1 (Canadian Deviation): If return periods other than those given in Table CA.2 are used, the corresponding weather variables may be deduced by direct interpolation between the values specified in Table CA.2."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_1",
        "clauseNumber": "5.2.1",
        "title": "Limit load",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_3_4_1",
        "clauseNumber": "6.3.4.1",
        "title": "Based on statistical data",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableCB1",
    "key": "tableCB1",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table CB.1",
    "title": "Default values for distribution lines and structures",
    "unit": "",
    "explicitRefs": [
      "CB.1",
      "CB.2",
      "Table CA.2"
    ],
    "notes": {
      "footnoteStar": "The adjustment factor of 1.5 mentioned in this Standard includes a height factor of 1.15 for typical transmission conductors. Since distribution conductors are at a height of about 10 m, the factor of 1.15 should not be used; therefore, the applicable spatial factor for icing thickness on distribution lines should be: 1.5/1.15 = 1.3.",
      "footnoteDagger": "Refer to IEC Figure 3 (referenced as Table 3 in footnote) for a conductor height of 10 m and terrain type B.",
      "footnoteDblDagger": "Refer to IEC Figure 4 (referenced as Table 4 in footnote) for spans less than 200 m.",
      "footnoteSection": "Wind is always considered perpendicular to spans.",
      "footnoteDoubleStar": "Typical of Canadian conditions during persistence of ice on conductors, particularly after icing storms.",
      "footnoteDoubleDagger": "Reflects increase in air density for colder temperatures since high winds in Canada occur during colder seasons. In this Standard, the air density correction factor for wind only is 1.04 and 1.1 for wind and ice combinations. For the purpose of simplifying calculations for distribution lines, a single default air density correction factor of 1.1 may be used for all wind-related loads.",
      "footnoteTripleDagger": "Considered the same as for conductors.",
      "footnoteDoubleSection": "This value could be reduced to 25 years. In that case, the wind speed and ice thickness in the weather maps would be adjusted by the factors specified in Table CA.2."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_CB_1",
        "clauseNumber": "CB.1",
        "title": "Clause CB.1",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_2",
        "clauseNumber": "CB.2",
        "title": "Clause CB.2",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableCB2",
    "key": "tableCB2",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table CB.2",
    "title": "Conductor loads per pole (N)",
    "unit": "N",
    "explicitRefs": [
      "CB.3.1",
      "CB.3.2",
      "CB.3.3",
      "CB.3.4",
      "CB.3.5",
      "CB.3.7",
      "Table CB.3"
    ],
    "notes": {
      "sampleInputs": "3-phase circuit in Ottawa, 50-year return period, conductor diameter 22 mm, span 80 m, conductor unit weight 11 N/m, V50 = 90 km/h, point radial ice t50 = 30 mm (design ice = 39 mm). Values in Table CB.2 are total for 3 conductors per pole."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_CB_3_1",
        "clauseNumber": "CB.3.1",
        "title": "Clause CB.3.1",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_3_2",
        "clauseNumber": "CB.3.2",
        "title": "Clause CB.3.2",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_3_3",
        "clauseNumber": "CB.3.3",
        "title": "Clause CB.3.3",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_3_4",
        "clauseNumber": "CB.3.4",
        "title": "Clause CB.3.4",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_3_5",
        "clauseNumber": "CB.3.5",
        "title": "Clause CB.3.5",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_3_7",
        "clauseNumber": "CB.3.7",
        "title": "Clause CB.3.7",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "c22_3_60826_tableCB3",
    "key": "tableCB3",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table CB.3",
    "title": "Fibre stress calculation for pole selection",
    "unit": "",
    "explicitRefs": [
      "CB.3.6",
      "CB.3.7",
      "Table CB.2"
    ],
    "notes": {
      "commentary": "Table CB.3 indicates that the maximum ground line stress for Pole DF-5-40 is 43.7 MPa, slightly less than the value of 44.4 MPa derived in Clause CB.3.6. However, additional verification using commercially available software confirmed that the pole section about 2 m above ground has a fibre stress of 46.04 MPa, which exceeds the design value of 44.4 MPa; thus class 5 pole is not suitable for this project. In the case of class 4 pole, the calculated fibre stress is 32.2 MPa < 44.4 MPa; thus it constitutes a suitable solution for this project."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_CB_3_6",
        "clauseNumber": "CB.3.6",
        "title": "Clause CB.3.6",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_3_7",
        "clauseNumber": "CB.3.7",
        "title": "Clause CB.3.7",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  {
    "id": "csa_o15_table1",
    "key": "table1",
    "standardId": "csa_o15",
    "standardName": "CSA O15",
    "edition": "2015 (R2020)",
    "number": "Table 1",
    "title": "Maximum knot sizes",
    "unit": "",
    "explicitRefs": [
      "3",
      "4.4.7",
      "E.1"
    ],
    "notes": {
      "measurementMethod": "The diameter of any single knot is measured at the widest point of the knot, perpendicular to the length of the pole, and includes the sapwood and heartwood of the knot, as shown in Figure 3.",
      "disregardLimit": "Knots 13 mm (1/2 in) or less in diameter shall be ignored in applying the limitations for the sum of diameters."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "csa_o15_cl_3",
        "clauseNumber": "3",
        "title": "Definitions",
        "section": "3 Definitions",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_4_4_7",
        "clauseNumber": "4.4.7",
        "title": "Knot diameter",
        "section": "4 Material requirements",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_E_1",
        "clauseNumber": "E.1",
        "title": "Application",
        "section": "Annex E (informative) SI (metric) versions of Tables 1 to 23",
        "standardId": "csa_o15"
      }
    ]
  },
  {
    "id": "csa_o15_table2",
    "key": "table2",
    "standardId": "csa_o15",
    "standardName": "CSA O15",
    "edition": "2015 (R2020)",
    "number": "Table 2",
    "title": "Maximum spiral grain",
    "unit": "",
    "explicitRefs": [
      "4.4.11",
      "E.1"
    ],
    "notes": {
      "definition": "Spiral grain (twisted grain) is a type of growth in which the fibres take a spiral course around the trunk."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "csa_o15_cl_4_4_11",
        "clauseNumber": "4.4.11",
        "title": "Spiral grain",
        "section": "4 Material requirements",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_E_1",
        "clauseNumber": "E.1",
        "title": "Application",
        "section": "Annex E (informative) SI (metric) versions of Tables 1 to 23",
        "standardId": "csa_o15"
      }
    ]
  },
  {
    "id": "csa_o15_table3",
    "key": "table3",
    "standardId": "csa_o15",
    "standardName": "CSA O15",
    "edition": "2015 (R2020)",
    "number": "Table 3",
    "title": "Strength and stiffness properties by species",
    "unit": "",
    "explicitRefs": [
      "4.1.1",
      "4.1.2",
      "6.5.3",
      "B.1.1",
      "E.1",
      "Tables 4-13",
      "Tables E.4-E.13",
      "Table 23",
      "Table E.23"
    ],
    "notes": [
      "The fibre stresses are stresses for the purposes of classification and are close approximations to the average bending strengths (MOR) specified in Table A.1 for poles 20 to 35 ft (6.1 to 10.7 m) in length.",
      "Bending strengths are derived from specimens whose moisture contents at the groundline were above the fibre saturation point at the time of testing to failure.",
      "The strength of poles longer than 50 ft (15.2 m) can be less, as indicated in Annex A.",
      "Fibre stress for several species was based on limited test information or results from one test site.",
      "Classification criteria: Taper = (circumference at theoretical groundline - minimum top circumference) / length between them; loading point 0.61 m (2 ft) from pole top; classification point 1.83 m (6 ft) from butt.",
      "Pole test data for yellow cedar, eastern white pine, and ponderosa pine were not available; values approximate average strengths of small, clear bending specimens.",
      "Only Douglas fir poles taken from the western slopes of Coast and Cascade Mountains shall be classified as coastal Douglas fir. All other Douglas fir poles shall be classified as interior Douglas fir.",
      "Natural variability within a sample of poles and between pole samples taken from various areas of growth region exists.",
      "Scots and southern yellow pines are not native to Canada. Southern yellow pine includes loblolly, longleaf, shortleaf, and slash pine.",
      "Spruce species include black, Engelmann, red, Sitka, and white spruce. Separation after harvesting is impractical. Small clear tests indicate white spruce is weakest of the five."
    ],
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "csa_o15_cl_0",
        "clauseNumber": "0",
        "title": "Introduction",
        "section": "0 Introduction",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_4_1_1",
        "clauseNumber": "4.1.1",
        "title": "Permitted commercial species",
        "section": "4 Material requirements",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_4_1_2",
        "clauseNumber": "4.1.2",
        "title": "Classification according to fibre stresses",
        "section": "4 Material requirements",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_6_5_3",
        "clauseNumber": "6.5.3",
        "title": "Code letters for country of origin and pole species",
        "section": "6 Quality of work and finish, markings, handling, storage, and inspection",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_B_1_1",
        "clauseNumber": "B.1.1",
        "title": "Calculation of minimum circumferences and horizontal loads",
        "section": "Annex B (informative) Classification procedure for poles",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_E_1",
        "clauseNumber": "E.1",
        "title": "Application",
        "section": "Annex E (informative) SI (metric) versions of Tables 1 to 23",
        "standardId": "csa_o15"
      }
    ]
  },
  {
    "id": "csa_o15_tableB1",
    "key": "tableB1",
    "standardId": "csa_o15",
    "standardName": "CSA O15",
    "edition": "2015 (R2020)",
    "number": "Table B.1",
    "title": "Horizontal loads for standard classes of wood utility poles",
    "unit": "",
    "explicitRefs": [
      "B.1.1",
      "Tables 7-9",
      "Tables E.7-E.9"
    ],
    "notes": {
      "reductionFactorWesternRedCedar": 0.95,
      "reductionFactorRedPine": 0.95,
      "reductionFactorJackPine": 0.95,
      "footnote": "The loads specified in this Table should be corrected by a factor of 0.95 for western red cedar, red pine, and jack pine."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "csa_o15_cl_B_1_1",
        "clauseNumber": "B.1.1",
        "title": "Calculation of minimum circumferences and horizontal loads",
        "section": "Annex B (informative) Classification procedure for poles",
        "standardId": "csa_o15"
      }
    ]
  },
  {
    "id": "csa_o15_tableC1",
    "key": "tableC1",
    "standardId": "csa_o15",
    "standardName": "CSA O15",
    "edition": "2015 (R2020)",
    "number": "Table C.1",
    "title": "Standard classes of reinforcing stubs",
    "unit": "",
    "explicitRefs": [
      "C.1",
      "C.2",
      "C.3",
      "C.4",
      "Tables 14-23",
      "Tables E.14-E.23"
    ],
    "notes": {
      "basis": "A stub should have a life at least equal to the remaining life of the pole. The circumference at 1.83 m (6 ft) from the butt of the stub is approximately 51 mm (2 in) less than that of a new replacement pole adequate to support the load."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "csa_o15_cl_C_1",
        "clauseNumber": "C.1",
        "title": "Classification",
        "section": "Annex C (informative) Classification procedure for reinforcing stubs",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_C_2",
        "clauseNumber": "C.2",
        "title": "Lengths",
        "section": "Annex C (informative) Classification procedure for reinforcing stubs",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_C_3",
        "clauseNumber": "C.3",
        "title": "Size determination",
        "section": "Annex C (informative) Classification procedure for reinforcing stubs",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_C_4",
        "clauseNumber": "C.4",
        "title": "Shrinkage",
        "section": "Annex C (informative) Classification procedure for reinforcing stubs",
        "standardId": "csa_o15"
      }
    ]
  }
];
export const CSA_TABLES_MAP = {
  "c22_3_no1_table1": {
    "id": "c22_3_no1_table1",
    "key": "table1",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 1",
    "title": "Wire and conductor swing for horizontal design clearance",
    "unit": "",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.2.7",
      "A.5.2.7",
      "A.5.8.2",
      "A.7.6.1"
    ],
    "notes": {
      "formula": "Horizontal deviation = factor × conductor sag",
      "diameterUnit": "mm (d = diameter of conductor)",
      "massUnit": "kg/m (w = mass per unit length)",
      "partiallyShelteredDefinition": "A partially sheltered span is one that is protected (from swinging transversely in the wind) by objects such as buildings whose height is greater than or equal to wire or conductor height and that are within an effective distance (e.g., 30 m) of the wire or conductor. Trees are not generally considered to provide shelter.",
      "fullyShelteredDefinition": "Per Clause 5.2.7(c): Where wires or conductors are fully sheltered from transverse wind loads (e.g., along narrow urban streets or lanes between buildings reaching at least conductor height on both sides), no allowance is required for horizontal deviation (factor = 0)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_2_5",
        "clauseNumber": "2.5",
        "title": "% July design temperature (as specified in the National Building Code of Canada) applicable to",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_2_7",
        "clauseNumber": "A.5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_8_2",
        "clauseNumber": "A.5.8.2",
        "title": "Clearances between conductors supported by different structures but not",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_7_6_1",
        "clauseNumber": "A.7.6.1",
        "title": "Assumed transverse load due to wind pressure on wire and cable",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table2": {
    "id": "c22_3_no1_table2",
    "key": "table2",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 2",
    "title": "Minimum vertical design clearances above ground or rails, ac",
    "unit": "m",
    "evaluatedAt": "maxSag",
    "explicitRefs": [
      "5.3.1.1",
      "5.7.4.1",
      "A.5.3.1",
      "Table 4",
      "Table 9",
      "Table 11"
    ],
    "notes": {
      "1": "Voltages are rms line-to-ground. Voltages in parentheses are phase-to-phase.",
      "2": "For elevations exceeding 1000 m, see Clause 5.3.1.1(b).",
      "3": "Seasonal conditions can warrant additional clearances (see Clause 5.3.1.1(e)).",
      "4": "Electrostatic-governed clearances above 200 kV assume the horizontal configurations in ELECTROSTATIC_BASIS_CONFIGS."
    },
    "footnotes": {
      "*": "For dc voltages below 750 V, use Columns II and III."
    },
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_3_1_1",
        "clauseNumber": "5.3.1.1",
        "title": "Basic clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_4_1",
        "clauseNumber": "5.7.4.1",
        "title": "General",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_3_1",
        "clauseNumber": "A.5.3.1",
        "title": "Vertical design clearances of wires and conductors above ground or rails and",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_7_10",
        "clauseNumber": "A.5.7.10",
        "title": "Clearance from irrigation systems",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table3": {
    "id": "c22_3_no1_table3",
    "key": "table3",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 3",
    "title": "Minimum vertical design clearances above waterways*, ac and dc†",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [],
    "notes": {
      "1": "Voltages are rms line-to-ground.",
      "2": "The formula used to calculate minimum clearances is as follows: Minimum vertical clearance = reference vessel height + 1.0 m buffer + safe electrical clearance where 1.0 m buffer = allowance for variation in boat height above water (due to different loading conditions) and for wave action; safe electrical clearance = safety margin + air gap flashover distance based on switching surge = 0.78 m + (0.01 m/kV × max. kV in each column)",
      "3": "Vertical design clearance is based on the clearance needed for the vessel height that a waterway can support. If a waterway cannot support the referenced vessel height, the vertical clearance requirement may be reduced in accordance with the appropriate requirement."
    },
    "footnotes": {
      "*": "The clearance over a canal, river, or stream normally used to provide access for sailboats to a larger body of water shall be the same as that required for the larger body of water.",
      "†": "Clearances are applicable to both ac and dc circuits. For dc circuits, the clearance requirements shall be the same as those for ac circuits having the same crest voltage-to-ground.",
      "‡": "Reference vessel height refers to the overall height of the vessel, including the heights of antennas or other attachments.",
      "§": "In Canada, clearances are specified by the Transport Canada office responsible for the coastal regions, Great Lakes system, Red River–Lake Winnipeg system, Mackenzie River, and interior lakes of British Columbia. Where tide water has an effect on a body of water being crossed, the vertical design clearance shall be increased by an amount that takes into account peak tide."
    },
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_3_3_2",
        "clauseNumber": "5.3.3.2",
        "title": "Basic vertical clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table4": {
    "id": "c22_3_no1_table4",
    "key": "table4",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 4",
    "title": "Minimum vertical design clearances above ground or rails, dc",
    "unit": "m",
    "evaluatedAt": "maxSag",
    "explicitRefs": [
      "5.3.1.1",
      "5.7.4.1",
      "A.5.3.1",
      "Table 9",
      "Table 11"
    ],
    "notes": {
      "1": "Voltages are line-to-ground.",
      "2": "Seasonal conditions can warrant additional clearances (see Clause 5.3.1.1(e))."
    },
    "footnotes": {
      "*": "For dc voltages below 0.75 kV, use Columns II and III of Table 2.",
      "†": "See Clause 5.3.1.1(d).",
      "‡": "Add 0.005 m/kV for each kV over 500 kV to clearances in Column IX.",
      "§": "These areas are generally adjacent to fences and accessible to small vehicles but are not likely to be travelled by high road vehicles or high farm machinery.",
      "**": "See Clause 5.3.1.1(c)."
    },
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_3_1_1",
        "clauseNumber": "5.3.1.1",
        "title": "Basic clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_4_1",
        "clauseNumber": "5.7.4.1",
        "title": "General",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_3_1",
        "clauseNumber": "A.5.3.1",
        "title": "Vertical design clearances of wires and conductors above ground or rails and",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table5": {
    "id": "c22_3_no1_table5",
    "key": "table5",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 5",
    "title": "Minimum separations (heights) of supply equipment from ground",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.3.2.1",
      "A.5.3.2",
      "Table 11"
    ],
    "notes": {
      "1": "Voltages are rms line-to-ground."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_3_2_1",
        "clauseNumber": "5.3.2.1",
        "title": "5 Clearances, separations, and spacings — Clause 5.3.2.1",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_3_2",
        "clauseNumber": "A.5.3.2",
        "title": "Vertical separations (heights) of supply equipment from ground",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table6": {
    "id": "c22_3_no1_table6",
    "key": "table6",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 6",
    "title": "Minimum horizontal design clearances between wires and railway tracks",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.4.2",
      "5.4.3"
    ],
    "notes": {
      "1": "Voltages are line-to-ground."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_4_2",
        "clauseNumber": "5.4.2",
        "title": "5 Clearances, separations, and spacings — Clause 5.4.2",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_4_3",
        "clauseNumber": "5.4.3",
        "title": "5 Clearances, separations, and spacings — Clause 5.4.3",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table7": {
    "id": "c22_3_no1_table7",
    "key": "table7",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 7",
    "title": "Minimum horizontal separations from supporting structures to railway tracks",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.5.2",
      "5.5.3",
      "5.4.3",
      "5.5.4",
      "5.5.5"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_4_3",
        "clauseNumber": "5.4.3",
        "title": "5 Clearances, separations, and spacings — Clause 5.4.3",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_5_2",
        "clauseNumber": "5.5.2",
        "title": "5 Clearances, separations, and spacings — Clause 5.5.2",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_5_3",
        "clauseNumber": "5.5.3",
        "title": "5 Clearances, separations, and spacings — Clause 5.5.3",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_5_4",
        "clauseNumber": "5.5.4",
        "title": "5 Clearances, separations, and spacings — Clause 5.5.4",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_5_5",
        "clauseNumber": "5.5.5",
        "title": "5 Clearances, separations, and spacings — Clause 5.5.5",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table8": {
    "id": "c22_3_no1_table8",
    "key": "table8",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 8",
    "title": "Minimum design clearances of supply conductors attached to buildings",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.7.2",
      "5.7.2.1",
      "5.7.2.2",
      "5.2.7"
    ],
    "notes": {
      "voltage": "Voltages are rms line-to-ground.",
      "generalFootnoteStar": "Clearances are applicable to non-metallic buildings or buildings whose metallic parts are effectively grounded. For other buildings, an assessment might be needed to determine additional clearances for electrostatic induction.",
      "footnoteDagger": "For inaccessible surfaces, this value may be reduced to 0.08 m. At the service attachment point, this value may be further reduced to 0.02 m.",
      "footnoteDoubleDagger": "This value may be reduced to 1.2 m where the building does not have fire escapes, balconies, and windows that can be opened adjacent to the conductor.",
      "footnoteSection": "This value may be reduced to 1.5 m where the building does not have fire escapes, balconies, and windows that can be opened adjacent to the conductor.",
      "footnoteDoubleStar": "Conductors of these voltage classes should not be carried over buildings where other suitable construction can be used.",
      "footnoteDoubleDaggerDagger": "Where it is necessary to carry conductors of these voltage classes over buildings, it should be determined whether additional measures, including increased clearances, are needed to ensure that the crossed-over buildings can be used safely and appropriately."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_2",
        "clauseNumber": "5.7.2",
        "title": "Clearances of supply conductors permanently attached to buildings",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_2_1",
        "clauseNumber": "5.7.2.1",
        "title": "5 Clearances, separations, and spacings — Clause 5.7.2.1",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_2_2",
        "clauseNumber": "5.7.2.2",
        "title": "5 Clearances, separations, and spacings — Clause 5.7.2.2",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table9": {
    "id": "c22_3_no1_table9",
    "key": "table9",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 9",
    "title": "Minimum design clearances from wires and conductors not attached to buildings, signs, and similar plant",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.7.3.1",
      "5.7.3.2",
      "5.7.3.3",
      "5.2.7",
      "Tables 2 & 4"
    ],
    "notes": {
      "voltage": "Voltages are rms line-to-ground.",
      "footnoteStar": "Clearances over or adjacent to portions of a building normally traversed by persons or vehicles are specified in Tables 2 and 4.",
      "footnoteDagger": "Clearances are applicable to non-metallic buildings or buildings whose metallic parts are effectively grounded. For other buildings, an assessment might be needed to determine additional clearances for electrostatic induction (see Clause 5.7.3.3).",
      "footnoteDoubleDagger": "Conductor swing shall be added to these values in accordance with Clause 5.7.3.1.",
      "footnoteSection": "This clearance may be reduced to 1 m for portions of the building considered normally inaccessible.",
      "footnoteDoubleStar": "Conductors of these voltage classes should not be carried over buildings where other suitable construction can be used.",
      "footnoteDoubleDaggerDagger": "Where it is necessary to carry conductors of these voltage classes over buildings, it should be determined whether additional measures, including increased clearances, are needed to ensure that the crossed-over buildings can be used safely and effectively.",
      "footnoteDoubleDoubleDagger": "This value may be reduced to 1.5 m where the building does not have fire escapes, balconies, and windows that can be opened adjacent to the conductor."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_3_1",
        "clauseNumber": "5.7.3.1",
        "title": "Basic clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_3_2",
        "clauseNumber": "5.7.3.2",
        "title": "Application of clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_3_3",
        "clauseNumber": "5.7.3.3",
        "title": "Conductors energized above 200 kV",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table10": {
    "id": "c22_3_no1_table10",
    "key": "table10",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 10",
    "title": "Minimum design clearances from supply conductors to bridges",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.7.4",
      "5.7.4.1",
      "5.7.4.2",
      "5.2.7",
      "Tables 2 & 4"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "note2": "Grounding conductors or conductors installed in effectively grounded conduit do not require clearance under a bridge.",
      "footnoteStar": "Readily accessible portions include portions of a bridge likely to be used by workers and portions readily accessible to the public. Bridge seats of steel bridges supported by masonry, brick, or concrete abutments that need periodic inspection should be considered readily accessible portions. Concrete, brick, or masonry portions that need to be passed by workers so that they can gain access to other areas shall be considered readily accessible portions.",
      "footnoteDagger": "This clearance may be reduced to 1 m where the portion of the bridge involved is readily accessible to workers but not to the public."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_4",
        "clauseNumber": "5.7.4",
        "title": "Clearances from supply wires and conductors to bridges",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_4_1",
        "clauseNumber": "5.7.4.1",
        "title": "General",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_4_2",
        "clauseNumber": "5.7.4.2",
        "title": "Basic clearances for supply conductors",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table11": {
    "id": "c22_3_no1_table11",
    "key": "table11",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 11",
    "title": "Minimum separation of equipment and clearances of conductors from swimming pools",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.7.5",
      "A.5.7.5",
      "5.3.1",
      "5.3.2",
      "Figure 1",
      "Table 2",
      "Table 4",
      "Table 5"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "note2": "See Figure 1 for an illustration of swimming pool clearance limits.",
      "footnoteStar": "Supply conductors greater than 150 kV shall not cross over swimming pools or be closer to the edge of a pool than 8.0 m + 0.01 m/kV above 150 kV."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_3_1",
        "clauseNumber": "5.3.1",
        "title": "Vertical design clearances of wires and conductors above ground or rails",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_3_2",
        "clauseNumber": "5.3.2",
        "title": "Vertical separations (heights) of supply equipment from ground",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_7_5",
        "clauseNumber": "5.7.5",
        "title": "Minimum separation of equipment and clearances of conductors over and",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_7_5",
        "clauseNumber": "A.5.7.5",
        "title": "Minimum separation of equipment and clearances of conductors over and",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_Figure_1",
        "clauseNumber": "Figure 1",
        "title": "Clause Figure 1",
        "section": "Normative Clause",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table12": {
    "id": "c22_3_no1_table12",
    "key": "table12",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 12",
    "title": "Minimum horizontal separations from supply equipment to buildings",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.7.6",
      "A.5.7.6"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "Exposed live parts include any parts not effectively grounded.",
      "footnoteDagger": "This equipment shall not be attached in any readily accessible location."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_7_6",
        "clauseNumber": "5.7.6",
        "title": "Horizontal separations from supply equipment to buildings",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_7_6",
        "clauseNumber": "A.5.7.6",
        "title": "Horizontal separations from supply equipment to buildings and Table 12",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table13": {
    "id": "c22_3_no1_table13",
    "key": "table13",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 13",
    "title": "Minimum design vertical clearances between wires crossing each other and supported by different supporting structures",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.8.1.1",
      "5.8.1.2",
      "5.8.1.3",
      "A.5.8.1",
      "A.5.8.1.3",
      "Table 14",
      "Table 15"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "note2": "Refer to Clause A.5.8.1 for explanation of the calculation method used to produce the clearance values shown in this Table.",
      "note3": "Refer to Table A.1 for typical nominal system voltages and overvoltage values.",
      "footnoteStar": "Where the trolley pole is not prevented from de-wiring, the clearance shall be increased so as to maintain the minimum specified clearance between the trolley pole in the de-wired position and the crossing conductor."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_8_1_1",
        "clauseNumber": "5.8.1.1",
        "title": "Basic clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_1_2",
        "clauseNumber": "5.8.1.2",
        "title": "Reduced clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_1_3",
        "clauseNumber": "5.8.1.3",
        "title": "In-span vertical clearances between supply and communication conductors",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_8_1",
        "clauseNumber": "A.5.8.1",
        "title": "Vertical clearances at crossings of line wires and conductors supported by",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_8_1_3",
        "clauseNumber": "A.5.8.1.3",
        "title": "In-span vertical clearances between supply and communication conductors",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table14": {
    "id": "c22_3_no1_table14",
    "key": "table14",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 14",
    "title": "Minimum vertical clearances for crossings over aerial tramways",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.8.1.1",
      "5.7.9"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_7_9",
        "clauseNumber": "5.7.9",
        "title": "Clearances for other wire facilities",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_1_1",
        "clauseNumber": "5.8.1.1",
        "title": "Basic clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table15": {
    "id": "c22_3_no1_table15",
    "key": "table15",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 15",
    "title": "Clearances between conductors supported by different structures but not crossing each other — Clearance increments to be added to horizontal displacement",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.8.2",
      "A.5.8.2",
      "5.2.7",
      "Table 1"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "Communication conductors are assumed to operate at less than 130 V dc at 0.25 A or less per pair (1500 pairs or fewer)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_2",
        "clauseNumber": "5.8.2",
        "title": "Clearances between conductors supported by different structures but not",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_8_2",
        "clauseNumber": "A.5.8.2",
        "title": "Clearances between conductors supported by different structures but not",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table16": {
    "id": "c22_3_no1_table16",
    "key": "table16",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 16",
    "title": "Minimum design clearances between conductors of one line and supporting structures of another line",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.8.3.1",
      "5.8.3.2",
      "5.8.3.3",
      "5.2.7"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "Communication conductors are assumed to operate at less than 130 V dc at 0.25 A or less per pair (1500 pairs or fewer)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_3_1",
        "clauseNumber": "5.8.3.1",
        "title": "Basic clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_3_2",
        "clauseNumber": "5.8.3.2",
        "title": "Climbing space and working space",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_8_3_3",
        "clauseNumber": "5.8.3.3",
        "title": "Joint-use common structure",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table17": {
    "id": "c22_3_no1_table17",
    "key": "table17",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 17",
    "title": "Minimum horizontal separations of supply-line conductors attached to the same supporting structure",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.9.1.1",
      "5.9.1.2",
      "5.9.1.3"
    ],
    "notes": {
      "footnoteStar": "For spans longer than 450 m, the separation shall be based on best engineering practices, but shall be not less than the separations specified for spans of 450 m.",
      "footnoteDagger": "Phase-to-phase voltages for the same circuit or the sum of phase-to-ground voltages for different circuits.",
      "footnoteDblDagger": "There is no minimum separation for conductors of the same polarity in the same circuit."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_9_1_1",
        "clauseNumber": "5.9.1.1",
        "title": "5 Clearances, separations, and spacings — Clause 5.9.1.1",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_9_1_2",
        "clauseNumber": "5.9.1.2",
        "title": "5 Clearances, separations, and spacings — Clause 5.9.1.2",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_9_1_3",
        "clauseNumber": "5.9.1.3",
        "title": "5 Clearances, separations, and spacings — Clause 5.9.1.3",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table18": {
    "id": "c22_3_no1_table18",
    "key": "table18",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 18",
    "title": "Minimum vertical separations between supply-line conductors attached to the same supporting structure, ac",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.9.2.1"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "This category also includes dc.",
      "footnoteDagger": "This value does not apply to conductors on adjacent supports of the same circuit or circuits."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_9_2_1",
        "clauseNumber": "5.9.2.1",
        "title": "Minimum vertical separations between supply-line conductors attached to",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table19": {
    "id": "c22_3_no1_table19",
    "key": "table19",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 19",
    "title": "Vertical spacings between supply-line conductors of 0 to 750 V on vertical brackets",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.9.2.2"
    ],
    "notes": {
      "topConductorToCrossarmAbove": "Minimum vertical spacing between the top conductors on the vertical bracket and the centre of the nearest crossarm above shall be 600 mm."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_9_2_2",
        "clauseNumber": "5.9.2.2",
        "title": "Vertical spacings between supply-line conductors of 0 to 750 V on vertical",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table20": {
    "id": "c22_3_no1_table20",
    "key": "table20",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 20",
    "title": "Minimum in-span vertical clearances between supply conductors of the same circuit that are attached to the same supporting structure",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.9.2.3",
      "A.5.9.2.3"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_9_2_3",
        "clauseNumber": "5.9.2.3",
        "title": "In-span vertical clearances between supply-line conductors of the same",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_9_2_3",
        "clauseNumber": "A.5.9.2.3",
        "title": "In-span vertical clearances between supply-line conductors of the same",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table21": {
    "id": "c22_3_no1_table21",
    "key": "table21",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 21",
    "title": "Minimum in-span vertical clearances between supply conductors of different circuits that are attached to the same supporting structure",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.9.2.4",
      "A.5.9.2.4"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_9_2_4",
        "clauseNumber": "5.9.2.4",
        "title": "In-span vertical clearances between supply-line conductors of different",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_9_2_4",
        "clauseNumber": "A.5.9.2.4",
        "title": "In-span vertical clearances between supply-line conductors of different",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table22": {
    "id": "c22_3_no1_table22",
    "key": "table22",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 22",
    "title": "Minimum separations or clearances in any direction from supply conductors to other supply plant attached to the same supporting structure",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.9.5",
      "A.5.9.5",
      "5.2.7",
      "5.9.1"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "Clearances from connecting wires to switches or arresters may be less than that from line wires to switches or arresters.",
      "footnoteDagger": "For voltages exceeding 50 kV, clearances shall be based on best engineering practices, but shall be not less than the separations specified for 50 kV.",
      "footnoteDblDagger": "Add 10 mm/kV over 22 kV.",
      "footnoteSection": "Add 5 mm/kV over 22 kV.",
      "footnoteDblStar": "This clearance may be reduced to 0 mm for conductors and cables 0–750 V, provided that the conductors are attached to the surface of the structure and grounded or covered by material of adequate insulating and mechanical properties.",
      "footnoteDaggerDagger": "Where this clearance cannot be achieved, adequate insulation shall be applied to the supply conductor.",
      "footnoteDoubleDblDagger": "This clearance shall be increased to 300 mm for voltages 0.75–8 kV for a span wire or span guy wire running parallel to the supply conductor.",
      "footnoteDoubleSection": "The clearance shall be not less than the separations specified in Clause 5.9.1."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_2_7",
        "clauseNumber": "5.2.7",
        "title": "Wire or conductor swing for horizontal design clearances",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_9_1",
        "clauseNumber": "5.9.1",
        "title": "Horizontal separations or separations within 45° of the horizontal of",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_9_5",
        "clauseNumber": "5.9.5",
        "title": "Separations or clearances in any direction from supply conductors to other",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_9_5",
        "clauseNumber": "A.5.9.5",
        "title": "Separations or clearances in any direction from supply conductors to other",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table23": {
    "id": "c22_3_no1_table23",
    "key": "table23",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 23",
    "title": "Minimum vertical separations at a joint-use structure",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.10.1.1",
      "5.10.1.6",
      "5.10.1.7",
      "5.10.6.2",
      "A.5.10.1",
      "Figure A.6",
      "Figure A.7"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "For voltages greater than 50 kV, add 0.010 m/kV over 50 kV.",
      "footnoteDagger": "On lateral communication drop wire plant, this separation may be reduced to 0.6 m.",
      "footnoteDblDagger": "See Clause 5.2.6 for requirements for neutral conductors.",
      "footnoteSection": "Option A or Option B shall be selected in accordance with Clauses 5.10.1.6 and 5.10.1.7."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_10_1_1",
        "clauseNumber": "5.10.1.1",
        "title": "5 Clearances, separations, and spacings — Clause 5.10.1.1",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_10_1_6",
        "clauseNumber": "5.10.1.6",
        "title": "Option A of Table 23 shall be used except where the conditions of Clause 5",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_10_1_7",
        "clauseNumber": "5.10.1.7",
        "title": "5 Clearances, separations, and spacings — Clause 5.10.1.7",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_10_6_2",
        "clauseNumber": "5.10.6.2",
        "title": "5 Clearances, separations, and spacings — Clause 5.10.6.2",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_10_1",
        "clauseNumber": "A.5.10.1",
        "title": "Vertical separations at the structure — Normal level arrangement and",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_9_1_2_2",
        "clauseNumber": "A.9.1.2.2",
        "title": "Earth return systems",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_Figure_A_6",
        "clauseNumber": "Figure A.6",
        "title": "Clause Figure A.6",
        "section": "Normative Clause",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_Figure_A_7",
        "clauseNumber": "Figure A.7",
        "title": "Clause Figure A.7",
        "section": "Normative Clause",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table24": {
    "id": "c22_3_no1_table24",
    "key": "table24",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 24",
    "title": "Minimum in-span vertical clearances between supply and communication conductors",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.10.3.2",
      "5.10.3.3",
      "A.5.10.3"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "For effectively grounded neutral, see Clause 5.10.3.3.",
      "footnoteDagger": "While the use of the design limit of 75 mm can yield a minimum actual clearance of approximately 300 mm under the worst expected conditions, most situations will result in clearances in excess of 600 mm."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_10_3_2",
        "clauseNumber": "5.10.3.2",
        "title": "5 Clearances, separations, and spacings — Clause 5.10.3.2",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_10_3_3",
        "clauseNumber": "5.10.3.3",
        "title": "5 Clearances, separations, and spacings — Clause 5.10.3.3",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_10_3",
        "clauseNumber": "A.5.10.3",
        "title": "In-span vertical clearances and Table 24",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table25": {
    "id": "c22_3_no1_table25",
    "key": "table25",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 25",
    "title": "Minimum clearances from guys to plant of another system",
    "unit": "m",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.11.2.1",
      "A.5.11.2",
      "Figure A.8"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_11_2_1",
        "clauseNumber": "5.11.2.1",
        "title": "Clearances between guys and plant of another system",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_11_2",
        "clauseNumber": "A.5.11.2",
        "title": "Guys attached to joint-use structures and Tables 25 and 26",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_Figure_A_8",
        "clauseNumber": "Figure A.8",
        "title": "Clause Figure A.8",
        "section": "Normative Clause",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table26": {
    "id": "c22_3_no1_table26",
    "key": "table26",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 26",
    "title": "Minimum clearance or separation between guys and other plant attached to the joint-use structure",
    "unit": "mm",
    "evaluatedAt": null,
    "explicitRefs": [
      "5.11.2.2",
      "A.5.11.2",
      "5.11.1",
      "Figure A.8"
    ],
    "notes": {
      "note1": "Voltages are rms line-to-ground.",
      "footnoteStar": "This clearance may be reduced to 75 mm where adequate insulation is provided."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_5_11_1",
        "clauseNumber": "5.11.1",
        "title": "Guy attachments — Joint-use structures",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_5_11_2_2",
        "clauseNumber": "5.11.2.2",
        "title": "Clearances or separations between guys and other plant attached to a joint-",
        "section": "5 Clearances, separations, and spacings",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_5_11_2",
        "clauseNumber": "A.5.11.2",
        "title": "Guys attached to joint-use structures and Tables 25 and 26",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_Figure_A_8",
        "clauseNumber": "Figure A.8",
        "title": "Clause Figure A.8",
        "section": "Normative Clause",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table27": {
    "id": "c22_3_no1_table27",
    "key": "table27",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 27",
    "title": "Minimum grades of construction for crossings",
    "unit": "",
    "evaluatedAt": null,
    "explicitRefs": [
      "6.3.1",
      "6.3.2.1",
      "7.8.1.1",
      "7.8.2.1",
      "7.8.2.4",
      "7.9.1",
      "A.7.8.2",
      "A.8.1"
    ],
    "notes": {
      "footnoteStar": "The grade of construction may be Grade 2 where one of the following conditions exists:\na) the supply and communication lines have coordinated electrical protection (see Clause 4.4);\nb) where coordinated electrical protection is not practical, the supply conductors have a rated tensile strength of 12.4 kN or greater; or\nc) the supply conductors are enclosed in effectively grounded continuous metallic sheathed cable.",
      "footnoteDagger": "The communication line may be Grade 3 where the supply conductors are in effectively grounded continuous metallic sheathed cable.",
      "footnoteDblDagger": "Grade 3 construction may be used where the supply conductors at the upper level are in effectively grounded continuous metallic sheathed cable."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_6_3_1",
        "clauseNumber": "6.3.1",
        "title": "General",
        "section": "6 Minimum grades of construction",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_6_3_2_1",
        "clauseNumber": "6.3.2.1",
        "title": "6 Minimum grades of construction — Clause 6.3.2.1",
        "section": "6 Minimum grades of construction",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_1_1",
        "clauseNumber": "7.8.1.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_2_1",
        "clauseNumber": "7.8.2.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_2_4",
        "clauseNumber": "7.8.2.4",
        "title": "Assumed longitudinal load — Wire and cable attachments not involved in",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_9_1",
        "clauseNumber": "7.9.1",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.9.1",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_7_8_2",
        "clauseNumber": "A.7.8.2",
        "title": "Assumed longitudinal load — Without terminations or tension changes",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_8_1",
        "clauseNumber": "A.8.1",
        "title": "General",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table28": {
    "id": "c22_3_no1_table28",
    "key": "table28",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 28",
    "title": "Minimum grades of construction for proximities",
    "unit": "",
    "evaluatedAt": null,
    "explicitRefs": [
      "6.3.1",
      "6.3.3",
      "7.8.1.1",
      "7.8.2.1",
      "7.8.2.4",
      "7.9.1",
      "A.7.8.2",
      "A.8.1"
    ],
    "notes": {
      "footnoteStar": "The line may be Grade 2 if the supply and communications lines have coordinated electrical protection (see Clause 4.4).",
      "footnoteDagger": "Grade 3 construction may be used where the supply conductors at the upper level, or the supply conductors creating the proximity, are in effectively grounded continuous metallic sheathed cable."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_6_3_1",
        "clauseNumber": "6.3.1",
        "title": "General",
        "section": "6 Minimum grades of construction",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_6_3_3",
        "clauseNumber": "6.3.3",
        "title": "Proximities",
        "section": "6 Minimum grades of construction",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_1_1",
        "clauseNumber": "7.8.1.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_2_1",
        "clauseNumber": "7.8.2.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_2_4",
        "clauseNumber": "7.8.2.4",
        "title": "Assumed longitudinal load — Wire and cable attachments not involved in",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_9_1",
        "clauseNumber": "7.9.1",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.9.1",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_7_8_2",
        "clauseNumber": "A.7.8.2",
        "title": "Assumed longitudinal load — Without terminations or tension changes",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_8_1",
        "clauseNumber": "A.8.1",
        "title": "General",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table29": {
    "id": "c22_3_no1_table29",
    "key": "table29",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 29",
    "title": "Minimum grades of construction for joint use",
    "unit": "",
    "evaluatedAt": null,
    "explicitRefs": [
      "6.3.1",
      "6.3.4",
      "7.8.1.1",
      "7.8.2.1",
      "7.8.2.4",
      "7.9.1",
      "A.7.8.2",
      "A.8.1"
    ],
    "notes": {
      "footnoteStar": "The grade of construction may be Grade 2 where one of the following conditions exists:\na) the supply and communications lines have coordinated electrical protection (see Clause 4.4);\nb) where coordinated electrical protection is not practical, the supply conductors have a rated tensile strength of 12.4 kN or greater; or\nc) the supply conductors are enclosed in effectively grounded continuous metallic sheathed cable."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_6_3_1",
        "clauseNumber": "6.3.1",
        "title": "General",
        "section": "6 Minimum grades of construction",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_6_3_4",
        "clauseNumber": "6.3.4",
        "title": "Joint use",
        "section": "6 Minimum grades of construction",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_1_1",
        "clauseNumber": "7.8.1.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_2_1",
        "clauseNumber": "7.8.2.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_2_4",
        "clauseNumber": "7.8.2.4",
        "title": "Assumed longitudinal load — Wire and cable attachments not involved in",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_9_1",
        "clauseNumber": "7.9.1",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.9.1",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_7_8_2",
        "clauseNumber": "A.7.8.2",
        "title": "Assumed longitudinal load — Without terminations or tension changes",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_8_1",
        "clauseNumber": "A.8.1",
        "title": "General",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table30": {
    "id": "c22_3_no1_table30",
    "key": "table30",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 30",
    "title": "Deterministic weather loads",
    "unit": "",
    "evaluatedAt": null,
    "explicitRefs": [
      "7.2",
      "7.3.1",
      "7.3.5",
      "7.5.1",
      "7.6.2.1",
      "A.7.3",
      "Annex C"
    ],
    "notes": {
      "footnoteStar": "When large conductors are used in locations where high winds are prevalent, the loading on bare conductors should be assessed, as high winds can produce a transverse loading in excess of the wind and ice combinations.",
      "footnoteDagger": "On small conductors, the ice effect is more significant than on large conductors, as it constitutes a greater percentage of the total mass.",
      "footnoteDblDagger": "See Clause 7.2 and Annex C for geographic loading area boundaries across Canada.",
      "windVelocityEquivalents": "400 N/m² corresponds to ~25 m/s (~90 km/h) hourly steady-state wind; 300 N/m² corresponds to ~21 m/s (~76 km/h).",
      "iceDensity": "Ice density is assumed to be 900 kg/m³ per Clause 7.3.1(a)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_7_2",
        "clauseNumber": "7.2",
        "title": "Weather loads",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_3_1",
        "clauseNumber": "7.3.1",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.3.1",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_3_5",
        "clauseNumber": "7.3.5",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.3.5",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_5_1",
        "clauseNumber": "7.5.1",
        "title": "General",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_6_2_1",
        "clauseNumber": "7.6.2.1",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.6.2.1",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_7_3",
        "clauseNumber": "A.7.3",
        "title": "Assumed loads for wire and cable attachments",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_Annex_C",
        "clauseNumber": "Annex C",
        "title": "(informative)",
        "section": "Annex C (informative)",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_C_5",
        "clauseNumber": "C.5",
        "title": ")",
        "section": "Annex C (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_no1_table31": {
    "id": "c22_3_no1_table31",
    "key": "table31",
    "standardId": "c22_3_no1",
    "standardName": "CSA C22.3 No. 1",
    "edition": "2020",
    "number": "Table 31",
    "title": "Minimum load factors for non-linear analysis of structures",
    "unit": "",
    "evaluatedAt": null,
    "explicitRefs": [
      "7.4.2",
      "7.5.2",
      "7.6.4",
      "7.7.2",
      "7.8.1.2",
      "8.1.3",
      "8.3.10.1",
      "8.3.12.2",
      "A.7.4.2",
      "Table 32"
    ],
    "notes": {
      "note1": "Non-linear analysis, including stability (buckling) check, is the method of analysis of structures specified in this Standard.",
      "note2": "Default COV values for pole and structure materials are:\n  a) steel — ≤ 10%;\n  b) concrete — 10% < COV < 15%; and\n  c) wood — ≥ 15%.",
      "note3": "The selection of appropriate minimum load factors for steel, concrete, fibre-reinforced composite, laminated wood, and wood poles is based on the coefficient of variation (COV), for the given pole material as verified by the pole manufacturer. The lowest minimum load factors (steel pole default) may be used for concrete, laminated wood, and FRP composite structures if manufacturers verify COV ≤ 10%. The next lowest (concrete pole default) may be used if 10% < COV < 15%. The highest (wood default) shall be used if manufacturer is unable to verify COV < 15%."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_no1_cl_7_4_2",
        "clauseNumber": "7.4.2",
        "title": "7 Weather loads and assumed loads according to deterministic design — Clause 7.4.2",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_5_2",
        "clauseNumber": "7.5.2",
        "title": "Assumed vertical load on wood, concrete, and fibre-reinforced composite",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_6_4",
        "clauseNumber": "7.6.4",
        "title": "Assumed transverse load on wood, concrete, and fibre-reinforced composite",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_7_2",
        "clauseNumber": "7.7.2",
        "title": "Assumed loads at angles on wood, concrete, and fibre-reinforced composite",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_7_8_1_2",
        "clauseNumber": "7.8.1.2",
        "title": "Assumed longitudinal load for terminations or tension changes on wood,",
        "section": "7 Weather loads and assumed loads according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_8_1_3",
        "clauseNumber": "8.1.3",
        "title": "8 Strength of supporting systems according to deterministic design — Clause 8.1.3",
        "section": "8 Strength of supporting systems according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_8_3_10_1",
        "clauseNumber": "8.3.10.1",
        "title": "8 Strength of supporting systems according to deterministic design — Clause 8.3.10.1",
        "section": "8 Strength of supporting systems according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_8_3_12_2",
        "clauseNumber": "8.3.12.2",
        "title": "8 Strength of supporting systems according to deterministic design — Clause 8.3.12.2",
        "section": "8 Strength of supporting systems according to deterministic design",
        "standardId": "c22_3_no1"
      },
      {
        "clauseId": "c22_3_no1_cl_A_7_4_2",
        "clauseNumber": "A.7.4.2",
        "title": "Annex A (informative) — Clause A.7.4.2",
        "section": "Annex A (informative)",
        "standardId": "c22_3_no1"
      }
    ]
  },
  "c22_3_60826_table1": {
    "id": "c22_3_60826_table1",
    "key": "table1",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 1",
    "title": "Reliability levels for transmission lines",
    "unit": "",
    "explicitRefs": [
      "5.1.1.1",
      "5.1.1.2",
      "A.1.2",
      "Table A.2"
    ],
    "notes": {
      "note1": "Some national regulations and/or codes of practice, sometimes impose, directly or indirectly, design requirements that may restrict the choice offered to designers.",
      "note2": "Other values of T in the range of 50–500 years, such as 100, 200 and 400 years, can be used if justified by local conditions.",
      "temporaryLines": "For temporary lines, some wooden poles or lines of limited importance, return periods of about 25 years may be appropriate."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_1_1_1",
        "clauseNumber": "5.1.1.1",
        "title": "Reliability levels (weather related loads)",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_5_1_1_2",
        "clauseNumber": "5.1.1.2",
        "title": "Approximate values for yearly reliability",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_2",
        "clauseNumber": "A.1.2",
        "title": "Calculation of reliability",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table10": {
    "id": "c22_3_60826_table10",
    "key": "table10",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 10",
    "title": "Number of supports subjected to maximum load intensity during any single occurrence of a climatic event",
    "unit": "",
    "explicitRefs": [
      "7.2.1",
      "Table 11",
      "Table A.5"
    ],
    "notes": {
      "note1": "Values in brackets represent the typical range of supports based on a span of 400 m.",
      "usage": "The number of components other than supports can be directly derived from the number of supports thus selected."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_1",
        "clauseNumber": "7.2.1",
        "title": "Values of strength factor ΦΦ ΦΦ N",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table11": {
    "id": "c22_3_60826_table11",
    "key": "table11",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 11",
    "title": "Strength factor ΦN related to the number N of components or elements subjected to the critical load intensity",
    "unit": "",
    "explicitRefs": [
      "7.2.1",
      "Table 10",
      "Table A.5"
    ],
    "notes": {
      "note1": "Values of ΦN are based on a normal distribution function. Values within brackets (lognormal) are based on the log-normal distribution function.",
      "note2": "In the case of high values of vR and N (shaded cells where both normal and log-normal values are given), the value of ΦN is very sensitive to the choice of the distribution function."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_1",
        "clauseNumber": "7.2.1",
        "title": "Values of strength factor ΦΦ ΦΦ N",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_4",
        "clauseNumber": "7.3.4",
        "title": "Foundation design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_6",
        "clauseNumber": "7.3.6",
        "title": "Insulator string design criteria",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table12": {
    "id": "c22_3_60826_table12",
    "key": "table12",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 12",
    "title": "Values of ΦS2",
    "unit": "",
    "explicitRefs": [
      "7.2.2",
      "Table 13",
      "Table A.4"
    ],
    "notes": {
      "note1": "In the above table, R2 is the component designed more reliable than R1 (with 90% confidence that R2 will not fail before R1). A factor ΦS1 = 1.0 is applied to the first component to fail (R1)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_2",
        "clauseNumber": "7.2.2",
        "title": "Strength factor ΦΦ ΦΦ S related to the coordination of strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_3",
        "clauseNumber": "7.3.3",
        "title": "Support design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_4",
        "clauseNumber": "7.3.4",
        "title": "Foundation design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table13": {
    "id": "c22_3_60826_table13",
    "key": "table13",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 13",
    "title": "Typical strength coordination of line components",
    "unit": "",
    "explicitRefs": [
      "7.2.2",
      "Table 12",
      "Table 16",
      "Table A.3"
    ],
    "notes": {
      "footnoteStar": "Within each major component, the underlined component is the least reliable with 90% confidence.",
      "footnoteDoubleStar": "With the strength limits specified in Table 16, conductors are usually the most reliable component of the line.",
      "canadianDeviation": "Per Clause 7.2.2 (Canadian Deviation): Despite the prescription of a preferred sequence of failure, the line can fail in a different mode. For example, conductors can break due to overstressing caused by a collapsed tower rather than from overload. Dead-end insulators can also fail due to dynamic loads caused by adjacent tower failures."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_2",
        "clauseNumber": "7.2.2",
        "title": "Strength factor ΦΦ ΦΦ S related to the coordination of strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table14": {
    "id": "c22_3_60826_table14",
    "key": "table14",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 14",
    "title": "Damage and failure limits of supports",
    "unit": "",
    "explicitRefs": [
      "7.3.1",
      "Table 3",
      "Table 15",
      "Table 16",
      "Table 17"
    ],
    "notes": {
      "note1": "The deformation of compression elements is the maximum deflection from the line joining end points. For elements subjected to moments, it is the displacement of the free end from the vertical.",
      "note2": "l is the free length of the element.",
      "note3": "The width of crack for concrete poles to be agreed upon."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_1",
        "clauseNumber": "7.3.1",
        "title": "Limit states for line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table15": {
    "id": "c22_3_60826_table15",
    "key": "table15",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 15",
    "title": "Damage and failure limits of foundations",
    "unit": "",
    "explicitRefs": [
      "7.3.1",
      "7.3.4",
      "Table 14"
    ],
    "notes": {
      "note1": "Takes into account the interaction between the support and its foundation.",
      "note2": "A determinate movement is one that does not induce internal efforts in the structure. For example the displacement of one foundation of a three-legged support is a determinate movement, while the displacement of a four-legged support is an indeterminate movement.",
      "note3": "Y is the horizontal distance between foundations.",
      "note4": "Some rigid foundations (e.g. pile) may require lower limits."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_1",
        "clauseNumber": "7.3.1",
        "title": "Limit states for line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_4",
        "clauseNumber": "7.3.4",
        "title": "Foundation design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table16": {
    "id": "c22_3_60826_table16",
    "key": "table16",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 16",
    "title": "Damage and failure limits of conductors and ground wires",
    "unit": "",
    "explicitRefs": [
      "7.3.1",
      "7.3.5",
      "Table 13"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_2",
        "clauseNumber": "7.2.2",
        "title": "Strength factor ΦΦ ΦΦ S related to the coordination of strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_1",
        "clauseNumber": "7.3.1",
        "title": "Limit states for line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_5",
        "clauseNumber": "7.3.5",
        "title": "Conductor and ground wire design criteria",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table17": {
    "id": "c22_3_60826_table17",
    "key": "table17",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 17",
    "title": "Damage and failure limit of interface components",
    "unit": "",
    "explicitRefs": [
      "7.3.1",
      "7.3.6"
    ],
    "notes": {
      "note1": "Normally, fittings are designed in a manner to reduce or eliminate wear. Should wear be expected because of point-to-point contact, it should be considered in the design. In such case, the damage limit becomes \"exceeding the expected wear\".",
      "note2": "The critical permanent deformation is defined as the state where the fittings cannot be easily taken apart."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_1",
        "clauseNumber": "7.3.1",
        "title": "Limit states for line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_6",
        "clauseNumber": "7.3.6",
        "title": "Insulator string design criteria",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table18": {
    "id": "c22_3_60826_table18",
    "key": "table18",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 18",
    "title": "Default values for strength coefficients of variation (COV)",
    "unit": "",
    "explicitRefs": [
      "7.3.2",
      "Table 11",
      "Table 12",
      "Table 19"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_2",
        "clauseNumber": "7.3.2",
        "title": "Strength data of line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_4",
        "clauseNumber": "7.3.4",
        "title": "Foundation design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table19": {
    "id": "c22_3_60826_table19",
    "key": "table19",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 19",
    "title": "u factors for log-normal distribution function for e = 10%",
    "unit": "",
    "explicitRefs": [
      "7.3.2",
      "Table 18"
    ],
    "notes": {
      "formula": "Rc = (10%)R = (1 – u × vR) × R_mean; if R is assumed normally distributed, u = 1.28, or given in Table 19 for log-normal distribution function."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_2",
        "clauseNumber": "7.3.2",
        "title": "Strength data of line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table2": {
    "id": "c22_3_60826_table2",
    "key": "table2",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 2",
    "title": "Default γT factors for adjustment of climatic loads in relation to return period T vs. 50 years",
    "unit": "",
    "explicitRefs": [
      "5.2.1",
      "Table CA.2"
    ],
    "notes": {
      "note1": "The above γ values are sufficiently accurate for a COV of up to 0.16 for wind speed, 0.30 for ice thickness and 0.65 for unit ice weight and are derived from the Gumbel distribution function.",
      "canadianDeviationNote": "In Canada, Clause 5.2.1 adds Table CA.2 (which provides γTw and γTi for T = 25, 50, 100, 150, 200, 400, and 500 years). See tableCA2.js."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_1",
        "clauseNumber": "5.2.1",
        "title": "Limit load",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table20": {
    "id": "c22_3_60826_table20",
    "key": "table20",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 20",
    "title": "Value of quality factor ΦQ for lattice towers",
    "unit": "",
    "explicitRefs": [
      "7.3.3",
      "IEC 60652"
    ],
    "notes": {
      "canadianSimplifiedPhiR": "Per Clause 7.3.3 (Canadian Deviation): The following default (simplified) values may be used for lattice steel towers in the majority of lines: (a) suspension towers: ΦR = 0.9 for intact loading cases and ΦR = 1.0 for failure loading cases; and (b) angle and dead-end towers: intact ΦR = 0.8 and failed system ΦR = 0.9, where ΦR = ΦN ΦS ΦQ ΦC."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_3",
        "clauseNumber": "7.3.3",
        "title": "Support design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_IEC_60652",
        "clauseNumber": "IEC 60652",
        "title": "Clause IEC 60652",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table3": {
    "id": "c22_3_60826_table3",
    "key": "table3",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 3",
    "title": "Design requirements for the system",
    "unit": "",
    "explicitRefs": [
      "5.2.2",
      "6.2",
      "6.3",
      "6.4",
      "6.5",
      "6.6",
      "7.1",
      "7.2"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_2",
        "clauseNumber": "5.2.2",
        "title": "Design requirements for the system",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_2",
        "clauseNumber": "6.2",
        "title": "Climatic loads, wind and associated temperatures",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_3",
        "clauseNumber": "6.3",
        "title": "Climatic loads, ice without wind",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4",
        "clauseNumber": "6.4",
        "title": "Climatic loads, combined wind and ice loadings",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_5",
        "clauseNumber": "6.5",
        "title": "Loads for construction and maintenance (safety loads)",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_6",
        "clauseNumber": "6.6",
        "title": "Loads for failure containment (security requirements)",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_1",
        "clauseNumber": "7.1",
        "title": "Generalities",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_2",
        "clauseNumber": "7.2",
        "title": "General equations for the strength of components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table4": {
    "id": "c22_3_60826_table4",
    "key": "table4",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 4",
    "title": "Classification of terrain categories",
    "unit": "",
    "explicitRefs": [
      "6.2.2",
      "6.2.3",
      "A.4",
      "Table A.7",
      "Table A.8"
    ],
    "notes": {
      "usage": "In Table 4, the roughness factor KR represents a multiplier of the reference wind speed for conversion from one terrain category to another (VR = KR × VRB).",
      "canadianDeviation": "Per Clause 6.2.2 (Canadian Deviation): Terrain type B is representative of the majority of lines and should lead to acceptable results in all areas except in flat coastal areas, where a terrain type A should be used."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_2_2",
        "clauseNumber": "6.2.2",
        "title": "Terrain roughness",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_2_3",
        "clauseNumber": "6.2.3",
        "title": "Reference wind speed RV",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_2_5",
        "clauseNumber": "6.2.5",
        "title": "Unit action of the wind speed on any line component or element",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4",
        "clauseNumber": "A.4",
        "title": "Determination of the meteorological reference wind speed",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table5": {
    "id": "c22_3_60826_table5",
    "key": "table5",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 5",
    "title": "Correction factor τ of dynamic reference wind pressure q0 due to altitude and temperatures",
    "unit": "",
    "explicitRefs": [
      "6.2.5",
      "6.4.6.1",
      "Table CB.1"
    ],
    "notes": {
      "note1": "The reference value (τ = 1.00) corresponds to 0 m altitude and a temperature of 15 °C (air density μ = 1.225 kg/m³ at 101.3 kPa).",
      "canadianDeviation": "Per Clause 6.2.5 (Canadian Deviation): The air density correction factor shall be 1.04 for wind conditions without ice and 1.1 for combined ice and wind. These factors may also be used for mountainous regions because the reduced temperature compensates for the altitude."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_2_5",
        "clauseNumber": "6.2.5",
        "title": "Unit action of the wind speed on any line component or element",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4_6_1",
        "clauseNumber": "6.4.6.1",
        "title": "Unit action of the wind on the ice-covered conductors",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4_5_3",
        "clauseNumber": "A.4.5.3",
        "title": "Unit-action of the wind on any element of the line and dynamic reference",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table6": {
    "id": "c22_3_60826_table6",
    "key": "table6",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 6",
    "title": "Non-uniform ice loading conditions",
    "unit": "",
    "explicitRefs": [
      "6.3.6.3",
      "6.3.6.3.1A",
      "6.3.6.3.1B",
      "Figure 12"
    ],
    "notes": {
      "note1": "In this table, the uppercase letters A, B, C, D, E, F (phase conductors) and X, Y (ground wires) represent conductors and spans loaded with 0.7 gR, while the lowercase letters a, b, c, d, e, f, x, y represent conductors and spans loaded with 0.4 × 0.7 gR (= 0.28 gR). Factors 0.7 and 0.4 are suggested and other values can be used as substantiated by experience.",
      "canadianDeviation": "Per Clauses 6.3.6.3.1A and 6.3.6.3.1B (Canadian Deviation): Non-uniform ice loading examples where the structure is subjected to 70% of the design ice weight on the left or right spans while the other spans are loaded with 28% (40% of 70%) of the same design ice weight are illustrated in Figure 12 and Table 6. The unbalanced ice loading cases shall be calculated under: (a) temperature of –5 °C; (b) no wind; and (c) conductor in the final condition (after creep)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_3_6_3",
        "clauseNumber": "6.3.6.3",
        "title": "Non-uniform ice formation on phase conductors and ground wires",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_3_6_3_1A",
        "clauseNumber": "6.3.6.3.1A",
        "title": "Clause 6.3.6.3.1A",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_3_6_3_1B",
        "clauseNumber": "6.3.6.3.1B",
        "title": "Clause 6.3.6.3.1B",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_Figure_12",
        "clauseNumber": "Figure 12",
        "title": "Clause Figure 12",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table7": {
    "id": "c22_3_60826_table7",
    "key": "table7",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 7",
    "title": "Return period of combined ice and wind load",
    "unit": "",
    "explicitRefs": [
      "6.4.1",
      "6.4.2",
      "6.4.3",
      "6.4.4",
      "Table A.13"
    ],
    "notes": {
      "principle": "A low probability (index L, return period T) value of one variable is combined with high probability (index H, average of yearly maximum values) of the remaining variables.",
      "combinations": "Two loading combinations are considered: Condition 1 (Low ice probability gL with average yearly wind during icing VIH) and Condition 2 (Low probability wind during icing VIL with average yearly maximum icing gH)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_4_1",
        "clauseNumber": "6.4.1",
        "title": "Combined probabilities – Principle proposed",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4_2",
        "clauseNumber": "6.4.2",
        "title": "Determination of ice load",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4_3",
        "clauseNumber": "6.4.3",
        "title": "Determination of coincident temperature",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4_4",
        "clauseNumber": "6.4.4",
        "title": "Determination of wind speed associated with icing conditions",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table8": {
    "id": "c22_3_60826_table8",
    "key": "table8",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 8",
    "title": "Drag coefficients of ice-covered conductors",
    "unit": "",
    "explicitRefs": [
      "6.4.5",
      "6.4.6.1",
      "Figure 13",
      "Table A.14"
    ],
    "notes": {
      "note1": "The uniform thickness of ice around the conductor corresponds to the minimum overall diameter, i.e. the most compact projected area.",
      "note2": "It is assumed that the value of Ci is the same for the ice coverings related to T = 50, 150, 500 years."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_4_5",
        "clauseNumber": "6.4.5",
        "title": "Drag coefficients of ice-covered conductors",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4_6_1",
        "clauseNumber": "6.4.6.1",
        "title": "Unit action of the wind on the ice-covered conductors",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_Figure_13",
        "clauseNumber": "Figure 13",
        "title": "Clause Figure 13",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_table9": {
    "id": "c22_3_60826_table9",
    "key": "table9",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table 9",
    "title": "Additional security measures",
    "unit": "",
    "explicitRefs": [
      "6.6.2",
      "6.6.3.1",
      "6.6.3.3"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_6_2",
        "clauseNumber": "6.6.2",
        "title": "Security requirements",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_6_3_1",
        "clauseNumber": "6.6.3.1",
        "title": "Torsional load",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_6_3_3",
        "clauseNumber": "6.6.3.3",
        "title": "Additional security measures",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA1": {
    "id": "c22_3_60826_tableA1",
    "key": "tableA1",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.1",
    "title": "Yearly reliability corresponding to various assumptions of load and strength",
    "unit": "",
    "explicitRefs": [
      "5.1.1.2",
      "A.1.2.1",
      "Table A.2"
    ],
    "notes": {
      "exclusionLimit": "The yearly reliabilities given in Table A.1 apply for design with an exclusion limit of 10% (ue = 1.28 for normal distribution)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_1_1_2",
        "clauseNumber": "5.1.1.2",
        "title": "Approximate values for yearly reliability",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_2_1",
        "clauseNumber": "A.1.2.1",
        "title": "General",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_2",
        "clauseNumber": "A.2",
        "title": "c).",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA10": {
    "id": "c22_3_60826_tableA10",
    "key": "tableA10",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.10",
    "title": "Physical properties of ice",
    "unit": "",
    "explicitRefs": [
      "6.3",
      "6.4.5",
      "A.5.4",
      "Table 8",
      "Table A.11",
      "Table A.14"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_3",
        "clauseNumber": "6.3",
        "title": "Climatic loads, ice without wind",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_3_2",
        "clauseNumber": "6.3.2",
        "title": "Ice data",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_4_5",
        "clauseNumber": "6.4.5",
        "title": "Drag coefficients of ice-covered conductors",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_5_4",
        "clauseNumber": "A.5.4",
        "title": "Physical properties of ice",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA11": {
    "id": "c22_3_60826_tableA11",
    "key": "tableA11",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.11",
    "title": "Meteorological parameters controlling ice accretion",
    "unit": "",
    "explicitRefs": [
      "A.5.4",
      "A.5.5",
      "Figure A.9",
      "Table A.10"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_A_5_4",
        "clauseNumber": "A.5.4",
        "title": "Physical properties of ice",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_5_5",
        "clauseNumber": "A.5.5",
        "title": "Meteorological parameters controlling ice accretion",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_Figure_A_9",
        "clauseNumber": "Figure A.9",
        "title": "Clause Figure A.9",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA12": {
    "id": "c22_3_60826_tableA12",
    "key": "tableA12",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.12",
    "title": "Statistical parameters of ice loads",
    "unit": "",
    "explicitRefs": [
      "6.3.4",
      "A.5.8.1"
    ],
    "notes": {
      "noStatisticalDataFallback": "If only the maximum value gmax of ice load during a certain number of years is available (no statistical data), the mean value g_mean should be taken as 0.45 gmax and standard deviation σg as 0.5 g_mean."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_3_4",
        "clauseNumber": "6.3.4",
        "title": "Reference limit ice load",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_5_8_1",
        "clauseNumber": "A.5.8.1",
        "title": "Evaluation of information on ice loads",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA13": {
    "id": "c22_3_60826_tableA13",
    "key": "tableA13",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.13",
    "title": "Combined wind and ice loading conditions",
    "unit": "",
    "explicitRefs": [
      "6.4.1",
      "A.6.1",
      "Table 7",
      "Table A.14"
    ],
    "notes": {
      "indexDefinitions": "The high probability (index H) is considered to be the average of extreme yearly values, while the low probability (index L) of the variable is the one corresponding to a return period T."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_4_1",
        "clauseNumber": "6.4.1",
        "title": "Combined probabilities – Principle proposed",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_6_1",
        "clauseNumber": "A.6.1",
        "title": "Combined probabilities",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA14": {
    "id": "c22_3_60826_tableA14",
    "key": "tableA14",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.14",
    "title": "Drag coefficients and density of ice-covered conductors",
    "unit": "",
    "explicitRefs": [
      "6.4.5",
      "A.6.2",
      "Table 8",
      "Table A.13"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_4_5",
        "clauseNumber": "6.4.5",
        "title": "Drag coefficients of ice-covered conductors",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_6_2",
        "clauseNumber": "A.6.2",
        "title": "Drag coefficients of ice-covered conductors",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA2": {
    "id": "c22_3_60826_tableA2",
    "key": "tableA2",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.2",
    "title": "Relationship between reliability levels and return periods of limit loads",
    "unit": "",
    "explicitRefs": [
      "5.1.1",
      "A.1.2.4",
      "A.1.2.5",
      "Table 1"
    ],
    "notes": {
      "lifeCycleFormula": "PsN = (Ps1)^N = (1 - Pf1)^N and PfN = 1 - PsN for a life cycle of N = 50 years."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_1_1",
        "clauseNumber": "5.1.1",
        "title": "Reliability requirements",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_2_4",
        "clauseNumber": "A.1.2.4",
        "title": "Reliability levels and associated failure probabilities",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_2_5",
        "clauseNumber": "A.1.2.5",
        "title": "Selection of reliability levels",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA3": {
    "id": "c22_3_60826_tableA3",
    "key": "tableA3",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.3",
    "title": "Typical strength coordination",
    "unit": "",
    "explicitRefs": [
      "7.2.2",
      "A.1.3.1",
      "A.1.3.2",
      "Table 13"
    ],
    "notes": {
      "footnoteStar": "Within each major component the underlined component is the weakest with 90% confidence."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_2",
        "clauseNumber": "7.2.2",
        "title": "Strength factor ΦΦ ΦΦ S related to the coordination of strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_3_1",
        "clauseNumber": "A.1.3.1",
        "title": "General basis for strength coordination",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_3_2",
        "clauseNumber": "A.1.3.2",
        "title": "Methods for calculating strength coordination factors ΦΦ ΦΦ S",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA4": {
    "id": "c22_3_60826_tableA4",
    "key": "tableA4",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.4",
    "title": "Values of central safety factor α and strength coordination factor ΦS required to insure that component R2 will fail after component R1 with a 90% probability",
    "unit": "",
    "explicitRefs": [
      "7.2.2",
      "A.1.3.4",
      "Table 12"
    ],
    "notes": {
      "formula": "ΦS = (10%)R1 / (10%)R2 = (1 - 1.28 vR1) / [α (1 - 1.28 vR2)], where α = R2_mean / R1_mean."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_2",
        "clauseNumber": "7.2.2",
        "title": "Strength factor ΦΦ ΦΦ S related to the coordination of strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_3_4",
        "clauseNumber": "A.1.3.4",
        "title": "Design for a target confidence level in the strength coordination",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA5": {
    "id": "c22_3_60826_tableA5",
    "key": "tableA5",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.5",
    "title": "Strength factor ΦN related to N components in series subjected to the critical load",
    "unit": "",
    "explicitRefs": [
      "7.2.1",
      "A.1.3.5",
      "Table 10",
      "Table 11"
    ],
    "notes": {
      "note1": "Values in parentheses refer to log-normal distribution; primary values refer to normal (Gaussian) distribution.",
      "note2": "The range of values where the difference in ΦN between normal and log-normal is more than 10% is shown in italic characters in the standard."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_2_1",
        "clauseNumber": "7.2.1",
        "title": "Values of strength factor ΦΦ ΦΦ N",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_3_5",
        "clauseNumber": "A.1.3.5",
        "title": "Number of components subjected to maximum load intensity",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA6": {
    "id": "c22_3_60826_tableA6",
    "key": "tableA6",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.6",
    "title": "Values of ue associated to exclusion limits",
    "unit": "",
    "explicitRefs": [
      "7.3.2",
      "7.3.3",
      "A.2.1"
    ],
    "notes": {
      "formula": "Φc = (1 - 1.28 vR) / (1 - ue vR), where (10%)R = Φc × Rc and Rc = R_mean (1 - ue vR)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_7_3_2",
        "clauseNumber": "7.3.2",
        "title": "Strength data of line components",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_7_3_3",
        "clauseNumber": "7.3.3",
        "title": "Support design strength",
        "section": "7 Strength of components and limit states",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_2_1",
        "clauseNumber": "A.2.1",
        "title": "Calculation of characteristic strength",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA7": {
    "id": "c22_3_60826_tableA7",
    "key": "tableA7",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.7",
    "title": "Definition of terrain category",
    "unit": "",
    "explicitRefs": [
      "6.2.2",
      "A.4.1",
      "Table 4",
      "Table A.8"
    ],
    "notes": {
      "topographyGuidance": "For a line that follows the ridge of a hill, a terrain roughness which is smoother by one category than the one chosen for the area should be selected in order to be conservative. For a line running along a valley, the C roughness should be chosen for all cases, whatever the terrain characteristics may be."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_2_2",
        "clauseNumber": "6.2.2",
        "title": "Terrain roughness",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4_1",
        "clauseNumber": "A.4.1",
        "title": "Roughness of terrain",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4_2",
        "clauseNumber": "A.4.2",
        "title": "Assessment of meteorological measurements",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA8": {
    "id": "c22_3_60826_tableA8",
    "key": "tableA8",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.8",
    "title": "Factors describing wind action depending on terrain category",
    "unit": "",
    "explicitRefs": [
      "6.2.2",
      "6.2.3",
      "A.4.2",
      "Table 4",
      "Table A.7"
    ],
    "notes": {
      "powerLawFormula": "Vz = VR × (z / 10)^α, where z is height above ground (m) and α is the power law exponent in Table A.8."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_2_2",
        "clauseNumber": "6.2.2",
        "title": "Terrain roughness",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_2_3",
        "clauseNumber": "6.2.3",
        "title": ".",
        "section": "2 years (seasons) are in most cases sufficient.",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4_2",
        "clauseNumber": "A.4.2",
        "title": "Assessment of meteorological measurements",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4_5_2",
        "clauseNumber": "A.4.5.2",
        "title": "Reference wind speed for design",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableA9": {
    "id": "c22_3_60826_tableA9",
    "key": "tableA9",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table A.9",
    "title": "Values of reference wind speed VR (ratio VR / mV)",
    "unit": "",
    "explicitRefs": [
      "A.4.5.2",
      "B.2",
      "Table B.1"
    ],
    "notes": {
      "note1": "In Table A.9 the ratio VR / mV (where mV is the mean of yearly maximum wind velocities) is given for typical coefficients of variation vv when the number of years of observations is very large (n -> ∞). In other cases, refer to Clause B.2 / Table B.1."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_A_4_5_2",
        "clauseNumber": "A.4.5.2",
        "title": "Reference wind speed for design",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_2",
        "clauseNumber": "B.2",
        "title": "Climatic loads",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableB1": {
    "id": "c22_3_60826_tableB1",
    "key": "tableB1",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table B.1",
    "title": "Ratios of x / x_mean for a Gumbel distribution function, T return period in years of loading event, n number of years with observations, vx coefficient of variation",
    "unit": "",
    "explicitRefs": [
      "5.2.1",
      "A.4.5.2",
      "B.2.1",
      "Table 2",
      "Table A.9",
      "Table C.1"
    ],
    "notes": {
      "formula": "x(T) / x_mean = 1 + [(-ln(-ln(1 - 1/T)) - C2) / C1] × vx, where C1 and C2 are Gumbel sample size parameters from Table C.1."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_1",
        "clauseNumber": "5.2.1",
        "title": "Limit load",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_3_3",
        "clauseNumber": "A.1.3.3",
        "title": "Use of different exclusion limits",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_4_5_2",
        "clauseNumber": "A.4.5.2",
        "title": "Reference wind speed for design",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_2_1",
        "clauseNumber": "B.2.1",
        "title": "Wind velocities and wind loads",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_4_2_1",
        "clauseNumber": "B.4.2.1",
        "title": "Calculation of use factor coefficient by statistics and simulation",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableB2": {
    "id": "c22_3_60826_tableB2",
    "key": "tableB2",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table B.2",
    "title": "Parameters of Weibull distribution",
    "unit": "",
    "explicitRefs": [
      "B.3",
      "C.5",
      "Figure B.5"
    ],
    "notes": {
      "footnoteA": "Rsp is the specified strength which is equal to the threshold p1 (= 1)."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_B_3",
        "clauseNumber": "B.3",
        "title": "Strength of components",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_3_1",
        "clauseNumber": "B.3.1",
        "title": "Lattice supports",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_C_5",
        "clauseNumber": "C.5",
        "title": "Weibull distribution",
        "section": "Annex C (Conductor Properties)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_Figure_B_5",
        "clauseNumber": "Figure B.5",
        "title": "Clause Figure B.5",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableB3": {
    "id": "c22_3_60826_tableB3",
    "key": "tableB3",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table B.3",
    "title": "Statistical parameters U_mean and σu of wind span variation",
    "unit": "",
    "explicitRefs": [
      "5.2.3",
      "B.4.1",
      "Table B.4",
      "Table B.5",
      "Table B.6"
    ],
    "notes": {
      "bounds": "In Tables B.3 and B.4 the lower bound of the use factor is assumed to be 0.4 and the upper bound is 1.0.",
      "terrainCodes": "a = flat; b = rolling, hilly; c = mountainous.",
      "constraintCodes": "1 = no special constraints; 2 = constraints on support locations."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_3",
        "clauseNumber": "5.2.3",
        "title": "Design equation for each component",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_4_1",
        "clauseNumber": "B.4.1",
        "title": "General",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableB4": {
    "id": "c22_3_60826_tableB4",
    "key": "tableB4",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table B.4",
    "title": "Statistical parameters U_mean and σu of weight span variation",
    "unit": "",
    "explicitRefs": [
      "5.2.3",
      "B.4.1",
      "Table B.3",
      "Table B.5",
      "Table B.6"
    ],
    "notes": {
      "bounds": "In Tables B.3 and B.4 the lower bound of the use factor is assumed to be 0.4 and the upper bound is 1.0.",
      "terrainCodes": "a = flat; b = rolling, hilly; c = mountainous.",
      "constraintCodes": "1 = no special constraints; 2 = constraints on support locations."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_3",
        "clauseNumber": "5.2.3",
        "title": "Design equation for each component",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_4_1",
        "clauseNumber": "B.4.1",
        "title": "General",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableB5": {
    "id": "c22_3_60826_tableB5",
    "key": "tableB5",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table B.5",
    "title": "Values of use factor coefficient γu as a function of U_mean and N for vR = 0.10",
    "unit": "",
    "explicitRefs": [
      "5.2.3",
      "B.4.3",
      "Table B.6"
    ],
    "notes": {
      "formula": "γu = (10%)min_N(R) / (10%)min_N(R/U). Obtained by Monte-Carlo simulation for vR = 0.10."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_3",
        "clauseNumber": "5.2.3",
        "title": "Design equation for each component",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_A_1_3_3",
        "clauseNumber": "A.1.3.3",
        "title": "Use of different exclusion limits",
        "section": "Annex A (Climatic Data)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_4_3",
        "clauseNumber": "B.4.3",
        "title": "Effect of number of supports on use factor coefficients",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_4_4",
        "clauseNumber": "B.4.4",
        "title": "Generalized results for use factor coefficients γγ γγu",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableB6": {
    "id": "c22_3_60826_tableB6",
    "key": "tableB6",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table B.6",
    "title": "Use factor coefficient γu for different strength coefficients of variation",
    "unit": "",
    "explicitRefs": [
      "5.2.3",
      "B.4.4",
      "Table B.3",
      "Table B.4",
      "Table B.5"
    ],
    "notes": null,
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_3",
        "clauseNumber": "5.2.3",
        "title": "Design equation for each component",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_B_4_4",
        "clauseNumber": "B.4.4",
        "title": "Generalized results for use factor coefficients γγ γγu",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableC1": {
    "id": "c22_3_60826_tableC1",
    "key": "tableC1",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table C.1",
    "title": "Parameters C1 and C2 of Gumbel distribution",
    "unit": "",
    "explicitRefs": [
      "B.2.1",
      "C.4",
      "Table B.1",
      "Figure C.3"
    ],
    "notes": {
      "asymptoticValues": "For n = ∞, C1 = π / sqrt(6) ≈ 1.28255 and C2 = γ_Euler ≈ 0.57722."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_B_2_1",
        "clauseNumber": "B.2.1",
        "title": "Wind velocities and wind loads",
        "section": "Annex B (Soil & Foundations)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_C_4",
        "clauseNumber": "C.4",
        "title": "Gumbel distribution",
        "section": "Annex C (Conductor Properties)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_C_4_2",
        "clauseNumber": "C.4.2",
        "title": "Standardized format",
        "section": "Annex C (Conductor Properties)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_Figure_C_3",
        "clauseNumber": "Figure C.3",
        "title": "Clause Figure C.3",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableC2": {
    "id": "c22_3_60826_tableC2",
    "key": "tableC2",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table C.2",
    "title": "Values of u1 for given values of function F(u1) = I(u1, p3 - 1)",
    "unit": "",
    "explicitRefs": [
      "C.6",
      "Figure C.5"
    ],
    "notes": {
      "structure": "Upper sub-table gives u1 for upper tail return periods T = 50 (FT = 0.98), 150 (FT = 0.993), and 500 (FT = 0.998) for shape parameter p3 in [0.05, 1.00]. Lower sub-table gives u1 for lower tail exclusion limits e = 2% (Fe = 0.02), 5% (Fe = 0.05), and 10% (Fe = 0.10) for shape parameter p3 in [1.0, 3.0]."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_C_6",
        "clauseNumber": "C.6",
        "title": "Gamma distribution",
        "section": "Annex C (Conductor Properties)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_C_6_2",
        "clauseNumber": "C.6.2",
        "title": "Standardized format",
        "section": "Annex C (Conductor Properties)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_C_8",
        "clauseNumber": "C.8",
        "title": "Gamma function and its relationships",
        "section": "Annex C (Conductor Properties)",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_Figure_C_5",
        "clauseNumber": "Figure C.5",
        "title": "Clause Figure C.5",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableCA1": {
    "id": "c22_3_60826_tableCA1",
    "key": "tableCA1",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table CA.1",
    "title": "Weather data",
    "unit": "",
    "explicitRefs": [
      "6.2.4",
      "6.3.4.1",
      "CA.1",
      "CA.2",
      "CA.3",
      "CA.4",
      "Table CA.2"
    ],
    "notes": {
      "footnoteStar": "The following are lowest January hourly temperatures to a 1% exclusion level. (One per cent of January hourly temperatures are at or lower than these values.)",
      "footnoteDagger": "10 minute average speed, 50-year return period.",
      "footnoteDblDagger": "Ice thickness from freezing precipitation, 50-year return period.",
      "footnoteSection": "Wet snow thickness on a 40 mm conductor, 50-year return period is provided for regions where data were available at the time this Standard was prepared. The recommended coincident temperature is –5 °C. The corresponding density of the accreted snow is 350 kg/m³."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_6_2_4",
        "clauseNumber": "6.2.4",
        "title": "Combination of wind speed and temperatures",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_3_4_1",
        "clauseNumber": "6.3.4.1",
        "title": "Based on statistical data",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CA_1",
        "clauseNumber": "CA.1",
        "title": "Clause CA.1",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CA_2",
        "clauseNumber": "CA.2",
        "title": "Clause CA.2",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CA_3",
        "clauseNumber": "CA.3",
        "title": "Clause CA.3",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CA_4",
        "clauseNumber": "CA.4",
        "title": "Clause CA.4",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableCA2": {
    "id": "c22_3_60826_tableCA2",
    "key": "tableCA2",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table CA.2",
    "title": "Factors γT to modify the 50-year return period weather variable to any other return period T",
    "unit": "",
    "explicitRefs": [
      "5.2.1",
      "6.3.4.1",
      "Table CB.1",
      "Table 2"
    ],
    "notes": {
      "note1": "γTw applies to wind speed and γTi applies to ice thickness.",
      "interpolationRule": "Per Clause 5.2.1 (Canadian Deviation): If return periods other than those given in Table CA.2 are used, the corresponding weather variables may be deduced by direct interpolation between the values specified in Table CA.2."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_5_2_1",
        "clauseNumber": "5.2.1",
        "title": "Limit load",
        "section": "5 General design criteria",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_6_3_4_1",
        "clauseNumber": "6.3.4.1",
        "title": "Based on statistical data",
        "section": "6 Loadings",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableCB1": {
    "id": "c22_3_60826_tableCB1",
    "key": "tableCB1",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table CB.1",
    "title": "Default values for distribution lines and structures",
    "unit": "",
    "explicitRefs": [
      "CB.1",
      "CB.2",
      "Table CA.2"
    ],
    "notes": {
      "footnoteStar": "The adjustment factor of 1.5 mentioned in this Standard includes a height factor of 1.15 for typical transmission conductors. Since distribution conductors are at a height of about 10 m, the factor of 1.15 should not be used; therefore, the applicable spatial factor for icing thickness on distribution lines should be: 1.5/1.15 = 1.3.",
      "footnoteDagger": "Refer to IEC Figure 3 (referenced as Table 3 in footnote) for a conductor height of 10 m and terrain type B.",
      "footnoteDblDagger": "Refer to IEC Figure 4 (referenced as Table 4 in footnote) for spans less than 200 m.",
      "footnoteSection": "Wind is always considered perpendicular to spans.",
      "footnoteDoubleStar": "Typical of Canadian conditions during persistence of ice on conductors, particularly after icing storms.",
      "footnoteDoubleDagger": "Reflects increase in air density for colder temperatures since high winds in Canada occur during colder seasons. In this Standard, the air density correction factor for wind only is 1.04 and 1.1 for wind and ice combinations. For the purpose of simplifying calculations for distribution lines, a single default air density correction factor of 1.1 may be used for all wind-related loads.",
      "footnoteTripleDagger": "Considered the same as for conductors.",
      "footnoteDoubleSection": "This value could be reduced to 25 years. In that case, the wind speed and ice thickness in the weather maps would be adjusted by the factors specified in Table CA.2."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_CB_1",
        "clauseNumber": "CB.1",
        "title": "Clause CB.1",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_2",
        "clauseNumber": "CB.2",
        "title": "Clause CB.2",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableCB2": {
    "id": "c22_3_60826_tableCB2",
    "key": "tableCB2",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table CB.2",
    "title": "Conductor loads per pole (N)",
    "unit": "N",
    "explicitRefs": [
      "CB.3.1",
      "CB.3.2",
      "CB.3.3",
      "CB.3.4",
      "CB.3.5",
      "CB.3.7",
      "Table CB.3"
    ],
    "notes": {
      "sampleInputs": "3-phase circuit in Ottawa, 50-year return period, conductor diameter 22 mm, span 80 m, conductor unit weight 11 N/m, V50 = 90 km/h, point radial ice t50 = 30 mm (design ice = 39 mm). Values in Table CB.2 are total for 3 conductors per pole."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_CB_3_1",
        "clauseNumber": "CB.3.1",
        "title": "Clause CB.3.1",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_3_2",
        "clauseNumber": "CB.3.2",
        "title": "Clause CB.3.2",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_3_3",
        "clauseNumber": "CB.3.3",
        "title": "Clause CB.3.3",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_3_4",
        "clauseNumber": "CB.3.4",
        "title": "Clause CB.3.4",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_3_5",
        "clauseNumber": "CB.3.5",
        "title": "Clause CB.3.5",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_3_7",
        "clauseNumber": "CB.3.7",
        "title": "Clause CB.3.7",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "c22_3_60826_tableCB3": {
    "id": "c22_3_60826_tableCB3",
    "key": "tableCB3",
    "standardId": "c22_3_60826",
    "standardName": "CSA C22.3 No. 60826",
    "edition": "2010 (R2020)",
    "number": "Table CB.3",
    "title": "Fibre stress calculation for pole selection",
    "unit": "",
    "explicitRefs": [
      "CB.3.6",
      "CB.3.7",
      "Table CB.2"
    ],
    "notes": {
      "commentary": "Table CB.3 indicates that the maximum ground line stress for Pole DF-5-40 is 43.7 MPa, slightly less than the value of 44.4 MPa derived in Clause CB.3.6. However, additional verification using commercially available software confirmed that the pole section about 2 m above ground has a fibre stress of 46.04 MPa, which exceeds the design value of 44.4 MPa; thus class 5 pole is not suitable for this project. In the case of class 4 pole, the calculated fibre stress is 32.2 MPa < 44.4 MPa; thus it constitutes a suitable solution for this project."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "c22_3_60826_cl_CB_3_6",
        "clauseNumber": "CB.3.6",
        "title": "Clause CB.3.6",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      },
      {
        "clauseId": "c22_3_60826_cl_CB_3_7",
        "clauseNumber": "CB.3.7",
        "title": "Clause CB.3.7",
        "section": "Normative Clause",
        "standardId": "c22_3_60826"
      }
    ]
  },
  "csa_o15_table1": {
    "id": "csa_o15_table1",
    "key": "table1",
    "standardId": "csa_o15",
    "standardName": "CSA O15",
    "edition": "2015 (R2020)",
    "number": "Table 1",
    "title": "Maximum knot sizes",
    "unit": "",
    "explicitRefs": [
      "3",
      "4.4.7",
      "E.1"
    ],
    "notes": {
      "measurementMethod": "The diameter of any single knot is measured at the widest point of the knot, perpendicular to the length of the pole, and includes the sapwood and heartwood of the knot, as shown in Figure 3.",
      "disregardLimit": "Knots 13 mm (1/2 in) or less in diameter shall be ignored in applying the limitations for the sum of diameters."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "csa_o15_cl_3",
        "clauseNumber": "3",
        "title": "Definitions",
        "section": "3 Definitions",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_4_4_7",
        "clauseNumber": "4.4.7",
        "title": "Knot diameter",
        "section": "4 Material requirements",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_E_1",
        "clauseNumber": "E.1",
        "title": "Application",
        "section": "Annex E (informative) SI (metric) versions of Tables 1 to 23",
        "standardId": "csa_o15"
      }
    ]
  },
  "csa_o15_table2": {
    "id": "csa_o15_table2",
    "key": "table2",
    "standardId": "csa_o15",
    "standardName": "CSA O15",
    "edition": "2015 (R2020)",
    "number": "Table 2",
    "title": "Maximum spiral grain",
    "unit": "",
    "explicitRefs": [
      "4.4.11",
      "E.1"
    ],
    "notes": {
      "definition": "Spiral grain (twisted grain) is a type of growth in which the fibres take a spiral course around the trunk."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "csa_o15_cl_4_4_11",
        "clauseNumber": "4.4.11",
        "title": "Spiral grain",
        "section": "4 Material requirements",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_E_1",
        "clauseNumber": "E.1",
        "title": "Application",
        "section": "Annex E (informative) SI (metric) versions of Tables 1 to 23",
        "standardId": "csa_o15"
      }
    ]
  },
  "csa_o15_table3": {
    "id": "csa_o15_table3",
    "key": "table3",
    "standardId": "csa_o15",
    "standardName": "CSA O15",
    "edition": "2015 (R2020)",
    "number": "Table 3",
    "title": "Strength and stiffness properties by species",
    "unit": "",
    "explicitRefs": [
      "4.1.1",
      "4.1.2",
      "6.5.3",
      "B.1.1",
      "E.1",
      "Tables 4-13",
      "Tables E.4-E.13",
      "Table 23",
      "Table E.23"
    ],
    "notes": [
      "The fibre stresses are stresses for the purposes of classification and are close approximations to the average bending strengths (MOR) specified in Table A.1 for poles 20 to 35 ft (6.1 to 10.7 m) in length.",
      "Bending strengths are derived from specimens whose moisture contents at the groundline were above the fibre saturation point at the time of testing to failure.",
      "The strength of poles longer than 50 ft (15.2 m) can be less, as indicated in Annex A.",
      "Fibre stress for several species was based on limited test information or results from one test site.",
      "Classification criteria: Taper = (circumference at theoretical groundline - minimum top circumference) / length between them; loading point 0.61 m (2 ft) from pole top; classification point 1.83 m (6 ft) from butt.",
      "Pole test data for yellow cedar, eastern white pine, and ponderosa pine were not available; values approximate average strengths of small, clear bending specimens.",
      "Only Douglas fir poles taken from the western slopes of Coast and Cascade Mountains shall be classified as coastal Douglas fir. All other Douglas fir poles shall be classified as interior Douglas fir.",
      "Natural variability within a sample of poles and between pole samples taken from various areas of growth region exists.",
      "Scots and southern yellow pines are not native to Canada. Southern yellow pine includes loblolly, longleaf, shortleaf, and slash pine.",
      "Spruce species include black, Engelmann, red, Sitka, and white spruce. Separation after harvesting is impractical. Small clear tests indicate white spruce is weakest of the five."
    ],
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "csa_o15_cl_0",
        "clauseNumber": "0",
        "title": "Introduction",
        "section": "0 Introduction",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_4_1_1",
        "clauseNumber": "4.1.1",
        "title": "Permitted commercial species",
        "section": "4 Material requirements",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_4_1_2",
        "clauseNumber": "4.1.2",
        "title": "Classification according to fibre stresses",
        "section": "4 Material requirements",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_6_5_3",
        "clauseNumber": "6.5.3",
        "title": "Code letters for country of origin and pole species",
        "section": "6 Quality of work and finish, markings, handling, storage, and inspection",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_B_1_1",
        "clauseNumber": "B.1.1",
        "title": "Calculation of minimum circumferences and horizontal loads",
        "section": "Annex B (informative) Classification procedure for poles",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_E_1",
        "clauseNumber": "E.1",
        "title": "Application",
        "section": "Annex E (informative) SI (metric) versions of Tables 1 to 23",
        "standardId": "csa_o15"
      }
    ]
  },
  "csa_o15_tableB1": {
    "id": "csa_o15_tableB1",
    "key": "tableB1",
    "standardId": "csa_o15",
    "standardName": "CSA O15",
    "edition": "2015 (R2020)",
    "number": "Table B.1",
    "title": "Horizontal loads for standard classes of wood utility poles",
    "unit": "",
    "explicitRefs": [
      "B.1.1",
      "Tables 7-9",
      "Tables E.7-E.9"
    ],
    "notes": {
      "reductionFactorWesternRedCedar": 0.95,
      "reductionFactorRedPine": 0.95,
      "reductionFactorJackPine": 0.95,
      "footnote": "The loads specified in this Table should be corrected by a factor of 0.95 for western red cedar, red pine, and jack pine."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "csa_o15_cl_B_1_1",
        "clauseNumber": "B.1.1",
        "title": "Calculation of minimum circumferences and horizontal loads",
        "section": "Annex B (informative) Classification procedure for poles",
        "standardId": "csa_o15"
      }
    ]
  },
  "csa_o15_tableC1": {
    "id": "csa_o15_tableC1",
    "key": "tableC1",
    "standardId": "csa_o15",
    "standardName": "CSA O15",
    "edition": "2015 (R2020)",
    "number": "Table C.1",
    "title": "Standard classes of reinforcing stubs",
    "unit": "",
    "explicitRefs": [
      "C.1",
      "C.2",
      "C.3",
      "C.4",
      "Tables 14-23",
      "Tables E.14-E.23"
    ],
    "notes": {
      "basis": "A stub should have a life at least equal to the remaining life of the pole. The circumference at 1.83 m (6 ft) from the butt of the stub is approximately 51 mm (2 in) less than that of a new replacement pole adequate to support the load."
    },
    "footnotes": null,
    "referencingClauses": [
      {
        "clauseId": "csa_o15_cl_C_1",
        "clauseNumber": "C.1",
        "title": "Classification",
        "section": "Annex C (informative) Classification procedure for reinforcing stubs",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_C_2",
        "clauseNumber": "C.2",
        "title": "Lengths",
        "section": "Annex C (informative) Classification procedure for reinforcing stubs",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_C_3",
        "clauseNumber": "C.3",
        "title": "Size determination",
        "section": "Annex C (informative) Classification procedure for reinforcing stubs",
        "standardId": "csa_o15"
      },
      {
        "clauseId": "csa_o15_cl_C_4",
        "clauseNumber": "C.4",
        "title": "Shrinkage",
        "section": "Annex C (informative) Classification procedure for reinforcing stubs",
        "standardId": "csa_o15"
      }
    ]
  }
};
