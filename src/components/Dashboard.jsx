import React from 'react';
import { Ruler, Wind, TreePine, ChevronRight } from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const apps = [
    {
      id: 'clearance',
      title: 'Clearance Engine',
      description: 'Calculate electrical clearances based on CSA standards, accounting for voltage adders and thermal/ice sags.',
      icon: Ruler,
      color: 'linear-gradient(135deg, #0ea5e9, #2563eb)'
    },
    {
      id: 'weather',
      title: 'Weather Criteria & Map',
      description: 'Interactive Canadian geoclimatic station map, reliability scaling, unified load case matrix, and PLS-CADD (.cri) exporter.',
      icon: Wind,
      color: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      id: 'wood_pole',
      title: 'Wood Pole Loading (A6)',
      description: 'Full-line groundline bending moment analysis, Overload Capacity Factors (OCFs), CSA O15 fiber stress checks, and class sizing.',
      icon: TreePine,
      color: 'linear-gradient(135deg, #f59e0b, #d97706)'
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          T&D Engineering Hub
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Select an application below to start your engineering calculations and modeling.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <div
              key={app.id}
              onClick={() => onNavigate(app.id)}
              className="glass-panel"
              style={{
                padding: '2rem',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: app.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: '#fff'
              }}>
                <Icon size={24} />
              </div>
              
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                {app.title}
              </h2>
              
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', flex: 1, marginBottom: '1.5rem' }}>
                {app.description}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                color: '#38bdf8',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Launch Application <ChevronRight size={18} style={{ marginLeft: '4px' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
