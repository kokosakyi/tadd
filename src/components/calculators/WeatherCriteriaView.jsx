import React, { useState, useEffect } from 'react';
import { Wind, Download, MapPin, FileSpreadsheet, Layers, ShieldCheck } from 'lucide-react';
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

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* View Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wind size={22} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.015em' }}>
                Weather Criteria, Climatic Map & Load Case Matrix (A3 / A4 / M2)
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
              682-station Canadian geoclimatic database, CSA C22.3 No. 60826 reliability scaling, and unified load cases.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleExportCsv}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', borderRadius: '10px' }}
              title="Download unified load case matrix as CSV"
            >
              <FileSpreadsheet size={16} />
              <span>Export Load Matrix (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Canadian Weather Map */}
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

      {/* Input Parameters Form */}
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

      {/* Analysis Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
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

      {/* Unified Load Case Matrix View */}
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

      {/* PLS-CADD .cri Exporter View */}
      <CriExporterView criText={criText} />

      {/* Bottom: Engineering Audit Trace Card */}
      <TraceViewer trace={trace} onOpenCitation={onOpenCitation} />

    </div>
  );
}
