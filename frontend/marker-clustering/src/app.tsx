import React, { useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
import { createRoot } from 'react-dom/client';

import { APIProvider, Map, useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import SignUpForm from './SignUpForm'; // Adjust the path accordingly
import SignInForm from './SignInForm'; // Adjust the path accordingly

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

  const [username, setUsername] = useState<string>(''); // Add username state

  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Load Google Maps API asynchronously
    const loadGoogleMapsApi = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=maps&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // The Google Maps API has been loaded
        // You can initialize your map or perform other actions here
        console.log('Google Maps API loaded');
      };
      document.head.appendChild(script);
    };

    // Call the function to load the API
    loadGoogleMapsApi();

    // Clean up the script tag on component unmount
    return () => {
      const script = document.querySelector('script[src^="https://maps.googleapis.com"]');
      if (script) {
        script.remove();
      }
    };
  }, []); // Empty dependency array ensures that this effect runs only once on component mount


  const toggleStats = (park) => {
    setShowStats(true);
    setShowCheckIn(false);
    setLivePark(park)
    setShowDogStats(false);
    setShowChat(false)
    setShowCalendar(false)
    setShowCheckOut(false)
  };

  const [livePark, setLivePark] = useState('')

  const [showCheckIn, setShowCheckIn] = useState(false);

  const toggleCheckIn = (park) => {
    setShowCheckIn(true);
    setLivePark(park)
    setShowDogStats(false);
    setShowStats(false)
    setShowChat(false)
    setShowCalendar(false)
    setShowCheckOut(false)
  };

  const [showCheckOut, setShowCheckOut] = useState(false);

  const toggleCheckOut = (park) => {
    setShowCheckOut(true)
    setShowCheckIn(false);
    setShowDogStats(false);
    setShowStats(false)
    setShowChat(false)
    setShowCalendar(false)
    //run
  };

  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendar = (park) => {
    setShowCalendar(park)
    setShowCheckOut(false)
    setShowChat(false)
    setShowCheckIn(false);
    setLivePark(park)
    setShowDogStats(false);
    setShowStats(false)
  };

  const [showChat, setShowChat] = useState(false);

  const toggleChat = (park) => {
    setShowChat(true)
    setShowCalendar(false)
    setShowCheckOut(false)
    setShowCheckIn(false);
    setLivePark(park)
    setShowDogStats(false);
    setShowStats(false)
  };

  const [showDogStats, setShowDogStats] = useState(false);


  const toggleDogStats = () => {
    if (
      !showChat &&
      livePark === null &&
      !showCalendar &&
      !showCheckOut &&
      !showCheckIn &&
      !showStats
    ) {
      setShowDogStats((prevShowDogStats) => !prevShowDogStats);
    } else {
      setShowDogStats((prevShowDogStats) => !prevShowDogStats);

      setShowChat(false)
      setLivePark(null)
      setShowCalendar(false)
      setShowCheckOut(false)
      setShowCheckIn(false);
      setShowStats(false)
    }
  };


  const [selectedMenu, setSelectedMenu] = useState('breeds');

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  const [mapConfig, setMapConfig] = useState<MapConfig>(MAP_CONFIGS[0]);


  const [userSignedIn, setUserSignedIn] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const handleSignIn = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3029/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setUserSignedIn(true);
        setUsername(username); // Set the username in the state
      } else {
        console.error('Sign-in failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const handleSignUp = async (username: string, password: string, dogData: Dog) => {
  try {
    const requestBody = {
      username: username,
      password: password,
      dogName: dogData.name,
      breed: dogData.breed,
      size: dogData.size,
      energy: dogData.energy,
      age: dogData.age.toString(),
      dogImage: dogData.image,
    };

    const response = await fetch('http://localhost:3029/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setUserSignedIn(true);
        setUsername(username); // Set the username in the state
      } else {
        console.error('Sign-up failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
};


  const handleAddDog = (newDogs: Dog[]) => {
    setDogs((prevDogs) => [...prevDogs, ...newDogs]);
  };


  const [infowindowOpen, setInfowindowOpen] = useState(false);

  const toggleWindow = () => {
    setInfowindowOpen(!infowindow)
  };

  useEffect(() => {
     // Example: Check if the user is signed in
     //const isUserSignedIn = /* Your logic to check if the user is signed in */;
     //setUserSignedIn(isUserSignedIn);
   }, []);

   type UserDogsResponse = {
     userDogs: Dog[];
   };
   // Function to fetch user's dogs
 const fetchUserDogs = async (username: string) => {
   try {
     const response = await fetch(`http://localhost:3029/userdogs?username=${username}`, {
       method: 'GET',
       headers: {
         'Content-Type': 'application/json',
       },
       // Include any necessary authentication headers, such as tokens
     });

     if (response.ok) {
       const data: UserDogsResponse = await response.json();
       return data.userDogs;
     } else {
       console.error('Failed to fetch user dogs:', response.statusText);
       return [];
     }
   } catch (error) {
     console.error('Error during fetch:', error);
     return [];
   }
 };

 const [userDogs, setUserDogs] = useState<Dog[]>([]);


 useEffect(() => {
    const fetchData = async () => {
      if (userSignedIn) {
        try {
          const dogs = await fetchUserDogs(username);
          setUserDogs(dogs);
        } catch (error) {
          console.error('Error fetching user dogs:', error);
        }
      }
    };

    fetchData();
  }, [userSignedIn, username]);
    // Render user dogs
    const renderUserDogs = () => {
      if (userDogs.length === 0) {
        return <p>No dogs found for the user.</p>;
      }

      return (
        <div>
          <h5 style={{ textAlign: 'left', marginBottom: '20px' }}>Your Dogs:</h5>
          <ul>
            {userDogs.map((dog, index) => (
              <li key={index} >
            {dog.dogImage} -  {dog.dogName}     <button onClick={() => toggleDogStats()} style={{ color: 'grey'}}>Stats</button>  <a style={{ color: 'grey'}}>Edit</a>
              </li>
            ))}
          </ul>
        </div>
      );
    };



return (

  <div style={{ width: '90%', height: '300px', margin: '0 auto' }}>
  {userSignedIn ? (
    <>
    <h2 style={{ textAlign: 'left', marginBottom: '0px' }}>Park Bark It </h2>
    <h4 style={{ textAlign: 'right', marginBottom: '00px' }}>{username}</h4>
    {renderUserDogs()}
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
      Add Dog
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
      gestureHandling={'greedy'}
      disableDefaultUI={true}
        >
        <Markers points={trees} />
        <MarkerWithInfowindow infowindowOpen={infowindowOpen} toggleWindow={toggleWindow} toggleStats={toggleStats} toggleCheckIn={toggleCheckIn} toggleCalendar={toggleCalendar} toggleCheckOut={toggleCheckOut} toggleChat={toggleChat}/>
      </Map>
    </APIProvider>



      {showStats && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ cursor: 'pointer', textDecoration: selectedMenu === 'breeds' ? 'underline' : 'none' }}
          onClick={() => handleMenuClick('na')}
        >
          Live Dogs
        </div>

      </div>
          <RosterTable/>
          {/* Your Stats Content Here */}


        {/* Content based on selected menu */}

        </div>
      )}

      {showCheckIn && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div
          style={{ cursor: 'pointer', textDecoration: selectedMenu === 'breeds' ? 'underline' : 'none' }}
          onClick={() => handleMenuClick('na')}
        >
        {userDogs.map((dog, index) => (
          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', margin: '10px', textAlign: 'left' }}>
            <h3>{dog.dogName}'s <div>Check In</div></h3>

          </div>
        ))}

        </div>

      </div>

          {/* Your Stats Content Here */}


        {/* Content based on selected menu */}

        </div>
      )}


            {showDogStats && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div
                style={{ cursor: 'pointer', textDecoration: selectedMenu === 'breeds' ? 'underline' : 'none' }}
                onClick={() => handleMenuClick('na')}
              >
              {userDogs.map((dog, index) => (
                <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', margin: '10px', textAlign: 'left' }}>
                  <h3>{dog.dogName}'s Park Stats</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li><strong>Time at Park This Week:</strong> <div style={{ marginLeft: '10px', display: 'inline-block' }}>5.7h</div></li>
                    <li><strong>All Time at Park:</strong> <div style={{ marginLeft: '10px', display: 'inline-block' }}>125h</div></li>
                    <li><strong>Park Breakdown</strong></li>
                    <li><strong>Energy:</strong> {dog.energy}</li>
                    <li><strong>Size:</strong> {dog.size}</li>
                    <li><strong>Breed:</strong> {dog.breed}</li>
                    <li><strong>Age:</strong> {dog.age} yrs</li>
                  </ul>
                </div>
              ))}
              </div>

            </div>

                {/* Your Stats Content Here */}


              {/* Content based on selected menu */}

              </div>
            )}

      </>
    ):(
      <>
        <h2 style={{ textAlign: 'left', marginBottom: '0px' }}> Park Bark It </h2>
        <SignInForm onSignIn={handleSignIn} />
        <SignUpForm onSignUp={handleSignUp} />
      </>
    )}
  </div>
)};


type Point = google.maps.LatLngLiteral & { key: string };
type Props = { points: Point[] };

type Dog = {
  name: string;
  breed: string;
  size: string;
  energy: string;
  age: number;
  image: File | null;
};

const Markers: React.FC<Props> = ({ points }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer
  // useEffect(() => {
  //   if (!map) return;
  //   if (!clusterer.current) {
  //     clusterer.current = new MarkerClusterer({ map });
  //   }
  // }, [map]);

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

// <tbody>
//   {userDogs.map((dog, index) => (
//     <tr key={index}>
//       <td style={{ padding: '5px' }}>{dog.name}</td>
//       <td style={{ padding: '5px' }}>{dog.image && <img src={URL.createObjectURL(dog.image)} alt="Dog" />}</td>
//       <td style={{ padding: '5px' }}>{dog.breed}</td>
//       <td style={{ padding: '5px' }}>{dog.size}</td>
//       <td style={{ padding: '5px' }}>{dog.energy}</td>
//       <td style={{ padding: '5px' }}>Open</td>
//       <td style={{ padding: '5px' }}>{dog.age} yrs</td>
//     </tr>
//   ))}
// </tbody>
