import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import CountryDetails from './CountryDetails/CountryDetails';

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX;

const NewMap = () => {
  const mapContainerRef = useRef(null);
  const geocoderRef = useRef(null);
  const [location, setLocation] = useState('');
  const [news, setNews] = useState([]);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-73.96216, 40.80779],
      zoom: 12
    });

    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_ACCESS_TOKEN,
      mapboxgl: mapboxgl,
      types: 'country'
    });


    geocoder.on('result', function (ev) {
     const selectedResult = ev.result;
     console.log(selectedResult)
     const countryName = selectedResult.text;
     const countryCode = selectedResult.properties.short_code;
    
    
      if (countryCode && countryName) {
        fetch(`https://restcountries.com/v2/alpha/${countryCode}`)
          .then(res => res.json())
          .then(data => {
    const languages = data.languages;
    const languageNames = languages.map(language => language.name);

    console.log(languageNames);
            setLocation(data)
           console.log(data)
          });

          if(countryCode){
            fetch(`https://newsapi.org/v2/top-headlines?country=${countryCode}&category=politics&language=en&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`)
  .then(res => res.json())
  .then(data => {
    const articles = data.articles.slice(0, 5);
    setNews(articles)
    console.log(data);
  })
          }
      }
    });

  

    map.addControl(geocoder);
    geocoderRef.current = geocoder;

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
    map.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
    map.addControl(new mapboxgl.GeolocateControl(), 'bottom-left');
  }, []);

  const handleGeocoderInput = (event) => {
    setLocation(event.target.value);
    if (geocoderRef.current) {
      geocoderRef.current.query(location);
      setLocation(null)
    }
  };

  return (
    <div>
      <input type="text" onChange={handleGeocoderInput} value={location} hidden/>
      <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />
      {location && <CountryDetails location={location} news= {news}/>}
    </div>
  );
};

export default NewMap;
