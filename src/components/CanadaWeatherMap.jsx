import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation } from 'lucide-react';
import geoData from '../data/csaGeoDatabase.json';

// Helper component to center map when selected station changes & invalidate size on viewport changes
function MapRecenter({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1.2 });
    }
  }, [center, zoom, map]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  return null;
}

export default function CanadaWeatherMap({
  selectedProvince,
  selectedCity,
  onSelectStation
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
    <div className="glass-panel" style={{ padding: '1.25rem 1.45rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'var(--accent-primary)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
            }}
          >
            <MapPin size={18} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 660 }}>
              CSA 60826 Geoclimatic Station Map
            </h4>
            <p style={{ margin: 0, fontSize: '0.77rem', color: 'var(--text-muted)' }}>
              Click any station pin across Canada or search to zoom &amp; auto-fill criteria.
            </p>
          </div>
        </div>

        {/* Frosted Legend Capsule */}
        <div
          className="glass-inset"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            color: 'var(--text-muted)'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981' }} /> &lt;15 mm
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#38bdf8' }} /> 15–25 mm
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b' }} /> 25–35 mm
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444' }} /> &ge;35 mm
          </span>
        </div>
      </div>

      {/* Map Container - Expanded to at least 50% viewport height */}
      <div style={{ height: 'max(52vh, 480px)', minHeight: '50vh', width: '100%', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
        <MapContainer
          center={mapCenter}
          zoom={currentStation ? 7 : 4}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: 'var(--bg-card)' }}
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
                  fillOpacity: isSelected ? 1 : 0.82,
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
                          <td style={{ padding: '2px 0', fontWeight: 600, textAlign: 'right' }}>{station.wind_50yr} km/h</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '2px 0', color: '#64748b' }}>50-yr Radial Ice:</td>
                          <td style={{ padding: '2px 0', fontWeight: 600, textAlign: 'right' }}>{station.ice_50yr} mm</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '2px 0', color: '#64748b' }}>Min Jan Temp (1%):</td>
                          <td style={{ padding: '2px 0', fontWeight: 600, textAlign: 'right' }}>{station.min_temp} °C</td>
                        </tr>
                        {station.wet_snow_50yr && (
                          <tr>
                            <td style={{ padding: '2px 0', color: '#64748b' }}>50-yr Wet Snow:</td>
                            <td style={{ padding: '2px 0', fontWeight: 600, textAlign: 'right' }}>{station.wet_snow_50yr} mm</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <button
                      type="button"
                      onClick={() => onSelectStation && onSelectStation(station.province, station.location)}
                      style={{
                        marginTop: '8px',
                        width: '100%',
                        padding: '5px 10px',
                        fontSize: '0.75rem',
                        backgroundColor: '#0284c7',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        fontWeight: 600
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

        {/* Selected Station Frosted Glass Pill Overlay */}
        {currentStation && (
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              left: '14px',
              zIndex: 1000,
              background: 'var(--bg-card-solid)',
              backdropFilter: 'blur(20px) saturate(185%)',
              WebkitBackdropFilter: 'blur(20px) saturate(185%)',
              border: '1px solid var(--border-strong)',
              borderRadius: '9999px',
              padding: '7px 14px',
              fontSize: '0.79rem',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Navigation size={14} color="var(--accent-cyan)" />
            <span>
              Active: <strong>{currentStation.location}</strong> ({selectedProvince}) &bull;{' '}
              {currentStation.latitude.toFixed(2)}°N, {Math.abs(currentStation.longitude).toFixed(2)}°W
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
