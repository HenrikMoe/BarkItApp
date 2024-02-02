import React, { useState, useEffect } from 'react';
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import smallDog from './smallDog.png'
import bigDog from '.bigDog.png'
//weswoof unique marker
export const MarkerWithInfowindow = ({
  toggleStats,
  toggleCheckOut,
  toggleChat,
  toggleCalendar,
  toggleCheckIn,
  toggleWindow,
  parkname,

}) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [selection, setSelection] = useState('');



  useEffect(() => {
    if (infowindowOpen && marker) {
      marker.current?.showInfoWindow();
    }
  }, [infowindowOpen, marker]);

  const handleMarkerClick = () => {
    console.log('hellomarker');
    // toggleStats()
    setInfowindowOpen(!infowindowOpen);
  };

  const onGoogleMaps = (dogParkName) => {
    // Local dictionary mapping dog park names to their coordinates
    const dogParkCoordinates = {
      'westwoof': '34.053935, -118.444793',
      'Dog Park 2': '34.123456, -118.789012',
      // Add more dog parks as needed
    };

    // Get the coordinates for the given dog park name
    const coordinates = dogParkCoordinates[dogParkName];

    if (coordinates) {
      // Open Google Maps navigation link with coordinates
      const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coordinates)}`;

      // Open the link in a new tab/window
      window.open(googleMapsLink, '_blank');
    } else {
      console.error(`Coordinates not found for dog park: ${dogParkName}`);
      // Handle the case where the coordinates are not found for the given dog park
    }
  };

  const onAppleMaps = (dogParkName) => {
    // Local dictionary mapping dog park names to their coordinates
    const dogParkCoordinates = {
      'westwoof': '34.053935, -118.444793',
      'Dog Park 2': '34.123456, -118.789012',
      // Add more dog parks as needed
    };

    // Get the coordinates for the given dog park name
    const coordinates = dogParkCoordinates[dogParkName];

    if (coordinates) {
      // Open Apple Maps navigation link with coordinates
      const appleMapsLink = `https://maps.apple.com/?daddr=${encodeURIComponent(coordinates)}`;

      // Open the link in a new tab/window
      window.open(appleMapsLink, '_blank');
    } else {
      console.error(`Coordinates not found for dog park: ${dogParkName}`);
      // Handle the case where the coordinates are not found for the given dog park
    }
  };

  const [bigParkDataMarker, setBigParkDataMarker]=useState([])

  const [smallParkDataMarker, setSmallParkDataMarker]=useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3029/updateParkStats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parkName: 'westwoof',
            // Include other fields as needed
          }),
        });

        if (!response.ok) {
          console.error('Failed to update park stats:', response.statusText);
          // Handle the error here if needed
          return;
        }

        const data = await response.json();
        console.log(data);

        console.log(data.activeDogsBigPark); // Assuming this field exists in your MongoDB schema
        // Update the state with the received data
        setBigParkDataMarker(data.activeDogsBigPark.length);
        setSmallParkDataMarker(data.activeDogsSmallPark.length);
        console.log(bigParkData);
      } catch (error) {
        console.error('Error during toggleStats:', error);
        // Handle the error here if needed
      }
    };

    fetchData();
  }, []);


//  useEffect(() => {
// console.log()
// }, []);


 // <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => toggleCalendar('westwoof')}>
 //   Calendar
 // </div>

  return (
    <div style={{ pointerEvents: 'initial' }}>
      <AdvancedMarker
      key={infowindowOpen ? 'open' : 'closed'}
        ref={markerRef}
        onClick={handleMarkerClick}
        position={{ lat: 34.054, lng: -118.4465 }}
        title={'Live Bark Chart'}
        gmpClickable={true} // Make the marker clickable
        gmpDraggable={true} // Make the marker draggable
      >
        <span className="tree" style={{ pointerEvents: 'initial !important' }}>
          🐶
        </span>
      </AdvancedMarker>
      {infowindowOpen && marker && (
        <InfoWindow anchor={marker} maxWidth={200}>
          {/* InfoWindow content */}
          <code style={{ color: 'black', whiteSpace: 'nowrap' }}>Westwoof Dog Park</code>

          <div>
            <a style={{ cursor: 'pointer', color: 'blue' }} onClick={() => toggleCheckIn('weswoof')}>
              Check In
            </a>
          </div>
          <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => toggleCheckOut('weswoof')}>
            Check Out
          </div>
          <code style={{ color: 'black', whiteSpace: 'nowrap' }}>Big Dogs: {bigParkDataMarker}</code>
          <code style={{ color: 'black', whiteSpace: 'nowrap' }}>Small Dogs: {smallParkDataMarker}</code>
          <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => toggleStats('westwoof')}>
            Active Dogs
          </div>
          <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => toggleChat('westwoof')}>
            Chat
          </div>
          <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => toggleCalendar('westwoof')}>
            Calendar
          </div>
          <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => onAppleMaps('westwoof')}>
            Apple Maps
          </div>
          <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => onGoogleMaps('westwoof')}>
            Google Maps
          </div>
        </InfoWindow>
      )}
    </div>
  );
};
