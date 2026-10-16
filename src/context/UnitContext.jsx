import React, { createContext, useContext, useState } from 'react';

export const M_TO_FT = 3.28084;
export const FT_TO_M = 0.3048;
export const KN_TO_LBF = 224.809;
export const PA_TO_PSF = 0.0208854;

const UnitContext = createContext(null);

export function UnitProvider({ children }) {
  const [unit, setUnit] = useState('metric'); // 'metric' | 'imperial'

  const formatDistance = (meters, decimals = 2) => {
    const m = Number(meters);
    if (!Number.isFinite(m)) return '0.00 m';
    if (unit === 'imperial') {
      return `${(m * M_TO_FT).toFixed(decimals)} ft`;
    }
    return `${m.toFixed(decimals)} m`;
  };

  const formatMoment = (knMeters, decimals = 2) => {
    const k = Number(knMeters);
    if (!Number.isFinite(k)) return '0.00 kN*m';
    if (unit === 'imperial') {
      // 1 kN*m = 737.562 ft*lbf
      return `${(k * 737.562).toFixed(decimals)} ft-lb`;
    }
    return `${k.toFixed(decimals)} kN*m`;
  };

  const formatPressure = (pascals, decimals = 0) => {
    const p = Number(pascals);
    if (!Number.isFinite(p)) return '0 Pa';
    if (unit === 'imperial') {
      return `${(p * PA_TO_PSF).toFixed(1)} psf`;
    }
    return `${p.toFixed(decimals)} Pa`;
  };

  return (
    <UnitContext.Provider
      value={{
        unit,
        setUnit,
        formatDistance,
        formatMoment,
        formatPressure,
        isMetric: unit === 'metric'
      }}
    >
      {children}
    </UnitContext.Provider>
  );
}

export function useUnits() {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error('useUnits must be used within a UnitProvider');
  return ctx;
}
