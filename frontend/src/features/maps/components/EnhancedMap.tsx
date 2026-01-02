import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEnhancedMap } from '@/hooks/useEnhancedMap';
import { Coordinates } from '@/services/maps.service';

interface EnhancedMapProps {
  center: Coordinates;
  zoom?: number;
  onLocationSelect?: (location: Coordinates) => void;
  showDrivers?: boolean;
  showGeofences?: boolean;
  showHeatMap?: boolean;
  selectedVehicleType?: string;
  className?: string;
}

// Custom marker icons
const createDriverIcon = (vehicleType: string) => {
  const colors: Record<string, string> = {
    mini: '#10B981',
    sedan: '#3B82F6',
    suv: '#8B5CF6',
    premium: '#F59E0B',
  };

  return L.divIcon({
    className: 'driver-marker',
    html: `
      <div style="
        background: ${colors[vehicleType] || '#6B7280'};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        <span style="font-size: 16px;">🚗</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const geofenceColors: Record<string, string> = {
  airport: '#EF4444',
  railway_station: '#F59E0B',
  bus_stand: '#10B981',
  mall: '#8B5CF6',
  hospital: '#3B82F6',
  custom: '#6B7280',
};

export const EnhancedMap: React.FC<EnhancedMapProps> = ({
  center,
  zoom = 14,
  onLocationSelect,
  showDrivers = true,
  showGeofences = true,
  showHeatMap: _showHeatMap = false, // Reserved for future heat map layer
  selectedVehicleType,
  className = '',
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const driverMarkersRef = useRef<L.LayerGroup | null>(null);
  const geofenceLayersRef = useRef<L.LayerGroup | null>(null);

  const { geofences, nearbyDrivers, currentGeofence } = useEnhancedMap({
    location: center,
    autoFetchGeofences: showGeofences,
    autoFetchNearbyDrivers: showDrivers,
    driverRefreshInterval: 15000,
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView(
      [center.lat, center.lng],
      zoom
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Initialize layer groups
    driverMarkersRef.current = L.layerGroup().addTo(mapRef.current);
    geofenceLayersRef.current = L.layerGroup().addTo(mapRef.current);

    // Click handler for location selection
    if (onLocationSelect) {
      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map center
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom]);

  // Render driver markers
  useEffect(() => {
    if (!driverMarkersRef.current || !showDrivers) return;

    driverMarkersRef.current.clearLayers();

    nearbyDrivers.forEach((driver) => {
      if (selectedVehicleType && driver.vehicleType !== selectedVehicleType) {
        return;
      }

      const marker = L.marker([driver.location.lat, driver.location.lng], {
        icon: createDriverIcon(driver.vehicleType),
      });

      marker.bindPopup(`
        <div class="p-2">
          <strong>${driver.vehicleType.charAt(0).toUpperCase() + driver.vehicleType.slice(1)}</strong>
          <p class="text-sm text-gray-500">Available</p>
        </div>
      `);

      driverMarkersRef.current?.addLayer(marker);
    });
  }, [nearbyDrivers, showDrivers, selectedVehicleType]);

  // Render geofences
  useEffect(() => {
    if (!geofenceLayersRef.current || !showGeofences) return;

    geofenceLayersRef.current.clearLayers();

    geofences.forEach((geofence) => {
      const circle = L.circle([geofence.center.lat, geofence.center.lng], {
        radius: geofence.radius,
        color: geofenceColors[geofence.type] || geofenceColors.custom,
        fillColor: geofenceColors[geofence.type] || geofenceColors.custom,
        fillOpacity: 0.2,
        weight: 2,
      });

      circle.bindPopup(`
        <div class="p-2">
          <strong>${geofence.name}</strong>
          <p class="text-sm text-gray-500 capitalize">${geofence.type.replace('_', ' ')}</p>
          ${
            geofence.surgeMultiplier && geofence.surgeMultiplier > 1
              ? `<p class="text-sm text-orange-500">Surge: ${geofence.surgeMultiplier}x</p>`
              : ''
          }
          ${
            geofence.specialInstructions
              ? `<p class="text-xs mt-1">${geofence.specialInstructions}</p>`
              : ''
          }
        </div>
      `);

      geofenceLayersRef.current?.addLayer(circle);

      // Add pickup point markers
      geofence.pickupPoints?.forEach((point) => {
        const pickupMarker = L.marker(
          [point.location.lat, point.location.lng],
          {
            icon: L.divIcon({
              className: 'pickup-marker',
              html: `
              <div style="
                background: white;
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid ${geofenceColors[geofence.type]};
                font-size: 12px;
                white-space: nowrap;
              ">
                📍 ${point.name}
              </div>
            `,
              iconAnchor: [10, 30],
            }),
          }
        );

        if (point.instructions) {
          pickupMarker.bindPopup(`
            <div class="p-2">
              <strong>${point.name}</strong>
              <p class="text-sm">${point.instructions}</p>
            </div>
          `);
        }

        geofenceLayersRef.current?.addLayer(pickupMarker);
      });
    });
  }, [geofences, showGeofences]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
      />

      {/* Geofence Alert Banner */}
      {currentGeofence?.isInside && currentGeofence.geofence && (
        <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {currentGeofence.geofence.type === 'airport'
                ? '✈️'
                : currentGeofence.geofence.type === 'railway_station'
                  ? '🚂'
                  : currentGeofence.geofence.type === 'mall'
                    ? '🏬'
                    : '📍'}
            </span>
            <div>
              <p className="font-medium">{currentGeofence.geofence.name}</p>
              {currentGeofence.surgeMultiplier > 1 && (
                <p className="text-sm text-orange-600">
                  {currentGeofence.surgeMultiplier}x surge pricing
                </p>
              )}
            </div>
          </div>
          {currentGeofence.pickupPoints &&
            currentGeofence.pickupPoints.length > 0 && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-sm text-gray-500 mb-1">
                  Recommended pickup points:
                </p>
                <div className="flex flex-wrap gap-1">
                  {currentGeofence.pickupPoints.map((point) => (
                    <span
                      key={point.id}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {point.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Driver Count Badge */}
      {showDrivers && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 z-[1000]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium">
              {nearbyDrivers.length} drivers nearby
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMap;
