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
        center: [0, 90],
        zoom: 1,
        bearing: 0,
        pitch: 30,
        
      };

    const map = new mapboxgl.Map({
        container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-74.5, 40],
      zoom: 7,
      ...initialCamera
    });

    map.on('load', () => {

        map.jumpTo({
            center: [0, 90],
            pitch: 30,
          });
        // Rotate the map
    
        map.rotateTo(180, { duration: 6000 });

        // Add button to reset view to initial camera position
        const resetViewButton = document.createElement('button');
        resetViewButton.innerHTML = 'Reset View';
        resetViewButton.classList.add("reset-btn");
        resetViewButton.addEventListener('click', () => {
          map.flyTo(initialCamera);
        });
        map.getContainer().appendChild(resetViewButton);

      });


    map.on('style.load', () => {
        // Custom atmosphere styling
        map.setFog({
        'color': 'rgb(220, 159, 159)', // Pink fog / lower atmosphere
        'high-color': 'rgb(36, 92, 223)', // Blue sky / upper atmosphere
        'horizon-blend': 0.1 // Exaggerate atmosphere (default is .1)
        });
     });

     
  
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      types: 'country',
      placeholder: 'Search any country...',
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
            duration: 12000,
            essential: true,
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

      const marker = new mapboxgl.Marker({ title: 'Click to learn more', color: '#DB2777' }).setLngLat(coordinates).addTo(map);
      console.log('Marker:', marker);

      marker.on('flyend', () => {
        marker.togglePopup();
      });

      markerRef.current = marker;
     // markerRef.current.flyTo({ center });
   


    //  API call 
       
    if (countryCode && countryName) {
        fetch(`https://restcountries.com/v2/alpha/${countryCode}`)
        .then(res => res.json())
        .then(data => {
            setLocation(data)
            const languages = data.languages;
    const languageNames = languages.map(language => language.name);
            const popup = new mapboxgl.Popup({ offset: 15, anchor: 'right' })
            .setHTML(`
           
       <h2>${data.name}</h2>
        <img src=${data.flags.png} alt="flag" style={{
            width: 2
          }}/>
        <p>Capital: ${data.capital}</p>
        <p>Population: ${data.population}</p>
        <p>Continent: ${data.region}</p>
        <div>Language(s):
          <p>${languageNames}</p>
        </div>
        <p>Currency : ${data.currencies[0].name + " " +data.currencies[0].symbol}</p>
      
            `);
    
            popupRef.current = popup;
    
            console.log('Popup:', popup);

            // Add a class to the popup if the screen size is small
if (window.innerWidth < 600) {
    popup.addClassName('mobile-popup');
}

// Remove the class if the screen size changes to a larger size
window.addEventListener('resize', () => {
    if (window.innerWidth >= 600) {
        popup.removeClassName('mobile-popup');
    }
});
            marker.setPopup(popup).togglePopup();
            console.log(location);
        })
   
    
       
    }   

   

    });


    map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
    map.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
    map.addControl(new mapboxgl.GeolocateControl(), 'bottom-left');

 

    return () => {
      map.remove();
    };
// eslint-disable-next-line 
  }, [popup]);

  
  return (
  <div>
      
      <div ref={mapContainer} style={{ height: '100vh', width: '100vw' , marginTop: '0px' }}>

     </div>

 
       
  
      
  </div>
  
  );
};

export default MapTwo;


