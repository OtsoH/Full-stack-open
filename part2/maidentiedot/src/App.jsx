import { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './components/search.jsx';
import Countries from './components/countries.jsx';

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

   useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <Search filter={filter} handleFilterChange={handleFilterChange} />
      <Countries countries={countries} filter={filter} />
    </div>
  )
}

export default App
