// GoogleMap.js

//center: { lat: 34.0549, lng: -118.242 },

import React, { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import dogParksData from './dogParksData'; // Adjust the path accordingly

const GoogleMap = () => {
  useEffect(() => {
    const mapOptions = {
      center: { lat: 34.0549, lng: -118.242 },
      zoom: 11,
    };

console.log(process.env.REACT_APP_GOOGLE_MAPS_CLIENT_ID)
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_CLIENT_ID ,
      version: 'weekly',
      // ...additionalOptions,
    });

    loader
      .load()
      .then(async () => {
        const { Map } = await loader.importLibrary('maps');
        new Map(document.getElementById('map'), mapOptions);
      })
      .catch((e) => {
        console.error('Error loading Google Maps:', e);
        // Handle error
      });
  }, []); // Empty dependency array to run the effect only once on mount

  return <div id="map" style={{ height: '200px', width: '90%' }}></div>;
};

export default GoogleMap;
