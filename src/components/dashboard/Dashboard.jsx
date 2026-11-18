import React from 'react';
import { Ruler, Wind, TreePine, BookOpen, FolderPlus, ArrowRight } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export default function Dashboard({ onNavigate }) {
  const { activeProject, setIsProjectWizardOpen } = useProject();

  const workflowModules = [
    {
      id: 'clearance',
      badge: 'CSA C22.3 No. 1',
      title: 'Vertical Clearances',
      description:
        'Check ground, road, and crossing clearances with voltage adders, altitude adjustments, and live sag profiles.',
      icon: Ruler,
      color: 'linear-gradient(135deg, rgba(14, 165, 233, 0.92), rgba(37, 99, 235, 0.88))',
      glow: 'rgba(14, 165, 233, 0.36)'
    },
    {
      id: 'weather',
      badge: 'CSA C22.3 No. 60826',
      title: 'Weather & Load Criteria',
      description:
        'Look up 682 Canadian weather stations, scale return periods, generate load matrices, and export PLS-CADD .cri files.',
      icon: Wind,
      color: 'linear-gradient(135deg, rgba(16, 185, 129, 0.92), rgba(5, 150, 105, 0.88))',
      glow: 'rgba(16, 185, 129, 0.36)'
    },
    {
      id: 'wood_pole',
      badge: 'CSA O15 / ANSI O5.1',
      title: 'Wood Pole Sizing',
      description:
        'Evaluate groundline bending moments, tapered shaft stresses, P-Delta buckling, and recommended pole classes.',
      icon: TreePine,
      color: 'linear-gradient(135deg, rgba(245, 158, 11, 0.92), rgba(217, 119, 6, 0.88))',
      glow: 'rgba(245, 158, 11, 0.36)'
    },
    {
      id: 'code_library',
      badge: '5 Digitized Volumes',
      title: 'Code & Standards Library',
      description:
        'Browse and search clauses, tables, and math equations across CSA C22.3 No. 1, 60826, CSA O15, and ASCE 10-15.',
      icon: BookOpen,
      color: 'linear-gradient(135deg, rgba(139, 92, 246, 0.92), rgba(109, 40, 217, 0.88))',
      glow: 'rgba(139, 92, 246, 0.36)'
    }
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Clean Compact Workspace Header & Active Project Bar */}
      <section
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: 'clamp(1.3rem, 2.2vw, 1.6rem)',
              fontWeight: 700,
              color: 'var(--text-main)',
              margin: '0 0 0.25rem',
              letterSpacing: '-0.025em'
            }}
          >
            Engineering Workspace
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
            Select a module below to run calculations or browse digitized standards.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div
            className="glass-inset"
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <strong style={{ color: 'var(--text-main)' }}>{activeProject?.name}</strong>
            <span>•</span>
            <span className="mono">{activeProject?.operatingVoltageKv} kV</span>
            <span>•</span>
            <span>{activeProject?.province}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsProjectWizardOpen(true)}
            className="btn-secondary"
            style={{ padding: '0.48rem 0.95rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <FolderPlus size={15} />
            <span>New Project</span>
          </button>
        </div>
      </section>

      {/* Clean 2x2 Module Launcher Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '1.25rem'
        }}
      >
        {workflowModules.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              role="button"
              tabIndex={0}
              onClick={() => onNavigate(m.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate(m.id);
                }
              }}
              className="glass-panel glass-card-interactive animate-stagger-item"
              style={{
                '--stagger-index': idx,
                padding: '1.5rem 1.65rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.1rem',
                position: 'relative',
                outline: 'none'
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                      background: m.color,
                      border: '1px solid rgba(255, 255, 255, 0.42)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      flexShrink: 0,
                      boxShadow: `inset 0 1.5px 0 0 rgba(255, 255, 255, 0.52), 0 8px 20px -4px ${m.glow}`
                    }}
                  >
                    <Icon size={21} />
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                    {m.badge}
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 680,
                    color: 'var(--text-main)',
                    marginBottom: '0.45rem',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {m.title}
                </h2>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                  {m.description}
                </p>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--accent-cyan)',
                  fontWeight: 650,
                  fontSize: '0.84rem'
                }}
              >
                <span>Open Module</span>
                <ArrowRight size={15} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
