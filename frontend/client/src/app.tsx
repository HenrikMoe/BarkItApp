import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import { APIProvider, Map, useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';
import trees from './trees';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App: React.FC = () => (
  <div style={{ width: '90%', height: '250px', margin: '0 auto' }}>
    <h2 style={{ textAlign: 'left', marginBottom: '150px' }}>Bark It</h2>
    <APIProvider apiKey={API_KEY}>
      <Map mapId={'bf51a910020fa25a'} center={{ lat: 34.0549, lng: -118.242 }} zoom={11}>
        <Markers points={trees} />
      </Map>
    </APIProvider>
  </div>
);

type Point = google.maps.LatLngLiteral & { key: string };
type Props = { points: Point[] };

const Markers: React.FC<Props> = ({ points }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update markers
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {points.map((point) => (
        <AdvancedMarker
          position={point}
          key={point.key}
          ref={(marker) => setMarkerRef(marker, point.key)}
        >
          <span className="tree">🌳</span>
        </AdvancedMarker>
      ))}
    </>
  );
};

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
