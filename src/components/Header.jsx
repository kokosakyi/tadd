import React from 'react';
import { Zap, Sun, Moon, Ruler, BookOpen, Layers, Home } from 'lucide-react';

export default function Header({ unit, setUnit, theme, setTheme, onOpenTableManager, onNavigateHome, currentView }) {
  return (
    <header className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {onNavigateHome && currentView !== 'dashboard' && (
            <button
              onClick={onNavigateHome}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                borderRadius: '8px',
                marginRight: '0.5rem'
              }}
              title="Back to Dashboard"
            >
              <Home size={20} />
            </button>
          )}
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Zap size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>
                CSA C22 T&D Pole Line Suite
              </h1>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                CSA C22.3 No. 1 Standard
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Overhead Line Clearances, Structural Loading & Stringing Engineering
            </p>
          </div>
        </div>

        {/* Global Controls & Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Reference Table Manager Button */}
          <button 
            className="btn-secondary" 
            onClick={onOpenTableManager}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
            title="View & Edit Baseline CSA Clearance Tables"
          >
            <BookOpen size={16} />
            <span>CSA Tables</span>
          </button>

          {/* Unit System Switcher */}
          <div style={{
            display: 'inline-flex',
            background: 'var(--bg-secondary)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setUnit('metric')}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
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
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                borderRadius: '6px',
                background: unit === 'imperial' ? 'var(--accent-blue)' : 'transparent',
                color: unit === 'imperial' ? '#fff' : 'var(--text-muted)',
                fontWeight: unit === 'imperial' ? '700' : '500'
              }}
            >
              Imperial (ft)
            </button>
          </div>

          {/* Dark / Light Theme Toggle */}
          <button
            className="btn-secondary"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ padding: '0.5rem', borderRadius: '8px' }}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#0284c7" />}
          </button>

        </div>

      </div>
    </header>
  );
}
