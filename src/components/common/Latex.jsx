import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * LaTeX Equation Renderer Component using KaTeX
 *
 * @param {Object} props
 * @param {string} [props.math] - The LaTeX math string (or use children)
 * @param {string} [props.children] - Alternative way to pass LaTeX string
 * @param {boolean} [props.displayMode=false] - If true, renders as a centered display/block equation
 * @param {boolean} [props.block=false] - Alias for displayMode
 * @param {string} [props.className] - Additional CSS class name
 * @param {Object} [props.style] - Inline styles
 */
export default function Latex({
  math,
  children,
  displayMode = false,
  block = false,
  className = '',
  style = {}
}) {
  const tex = math || (typeof children === 'string' ? children : '') || '';
  const isBlock = displayMode || block;

  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: isBlock,
        throwOnError: false,
        output: 'htmlAndMathml'
      });
    } catch (err) {
      console.warn('KaTeX rendering error for equation:', tex, err);
      return `<span class="katex-error">${tex}</span>`;
    }
  }, [tex, isBlock]);

  if (isBlock) {
    return (
      <div
        className={`latex-block-eq ${className}`}
        style={{
          margin: '0.45rem 0',
          padding: '0.35rem 0',
          overflowX: 'auto',
          overflowY: 'hidden',
          maxWidth: '100%',
          textAlign: 'center',
          ...style
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`latex-inline-eq ${className}`}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
