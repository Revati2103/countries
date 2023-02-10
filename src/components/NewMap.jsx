import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX;

const NewMap = () => {
  const mapContainerRef = useRef(null);
  const geocoderRef = useRef(null);
  const [location, setLocation] = useState('');

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-73.96216, 40.80779],
      zoom: 12
    });

    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_ACCESS_TOKEN,
      mapboxgl: mapboxgl
    });

    geocoder.on('result', (ev) => {
      const selectedResult = ev.result;
      const countryName = selectedResult.text;

      fetch(`https://restcountries.com/v2/name/${countryName}?fullText=true`)
        .then(res => res.json())
        .then(data => {
          // Do something with the data
          console.log(data)
        });
    });

    map.addControl(geocoder);
    geocoderRef.current = geocoder;
  }, []);

  const handleGeocoderInput = (event) => {
    setLocation(event.target.value);
    if (geocoderRef.current) {
      geocoderRef.current.query(location);
    }
  };

  return (
    <div>
      <input type="text" onChange={handleGeocoderInput} value={location} />
      <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />
    </div>
  );
};

export default NewMap;
