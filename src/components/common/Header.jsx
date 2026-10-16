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
    <header className="glass-panel" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem', borderRadius: '14px' }}>
      {/* Top Row: Brand, Project Selector, Snapshot Badge, Utilities */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem', marginBottom: '0.85rem' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Zap size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                LineDesk <span style={{ color: 'var(--accent-cyan)' }}>CA</span>
              </span>
              <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                CSA C22.3 / O15
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Overhead Transmission & Distribution Engineering System
            </p>
          </div>
        </div>

        {/* Project Context & Snapshot Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Active Project Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-secondary)', padding: '0.25rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <FolderKanban size={16} color="var(--accent-cyan)" />
            <select
              value={activeProject?.id || ''}
              onChange={(e) => switchProject(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none',
                maxWidth: '220px'
              }}
              title="Active Engineering Project"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
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
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            title="Create a new engineering project (M1 Wizard)"
          >
            <Plus size={15} />
            <span>New Project</span>
          </button>

          {/* Pinned Snapshot Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}
            title="Pinned Code Library Snapshot"
          >
            <ShieldCheck size={14} />
            <span>{activeProject?.pinnedSnapshot || 'C22.3-1:2020'}</span>
          </div>

          {/* Unit Toggle */}
          <div style={{
            display: 'inline-flex',
            background: 'var(--bg-secondary)',
            padding: '2px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setUnit('metric')}
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                borderRadius: '6px',
                background: unit === 'metric' ? 'var(--accent-blue)' : 'transparent',
                color: unit === 'metric' ? '#fff' : 'var(--text-muted)',
                fontWeight: unit === 'metric' ? '700' : '500'
              }}
            >
              Metric (m)
            </button>
            <button
              onClick={() => setUnit('imperial')}
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                borderRadius: '6px',
                background: unit === 'imperial' ? 'var(--accent-blue)' : 'transparent',
                color: unit === 'imperial' ? '#fff' : 'var(--text-muted)',
                fontWeight: unit === 'imperial' ? '700' : '500'
              }}
            >
              Imperial (ft)
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn-secondary"
            style={{ padding: '0.35rem 0.5rem', borderRadius: '8px' }}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Bottom Row: Navigation Tabs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: isActive ? '600' : '500',
                background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
