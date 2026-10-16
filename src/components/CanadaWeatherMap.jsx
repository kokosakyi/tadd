import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Info, ExternalLink } from 'lucide-react';
import geoData from '../data/csaGeoDatabase.json';

// Helper component to center map when selected station changes
function MapRecenter({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function CanadaWeatherMap({
  selectedProvince,
  selectedCity,
  onSelectStation,
  returnPeriod = 50,
  district = 'Heavy'
}) {
  // Collect all stations with coordinates from geoData
  const allStations = useMemo(() => {
    const list = [];
    Object.entries(geoData.provinces).forEach(([province, stations]) => {
      stations.forEach((st) => {
        if (typeof st.latitude === 'number' && typeof st.longitude === 'number') {
          list.push({
            ...st,
            province
          });
        }
      });
    });
    return list;
  }, []);

  // Selected station coordinates
  const currentStation = useMemo(() => {
    const provStations = geoData.provinces[selectedProvince] || [];
    return provStations.find((s) => s.location === selectedCity);
  }, [selectedProvince, selectedCity]);

  const mapCenter = useMemo(() => {
    if (currentStation && currentStation.latitude && currentStation.longitude) {
      return [currentStation.latitude, currentStation.longitude];
    }
    return [56.1304, -106.3468]; // Geographic center of Canada
  }, [currentStation]);

  // Color coding based on 50-year radial ice thickness (severity indicator)
  const getMarkerColor = (iceMm) => {
    if (!iceMm && iceMm !== 0) return '#64748b';
    if (iceMm >= 35) return '#ef4444'; // Severe
    if (iceMm >= 25) return '#f59e0b'; // Heavy
    if (iceMm >= 15) return '#38bdf8'; // Moderate
    return '#10b981'; // Light
  };

  return (
    <div className="glass-panel" style={{ padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <MapPin size={18} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>
              CSA 60826 Geoclimatic Station Map
            </h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Click any station pin across Canada or search to zoom & auto-fill criteria.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} /> &lt;15 mm
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#38bdf8' }} /> 15–25 mm
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} /> 25–35 mm
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} /> &ge;35 mm
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ height: '360px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
        <MapContainer
          center={mapCenter}
          zoom={currentStation ? 7 : 4}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: '#1e293b' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapRecenter center={mapCenter} zoom={currentStation ? 7 : 5} />

          {allStations.map((station) => {
            const isSelected =
              station.province === selectedProvince && station.location === selectedCity;
            const color = isSelected ? '#ffffff' : getMarkerColor(station.ice_50yr);

            return (
              <CircleMarker
                key={`${station.province}-${station.location}`}
                center={[station.latitude, station.longitude]}
                radius={isSelected ? 9 : 5}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: isSelected ? 1 : 0.8,
                  color: isSelected ? '#0284c7' : '#0f172a',
                  weight: isSelected ? 3 : 1
                }}
                eventHandlers={{
                  click: () => {
                    if (onSelectStation) {
                      onSelectStation(station.province, station.location);
                    }
                  }
                }}
              >
                <Popup>
                  <div style={{ padding: '4px', minWidth: '180px', color: '#0f172a' }}>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {station.location}
                    </h5>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '6px' }}>
                      {station.province} &bull; Elev: {station.elevation} m
                    </div>
                    <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: '2px 0', color: '#64748b' }}>50-yr Wind:</td>
                          <td style={{ padding: '2px 0', fontWeight: '600', textAlign: 'right' }}>{station.wind_50yr} km/h</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '2px 0', color: '#64748b' }}>50-yr Radial Ice:</td>
                          <td style={{ padding: '2px 0', fontWeight: '600', textAlign: 'right' }}>{station.ice_50yr} mm</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '2px 0', color: '#64748b' }}>Min Jan Temp (1%):</td>
                          <td style={{ padding: '2px 0', fontWeight: '600', textAlign: 'right' }}>{station.min_temp} °C</td>
                        </tr>
                        {station.wet_snow_50yr && (
                          <tr>
                            <td style={{ padding: '2px 0', color: '#64748b' }}>50-yr Wet Snow:</td>
                            <td style={{ padding: '2px 0', fontWeight: '600', textAlign: 'right' }}>{station.wet_snow_50yr} mm</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <button
                      onClick={() => onSelectStation && onSelectStation(station.province, station.location)}
                      style={{
                        marginTop: '8px',
                        width: '100%',
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        backgroundColor: '#0284c7',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Set Active Station
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Selected Station Banner Overlay */}
        {currentStation && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            zIndex: 1000,
            background: 'var(--bg-card)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '0.8rem',
            color: 'var(--text-main)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Navigation size={14} color="#38bdf8" />
            <span>
              Active: <strong>{currentStation.location}</strong> ({selectedProvince}) &bull; {currentStation.latitude.toFixed(2)}°N, {Math.abs(currentStation.longitude).toFixed(2)}°W
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
