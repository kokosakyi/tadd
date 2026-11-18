import React, { useState, useEffect } from 'react';
import { Wind, FileSpreadsheet, MapPin, Sliders, Activity, Table, FileCheck, RotateCcw } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useProjectScopedState } from '../../hooks/useProjectScopedState';
import geoData from '../../data/csaGeoDatabase.json';
import {
  calculateClimaticCriteria,
  exportLoadCaseMatrixCsv,
  RETURN_PERIOD_FACTORS,
  DETERMINISTIC_MINIMUMS
} from '../../core/weather/weatherEngine';
import CanadaWeatherMap from '../CanadaWeatherMap';
import WeatherCriteriaForm from '../WeatherCriteriaForm';
import Module2RPScalingCard from '../Module2RPScalingCard';
import Module3PhysicsCard from '../Module3PhysicsCard';
import Module4GuardrailCard from '../Module4GuardrailCard';
import Module5TensionLimitsCard from '../Module5TensionLimitsCard';
import LoadCaseMatrixView from '../LoadCaseMatrixView';
import CriExporterView from '../CriExporterView';
import TraceViewer from '../common/TraceViewer';
import CalculatorWorkspaceShell from '../common/CalculatorWorkspaceShell';

const SORTED_PROVINCES = Object.keys(geoData.provinces).sort((a, b) => a.localeCompare(b));

function getSortedCities(prov) {
  const list = geoData.provinces[prov] || [];
  return [...list].sort((a, b) => a.location.localeCompare(b.location));
}

const VALID_TABS = ['station', 'physics', 'matrix', 'trace'];

