import React, { useMemo } from 'react';
import {
  Zap,
  Sun,
  Moon,
  Plus,
  FolderKanban,
  ShieldCheck,
  BookOpen,
  Ruler,
  Wind,
  TreePine,
  LayoutDashboard
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useUnits } from '../../context/UnitContext';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Workflow Hub', mobileLabel: 'Hub', icon: LayoutDashboard },
  { id: 'clearance', label: 'Clearances', mobileLabel: 'Clearance', icon: Ruler },
  { id: 'weather', label: 'Weather & Criteria', mobileLabel: 'Weather', icon: Wind },
  { id: 'wood_pole', label: 'Pole Loading', mobileLabel: 'Poles', icon: TreePine },
  { id: 'code_library', label: 'Code Library', mobileLabel: 'Library', icon: BookOpen }
];

export function MobileBottomTabBar({ currentView, onNavigate }) {
  return (
    <nav className="glass-bottom-tabbar" aria-label="Mobile Bottom Tab Bar">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`mobile-tab-btn${isActive ? ' active' : ''}`}
          >
            <Icon size={19} strokeWidth={isActive ? 2.35 : 1.9} />
            <span>{item.mobileLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function Header({ currentView, onNavigate, theme, setTheme }) {
  const { projects, activeProject, switchProject, setIsProjectWizardOpen } = useProject();
  const { unit, setUnit } = useUnits();

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.name.localeCompare(b.name)),
    [projects]
  );

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <>
      {/* Desktop Floating Liquid Glass Sidebar (>= 1024px) */}
      <aside className="glass-sidebar" aria-label="Desktop Navigation Sidebar">
        <div>
          {/* Brand Lockup */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.25rem 0.35rem 1.1rem',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'var(--accent-primary)',
                border: '1px solid rgba(255, 255, 255, 0.42)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow:
                  'inset 0 1.5px 0 0 rgba(255, 255, 255, 0.55), 0 8px 20px -4px rgba(14, 165, 233, 0.45)'
              }}
            >
              <Zap size={21} color="#ffffff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '1.12rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    letterSpacing: '-0.025em'
                  }}
                >
                  LineDesk <span style={{ color: 'var(--accent-cyan)' }}>CA</span>
                </span>
                <span className="badge badge-info" style={{ fontSize: '0.62rem', padding: '0.14rem 0.48rem' }}>
                  CSA
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.71rem',
                  color: 'var(--text-muted)',
                  margin: '0.1rem 0 0',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3
                }}
              >
                CSA C22.3 &amp; O15 T&amp;D Suite
              </p>
            </div>
          </div>

          {/* Primary Workspace Modules */}
          <div style={{ marginTop: '1.15rem' }}>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                padding: '0 0.55rem 0.5rem'
              }}
            >
              Workspace
            </div>
            <nav className="sidebar-nav-list" aria-label="Primary Workspace Modules">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`sidebar-nav-btn${isActive ? ' active' : ''}`}
                  >
                    <span className="sidebar-nav-icon">
                      <Icon size={17} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Docked Project & Environment Controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          {/* Active Project Frosted Capsule Well */}
          <div className="glass-inset" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.72rem',
                  fontWeight: 650,
                  color: 'var(--text-secondary)'
                }}
              >
                <FolderKanban size={13} color="var(--accent-cyan)" />
                Active Project
              </span>
              <button
                type="button"
                onClick={() => setIsProjectWizardOpen(true)}
                className="btn-secondary"
                style={{ padding: '0.22rem 0.58rem', fontSize: '0.7rem', gap: '0.25rem' }}
                title="Create a new engineering project (M1 Wizard)"
              >
                <Plus size={12} />
                <span>New Project</span>
              </button>
            </div>

            <select
              aria-label="Active Engineering Project"
              value={activeProject?.id || ''}
              onChange={(e) => switchProject(e.target.value)}
              style={{
                padding: '0.46rem 2rem 0.46rem 0.68rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                borderRadius: '12px'
              }}
              title="Active Engineering Project"
            >
              {sortedProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.operatingVoltageKv} kV - {p.province})
                </option>
              ))}
            </select>

            <div
              className="badge badge-pass"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.28rem 0.55rem',
                fontSize: '0.68rem'
              }}
              title="Pinned Code Library Snapshot"
            >
              <ShieldCheck size={12} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeProject?.pinnedSnapshot || 'C22.3-1:2020'}
              </span>
            </div>
          </div>

          {/* Unit Segmented Pill & Theme Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              className="segmented-pill-bar"
              style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr' }}
            >
              <button
                type="button"
                onClick={() => setUnit('metric')}
                className={`segmented-pill-btn${unit === 'metric' ? ' active' : ''}`}
                style={{ padding: '0.32rem 0.45rem', fontSize: '0.73rem' }}
              >
                Metric (m)
              </button>
              <button
                type="button"
                onClick={() => setUnit('imperial')}
                className={`segmented-pill-btn${unit === 'imperial' ? ' active' : ''}`}
                style={{ padding: '0.32rem 0.45rem', fontSize: '0.73rem' }}
              >
                Imperial (ft)
              </button>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="btn-secondary"
              style={{ width: '36px', height: '36px', padding: 0, flexShrink: 0 }}
              title="Toggle theme (Light / Dark)"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Compact Liquid Glass Top Bar (< 1024px) */}
      <header className="glass-mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '11px',
                background: 'var(--accent-primary)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
              }}
            >
              <Zap size={17} color="#ffffff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  LineDesk <span style={{ color: 'var(--accent-cyan)' }}>CA</span>
                </span>
                <span className="badge badge-info" style={{ fontSize: '0.6rem', padding: '0.1rem 0.42rem' }}>
                  CSA C22.3 / O15
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.38rem', flexShrink: 0 }}>
            <div className="segmented-pill-bar" style={{ padding: '3px' }}>
              <button
                type="button"
                onClick={() => setUnit('metric')}
                className={`segmented-pill-btn${unit === 'metric' ? ' active' : ''}`}
                style={{ padding: '0.22rem 0.5rem', fontSize: '0.7rem' }}
              >
                m
              </button>
              <button
                type="button"
                onClick={() => setUnit('imperial')}
                className={`segmented-pill-btn${unit === 'imperial' ? ' active' : ''}`}
                style={{ padding: '0.22rem 0.5rem', fontSize: '0.7rem' }}
              >
                ft
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsProjectWizardOpen(true)}
              className="btn-secondary"
              style={{ width: '32px', height: '32px', padding: 0 }}
              title="New Engineering Project"
              aria-label="New Engineering Project"
            >
              <Plus size={14} />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="btn-secondary"
              style={{ width: '32px', height: '32px', padding: 0 }}
              title="Toggle theme (Light / Dark)"
              aria-label="Toggle mobile theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select
            aria-label="Active Engineering Project (Mobile)"
            value={activeProject?.id || ''}
            onChange={(e) => switchProject(e.target.value)}
            style={{
              flex: 1,
              padding: '0.42rem 2rem 0.42rem 0.65rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              borderRadius: '12px'
            }}
          >
            {sortedProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.operatingVoltageKv} kV - {p.province})
              </option>
            ))}
          </select>
        </div>
      </header>
    </>
  );
}
