import { useState } from 'react'
import CountryDetails from './countryDetails'

const Countries = ({ countries, filter }) => {
  const [selectedCountry, setSelectedCountry] = useState(null)

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  if (selectedCountry) {
    return <CountryDetails country={selectedCountry} />
  }

  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (filteredCountries.length === 1) {
    return <CountryDetails country={filteredCountries[0]} />
  }

  return (
    <div>
      {filteredCountries.map(country => (
        <div key={country.name.common}>
          {country.name.common}
          <button onClick={() => handleShowCountry(country)}>show</button>
        </div>
      ))}
    </div>
  )
}

export default Countries