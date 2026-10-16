/**
 * PLS-CADD & PLS-POLE Lessons Learned: Senior/Junior Engineering Dialogue
 * Technical reference and field wisdom covering:
 * - P&P Drafting & Annotations
 * - Otto-Pilot Camera Navigation
 * - AutoSag Mechanics & Catenary State Optimization
 * - Manual Tensioning vs. Slack-Wire Analysis
 * - CSA C22.3 Conductor Tension Limits (% RTS)
 * - Method 4 Non-Linear FEA & Wood Pole P-Delta Secondary Bending
 * - Deflection Animations & Non-Linear Debug Mode
 * - Coordinate Systems (Member Local vs. Global Foundation)
 * - Structural Strength Usage vs. Min Vert Load (Uplift)
 * - Guy Wire Mechanics: In-Line vs. Bisector Guying
 * - Guy Placement Modes & Roadway Span Guy Configurations
 * - Guy Strength Factors vs. Rated Tensile Capacity (TCAP & PCT)
 * - 25 kV Distribution Line Guy Clearances (CSA C22.3 No. 1)
 * - Day-to-Day Engineering Workflow & Enterprise Automation
 *
 * Characters:
 * - Alex Rivera, E.I.T. (Junior Transmission & Distribution Design Engineer)
 * - Dan Miller, P.Eng. (Senior Principal T&D Engineer & Line Design Practice Lead)
 */

export const PLS_BOOK_META = {
  id: 'pls_cadd_lessons',
  code: 'PLS-CADD',
  edition: 'Lessons Learned 2026',
  title: 'PLS CADD - Lessons learned',
  subtitle: 'Senior & Junior Engineer Dialogue & Practical T&D Mechanics',
  status: 'Field Guide',
  clauseCount: 14,
  tableCount: 6,
  isDialogueBook: true,
  scope: 'Drafting, AutoSag, Non-Linear FEA, Guy Mechanics, CSA Clearances, and Line Automation.'
};

export const PLS_SECTIONS = [
  'Drafting, Graphics & Corridor Navigation',
  'Catenary Physics, AutoSag & Wire States',
  'Structural FEA, Wood Poles & Mechanics',
  'Guy Wire Mechanics, Anchors & Clearances',
  'Engineering Workflow & Enterprise Automation'
];

