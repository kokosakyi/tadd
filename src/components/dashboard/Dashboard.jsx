import React from 'react';
import { Ruler, Wind, TreePine, BookOpen, FolderPlus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export default function Dashboard({ onNavigate }) {
  const { activeProject, setIsProjectWizardOpen } = useProject();

  const workflowModules = [
    {
      id: 'clearance',
      phase: 'Phase 4: Clearances',
      title: 'Vertical Clearances & Compliance (A2 / M3)',
      description:
        'Evaluate minimum vertical & road clearances per CSA C22.3 No. 1 Table 2 with voltage adders, altitude adjustments, and owner safety buffers.',
      icon: Ruler,
      color: 'linear-gradient(135deg, rgba(14, 165, 233, 0.92), rgba(37, 99, 235, 0.88))',
      glow: 'rgba(14, 165, 233, 0.36)'
    },
    {
      id: 'weather',
      phase: 'Phase 1: Criteria & Basis of Design',
      title: 'Weather Criteria & Load Case Matrix (A3 / A4 / M2)',
      description:
        'Query 682-station Canadian geoclimatic data, scale return periods (50–500 yr), apply legal minimums, and generate unified load matrices with CSV & .cri export.',
      icon: Wind,
      color: 'linear-gradient(135deg, rgba(16, 185, 129, 0.92), rgba(5, 150, 105, 0.88))',
      glow: 'rgba(16, 185, 129, 0.36)'
    },
    {
      id: 'wood_pole',
      phase: 'Phase 5: Structures & Framing',
      title: 'Wood Pole Loading & Structural Sizing (A6 / M3)',
      description:
        'Analyze groundline bending moments, wind on tapered pole, CSA C22.3 Table 31 OCF load factors, CSA O15 fiber stresses, and class recommendations.',
      icon: TreePine,
      color: 'linear-gradient(135deg, rgba(245, 158, 11, 0.92), rgba(217, 119, 6, 0.88))',
      glow: 'rgba(245, 158, 11, 0.36)'
    },
    {
      id: 'code_library',
      phase: 'Reference: Code-as-Data',
      title: 'Digitized Code Reference Library (A1 / §8.8)',
      description:
        'Interactive, searchable repository of CSA C22.3 No. 1, No. 60826, and CSA O15 clauses, digitized tables, footnotes, and topic cross-references.',
      icon: BookOpen,
      color: 'linear-gradient(135deg, rgba(139, 92, 246, 0.92), rgba(109, 40, 217, 0.88))',
      glow: 'rgba(139, 92, 246, 0.36)'
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Active Project Liquid Glass Hero Card */}
      <section
        className="glass-panel"
        style={{
          padding: 'clamp(1.4rem, 2.8vw, 2.15rem)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
              <span className="badge badge-info">ACTIVE DESIGN PROJECT</span>
              <span
                className="mono"
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  padding: '0.18rem 0.6rem',
                  borderRadius: '9999px',
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {activeProject?.code}
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.45rem, 2.6vw, 2rem)',
                fontWeight: 700,
                color: 'var(--text-main)',
                margin: '0 0 0.85rem',
                letterSpacing: '-0.028em'
              }}
            >
              {activeProject?.name}
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div className="glass-inset" style={{ padding: '0.42rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-main)' }}>Facility:</strong> {activeProject?.facilityType} ({activeProject?.operatingVoltageKv} kV)
              </div>
              <div className="glass-inset" style={{ padding: '0.42rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-main)' }}>Province:</strong> {activeProject?.province}
              </div>
              <div className="glass-inset" style={{ padding: '0.42rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-main)' }}>Overlay:</strong> {activeProject?.ownerOverlayId?.replace('_', ' ').toUpperCase()}
              </div>
              <div
                className="badge badge-pass"
                style={{ padding: '0.42rem 0.85rem', fontSize: '0.78rem' }}
              >
                <ShieldCheck size={14} />
                <span>{activeProject?.pinnedSnapshot}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsProjectWizardOpen(true)}
            className="btn-primary"
            style={{ padding: '0.7rem 1.35rem', alignSelf: 'center' }}
          >
            <FolderPlus size={18} />
            <span>Setup New Project</span>
          </button>
        </div>
      </section>

      {/* Overview Header */}
      <div style={{ padding: '0.15rem 0.25rem' }}>
        <h2
          style={{
            fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '0.35rem',
            letterSpacing: '-0.022em'
          }}
        >
          Engineering Workflow Modules
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, maxWidth: '760px', lineHeight: 1.55 }}>
          Execute unit-aware, verified calculations conforming to the CSA C22.3 and CSA O15 standards family. Every result produces an immutable audit trace record.
        </p>
      </div>

      {/* Liquid Glass Modules Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
          gap: '1.35rem'
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
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
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
                    marginBottom: '1.25rem'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '15px',
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
                    <Icon size={22} />
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                    {m.phase}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.14rem',
                    fontWeight: 660,
                    color: 'var(--text-main)',
                    marginBottom: '0.6rem',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {m.title}
                </h3>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {m.description}
                </p>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--accent-cyan)',
                  fontWeight: 650,
                  fontSize: '0.85rem'
                }}
              >
                <span>Launch Engine</span>
                <ArrowRight size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
