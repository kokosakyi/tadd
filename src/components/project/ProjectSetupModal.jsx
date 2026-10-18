import React, { useState } from 'react';
import { X, FolderPlus, MapPin, Shield, Layers, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export default function ProjectSetupModal() {
  const { isProjectWizardOpen, setIsProjectWizardOpen, createProject, provinces, overlays } = useProject();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'New Line Design Project',
    code: `PRJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    facilityType: 'Distribution',
    operatingVoltageKv: 25.0,
    province: provinces[0] || 'Ontario',
    ownerOverlayId: overlays[0]?.id || 'csa_std',
    customBufferM: 0.3
  });

  if (!isProjectWizardOpen) return null;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProject({
      name: formData.name,
      code: formData.code,
      facilityType: formData.facilityType,
      operatingVoltageKv: parseFloat(formData.operatingVoltageKv) || 25.0,
      province: formData.province,
      ownerOverlayId: formData.ownerOverlayId,
      customBufferM: parseFloat(formData.customBufferM) || 0.0
    });
    setIsProjectWizardOpen(false);
    setStep(1);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-glass)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-inset)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FolderPlus size={22} color="var(--accent-cyan)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)', fontWeight: '600' }}>
                Project Setup Wizard (M1)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Step {step} of 4: {step === 1 ? 'Project Scope' : step === 2 ? 'Jurisdiction & Location' : step === 3 ? 'Owner Overlays' : 'Snapshot Pinning'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsProjectWizardOpen(false)}
            className="btn-secondary"
            style={{ padding: '0.4rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.5rem', minHeight: '300px' }}>
            
            {/* Step 1: Basics */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-input, 10px)', border: '1px solid var(--border-color)', background: 'var(--bg-inset)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                      Project Code / AFE
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-input, 10px)', border: '1px solid var(--border-color)', background: 'var(--bg-inset)', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                      Facility Type
                    </label>
                    <select
                      value={formData.facilityType}
                      onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-input, 10px)', border: '1px solid var(--border-color)', background: 'var(--bg-inset)', color: 'var(--text-main)', outline: 'none' }}
                    >
                      <option value="Distribution">Distribution Line</option>
                      <option value="Transmission">Transmission Line</option>
                      <option value="Joint-Use">Joint-Use / Telecom Attachment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                    Operating Voltage (kV Line-to-Line)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1000"
                    value={formData.operatingVoltageKv}
                    onChange={(e) => setFormData({ ...formData, operatingVoltageKv: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-input, 10px)', border: '1px solid var(--border-color)', background: 'var(--bg-inset)', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', outline: 'none' }}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: 'var(--bg-inset)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', margin: 0 }}>
                    📍 The jurisdiction establishes which provincial regulations (e.g. O.Reg 22/04, BC Safety Reg) and regional loading zones apply.
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                    Canadian Province / Territory
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-input, 10px)', border: '1px solid var(--border-color)', background: 'var(--bg-inset)', color: 'var(--text-main)', outline: 'none' }}
                  >
                    {provinces.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Owner Overlays */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                    Utility Standards Overlay
                  </label>
                  <select
                    value={formData.ownerOverlayId}
                    onChange={(e) => setFormData({ ...formData, ownerOverlayId: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-input, 10px)', border: '1px solid var(--border-color)', background: 'var(--bg-inset)', color: 'var(--text-main)', outline: 'none' }}
                  >
                    {overlays.map((ovl) => (
                      <option key={ovl.id} value={ovl.id}>{ovl.label}</option>
                    ))}
                  </select>
                </div>

                {formData.ownerOverlayId === 'custom' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                      Custom Safety / Re-Sag Clearance Buffer (m)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={formData.customBufferM}
                      onChange={(e) => setFormData({ ...formData, customBufferM: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-input, 10px)', border: '1px solid var(--border-color)', background: 'var(--bg-inset)', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', outline: 'none' }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Snapshot Pinning */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-inset)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className="status-dot pass" />
                    <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      Ready to Pin Library Snapshot
                    </span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                    Project calculations will be locked and audited against <strong>CSA C22.3 No. 1:2020</strong> and <strong>CSA C22.3 No. 60826:2010</strong> with immutable trace records.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-inset)', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', border: '1px solid var(--border-color)' }}>
                  <div><strong>Project:</strong> {formData.name} ({formData.code})</div>
                  <div><strong>Voltage:</strong> {formData.operatingVoltageKv} kV ({formData.facilityType})</div>
                  <div><strong>Province:</strong> {formData.province}</div>
                  <div><strong>Overlay:</strong> {overlays.find(o => o.id === formData.ownerOverlayId)?.label}</div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-inset)'
            }}
          >
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '8px' }}
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '8px' }}
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '8px' }}
              >
                <CheckCircle2 size={16} /> Create & Pin Project
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
