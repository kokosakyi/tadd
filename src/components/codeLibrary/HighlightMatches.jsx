import React from 'react';
import { splitTextWithMatches } from '../../utils/textHighlight';

/**
 * HighlightMatches component
 * Renders text with search keyword matches wrapped in a styled <mark> element
 * making matching words bold and visually distinct with high contrast.
 */
export default function HighlightMatches({ text, regex, className = 'search-highlight' }) {
  if (text === null || text === undefined) return null;
  const str = typeof text === 'string' ? text : String(text);
  if (!str) return null;

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
