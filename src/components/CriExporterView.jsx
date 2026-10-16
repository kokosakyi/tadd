import React, { useState } from 'react';

export default function CriExporterView({ criText, fileName = 'Ottawa_150Yr_Criteria.cri' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(criText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Ensure Windows line endings \r\n
    const windowsFormattedText = criText.replace(/\r?\n/g, '\r\n');
    const blob = new Blob([windowsFormattedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel card-padding" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="module-badge">M6</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              PLS-CADD ASCII Criteria (.cri) Publisher (Module 6)
            </h3>
            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Windows-standard plain ASCII text criteria file formatted with metric units (cm ice) for direct PLS-CADD ingestion.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={handleCopy} style={{ padding: '0.4rem 0.85rem', fontSize: '0.825rem' }}>
            {copied ? '✓ Copied to Clipboard!' : 'Copy ASCII Text'}
          </button>
          <button className="btn btn-primary" onClick={handleDownload} style={{ padding: '0.4rem 0.85rem', fontSize: '0.825rem' }}>
            Export {fileName}
          </button>
        </div>
      </div>

      <pre style={{
        background: '#0d1117',
        color: '#c9d1d9',
        padding: '1.25rem',
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontFamily: 'ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, Monaco, "Courier New", monospace',
        overflowX: 'auto',
        border: '1px solid var(--border-color)',
        maxHeight: '420px',
        lineHeight: '1.45',
        margin: 0,
        whiteSpace: 'pre',
        tabSize: 4
      }}>
        {criText}
      </pre>

      {/* Module Explanation */}
      <details className="module-explainer">
        <summary>Module 6 — Engineering Basis & Formatting Rules</summary>
        <div className="explainer-body">
          <p>
            <strong>Module 6: PLS-CADD ASCII Criteria (.cri) File Publisher</strong> compiles the calculated
            data from Modules 1–5 and injects it into a standard PLS-CADD Criteria ASCII template.
          </p>
          <p><strong>Target File Structure & Technical Formatting Rules:</strong></p>
          <ul>
            <li><strong>File Format:</strong> Plain text ASCII with Windows-standard line endings (<code>\r\n</code>).</li>
            <li><strong>Delimiters:</strong> Space-delimited table columns.</li>
            <li><strong>String Quoting:</strong> Any text parameter containing spaces must be enclosed in single straight quotes (e.g., <code>'150Yr Extreme Wind'</code>). Omission of quotes will cause parser misalignment and application failure.</li>
            <li><strong>Unit Conversions:</strong> PLS-CADD Metric Ice Units are expressed in <strong>centimeters (cm)</strong>. Values calculated in mm are divided by 10.</li>
            <li><strong>Air Density Factor (Q):</strong> Set to <code>0.049</code> for metric (km/h → Pa) or <code>0.00256</code> for imperial (mph → psf).</li>
            <li><strong>Character Set:</strong> Standard ASCII only. No non-standard UTF-8 characters (°, ², Δ).</li>
          </ul>
          <p><strong>Output Blocks:</strong></p>
          <ul>
            <li><strong>WEATHER_CASES</strong> — Weather case definitions with wind speed, ice thickness, wire temperature, and wind model</li>
            <li><strong>STRUCTURE_LOADS</strong> — Structure loading cases with LRFD load factor multipliers for steel and wood</li>
            <li><strong>CABLE_TENSION_LIMITS</strong> — Cable tension criteria with max %RTS and catenary constant limits per weather case</li>
          </ul>
        </div>
      </details>
    </div>
  );
}
