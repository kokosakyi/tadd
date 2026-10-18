import React from 'react';
import { Zap, Sun, Moon, Plus, FolderKanban, ShieldCheck, BookOpen, Ruler, Wind, TreePine, LayoutDashboard } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useUnits } from '../../context/UnitContext';

export default function Header({ currentView, onNavigate, theme, setTheme }) {
  const { projects, activeProject, switchProject, setIsProjectWizardOpen } = useProject();
  const { unit, setUnit } = useUnits();

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Workflow Hub', icon: LayoutDashboard },
    { id: 'clearance', label: 'Clearances', icon: Ruler },
    { id: 'weather', label: 'Weather & Criteria', icon: Wind },
    { id: 'wood_pole', label: 'Pole Loading', icon: TreePine },
    { id: 'code_library', label: 'Code Library', icon: BookOpen }
  ];

  return (
    <header className="glass-panel" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem', borderRadius: 'var(--radius-card, 16px)' }}>
      {/* Top Row: Brand, Project Selector, Snapshot Badge, Utilities */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem', marginBottom: '0.85rem' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-blue) 0%, #60a5fa 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Zap size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
                LineDesk <span style={{ color: 'var(--accent-blue)' }}>CA</span>
              </span>
              <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                CSA C22.3 / O15
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, letterSpacing: '-0.01em' }}>
              Overhead Transmission & Distribution Engineering System
            </p>
          </div>
        </div>

        {/* Project Context & Snapshot Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          
          {/* Active Project Dropdown */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'var(--bg-inset)',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-input, 10px)',
            border: '1px solid var(--border-color)'
          }}>
            <FolderKanban size={15} color="var(--accent-blue)" />
            <select
              value={activeProject?.id || ''}
              onChange={(e) => switchProject(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none',
                maxWidth: '220px',
                padding: 0
              }}
              title="Active Engineering Project"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>
                  {p.name} ({p.operatingVoltageKv} kV - {p.province})
                </option>
              ))}
            </select>
          </div>

          {/* New Project Wizard Button */}
          <button
            type="button"
            onClick={() => setIsProjectWizardOpen(true)}
            className="btn-secondary"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: 'var(--radius-input, 10px)' }}
            title="Create a new engineering project (M1 Wizard)"
          >
            <Plus size={14} />
            <span>New Project</span>
          </button>

          {/* Pinned Snapshot Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-input, 10px)',
              background: 'rgba(48, 209, 88, 0.12)',
              border: '1px solid rgba(48, 209, 88, 0.25)',
              color: 'var(--status-pass)',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}
            title="Pinned Code Library Snapshot"
          >
            <ShieldCheck size={14} />
            <span>{activeProject?.pinnedSnapshot || 'C22.3-1:2020'}</span>
          </div>

          {/* Unit Toggle: Apple Segmented Pill */}
          <div className="segmented-pill-bar">
            <button
              onClick={() => setUnit('metric')}
              className={`segmented-pill-btn${unit === 'metric' ? ' active' : ''}`}
              style={{ padding: '0.24rem 0.65rem', fontSize: '0.74rem' }}
            >
              Metric (m)
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`segmented-pill-btn${unit === 'imperial' ? ' active' : ''}`}
              style={{ padding: '0.24rem 0.65rem', fontSize: '0.74rem' }}
            >
              Imperial (ft)
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn-secondary"
            style={{
              padding: '0.35rem 0.55rem',
              borderRadius: 'var(--radius-input, 10px)',
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)'
            }}
            title="Toggle theme (Light / Dark)"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* Bottom Row: Navigation Tabs in Apple Segmented Pill Container */}
      <nav style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: '0.15rem' }}>
        <div className="segmented-pill-bar" style={{ width: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`segmented-pill-btn${isActive ? ' active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.4rem 0.95rem'
                }}
              >
                <Icon size={15} style={{ opacity: isActive ? 1 : 0.7 }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
