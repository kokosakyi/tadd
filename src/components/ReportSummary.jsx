import React from 'react';
import { convertMetersToUnit, formatValue } from '../utils/clearanceCalculator';
import { FileText, Calculator, Thermometer, Snowflake, ShieldCheck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function ReportSummary({ calculationResult, categoryObj, params, unit }) {
  const {
    baseClearanceM,
    operatingVoltageKv,
    voltageAdderM,
    baseThresholdKv,
    adderPerKv,
    elevationMeters,
    altitudeAdderM,
    thermalSagBufferMeters,
    iceWindSagBufferMeters,
    csaLoadingZone,
    utilitySafetyMarginMeters,
    thermalTotalReqM,
    iceTotalReqM,
    totalRequiredClearanceM,
    governingCondition,
    isIceGoverning,
    attachmentHeightMeters,
    midspanSagMeters,
    obstacleHeightMeters,
    thermalActualClearanceM,
    thermalMarginM,
    iceActualClearanceM,
    iceMarginM,
    actualClearanceM,
    clearanceMarginM,
    status
  } = calculationResult;

  const handlePrintReport = () => {
    window.print();
  };

  const statusColor = status === 'PASS' ? '#10b981' : status === 'WARNING' ? '#f59e0b' : '#f43f5e';

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem', borderRadius: '12px', marginTop: '1.5rem' }}>
      
      {/* Printable Report Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calculator size={20} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)' }}>
            Engineering Calculation & CSA C22 Compliance Report
          </h3>
        </div>

        <div>
          <button className="btn-primary" onClick={handlePrintReport} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
            <FileText size={16} /> Print PDF Engineering Report
          </button>
        </div>
      </div>

      {/* Compliance Status Card */}
      <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', uppercase: true, letterSpacing: '0.05em' }}>
            Governing Clearance Design Condition
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
            {governingCondition}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Net Controlling Safety Margin</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: statusColor }}>
              {convertMetersToUnit(clearanceMarginM, unit)}
            </div>
          </div>

          <div className={`badge badge-${status.toLowerCase()}`} style={{ fontSize: '0.95rem', padding: '0.5rem 0.9rem' }}>
            {status === 'PASS' && <CheckCircle size={18} />}
            {status === 'WARNING' && <AlertTriangle size={18} />}
            {status === 'FAIL' && <XCircle size={18} />}
            <span>{status}</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Evaluation Matrix */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Side-by-Side Conductor Sag State Comparison Matrix
        </h4>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Evaluation Parameter</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: 'var(--accent-amber)' }}>
                  <Thermometer size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  Thermal Operating Sag (Max Temp)
                </th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: 'var(--accent-cyan)' }}>
                  <Snowflake size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  CSA Weather Ice/Wind Sag ({csaLoadingZone.toUpperCase()})
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>Base CSA Clearance (C_base)</td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }} className="mono">{convertMetersToUnit(baseClearanceM, unit)}</td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }} className="mono">{convertMetersToUnit(baseClearanceM, unit)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>Voltage Adder (ΔV @ {operatingVoltageKv} kV)</td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }} className="mono">+{convertMetersToUnit(voltageAdderM, unit)}</td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }} className="mono">+{convertMetersToUnit(voltageAdderM, unit)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>Conductor Sag Buffer Addition</td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: 'var(--accent-amber)' }} className="mono">+{convertMetersToUnit(thermalSagBufferMeters, unit)}</td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: 'var(--accent-cyan)' }} className="mono">+{convertMetersToUnit(iceWindSagBufferMeters, unit)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>Utility Safety Buffer</td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }} className="mono">+{convertMetersToUnit(utilitySafetyMarginMeters, unit)}</td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }} className="mono">+{convertMetersToUnit(utilitySafetyMarginMeters, unit)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                <td style={{ padding: '0.65rem 0.85rem', fontWeight: 'bold' }}>Total Required Minimum Clearance (C_req)</td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontWeight: 'bold' }} className="mono">{convertMetersToUnit(thermalTotalReqM, unit)}</td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontWeight: 'bold' }} className="mono">{convertMetersToUnit(iceTotalReqM, unit)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)' }}>Actual Field Clearance (C_act)</td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }} className="mono">{convertMetersToUnit(thermalActualClearanceM, unit)}</td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }} className="mono">{convertMetersToUnit(iceActualClearanceM, unit)}</td>
              </tr>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <td style={{ padding: '0.65rem 0.85rem', fontWeight: 'bold' }}>Safety Margin (C_act - C_req)</td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontWeight: 'bold', color: thermalMarginM >= 0 ? '#10b981' : '#f43f5e' }} className="mono">
                  {convertMetersToUnit(thermalMarginM, unit)} {!isIceGoverning && '★ GOVERNING'}
                </td>
                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontWeight: 'bold', color: iceMarginM >= 0 ? '#10b981' : '#f43f5e' }} className="mono">
                  {convertMetersToUnit(iceMarginM, unit)} {isIceGoverning && '★ GOVERNING'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
