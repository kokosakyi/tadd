/**
 * Text Highlighting Utility for Digitized CSA Standards Library
 * Extracts search tokens, handles Canadian/US spelling variants,
 * normalizes abbreviations and clause identifiers, and performs
 * safe regex token splitting for highlighted search rendering.
 */

// Common English stop words that should not be highlighted when searching multi-word phrases
const STOP_WORDS = new Set([
  'in', 'of', 'for', 'and', 'the', 'a', 'to', 'with', 'by', 'on', 'at', 'from', 'an', 'or', 'is', 'as'
]);

// Cross-spelling dictionary for Canadian (CSA) vs US engineering terms
const SPELLING_SYNONYMS = {
  'fiber': ['fibre'],
  'fibre': ['fiber'],
  'center': ['centre'],
  'centre': ['center'],
  'color': ['colour'],
  'colour': ['color'],
  'formula': ['formulae'],
  'formulae': ['formula'],
  'aluminum': ['aluminium'],
  'aluminium': ['aluminum'],
  'calc': ['calculation'],
  'calculation': ['calc']
};

/**
 * Extract highlightable search terms from a raw search query.
 * Handles phrases, individual words, clause/table patterns, and spelling synonyms.
 *
 * @param {string} query - The search query string
 * @returns {string[]} Array of normalized terms sorted by length descending
 */
export function getHighlightTerms(query) {
  if (!query || typeof query !== 'string') return [];

  const raw = query.trim();
  if (!raw) return [];

  // Remove quotes and punctuation wrappers
  const cleanStr = raw.replace(/["'“”‘’]/g, ' ');
  const rawTokens = cleanStr
    .split(/\s+/)
    .map(t => t.trim().replace(/^[,;:!?\(\)\[\]{}]+|[,;:!?\(\)\[\]{}]+$/g, ''))
    .filter(Boolean);

  if (rawTokens.length === 0) return [];

  // Filter out stop words only when multiple words exist
  let meaningfulTokens = rawTokens;
  if (rawTokens.length > 1) {
    const withoutStop = rawTokens.filter(t => !STOP_WORDS.has(t.toLowerCase()));
    if (withoutStop.length > 0) {
      meaningfulTokens = withoutStop;
    }
  }

  const termSet = new Set();

  // If multi-word query, include the full contiguous phrase so phrases highlight as a block
  if (rawTokens.length > 1) {
    const fullPhrase = rawTokens.join(' ').toLowerCase();
    if (fullPhrase.length >= 3) {
      termSet.add(fullPhrase);
    }
  }

  for (const token of meaningfulTokens) {
    const lower = token.toLowerCase();
    
    // Accept tokens that are at least 2 chars, or single digits (e.g., Table 2, Class 1)
    if (lower.length >= 2 || /^\d$/.test(lower)) {
      termSet.add(lower);
    }

    // If token starts with cl. or clause, also add bare clause number
    const bareClause = lower.replace(/^(?:cl(?:ause|\.)?)\s*/i, '');
    if (bareClause && bareClause !== lower && (bareClause.length >= 2 || /^\d$/.test(bareClause))) {
      termSet.add(bareClause);
    }

    // Add spelling synonyms
    if (SPELLING_SYNONYMS[lower]) {
      for (const syn of SPELLING_SYNONYMS[lower]) {
        termSet.add(syn.toLowerCase());
      }
    }
  }

  // Convert to array and sort by length descending so longer phrases/words match first
  return Array.from(termSet).sort((a, b) => b.length - a.length);
}

/**
 * Builds an optimized capturing RegExp for text splitting with word boundaries.
 * 
 * @param {string[]} terms - Array of highlight terms
 * @returns {RegExp|null} Compiled capturing RegExp or null if empty
 */
export function buildHighlightRegex(terms) {
  if (!terms || !Array.isArray(terms) || terms.length === 0) return null;

  const patterns = terms
    .filter(t => typeof t === 'string' && t.trim().length > 0)
    .map(term => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const startsWord = /^\w/.test(term);
      const endsWord = /\w$/.test(term);

      // Prefix boundary: only match at start of word if term starts with a word character
      const prefix = startsWord ? '\\b' : '';

      // Suffix boundary:
      // - If term is short (length <= 3) or has digits, enforce word boundary so "ice" doesn't match "service", and "5.3.1.1" doesn't match "5.3.1.10"
      // - Otherwise, allow prefix matching so "clear" matches "clearance"
      const suffix = (endsWord && (term.length <= 3 || /\d/.test(term))) ? '\\b' : '';

      return `${prefix}${escaped}${suffix}`;
    });

  if (patterns.length === 0) return null;

  return new RegExp(`(${patterns.join('|')})`, 'gi');
}

/**
 * Splits plain text into structured chunks of matched and unmatched segments.
 *
 * @param {string} text - The input text to split
 * @param {RegExp|null} regex - The compiled capturing RegExp
 * @returns {Array<{ text: string, isMatch: boolean }>}
 */
export function splitTextWithMatches(text, regex) {
  if (text === null || text === undefined) return [];
  const str = typeof text === 'string' ? text : String(text);
  if (!str) return [];

  if (!regex) {
    return [{ text: str, isMatch: false }];
  }

  const parts = str.split(regex);
  if (parts.length <= 1) {
    return [{ text: str, isMatch: false }];
  }

  const result = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === '') continue; // Skip empty delimiter artifacts

    // In a capturing split, odd indices correspond to matched captures
    const isMatch = (i % 2 === 1);
    result.push({ text: part, isMatch });
  }

  return result;
}
