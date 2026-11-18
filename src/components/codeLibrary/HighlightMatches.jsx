import React from 'react';
import { splitTextWithMatches } from '../../utils/textHighlight';
import Latex from '../common/Latex';

/**
 * Regex matching:
 * 1) Labeled block equations on their own line: `- Eq. (X.Y-Z) [optional note]: $$...$$`
 * 2) Standalone block equations: `$$...$$`
 * 3) Inline math expressions: `$...$`
 */
const MATH_TOKEN_REGEX = /(?:^|\n)[ \t]*-\s*(Eq\.\s*\([^)]+\)[^:\n]*):[ \t]*\$\$([\s\S]+?)\$\$[ \t]*(?=\n|$)|(?:^|\n)[ \t]*\$\$([\s\S]+?)\$\$[ \t]*(?=\n|$)|\$((?:\\\$|[^$\n])+)\$/g;

function renderPlainSegment(segment, regex, className, keyPrefix) {
  if (!segment) return null;
  if (!regex) return segment;

  const chunks = splitTextWithMatches(segment, regex);
  if (chunks.length <= 1 && !chunks[0]?.isMatch) {
    return segment;
  }

  return chunks.map((chunk, i) =>
    chunk.isMatch ? (
      <mark key={`${keyPrefix}_${i}`} className={className}>
        {chunk.text}
      </mark>
    ) : (
      chunk.text
    )
  );
}

/**
 * HighlightMatches component
 * Renders text with search keyword matches wrapped in a styled <mark> element
 * and automatically renders inline ($...$) and block ($$...$$) LaTeX equations via KaTeX.
 */
export default function HighlightMatches({ text, regex, className = 'search-highlight' }) {
  if (text === null || text === undefined) return null;
  const str = typeof text === 'string' ? text : String(text);
  if (!str) return null;

  // Fast path when no LaTeX math delimiters are present
  if (!str.includes('$')) {
    if (!regex) {
      return <>{str}</>;
    }
    const chunks = splitTextWithMatches(str, regex);
    if (chunks.length <= 1 && !chunks[0]?.isMatch) {
      return <>{str}</>;
    }
    return (
      <>
        {chunks.map((chunk, i) =>
          chunk.isMatch ? (
            <mark key={i} className={className}>
              {chunk.text}
            </mark>
          ) : (
            chunk.text
          )
        )}
      </>
    );
  }

  // Math-aware parsing path ($...$ inline and $$...$$ display equations)
  const elements = [];
  let lastIndex = 0;
  const matcher = new RegExp(MATH_TOKEN_REGEX.source, 'g');
  let match;
  let tokenIdx = 0;

  while ((match = matcher.exec(str)) !== null) {
    if (match.index > lastIndex) {
      const plain = str.slice(lastIndex, match.index);
      elements.push(
        <React.Fragment key={`txt_${tokenIdx}`}>
          {renderPlainSegment(plain, regex, className, `txt_${tokenIdx}`)}
        </React.Fragment>
      );
    }

    const eqLabel = match[1];
    const labeledBlockMath = match[2];
    const standaloneBlockMath = match[3];
    const inlineMath = match[4];

    if (labeledBlockMath !== undefined) {
      elements.push(
        <div
          key={`eq_lbl_${tokenIdx}`}
          className="calc-eq-item"
          style={{ margin: '0.55rem 0', padding: '0.65rem 0.95rem' }}
        >
          <div className="calc-eq-meta" style={{ marginBottom: '0.25rem' }}>
            <span className="calc-eq-var-badge">
              {renderPlainSegment(eqLabel.trim(), regex, className, `lbl_${tokenIdx}`)}
            </span>
          </div>
          <Latex block math={labeledBlockMath.trim()} />
        </div>
      );
    } else if (standaloneBlockMath !== undefined) {
      elements.push(
        <div
          key={`eq_blk_${tokenIdx}`}
          className="calc-eq-item"
          style={{ margin: '0.5rem 0', padding: '0.55rem 0.85rem' }}
        >
          <Latex block math={standaloneBlockMath.trim()} />
        </div>
      );
    } else if (inlineMath !== undefined) {
      elements.push(
        <Latex
          key={`eq_inl_${tokenIdx}`}
          math={inlineMath.trim()}
          style={{ margin: '0 0.08rem' }}
        />
      );
    }

    lastIndex = matcher.lastIndex;
    tokenIdx++;
  }

  if (lastIndex < str.length) {
    const tail = str.slice(lastIndex);
    elements.push(
      <React.Fragment key={`txt_tail_${tokenIdx}`}>
        {renderPlainSegment(tail, regex, className, `txt_tail_${tokenIdx}`)}
      </React.Fragment>
    );
  }

  return <>{elements}</>;
}
