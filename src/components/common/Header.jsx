import React, { useMemo } from 'react';
import {
  Zap,
  Sun,
  Moon,
  Plus,
  FolderKanban,
  BookOpen,
  Ruler,
  Wind,
  TreePine,
  Compass,
  LayoutDashboard,
  Search,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', mobileLabel: 'Home', icon: LayoutDashboard },
  { id: 'clearance', label: 'Clearances', mobileLabel: 'Clearance', icon: Ruler },
  { id: 'weather', label: 'Weather Criteria', mobileLabel: 'Weather', icon: Wind },
  { id: 'wood_pole', label: 'Pole Sizing', mobileLabel: 'Poles', icon: TreePine },
  { id: 'asce_tower', label: 'Tower Design (ASCE 10)', mobileLabel: 'Towers', icon: Compass },
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

export default function Header({
  currentView,
  onNavigate,
  theme,
  setTheme,
  isSidebarCollapsed = false,
  onToggleSidebar,
  onOpenCommandPalette
}) {
  const { projects, activeProject, switchProject, setIsProjectWizardOpen } = useProject();

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.name.localeCompare(b.name)),
    [projects]
  );

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <>
      {/* Desktop Floating Liquid Glass Sidebar (>= 1024px) */}
      <aside
        className={`glass-sidebar${isSidebarCollapsed ? ' sidebar-collapsed' : ''}`}
        aria-label="Desktop Navigation Sidebar"
      >
        <div>
          {/* Brand Lockup & Collapse Toggle */}
          <div
            className="sidebar-brand-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
              gap: '0.55rem',
              padding: isSidebarCollapsed ? '0.25rem 0 0.9rem' : '0.25rem 0.25rem 1rem',
              borderBottom: '1px solid var(--border-subtle)',
              flexDirection: isSidebarCollapsed ? 'column' : 'row'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.72rem', minWidth: 0 }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '13px',
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
                <Zap size={20} color="#ffffff" />
              </div>
              {!isSidebarCollapsed && (
                <div style={{ minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: '1.08rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      letterSpacing: '-0.025em',
                      display: 'block',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    LineDesk <span style={{ color: 'var(--accent-cyan)' }}>CA</span>
                  </span>
                  <p
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      margin: '0.08rem 0 0',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.3,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Overhead T&amp;D Suite
                  </p>
                </div>
              )}
            </div>

            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="btn-secondary sidebar-collapse-btn"
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={isSidebarCollapsed ? 'Expand sidebar ([)' : 'Collapse sidebar ([)'}
                style={{
                  width: '30px',
                  height: '30px',
                  padding: 0,
                  flexShrink: 0
                }}
              >
                {isSidebarCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
              </button>
            )}
          </div>

          {/* Quick Command Palette Search Trigger */}
          {onOpenCommandPalette && (
            <div style={{ marginTop: '0.85rem' }}>
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="sidebar-search-trigger"
                aria-label="Open Global Command Palette"
                title="Quick Search (Ctrl+K)"
              >
                <Search size={15} style={{ flexShrink: 0, color: 'var(--accent-cyan)' }} />
                {!isSidebarCollapsed && (
                  <>
                    <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Quick search...
                    </span>
                    <kbd className="sidebar-kbd mono">Ctrl K</kbd>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Primary Workspace Modules */}
          <div style={{ marginTop: '0.85rem' }}>
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
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`sidebar-nav-btn${isActive ? ' active' : ''}`}
                  >
                    <span className="sidebar-nav-icon">
                      <Icon size={17} />
                    </span>
                    {!isSidebarCollapsed && (
                      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.label}
                      </span>
                    )}
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
            gap: '0.6rem',
            marginTop: '1rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)',
            alignItems: isSidebarCollapsed ? 'center' : 'stretch'
          }}
        >
          {/* Active Project Frosted Capsule Well */}
          {isSidebarCollapsed ? (
            <button
              type="button"
              onClick={() => onToggleSidebar?.()}
              className="btn-secondary"
              style={{ width: '40px', height: '40px', padding: 0 }}
              title={`Active Project: ${activeProject?.name || 'Standard'} — Click to expand sidebar`}
              aria-label={`Active Project: ${activeProject?.name || 'Standard'}`}
            >
              <FolderKanban size={16} color="var(--accent-cyan)" />
            </button>
          ) : (
            <div className="glass-inset" style={{ padding: '0.65rem 0.7rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
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
                  Project
                </span>
                <button
                  type="button"
                  onClick={() => setIsProjectWizardOpen(true)}
                  className="btn-secondary"
                  style={{ padding: '0.18rem 0.52rem', fontSize: '0.68rem', gap: '0.2rem' }}
                  title="Create a new engineering project"
                >
                  <Plus size={11} />
                  <span>New</span>
                </button>
              </div>

              <select
                aria-label="Active Engineering Project"
                value={activeProject?.id || ''}
                onChange={(e) => switchProject(e.target.value)}
                style={{
                  padding: '0.42rem 1.85rem 0.42rem 0.6rem',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  borderRadius: '10px'
                }}
                title="Active Engineering Project"
              >
                {sortedProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.operatingVoltageKv} kV - {p.province})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Theme Toggle Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-secondary"
              style={{
                width: isSidebarCollapsed ? '40px' : '100%',
                height: isSidebarCollapsed ? '40px' : '36px',
                padding: isSidebarCollapsed ? 0 : '0 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.76rem',
                fontWeight: 600
              }}
              title="Toggle theme (Light / Dark)"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              {!isSidebarCollapsed && (
                <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Compact Liquid Glass Top Bar (< 1024px) */}
      <header className="glass-mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'var(--accent-primary)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
              }}
            >
              <Zap size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              LineDesk <span style={{ color: 'var(--accent-cyan)' }}>CA</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
            {onOpenCommandPalette && (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="btn-secondary"
                style={{ width: '32px', height: '32px', padding: 0 }}
                title="Quick Search (Ctrl+K)"
                aria-label="Open Mobile Quick Search"
              >
                <Search size={14} />
              </button>
            )}

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

        {/* Mobile Active Project Switcher Pill */}
        <div className="mobile-project-switcher-row">
          <FolderKanban size={14} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
          <select
            aria-label="Mobile Active Engineering Project"
            value={activeProject?.id || ''}
            onChange={(e) => switchProject(e.target.value)}
            className="mobile-project-select"
            title="Switch Active Engineering Project"
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
