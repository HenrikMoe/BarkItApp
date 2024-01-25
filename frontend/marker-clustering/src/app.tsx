import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import { APIProvider, Map, useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';
import trees from './trees';
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  Pin
} from '@vis.gl/react-google-maps';

import {MarkerWithInfowindow} from './marker-with-infowindow';



console.log(process.env.VITE_REACT_APP_GOOGLE_MAPS_CLIENT_ID)

const App: React.FC = () =>{

  const [showStats, setShowStats] = useState(false);

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  const [selectedMenu, setSelectedMenu] = useState('breeds');

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

return (

  <div style={{ width: '90%', height: '450px', margin: '0 auto' }}>
    <h2 style={{ textAlign: 'left', marginBottom: '150px' }}>Bark It</h2>
    <APIProvider apiKey={API_KEY}>
      <Map mapId={'bf51a910020fa25a'} center={{ lat: 34.0549, lng: -118.242 }} zoom={11}>
        <Markers points={trees} />
        <MarkerWithInfowindow toggleStats={toggleStats}/>
      </Map>
    </APIProvider>



      {showStats && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {/* Your Stats Content Here */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div
            style={{ cursor: 'pointer', textDecoration: selectedMenu === 'breeds' ? 'underline' : 'none' }}
            onClick={() => handleMenuClick('breeds')}
          >
            Breeds
          </div>
          <div
            style={{ cursor: 'pointer', textDecoration: selectedMenu === 'sizes' ? 'underline' : 'none' }}
            onClick={() => handleMenuClick('sizes')}
          >
            Sizes
          </div>
          <div
            style={{ cursor: 'pointer', textDecoration: selectedMenu === 'energy' ? 'underline' : 'none' }}
            onClick={() => handleMenuClick('energy')}
          >
            Energy
          </div>
        </div>

        {/* Content based on selected menu */}
        {selectedMenu === 'breeds' && <BreedsTable />}
        {selectedMenu === 'sizes' && <SizesTable />}
        {selectedMenu === 'energy' && <EnergyTable />}
        </div>
      )}
  </div>
)};


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
          <span className="tree">🐶</span>
        </AdvancedMarker>
      ))}
    </>
  );
};

const BreedsTable: React.FC = () => (
  <table>
    <thead>
      <tr>
        <th>Breed</th>
        <th>Information</th>
      </tr>
    </thead>
    <tbody>
      {/* Add rows with breed information */}
      <tr>
        <td>Breed 1</td>
        <td>Information about Breed 1</td>
      </tr>
      <tr>
        <td>Breed 2</td>
        <td>Information about Breed 2</td>
      </tr>
      {/* ... Add more rows as needed */}
    </tbody>
  </table>
);

const SizesTable: React.FC = () => (
  <table>
    {/* Similar structure to BreedsTable */}
</table>
);

const EnergyTable: React.FC = () => (
  <table>
    {/* Similar structure to BreedsTable */}
</table>
);

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
