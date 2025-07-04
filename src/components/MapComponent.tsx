import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Signal {
  id: string;
  lat: number;
  lng: number;
  type: string;
  severity: 'low' | 'medium' | 'high';
  location: string;
  timestamp: string;
}

interface MapComponentProps {
  signals?: Signal[];
  height?: string;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  signals = [],
  height = '400px',
  center = [19.0760, 72.8777], // Mumbai coordinates
  zoom = 10,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getSeverityRadius = (severity: string) => {
    switch (severity) {
      case 'high': return 12;
      case 'medium': return 10;
      case 'low': return 8;
      default: return 8;
    }
  };

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map with proper z-index
    mapInstanceRef.current = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      touchZoom: true,
      zIndex: 1
    }).setView(center, zoom);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      tileSize: 256,
      zoomOffset: 0
    }).addTo(mapInstanceRef.current);

    // Set proper z-index for map container
    if (mapRef.current) {
      mapRef.current.style.zIndex = '1';
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once

  // Update map view when center or zoom changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update markers when signals change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    signals.forEach((signal) => {
      if (mapInstanceRef.current && signal.lat && signal.lng) {
        const marker = L.circleMarker([signal.lat, signal.lng], {
          radius: getSeverityRadius(signal.severity),
          fillColor: getSeverityColor(signal.severity),
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(mapInstanceRef.current);

        markersRef.current.push(marker);

        // Create popup content
        const popupContent = `
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-sm mb-2">${signal.type} Signal</h3>
            <div class="space-y-1 text-xs">
              <p><strong>Location:</strong> ${signal.location}</p>
              <p><strong>Severity:</strong> 
                <span class="inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  signal.severity === 'high' ? 'bg-red-100 text-red-800' :
                  signal.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }">
                  ${signal.severity.toUpperCase()}
                </span>
              </p>
              <p><strong>Time:</strong> ${new Date(signal.timestamp).toLocaleString()}</p>
              <p class="text-gray-500">ID: ${signal.id.slice(0, 8)}...</p>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup'
        });

        // Add hover effects
        marker.on('mouseover', function() {
          this.setStyle({
            radius: getSeverityRadius(signal.severity) + 2,
            weight: 3
          });
        });

        marker.on('mouseout', function() {
          this.setStyle({
            radius: getSeverityRadius(signal.severity),
            weight: 2
          });
        });
      }
    });

    // Fit bounds to show all signals if there are any
    if (signals.length > 0) {
      const validSignals = signals.filter(s => s.lat && s.lng);
      if (validSignals.length > 0) {
        const group = new L.FeatureGroup(markersRef.current);
        
        // Only fit bounds if we have multiple signals, otherwise use the center
        if (validSignals.length > 1) {
          mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
        }
      }
    }
  }, [signals]);

  return (
    <div className="relative" style={{ zIndex: 1 }}>
      <div 
        ref={mapRef} 
        style={{ height, minHeight: '300px', zIndex: 1 }} 
        className={`rounded-xl overflow-hidden border border-gray-200 ${className}`}
      />
      
      {/* Loading overlay */}
      {signals.length === 0 && (
        <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center" style={{ zIndex: 2 }}>
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading map data...</p>
          </div>
        </div>
      )}
      
      {/* Signal count indicator */}
      {signals.length > 0 && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2" style={{ zIndex: 1000 }}>
          <p className="text-sm font-medium text-gray-700">
            {signals.length} signal{signals.length !== 1 ? 's' : ''} displayed
          </p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;