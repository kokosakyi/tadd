import React from 'react';
import { CSA_VOLTAGE_CLASSES, CROSSING_CATEGORIES, UTILITY_PRESETS } from '../data/csaClearanceTables';
import { M_TO_FT, FT_TO_M } from '../utils/clearanceCalculator';
import { Sliders, Shield, Zap, MapPin, Thermometer, Snowflake, Layers, AlertCircle } from 'lucide-react';

export default function ClearanceForm({
  params,
  setParams,
  unit,
  calculationResult
}) {
  const handleInputChange = (field, value) => {
    setParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectedVoltageClass = CSA_VOLTAGE_CLASSES.find(v => v.id === params.voltageClassId) || CSA_VOLTAGE_CLASSES[2];
  const selectedCategory = CROSSING_CATEGORIES.find(c => c.id === params.categoryId) || CROSSING_CATEGORIES[0];
  const selectedPreset = UTILITY_PRESETS.find(p => p.id === params.utilityPreset) || UTILITY_PRESETS[0];

  const displayVal = (valInMeters) => {
    if (unit === 'imperial') {
      return (parseFloat(valInMeters) * M_TO_FT).toFixed(2);
    }
    return valInMeters;
  };

  const handleUnitInput = (field, valInCurrentUnit) => {
    const num = parseFloat(valInCurrentUnit) || 0;
    if (unit === 'imperial') {
      setParams(prev => ({ ...prev, [field]: (num * FT_TO_M).toFixed(3) }));
    } else {
      setParams(prev => ({ ...prev, [field]: num }));
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem', borderRadius: '12px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <Sliders size={20} color="var(--accent-cyan)" />
        <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)' }}>
          Design Parameters & Operating Conditions
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* 1. Utility Standard Preset */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Shield size={14} color="var(--accent-cyan)" />
            Utility Baseline Standard Preset
          </label>
          <select
            value={params.utilityPreset}
            onChange={(e) => {
              const preset = UTILITY_PRESETS.find(p => p.id === e.target.value);
              if (preset) {
                setParams(prev => ({
                  ...prev,
                  utilityPreset: preset.id,
                  adderPerKv: preset.adderPerKv,
                  baseThresholdKv: preset.baseVoltageThresholdKv
                }));
              }
            }}
          >
            {UTILITY_PRESETS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {selectedPreset.description}
          </p>
        </div>

        {/* 2. Voltage Classification */}
        <div className="grid-2">
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap size={14} color="var(--accent-amber)" />
              Voltage Class (CSA C22)
            </label>
            <select
              value={params.voltageClassId}
              onChange={(e) => {
                const vc = CSA_VOLTAGE_CLASSES.find(v => v.id === e.target.value);
                if (vc) {
                  setParams(prev => ({
                    ...prev,
                    voltageClassId: vc.id,
                    operatingVoltageKv: vc.nominalKv
                  }));
                }
              }}
            >
              {CSA_VOLTAGE_CLASSES.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Operating Voltage (kV Phase-Phase)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                step="0.1"
                min="0"
                value={params.operatingVoltageKv}
                onChange={(e) => handleInputChange('operatingVoltageKv', e.target.value)}
                style={{ paddingRight: '2.5rem', fontFamily: 'var(--font-mono)' }}
              />
              <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                kV
              </span>
            </div>
          </div>
        </div>

        {/* 3. Surface & Crossing Category */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="var(--accent-purple)" />
            Terrain & Location Category
          </label>
          <select
            value={params.categoryId}
            onChange={(e) => handleInputChange('categoryId', e.target.value)}
          >
            {CROSSING_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.title} ({cat.type.toUpperCase()})
              </option>
            ))}
          </select>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {selectedCategory.description}
          </p>
        </div>

        {/* Custom Override Option */}
        <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none' }}>
              <input
                type="checkbox"
                checked={params.useCustomBaseClearance}
                onChange={(e) => handleInputChange('useCustomBaseClearance', e.target.checked)}
                style={{ width: 'auto' }}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                Override Baseline CSA Clearance Table Value
              </span>
            </label>
          </div>

          {params.useCustomBaseClearance && (
            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem' }}>
                Custom Base Clearance ({unit === 'imperial' ? 'ft' : 'm'})
              </label>
              <input
                type="number"
                step="0.01"
                value={displayVal(params.customBaseClearance)}
                onChange={(e) => handleUnitInput('customBaseClearance', e.target.value)}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
          )}
        </div>

        {/* 4. Pole Geometry & Attachment Heights */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Line Geometry & Pole Heights
          </h3>

          <div className="grid-2" style={{ marginBottom: '0.75rem' }}>
            <div>
              <label>Attachment Height ({unit === 'imperial' ? 'ft' : 'm'})</label>
              <input
                type="number"
                step="0.1"
                value={displayVal(params.attachmentHeightMeters)}
                onChange={(e) => handleUnitInput('attachmentHeightMeters', e.target.value)}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div>
              <label>Initial Midspan Sag ({unit === 'imperial' ? 'ft' : 'm'})</label>
              <input
                type="number"
                step="0.1"
                value={displayVal(params.midspanSagMeters)}
                onChange={(e) => handleUnitInput('midspanSagMeters', e.target.value)}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          <div>
            <label>Obstacle / Crossing Height ({unit === 'imperial' ? 'ft' : 'm'})</label>
            <input
              type="number"
              step="0.1"
              value={displayVal(params.obstacleHeightMeters)}
              onChange={(e) => handleUnitInput('obstacleHeightMeters', e.target.value)}
              style={{ fontFamily: 'var(--font-mono)' }}
            />
          </div>
        </div>

        {/* 5. Side-by-Side Conductor Sag Conditions */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-amber)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Side-by-Side Sag Evaluation Conditions
          </h3>

          <div className="grid-2" style={{ marginBottom: '0.75rem' }}>
            {/* Condition A: Max Operating Thermal Sag */}
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <label style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Thermometer size={14} /> Thermal Sag (75°C - 100°C)
              </label>
              <input
                type="number"
                step="0.05"
                value={displayVal(params.thermalSagBufferMeters)}
                onChange={(e) => handleUnitInput('thermalSagBufferMeters', e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Additional sag under max temp</span>
            </div>

            {/* Condition B: CSA Ice & Wind Weather Sag */}
            <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <label style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Snowflake size={14} /> CSA Ice/Wind Sag (0°C)
              </label>
              <input
                type="number"
                step="0.05"
                value={displayVal(params.iceWindSagBufferMeters)}
                onChange={(e) => handleUnitInput('iceWindSagBufferMeters', e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Additional sag under ice loading</span>
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label>CSA Loading District Zone</label>
              <select
                value={params.csaLoadingZone}
                onChange={(e) => handleInputChange('csaLoadingZone', e.target.value)}
              >
                <option value="heavy">CSA Heavy Loading (12.5mm ice + 400Pa wind)</option>
                <option value="medium">CSA Medium Loading (6.5mm ice + 400Pa wind)</option>
                <option value="light">CSA Light Loading (0mm ice + 600Pa wind)</option>
              </select>
            </div>

            <div>
              <label>Utility Safety Buffer ({unit === 'imperial' ? 'ft' : 'm'})</label>
              <input
                type="number"
                step="0.05"
                value={displayVal(params.utilitySafetyMarginMeters)}
                onChange={(e) => handleUnitInput('utilitySafetyMarginMeters', e.target.value)}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>
        </div>

        {/* 6. Altitude */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <label>Elevation Above Sea Level ({unit === 'imperial' ? 'ft' : 'm'})</label>
          <input
            type="number"
            step="50"
            value={displayVal(params.elevationMeters)}
            onChange={(e) => handleUnitInput('elevationMeters', e.target.value)}
            style={{ fontFamily: 'var(--font-mono)' }}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rule: +3% per 300m above 1000m elevation</span>
        </div>

      </div>

    </div>
  );
}
