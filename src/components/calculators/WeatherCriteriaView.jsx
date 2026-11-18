import React, { useState, useEffect } from 'react';
import { Wind, FileSpreadsheet, MapPin, Sliders, Activity, Table, FileCheck } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
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

export default function WeatherCriteriaView({ onOpenCitation }) {
  const { activeProject } = useProject();
  const [activeTab, setActiveTab] = useState('station'); // 'station' | 'physics' | 'matrix' | 'trace'
  const [showMap, setShowMap] = useState(false);

  // Province list sorted alphabetically using localeCompare
  const provinces = Object.keys(geoData.provinces).sort((a, b) => a.localeCompare(b));
  const [selectedProvince, setSelectedProvince] = useState(activeProject?.province || 'Ontario');

  // Helper for sorted cities in province
  const getSortedCities = (prov) => {
    const list = geoData.provinces[prov] || [];
    return [...list].sort((a, b) => a.location.localeCompare(b.location));
  };

  const citiesInProvince = getSortedCities(selectedProvince);
  const [selectedCity, setSelectedCity] = useState(citiesInProvince[0]?.location || 'Ottawa (City Hall)');
  const [returnPeriod, setReturnPeriod] = useState(150);
  const [district, setDistrict] = useState('Heavy');
  const [isTransmission, setIsTransmission] = useState(true);
  const [conductorDiameter, setConductorDiameter] = useState(28.14);
  const [rtsKn, setRtsKn] = useState(140.0);
  const [conductorWeightNm, setConductorWeightNm] = useState(15.9);
  const [isBundled, setIsBundled] = useState(false);
  const [rulingSpan, setRulingSpan] = useState(250);
  const [hasDampers, setHasDampers] = useState(true);

  // Sync city selection when province changes
  useEffect(() => {
    const available = getSortedCities(selectedProvince);
    if (available && available.length > 0) {
      setSelectedCity(available[0].location);
    }
  }, [selectedProvince]);

  // Sync province with activeProject when project changes
  useEffect(() => {
    if (activeProject?.province && provinces.includes(activeProject.province)) {
      setSelectedProvince(activeProject.province);
    }
  }, [activeProject]);

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

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* View Header & Section Sub-Navigation */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
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
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
            >
              <MapPin size={15} />
              <span>{showMap ? 'Hide Weather Map' : 'Interactive Map'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem' }}
              title="Download unified load case matrix as CSV"
            >
              <FileSpreadsheet size={15} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Always-Visible Governing Outputs Summary Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '0.75rem' }}>
          <div className="glass-inset" style={{ padding: '0.7rem 0.95rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 650 }}>
              Station ({returnPeriod}-yr)
            </div>
            <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedCity}, {selectedProvince}
            </div>
          </div>

          <div className="glass-inset" style={{ padding: '0.7rem 0.95rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 650 }}>
              Design Wind Pressure
            </div>
            <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.15rem' }}>
              {guardrailResult.governed_q0.toFixed(1)} Pa{' '}
              <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                ({scalingResult.w_T.toFixed(1)} km/h)
              </span>
            </div>
          </div>

          <div className="glass-inset" style={{ padding: '0.7rem 0.95rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 650 }}>
              Design Radial Ice
            </div>
            <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.15rem' }}>
              {guardrailResult.governed_t_design.toFixed(1)} mm{' '}
              <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                ({physicsResult.g_R.toFixed(1)} N/m)
              </span>
            </div>
          </div>

          <div className="glass-inset" style={{ padding: '0.7rem 0.95rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 650 }}>
              Max Catenary / Vibe Limit
            </div>
            <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.15rem' }}>
              {tensionResult.maxCatenary.toFixed(0)} m{' '}
              <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                ({tensionResult.aeolianTensionLimitKn.toFixed(1)} kN)
              </span>
            </div>
          </div>
        </div>

        {/* Clean Step / Sub-Module Tab Bar */}
        <div className="book-content-tabs" style={{ paddingTop: '0.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          {sectionTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={isActive ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '0.8rem', padding: '0.42rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Interactive Canadian Weather Map */}
      {showMap && (
        <CanadaWeatherMap
          selectedProvince={selectedProvince}
          selectedCity={selectedCity}
          onSelectStation={(prov, city) => {
            setSelectedProvince(prov);
            setSelectedCity(city);
          }}
          returnPeriod={returnPeriod}
          district={district}
        />
      )}

      {/* TAB 1: Station & Input Parameters */}
      {activeTab === 'station' && (
        <WeatherCriteriaForm
          provinces={provinces}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          citiesInProvince={citiesInProvince}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          stationData={stationData}
          geoData={geoData}
          returnPeriod={returnPeriod}
          setReturnPeriod={setReturnPeriod}
          returnPeriodFactors={RETURN_PERIOD_FACTORS}
          district={district}
          setDistrict={setDistrict}
          deterministicMinimums={DETERMINISTIC_MINIMUMS}
          rulingSpan={rulingSpan}
          setRulingSpan={setRulingSpan}
          conductorDiameter={conductorDiameter}
          setConductorDiameter={setConductorDiameter}
          hasDampers={hasDampers}
          setHasDampers={setHasDampers}
          isTransmission={isTransmission}
          setIsTransmission={setIsTransmission}
          rtsKn={rtsKn}
          setRtsKn={setRtsKn}
          conductorWeightNm={conductorWeightNm}
          setConductorWeightNm={setConductorWeightNm}
          isBundled={isBundled}
          setIsBundled={setIsBundled}
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
            setIsTransmission={setIsTransmission}
          />
          <Module4GuardrailCard
            governedResults={guardrailResult}
            district={district}
          />
          <Module5TensionLimitsCard
            tensionLimits={tensionResult}
            hasDampers={hasDampers}
            setHasDampers={setHasDampers}
            isBundled={isBundled}
            setIsBundled={setIsBundled}
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
    </div>
  );
}
