
import './map.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// import axios from 'axios';


const Map = () => {

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

const mapContainer = useRef(null);
const geocoderContainerRef = useRef(null);
const map = useRef(null);

const [lng, setLng] = useState(-74.50);
const [lat, setLat] = useState(40.73);

const [zoom, setZoom] = useState(9);
// const [countryDetails, setCountryDetails] = useState({});
// const [countryName, setCountryName] = useState("");


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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await axios.get(
  //       `https://restcountries.com/v2/name/${countryName}`
  //     );

  //     setCountryDetails(response.data[0]);
  //   };
  //   fetchData();
  // }, [countryName]);


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


  

// API call 

    // geocoder.on("result", function(e) {
    //   console.log({Place: e.result.place_name});
    //   console.log("Geocoder result", e.result);
    //   console.log({Long: e.result.center[0] , Lat: e.result.center[1]})
    // });
    geocoder.on("result", (result) => {
      let place = result.result.place_name
      console.log(place);
      
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

export default Map