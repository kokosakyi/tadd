import React, { useState, useEffect, useMemo } from 'react';
import { X, FolderPlus, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

const FACILITY_OPTIONS = [
  { value: 'Distribution', label: 'Distribution Line' },
  { value: 'Joint-Use', label: 'Joint-Use / Telecom Attachment' },
  { value: 'Transmission', label: 'Transmission Line' }
].sort((a, b) => a.label.localeCompare(b.label));

export default function ProjectSetupModal() {
  const { isProjectWizardOpen, setIsProjectWizardOpen, createProject, provinces, overlays } = useProject();

  const sortedProvinces = useMemo(
    () => [...provinces].sort((a, b) => a.localeCompare(b)),
    [provinces]
  );

  const sortedOverlays = useMemo(
    () => [...overlays].sort((a, b) => a.label.localeCompare(b.label)),
    [overlays]
  );

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'New Line Design Project',
    code: `PRJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    facilityType: FACILITY_OPTIONS[0].value,
    operatingVoltageKv: 25.0,
    province: sortedProvinces.includes('Ontario') ? 'Ontario' : (sortedProvinces[0] || 'Alberta'),
    ownerOverlayId: sortedOverlays[0]?.id || 'csa_std',
    customBufferM: 0.3
  });

  useEffect(() => {
    if (!isProjectWizardOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsProjectWizardOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isProjectWizardOpen, setIsProjectWizardOpen]);

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
      role="dialog"
      aria-modal="true"
      aria-label="Project Setup Wizard (M1)"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsProjectWizardOpen(false);
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(2, 6, 23, 0.46)',
        backdropFilter: 'blur(22px) saturate(160%)',
        WebkitBackdropFilter: 'blur(22px) saturate(160%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
    >
      <div
        className="glass-panel animate-spring-modal"
        style={{
          width: '100%',
          maxWidth: '620px',
          borderRadius: 'var(--radius-modal, 28px)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border-strong)'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.35rem 1.65rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-inset)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '13px',
                background: 'var(--accent-primary)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
              }}
            >
              <FolderPlus size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)', fontWeight: 660 }}>
                Project Setup Wizard (M1)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.1rem 0 0' }}>
                Step {step} of 4:{' '}
                {step === 1
                  ? 'Project Scope'
                  : step === 2
                    ? 'Jurisdiction & Location'
                    : step === 3
                      ? 'Owner Overlays'
                      : 'Snapshot Pinning'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsProjectWizardOpen(false)}
            className="btn-secondary"
            style={{ width: '36px', height: '36px', padding: 0 }}
            title="Close modal"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Progress Pills */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.45rem',
            padding: '0.85rem 1.65rem 0'
          }}
        >
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              style={{
                height: '5px',
                borderRadius: '9999px',
                background: idx <= step ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                boxShadow: idx <= step ? '0 0 10px rgba(56, 189, 248, 0.4)' : 'none',
                transition: 'background 0.25s ease'
              }}
            />
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.5rem 1.65rem', minHeight: '290px' }}>
            {/* Step 1: Basics */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div>
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div>
                    <label>Project Code / AFE</label>
                    <input
                      type="text"
                      className="mono"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    />
                  </div>

                  <div>
                    <label>Facility Type</label>
                    <select
                      value={formData.facilityType}
                      onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                    >
                      {FACILITY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label>Operating Voltage (kV Line-to-Line)</label>
                  <input
                    type="number"
                    className="mono"
                    step="0.1"
                    min="0.1"
                    max="1000"
                    value={formData.operatingVoltageKv}
                    onChange={(e) => setFormData({ ...formData, operatingVoltageKv: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div className="glass-inset" style={{ padding: '0.95rem 1.1rem' }}>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.55 }}>
                    📍 The jurisdiction establishes which provincial regulations (e.g. O.Reg 22/04, BC Safety Reg) and regional loading zones apply.
                  </p>
                </div>

                <div>
                  <label>Canadian Province / Territory</label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  >
                    {sortedProvinces.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Owner Overlays */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label>Utility Standards Overlay</label>
                  <select
                    value={formData.ownerOverlayId}
                    onChange={(e) => setFormData({ ...formData, ownerOverlayId: e.target.value })}
                  >
                    {sortedOverlays.map((ovl) => (
                      <option key={ovl.id} value={ovl.id}>
                        {ovl.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.ownerOverlayId === 'custom' && (
                  <div>
                    <label>Custom Safety / Re-Sag Clearance Buffer (m)</label>
                    <input
                      type="number"
                      className="mono"
                      step="0.05"
                      min="0"
                      value={formData.customBufferM}
                      onChange={(e) => setFormData({ ...formData, customBufferM: e.target.value })}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Snapshot Pinning */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div className="glass-inset" style={{ padding: '1.1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                    <span className="status-dot pass" />
                    <span style={{ fontWeight: 650, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      Ready to Pin Library Snapshot
                    </span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
                    Project calculations will be locked and audited against <strong>CSA C22.3 No. 1:2020</strong> and <strong>CSA C22.3 No. 60826:2010</strong> with immutable trace records.
                  </p>
                </div>

                <div
                  className="glass-inset"
                  style={{
                    padding: '1.1rem 1.25rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem'
                  }}
                >
                  <div>
                    <strong>Project:</strong> {formData.name} ({formData.code})
                  </div>
                  <div>
                    <strong>Voltage:</strong> {formData.operatingVoltageKv} kV ({formData.facilityType})
                  </div>
                  <div>
                    <strong>Province:</strong> {formData.province}
                  </div>
                  <div>
                    <strong>Overlay:</strong> {sortedOverlays.find((o) => o.id === formData.ownerOverlayId)?.label}
                  </div>
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
              padding: '1.05rem 1.65rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-inset)'
            }}
          >
            {step > 1 ? (
              <button type="button" onClick={handleBack} className="btn-secondary">
                <ChevronLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button type="button" onClick={handleNext} className="btn-primary">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button type="submit" className="btn-primary">
                <CheckCircle2 size={16} /> Create &amp; Pin Project
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
