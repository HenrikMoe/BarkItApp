import React, {useState} from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';

export const MarkerWithInfowindow = ({toggleStats}) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={{lat: 34.054, lng: -118.4465}}
        title={'Live Bark Chart'}
      ><span className="tree">🐶</span></AdvancedMarker>
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => setInfowindowOpen(false)}>
            <code style={{color: 'black', whiteSpace: 'nowrap'}}>Westwoof Dog Park</code>{' '}
            <div
                       style={{ cursor: 'pointer', color: 'blue' }}
                       onClick={toggleStats}
                     >
                       Check In
                     </div>
                     <div
                                style={{ cursor: 'pointer', color: 'blue' }}
                                onClick={toggleStats}
                              >
                                Check Out
                              </div>
          <code style={{color: 'black', whiteSpace: 'nowrap'}}>Big Dogs: 10 {' '}</code>{' '}
          <code style={{color: 'black', whiteSpace: 'nowrap'}}>Small Dogs: 5{' '}</code>{' '}
          <div
                     style={{ cursor: 'pointer', color: 'blue' }}
                     onClick={toggleStats}
                   >
                    Dog Roster
                   </div>
                   <div
                              style={{ cursor: 'pointer', color: 'blue' }}
                              onClick={toggleStats}
                            >
                               Chat
                            </div>
                   <div
                              style={{ cursor: 'pointer', color: 'blue' }}
                              onClick={toggleStats}
                            >
                              Calendar
                            </div>



        </InfoWindow>
      )}
    </>
  );
};
