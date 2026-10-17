import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { UnitSystem } from '../types/common';

export const M_TO_FT = 3.28084;
export const FT_TO_M = 0.3048;
export const KN_TO_LBF = 224.809;
export const PA_TO_PSF = 0.0208854;

export interface UnitContextValue {
  unit: UnitSystem;
  setUnit: (u: UnitSystem) => void;
  formatDistance: (meters: number | string, decimals?: number) => string;
  formatMoment: (knMeters: number | string, decimals?: number) => string;
  formatPressure: (pascals: number | string, decimals?: number) => string;
  isMetric: boolean;
}

const UnitContext = createContext<UnitContextValue | null>(null);

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<UnitSystem>('metric');

  const formatDistance = (meters: number | string, decimals = 2): string => {
    const m = Number(meters);
    if (!Number.isFinite(m)) return '0.00 m';
    if (unit === 'imperial') {
      return `${(m * M_TO_FT).toFixed(decimals)} ft`;
    }
    return `${m.toFixed(decimals)} m`;
  };

  const formatMoment = (knMeters: number | string, decimals = 2): string => {
    const k = Number(knMeters);
    if (!Number.isFinite(k)) return '0.00 kN*m';
    if (unit === 'imperial') {
      return `${(k * 737.562).toFixed(decimals)} ft-lb`;
    }
    return `${k.toFixed(decimals)} kN*m`;
  };

  const formatPressure = (pascals: number | string, decimals = 0): string => {
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

export function useUnits(): UnitContextValue {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error('useUnits must be used within a UnitProvider');
  return ctx;
}
