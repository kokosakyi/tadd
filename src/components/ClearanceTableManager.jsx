import React, { useState } from 'react';
import { CSA_VOLTAGE_CLASSES, CROSSING_CATEGORIES } from '../data/csaClearanceTables';
import { convertMetersToUnit } from '../utils/clearanceCalculator';
import { X, Save, RotateCcw, Table, Edit3, Check } from 'lucide-react';

export default function ClearanceTableManager({ isOpen, onClose, customTables, setCustomTables, unit }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('ground');
  const [editedValues, setEditedValues] = useState(customTables);

  const categories = CROSSING_CATEGORIES.filter(c => {
    if (activeTab === 'ground') return c.type === 'ground';
    if (activeTab === 'structure') return c.type === 'structure';
    return c.type === 'crossing' || c.type === 'joint_use';
  });

  const handleCellEdit = (catId, vClassId, val) => {
    const num = parseFloat(val);
    setEditedValues(prev => ({
      ...prev,
      [catId]: {
        ...prev[catId],
        [vClassId]: isNaN(num) ? 0 : num
      }
    }));
  };

  const handleSave = () => {
    setCustomTables(editedValues);
    onClose();
  };

  const handleReset = () => {
    const defaults = {};
    CROSSING_CATEGORIES.forEach(cat => {
      defaults[cat.id] = { ...cat.baseClearances };
    });
    setEditedValues(defaults);
    setCustomTables(defaults);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        background: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Table size={22} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>
              CSA C22.3 No. 1 Baseline Clearance Lookup Tables
            </h2>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        {/* Category Tabs */}
        <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn-secondary"
            onClick={() => setActiveTab('ground')}
            style={{
              borderColor: activeTab === 'ground' ? 'var(--accent-cyan)' : 'var(--border-color)',
              background: activeTab === 'ground' ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
            }}
          >
            Ground & Terrain Clearances
          </button>
          <button
            className="btn-secondary"
            onClick={() => setActiveTab('structure')}
            style={{
              borderColor: activeTab === 'structure' ? 'var(--accent-cyan)' : 'var(--border-color)',
              background: activeTab === 'structure' ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
            }}
          >
            Building & Structure Clearances
          </button>
          <button
            className="btn-secondary"
            onClick={() => setActiveTab('crossings')}
            style={{
              borderColor: activeTab === 'crossings' ? 'var(--accent-cyan)' : 'var(--border-color)',
              background: activeTab === 'crossings' ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
            }}
          >
            Line Crossing & Joint Use
          </button>
        </div>

        {/* Scrollable Table View */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', minWidth: '220px' }}>Location Category</th>
                {CSA_VOLTAGE_CLASSES.filter(v => v.id !== 'custom').map(v => (
                  <th key={v.id} style={{ padding: '0.75rem', textAlign: 'center', minWidth: '100px' }}>
                    {v.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                    {cat.title}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                      {cat.description}
                    </div>
                  </td>
                  {CSA_VOLTAGE_CLASSES.filter(v => v.id !== 'custom').map(v => {
                    const currentVal = editedValues[cat.id]?.[v.id] ?? cat.baseClearances[v.id] ?? 5.5;
                    return (
                      <td key={v.id} style={{ padding: '0.5rem', textAlign: 'center' }}>
                        <input
                          type="number"
                          step="0.1"
                          value={currentVal}
                          onChange={(e) => handleCellEdit(cat.id, v.id, e.target.value)}
                          style={{
                            width: '80px',
                            textAlign: 'center',
                            fontFamily: 'var(--font-mono)',
                            padding: '0.35rem',
                            fontSize: '0.85rem'
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn-secondary" onClick={handleReset} style={{ fontSize: '0.85rem' }}>
            <RotateCcw size={16} /> Reset Standard Defaults
          </button>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave}>
              <Save size={16} /> Save Table Overrides
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
