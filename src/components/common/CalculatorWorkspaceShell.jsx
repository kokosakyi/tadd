import React from 'react';

/**
 * Shared Split-Workspace Layout Shell for Engineering Calculators
 * Desktop (> 1120px & @container workspace >= 880px):
 *   Left/Main column for parameters & sub-tabs + Right sticky live Compliance/Results rail.
 * Mobile / Tablet:
 *   Compact live summary at top followed by touch-scrollable single-line sub-tabs & inputs.
 */
export default function CalculatorWorkspaceShell({
  header,
  tabs = [],
  activeTab,
  onSelectTab,
  summaryRail,
  belowSplit,
  maxWidth = '1380px',
  children
}) {
  return (
    <div
      style={{
        maxWidth,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
    >
      {header}

      {tabs.length > 0 && (
        <div
          className="calc-subtab-strip glass-panel"
          role="tablist"
          aria-label="Calculator sections"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectTab?.(tab.id)}
                className={`calc-subtab-btn${isActive ? ' active' : ''}`}
              >
                {Icon && <Icon size={14} style={{ flexShrink: 0 }} />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {summaryRail ? (
        <div className="calc-split-workspace">
          <div className="calc-split-main">{children}</div>
          <aside className="calc-sticky-rail" aria-label="Live Results Summary">
            {summaryRail}
          </aside>
        </div>
      ) : (
        <div className="calc-split-main">{children}</div>
      )}

      {belowSplit}
    </div>
  );
}
