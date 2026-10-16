import React, { useState } from 'react';
import ClearanceForm from '../components/ClearanceForm';
import ClearanceVisualizer from '../components/ClearanceVisualizer';
import ReportSummary from '../components/ReportSummary';
import ClearanceTableManager from '../components/ClearanceTableManager';
import { CROSSING_CATEGORIES } from '../data/csaClearanceTables';
import { calculateClearance } from '../utils/clearanceCalculator';

export default function ClearanceApp({ unit, isTableManagerOpen, setIsTableManagerOpen }) {
  // Initialize Custom Tables
  const [customTables, setCustomTables] = useState(() => {
    const initial = {};
    CROSSING_CATEGORIES.forEach(cat => {
      initial[cat.id] = { ...cat.baseClearances };
    });
    return initial;
  });

  // Main Calculation Parameters State
  const [params, setParams] = useState({
    voltageClassId: 'dist_12k',
    operatingVoltageKv: 12.47,
    categoryId: 'road_truck',
    utilityPreset: 'csa_std',
    useCustomBaseClearance: false,
    customBaseClearance: 5.5,
    adderPerKv: 0.010,
    baseThresholdKv: 50,
    elevationMeters: 0,
    thermalSagBufferMeters: 0.3,
    iceWindSagBufferMeters: 0.5,
    csaLoadingZone: 'heavy',
    utilitySafetyMarginMeters: 0.3,
    attachmentHeightMeters: 12.0,
    midspanSagMeters: 2.5,
    obstacleHeightMeters: 0
  });

  // Find active category
  const categoryObj = CROSSING_CATEGORIES.find(c => c.id === params.categoryId) || CROSSING_CATEGORIES[0];

  // Determine base clearance (custom vs table override)
  let activeBaseClearance = null;
  if (params.useCustomBaseClearance) {
    activeBaseClearance = params.customBaseClearance;
  } else if (customTables[params.categoryId] && customTables[params.categoryId][params.voltageClassId] !== undefined) {
    activeBaseClearance = customTables[params.categoryId][params.voltageClassId];
  }

  // Calculate Real-time Clearance
  const calculationResult = calculateClearance({
    voltageClassId: params.voltageClassId,
    operatingVoltageKv: params.operatingVoltageKv,
    categoryObj: categoryObj,
    customBaseClearance: activeBaseClearance,
    utilityPreset: params.utilityPreset,
    adderPerKv: params.adderPerKv,
    baseThresholdKv: params.baseThresholdKv,
    elevationMeters: params.elevationMeters,
    thermalSagBufferMeters: params.thermalSagBufferMeters,
    iceWindSagBufferMeters: params.iceWindSagBufferMeters,
    csaLoadingZone: params.csaLoadingZone,
    utilitySafetyMarginMeters: params.utilitySafetyMarginMeters,
    attachmentHeightMeters: params.attachmentHeightMeters,
    midspanSagMeters: params.midspanSagMeters,
    obstacleHeightMeters: params.obstacleHeightMeters,
    unit: unit
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => setIsTableManagerOpen(true)}
        >
          ⚙️ Manage Clearance Tables
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 460px) 1fr', gap: '1.5rem' }}>
        {/* Left: Input Form Controls */}
        <div>
          <ClearanceForm
            params={params}
            setParams={setParams}
            unit={unit}
            calculationResult={calculationResult}
          />
        </div>

        {/* Right: Dynamic Interactive Visualizer */}
        <div>
          <ClearanceVisualizer
            calculationResult={calculationResult}
            categoryObj={categoryObj}
            unit={unit}
          />
        </div>
      </div>

      {/* Full-width Engineering Calculation Report & Compliance Breakdown */}
      <ReportSummary
        calculationResult={calculationResult}
        categoryObj={categoryObj}
        params={params}
        unit={unit}
      />

      {/* Clearance Table Modal Drawer */}
      <ClearanceTableManager
        isOpen={isTableManagerOpen}
        onClose={() => setIsTableManagerOpen(false)}
        customTables={customTables}
        setCustomTables={setCustomTables}
        unit={unit}
      />
    </>
  );
}
