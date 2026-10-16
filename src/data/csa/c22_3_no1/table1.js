/**
 * CSA C22.3 No. 1 — Table 1
 * "Wire and conductor swing for horizontal design clearance"
 * (See Clauses 5.2.7, A.5.2.7, A.5.8.2, and A.7.6.1.)
 *
 * Transcribed from:
 *   - sandbox/csa c22 no 1/Table 9/Table 1.png
 *   - sandbox/csa c22 no 1/Table 9/Cl. 5.2.7.png
 *
 * Notes from Standard:
 * 1) Horizontal deviation = factor × conductor sag
 *    d = diameter of conductor, mm
 *    w = mass per unit length, kg/m
 * 2) A partially sheltered span is one that is protected (from swinging transversely in the wind)
 *    by objects such as buildings whose height is greater than or equal to wire or conductor height
 *    and that are within an effective distance (e.g., 30 m) of the wire or conductor. Trees are
 *    not generally considered to provide shelter.
 *
 * This file is DATA ONLY. Conductor deviation calculations live in src/utils/csaTable1Resolver.js.
 */

export const TABLE_1_META = {
  id: 'csa-c22.3-no1/table1',
  standard: 'CSA C22.3 No. 1',
  title: 'Wire and conductor swing for horizontal design clearance',
  references: ['5.2.7', 'A.5.2.7', 'A.5.8.2', 'A.7.6.1'],
  notes: {
    formula: 'Horizontal deviation = factor × conductor sag',
    diameterUnit: 'mm (d = diameter of conductor)',
    massUnit: 'kg/m (w = mass per unit length)',
    partiallyShelteredDefinition:
      'A partially sheltered span is one that is protected (from swinging transversely in the wind) by objects such as buildings whose height is greater than or equal to wire or conductor height and that are within an effective distance (e.g., 30 m) of the wire or conductor. Trees are not generally considered to provide shelter.',
    fullyShelteredDefinition:
      'Per Clause 5.2.7(c): Where wires or conductors are fully sheltered from transverse wind loads (e.g., along narrow urban streets or lanes between buildings reaching at least conductor height on both sides), no allowance is required for horizontal deviation (factor = 0).',
  },
  clauses: {
    '5.2.7': {
      title: 'Wire or conductor swing for horizontal design clearances',
      text: 'Where specified horizontal clearances are required by this Standard to include an allowance for the swing of conductors, the deviation of the conductor shall be calculated as follows:\n' +
        'a) In exposed and open terrain, the horizontal deviation of the wire or conductor from its position at rest shall be as specified in Table 1.\n' +
        'b) In locations where the span of wire or conductor is partly sheltered from the full effect of transverse winds by buildings or other construction, as in built-up commercial or residential areas, the horizontal deviation of the wire or conductor from its position at rest shall be as specified in Table 1.\n' +
        'c) Where wires or conductors are fully sheltered from transverse wind loads that could cause them to swing, such as along narrow urban streets or lanes and between buildings that reach at least the height of the conductor or wire on both sides, no allowance is required for horizontal deviation.\n' +
        'd) For the purpose of determining wire or conductor swing, the sag at the point under consideration shall be taken as the final unloaded sag at a conductor temperature of 40 °C or, alternatively, the 2.5% July design temperature (as specified in the National Building Code of Canada) applicable to the area under consideration. The 2.5% July design temperature is the temperature at or above which 2.5% of the July hourly ambient temperature occurs.\n' +
        'e) Where suspension insulators that are not restrained from swinging transversely are used, the length of the insulator string shall be added to the conductor sag for the purpose of determining the sag used in Table 1.',
    },
  },
};

/**
 * Digitized empirical curve data points from Table 1 chart [d/w, Factor].
 * d/w is in (mm) / (kg/m). Factor is unitless (deviation = Factor × sag).
 */
export const TABLE_1_CURVE_POINTS = {
  // Non-sheltered span curve (Open terrain per Cl. 5.2.7(a))
  non_sheltered: [
    { dw: 5, factor: 0.125 },
    { dw: 10, factor: 0.24 },
    { dw: 15, factor: 0.355 },
    { dw: 20, factor: 0.45 },
    { dw: 25, factor: 0.535 },
    { dw: 30, factor: 0.605 },
    { dw: 35, factor: 0.66 },
    { dw: 40, factor: 0.705 },
    { dw: 45, factor: 0.745 },
    { dw: 50, factor: 0.78 },
    { dw: 55, factor: 0.81 },
    { dw: 60, factor: 0.835 },
    { dw: 65, factor: 0.855 },
    { dw: 70, factor: 0.865 },
  ],

  // Partially sheltered span curve (Partly sheltered per Cl. 5.2.7(b))
  partially_sheltered: [
    { dw: 5, factor: 0.06 },
    { dw: 10, factor: 0.11 },
    { dw: 15, factor: 0.155 },
    { dw: 20, factor: 0.19 },
    { dw: 25, factor: 0.22 },
    { dw: 30, factor: 0.245 },
    { dw: 35, factor: 0.268 },
    { dw: 40, factor: 0.288 },
    { dw: 45, factor: 0.305 },
    { dw: 50, factor: 0.318 },
    { dw: 55, factor: 0.328 },
    { dw: 60, factor: 0.337 },
    { dw: 65, factor: 0.344 },
    { dw: 71, factor: 0.35 },
  ],
};
