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


const API_KEY = 'AIzaSyDQJYjiOjkl71sqPUN_YCivM8IgjwcGv7k'//process.env.VITE_REACT_APP_GOOGLE_MAPS_CLIENT_ID

import mapStyle from './mapStyle.ts';

const MapTypeId = {
  HYBRID: 'hybrid',
  ROADMAP: 'roadmap',
  SATELLITE: 'satellite',
  TERRAIN: 'terrain'
};
export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
  styles?: google.maps.MapTypeStyle[];
};

const MAP_CONFIGS: MapConfig[] = [

  {
    id: 'styled1',
    label: 'Raster / "Bright Colors" (no mapId)',
    mapTypeId: MapTypeId.ROADMAP,
    styles: mapStyle
  },

];




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

  const [mapConfig, setMapConfig] = useState<MapConfig>(MAP_CONFIGS[0]);


return (

  <div style={{ width: '90%', height: '300px', margin: '0 auto' }}>
    <h2 style={{ textAlign: 'left', marginBottom: '0px' }}>Bark It Doggo Live</h2>
    <h4 style={{ textAlign: 'right', marginBottom: '00px' }}>HanCoont</h4>
    <h5 style={{ textAlign: 'left', marginBottom: '100px' }}>your Dog pic 1</h5>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
    <div
      style={{ cursor: 'pointer', textDecoration: selectedMenu === 'breeds' ? 'underline' : 'none' }}
      onClick={() => handleMenuClick('share')}
    >
      Share
    </div>
    <div
      style={{ cursor: 'pointer', textDecoration: selectedMenu === 'sizes' ? 'underline' : 'none' }}
      onClick={() => handleMenuClick('edit')}
    >
      Edit
    </div>
    <div
      style={{ cursor: 'pointer', textDecoration: selectedMenu === 'energy' ? 'underline' : 'none' }}
      onClick={() => handleMenuClick('sign out')}
    >
      Sign Out
    </div>
  </div>

    <APIProvider apiKey={API_KEY}>
      <Map
      mapId={'caa20c8067d8c74b'}
      center={{ lat: 34.054, lng: -118.4465 }}
      zoom={11}
      styles={mapConfig.styles}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
        >
        <Markers points={trees} />
        <MarkerWithInfowindow toggleStats={toggleStats}/>
      </Map>
    </APIProvider>



      {showStats && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ cursor: 'pointer', textDecoration: selectedMenu === 'breeds' ? 'underline' : 'none' }}
          onClick={() => handleMenuClick('na')}
        >
          Live At The Dog Park
        </div>

      </div>
          <RosterTable/>
          {/* Your Stats Content Here */}


        {/* Content based on selected menu */}

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

const RosterTable: React.FC = () => (
  <div style={{ overflowX: 'auto' }}>

  <table style={{ width: '90%', overflowX: 'auto' }}>
    <thead>
      <tr>
        <th style={{ padding: '5px' }}>Dog</th>
        <th style={{ padding: '5px' }}>Pic</th>
        <th style={{ padding: '5px' }}>Breed</th>
        <th style={{ padding: '5px' }}>Size</th>
        <th style={{ padding: '5px' }}>Energy</th>
        <th style={{ padding: '5px' }}>Reviews</th>
        <th style={{ padding: '5px' }}>Age</th>
      </tr>
    </thead>
    <tbody>
      {/* Add rows with breed information */}
      <tr>
        <td style={{ padding: '5px' }}>Butters</td>
        <td style={{ padding: '5px' }}>pic</td>
        <td style={{ padding: '5px' }}>Border Aussie</td>
        <td style={{ padding: '5px' }}>32lbs</td>
        <td style={{ padding: '5px' }}>Med</td>
        <td style={{ padding: '5px' }}>Open</td>
        <td style={{ padding: '5px' }}>5 mo</td>
      </tr>
      <tr>
        <td style={{ padding: '5px' }}>Cudi</td>
        <td style={{ padding: '5px' }}>pic</td>
        <td style={{ padding: '5px' }}>Secret Cat</td>
        <td style={{ padding: '5px' }}>14 lbs</td>
        <td style={{ padding: '5px' }}>Med</td>
        <td style={{ padding: '5px' }}>Open</td>
        <td style={{ padding: '5px' }}>3.9 yr</td>
        {/* Add more cells as needed */}
      </tr>
      <tr>
        <td style={{ padding: '5px' }}>Trex</td>
        <td style={{ padding: '5px' }}>pic</td>
        <td style={{ padding: '5px' }}>Secret Cat</td>
        <td style={{ padding: '5px' }}>13 lbs</td>
        <td style={{ padding: '5px' }}>Med</td>
        <td style={{ padding: '5px' }}>Open</td>
        <td style={{ padding: '5px' }}>1.6 yr</td>
        {/* Add more cells as needed */}
      </tr>
      <tr>
        <td style={{ padding: '5px' }}>MeuMoo</td>
        <td style={{ padding: '5px' }}>pic</td>
        <td style={{ padding: '5px' }}>Secret Cat</td>
        <td style={{ padding: '5px' }}>9 lbs</td>
        <td style={{ padding: '5px' }}>Med</td>
        <td style={{ padding: '5px' }}>Open</td>
        <td style={{ padding: '5px' }}>8 mo</td>
        {/* Add more cells as needed */}
      </tr>
      {/* ... Add more rows as needed */}
    </tbody>
  </table>
  </div>

);


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
