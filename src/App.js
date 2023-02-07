import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import axios from 'axios';


export default function App() {

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

const mapContainer = useRef(null);
const geocoderContainerRef = useRef(null);
const map = useRef(null);

const [lng, setLng] = useState(-74.50);
const [lat, setLat] = useState(40.73);
const [zoom, setZoom] = useState(9);
const [countryData, setCountryData] = useState({});



/* Given a query in the form "lng, lat" or "lat, lng"
* returns the matching geographic coordinate(s) */

const coordinatesGeocoder = function (query) {
  // Match anything which looks like
  // decimal degrees coordinate pair.
  const matches = query.match(
  /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
  );
  if (!matches) {
  return null;
  }
   
  function coordinateFeature(lng, lat) {
  return {
  center: [lng, lat],
  geometry: {
  type: 'Point',
  coordinates: [lng, lat]
  },
  place_name: 'Lat: ' + lat + ' Lng: ' + lng,
  place_type: ['coordinate'],
  properties: {},
  type: 'Feature'
  };
  }
   
  const coord1 = Number(matches[1]);
  const coord2 = Number(matches[2]);
  const geocodes = [];
   
  if (coord1 < -90 || coord1 > 90) {
  // must be lng, lat
  geocodes.push(coordinateFeature(coord1, coord2));
  }
   
  if (coord2 < -90 || coord2 > 90) {
  // must be lat, lng
  geocodes.push(coordinateFeature(coord2, coord1));
  }
   
  if (geocodes.length === 0) {
  // else could be either lng, lat or lat, lng
  geocodes.push(coordinateFeature(coord1, coord2));
  geocodes.push(coordinateFeature(coord2, coord1));
  }
   
  return geocodes;
  };

  useEffect(() => {

    //`https://restcountries.com/v3.1/name/${name}?fullText=true`
    axios
      .get('https://restcountries.com/v2/all')
      .then(response => {
        setCountryData(response.data);
        console.log(countryData);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // style: 'mapbox://styles/mapbox/streets-v12',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: zoom,
      pitch: 80,
      bearing: 41,
      antialias: true,
    });
    

   //new
    map.current.on("load", () => {

     
    
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      container: geocoderContainerRef.current,
      localGeocoder: coordinatesGeocoder,
      reverseGeocode: true,
      types: 'country'
    });

    map.current.addControl(geocoder);

    map.current.addSource("terrain-data", {
      type: "raster-dem",
      url: "https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=mapboxgl.accessToken",
      tileSize: 512,
      maxzoom: 14
    });

    map.current.addLayer({
      "id": "terrain-data",
      "type": "hillshade",
      "source": "terrain-data",
      "paint": {
        "hillshade-illumination-direction": 335,
        "hillshade-illumination-anchor": "map",
        "hillshade-exaggeration": 1,
        "hillshade-shadow-color": "#000000",
        "hillshade-highlight-color": "#FFFFFF",
        "hillshade-accent-color": "#000000"
      }
    });

  

// API call 

    geocoder.on("result", function(e) {

      console.log({Place: e.result.place_name});
      // const options = {
      //   method: 'GET',
      //   headers: {
      //     'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
      //     'X-RapidAPI-Host': 'timezone-api1.p.rapidapi.com'
      //   }
      // };
      
      // fetch(`https://timezone-api1.p.rapidapi.com/time?place=${e.result.place_name}`, options)
      //   .then(response => response.json())
      //   .then(response => console.log(response))
      //   .catch(err => console.error(err));
      console.log("Geocoder result", e.result);
      console.log({Long: e.result.center[0] , Lat: e.result.center[1]})
    });
    

     });

   

    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
      map.current.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
      map.current.addControl(new mapboxgl.GeolocateControl(), 'bottom-left');

      return () => map.current.remove();

  }, []);

  


  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });


  return (
    <>
      <div ref={geocoderContainerRef} />
      <div ref={mapContainer} className="map-container"/>
    </>
  );
}