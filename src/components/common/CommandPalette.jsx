import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  FolderKanban,
  Plus,
  BookOpen,
  Table,
  MapPin,
  CornerDownLeft,
  Compass
} from 'lucide-react';
import { NAV_ITEMS } from './Header';
import { useProject } from '../../context/ProjectContext';
import { searchCodeRegistry } from '../../core/code/codeLibraryRegistry';
import geoData from '../../data/csaGeoDatabase.json';

// Pre-build flat, alphabetically sorted Canadian weather station index once (682 stations)
const ALL_WEATHER_STATIONS = Object.entries(geoData.provinces || {})
  .flatMap(([province, stations]) =>
    (stations || []).map((st) => ({
      province,
      location: st.location,
      searchKey: `${st.location} ${province}`.toLowerCase()
    }))
  )
  .sort((a, b) => a.location.localeCompare(b.location));

/**
 * Global Command Palette (Ctrl/Cmd+K)
 * Instant cross-app navigation across workspace modules, engineering projects,
 * 1,058 digitized CSA/ASCE clauses, 88 tables, and 682 Canadian weather stations.
 */
export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onOpenStation,
  onInspectCitation
}) {
  const { projects, activeProject, switchProject, setIsProjectWizardOpen } = useProject();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 20);
    }
  }, [isOpen]);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.name.localeCompare(b.name)),
    [projects]
  );

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const results = [];

    // 1. Workspace Modules
    const matchingModules = NAV_ITEMS.filter(
      (m) => !q || m.label.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)
    );
    matchingModules.forEach((m) => {
      results.push({
        id: `mod:${m.id}`,
        group: 'Workspace Modules',
        title: m.label,
        subtitle: `Open ${m.label} workspace`,
        icon: m.icon,
        action: () => {
          onNavigate(m.id);
          onClose();
        }
      });
    });

    // 2. Engineering Projects
    const matchingProjects = sortedProjects.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        String(p.province || '').toLowerCase().includes(q) ||
        String(p.operatingVoltageKv || '').includes(q)
    );
    matchingProjects.slice(0, 5).forEach((p) => {
      const isCurrent = p.id === activeProject?.id;
      results.push({
        id: `prj:${p.id}`,
        group: 'Projects',
        title: p.name,
        subtitle: `${p.operatingVoltageKv} kV • ${p.province}${isCurrent ? ' (Active)' : ''}`,
        icon: FolderKanban,
        action: () => {
          switchProject(p.id);
          onClose();
        }
      });
    });

    if (!q || 'new project create'.includes(q)) {
      results.push({
        id: 'prj:new',
        group: 'Projects',
        title: 'Create New Engineering Project',
        subtitle: 'Open Project Setup Wizard',
        icon: Plus,
        action: () => {
          onClose();
          setIsProjectWizardOpen(true);
        }
      });
    }

    // 3. Clauses, Tables & Weather Stations when user types >= 2 chars
    if (q.length >= 2) {
      const codeHits = searchCodeRegistry(query.trim(), { standardId: 'all', section: 'all' });

      (codeHits.tables || []).slice(0, 6).forEach((tbl) => {
        results.push({
          id: `tbl:${tbl.id}`,
          group: 'Digitized Tables',
          title: `${tbl.standardName} — ${tbl.number}`,
          subtitle: tbl.title,
          icon: Table,
          action: () => {
            onClose();
            onInspectCitation(`${tbl.standardName} ${tbl.number}`);
          }
        });
      });

      (codeHits.clauses || []).slice(0, 8).forEach((cl) => {
        results.push({
          id: `cl:${cl.id}`,
          group: 'CSA & ASCE Clauses',
          title: `${cl.standardName} Cl. ${cl.clauseNumber}`,
          subtitle: cl.title,
          icon: BookOpen,
          action: () => {
            onClose();
            onInspectCitation(`${cl.standardName} Cl. ${cl.clauseNumber}`);
          }
        });
      });

      const stationHits = ALL_WEATHER_STATIONS.filter((st) => st.searchKey.includes(q)).slice(0, 8);
      stationHits.forEach((st) => {
        results.push({
          id: `st:${st.province}:${st.location}`,
          group: 'Weather Stations (682)',
          title: st.location,
          subtitle: `${st.province} — Open in Weather & Load Criteria`,
          icon: MapPin,
          action: () => {
            onClose();
            onOpenStation(st.province, st.location);
          }
        });
      });
    }

    return results;
  }, [
    query,
    sortedProjects,
    activeProject,
    onNavigate,
    onClose,
    switchProject,
    setIsProjectWizardOpen,
    onInspectCitation,
    onOpenStation
  ]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (items.length > 0 ? (prev + 1) % items.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (items.length > 0 ? (prev - 1 + items.length) % items.length : 0));
      } else if (e.key === 'Enter' && items[activeIndex]) {
        e.preventDefault();
        items[activeIndex].action();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items, activeIndex, onClose]);

  if (!isOpen) return null;

  // Group items preserving order
  const groupedSections = [];
  const seenGroups = new Map();
  items.forEach((item, flatIdx) => {
    if (!seenGroups.has(item.group)) {
      const sec = { group: item.group, entries: [] };
      seenGroups.set(item.group, sec);
      groupedSections.push(sec);
    }
    seenGroups.get(item.group).entries.push({ ...item, flatIdx });
  });

  return (
    <div
      className="command-palette-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel command-palette-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Global Command Palette"
      >
        {/* Search Header */}
        <div className="command-palette-search-row">
          <Search size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="search"
            aria-label="Search modules, projects, clauses, tables, or weather stations"
            placeholder="Jump to module, CSA/ASCE clause, Table 2, or weather station (e.g. Calgary)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="command-palette-input"
            autoComplete="off"
            spellCheck="false"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="btn-secondary"
              style={{ width: '28px', height: '28px', padding: 0, flexShrink: 0 }}
              aria-label="Clear command palette query"
            >
              <X size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.24rem 0.55rem', fontSize: '0.7rem', flexShrink: 0 }}
            aria-label="Close Command Palette"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="command-palette-results" role="listbox">
          {groupedSections.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
              <Compass size={22} style={{ opacity: 0.5, marginBottom: '0.45rem' }} />
              <div>No matching modules, clauses, tables, or weather stations for &ldquo;{query}&rdquo;.</div>
            </div>
          ) : (
            groupedSections.map((sec) => (
              <div key={sec.group} style={{ marginBottom: '0.65rem' }}>
                <div className="command-palette-group-label">{sec.group}</div>
                {sec.entries.map((entry) => {
                  const Icon = entry.icon;
                  const isActive = entry.flatIdx === activeIndex;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(entry.flatIdx)}
                      onClick={entry.action}
                      className={`command-palette-item${isActive ? ' active' : ''}`}
                    >
                      <span className="command-palette-item-icon">
                        <Icon size={15} />
                      </span>
                      <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            fontWeight: 620,
                            color: 'var(--text-main)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {entry.title}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '0.73rem',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {entry.subtitle}
                        </span>
                      </span>
                      {isActive && (
                        <CornerDownLeft size={14} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="command-palette-footer">
          <span>Type 2+ characters to search 1,058 clauses, 88 tables &amp; 682 Canadian weather stations</span>
          <span className="mono" style={{ opacity: 0.85 }}>↑↓ navigate • ↵ select</span>
        </div>
      </div>
    </div>
  );
}
