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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    // Add signals as markers
    signals.forEach((signal) => {
      if (mapInstanceRef.current) {
        const marker = L.circleMarker([signal.lat, signal.lng], {
          radius: 8,
          fillColor: getSeverityColor(signal.severity),
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(mapInstanceRef.current);

        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${signal.type} Signal</h3>
            <p class="text-xs text-gray-600">${signal.location}</p>
            <p class="text-xs text-gray-500">${signal.timestamp}</p>
            <span class="inline-block px-2 py-1 text-xs rounded-full mt-1 ${
              signal.severity === 'high' ? 'bg-red-100 text-red-800' :
              signal.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }">
              ${signal.severity.toUpperCase()}
            </span>
          </div>
        `);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [signals, center, zoom]);

  return (
    <div 
      ref={mapRef} 
      style={{ height }} 
      className={`rounded-xl overflow-hidden ${className}`}
    />
  );
};

export default MapComponent;