export const PLS_LESSONS = [
  // LESSON 1
  {
    id: 'pls_lesson_1',
    lessonNumber: 1,
    clauseNumber: '1.0',
    title: 'P&P Sheet View Drafting & Visual Annotations',
    section: 'Drafting, Graphics & Corridor Navigation',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'Dan, I’m wrapping up the Plan & Profile sheets for our 25 kV urban rebuild. We have a couple of tight utility crossings and pipeline right-of-ways that need revision bubbles and highlighted clearance zones. In the past, people exported DXFs and manually drew circles in CAD, but every time an alignment changes or we respott a pole, the CAD annotations end up floating in empty space. Can we draw and manage native annotations right inside PLS-CADD?'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'Never patch in external CAD what PLS-CADD can track natively! When you export to CAD, you break the dynamic link to the engineering model. In PLS-CADD, you have three built-in methods under Drafting > Lines and Annotation:\n\n1. Interactive Drawing (Drafting > Lines and Annotation > Add > Ellipse / Circle):\nSelect whether to attach the annotation to Single Sheet (only that specific sheet), Drawing Sheets (all profile sheets), or All Sheets. Pick your Color, Sheet Line Width, and Line Type (Solid, Dash, or Cloud for revision callouts). Your first click drops the center; drag outward to size the radius and click again to finish.\n\n2. Solid Color Fill & Pattern Hatching:\nOnce placed, go to Drafting > Lines and Annotation > Edit, click the circle, check Fill, and pick a pastel warning tint. Or use Drafting > Lines and Annotation > Add > Hatch... to cross-hatch an entire restricted ROW zone.\n\n3. Table Edit (Exact Placement):\nFor company title-block stamps or standard warning notes that must sit at an exact millimeter position, use Drafting > Lines and Annotation > Table Edit. You enter the coordinates as an explicit percentage of sheet width (%width) and height (%height). Now when your stationing moves, your annotations stay rock-solid.'
      }
    ],
    proTip: 'Use Line Type "Cloud" with Single Sheet attachment for utility conflict revision tags. Always edit via Table Edit when you need exact percentage alignment with title blocks across a 50-sheet plan set.',
    plsCommands: [
      'Drafting > Lines and Annotation > Add > Ellipse / Circle',
      'Drafting > Lines and Annotation > Edit (Fill Checkbox)',
      'Drafting > Lines and Annotation > Add > Hatch...',
      'Drafting > Lines and Annotation > Table Edit'
    ],
    csaCitations: ['CSA C22.3 No. 1 Cl. 5.1 (Right-of-Way Clearances)']
  },

  // LESSON 2
  {
    id: 'pls_lesson_2',
    lessonNumber: 2,
    clauseNumber: '2.0',
    title: 'Otto-Pilot (Shift+O) Camera Flight Controls & Alignment Navigation',
    section: 'Drafting, Graphics & Corridor Navigation',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'During yesterday’s project kickoff with the utility client, you flew smoothly down the entire 15-kilometer line corridor in 3D without touching the mouse pan tools. It looked like a 3D flight simulator. How does that camera flight work?'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'That’s Otto-Pilot—one of the best visual inspection and presentation tools in the power line industry. The hotkey is Shift + O.\n\nHere’s your flight manual:\n• Shift + O: Launches the automated camera flight along your alignment centerline.\n• Spacebar: The most important button! It pauses the flight immediately so you can inspect an insulator swing or road crossing, and pressing Spacebar again resumes flight.\n• Esc or Right-Click: Stops Otto-Pilot and returns control to standard 3D view.\n• U Key: Executes a 180° U-turn mid-flight to fly back in the reverse direction.\n• Up / Down Arrows or + / -: Accelerates or decelerates your flight speed.\n\nAnd here’s the trick when a client asks about a specific structure: don’t start flying from Station 0+00! Press G on your keyboard to open the "Go To Structure / Station" prompt, type the structure number (e.g., 42), hit Enter, and then hit Shift + O. You start flying directly from that pole.'
      }
    ],
    proTip: 'Middle-click any structure in the 3D view and press O to lock it as your rotation origin. Then hit Shift + O to inspect complex deadend angles from a stabilized orbit.',
    plsCommands: [
      'Shift + O (Activate / Exit Otto-Pilot)',
      'Spacebar (Pause / Resume Flight)',
      'U (180° U-Turn)',
      '+ / - or Up / Down Arrows (Adjust Airspeed)',
      'G (Go To Structure / Station)'
    ],
    csaCitations: ['CAN/CSA-C22.3 No. 60826 Annex CA (Topographic Corridor Inspection)']
  },

  // LESSON 3
  {
    id: 'pls_lesson_3',
    lessonNumber: 3,
    clauseNumber: '3.0',
    title: 'AutoSag Calculations & Reference Sagging Conditions',
    section: 'Catenary Physics, AutoSag & Wire States',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'When I configure Criteria > Automatic Sagging and run AutoSag on a tension section, PLS-CADD outputs a single horizontal tension number at 15 °C Initial RS for my Reference Sagging Condition. How does it figure out that specific governing number when my criteria table lists three completely different weather cases, temperatures, and wire states?'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'Think of the Reference Sagging Condition as the "birth state" of your conductor when linemen first string it in the field—typically 15 °C Initial Ruling Span, before long-term creep elongates it or an extreme ice storm yields the aluminum strands. PLS-CADD needs a single baseline tension at this state to lock in the exact unstressed wire length for every span in your section.\n\nNow look at your three criteria rows:\n• Rule 1: Deterministic Heavy Loading at -20 °C (Initial RS), max 50% RTS.\n• Rule 2: Extreme 50-Year Ice at -10 °C (Final After Load RS), max 70% RTS.\n• Rule 3: Everyday Vibration Limit at +15 °C (Final After Creep RS), max 20% RTS.\n\nPLS-CADD acts like a time machine. It evaluates each rule independently and back-calculates: "What is the maximum stringing tension I can pull at 15 °C Initial so I never violate this rule in the future?"\n\n1. For Rule 1 (Heavy Loading, -20 °C Initial), it uses elastic state-change equations. To keep tension <= 50% RTS at -20 °C with ice and wind, stringing tension at 15 °C cannot exceed 6,800 lbs.\n2. For Rule 2 (Extreme Ice, Final After Load), it accounts for permanent plastic stretch (Pcp). To keep tension <= 70% RTS after the storm, initial stringing tension at 15 °C cannot exceed 7,200 lbs.\n3. For Rule 3 (Everyday 15 °C, Final After Creep), it accounts for 10-year metallurgical creep. To ensure tension does not exceed 20% RTS after a decade of creep, initial stringing tension cannot exceed 5,670 lbs.\n\nNow PLS-CADD has three candidate stringing tensions: 6,800 lbs, 7,200 lbs, and 5,670 lbs. Which one does it choose?'
      },
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'It has to pick 5,670 lbs! If it strung the wire at 6,800 lbs, it would survive the heavy ice storm, but after 10 years of creep, everyday tension would exceed 20% RTS and vibrate itself to fatigue failure under aeolian wind!'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'Bingo! To satisfy all conditions simultaneously, PLS-CADD selects the LOWEST, most restrictive allowable tension:\n\nH_governing = 5,670 lbs\n\nIt assigns 5,670 lbs as the Horizontal Component of Tension (H), divides by bare wire unit weight (w) to get the Catenary Constant (C = H/w), locks the unstressed wire lengths at 0 °C, and uses those fixed lengths to solve catenary shapes for all other weather cases.'
      }
    ],
    proTip: 'Always inspect Lines > Reports > Section Usage after running AutoSag. If a ruling span is very short (< 60 m), everyday creep tension will almost always govern over heavy storm ice.',
    plsCommands: [
      'Criteria > Automatic Sagging (Define Limits Table)',
      'Sections > Automatic Sag (Execute AutoSag Optimization)',
      'Sections > Modify (View Governing H and Catenary Constant C)',
      'Lines > Reports > Section Usage (Audit All Weather Cases)'
    ],
    csaCitations: [
      'CSA C22.3 No. 1 Table 34 (Conductor Tension Limits)',
      'CSA C22.3 No. 1 Clause 8.7.3 (Tension & Creep Requirements)'
    ]
  },

  // LESSON 4
  {
    id: 'pls_lesson_4',
    lessonNumber: 4,
    clauseNumber: '4.0',
    title: 'Manual Reference Tensioning vs. Slack-Wire Analysis (Trade-offs & Costs)',
    section: 'Catenary Physics, AutoSag & Wire States',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'What happens if I bypass AutoSag and manually type a lower tension—say 4,000 lbs instead of 5,670 lbs—into Sections > Modify? The groundline bending moments on my deadend poles drop, and I can use smaller guy wires. Isn’t that a huge structural win?'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'It is a structural win for the pole, but it can be an absolute financial disaster for the project! Here’s what happens when you take the wheel manually:\n\n1. The Software Stops Protecting You:\nWhen you enter tension manually in Sections > Modify, PLS-CADD locks that number. It will not warn you if you’re under-tensioned or over-tensioned unless you explicitly run Sections > Check.\n\n2. The Structural Benefits:\nYes, dropping tension from 5,670 lbs to 4,000 lbs cuts deadend pulls and angle resultant forces by nearly 30%. Everyday tension drops to ~12% RTS, eliminating aeolian vibration risk without requiring dampers.\n\n3. The Clearance & Cost Penalty:\nConductor sag is inversely proportional to horizontal tension:\nSag ≈ (w · L²) / (8 · H)\nA 30% drop in tension causes an immediate 40%+ increase in sag! Under maximum operating temperature (e.g., 100 °C electrical emergency rating), that slack wire sags right down into farm machinery and highway clearance envelopes. To restore code ground clearance, you have to raise your poles by 5 to 10 feet or spot intermediate structures along the alignment.\n\nSaving $500 on guy wires will cost you $150,000 in taller poles and extra foundation excavation. Never slacken conductors without running Lines > Reports > Summary Clearance Violations!'
      }
    ],
    proTip: 'Lowering stringing tension also increases conductor blowout swing (horizontal catenary swing = w_wind / w_vert). Deeper catenaries swing further into right-of-way boundaries and increase galloping risk.',
    plsCommands: [
      'Sections > Modify (Manual Tension / Catenary Entry)',
      'Sections > Check (Manual Tension Verification)',
      'Lines > Reports > Summary Clearance Violations'
    ],
    csaCitations: [
      'CSA C22.3 No. 1 Table 2 (Ground Clearances)',
      'CSA C22.3 No. 1 Table 34 (Conductor Tension Limits)'
    ]
  },

  // LESSON 5
  {
    id: 'pls_lesson_5',
    lessonNumber: 5,
    clauseNumber: '5.0',
    title: 'Conductor Tension Limits (% RTS) under CSA C22.3',
    section: 'Catenary Physics, AutoSag & Wire States',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'Where do our project design criteria tension limits come from? What does CSA C22.3 No. 1 strictly require across different conductor states?'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'CSA C22.3 No. 1 Table 34 and Clause 8.7.3 establish four clear mechanical tension boundaries. Keep this table pinned to your desk:\n\n1. Deterministic District Weather Load Cases (Initial RS):\nUnder Severe, Heavy, Medium A, or Medium B ice and wind loading at -20 °C (-10 °C for Medium A), maximum tension must not exceed 60% RTS (Clause 8.7.3.2.1, Table 34).\n\n2. Reliability-Based / Extreme Storm Loads (Final After Load RS):\nUnder 50-year extreme wind, extreme ice alone, or Combined C1/C2 cases per CAN/CSA-C22.3 No. 60826, tension must not exceed 70% to 80% RTS (75% RTS is standard utility practice) (Clause 8.7.3.1.3, Annex A.8.7.3).\n\n3. Initial Everyday Unloaded (Initial RS):\nAt mean annual temperature (+15 °C) or the coldest month average (January) with zero ice and zero wind, tension must be between 20% and 35% RTS (20% RTS target, or maintaining Catenary Constant C <= 2000 m) to prevent high-frequency aeolian vibration fatigue.\n\n4. Final Everyday After Creep (Final After Creep RS):\nAfter 10 years of metallurgical elongation at +15 °C unloaded, tension must settle between 15% and 25% RTS (15% RTS target).'
      }
    ],
    proTip: 'If your everyday initial tension exceeds 20% RTS or catenary constant C > 2000 m, CSA C22.3 requires installing Stockbridge dampers or spiral vibration dampers (SVDs) to prevent sub-span fatigue at clamp mouths.',
    plsCommands: [
      'Criteria > Automatic Sagging (Configure Table 34 Limits)',
      'Lines > Reports > Section Usage (Check % RTS vs Code Limits)'
    ],
    csaCitations: [
      'CSA C22.3 No. 1 Clause 8.7.3.1.1 (Everyday Vibration Limit)',
      'CSA C22.3 No. 1 Clause 8.7.3.2.1 (Deterministic 60% Limit)',
      'CSA C22.3 No. 1 Table 34 (Conductor Tension Limits)',
      'CAN/CSA-C22.3 No. 60826 Clause 6.3 & Annex A.8.7.3'
    ]
  },

  // LESSON 6
  {
    id: 'pls_lesson_6',
    lessonNumber: 6,
    clauseNumber: '6.0',
    title: 'Method 4 Non-Linear FEA vs. Allowable Spans (Wood Pole P-Delta Effects)',
    section: 'Structural FEA, Wood Poles & Mechanics',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'Why do our utility design standards mandate Method 4 finite-element analysis for wood poles? Why can’t we just use Method 1 or Method 2 with allowable wind and weight span lookup charts?'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'Allowable wind/weight span charts (Methods 1 and 2) assume linear, rigid behavior on flat ground with balanced spans. They fail completely when you have:\n• Sloped or rolling terrain with unequal spans.\n• Reconductoring with heavier wires or lower joint-use telecom attachments.\n• Longitudinal unbalanced ice loading (100% ice on the back span vs. bare wire on the ahead span).\n• Broken wire containment checks.\n\nMethod 4 takes the exact 3D wire tension vectors from your catenaries and passes them directly to PLS-POLE as concentrated point loads on beam elements.\n\nMore importantly, wood poles are flexible cantilever beams that suffer from massive P-Delta (P-Δ) secondary bending moments:\nWhen transverse wind blows on the wires and pole, the pole tip deflects sideways by a distance Δ. The massive vertical loads (P)—from radial ice, conductors, crossarms, and transformers—are now eccentric to the pole base! That vertical load acting across deflection Δ generates secondary bending moments:\n\nM_total = M_primary + (P · Δ)\n\nA linear analysis completely ignores P-Δ effects, underestimating groundline bending stress and pole deflections by 20% to 35%+! In PLS-POLE:\n• Set General > General Data > Analysis Type to "Nonlinear".\n• Set Strength Check to ANSI O5.1-2017 or CSA C22.3.\n• Set General > Wood Pole Buckling Assumptions to "Nonlinear Check" to catch column instability under guyed compression.'
      }
    ],
    proTip: 'On guyed poles, guy wires introduce massive vertical downward compressive thrust into the pole shaft. A linear check will never detect column buckling, but a Method 4 non-linear check catches it immediately.',
    plsCommands: [
      'Structures > Check (Run Method 4 Analysis)',
      'General > General Data > Analysis Type = Nonlinear',
      'General > Wood Pole Buckling Assumptions = Nonlinear Check',
      'Criteria > Structure Loads (Set Overload Factors)'
    ],
    csaCitations: [
      'CSA C22.3 No. 1 Clause 8.2 & Table 31 (Structural Load Factors)',
      'CSA O15 Clause 4 (Wood Utility Pole Strengths & Design Stresses)'
    ]
  },

  // LESSON 7
  {
    id: 'pls_lesson_7',
    lessonNumber: 7,
    clauseNumber: '7.0',
    title: 'Deflection Animations & Non-Linear Debug Mode in PLS-POLE',
    section: 'Structural FEA, Wood Poles & Mechanics',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'My non-linear analysis converged in PLS-POLE, but how do I visually verify how the pole actually bends under different load cases to make sure my guy wires and crossarms are working as expected?'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'You have two indispensable animation tools in PLS-POLE:\n\n1. Dance Structure (View > Dance Structure):\nAfter running an analysis, open your Deformed Geometry window and select View > Dance Structure (or right-click and choose Dance Structure). PLS-POLE cycles through the deflected shapes across all your load cases in a smooth animation. In 5 seconds, you can spot if a crossarm is twisting backwards, if a guy wire went slack, or if an anchor is deflecting improperly.\n\n2. Step-by-Step Non-Linear Debug Mode:\nIf an analysis fails to converge or a guyed pole buckles, right-click in the Deformed Geometry window BEFORE running the analysis and check "Enable Nonlinear Debug Mode". Run Model > Analyze. The Nonlinear Debug Toolbar appears. Click "Animate", and the solver shows you each load increment and iteration step-by-step as P-Delta deformations grow and equilibrium is chased.\n\nIf you see the pole tip deflecting exponentially on iteration 12, you know you have column instability or a slack guy wire.'
      }
    ],
    proTip: 'Right-click in the Deformed Geometry window and select "Set" to adjust the deformation scale multiplier (e.g., 5x or 10x) so small deflections are clearly visible during animations.',
    plsCommands: [
      'View > Dance Structure (Cycle Load Case Deflections)',
      'Deformed Geometry > Right-Click > Enable Nonlinear Debug Mode',
      'Model > Analyze (Triggers Step-by-Step Convergence Animation)',
      'Nonlinear Debug Toolbar > Animate / Step'
    ],
    csaCitations: ['CAN/CSA-C22.3 No. 60826 Clause 7 (Structural Modeling & Failure Modes)']
  },

  // LESSON 8
  {
    id: 'pls_lesson_8',
    lessonNumber: 8,
    clauseNumber: '8.0',
    title: 'Coordinate Systems in PLS-POLE (Member Local vs. Global Foundation Axes)',
    section: 'Structural FEA, Wood Poles & Mechanics',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'I was reviewing the Detailed Member Usages report for a tubular steel crossarm and a wood pole in PLS-POLE. The foundation reaction moments at the groundline match our line alignment global coordinates, but the bending moments on the arm don’t match global X and Y. Why are they different?'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'Be extremely careful here—mixing up coordinate systems in PLS-POLE will invalidate your stress checks! PLS-POLE uses two distinct coordinate frameworks:\n\n1. Member Local Coordinate System:\nUsed for all member usages, tubular arms, crossarms, and pole shaft elements. Moments are reported as "Local Mx" and "Local My". Why? Because structural failure of a steel arm or timber beam depends strictly on bending relative to its own strong and weak cross-sectional axes! The beam doesn’t care where true north or your line alignment points; it calculates axial stress (fa), bending stress (fb), and shear/torsion (fv, ft) on its own local profile.\n\n2. Structure Global Coordinate System:\nUsed for primary joint coordinates, groundline foundation reactions, and Connection and Anchor (CAN) checks. Global +Z points vertically UP, Global +X is Structure Longitudinal (along the alignment), and Global +Y is Structure Transverse.\n\nWhen checking crossarm bending or weld stresses, always read Local Mx and My. When designing a concrete pier foundation or guy anchor resistance, use Global reactions.'
      }
    ],
    proTip: 'In the PLS-POLE deformed geometry view, click View > Show Member Orientations to display the local x-y-z coordinate triads right on each crossarm and pole segment.',
    plsCommands: [
      'View > Show Member Orientations (Toggle Local Axes Triads)',
      'Model > Detailed Member Usages (Reports Local Mx, My)',
      'Model > Joint & Support Reactions (Reports Global X, Y, Z)'
    ],
    csaCitations: [
      'CSA C22.3 No. 1 Clause 8.3 (Structural Resistances)',
      'CSA O15 Clause 4 (Pole Bending Stress & Section Modulus)'
    ]
  },

  // LESSON 9
  {
    id: 'pls_lesson_9',
    lessonNumber: 9,
    clauseNumber: '9.0',
    title: 'Structure Checks: Structural Strength Usage vs. Min Vert Load (Uplift)',
    section: 'Structural FEA, Wood Poles & Mechanics',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'Dan, I ran a structure check across a 10-pole tangent run in PLS-CADD. Pole 14 shows a Structural Strength Usage of only 94.3%, which is under 100%, but the status column is flagged bright red: "Min Vert Load = NG"! How can a pole be physically strong enough but still fail the structure check?'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'You’re confusing physical member strength with hardware and insulator operating limits!\n\n• 94.3% Structural Strength Usage means your wood pole, crossarms, and guy wires physically withstand the applied load tree without snapping.\n• Min Vert Load = NG (No Good) means your suspension insulator is experiencing UPLIFT—a negative weight span!\n\nHere’s the physics:\nPole 14 probably sits in a topographic dip between two higher hilltops. Under extreme cold weather (e.g., -40 °C), thermal contraction dramatically tightens the conductor, pulling the catenary low point completely outside the span. The conductor lifts up and exerts an upward vertical force on the suspension insulator.\n\nSuspension insulator bells are flexible strings. If you pull upward on them, the string flips upside down toward the grounded crossarm, causing an immediate phase-to-ground electrical flashover or unhooking the hardware!\n\nHere are your four engineering remedies:\n1. Check the physical hardware: If you are using a rigid post insulator or clamp that is rated to carry uplift, open Geometry > Insulators in PLS-POLE and change Minimum Required Vertical Load from "No Uplift" to "No Limit".\n2. Add counterweights: Hang weights below the suspension clamp to keep the insulator in positive tension.\n3. Spotting adjustment: Raise Pole 14’s height or adjust adjacent structure locations in PLS-CADD to restore a positive weight span.\n4. Hardware conversion: Replace the suspension string with a V-string or deadend strain assembly.'
      }
    ],
    proTip: 'Always check Lines > Reports > Summary Wire Clearances for cold weather load cases. Uplift frequently occurs at -30 °C or -40 °C unloaded conditions where wire contraction is maximum.',
    plsCommands: [
      'Structures > Check (Reports Min Vert Load Status)',
      'Geometry > Insulators > Minimum Required Vertical Load',
      'Lines > Reports > Summary Wire Clearances'
    ],
    csaCitations: [
      'CSA C22.3 No. 1 Clause 4.3 (Insulator Mechanical & Electrical Ratings)',
      'CAN/CSA-C22.3 No. 60826 Clause 7.2.3 (Insulator String Swing & Uplift)'
    ]
  },

  // LESSON 10
  {
    id: 'pls_lesson_10',
    lessonNumber: 10,
    clauseNumber: '10.0',
    title: 'Guy Wire Mechanics: In-Line vs. Bisector Guying (Vector Efficiency & Pole Stiffness)',
    section: 'Guy Wire Mechanics, Anchors & Clearances',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'We have a 30° running line angle pole. The survey crew says there’s a private landowner property line right along the angle bisector. Can we just install two in-line guys pointing straight down the back and ahead spans instead of a bisector guy anchor?'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'You can, but mechanically it is far less efficient and introduces massive pole deflection! Let’s write the vector math on the whiteboard.\n\nAt any line angle Δ, conductor tension T produces a net transverse resultant force F_R along the angle bisector:\n\nF_R = 2 · T · sin(Δ / 2)\n\n• Bisector Guy:\nPoints directly along the line of action of F_R. Its vector efficiency is 100%! As soon as the pole top deflects even 5 mm, the bisector guy goes into tension and picks up the load with minimal pole displacement.\n\n• In-Line Guys:\nPoint along the conductor tangents. The component acting along the bisector is reduced by cos(Δ / 2). To oppose F_R, in-line guys require much higher horizontal tension:\n\nT_inline_horiz = T · tan(Δ / 2)\n\nWorse, in-line guys are pulled sideways relative to their anchor alignment. The pole top must undergo huge lateral deflections into the corner before the in-line guys stretch enough to develop restoring tension! That large lateral deflection introduces massive P-Delta secondary bending moments into the wood pole, often causing pole buckling.\n\nHere’s your rule of thumb:\n• Running line angles (4° to 60°): Always use a Bisector Guy for stiffness and efficiency.\n• Heavy angles (> 60°) and full deadends: Use In-Line Guys because you are deadending each span independently.\n• Line terminations: Always use In-Line / Head Guys to directly oppose deadend wire pull.'
      }
    ],
    proTip: 'For running line angles between 20° and 45°, an in-line guy requires up to 40% more steel anchor resistance than a bisector guy. Avoid in-line guying on running angles whenever possible.',
    plsCommands: [
      'Structures > Customize Structure > Move Guy Anchor > Bisect Line Angle',
      'Structures > Customize Structure > Move Guy Anchor > Inline with Wire'
    ],
    csaCitations: [
      'CSA C22.3 No. 1 Clause 8.4 (Guys and Anchors)',
      'CSA C22.3 No. 1 Table 31 (Strength Factors for Guy Wires)'
    ]
  },

  // LESSON 11
  {
    id: 'pls_lesson_11',
    lessonNumber: 11,
    clauseNumber: '11.0',
    title: 'Guy Placement Modes & Roadway Span Guy Configurations',
    section: 'Guy Wire Mechanics, Anchors & Clearances',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'What is the fastest way to adjust guy anchor locations in PLS-CADD when an anchor lands in a roadside ditch or driveway? And how do we model a span guy that crosses a two-lane road to a stub pole on the other side?'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'In PLS-CADD, use Structures > Customize Structure > Move Guy Anchor. You have four great modes:\n• Freehand: Click and drag the anchor in Plan or 3D view while preserving slope and lead length.\n• Snap to Survey Point: Snaps the anchor directly to a legal boundary iron pin or surveyed fence line.\n• Bisect Line Angle: Automatically computes the exact angle bisector azimuth.\n• Slope Intersect with TIN: Extends the guy down its standard lead slope until it penetrates the ground surface model (TIN).\n\nNow, for Roadway Span Guys to a stub pole:\n\nCase A: Both poles are in the same PLS-POLE structure file:\nDefine attachment joints on both poles under Geometry > Wood/Steel Poles > Attach Labels. In Geometry > Guys, set Anchor Type = Joint and select the target joint on the stub pole.\n\nCase B: Main pole and stub pole are separately spotted in PLS-CADD:\n1. Make sure both structures have available attachment sets configured with strain or clamp insulators.\n2. Go to Sections > Add Graphical, select your steel guy strand (.wir file), and set the voltage to 0 kV.\n3. Click the attachment set on the main pole, then click the attachment set on the stub pole.\n4. Open Sections > Modify and set your stringing tension (typically 2% to 5% RTS to avoid sagging into road traffic while transferring horizontal load to the stub).'
      }
    ],
    proTip: 'When modeling span guys across roadways, ensure the 0 kV steel strand clears the roadway crown by at least 5.5 m (18 ft) under CSA C22.3 No. 1 Table 2 requirements for guy wires over highways.',
    plsCommands: [
      'Structures > Customize Structure > Move Guy Anchor',
      'Sections > Add Graphical (0 kV Wire Trick for Span Guys)',
      'Geometry > Guys > Anchor Type = Joint (PLS-POLE)'
    ],
    csaCitations: [
      'CSA C22.3 No. 1 Table 2 (Clearance of Guys Over Roads)',
      'CSA C22.3 No. 1 Clause 5.11 (Span Guys & Overhead Crossings)'
    ]
  },

  // LESSON 12
  {
    id: 'pls_lesson_12',
    lessonNumber: 12,
    clauseNumber: '12.0',
    title: 'Guy Strength Factors vs. Rated Tensile Capacity (TCAP & PCT Mechanics)',
    section: 'Guy Wire Mechanics, Anchors & Clearances',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'In PLS-POLE, my guy wire table shows an ultimate capacity (TCAP) of 10,000 lbs. But when PLS-CADD runs a Method 4 analysis, the guy fails at 7,500 lbs tension with a usage over 100%! Why does the analysis fail well below the rated TCAP displayed in the table?'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'That’s the difference between an unfactored material catalog property and a factored structural design capacity!\n\nIn PLS-POLE, the component table displays:\nDesign Tension Capacity = TCAP · PCT\nFor a 10,000 lb strand with PCT = 1.0 (100%), it displays 10,000 lbs. That is the raw, physical breaking strength of the steel strand.\n\nDuring a Method 4 analysis, PLS-CADD passes the Guy Strength Factor (S.F.) specified in Criteria > Structure Loads (for example, S.F. = 0.80 for CSA Grade 2 construction, or 0.65 for Grade 1 railway crossings). PLS-POLE evaluates guy strength usage in the denominator:\n\nGuy Strength Usage (%) = Actual Tension Force / (TCAP · PCT · S.F.)\n\nFor your 10,000 lb guy with an S.F. of 0.80:\nEffective Factored Capacity = 10,000 lbs · 0.80 = 8,000 lbs.\nIf the load is 7,500 lbs:\nUsage = 7,500 / 8,000 = 93.8%.\n\nIf your criteria called for Grade 1 crossing construction with an S.F. of 0.65:\nEffective Capacity = 10,000 lbs · 0.65 = 6,500 lbs!\nThat same 7,500 lb load results in:\nUsage = 7,500 / 6,500 = 115.4% (FAIL)!\n\nThis separation keeps your physical pole files (.pol) code-agnostic. You can evaluate the same structure against CSA C22.3, NESC, or ASCE without altering your physical hardware catalog.'
      }
    ],
    proTip: 'Anchor holding capacity in soil must also be checked independently! Even if your guy strand is at 80% usage, an anchor in wet clay or muskeg may pull out at 50% rated tension.',
    plsCommands: [
      'Criteria > Structure Loads (Define Guy Strength Factors)',
      'Geometry > Guys > TCAP & PCT (Physical Material Strength)',
      'Model > Connections and Anchors (Audit CAN Usages)'
    ],
    csaCitations: [
      'CSA C22.3 No. 1 Clause 8.4.3 (Guy Strength & Factors)',
      'CSA C22.3 No. 1 Table 31 (Strength Factors for Guy Wires: Grade 1, 2, 3)'
    ]
  },

  // LESSON 13
  {
    id: 'pls_lesson_13',
    lessonNumber: 13,
    clauseNumber: '13.0',
    title: '25 kV Distribution Line Guy Clearances (CSA C22.3 No. 1-15 Requirements)',
    section: 'Guy Wire Mechanics, Anchors & Clearances',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'What are the hard clearance limits around 25 kV distribution guy wires under CSA C22.3 No. 1-15? We have joint-use communication attachments and adjacent circuits on the same pole.'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'There are four distinct clearance interfaces you must verify in your drafting:\n\n1. Clearances to Conductors on the Same Structure (Table 22 & Table 26):\n• For 14.4 kV line-to-ground (standard 25 kV wye): minimum separation in any direction from live conductors to guy wires is 300 mm (Table 22).\n• For 25 kV line-to-ground (delta systems): 380 mm + 10 mm/kV over 22 kV = 410 mm.\n• On joint-use structures (Table 26): when the guy is parallel to plant, maintain 410 mm; when not parallel, maintain 330 mm.\n\n2. Clearances to External / Adjacent Systems (Table 25):\nWhen a guy passes near conductors on a separate line:\n• To AC supply conductors (0.75 to 22 kV): 1.2 m.\n• To AC supply conductors (> 22 kV): 1.2 m + 0.01 m/kV over 22 kV = 1.23 m at 25 kV.\n• To telecom cables or other guy wires: 0.6 m.\n\n3. Vertical Separations on Joint-Use Poles:\n• Supply guy attachments must be located at least 0.75 m above or below communication attachments (Clause 5.11.1.1).\n• Live 25 kV supply plant requires a minimum vertical separation of 1.2 m above communication facilities at the pole (Table 23).\n\n4. Grounding & Guy Strain Insulators (Clause 4.2.7):\nAny guy that could contact live conductors upon hardware failure must be effectively grounded or equipped with a fiberglass guy strain insulator. If using a strain insulator, under broken guy conditions the insulator must remain at least 2.5 m above grade, fall below all power attachments, and remain above all communication attachments! Its dry flashover rating must be double the voltage-to-ground.'
      }
    ],
    proTip: 'When installing fiberglass guy strain insulators on joint-use poles, always calculate the broken-guy swing radius to guarantee the insulator cannot dangle into the communication worker safety zone.',
    plsCommands: [
      'Lines > Reports > Clearance Summary (Audit Guy to Wire Separations)',
      'Structures > Customize Structure > Check Clearances'
    ],
    csaCitations: [
      'CSA C22.3 No. 1 Clause 4.2.7 (Guy Grounding & Strain Insulators)',
      'CSA C22.3 No. 1 Clause 5.11.1.1 (Separation to Communication Attachments)',
      'CSA C22.3 No. 1 Table 22 (Clearance Between Wires & Guys on Same Structure)',
      'CSA C22.3 No. 1 Table 23 (Vertical Separation of Conductors on Same Pole)',
      'CSA C22.3 No. 1 Table 25 (Clearances to Guys of Other Lines)',
      'CSA C22.3 No. 1 Table 26 (Clearances on Joint-Use Poles)'
    ]
  },

  // LESSON 14
  {
    id: 'pls_lesson_14',
    lessonNumber: 14,
    clauseNumber: '14.0',
    title: 'Day-to-Day Engineering Workflow & Enterprise Automation',
    section: 'Engineering Workflow & Enterprise Automation',
    standardId: 'pls_cadd_lessons',
    standardName: 'PLS-CADD Lessons Learned',
    dialogue: [
      {
        speaker: 'junior',
        name: 'Alex Rivera, E.I.T.',
        role: 'Junior Design Engineer',
        text: 'Looking at our team’s engineering workflow across a 100-kilometer transmission rebuild, how do senior engineers automate all of this so we aren’t manually clicking through thousands of structures and catenaries one by one?'
      },
      {
        speaker: 'senior',
        name: 'Dan Miller, P.Eng.',
        role: 'Senior Principal T&D Engineer',
        text: 'A professional line engineering practice runs on a three-tier automated pipeline:\n\nTier 1: Master Project Templates (.cri, .fea, .pps):\nNever build criteria files from scratch! Maintain locked, centralized master criteria files (.cri) pre-configured with CSA C22.3 No. 1 Table 30 loading districts and CAN/CSA-C22.3 No. 60826 Combinations C1/C2. Maintain standardized feature code files (.fea) so survey points automatically draw ground, roads, and trees, and locked page setup files (.pps) so P&P sheets populate automatically.\n\nTier 2: LiDAR & Automatic Structure Spotting:\nUse AMBER (Automatic Model Builder) with .lmp mapping files to convert raw airborne LiDAR point clouds (.las/.laz) directly into 3D terrain TINs and surveyed catenaries. Then run Structures > Automatic Spotting. PLS-CADD uses dynamic programming algorithms to evaluate millions of pole locations, heights, and classes, spotting the optimal alignment for lowest total installed capital cost in minutes.\n\nTier 3: Batch Scripting & PLS-GRID Project Manager:\nWrite Python scripts to parse XML/ASCII project export files (.xyz, .cri, .prt, .json) to automate material take-offs and custom staking tables. Deploy PLS-GRID Project Manager for enterprise multi-user checkout, version control, and automated compliance auditing across the entire utility grid.'
      }
    ],
    proTip: 'Lock your company master criteria files (.cri) as read-only on the corporate network drive. If a project engineer needs project-specific weather cases, make them clone and rename it with an explicit revision date.',
    plsCommands: [
      'Terrain > Edit TIN > Surface Generation',
      'Structures > Automatic Spotting (Dynamic Programming Optimization)',
      'Lines > Reports > Staking Report (Automated Material Take-Off)',
      'PLS-GRID Project Manager (Enterprise Line Auditing & Version Control)'
    ],
    csaCitations: [
      'CAN/CSA-C22.3 No. 60826 Clause 5 & Annex CA (LiDAR & Geoclimatic Databases)'
    ]
  }
];

export function getLesson(lessonId) {
  return PLS_LESSONS.find(l => l.id === lessonId || l.clauseNumber === lessonId);
}

export function searchLessons(query = '') {
  const q = String(query).toLowerCase().trim();
  if (!q) return PLS_LESSONS;

  return PLS_LESSONS.filter(l => {
    const inTitle = l.title.toLowerCase().includes(q);
    const inSection = l.section.toLowerCase().includes(q);
    const inClause = l.clauseNumber.includes(q);
    const inProTip = (l.proTip || '').toLowerCase().includes(q);
    const inDialogue = l.dialogue.some(d => d.text.toLowerCase().includes(q) || d.name.toLowerCase().includes(q));
    const inCommands = (l.plsCommands || []).some(c => c.toLowerCase().includes(q));
    const inCitations = (l.csaCitations || []).some(c => c.toLowerCase().includes(q));

    return inTitle || inSection || inClause || inProTip || inDialogue || inCommands || inCitations;
  });
}
