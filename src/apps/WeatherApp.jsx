import React, { useState, useEffect } from 'react';
import geoData from '../data/csaGeoDatabase.json';
import WeatherCriteriaForm from '../components/WeatherCriteriaForm';
import Module2RPScalingCard from '../components/Module2RPScalingCard';
import Module3PhysicsCard from '../components/Module3PhysicsCard';
import Module4GuardrailCard from '../components/Module4GuardrailCard';
import Module5TensionLimitsCard from '../components/Module5TensionLimitsCard';
import CriExporterView from '../components/CriExporterView';
import CanadaWeatherMap from '../components/CanadaWeatherMap';
import LoadCaseMatrixView from '../components/LoadCaseMatrixView';
import {
  queryModule1GeoDB,
  calculateModule2RPScaling,
  calculateModule3Physics,
  applyModule4Guardrail,
  calculateModule5TensionLimits,
  generateModule6CriText,
  RETURN_PERIOD_FACTORS,
  DETERMINISTIC_MINIMUMS
} from '../utils/weatherCriteriaEngine';

export default function WeatherApp() {
  // Weather Criteria State Machine
  const provinces = Object.keys(geoData.provinces).sort((a, b) => a.localeCompare(b));
  const [selectedProvince, setSelectedProvince] = useState('Ontario');
  
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

  // Execute Weather Criteria Engine Pipeline
  const module1Result = queryModule1GeoDB(selectedProvince, selectedCity);
  const w50 = module1Result?.wind_50yr || 90;
  const t50 = module1Result?.ice_50yr || 30;

  const module2Result = calculateModule2RPScaling(w50, t50, returnPeriod);
  const module3Result = calculateModule3Physics(
    module2Result.w_T,
    module2Result.t_T,
    conductorDiameter,
    isTransmission
  );
  const module4Result = applyModule4Guardrail(module3Result, district);
  const module5Result = calculateModule5TensionLimits(
    rulingSpan,
    hasDampers,
    isBundled,
    rtsKn,
    conductorWeightNm
  );
  const criText = generateModule6CriText(
    {
      cityData: module1Result,
      returnPeriod,
      conductor: { diameter: conductorDiameter, rulingSpan }
    },
    {
      scaling: module2Result,
      governed: module4Result,
      tension: module5Result
    }
  );

  return (
    <>
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

      <WeatherCriteriaForm
        provinces={provinces}
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        citiesInProvince={citiesInProvince}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        geoData={module1Result}
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

      <Module2RPScalingCard
        module2Result={module2Result}
        w50={w50}
        t50={t50}
      />

      <Module3PhysicsCard
        module3Result={module3Result}
        isTransmission={isTransmission}
        setIsTransmission={setIsTransmission}
      />

      <Module4GuardrailCard module4Result={module4Result} />

      <Module5TensionLimitsCard
        module5Result={module5Result}
        hasDampers={hasDampers}
        setHasDampers={setHasDampers}
        isBundled={isBundled}
        setIsBundled={setIsBundled}
      />

      <LoadCaseMatrixView
        district={district}
        deterministicWindPa={DETERMINISTIC_MINIMUMS[district]?.windPa || 400}
        deterministicIceMm={DETERMINISTIC_MINIMUMS[district]?.iceMm || 12.5}
        minJanTempC={module1Result?.min_temp || -20}
        r_T_wind_kmh={module2Result.w_T}
        r_T_ice_mm={module2Result.t_T}
        returnPeriod={returnPeriod}
      />

      <CriExporterView
        criText={criText}
        fileName={`${selectedCity.replace(/[^a-zA-Z0-9]/g, '_')}_${returnPeriod}Yr_Criteria.cri`}
      />
    </>
  );
}