export default function WeatherCriteriaView({
  onOpenCitation,
  initialTab,
  initialStation,
  onClearInitialStation,
  onTabChange
}) {
  const { activeProject } = useProject();
  const [activeTab, setActiveTab] = useState(() =>
    initialTab && VALID_TABS.includes(initialTab) ? initialTab : 'station'
  );
  const [showMap, setShowMap] = useState(false);

  const [formState, updateFormState, resetFormState] = useProjectScopedState(
    activeProject?.id,
    'weather',
    () => {
      const defaultProv =
        activeProject?.province && SORTED_PROVINCES.includes(activeProject.province)
          ? activeProject.province
          : 'Ontario';
      const firstCity = getSortedCities(defaultProv)[0]?.location || 'Ottawa (City Hall)';
      return {
        selectedProvince: defaultProv,
        selectedCity: firstCity,
        returnPeriod: 150,
        district: 'Heavy',
        isTransmission: true,
        conductorDiameter: 28.14,
        rtsKn: 140.0,
        conductorWeightNm: 15.9,
        isBundled: false,
        rulingSpan: 250,
        hasDampers: true
      };
    }
  );

  const {
    selectedProvince,
    selectedCity,
    returnPeriod,
    district,
    isTransmission,
    conductorDiameter,
    rtsKn,
    conductorWeightNm,
    isBundled,
    rulingSpan,
    hasDampers
  } = formState;

  // Handle incoming station jump from Global Command Palette or URL hash
  useEffect(() => {
    if (initialStation?.province && SORTED_PROVINCES.includes(initialStation.province)) {
      const cities = getSortedCities(initialStation.province);
      const validCity =
        cities.find((c) => c.location === initialStation.city)?.location ||
        cities[0]?.location ||
        selectedCity;
      updateFormState({
        selectedProvince: initialStation.province,
        selectedCity: validCity
      });
      onClearInitialStation?.();
    }
  }, [initialStation, onClearInitialStation, updateFormState, selectedCity]);

  // Handle URL hash tab changes
  useEffect(() => {
    if (initialTab && VALID_TABS.includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const citiesInProvince = getSortedCities(selectedProvince);

  const handleSetProvince = (nextProv) => {
    const available = getSortedCities(nextProv);
    updateFormState({
      selectedProvince: nextProv,
      selectedCity: available[0]?.location || selectedCity
    });
  };

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  // Execute Climatic Criteria & Load Matrix Engine
  const {
    stationData,
    scalingResult,
    physicsResult,
    guardrailResult,
    tensionResult,
    loadCaseMatrix,
    criText,
    trace
  } = calculateClimaticCriteria({
    province: selectedProvince,
    location: selectedCity,
    returnPeriod,
    district,
    isTransmission,
    conductorDiameterMm: conductorDiameter,
    rtsKn,
    conductorWeightNm,
    isBundled,
    rulingSpanM: rulingSpan,
    hasDampers
  });

  // Handler for CSV Export
  const handleExportCsv = () => {
    const csvContent = exportLoadCaseMatrixCsv(loadCaseMatrix);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LoadCaseMatrix_${selectedCity.replace(/[^a-zA-Z0-9]/g, '_')}_${returnPeriod}yr.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sectionTabs = [
    { id: 'station', label: '1. Station & Inputs', icon: Sliders },
    { id: 'physics', label: '2. Physics & Guardrails', icon: Activity },
    { id: 'matrix', label: '3. Load Matrix & .cri', icon: Table },
    { id: 'trace', label: '4. Audit Trace', icon: FileCheck }
  ];

  const headerNode = (
    <div className="glass-panel" style={{ padding: '1.2rem 1.45rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.92), rgba(5, 150, 105, 0.88))',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
            }}
          >
            <Wind size={18} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Weather Criteria &amp; Load Case Matrix
          </h2>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
          682-station Canadian geoclimatic database, CSA C22.3 No. 60826 reliability scaling, and PLS-CADD criteria export.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setShowMap((prev) => !prev)}
          className={showMap ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '0.79rem', padding: '0.42rem 0.85rem' }}
        >
          <MapPin size={14} />
          <span>{showMap ? 'Hide Weather Map' : 'Interactive Map'}</span>
        </button>
        <button
          type="button"
          onClick={handleExportCsv}
          className="btn-primary"
          style={{ fontSize: '0.79rem', padding: '0.42rem 0.9rem' }}
          title="Download unified load case matrix as CSV"
        >
          <FileSpreadsheet size={14} />
          <span>Export CSV</span>
        </button>
        <button
          type="button"
          onClick={resetFormState}
          className="btn-secondary"
          style={{ fontSize: '0.76rem', padding: '0.42rem 0.72rem', gap: '0.3rem' }}
          title="Reset weather criteria to active project defaults"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );

  const summaryRailNode = (
    <div className="glass-panel" style={{ padding: '1.15rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.6rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
          Governing Climatic Summary
        </span>
        <span className="badge badge-info mono" style={{ fontSize: '0.7rem' }}>
          {returnPeriod}-yr RP
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.65rem' }}>
        <div className="glass-inset" style={{ padding: '0.68rem 0.85rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 650 }}>
            Station
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.18rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={`${selectedCity}, ${selectedProvince}`}>
            {selectedCity}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {selectedProvince} • {district}
          </div>
        </div>

        <div className="glass-inset" style={{ padding: '0.68rem 0.85rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 650 }}>
            Design Wind Pressure
          </div>
          <div className="mono" style={{ fontSize: '1.12rem', fontWeight: 750, color: 'var(--accent-cyan)', marginTop: '0.18rem' }}>
            {guardrailResult.governed_q0.toFixed(1)} Pa
          </div>
          <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {scalingResult.w_T.toFixed(1)} km/h gust
          </div>
        </div>

        <div className="glass-inset" style={{ padding: '0.68rem 0.85rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 650 }}>
            Design Radial Ice
          </div>
          <div className="mono" style={{ fontSize: '1.12rem', fontWeight: 750, color: 'var(--accent-cyan)', marginTop: '0.18rem' }}>
            {guardrailResult.governed_t_design.toFixed(1)} mm
          </div>
          <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {physicsResult.g_R.toFixed(1)} N/m ice load
          </div>
        </div>

        <div className="glass-inset" style={{ padding: '0.68rem 0.85rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 650 }}>
            Max Catenary / Vibe Limit
          </div>
          <div className="mono" style={{ fontSize: '1.12rem', fontWeight: 750, color: 'var(--accent-emerald)', marginTop: '0.18rem' }}>
            {tensionResult.maxCatenary.toFixed(0)} m
          </div>
          <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {tensionResult.aeolianTensionLimitKn.toFixed(1)} kN EDS limit
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.45, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
        Governing source:{' '}
        <strong style={{ color: 'var(--text-main)' }}>
          {guardrailResult.isWindGovernedByDeterministic || guardrailResult.isIceGovernedByDeterministic
            ? `CSA Table 30 (${district} Minimum Guardrail)`
            : `CSA 60826 (${returnPeriod}-yr Reliability)`}
        </strong>
      </div>
    </div>
  );

  return (
    <CalculatorWorkspaceShell
      header={headerNode}
      tabs={sectionTabs}
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
      summaryRail={summaryRailNode}
    >
      {/* Optional Interactive Canadian Weather Map */}
      {showMap && (
        <CanadaWeatherMap
          selectedProvince={selectedProvince}
          selectedCity={selectedCity}
          onSelectStation={(prov, city) => {
            updateFormState({ selectedProvince: prov, selectedCity: city });
          }}
          returnPeriod={returnPeriod}
          district={district}
        />
      )}

      {/* TAB 1: Station & Input Parameters */}
      {activeTab === 'station' && (
        <WeatherCriteriaForm
          provinces={SORTED_PROVINCES}
          selectedProvince={selectedProvince}
          setSelectedProvince={handleSetProvince}
          citiesInProvince={citiesInProvince}
          selectedCity={selectedCity}
          setSelectedCity={(v) => updateFormState({ selectedCity: v })}
          stationData={stationData}
          geoData={geoData}
          returnPeriod={returnPeriod}
          setReturnPeriod={(v) => updateFormState({ returnPeriod: v })}
          returnPeriodFactors={RETURN_PERIOD_FACTORS}
          district={district}
          setDistrict={(v) => updateFormState({ district: v })}
          deterministicMinimums={DETERMINISTIC_MINIMUMS}
          rulingSpan={rulingSpan}
          setRulingSpan={(v) => updateFormState({ rulingSpan: v })}
          conductorDiameter={conductorDiameter}
          setConductorDiameter={(v) => updateFormState({ conductorDiameter: v })}
          hasDampers={hasDampers}
          setHasDampers={(v) => updateFormState({ hasDampers: v })}
          isTransmission={isTransmission}
          setIsTransmission={(v) => updateFormState({ isTransmission: v })}
          rtsKn={rtsKn}
          setRtsKn={(v) => updateFormState({ rtsKn: v })}
          conductorWeightNm={conductorWeightNm}
          setConductorWeightNm={(v) => updateFormState({ conductorWeightNm: v })}
          isBundled={isBundled}
          setIsBundled={(v) => updateFormState({ isBundled: v })}
        />
      )}

      {/* TAB 2: Physics, Return Period, Table 30 Guardrail & Tension Modules */}
      {activeTab === 'physics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Module2RPScalingCard
            scalingResults={scalingResult}
            selectedCity={selectedCity}
            returnPeriod={returnPeriod}
          />
          <Module3PhysicsCard
            physicsResults={physicsResult}
            isTransmission={isTransmission}
            setIsTransmission={(v) => updateFormState({ isTransmission: v })}
          />
          <Module4GuardrailCard
            governedResults={guardrailResult}
            district={district}
          />
          <Module5TensionLimitsCard
            tensionLimits={tensionResult}
            hasDampers={hasDampers}
            setHasDampers={(v) => updateFormState({ hasDampers: v })}
            isBundled={isBundled}
            setIsBundled={(v) => updateFormState({ isBundled: v })}
          />
        </div>
      )}

      {/* TAB 3: Unified Load Case Matrix & PLS-CADD .cri Exporter */}
      {activeTab === 'matrix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <LoadCaseMatrixView
            cityData={stationData}
            returnPeriod={returnPeriod}
            district={district}
            conductor={{ diameter: conductorDiameter, rulingSpan }}
            scalingResults={scalingResult}
            physicsResults={physicsResult}
            governedResults={guardrailResult}
            tensionLimits={tensionResult}
          />
          <CriExporterView criText={criText} />
        </div>
      )}

      {/* TAB 4: Engineering Audit Trace */}
      {activeTab === 'trace' && (
        <TraceViewer trace={trace} onOpenCitation={onOpenCitation} />
      )}
    </CalculatorWorkspaceShell>
  );
}
