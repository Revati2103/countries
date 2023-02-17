import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

const MapTwo = () => {

  const mapContainer = useRef(null);


  const [popup, setPopup] = useState(null);
  const [location, setLocation] = useState('');
  const markerRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const initialCamera = {
        center: [0, 0],
        zoom: 1,
        bearing: 0,
        pitch: 60,
      };

    const map = new mapboxgl.Map({
        container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-74.5, 40],
      zoom: 7,
      ...initialCamera
    });

  
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      types: 'country',
      placeholder: 'Search for a location',
    });



    map.addControl(geocoder);
      
    map.on('click', () => {
      if (popup) {
        popup.remove();
        setPopup(null);
      }
    });



    geocoder.on('result', (event) => {
        const {center } = event.result;
        map.flyTo({
            center,
            zoom: 9,
            duration: 5000, 
            easing: (t) => {
              return t;
            },
          });
      const selectedFeature = event.result;
      const coordinates = selectedFeature.center;
      const countryName = selectedFeature.text;
     const countryCode = selectedFeature.properties.short_code;

     // remove previous marker and popup, if any
  if (markerRef.current) {
    markerRef.current.remove();
  }
  if (popupRef.current) {
    popupRef.current.remove();
  }

      const marker = new mapboxgl.Marker({ title: 'Click to learn more' }).setLngLat(coordinates).addTo(map);
      console.log('Marker:', marker);
      markerRef.current = marker;


    //  API call 
       
    if (countryCode && countryName) {
        fetch(`https://restcountries.com/v2/alpha/${countryCode}`)
        .then(res => res.json())
        .then(data => {
            setLocation(data)
            const languages = data.languages;
    const languageNames = languages.map(language => language.name);
            const popup = new mapboxgl.Popup()
            .setHTML(`
            <div className='country-info'>
        <h2>${data.name}</h2>
        <img src=${data.flags.png} alt="flag" style={{
            width: 2
          }}/>
        <p>Capital: ${data.capital}</p>
        <p>Population: ${data.population}</p>
        <p>Continent: ${data.region}</p>
        <div>Languages:
          ${languageNames}
        </div>
        <p>Currency : ${data.currencies[0].name + " " +data.currencies[0].symbol}</p>
    
    </div>
            
            
            `);
    
            popupRef.current = popup;
    
            console.log('Popup:', popup);
            marker.setPopup(popup).togglePopup();
            console.log(location);
        })
   
    
       
    }   

   

    });

    return () => {
      map.remove();
    };

  }, [popup]);

  return <div ref={mapContainer} style={{ height: '100vh', width: '100vw' }}  />;
};

export default MapTwo;
