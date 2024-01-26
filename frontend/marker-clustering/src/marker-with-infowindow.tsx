import React, { useState, useEffect } from 'react';
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

export const MarkerWithInfowindow = ({
  toggleStats,
  toggleCheckOut,
  toggleChat,
  toggleCalendar,
  toggleCheckIn,
  toggleWindow
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
    setInfowindowOpen(!infowindowOpen);
  };

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
          <code style={{ color: 'black', whiteSpace: 'nowrap' }}>Big Dogs: 10 </code>
          <code style={{ color: 'black', whiteSpace: 'nowrap' }}>Small Dogs: 5</code>
          <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => toggleStats('westwoof')}>
            Dog Roster
          </div>
          <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => toggleChat('westwoof')}>
            Chat
          </div>
          <div style={{ cursor: 'pointer', color: 'blue' }} onClick={() => toggleCalendar('westwoof')}>
            Calendar
          </div>
        </InfoWindow>
      )}
    </div>
  );
};
