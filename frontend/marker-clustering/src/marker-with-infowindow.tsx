import React, { useState, useEffect } from 'react';
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import smallDog from './smallDog.png'
import bigDog from './bigDog.png'
import appleMaps from './apple.jpg'
import googleMaps from './googlemap.png'
import chat from './chat-118.png'
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
  const [showInitialWindow, setShowInitialWindow] = useState(true);



  useEffect(() => {
    if (infowindowOpen && marker) {
      marker.current?.showInfoWindow();
    }
  }, [infowindowOpen, marker]);

  const handleMarkerClick = () => {
     setInfowindowOpen(!infowindowOpen);
     setShowInitialWindow(true);
   };

   const handleExpandClick = () => {
     setShowInitialWindow(false);
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
  }, [infowindowOpen]);


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
       gmpClickable={true}
       gmpDraggable={true}
     >
       <span className="tree" style={{ pointerEvents: 'initial !important' }}>
         🐶
       </span>
     </AdvancedMarker>
     {infowindowOpen && marker && (
       <InfoWindow anchor={marker} maxWidth={showInitialWindow ? 200 : 300} maxHeight={400}>
         {showInitialWindow ? (
           <div style={{ padding: '10px', borderRadius: '8px' }}>
             <code style={{ color: 'black', whiteSpace: 'nowrap',  fontSize: '14px', }}>Westwoof Dog Park</code>
             <div>
             <div style={{ color: 'black', whiteSpace: 'nowrap', fontSize: '16px' }}>
               <img src={bigDog} alt="Big Dogs" style={{ height: '30px', marginTop: '0px', width: '30px', marginRight: '5px' }} />
               : <p style={{ fontSize: '16px', display: 'inline-block', marginTop: '0px', marginLeft: '5px', marginRight: '5px' }}> {bigParkDataMarker}</p>
               <img src={smallDog} alt="Small Dogs" style={{ height: '30px', marginTop: '0px', width: '30px', marginRight: '5px' }} />
               : <p style={{ fontSize: '16px', display: 'inline-block', marginTop: '0px', marginLeft: '5px', marginRight: '5px' }}> {smallParkDataMarker}</p>
             </div>
             </div>
             <button onClick={handleExpandClick} style={{ cursor: 'pointer', padding: '5px', borderRadius: '5px', backgroundColor: '#8fdf82', marginTop: '0px', fontSize: '14px' }}>
               Expand
             </button>
           </div>
         ) : (
           <div style={{ padding: '10px', borderRadius: '8px', overflowY: 'auto' }}>
             {/* Display additional information here */}
             {/* Example: */}
             <code style={{ color: 'black', whiteSpace: 'nowrap',  fontSize: '14px', marginBottom: '10px'}}>Westwoof Dog Park:</code>

             <div style={{ cursor: 'pointer', color: 'blue', fontSize: '14px', marginTop: '10px' }}>
             <img src={chat} alt="ch Dogs" style={{ height: '40px', width: '40px', marginRight: '10px' }} onClick={() => toggleChat('westwoof')} />
             <img src={appleMaps} alt="apple Dogs" style={{ height: '40px', width: '40px', marginRight: '10px' }} onClick={() => onAppleMaps('westwoof')}/>
             <img src={googleMaps} alt="google Dogs" style={{ height: '40px', width: '40px', marginRight: '5px' }} onClick={() => onGoogleMaps('westwoof')}/>
             </div>

             <div style={{ cursor: 'pointer', color: 'blue', fontSize: '14px', marginTop: '5px' }}>
               <div >
                 <a
                   style={{ cursor: 'pointer', color: 'blue', fontSize: '14px', marginTop: '5px' }}
                   onClick={() => toggleCheckIn('westwoof')}
                 >
                   Check In Your Dog(s)
                 </a>
               </div>
               <div style={{ cursor: 'pointer', color: 'blue', fontSize: '14px', marginTop: '10px' }} onClick={() => toggleCheckOut('westwoof')}>
                 Check Out Your Dog(s)
               </div>
             </div>
             <div style={{ cursor: 'pointer', color: 'blue', fontSize: '14px', marginTop: '10px' }} onClick={() => toggleStats('westwoof')}>
               View Dogs At The Park
             </div>

           </div>
         )}
       </InfoWindow>
     )}
   </div>
 );

}
