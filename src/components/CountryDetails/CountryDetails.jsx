import React from 'react'
import './country.css'

const CountryDetails = ({location, news}) => {
  return (
 
  <div className='info'>
    <div className='country-info'>
        <h2>{location.name}</h2>
        <img src={location.flags.png} alt="flag" style={{
          width: 100
        }}/>
        <p>Capital: {location.capital}</p>
        <p>Population: {location.population}</p>
        <p>Continent: {location.region}</p>
        <div>Languages:
          {location.languages.map((language) => (
            <li>{language.name}</li>
          ))}
    
        </div>
        <p>Currency : {location.currencies[0].name + " " +location.currencies[0].symbol}</p>
    
    </div>
    <div>
      {news.map(article => (
        <div className="news-article" key={article.title}>
          <h3>{article.title}</h3>
          <p>{article.description}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
        </div>
      ))}
    </div>
  </div>
  )
}

export default CountryDetails