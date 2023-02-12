import React from 'react'
import './country.css'

const CountryDetails = ({location}) => {
  return (
 
  <div>
      <h2>{location.name}</h2>
      <img src={location.flags.png} alt="flag" style={{
        width: 100
      }}/>
      <p>Capital: {location.capital}</p>
      <p>Population: {location.population}</p>
      <p>Continent: {location.region}</p>
      <div>Languages: 
     
        <ul>{location.languages.map(language => (
          <li>{language.name}</li> 
        ))}</ul>
        
      </div>
      <p>Currency : {location.currencies[0].name + " " +location.currencies[0].symbol}</p>
      <p>Timezone: {location.timezones}</p>
    
  </div>
  )
}

export default CountryDetails