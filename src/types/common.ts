/**
 * Common engineering units, project configuration, and base types
 */

export type UnitSystem = 'metric' | 'imperial';

export interface ProjectMetadata {
  id: string;
  name: string;
  lineVoltageKv: number;
  province: string;
  stationName?: string;
  designReturnPeriod: number;
  loadingDistrict: 'Light' | 'Medium' | 'Heavy';
  constructionGrade: 'Grade 1' | 'Grade 2' | 'Grade 3';
  createdAt?: string;
  updatedAt?: string;
}

export interface GeoLocation {
  province: string;
  location: string;
  elevation_m?: number;
  wind_50yr: number;
  ice_50yr: number;
  latitude?: number;
  longitude?: number;
}
