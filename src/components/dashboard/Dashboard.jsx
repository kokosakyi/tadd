import React from 'react';
import { Ruler, Wind, TreePine, BookOpen, FolderPlus, ArrowRight, ShieldCheck, CheckCircle2, Layers } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export default function Dashboard({ onNavigate }) {
  const { activeProject, setIsProjectWizardOpen } = useProject();

  const workflowModules = [
    {
      id: 'clearance',
      phase: 'Phase 4: Clearances',
      title: 'Vertical Clearances & Compliance (A2 / M3)',
      description: 'Evaluate minimum vertical & road clearances per CSA C22.3 No. 1 Table 2 with voltage adders, altitude adjustments, and owner safety buffers.',
      icon: Ruler,
      color: 'linear-gradient(135deg, #0ea5e9, #2563eb)'
    },
    {
      id: 'weather',
      phase: 'Phase 1: Criteria & Basis of Design',
      title: 'Weather Criteria & Load Case Matrix (A3 / A4 / M2)',
      description: 'Query 682-station Canadian geoclimatic data, scale return periods (50–500 yr), apply legal minimums, and generate unified load matrices with CSV & .cri export.',
      icon: Wind,
      color: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      id: 'wood_pole',
      phase: 'Phase 5: Structures & Framing',
      title: 'Wood Pole Loading & Structural Sizing (A6 / M3)',
      description: 'Analyze groundline bending moments, wind on tapered pole, CSA C22.3 Table 31 OCF load factors, CSA O15 fiber stresses, and class recommendations.',
      icon: TreePine,
      color: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    {
      id: 'code_library',
      phase: 'Reference: Code-as-Data',
      title: 'Digitized Code Reference Library (A1 / §8.8)',
      description: 'Interactive, searchable repository of CSA C22.3 No. 1, No. 60826, and CSA O15 clauses, digitized tables, footnotes, and topic cross-references.',
      icon: BookOpen,
      color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Active Project Banner Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-glass)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-info" style={{ fontSize: '0.75rem', borderRadius: '6px', padding: '0.2rem 0.55rem' }}>
                ACTIVE DESIGN PROJECT
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                {activeProject?.code}
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
              {activeProject?.name}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div><strong style={{ color: 'var(--text-main)' }}>Facility:</strong> {activeProject?.facilityType} ({activeProject?.operatingVoltageKv} kV)</div>
              <div><strong style={{ color: 'var(--text-main)' }}>Province:</strong> {activeProject?.province}</div>
              <div><strong style={{ color: 'var(--text-main)' }}>Overlay:</strong> {activeProject?.ownerOverlayId?.replace('_', ' ').toUpperCase()}</div>
              <div><strong style={{ color: 'var(--text-main)' }}>Snapshot:</strong> {activeProject?.pinnedSnapshot}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsProjectWizardOpen(true)}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.15rem', borderRadius: '10px' }}
          >
            <FolderPlus size={18} />
            <span>Setup New Project</span>
          </button>
        </div>
      </div>

      {/* Overview Intro */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', letterSpacing: '-0.015em' }}>
          Engineering Workflow Modules
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
          Execute unit-aware, verified calculations conforming to the CSA C22.3 standards family. Every result produces an immutable audit trace record.
        </p>
      </div>

      {/* Modules Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {workflowModules.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              onClick={() => onNavigate(m.id)}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                borderRadius: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--border-color)',
                position: 'relative',
                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glass)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: m.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'var(--bg-inset)', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {m.phase}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.65rem' }}>
                  {m.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {m.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.85rem' }}>
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
