import React from 'react'
import './country.css'

const CountryDetails = ({location}) => {
  return (
    <div>
    <h2>{location[0].name}</h2>
    <p>Capital: {location[0].capital}</p>
    <p>Population: {location[0].population}</p>
    <p>Region: {location[0].region}</p>
  </div>
  )
}

export default CountryDetails