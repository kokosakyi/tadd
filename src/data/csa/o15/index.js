/**
 * CSA O15-15 (Wood Utility Poles and Reinforcing Stubs) Data Module Index
 *
 * Provides structured access to:
 * - Table 1 / Table E.1: Maximum knot sizes
 * - Table 2 / Table E.2: Maximum spiral grain
 * - Table 3 / Table E.3: Wood species mechanical properties (fibre stress, MOE, COV)
 * - Table B.1: Standard pole classes & horizontal breaking loads (H6 down to 8)
 * - Table C.1: Standard reinforcing stub classes & design loads (Z, Y, X, W)
 *
 * All lookups ensure alphabetical sorting per project rules.
 */

export * from './table1.js';
export * from './table2.js';
export * from './table3.js';
export * from './tableB1.js';
export * from './tableC1.js';

import { CSA_O15_SPECIES } from './table3.js';
import { CSA_O15_POLE_CLASSES } from './tableB1.js';
import { CSA_O15_STUB_CLASSES } from './tableC1.js';
import { CSA_O15_KNOT_SIZES } from './table1.js';
import { CSA_O15_SPIRAL_GRAIN } from './table2.js';

/**
 * Get wood species by code or ID (case-insensitive)
 * @param {string} codeOrId e.g. 'WC', 'western_red_cedar', 'DF'
 */
export function getO15Species(codeOrId) {
  if (!codeOrId) return null;
  const q = codeOrId.trim().toLowerCase();
  return (
    CSA_O15_SPECIES.find(
      s =>
        s.id.toLowerCase() === q ||
        s.speciesCode.toLowerCase() === q ||
        (s.speciesCodeVariants && s.speciesCodeVariants.some(v => v.toLowerCase() === q)) ||
        s.commonName.toLowerCase() === q
    ) || null
  );
}

/**
 * Get all commercial species sorted alphabetically by common name
 */
export function getAllO15Species() {
  return [...CSA_O15_SPECIES].sort((a, b) => a.commonName.localeCompare(b.commonName));
}

/**
 * Get pole class details by class name (e.g. 'H3', '1', '4')
 */
export function getO15PoleClass(className) {
  if (!className) return null;
  const q = String(className).trim().toUpperCase();
  return CSA_O15_POLE_CLASSES.find(c => c.class === q) || null;
}

/**
 * Get all pole classes sorted from strongest (H6) to lightest (8)
 */
export function getAllO15PoleClasses() {
  return [...CSA_O15_POLE_CLASSES];
}

/**
 * Get stub class details by class name ('Z', 'Y', 'X', 'W')
 */
export function getO15StubClass(className) {
  if (!className) return null;
  const q = String(className).trim().toUpperCase();
  return CSA_O15_STUB_CLASSES.find(c => c.class === q) || null;
}
